import sys
import os
import certifi
from pathlib import Path
from shutil import copytree
import certifi

idaes_extensions_dir = Path.home() / ".nawi" / ".idaes"
pyomo_extensions_dir = Path.home() / ".nawi" / ".pyomo_"
def check_for_idaes_extensions():
    print('checking for idaes extensions')
    found_extensions = os.path.exists(idaes_extensions_dir)
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
        elif(sys.platform == "linux"):
            print('linux')
            idaes_src = Path(os.path.dirname(os.path.realpath(__file__))) / 'extensions' / '.idaes'
            idaes_dst = Path.home() / ".idaes"
            print(f'moving binaries from {idaes_src} to {idaes_dst}')
            copytree(idaes_src,idaes_dst,dirs_exist_ok=True)
            print(f'get idaes extensions successful, making directory')
        else:
            print('windows')
            try:
                print(f'setting requests_ca_bundle and ssl_cert_file to certifi.where(): {certifi.where()}')
                os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
                os.environ["SSL_CERT_FILE"] = certifi.where()
            except Exception as e:
                print(f'unable to set requests_ca_bundle and ssl_cert_file:\n{e}')
            print(f'trying to download binaries')
            from idaes.util.download_bin import download_binaries
            from idaes.config import default_binary_release
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


if not check_for_idaes_extensions():
    get_idaes_extensions()