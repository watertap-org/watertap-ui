import os
from collections import namedtuple
from enum import Enum
from glob import glob
import importlib
from pathlib import Path
import re
from typing import Callable, Optional, Dict, Union, TypeVar
from uuid import uuid4
import sys

from pathlib import Path


imports = set()
datas = []

# add all modules to watertap modules hidden imports

for package in ["watertap", "pyomo"]:
    pkg = importlib.import_module(package)
    try:
        # base_folder = Path(pkg.__path__[0])
        pkg_path = Path(pkg.__file__).parent
        base_folder = pkg_path.parent
        print("------------------importing", package, base_folder, pkg_path)
    except TypeError:  # missing __init__.py perhaps
        print(
            f"---------------Cannot find package '{package}' directory, possibly "
            f"missing an '__init__.py' file"
        )
    if not pkg_path.is_dir():
        print(
            f"--------------------Cannot load from package '{package}': "
            f"path '{pkg_path}' not a directory"
        )

    skip_expr = re.compile(r"_test|test_|__")
    print("beginning python files")
    for python_file in pkg_path.glob("**/*.py"):
        if skip_expr.search(str(python_file)):
            continue
        # print(python_file)
        relative_path = python_file.relative_to(pkg_path)
        dotted_name = relative_path.as_posix()[:-3].replace("/", ".")
        module_name = package + "." + dotted_name
        try:
            module = importlib.import_module(module_name)
            imports.add(module_name)
            # print(module_name)
        except Exception as err:  # assume the import could do bad things
            print(f"Import of file '{python_file}' failed: {err}")
            continue

        # ensure all parent modules are imported (a lot of repeats here but it works)
        relative_path = relative_path.parent
        while relative_path != Path("."):
            dotted_name = relative_path.as_posix().replace("/", ".")
            module_name = package + "." + dotted_name
            try:
                module = importlib.import_module(module_name)
                imports.add(module_name)
                relative_path = relative_path.parent
            except:
                relative_path = relative_path.parent
                print("error on my part")
                continue

    # add all png files to pyinstaller data
    for png_file in pkg_path.glob("**/*.png"):
        file_name = "/" + png_file.as_posix().split("/")[-1]
        # print(file_name)
        if skip_expr.search(str(png_file)):
            continue
        relative_path = png_file.relative_to(pkg_path)
        dotted_name = relative_path.as_posix()
        src_name = f"{base_folder}/" + package + "/" + dotted_name
        dst_name = package + "/" + dotted_name.replace(file_name, "")
        try:
            datas.append((src_name, dst_name))
        except Exception as err:  # assume the import could do bad things
            print(f"Import of file '{png_file}' failed: {err}")
            continue

    # add all yaml files to pyinstaller data
    for yaml_file in pkg_path.glob("**/*.yaml"):
        file_name = "/" + yaml_file.as_posix().split("/")[-1]
        # print(file_name)
        if skip_expr.search(str(yaml_file)):
            continue
        relative_path = yaml_file.relative_to(pkg_path)
        dotted_name = relative_path.as_posix()
        src_name = f"{base_folder}/" + package + "/" + dotted_name
        dst_name = package + "/" + dotted_name.replace(file_name, "")
        try:
            datas.append((src_name, dst_name))
        except Exception as err:  # assume the import could do bad things
            print(f"Import of file '{yaml_file}' failed: {err}")
            continue

hiddenimports = list(imports)
# print("hiddenimports")
# print(hiddenimports)
# # manually add all pyomo hidden imports
pyomo_imports = [
    "networkx",
    # "pyomo.contrib.ampl_function_demo.plugins",
    # "pyomo.contrib.appsi.plugins",
    # "pyomo.contrib.community_detection.plugins",
    # "pyomo.contrib.example.plugins",
    # "pyomo.contrib.fme.plugins",
    # "pyomo.contrib.gdp_bounds.plugins",
    # "pyomo.contrib.gdpopt.plugins",
    # "pyomo.contrib.gjh.plugins",
    # "pyomo.contrib.mcpp.plugins",
    # "pyomo.contrib.mindtpy.plugins",
    # "pyomo.contrib.multistart.plugins",
    # "pyomo.contrib.preprocessing.plugins",
    # "pyomo.contrib.pynumero.plugins",
    # "pyomo.contrib.trustregion.plugins",
    # "pyomo.repn.util",
    # "pyomo.contrib.gdpbb",
    # "pyomo.contrib.gdpbb.plugins",
    "pint",
    "numbers",
    "pyutilib",
    # "pyomo",
    # "pyomo.environ",
    # "pyomo.age",
    # "pyomo.bilevel",
    # "pyomo.bilevel.plugins",
    # "pyomo.core",
    # "pyomo.core.plugins",
    # "pyomo.dae",
    # "pyomo.dae.plugins",
    # "pyomo.gdp",
    # "pyomo.gdp.plugins",
    # "pyomo.neos",
    # "pyomo.neos.plugins",
    # "pyomo.opt",
    # "pyomo.opt.plugins",
    # "pyomo.pysp",
    # "pyomo.pysp.plugins",
    # "pyomo.solvers.plugins",
    # "pyomo.solvers",
    # "pyomo.checker",
    # "pyomo.checker.plugins",
    # "pyomo.contrib",
    # "pyomo.contrib.plugins",
    # "pyomo.contrib.solver",
    # "pyomo.contrib.solver.plugins",
    # "pyomo.dataportal",
    # "pyomo.dataportal.plugins",
    # "pyomo.duality",
    # "pyomo.duality.plugins",
    # "pyomo.kernel",
    # "pyomo.kernel.plugins",
    # "pyomo.mpec",
    # "pyomo.mpec.plugins",
    # "pyomo.network",
    # "pyomo.network.plugins",
    # "pyomo.repn",
    # "pyomo.repn.plugins",
    # "pyomo.scripting",
    # "pyomo.scripting.plugins",
    # "pyomo.util",
    # "pyomo.util.plugins",
    # "pyomo.common",
    # "pyomo.common.plugins",
    "sys",
    "logging",
    "re",
    "sys",
    # "pyomo.core.expr.numvalue",
    # "pyomo.core.expr.numvalue",
    # "pyomo.solvers.plugins.solvers.direct_solver",
    # "pyomo.solvers.plugins.solvers.direct_or_persistent_solver",
    # "pyomo.core.kernel.component_set",
    # "pyomo.core.kernel.component_map",
    # "pyomo.opt.results.results_",
    # "pyomo.opt.results.solution",
    # "pyomo.opt.results.solver",
    # "pyomo.opt.base",
    # "pyomo.core.base.suffix",
    # "pyomo.core.base.var",
    # "pyomo.core.base.PyomoModel",
    # "pyomo.solvers.plugins.solvers.persistent_solver",
    # "pyomo.opt.base.problem",
    # "pyomo.opt.base.convert",
    # "pyomo.opt.base.formats",
    # "pyomo.opt.base.results",
    # "pyomo.core.base.block",
    # "pyomo.core.kernel.block",
    # "pyomo.core.kernel.suffix",
    # "pyomo.contrib.cp.plugins",
]

hiddenimports.extend(pyomo_imports)
