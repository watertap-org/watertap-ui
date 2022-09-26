# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path
import sys

block_cipher = None

if sys.platform == "darwin":
    a = Analysis(
        ['setup-extensions.py'],
        pathex=[],
        binaries=[],
        datas=[('extensions/.pyomo/include/asl/asl_pfgh.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/jacpdim.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/opcode.hd', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/jac2dim.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/obj_adj.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/r_opn.hd', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/getstub.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/errchk.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/arith.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/nlp.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/stdio1.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/nlp2.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/asl.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/psinfo.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/funcadd.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/asl_pfg.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl/avltree.h', 'extensions/.pyomo/include/asl/'), ('extensions/.pyomo/include/asl2/asl_pfgh.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/jacpdim.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/opcode.hd', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/jac2dim.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/obj_adj.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/r_opn.hd', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/opno2.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/getstub.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/errchk.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/arith.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/nlp.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/stdio1.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/nlp2.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/asl.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/psinfo.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/funcadd.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/asl_pfg.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/include/asl2/avltree.h', 'extensions/.pyomo/include/asl2/'), ('extensions/.pyomo/lib/libpynumero_ASL.dylib', 'extensions/.pyomo/lib/'), ('extensions/.pyomo/lib/libasl.a', 'extensions/.pyomo/lib/'), ('extensions/.pyomo/lib/libasl2.a', 'extensions/.pyomo/lib/'), ('extensions/.pyomo/share/ampl-asl/ampl-asl-config.cmake', 'extensions/.pyomo/share/ampl-asl/'), ('extensions/.pyomo/share/ampl-asl/ampl-asl-config-noconfig.cmake', 'extensions/.pyomo/share/ampl-asl/'), ('extensions/.idaes/bin/ipopt_sens', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cubic_roots.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libstdc++.6.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/version_lib.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libsipopt.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libipopt.3.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/couenne', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libipopt.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/cbc', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgfortran.5.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libpynumero_ASL.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/functions.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/iapws95_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/license_lib.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/k_aug', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/version_solvers.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_l1', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/bonmin', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/swco2_external.so', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libsipopt.3.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/license.txt', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/ipopt_sens_l1', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgcc_s.1.1.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/clp', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/libgomp.1.dylib', 'extensions/.idaes/bin/'), ('extensions/.idaes/bin/dot_sens', 'extensions/.idaes/bin/')],
        hiddenimports=[],
        hookspath=[],
        hooksconfig={},
        runtime_hooks=[],
        excludes=[],
        win_no_prefer_redirects=False,
        win_private_assemblies=False,
        cipher=block_cipher,
        noarchive=False,
    )
else:
    a = Analysis(
        ['setup-extensions.py'],
        pathex=[],
        binaries=[],
        datas=[],
        hiddenimports=[],
        hookspath=[],
        hooksconfig={},
        runtime_hooks=[],
        excludes=[],
        win_no_prefer_redirects=False,
        win_private_assemblies=False,
        cipher=block_cipher,
        noarchive=False,
    )
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

if sys.platform == 'darwin':
    MISSING_DYLIBS = (
        Path('extensions/.pyomo/lib/libpynumero_ASL.dylib'),
    )
    a.binaries += TOC([
        (lib.name, str(lib.resolve()), 'BINARY') for lib in MISSING_DYLIBS
    ])

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
