import sys
import os
from idaes.util.download_bin import download_binaries
from idaes.config import default_binary_release

def get_extensions():
    print('inside get extensions')
    extensions_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),'idaes-extensions')
    print(f'extensions_dir{extensions_dir}')
    # _log.info(f'machine(): {machine()}')
    try:
        if(sys.platform == "darwin"):
            #XXX doesnt work on idaes 2.0.0 - unsupported darwin-x86_64
            print('mac')
            print('trying to download binaries')
            download_binaries(url=f'file://{extensions_dir}')
            # download_binaries(platform="darwin")
            print(f'extensions have been gotten')
        else:
            print('not mac')
            print(f'trying to download binaries')
            download_binaries(release=default_binary_release)
            print(f'extensions have been gotten')
        print('successfully installed idaes extensions')
    except Exception as e:
        print(f'unable to install extensions: {e}')
        return False
    return True


get_extensions()