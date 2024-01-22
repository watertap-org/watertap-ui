"""
Handle flowsheet-related API requests from web client.
"""
# stdlib
import time
import io
import aiofiles
from pathlib import Path
from typing import List

# third-party
from fastapi import Request, APIRouter, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
import pandas as pd
from pydantic import BaseModel
from pydantic.error_wrappers import ValidationError
import re

# package-local
from app.internal.flowsheet_manager import FlowsheetManager, FlowsheetInfo
from app.internal.parameter_sweep import run_parameter_sweep
from watertap.ui.fsapi import FlowsheetInterface, FlowsheetExport
import idaes.logger as idaeslog

CURRENT = "current"

_log = idaeslog.getLogger(__name__)
_solver_log = idaeslog.getLogger(__name__+'.solver')

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
    flowsheet_list = flowsheet_manager.flowsheets
    for each in flowsheet_list:
        # gotta fetch last run for each from tiny db
        each.set_last_run(flowsheet_manager.get_last_run(each.id_))
    return flowsheet_list


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
        flowsheet.build(build_options=flowsheet.fs_exp.build_options)
        info.updated(built=True)
    return flowsheet.fs_exp


@router.post("/{id_}/select_option", response_model=FlowsheetExport)
async def select_option(id_: str, request: Request) -> FlowsheetExport:
    """Get flowsheet configuration.

    Args:
        id_: Flowsheet identifier
        option_name: name of option to select

    Returns:
        Flowsheet export model
    """
    req = await request.json()
    # input_data = req["input_data"]
    option_name = req["option_name"]
    new_option = req["new_option"]

    flowsheet = flowsheet_manager.get_obj(id_)
    flowsheet.select_option(option_name, new_option)
    return flowsheet.fs_exp


@router.get("/{flowsheet_id}/diagram")
async def get_diagram(flowsheet_id: str):
    data = flowsheet_manager.get_diagram(flowsheet_id)
    return StreamingResponse(io.BytesIO(data), media_type="image/png")


@router.post("/{flowsheet_id}/solve", response_model=FlowsheetExport)
async def solve(flowsheet_id: str, request: Request):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    info = flowsheet_manager.get_info(flowsheet_id)

    # update input data before running a solve
    input_data = await request.json()
    try:
        flowsheet.load(input_data)
        _log.info(f"Loading new data into flowsheet '{flowsheet_id}'")
    except FlowsheetInterface.MissingObjectError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    except ValidationError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        raise HTTPException(
            400,
            f"Cannot update flowsheet id='{flowsheet_id}' due to invalid data input",
        )
    flowsheet_manager.get_info(flowsheet_id).updated()

    # ensure flowsheet is built
    if not info.built:
        try:
            flowsheet.build(build_options=flowsheet.fs_exp.build_options)
        except Exception as err:
            raise HTTPException(500, detail=f"Build failed: {err}")
        info.updated(built=True)

    # run solve
    try:
        with idaeslog.solver_log(_log, level=idaeslog.INFO) as slc:
            flowsheet.solve()
        # set last run in tiny db
        flowsheet_manager.set_last_run(info.id_)
    except Exception as err:
        _log.error(f"Solve failed: {err}")
        raise HTTPException(500, detail=f"Solve failed: {err}")
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/sweep", response_model=FlowsheetExport)
async def sweep(flowsheet_id: str, request: Request):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    info = flowsheet_manager.get_info(flowsheet_id)

    # update input data before running a sweep
    input_data = await request.json()
    try:
        flowsheet.load(input_data)
        _log.info(f"Loading new data into flowsheet '{flowsheet_id}'")
    except FlowsheetInterface.MissingObjectError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    except ValidationError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        raise HTTPException(
            400,
            f"Cannot update flowsheet id='{flowsheet_id}' due to invalid data input",
        )
    flowsheet_manager.get_info(flowsheet_id).updated()

    if not info.built:
        try:
            flowsheet.build(build_options=flowsheet.fs_exp.build_options)
        except Exception as err:
            raise HTTPException(500, detail=f"Build failed: {err}")
        info.updated(built=True)

    _log.info("trying to sweep")
    results_table = run_parameter_sweep(
        flowsheet=flowsheet,
        info=info,
    )
    flowsheet.fs_exp.sweep_results = results_table
    # set last run in tiny db
    flowsheet_manager.set_last_run(info.id_)

    return flowsheet.fs_exp


