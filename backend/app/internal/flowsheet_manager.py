# stdlib
from pathlib import Path
import shutil
import time
from typing import Optional, Dict, List
import logging
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
_log.setLevel(logging.DEBUG)

class FlowsheetInfo(BaseModel):
    """Information about a flowsheet."""
    # static information
    id_: str
    name: str
    description: str = ""
    # current status of flowsheet
    built: bool = False
    updated: float = 0  # time last updated (including built)

    # Make sure name is lowercase
    @validator("name")
    def normalize_name(cls, v: str, values):
        return v.lower()

    def set_built(self):
        """Call this after (re)building the flowsheet."""
        self.built = True
        self.updated = time.time()

    def set_updated(self):
        """Call this after updating values in the flowsheet."""
        self.updated = time.time()


class FlowsheetManager:
    """Manage the available flowsheets."""

    DIAGRAM_FILE = "graph.png"
    HISTORY_DB_FILE = "history.json"

    def __init__(self, **kwargs):
        """Constructor.

        Args:
            **kwargs: Passed as keywords to :class:`AppSettings`.
        """
        self.app_settings = AppSettings(**kwargs)
        self.app_settings.create_data_basedir()
        self._objs, self._flowsheets = {}, {}
        for package in self.app_settings.packages:
            _log.debug(f"Collect flowsheet interfaces from package '{package}'")
            try:
                modules = FlowsheetInterface.find(package)
            except ImportError as err:
                _log.error(f"Import error in package '{package}': {err}")
                continue
            except IOError as err:
                _log.error(f"I/O error in package '{package}': {err}")
                continue
            for module_name, obj in modules.items():
                _log.debug(f"Create flowsheet interface for module '{module_name}'")
                id_ = module_name
                export = obj.fs_exp  # exported flowsheet
                info = FlowsheetInfo(
                    id_=id_, name=export.name, description=export.description
                )
                self._flowsheets[id_] = info
                self._objs[id_] = obj
                self._add_data_dir(id_)

        # Connect to history DB
        path = self.app_settings.data_basedir / self.HISTORY_DB_FILE
        self._histdb = tinydb.TinyDB(path)

    def get_flowsheet_dir(self, id_: str) -> Path:
        """Get directory to read/write flowsheet-specific data.

        Args:
            id_: Flowsheet identifier

        Returns:
            Path to data directory
        """
        # replace non-alphanumeric chars with underscore
        id_filename = str(id_)
        return self.app_settings.data_basedir / id_filename

    def _add_data_dir(self, id_: str):
        path = self.get_flowsheet_dir(id_)
        if not path.exists():
            path.mkdir()
        # XXX: remove this when we have a real way to get the diagrams
        # src = self.get_flowsheet_dir("fake") / self.DIAGRAM_FILE
        try:
            _log.info('trying to get graph png from first src')
            src = Path(app.__file__).parent.parent / "data" / "flowsheets" / "fake" / self.DIAGRAM_FILE
            dst = path / self.DIAGRAM_FILE
            _log.info(f'moving diagram from {src} to {dst}')
            shutil.copyfile(src, dst)
        except:
            _log.info('trying to get graph png from second src')
            src = Path(app.__file__) / "data" / "flowsheets" / "fake" / self.DIAGRAM_FILE
            dst = path / self.DIAGRAM_FILE
            _log.info(f'moving diagram from {src} to {dst}')
            shutil.copyfile(src, dst)

    @property
    def flowsheets(self) -> List[FlowsheetInfo]:
        return list(self._flowsheets.values())

    def get_diagram(self, id_: str):
        _ = self.get_obj(id_)  # verifies the flowsheet exists
        path = self.get_flowsheet_dir(id_) / self.DIAGRAM_FILE
        with path.open(mode="rb") as f:
            data = f.read()
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
        self, id_: str = None, name: str = None, data: Dict = None
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
        fs_q = tinydb.Query()
        _log.debug(f"Saving/replacing name='{name}' for id='{id_}'")
        self._histdb.upsert(
            {"name": name, "id_": id_, "ts": info.updated, "data": data},
            (fs_q.id_ == id_) & (fs_q.name == name),
        )
        return name

    def list_flowsheet_names(self, id_: str = None) -> list[str]:
        """Get a list of all flowsheet names saved for this identifier.

        Args:
            id_: Flowsheet ID to match

        Returns:
            List of names (may be empty)
        """
        query = tinydb.Query()
        items = self._histdb.search(query.fragment({"id_": id_}))
        return [item["name"] for item in items]
