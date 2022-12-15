# stdlib
import sys
import types
from xml.etree.ElementTree import QName

if sys.version_info < (3, 10):
    from importlib_resources import files
else:
    from importlib.resources import files
try:
    from importlib import metadata
except ImportError:
    from importlib_metadata import metadata
from pathlib import Path
import time
from types import ModuleType
from typing import Optional, Dict, List
import app

# third-party
from fastapi import HTTPException
from pydantic import BaseModel, validator
import tinydb  # JSON single-file 'database'

# package-local
from app.internal.settings import AppSettings
from watertap.ui.fsapi import FlowsheetInterface
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)
# _log.setLevel(logging.DEBUG)


class FlowsheetInfo(BaseModel):
    """Information about a flowsheet."""

    # static information
    id_: str
    name: str
    description: str = ""
    module: str = ""
    # current status of flowsheet
    built: bool = False
    ts: float = 0  # time last updated (including built)

    # Make sure name is lowercase
    @validator("name")
    def normalize_name(cls, v: str, values):
        return v.lower()

    def updated(self, built: Optional[bool] = None):
        self.ts = time.time()
        if built is not None:
            self.built = built


class FlowsheetManager:
    """Manage the available flowsheets."""

    HISTORY_DB_FILE = "history.json"

    def __init__(self, **kwargs):
        """Constructor.

        Args:
            **kwargs: Passed as keywords to :class:`AppSettings`.
        """
        self.app_settings = AppSettings(**kwargs)
        self._objs, self._flowsheets = {}, {}

        for package in self.app_settings.packages:
            _log.debug(f"Collect flowsheet interfaces from package '{package}'")
            for name, fsi in self._get_flowsheet_interfaces(package).items():
                _log.debug(f"Add flowsheet interface '{fsi.fs_exp.name}' "
                           f"for module '{name}'")
                self.add_flowsheet_interface(name, fsi)

        # Connect to history DB
        path = self.app_settings.data_basedir / self.HISTORY_DB_FILE
        self._histdb = tinydb.TinyDB(path)

    def add_flowsheet_interface(self, module_name: str, fsi: FlowsheetInterface):
        """Add a flowsheet interface associated with the given module (full dotted
        module path). This will replace any existing interface for this module.

        Side-effects:
            - A directory will be created for saving state, named after the module.
            - The module is not checked here, but when the module diagram is needed
              the path to the module determines where the associated image resource
              is located (see :meth:`get_diagram`).

        Args:
            module_name: Name of module
            fsi: FlowsheetInterface object.

        Returns:
            None
        """
        if module_name in self._flowsheets:
            _log.warning(f"Replacing existing flowsheet interface for module "
                         f"'{module_name}'")

        export = fsi.fs_exp  # exported flowsheet
        info = FlowsheetInfo(
            id_=module_name,
            name=export.name,
            description=export.description,
            module=module_name,
        )
        self._flowsheets[module_name] = info
        self._objs[module_name] = fsi
        path = self.get_flowsheet_dir(module_name)
        path.mkdir(exist_ok=True)

    def get_flowsheet_dir(self, id_: str) -> Path:
        """Get directory to read/write flowsheet-specific data.

        Args:
            id_: Flowsheet identifier

        Returns:
            Path to data directory
        """
        return self.app_settings.data_basedir / self.get_info(id_).module

    @property
    def flowsheets(self) -> List[FlowsheetInfo]:
        return list(self._flowsheets.values())

    def get_diagram(self, id_: str) -> bytes:
        """Get diagram for a given flowsheet.

        Args:
            id_: Flowsheet identifier

        Returns:
            Diagram image data, which will be empty if none is found.

        Raises:
            HTTPException: if the flowsheet itself cannot be found
        """
        data = b""
        info = self.get_info(id_)

        dot = info.module.rfind(".")
        if dot < 0:
            _log.error(f"Cannot get diagram for a package ({info.module})")
        else:
            p, m = info.module[:dot], info.module[dot + 1 :]
            try:
                data = files(p).joinpath(f"{m}.png").read_bytes()
            except (FileNotFoundError, IOError) as err:
                _log.error(f"Cannot read diagram for flowsheet '{id_}': {err}")

        return data

    def get_obj(self, id_: str) -> FlowsheetInterface:
        """Get flowsheet object by its identifier.

        Args:
            id_: Flowsheet identifier

        Returns:
              The flowsheet interface object

        Raises:
            HTTPException, if no such object
        """
        try:
            return self._objs[id_]
        except KeyError:
            raise HTTPException(status_code=404, detail=f"Flowsheet {id_} not found")

    def get_info(self, id_: str) -> FlowsheetInfo:
        """Get flowsheet status by its identifier.

        Args:
            id_: Flowsheet identifier

        Returns:
            Status of the flowsheet (part of its info)

        Raises:
            Same as :meth:`get_obj`
        """
        try:
            return self._flowsheets[id_]
        except KeyError:
            raise HTTPException(status_code=404, detail=f"Flowsheet {id_} not found")

    def get_flowsheet_data(self, id_: str = None, name: str = None) -> list:
        """Find a history item matching the flowsheet name and id, and return
           its data.

        Args:
            id_: Flowsheet ID to match
            name:  Flowsheet name to match

        Returns:
            List of found data (may be empty)

        Raises:
            HTTPException: code 500 if there are more than one matching flowsheets
        """
        query = tinydb.Query()
        items = self._histdb.search(query.fragment({"id_": id_, "name": name}))
        return [item["data"] for item in items]

    def put_flowsheet_data(
        self, id_: str = None, name: str = None, data: Dict = None, version = None
    ) -> str:
        """Create or update the data for the flowsheet with given identifier + name.

        Args:
            id_: Flowsheet ID to match
            name:  Flowsheet name to match
            data: New data for the record

        Returns:
            Exact name used in DB record
        """
        info = self.get_info(id_)
        info.ts = time.time()
        fs_q = tinydb.Query()
        _log.debug(f"Saving/replacing name='{name}' for id='{id_}'")
        if version is not None:
            _log.debug(f'saving id {id_} with version {version}')
            self._histdb.upsert(
                {"name": name, "id_": id_, "version": version, "ts": info.ts, "data": data},
                (fs_q.id_ == id_) & (fs_q.name == name),
            )
        else:
            _log.debug(f'version is none, saving {id_} without version')
            self._histdb.upsert(
                {"name": name, "id_": id_, "ts": info.ts, "data": data},
                (fs_q.id_ == id_) & (fs_q.name == name),
            )
        return name

    def delete_config(self, id_: str = None, name: str = None) -> List[str]:
        """Delete saved flowsheet config with this identifier.

        Args:
            id_: Flowsheet ID
            name: Name under which this particular configuration was saved

        Returns:
            Remaining list of config names (may be empty) for given flowsheet
        """
        query = tinydb.Query()
        _log.debug(f"Deleteing name='{name}' for id='{id_}'")
        self._histdb.remove((query.id_ == id_) & (query.name == name))
        items = self._histdb.search(query.fragment({"id_": id_}))
        return [item["name"] for item in items]

    def list_flowsheet_names(self, id_: str = None, version: int = None) -> List[str]:
        """Get a list of all flowsheet names saved for this identifier.

        Args:
            id_: Flowsheet ID to match

        Returns:
            List of names (may be empty)
        """
        query = tinydb.Query()
        if version is not None:
            _log.debug(f'searching for id {id_} with version {version}')
            items = self._histdb.search(query.fragment({"id_": id_, "version": version}))
        else:
            _log.debug(f'version is none, searching for id {id_} without version')
            items = self._histdb.search(query.fragment({"id_": id_}))
        return [item["name"] for item in items]

    def _get_flowsheet_interfaces(
        self, package_name: str
    ) -> Dict[str, FlowsheetInterface]:
        """Get all flowsheet interfaces for a package.

        This uses the importlib ``metadata.entry_points()`` function to fetch the
        list of declared flowsheets for a given package from the setup.py for this
        package.

        There is no current mechanism for discovering flowsheet interfaces from
        external packages, though :meth:`add_flowsheet_interface` can be used if
        the module containing the interface is known.

        Args:
            package_name: Package

        Returns:
            Mapping with keys the module names and values FlowsheetInterface objects
        """
        group_name = package_name + ".flowsheets"
        try:
            entry_points = metadata.entry_points()[group_name]
        except KeyError:
            _log.error(f"No interfaces found for package: {package_name}")
            return {}

        interfaces = {}
        _log.debug(f"Loading {len(list(entry_points))} entry points")
        for ep in entry_points:
            _log.debug(f"ep = {ep}")
            module_name = ep.value
            try:
                module = ep.load()
            except ImportError as err:
                _log.error(f"Cannot import module '{module_name}': {err}")
                continue
            interface = self._get_flowsheet_interface(module)
            if interface:
                interfaces[module_name] = interface

        return interfaces

    @staticmethod
    def _get_flowsheet_interface(module: ModuleType) -> Optional[FlowsheetInterface]:
        """Get a a flowsheet interface for module.

        Args:
            module: The module

        Returns:
            A flowsheet interface or None if it failed
        """

        # Get function that creates the FlowsheetInterface
        func = getattr(module, FlowsheetInterface.UI_HOOK, None)
        if func is None:
            _log.warning(
                f"Interface for module '{module}' is missing UI hook function: "
                f"{FlowsheetInterface.UI_HOOK}()"
            )
            return None
        # Call the function that creates the FlowsheetInterface
        try:
            interface = func()
        except Exception as err:
            _log.error(
                f"Cannot get FlowsheetInterface object for module '{module}': {err}"
            )
            return None
        # Return created FlowsheetInterface
        return interface


