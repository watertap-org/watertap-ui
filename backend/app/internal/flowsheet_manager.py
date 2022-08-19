# stdlib
from pathlib import Path
import shutil
from typing import Optional, Dict

# third-party
from fastapi import HTTPException
from pydantic import BaseModel, validator
import tinydb  # JSON single-file 'database'

# package-local
from app.internal.settings import AppSettings
from watertap.ui.fsapi import FlowsheetInterface
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)


class FlowsheetInfo(BaseModel):
    id_: str
    name: str
    description: str

    # Make sure name is lowercase
    @validator("name")
    def normalize_name(cls, v: str, values):
        return v.lower()


class FlowsheetManager:
    """Manage the available flowsheets."""

    DIAGRAM_FILE = "graph.png"
    HISTORY_DB_FILE = "history.json"

    def __init__(self):
        self.app_settings = AppSettings()
        self._objs, self._flowsheets = {}, {}
        for package in self.app_settings.packages:
            try:
                modules = FlowsheetInterface.find(package)
            except ImportError as err:
                _log.error(f"Import error in package '{package}': {err}")
                continue
            except IOError as err:
                _log.error(f"I/O error in package '{package}': {err}")
                continue
            for module_name, obj in modules.items():
                id_ = module_name
                info = FlowsheetInfo(
                    id_=id_, name=obj.name, description=obj.description
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
        src = self.get_flowsheet_dir("fake") / self.DIAGRAM_FILE
        dst = path / self.DIAGRAM_FILE
        shutil.copyfile(src, dst)

    @property
    def flowsheets(self):
        return self._flowsheets

    def get_diagram(self, id_: str):
        _ = self[id_]  # verifies the flowsheet exists
        path = self.get_flowsheet_dir(id_) / self.DIAGRAM_FILE
        with path.open(mode="rb") as f:
            data = f.read()
        return data

    def __getitem__(self, id_: str) -> FlowsheetInterface:
        """Get flowsheet object by its identifier."""
        try:
            return self._objs[id_]
        except KeyError:
            raise HTTPException(status_code=404, detail=f"Flowsheet {id_} not found")

    def get_flowsheet_data(self, id_: str = None, name: str = None) -> Optional[Dict]:
        """Find a history item matching the flowsheet name and id, and return
           its data.

        Args:
            id_: Flowsheet ID to match
            name:  Flowsheet name to match

        Returns:
            The data if found, else None

        Raises:
            HTTPException: code 500 if there are more than one matching flowsheets
        """
        fs_q = tinydb.Query()
        items = self._histdb.search((fs_q.id_ == id_) & (fs_q.name == name))
        n = len(items)
        if n > 1:
            raise HTTPException(
                status_code=500,
                detail=f"Expected 1, but {n} flowsheets matched "
                f"id='{id_}' and name='{name}'",
            )
        if n == 0:
            return None

        return items[0]["data"]

    def put_flowsheet_data(self, id_: str = None, name: str = None, data: Dict = None):
        """Create or update the data for the flowsheet with given identifier + name.

        Args:
            id_: Flowsheet ID to match
            name:  Flowsheet name to match
            data: New data for the record

        Returns:
            None
        """
        fs_q = tinydb.Query()
        self._histdb.upsert(
            {"name": name, "id_": id_, "data": data},
            (fs_q.id_ == id_) & (fs_q.name == name),
        )


# Create a single global instance
flowsheet_manager = FlowsheetManager()
