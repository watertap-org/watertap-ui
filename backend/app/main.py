import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from fastapi import FastAPI
from app.routers import flowsheets

app = FastAPI()

app.include_router(flowsheets.router)

@app.get("/")
async def root():
    return {"message": "Hello FastAPI"}
