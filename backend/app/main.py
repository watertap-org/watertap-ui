import sys
import os
import logging
import uvicorn
import multiprocessing
import idaes.logger as idaeslog

## Put DeferredImportCallbackFinder at the end of sys.meta_path list
DeferredImportCallbackFinder = [finder for finder in sys.meta_path if "pyomo.common.dependencies" in repr(finder)]
if len(DeferredImportCallbackFinder) > 0:
    DeferredImportCallbackFinder=DeferredImportCallbackFinder[0]
    sys.meta_path[:] = [finder for finder in sys.meta_path if "pyomo.common.dependencies" not in repr(finder)]
    sys.meta_path.append(DeferredImportCallbackFinder)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from fastapi import FastAPI
from app.internal.get_extensions import check_for_idaes_extensions, get_idaes_extensions
from app.routers import flowsheets
from fastapi.middleware.cors import CORSMiddleware

_log = idaeslog.getLogger(__name__)

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


if __name__ == "__main__":
    if "i" in sys.argv or "install" in sys.argv:
        _log.info("running get_extensions()")
        if not check_for_idaes_extensions():
            get_idaes_extensions()

    elif "d" in sys.argv or "dev" in sys.argv:
        _log.info(f"starting app")
        multiprocessing.freeze_support()
        uvicorn.run("__main__:app", host="127.0.0.1", port=8001, reload=True)

    else:
        _log.info(f"starting app")
        multiprocessing.freeze_support()
        uvicorn.run(app, host="127.0.0.1", port=8001, reload=False)
