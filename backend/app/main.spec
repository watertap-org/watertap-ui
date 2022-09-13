# -*- mode: python ; coding: utf-8 -*-


block_cipher = None

added_files = [ 
        ('../../../watertap/watertap/data/techno_economic/*.yaml', 'watertap/data/techno_economic'), 
        ('../../../watertap/watertap/data/techno_economic/metab.yaml', 'watertap/core'), 
        ('../../../watertap/watertap/examples/flowsheets/case_studies/wastewater_resource_recovery/metab/metab_global_costing.yaml','watertap/examples/flowsheets/case_studies/wastewater_resource_recovery/metab'),
        ('../data/flowsheets/fake/graph.png', 'data/flowsheets/fake')]
a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[
    'networkx',
    'pyomo.contrib.ampl_function_demo.plugins',
    'pyomo.contrib.appsi.plugins',
    'pyomo.contrib.community_detection.plugins',
    'pyomo.contrib.example.plugins',
    'pyomo.contrib.fme.plugins',
    'pyomo.contrib.gdp_bounds.plugins',
    'pyomo.contrib.gdpopt.plugins',
    'pyomo.contrib.gjh.plugins',
    'pyomo.contrib.mcpp.plugins',
    'pyomo.contrib.mindtpy.plugins',
    'pyomo.contrib.multistart.plugins',
    'pyomo.contrib.preprocessing.plugins',
    'pyomo.contrib.pynumero.plugins',
    'pyomo.contrib.trustregion.plugins',
    'pyomo.repn.util',
    'pyomo.contrib.gdpbb',
    'pyomo.contrib.gdpbb.plugins',
    'pint', 'numbers', 'pyutilib', 'pyomo', 'pyomo.environ', 'pyomo.age', 'pyomo.bilevel', 'pyomo.bilevel.plugins', 'pyomo.core', 'pyomo.core.plugins', 'pyomo.dae', 'pyomo.dae.plugins', 'pyomo.gdp', 'pyomo.gdp.plugins', 'pyomo.neos', 'pyomo.neos.plugins', 'pyomo.opt', 'pyomo.opt.plugins', 'pyomo.pysp', 'pyomo.pysp.plugins', 'pyomo.solvers.plugins', 'pyomo.solvers', 'pyomo.checker', 'pyomo.checker.plugins', 'pyomo.contrib', 'pyomo.contrib.plugins', 'pyomo.dataportal', 'pyomo.dataportal.plugins', 'pyomo.duality', 'pyomo.duality.plugins', 'pyomo.kernel', 'pyomo.kernel.plugins', 'pyomo.mpec', 'pyomo.mpec.plugins', 'pyomo.network', 'pyomo.network.plugins', 'pyomo.repn', 'pyomo.repn.plugins', 'pyomo.scripting', 'pyomo.scripting.plugins', 'pyomo.util', 'pyomo.util.plugins', 'pyomo.common', 'pyomo.common.plugins', 'sys', 'logging', 're', 'sys', 'pyomo.core.expr.numvalue', 'pyomo.core.expr.numvalue', 'pyomo.solvers.plugins.solvers.direct_solver', 'pyomo.solvers.plugins.solvers.direct_or_persistent_solver', 'pyomo.core.kernel.component_set', 'pyomo.core.kernel.component_map', 'pyomo.opt.results.results_', 'pyomo.opt.results.solution', 'pyomo.opt.results.solver', 'pyomo.opt.base', 'pyomo.core.base.suffix', 'pyomo.core.base.var', 'pyomo.core.base.PyomoModel', 'pyomo.solvers.plugins.solvers.persistent_solver', 'pyomo.opt.base.problem', 'pyomo.opt.base.convert', 'pyomo.opt.base.formats', 'pyomo.opt.base.results', 'pyomo.core.base.block', 'pyomo.core.kernel.block', 'pyomo.core.kernel.suffix'],
    hookspath=['extra-hooks'],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
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
    name='main',
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
    name='main',
)