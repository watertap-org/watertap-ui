# stdlib
import sys
import types
from xml.etree.ElementTree import QName
import os
import importlib

if sys.version_info < (3, 10):
    from importlib_resources import files
    importlib_old = True
else:
    from importlib.resources import files
    importlib_old = False
from importlib import metadata
from pathlib import Path
import time
from types import ModuleType
from typing import Optional, Dict, List, Union
import app

# third-party
from fastapi import HTTPException
from pydantic import BaseModel, validator, field_validator, ValidationInfo, Field
import tinydb  # JSON single-file 'database'

# package-local
from app.internal.settings import AppSettings
from watertap.ui.fsapi import FlowsheetInterface
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)
_log.setLevel(idaeslog.DEBUG)
VERSION = 3


class FlowsheetInfo(BaseModel):
    """Information about a flowsheet."""

    # static information
    id_: str
    name: str
    description: Union[None, str] = Field(default="", validate_default=True)
    module: str = ""
    build_options: dict = {}
    # current status of flowsheet
    built: bool = False
    ts: float = 0  # time last updated (including built)
    last_run: Union[str, float] = ""
    custom: bool = False

    # Make sure name is lowercase
    @field_validator("name")
    def normalize_name(cls, v: str, info: ValidationInfo):
        return v.lower()

    def updated(self, built: Optional[bool] = None):
        self.ts = time.time()
        if built is not None:
            self.built = built

    def set_last_run(self, last_run: str):
        self.last_run = last_run


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
        self.startup_time = time.time()

        # Add custom flowsheets path to the system path
        self.custom_flowsheets_path = self.app_settings.data_basedir / "custom_flowsheets"
        sys.path.append(str(self.custom_flowsheets_path))

        for package in self.app_settings.packages:
            _log.debug(f"Collect flowsheet interfaces from package '{package}'")
            for name, fsi in self._get_flowsheet_interfaces(package).items():
                _log.debug(
                    f"Add flowsheet interface '{fsi.fs_exp.name}' "
                    f"for module '{name}'"
                )
                # _log.info(f'adding flowsheet with name: {name} and fsi: {fsi}')
                self.add_flowsheet_interface(name, fsi)

        # Search for and add user uploaded flowsheets
        self.add_custom_flowsheets()

        # Connect to history DB
        path = self.app_settings.data_basedir / self.HISTORY_DB_FILE
        self._histdb = tinydb.TinyDB(path)

        # check for (and set if necessary) the last_run dictionary
        query = tinydb.Query()
        last_run_dict = self._histdb.search(
            query.fragment({"last_run_dict_version": VERSION})
        )
        if len(last_run_dict) == 0:
            _log.debug("setting last run dictionary")
            last_run_dict = {}
            flowsheet_list = self._flowsheets.values()
            for each in flowsheet_list:
                last_run_dict[each.id_] = ""
            self._histdb.upsert(
                {"last_run_dict_version": VERSION, "last_run_dict": last_run_dict},
                (query.last_run_dict_version == VERSION),
            )
        else:
            _log.debug("found last run dictionary")
            last_run_dict = last_run_dict[0]["last_run_dict"]
            flowsheet_list = self._flowsheets.values()
            for each in flowsheet_list:
                if not each.id_ in last_run_dict:
                    last_run_dict[each.id_] = ""
            self._histdb.upsert(
                {"last_run_dict_version": VERSION, "last_run_dict": last_run_dict},
                (query.last_run_dict_version == VERSION),
            )

    def add_flowsheet_interface(
        self, module_name: str, fsi: FlowsheetInterface, custom: bool = False
    ):
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
            _log.warning(
                f"Replacing existing flowsheet interface for module " f"'{module_name}'"
            )

        export = fsi.fs_exp  # exported flowsheet
        info = FlowsheetInfo(
            id_=module_name,
            name=export.name,
            description=export.description,
            module=module_name,
            custom=custom,
            build_options=export.build_options,
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

        # check if get_diagram function was provided by export
        flowsheet = self.get_obj(id_)
        try:
            img_name = flowsheet.get_diagram(
                build_options=flowsheet.fs_exp.build_options
            )
        except:
            img_name = None

        data = b""
        info = self.get_info(id_)
        # _log.info(f"inside get diagram:: info is - {info}")
        if info.custom:
            # do this
            data_path = (
                self.app_settings.custom_flowsheets_dir / f"{info.id_}.png"
            )
            data = data_path.read_bytes()

        else:
            dot = info.module.rfind(".")
            if dot < 0:
                _log.error(f"Cannot get diagram for a package ({info.module})")
            else:
                p, m = info.module[:dot], info.module[dot + 1 :]
                try:
                    data = files(p).joinpath(f"{m}.png").read_bytes()
                except (FileNotFoundError, IOError) as err:
                    _log.error(f"Cannot read diagram for flowsheet '{id_}': {err}")

            p, m = info.module[:dot], info.module[dot + 1 :]
            try:
                if img_name is not None:  # export provided diagram name
                    data = files(p).joinpath(img_name).read_bytes()
                else:  # export did not provide diagram. check for image with same name as export:
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
        self, id_: str = None, name: str = None, data: Dict = None, version=None
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
        print(f"Saving/replacing name='{name}' for id='{id_}'")
        if version is not None:
            _log.debug(f"saving id {id_} with version {version}")
            try:
                self._histdb.upsert(
                    {
                        "name": name,
                        "id_": id_,
                        "version": version,
                        "ts": info.ts,
                        "data": data,
                    },
                    (fs_q.id_ == id_) & (fs_q.name == name),
                )
            except:
                self._histdb.upsert(
                    {
                        "name": name,
                        "id_": id_,
                        "version": version,
                        "ts": info.ts,
                        "data": data,
                    },
                    (fs_q.id_ == id_) & (fs_q.name == name),
                )
        else:
            _log.debug(f"version is none, saving {id_} without version")
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
            _log.debug(f"searching for id {id_} with version {version}")
            items = self._histdb.search(
                query.fragment({"id_": id_, "version": version})
            )
        else:
            _log.debug(f"version is none, searching for id {id_} without version")
            items = self._histdb.search(query.fragment({"id_": id_}))
        return [item["name"] for item in items]

    def get_last_run(self, id_: str = None) -> str:
        query = tinydb.Query()
        last_run_dict = self._histdb.search(
            query.fragment({"last_run_dict_version": VERSION})
        )
        if len(last_run_dict) > 0:
            last_run_dict = last_run_dict[0]["last_run_dict"]
            try:
                last_run = last_run_dict[id_]
            except Exception as e:
                _log.error("unable to access last run dictionary")
                last_run = ""
        else:
            _log.error("unable to access last run dictionary")
            last_run = ""
        return last_run

    def set_last_run(self, id_: str = None) -> dict:
        _log.debug(f"setting last run for id='{id_}' with version {VERSION}")
        query = tinydb.Query()
        last_run_dict = self._histdb.search(
            query.fragment({"last_run_dict_version": VERSION})
        )
        if len(last_run_dict) > 0:
            last_run_dict = last_run_dict[0]["last_run_dict"]
            curr_date = time.time()
            last_run_dict[id_] = curr_date
            self._histdb.upsert(
                {"last_run_dict_version": VERSION, "last_run_dict": last_run_dict},
                (query.last_run_dict_version == VERSION),
            )
        else:
            _log.error("unable to access last run dictionary")

        return last_run_dict

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
        # Find the entry points for the package
        eps = metadata.entry_points
        project_pkg = package_name + ".flowsheets"
        if importlib_old:
            try:
                pkg_eps = eps()[project_pkg]  # old Python <= 3.9
            except KeyError:
                pkg_eps = []
        else:
            pkg_eps = eps(group=project_pkg)  # new Python >= 3.10

        # If none are found print an erorr and abort
        if not pkg_eps:
            _log.error(f"No entry points found for package {project_pkg}")
            return {}

        interfaces = {}
        _log.debug(f"Loading {len(list(pkg_eps))} entry points")
        for ep in pkg_eps:
            _log.debug(f"flowsheet-entry-point={ep}")
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

    def add_custom_flowsheet(self, new_files, new_id):
        """Add new custom flowsheet to the mini db."""
        ## TODO: make sure that uploaded files are valid modules
        for f in new_files:
            if "_ui.py" in f:
                module_name = f.replace(".py", "")
                try:
                    importlib.import_module(module_name)
                except Exception as e:
                    _log.info(f"unable to import module: {e}")
                    self.remove_custom_flowsheet_files(new_files)
                    return e

        query = tinydb.Query()
        try:
            
            custom_flowsheets_dict = self._histdb.search(
                query.fragment({"custom_flowsheets_version": VERSION})
            )
            if len(custom_flowsheets_dict) == 0:
                _log.error("unable to find custom flowsheets dictionary")
                custom_flowsheets_dict = {}
            else:
                custom_flowsheets_dict = custom_flowsheets_dict[0][
                    "custom_flowsheets_dict"
                ]
        except Exception as e:
            _log.error(f"error trying to find custom flowsheets dictionary: {e}")
            _log.error(f"setting it as empty dictionary")
            custom_flowsheets_dict = {}
        custom_flowsheets_dict[new_id] = new_files

        self._histdb.upsert(
            {
                "custom_flowsheets_version": VERSION,
                "custom_flowsheets_dict": custom_flowsheets_dict,
            },
            (query.custom_flowsheets_version == VERSION),
        )

        self.add_custom_flowsheets()
        return "success"

    def remove_custom_flowsheet(self, id_):
        """Remove a custom flowsheet from the mini db."""
        query = tinydb.Query()
        try:
            custom_flowsheets_dict = self._histdb.search(
                query.fragment({"custom_flowsheets_version": VERSION})
            )
            if len(custom_flowsheets_dict) == 0:
                _log.error("unable to find custom flowsheets dictionary")
                custom_flowsheets_dict = {}
            else:
                custom_flowsheets_dict = custom_flowsheets_dict[0][
                    "custom_flowsheets_dict"
                ]
        except Exception as e:
            _log.error(f"error trying to find custom flowsheets dictionary: {e}")
            _log.error(f"setting it as empty dictionary")
            custom_flowsheets_dict = {}

        # remove each file
        flowsheet_files = custom_flowsheets_dict[id_]
        self.remove_custom_flowsheet_files(flowsheet_files)
        # for flowsheet_file in flowsheet_files:
        #     flowsheet_file_path = self.custom_flowsheets_path / flowsheet_file
        #     _log.info(f"flowsheet file path: {flowsheet_file_path}")
        #     if os.path.isfile(flowsheet_file_path):
        #         _log.info(f"removing file: {flowsheet_file_path}")
        #         os.remove(flowsheet_file_path)

        # delete from DB
        try:
            del custom_flowsheets_dict[id_]
        except Exception as e:
            _log.info(f"unable to delete {id_} from custom flowsheets dictionary")
        self._histdb.upsert(
            {
                "custom_flowsheets_version": VERSION,
                "custom_flowsheets_dict": custom_flowsheets_dict,
            },
            (query.custom_flowsheets_version == VERSION),
        )

        # remove from flowsheets list
        try:
            del self._flowsheets[id_]
        except Exception as e:
            _log.info(f"unable to delete {id_} from flowsheets list")

        self.add_custom_flowsheets()
    
    def remove_custom_flowsheet_files(self, flowsheet_files):
        # remove each file
        for flowsheet_file in flowsheet_files:
            flowsheet_file_path = self.custom_flowsheets_path / flowsheet_file
            _log.info(f"flowsheet file path: {flowsheet_file_path}")
            if os.path.isfile(flowsheet_file_path):
                _log.info(f"removing file: {flowsheet_file_path}")
                os.remove(flowsheet_file_path)
        return

    def add_custom_flowsheets(self):
        """Search for user uploaded flowsheets. If found, add them as flowsheet interfaces."""
        files = []
        for _, _, filenames in os.walk(self.custom_flowsheets_path):
            files.extend(filenames)
            break

        for f in files:
            if "_ui.py" in f:
                try:
                    _log.info(f"adding imported flowsheet module: {f}")
                    module_name = f.replace(".py", "")
                    custom_module = importlib.import_module(module_name)
                    fsi = self._get_flowsheet_interface(custom_module)
                    self.add_flowsheet_interface(module_name, fsi, custom=True)
                except Exception as e:
                    _log.error(f"unable to add flowsheet module: {e}")

    def get_number_of_subprocesses(self):
        # _log.info(f'getting number of subprocesses')
        maxNumberOfSubprocesses = 8
        query = tinydb.Query()
        item = self._histdb.search(query.fragment({"version": VERSION, "name": "numberOfSubprocesses"}))
        # _log.info(f'item is : {item}')
        if len(item) == 0:
            # _log.info(f'setting number of subprocesses to be 1')
            currentNumberOfSubprocesses = 1
            self._histdb.upsert(
                {
                    "version": VERSION,
                    "name": "numberOfSubprocesses",
                    "value": currentNumberOfSubprocesses
                },
                (query.version == VERSION and query.name == "numberOfSubprocesses"),
            )
        else:
            currentNumberOfSubprocesses = item[0]["value"]
            # _log.info(f'number of subprocesses is: {currentNumberOfSubprocesses}')
        return currentNumberOfSubprocesses, maxNumberOfSubprocesses
    
    def set_number_of_subprocesses(self, value):
        # _log.info(f'setting number of subprocesses to {value}')
        query = tinydb.Query()
        self._histdb.upsert(
            {
                "version": VERSION,
                "name": "numberOfSubprocesses",
                "value": value
            },
            (query.version == VERSION and query.name == "numberOfSubprocesses"),
        )
        return value

    def get_logs_path(self):
        """Return logs path."""
        return self.app_settings.log_dir / "nawi-ui_backend_logs.log"

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
