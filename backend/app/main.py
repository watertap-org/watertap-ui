import sys
import os
import logging 
import uvicorn
import multiprocessing
import idaes.logger as idaeslog
# from idaes.commands.util.download_bin import download_binaries
# from idaes.config import default_binary_release

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

def get_extensions():
    return True
    # _log.info('inside get extensions')
    # extensions_dir = os.path.join(SCRIPT_DIR,'idaes-extensions')
    # _log.info(f'extensions_dir{extensions_dir}')
    # # _log.info(f'machine(): {machine()}')
    # try:
    #     if(sys.platform == "darwin"):
    #         #XXX doesnt work on idaes 2.0.0 - unsupported darwin-x86_64
    #         _log.info('mac')
    #         _log.info('trying to download binaries')
    #         # download_binaries(url=f'file://{extensions_dir}')
    #         download_binaries(platform="darwin", insecure=True)
    #         _log.info(f'extensions have been gotten')
    #     else:
    #         _log.info('not mac')
    #         _log.info(f'trying to download binaries')
    #         download_binaries(release=default_binary_release)
    #         _log.info(f'extensions have been gotten')
    #     _log.info('successfully installed idaes extensions')
    # except Exception as e:
    #     _log.error(f'unable to install extensions: {e}')
    #     return False
    # return True

if __name__ == '__main__':
    if('i' in sys.argv or 'install' in sys.argv):
        _log.info('running get_extensions')
        if get_extensions():
            # _log.info('SUCCESS: idaes extensions installed')
            sys.exit(0)
        else:
            _log.error('unable to install idaes extensions :(')
            sys.exit(1)
    _log.info(f"starting app!!")
    multiprocessing.freeze_support()
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)