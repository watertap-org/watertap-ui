"""
Configuration for the backend
"""
import app
import os
from pathlib import Path
from pydantic import (
    BaseModel,
    BaseSettings,
    Field,
)


class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: list[str] = ["watertap", "examples"]
    data_basedir: Path = Path(os.path.expanduser("~")) / "WatertapUI" / "data" / "flowsheets"
    # data_basedir: Path = Path(app.__file__).parent.parent / "data" / "flowsheets"

    def create_data_basedir(self):
        if not self.data_basedir.exists():
            self.data_basedir.mkdir(parents=True)

    class Config:
        env_prefix = "watertap_"
