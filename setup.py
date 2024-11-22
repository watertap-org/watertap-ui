from setuptools import setup, find_packages


setup(
    name="watertap-ui",
    author="WaterTAP UI developers",
    license="LICENSE",

    version="22.9.9",

    package_dir={"": "src"},
    packages=find_packages(where="src"),

    install_requires=[
        "importlib_metadata ; python_version < '3.8' ",
        "pytest>=7",
    ],

    entry_points={
        "watertap.flowsheets": [
        ],
        "prommis.flowsheets": [
            "uky = prommis.uky.uky_flowsheet_ui",
        ],
    }
)
