import io
import os
import json
from pathlib import Path
import shutil

from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.internal.flowsheet.flowsheet_interfaces_handler import (
    flowsheet_interfaces_handler,
)
from app.internal.settings import AppSettings
from watertap.ui.fsapi import FlowsheetInterface
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)

router = APIRouter(
    prefix="/flowsheets",
    tags=["flowsheets"],
    responses={404: {"description": "Flowsheet not found"}},
)

# TODO: Look for settings file
app_settings = AppSettings()


class FlowsheetInfo(BaseModel):
    id_: int
    name: str
    description: str
    diagram: Path


class FlowsheetManager:
    """Manage the available flowsheets.
    """

    DIAGRAM_FILE = "graph.png"
    __instance = None  # for singleton

    def __init__(self):
        if self.__instance is not None:
            self._flowsheets, self._objs = (
                self.__instance._flowsheets,
                self.__instance._objs,
            )
            return

        self._objs, self._flowsheets, id_num = [], 0
        for package in app_settings.packages:
            try:
                modules = FlowsheetInterface.find(package)
            except ImportError as err:
                _log.error(f"Import error in package '{package}': {err}")
                continue
            except IOError as err:
                _log.error(f"I/O error in package '{package}': {err}")
                continue
            for module_name, obj in modules.items():
                info = FlowsheetInfo(
                    id_=id_num, name=obj.name, description=obj.description
                )
                self._flowsheets.append(info.dict())
                self._objs.append(obj)
                self._add_data_dir(id_num)
                id_num += 1
        self.__instance = self

    def _add_data_dir(self, i: int):
        path = app_settings.data_basedir / str(i)
        if not path.exists():
            path.mkdir()
        # TODO: remove this when we have a real way to get the diagrams
        src = app_settings.data_basedir / "fake" / self.DIAGRAM_FILE
        dst = path / self.DIAGRAM_FILE
        shutil.copyfile(src, dst)

    @property
    def flowsheets(self):
        return self._flowsheets

    def get_diagram(self, index: int):
        self[index]  # verifies the flowsheet exists
        path = app_settings.data_basedir / str(index) / self.DIAGRAM_FILE
        with path.open(mode="rb") as f:
            data = f.read()
        return data

    def __getindex__(self, index: int) -> FlowsheetInterface:
        """Get flowsheet object at index.
        """
        try:
            return self._objs[index]
        except IndexError:
            raise HTTPException(status_code=404, detail=f"Flowsheet {index} not found")


@router.get("/")
async def get_all():
    """Get basic information about all available flowsheets.

    The result of the first call is stored and returned for subsequent calls,
    without re-discovering the list of modules.
    """
    return FlowsheetManager().flowsheets


@router.get("/{flowsheet_id}/config")
async def get_config(id_: int):
    return FlowsheetManager()[id_].dict()


@router.get("/{flowsheet_id}/diagram")
async def get_diagram(flowsheet_id: int):
    data = FlowsheetManager().get_diagram(flowsheet_id)
    return StreamingResponse(io.BytesIO(data), media_type="image/png")


@router.get("/{flowsheet_id}/solve")
async def solve(flowsheet_id: int):
    obj = FlowsheetManager()[flowsheet_id]
    obj.solve()
    return obj.dict()


@router.post("/{flowsheet_id}/reset")
async def reset(flowsheet_id: int):
    obj = FlowsheetManager()[flowsheet_id]
    obj.build()
    return obj.dict()


@router.post("/{flowsheet_id}/update")
async def update(flowsheet_id: int, request: Request):
    obj = FlowsheetManager()[flowsheet_id]
    input_data = await request.json()
    try:
        obj.load(data)
    except FlowsheetInterface.MissingObjectError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    return obj.dict()

STOPPED HERE
>>>> Should we have a TinyDB for each set of saved flowsheet configurations?

@router.post("/{flowsheet_id}/saveConfig")
async def save_config(flowsheet_id: int, request: Request):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        configName = await request.json()
        history = fs.save_config(configName)
        return history
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")


@router.post("/{flowsheet_id}/download")
async def download(flowsheet_id: int, request: Request):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        data = await request.json()
        data1 = data[0]["output"]
        data2 = data[1]["output"]
        outputText = (
            "Category, Metric, Configuration 1, Configuration 2, Value Difference\n"
        )
        for category in data1:
            for metric in data1[category]:
                unit1 = data1[category][metric][1]
                unit2 = data2[category][metric][1]
                value1 = data1[category][metric][0]
                value2 = data2[category][metric][0]
                difference = round(value1 - value2, 2)

                nextLine = "{}, {}, {}, {}, {}\n".format(
                    category,
                    metric,
                    "{} {}".format(value1, unit1),
                    "{} {}".format(value2, unit2),
                    difference,
                )
                outputText += nextLine
        filePath = os.path.join(fs.data_dir, "comparison_results.csv")
        with open(filePath, "w") as f:
            f.write(outputText)
        return FileResponse(filePath)
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")
