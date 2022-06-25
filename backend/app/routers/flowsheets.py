import io
from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse

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
        results = fs.solve()
        return results
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
