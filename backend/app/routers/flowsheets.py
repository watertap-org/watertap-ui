"""
Handle flowsheet-related API requests from web client.
"""
# stdlib
import io
from typing import List

# third-party
from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
import pandas as pd

# package-local
from app.internal.flowsheet_manager import FlowsheetManager, FlowsheetInfo
from watertap.ui.fsapi import FlowsheetInterface, FlowsheetExport
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)

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
async def get_config(id_: str) -> FlowsheetExport:
    """Get flowsheet configuration.

    Args:
        id_: Flowsheet identifier

    Returns:
        Flowsheet export model
    """
    return flowsheet_manager[id_].fs_exp


@router.get("/{flowsheet_id}/diagram")
async def get_diagram(flowsheet_id: str):
    data = flowsheet_manager.get_diagram(flowsheet_id)
    return StreamingResponse(io.BytesIO(data), media_type="image/png")


@router.get("/{flowsheet_id}/solve", response_model=FlowsheetExport)
async def solve(flowsheet_id: str):
    flowsheet = flowsheet_manager[flowsheet_id]
    status = flowsheet_manager.get_status(flowsheet_id)
    if not status.built or status.updated:
        flowsheet.build()
        status.built, status.updated = True, False
    flowsheet.solve()
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/reset", response_model=FlowsheetExport)
async def reset(flowsheet_id: str):
    flowsheet = flowsheet_manager[flowsheet_id]
    flowsheet.build()
    status = flowsheet_manager.get_status(flowsheet_id)
    status.built, status.updated = True, False
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/update")
async def update(flowsheet_id: int, request: Request):
    obj = flowsheet_manager[flowsheet_id]
    input_data = await request.json()
    try:
        obj.load(input_data)
    except FlowsheetInterface.MissingObjectError as err:
        # this is unlikely, the model would need to change while running
        # (but could happen since 'build' and 'solve' can do anything they want)
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    return obj.dict()


@router.post("/{flowsheet_id}/save")
async def save_config(flowsheet_id: int, request: Request, name: str = "current"):
    """Save flowsheet 'config' with a name. See also :func:`load_config`.

    The query parameter 'name' is the name to save under. If no name is
    given a default name will be chosen::

        /1/save?name="good one"
        /1/save  -- use default name

    Args:
        flowsheet_id: Identifier for flowsheet (structure)
        name: Name under which to save this particular configuration

    """
    data = await request.json()
    flowsheet_manager.put_flowsheet_data(id_=flowsheet_id, name=name, data=data)


@router.get("/{flowsheet_id}/load")
async def load_config(id_: int, name: str = "current"):
    """Load and return a named flowsheet. See also :func:`save_config`.

    The name is optional. If not given it will default to the same
    default name used for :func:`save_config`.

        /1/load?name="good one"
        /1/load  -- use default name

    Args:
        id_: Identifier for flowsheet (structure)
        name: Name under which this particular configuration was saved

    Returns:
        Flowsheet contents, in standard form
    """
    data = flowsheet_manager.get_flowsheet_data(id_=id_, name=name)
    if data is None:
        raise HTTPException(404, f"Cannot find flowsheet id='{id_}' " f"name='{name}'")
    return data


@router.post("/{flowsheet_id}/download")
async def download(id_: str, request: Request):
    """Download the comparison of two solutions of the given flowsheet.

    The expected structure of the JSON data in `request` is::
        [
          // first set of outputs
          {"output": {
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
          // repeat for second set of outputs
          {"output": {
             ...
          }
        ]
       The assumption is that the categories, and metrics in each category, are
       the same for each output.

    Args:
        id_: Identifier for flowsheet
    """
    # extract data from request
    data = await request.json()
    values = data[0]["output"], data[1]["output"]

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
            except Exception:
                # don't crash if we can't subract values
                delta_v = pd.NA
            # add row
            df.loc[idx] = [catg, metric, u[0], v[0], v[1], delta_v]
            idx += 1

    # Write to file
    path = flowsheet_manager.get_flowsheet_dir(id_) / "comparison_results.csv"
    df.to_csv(path, index=False)

    # User can now download the contents of that file
    return FileResponse(path)