@router.get("/{flowsheet_id}/reset", response_model=FlowsheetExport)
async def reset(flowsheet_id: str):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    flowsheet.build(build_options=flowsheet.fs_exp.build_options)
    flowsheet_manager.get_info(flowsheet_id).updated(built=True)
    return flowsheet.fs_exp


@router.get("/{flowsheet_id}/unbuild", response_model=FlowsheetExport)
async def unbuild_config(flowsheet_id: str):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)

    ## reset everything:
    fs_exp = flowsheet.fs_exp
    fs_exp.m = None
    fs_exp.obj = None
    fs_exp.model_objects = {}
    fs_exp.dof = 0
    fs_exp.sweep_results = {}
    fs_exp.build_options = {}
    flowsheet_manager.get_info(flowsheet_id).updated(built=False)

    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/update", response_model=FlowsheetExport)
async def update(flowsheet_id: str, request: Request):
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    input_data = await request.json()
    try:
        flowsheet.load(input_data)
        _log.info(f"Loading new data into flowsheet '{flowsheet_id}'")
    except FlowsheetInterface.MissingObjectError as err:
        # this is unlikely, the model would need to change while running
        # (but could happen since 'build' and 'solve' can do anything they want)
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        # XXX: return something about the error to caller
    except ValidationError as err:
        _log.error(f"Loading new data into flowsheet {flowsheet_id} failed: {err}")
        raise HTTPException(
            400,
            f"Cannot update flowsheet id='{flowsheet_id}' due to invalid data input",
        )
    flowsheet_manager.get_info(flowsheet_id).updated()
    return flowsheet.fs_exp


@router.post("/{flowsheet_id}/save")
async def save_config(
    flowsheet_id: str, request: Request, version: int, name: str = CURRENT
) -> str:
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
    name = flowsheet_manager.put_flowsheet_data(
        id_=flowsheet_id, name=name, data=data, version=version
    )
    return name


@router.post("/upload_flowsheet")
async def upload_flowsheet(files: List[UploadFile]) -> str:
    """Upload a new flowsheet`.

    Request should contain a model file, an export file, a diagram file, and optional data files.

    Args:
        request: Request object

    Returns:
        Updated flowsheet list
    """
    custom_flowsheets_path = Path.home() / ".watertap" / "custom_flowsheets"
    try:
        # get file contents
        new_files = []

        print("trying to read files with aiofiles")
        for file in files:
            # for file in files:
            print(file.filename)
            new_files.append(file.filename)
            if "_ui.py" in file.filename:
                new_id = file.filename.replace(".py", "")
            async with aiofiles.open(
                f"{str(custom_flowsheets_path)}/{file.filename}", "wb"
            ) as out_file:
                content = await file.read()  # async read
                await out_file.write(content)
        flowsheet_manager.add_custom_flowsheet(new_files, new_id)
        return {"return": "success boy"}

    except Exception as e:
        _log.error(f"error on file upload: {str(e)}")
        raise HTTPException(400, detail=f"File upload failed: {e}")


@router.post("/{flowsheet_id}/remove_flowsheet")
async def remove_flowsheet(flowsheet_id: str):
    try:
        flowsheet_manager.remove_custom_flowsheet(flowsheet_id)
        return {"return": "success boy"}
    except Exception as e:
        _log.error(f"error on flowsheet deletion: {str(e)}")
        raise HTTPException(400, detail=f"failed: {e}")


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
async def list_config_names(flowsheet_id: str, version: int) -> List[str]:
    """Get names of all currently saved configs for a given flowsheet.

    Args:
        flowsheet_id: Identifier for flowsheet (structure)

    Returns:
        List of names (may be empty)
    """
    result = flowsheet_manager.list_flowsheet_names(flowsheet_id, version)
    return result


@router.get("/{flowsheet_id}/delete")
async def delete(flowsheet_id: str, name: str) -> List[str]:
    """Delete given flowsheet configuration from tinydb.

    Args:
        flowsheet_id: Identifier for flowsheet (structure)
        name: Name under which this particular configuration was saved

    Returns:
        Remaining ist of config names (may be empty) for given flowsheet identifier
    """
    try:
        result = flowsheet_manager.delete_config(flowsheet_id, name)
        return result
    except:
        raise HTTPException(404, f"Cannot find flowsheet id='{flowsheet_id}'")


