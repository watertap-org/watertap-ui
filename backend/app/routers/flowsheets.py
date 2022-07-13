import io
import os
from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse

from app.internal.flowsheet.flowsheet_interfaces_handler import (
    flowsheet_interfaces_handler,
)

from watertap.ui.api import find_flowsheet_interfaces, WorkflowActions

router = APIRouter(
    prefix="/flowsheets",
    tags=["flowsheets"],
    responses={404: {"description": "Flowsheet not found"}},
)

@router.get("/")
async def get_all():
    return flowsheet_interfaces_handler.get_list()


@router.get("/{flowsheet_id}/config")
async def get_config(flowsheet_id: int):
    try:
        fs = fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        config = fs.get_flowsheet_json()
        fs_title = config['blocks']['fs']['display_name']
        return config
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")


@router.get("/{flowsheet_id}/graph")
async def get_graph(flowsheet_id: int):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        graph = fs.get_graph()
        return StreamingResponse(io.BytesIO(graph), media_type="image/png")
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")


@router.get("/{flowsheet_id}/solve")
async def solve(flowsheet_id: int):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        results, history = fs.solve()
        return history
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")


@router.post("/{flowsheet_id}/reset")
async def reset(flowsheet_id: int):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        default_fs_config = fs.reset()
        return default_fs_config
    except KeyError as err:
        raise HTTPException(status_code=404, detail=f"Flowsheet not found: {err}")


@router.post("/{flowsheet_id}/update")
async def update(flowsheet_id: int, request: Request):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        updated_fs_config = await request.json()
        updated_fs_config = fs.update(updated_fs_config)
        return updated_fs_config
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")

@router.post("/{flowsheet_id}/download")
async def download(flowsheet_id: int, request: Request):
    try:
        fs = flowsheet_interfaces_handler.get_interface(flowsheet_id)
        data = await request.json()
        data1 = data[0]['output']
        data2 = data[1]['output']
        outputText = 'Category, Metric, Configuration 1, Configuration 2, Value Difference\n'
        for category in data1:
            for metric in data1[category]:
                value1 = str(data1[category][metric][0])+data1[category][metric][1]
                value2 = str(data2[category][metric][0])+data2[category][metric][1]
                difference = round(data1[category][metric][0]-data2[category][metric][0],2)
                nextLine = '{}, {}, {}, {}, {}\n'.format(category,metric,value1,value2,difference)
                outputText += nextLine
        filePath = os.path.join(fs.data_dir, 'comparison_results.csv')
        with open(filePath, 'w') as f:
            f.write(outputText)
        return FileResponse(filePath)
    except KeyError:
        raise HTTPException(status_code=404, detail="Flowsheet not found")
