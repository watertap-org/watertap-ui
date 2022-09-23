import sys
import os
import certifi
from pathlib import Path
from shutil import copytree

idaes_extensions_dir = Path.home() / ".watertap" / ".idaes"
pyomo_extensions_dir = Path.home() / ".watertap" / ".pyomo"
def check_for_idaes_extensions():
    print('checking for idaes extensions')
    found_extensions = os.path.exists(idaes_extensions_dir)
    print(f'found extensions: {found_extensions}')
    return found_extensions

def check_for_pyomo_extensions():
    if sys.platform != "darwin":
        return True
    print('checking for pyomo extensions')
    found_extensions = os.path.exists(pyomo_extensions_dir)
    print(f'found extensions: {found_extensions}')
    return found_extensions

def get_idaes_extensions():
    print('inside get idaes extensions')
    try:
        if(sys.platform == "darwin"):
            idaes_src = Path(os.path.dirname(os.path.realpath(__file__))) / 'extensions' / '.idaes'
            idaes_dst = Path.home() / ".idaes"
            print('mac')
            print(f'moving binaries from {idaes_src} to {idaes_dst}')
            copytree(idaes_src,idaes_dst,dirs_exist_ok=True)
            print(f'get idaes extensions successful, making directory')
        else:
            print('not mac')
            print(f'trying to download binaries')
            download_binaries(release=default_binary_release)
            print(f'extensions have been gotten')
        print('successfully installed idaes extensions')
    except PermissionError as e:
        print(f'unable to install extensions, permissionerror due to idaes extensions already being present: {e}\nmaking directory')
        idaes_extensions_dir.mkdir(parents=True, exist_ok=True)
        return False
    except Exception as e:
        print(f'unable to install extensions: {e}')
        return False
    idaes_extensions_dir.mkdir(parents=True, exist_ok=True)
    return True

def get_pyomo_extensions():
    print('inside get pyomo extensions')
    try:
        pyomo_src = Path(os.path.dirname(os.path.realpath(__file__))) / 'extensions' / '.pyomo'
        pyomo_dst = Path.home() / ".pyomo"
        print('mac')
        print(f'moving binaries from {pyomo_src} to {pyomo_dst}')
        copytree(pyomo_src,pyomo_dst,dirs_exist_ok=True)
        print(f'get pyomo extensions successful, making directory')
    except PermissionError as e:
        print(f'unable to install extensions, permissionerror due to idaes extensions already being present: {e}\nmaking directory')
        idaes_extensions_dir.mkdir(parents=True, exist_ok=True)
        return False
    except Exception as e:
        print(f'unable to install extensions: {e}')
        return False
    pyomo_extensions_dir.mkdir(parents=True, exist_ok=True)
    return True

if not check_for_idaes_extensions():
    get_idaes_extensions()
if not check_for_pyomo_extensions():
    get_pyomo_extensions()