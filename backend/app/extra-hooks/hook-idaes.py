import sys
hiddenimports = ['idaes.commands', 'idaes.commands.util', 'idaes.util', 'idaes.util.download_bin','idaes.config','idaes.logger','idaes.commands.util.download_bin']
if sys.platform == "darwin":
    datas=[('idaes-extensions/*.tar.gz', 'idaes-extensions')]