import sys
import os
import logging 
import uvicorn
import multiprocessing
import idaes.logger as idaeslog

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from fastapi import FastAPI
from app.routers import flowsheets
from fastapi.middleware.cors import CORSMiddleware

_log = idaeslog.getLogger(__name__)
_log.setLevel(logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flowsheets.router)

@app.get("/")
async def root():
    return {"message": "Hello FastAPI"}


if __name__ == '__main__':
    _log.info(f"\n\n\nstarting app!!")
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)