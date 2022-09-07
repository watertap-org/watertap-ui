"""
Configuration for the backend
"""
import app
from pathlib import Path
from pydantic import (
    BaseSettings,
    validator
)


class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: list[str] = ["watertap"]
    data_basedir: Path = None

    @validator("data_basedir", always=True)
    def validate_data_basedir(cls, v):
        if v is None:
            v = Path.home() / ".watertap" / "flowsheets"
        v.mkdir(parents=True, exist_ok=True)
        return v

    class Config:
        env_prefix = "watertap_"
