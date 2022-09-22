from setuptools import setup, find_packages


setup(
    name="watertap-ui",
    author="WaterTAP UI developers",
    license="LICENSE",

    version="22.9.9",

    package_dir={"": "src"},
    packages=find_packages(where="src"),

    install_requires=[
        "importlib_resources; python_version < '3.10' ",
        "pytest>=7",
    ],
    python_requires=">=3.8",

    entry_points={
        "watertap.flowsheets": [
            "metab = watertap.examples.flowsheets.case_studies.wastewater_resource_recovery.metab.metab_ui",
            "RO = watertap.examples.flowsheets.case_studies.seawater_RO_desalination.seawater_RO_desalination",
        ],
    }
)
