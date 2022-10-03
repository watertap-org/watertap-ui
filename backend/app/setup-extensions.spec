# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path
import sys

block_cipher = None
exclude_modules = ['notebook','matplotlib','lxml','jedi','share','scipy','numpy','libopenblas']

if sys.platform == 'darwin':
    extra_data = [('extensions/.idaes/bin/ipopt_sens', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cubic_roots.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libstdc++.6.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/version_lib.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libsipopt.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libadolc.2.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/general_helmholtz_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libadolc.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libipopt.3.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libadolc.la', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/couenne', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libipopt.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cbc', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgfortran.5.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libpynumero_ASL.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/functions.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/iapws95_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/license_lib.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/k_aug', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/version_solvers.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_l1', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/bonmin', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/swco2_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libsipopt.3.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/license.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_sens_l1', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgcc_s.1.1.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/clp', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgomp.1.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/dot_sens', 'extensions/.idaes/bin/')]
elif sys.platform == 'linux':
    extra_data = [('extensions/.idaes/bin/ipopt_sens', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cubic_roots.so', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/libadolc.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/version_lib.txt', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/libadolc.so.2', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libadolc.so.2.2.0', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/general_helmholtz_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libipopt.so', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/libpynumero_ASL.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libadolc.la', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/ipopt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/couenne', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/libsipopt.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cbc', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/functions.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/iapws95_external.so', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/license_lib.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/k_aug', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/version_solvers.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_l1', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/bonmin', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/swco2_external.so', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/license.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_sens_l1', 'extensions/.idaes/bin/'), 
    ('extensions/.idaes/bin/clp', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/dot_sens', 'extensions/.idaes/bin/')]
else:
    extra_data = []

a = Analysis(
    ['setup-extensions.py'],
    pathex=[],
    binaries=[],
    datas=extra_data,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=exclude_modules,
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='setup-extensions',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='setup-extensions',
)
