"""
Configuration for the backend
"""
import app
from pathlib import Path
from pydantic import (
    BaseModel,
    BaseSettings,
    Field,
)

class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: list[str] = ["watertap",]
    data_basedir: Path = Path(app.__file__).parent / "flowsheets"

    class Config:
        env_prefix = "watertap"