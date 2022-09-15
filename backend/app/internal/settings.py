"""
Configuration for the backend
"""
from pathlib import Path
from typing import List
from pydantic import (
    BaseSettings,
    validator
)


class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: List[str] = ["watertap", "examples"]
    data_basedir: Path = None

    @validator("data_basedir", always=True)
    def validate_data_basedir(cls, v):
        if v is None:
            v = Path.home() / ".watertap" / "flowsheets"
        v.mkdir(parents=True, exist_ok=True)
        return v

    class Config:
        env_prefix = "watertap_"
