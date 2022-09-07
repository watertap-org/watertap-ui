"""
Handle flowsheet-related API requests from web client.
"""
# stdlib
import csv
import io
from pathlib import Path
from typing import List
import logging
# third-party
from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
import pandas as pd
from pydantic import BaseModel
from pydantic.error_wrappers import ValidationError

# package-local
from app.internal.flowsheet_manager import FlowsheetManager, FlowsheetInfo
from watertap.ui.fsapi import FlowsheetInterface, FlowsheetExport
import idaes.logger as idaeslog

CURRENT = "current"

_log = idaeslog.getLogger(__name__)
_log.setLevel(logging.DEBUG)
router = APIRouter(
    prefix="/flowsheets",
    tags=["flowsheets"],
    responses={404: {"description": "Flowsheet not found"}},
)

flowsheet_manager = FlowsheetManager()


@router.get("/", response_model=List[FlowsheetInfo])
async def get_all():
    """Get basic information about all available flowsheets.

    The result of the first call is stored and returned for subsequent calls,
    without re-discovering the list of modules.
    """
    return flowsheet_manager.flowsheets


@router.get("/{id_}/config", response_model=FlowsheetExport)
async def get_config(id_: str, build: str = "0") -> FlowsheetExport:
    """Get flowsheet configuration.

    Args:
        id_: Flowsheet identifier
        build: If true, make sure model is built before returning

    Returns:
        Flowsheet export model
    """
    flowsheet = flowsheet_manager.get_obj(id_)
    if build == "1":
        info = flowsheet_manager.get_info(id_)
        if not info.built:
            flowsheet.build()
            info.updated(built=True)
    return flowsheet.fs_exp


@router.get("/{flowsheet_id}/diagram")
async def get_diagram(flowsheet_id: str):
    data = flowsheet_manager.get_diagram(flowsheet_id)
    return StreamingResponse(io.BytesIO(data), media_type="image/png")


@router.get("/{flowsheet_id}/solve", response_model=FlowsheetExport)
async def solve(flowsheet_id: str):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    info = flowsheet_manager.get_info(flowsheet_id)
    if not info.built:
        try:
            flowsheet.build()
        except Exception as err:
            raise HTTPException(500, detail=f"Build failed: {err}")
        info.updated(built=True)
    try:
        flowsheet.solve()
    except Exception as err:
        raise HTTPException(500, detail=f"Solve failed: {err}")
    return flowsheet.fs_exp


@router.get("/{flowsheet_id}/reset", response_model=FlowsheetExport)
async def reset(flowsheet_id: str):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    flowsheet.build()
    flowsheet_manager.get_info(flowsheet_id).updated(built=True)
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/update", response_model=FlowsheetExport)
async def update(flowsheet_id: str, request: Request):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    input_data = await request.json()
    try:
        flowsheet.load(input_data)
        _log.debug(f"Loading new data {input_data} into flowsheet {flowsheet_id}")
    except FlowsheetInterface.MissingObjectError as err:
        # this is unlikely, the model would need to change while running
        # (but could happen since 'build' and 'solve' can do anything they want)
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    except ValidationError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        raise HTTPException(
            400, f"Cannot update flowsheet id='{flowsheet_id}' due to invalid data input"
        )
    flowsheet_manager.get_info(flowsheet_id).updated()
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/save")
async def save_config(flowsheet_id: str, request: Request, name: str = CURRENT) -> str:
    """Save flowsheet 'config' with a name. See also :func:`load_config`.

    The query parameter 'name' is the name to save under. If no name is
    given a default name will be chosen::

        /1/save?name="good one"
        /1/save  -- use default name

    Args:
        flowsheet_id: Identifier for flowsheet (structure)
        request: Request object
        name: Name under which to save this particular configuration

    Returns:
        name used to save record
    """
    data = await request.json()
    name = flowsheet_manager.put_flowsheet_data(id_=flowsheet_id, name=name, data=data)
    return name


@router.get("/{flowsheet_id}/load")
async def load_config(flowsheet_id: str, name: str = CURRENT):
    """Load and return a named flowsheet. See also :func:`save_config`.

    The name is optional. If not given it will default to the same
    default name used for :func:`save_config`.

        /1/load?name="good one"
        /1/load  -- use default name

    Args:
        flowsheet_id: Identifier for flowsheet (structure)
        name: Name under which this particular configuration was saved

    Returns:
        Flowsheet contents, in standard form
    """
    result = flowsheet_manager.get_flowsheet_data(id_=flowsheet_id, name=name)
    if not result:
        raise HTTPException(
            404, f"Cannot find flowsheet id='{flowsheet_id}', name='{name}'"
        )
    elif len(result) > 1:
        n = len(result)
        raise HTTPException(
            404, f"Found {n} flowsheets for id='{flowsheet_id}', name='{name}'"
        )
    return result[0]


@router.get("/{flowsheet_id}/list")
async def list_config_names(flowsheet_id: str) -> List[str]:
    """Get names of all currently saved configs for a given flowsheet.

    Args:
        flowsheet_id: Identifier for flowsheet (structure)

    Returns:
        List of names (may be empty)
    """
    result = flowsheet_manager.list_flowsheet_names(flowsheet_id)
    return result


@router.post("/{flowsheet_id}/download", response_class=FileResponse)
async def download(flowsheet_id: str, request: Request) -> Path:
    """Download the comparison of two solutions of the given flowsheet.

    The expected structure of the JSON data in ``request`` is::

        { "values":
            [
              // first set of values
              {
                 "<category-name-1>": {
                   "<metric-name-1>": [<value>, "<units>"],
                   "<metric-name-2>": [<value>, "<units>"],
                   ...
                }
                 "<category-name-2>": {
                   "<metric-name-1>": [<value>, "<units>"],
                   "<metric-name-2>": [<value>, "<units>"],
                   ...
                },
                ...
              },
              // repeat for second set of values
              {
               ...
               }
            ]
        }

   The assumption is that the categories, and metrics in each category, are
   the same for each output.

    Args:
        flowsheet_id: Identifier for flowsheet
        request: Request object with data in JSON form given above

    Returns:
        File to download (path converted to FileResponse by FastAPI)
    """
    # extract data from request
    data = await request.json()
    values = data["values"]

    # build dataframe for export
    df = pd.DataFrame({}, columns=["category", "metric", "units", "v1", "v2", "v1-v2"])
    idx, first_value = 0, values[0]
    for catg in first_value:
        for metric in first_value[catg]:
            v = [values[i][catg][metric][0] for i in (0, 1)]
            u = [values[i][catg][metric][1] for i in (0, 1)]
            # assume units match
            assert u[0] == u[1]  # front-end should guarantee this
            try:
                delta_v = v[0] - v[1]
            except (TypeError, ValueError):
                # don't crash if we can't subtract values
                delta_v = "NA"
            # add row to dataframe
            df.loc[idx] = [catg, metric, u[0], v[0], v[1], delta_v]
            idx += 1

    # Write to file
    path = flowsheet_manager.get_flowsheet_dir(flowsheet_id) / "comparison_results.csv"
    df.to_csv(path, index=False)

    # User can now download the contents of that file
    return path
