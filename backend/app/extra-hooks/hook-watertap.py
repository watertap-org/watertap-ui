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

imports = set()

for package in ["watertap","examples"]:
    pkg = importlib.import_module(package)
    
    try:
        pkg_path = Path(pkg.__file__).parent
    except TypeError:  # missing __init__.py perhaps
        print(
            f"Cannot find package '{package}' directory, possibly "
            f"missing an '__init__.py' file"
        )
    if not pkg_path.is_dir():
        print(
            f"Cannot load from package '{package}': "
            f"path '{pkg_path}' not a directory"
        )

    # Find modules and import

    skip_expr = re.compile(r"_test|test_|__")
    result = {}

    for python_file in pkg_path.glob("**/*.py"):
        if skip_expr.search(str(python_file)):
            continue
        relative_path = python_file.relative_to(pkg_path)
        dotted_name = relative_path.as_posix()[:-3].replace("/", ".")
        module_name = package + "." + dotted_name
        try:
            # module = importlib.import_module(module_name)
            imports.add(module_name)
        except Exception as err:  # assume the import could do bad things
            print(f"Import of file '{python_file}' failed: {err}")
            continue

        # ensure all parent modules are imported (a lot of repeats here but it works)
        relative_path=relative_path.parent
        while relative_path != Path('.'):
            dotted_name = relative_path.as_posix().replace("/", ".")
            module_name = package + "." + dotted_name
            try:
                imports.add(module_name)
                relative_path=relative_path.parent
            except:
                relative_path=relative_path.parent
                print('error on my part')
                continue

hiddenimports = list(imports)