@router.post("/{flowsheet_id}/downloadOutput", response_class=FileResponse)
async def download_single_output(flowsheet_id: str, request: Request) -> Path:
    """Download a single solution for the given flowsheet.

    Args:
        flowsheet_id: Identifier for flowsheet
        request: Request object with data in JSON form given above

    Returns:
        File to download (path converted to FileResponse by FastAPI)
    """
    # extract data from request
    data = await request.json()
    columns = data["headers"]
    table = data["values"]

    df = pd.DataFrame(table, columns=columns)

    # Write to file
    path = flowsheet_manager.get_flowsheet_dir(flowsheet_id) / "output_results.csv"
    df.to_csv(path, index=False)
    # # User can now download the contents of that file
    return path


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


@router.get("/{flowsheet_id}/download_sweep", response_class=FileResponse)
async def download_sweep(flowsheet_id: str) -> Path:
    """Download sweep results.

    Args:
        flowsheet_id: Identifier for flowsheet

    Returns:
        File to download (path converted to FileResponse by FastAPI)
    """
    flowsheet = flowsheet_manager.get_obj(flowsheet_id)
    sweep_results = flowsheet.fs_exp.sweep_results
    columns = sweep_results["headers"]
    table = sweep_results["values"]
    df = pd.DataFrame(table, columns=columns)

    # Write to file
    path = flowsheet_manager.get_flowsheet_dir(flowsheet_id) / "sweep_results.csv"
    df.to_csv(path, index=False)
    # # User can now download the contents of that file
    return path

@router.get("/get_logs")
async def get_logs() -> List[str]:
    """Get backend logs.

    Returns:
        Logs formatted as a list
    """
    result = []
    log_entries = []
    logs_path = flowsheet_manager.get_logs_path() / "ui_backend_logs.log"
    log_file = open(logs_path, 'r')
    all_logs = log_file.read()
    logs = all_logs.split('\n[')
    for line in logs:
        log_split = line.split(' ')
        log_time = log_split[1:3]
        log_time_string = f'{log_time[0]} {log_time[1]}'.split(',')[0]
        stripped_time = time.strptime(log_time_string, "%Y-%m-%d %H:%M:%S")
        asctime = time.mktime(stripped_time)
        if asctime > flowsheet_manager.startup_time:
            result.append(line)

            
            log_level = line.split(']')[0]
            log_name = log_split[3]
            log_file_lineno = log_split[4]
            log_file = log_file_lineno.split(":")[0]
            log_lineno = log_file_lineno.split(":")[1]
            log_message = line.split(log_file_lineno)[1]
            if len(log_file) > 0:
                log_file = log_file[1:]
            if len(log_lineno) > 0:
                log_lineno = log_lineno[:-1]
            if len(log_message) > 0:
                log_message = log_message[1:]
            log_entry = {
                "log_time": asctime,
                "log_level": log_level,
                "log_name": log_name,
                "log_file": log_file,
                "log_lineno": log_lineno,
                "log_message": log_message,
            }
            log_entries.append(log_entry)
        # print(f'asctime: {asctime}')
        # break
    # print(f'log_entries: {log_entries}')
    # logLevelRegex = "(\[^DEBUG$|^INFO$|^WARNING$|^ERROR$\])"
    # logLevelRegex = "(?:\[(DEBUG)|(INFO)|(WARNING)|(ERROR)\])"
    # logLevelRegex = r"(\[(?:DEBUG|INFO|WARNING|ERROR)\])"
    # split_logs = re.split(logLevelRegex, all_logs)
    # logLevelRegex = r"^\[(?:DEBUG|INFO|WARNING|ERROR)].*"
    # split_logs = re.findall(logLevelRegex, all_logs, re.M)
    # for line in split_logs:
    #     log_time = line.split(' ')[1:3]
    #     log_time_string = f'{log_time[0]} {log_time[1]}'.split(',')[0]
    #     stripped_time = time.strptime(log_time_string, "%Y-%m-%d %H:%M:%S")
    #     asctime = time.mktime(stripped_time)
    #     if asctime > flowsheet_manager.startup_time:
    #         result.append(line)

    return log_entries

@router.post("/download_logs", response_class=FileResponse)
async def download_logs() -> Path:
    """Download full backend logs.

    Returns:
        Log file
    """
    _log.info('DOWNLOADING LOGS')
    path = Path.home() / ".watertap" / "logs" / "ui_backend_logs.log"
    return path