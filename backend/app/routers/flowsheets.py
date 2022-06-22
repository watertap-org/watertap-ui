import io
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.internal.flowsheet.flowsheet import Flowsheet

router = APIRouter(
    prefix="/flowsheets",
    tags=["flowsheets"],
    responses={404: {"description": "Flowsheet not found"}},
)

flowsheets_list = [
    {"id":1, "name":'Flowsheet C', "train":"Seawater Desalination", "lastRun": "2020-12-04", "created": "2020-12-04"},
    {"id":2, "name":'Flowsheet B', "train":"Municipal Potable Water Reuse", "lastRun":"2020-12-04", "created":"2020-12-04"},
    {"id":3, "name":'Flowsheet E', "train":"Custom", "lastRun":"2020-12-04", "created":"2020-12-04"},
    {"id":4, "name":'Flowsheet D', "train":"Custom", "lastRun":"2020-12-04", "created":"2020-12-04"},
    {"id":5, "name":'Flowsheet A', "train":"Municipal Potable Water Reuse", "lastRun":"2020-12-04", "created":"2020-12-04"},
    {"id":6, "name":'Flowsheet F', "train":"Municipal Potable Water Reuse", "lastRun":"2020-12-04", "created":"2020-12-04"},
]

@router.get("/")
async def get_all():
    return flowsheets_list

@router.get("/{flowsheet_id}/config")
async def get_config(flowsheet_id: str):
    fs = Flowsheet(flowsheet_id)
    config = fs.get_data()
    return config

@router.get("/{flowsheet_id}/graph")
async def get_graph(flowsheet_id: str):
    fs = Flowsheet(flowsheet_id)
    graph = fs.get_graph()
    return StreamingResponse(io.BytesIO(graph), media_type="image/png")

@router.get("/{flowsheet_id}/solve")
async def solve(flowsheet_id: str):
    fs = Flowsheet(flowsheet_id)
    results = fs.solve()
    return results
