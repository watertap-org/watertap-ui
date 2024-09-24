"""
Configuration for the backend
"""

import os
from pathlib import Path
import logging
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

__author__ = "Dan Gunter"

_log = logging.getLogger(__name__)
h = logging.StreamHandler()
h.setFormatter(logging.Formatter("[%(levelname)s] %(name)s - %(message)s"))
_log.addHandler(h)
_log.setLevel(logging.WARNING)

class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: List[str]
    log_dir: Path
    custom_flowsheets_dir: Path
    data_basedir : Path

    @field_validator("log_dir")
    def validate_log_dir(cls, v):
        _log.info(f"Creating log directory '{v}'")
        v.mkdir(parents=True, exist_ok=True)

        logging_format = "[%(levelname)s] %(asctime)s %(name)s " \
                        "(%(filename)s:%(lineno)s): %(message)s"
        project_log_file = f"ui_backend_logs.log"
        _log.info(f"Logs will be in rotating files with base name "
                f"'{v/project_log_file}'")
        logging_file_handler = logging.handlers.RotatingFileHandler(
            v / project_log_file,
            backupCount=2,
            maxBytes=5000000,
        )
        logging.basicConfig(
            level=logging.INFO, format=logging_format, handlers=[logging_file_handler]
        )
        return v

    # @validator("custom_flowsheets_dir", always=True)
    @field_validator("custom_flowsheets_dir")
    def validate_custom_flowsheets_dir(cls, v):
        v.mkdir(parents=True, exist_ok=True)
        return v

    # class Config:
    #     env_prefix = f"{_dpy.project.upper()}_"


# def get_deployment() -> Deployment:
#     return _dpy

# def set_deployment(project_name) -> Deployment:
#     _dpy = Deployment(project_name)
#     return _dpy