import sys
import os
import certifi
from idaes.util.download_bin import download_binaries
from idaes.config import default_binary_release
from pathlib import Path


extensions_dir = Path.home() / ".watertap" / ".idaes"
def check_for_extensions():
    print('checking for extensions')
    found_extensions = os.path.exists(extensions_dir)
    print(f'found extensions: {found_extensions}')
    return found_extensions

def get_extensions():
    print('inside get extensions')
    try:
        print('setting requests_ca_bundle and ssl_cert_file')
        os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
        os.environ["SSL_CERT_FILE"] = certifi.where()
    except Exception as e:
        print(f'unable to set requests_ca_bundle and ssl_cert_file:\n{e}')
    try:
        if(sys.platform == "darwin"):
            #XXX doesnt work on idaes 2.0.0 - unsupported darwin-x86_64
            print('mac')
            print('trying to download binaries')
            download_binaries(url=f'https://idaes-extensions.s3.us-west-1.amazonaws.com/')
            print(f'extensions have been gotten, making directory')
        else:
            print('not mac')
            print(f'trying to download binaries')
            download_binaries(release=default_binary_release)
            print(f'extensions have been gotten')
        print('successfully installed idaes extensions')
    except PermissionError as e:
        print(f'unable to install extensions, permissionerror due to idaes extensions already being present: {e}\nmaking directory')
        extensions_dir.mkdir(parents=True, exist_ok=True)
        return False
    except Exception as e:
        print(f'unable to install extensions: {e}')
        return False
    extensions_dir.mkdir(parents=True, exist_ok=True)
    return True

if not check_for_extensions():
    get_extensions()