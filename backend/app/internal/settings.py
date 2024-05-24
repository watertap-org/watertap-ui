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


class Deployment:
    """Values related to the deployment context of the UI,
    e.g., NAWI WaterTAP, PROMMIS, or IDAES.
    """
    # env var for project name
    PROJECT_ENV = "PSE_PROJECT"
    # projects and their associated packages
    PROJ = {
        "watertap": ("watertap",),
        "idaes": ("idaes",),
        "prommis": ("prommis",)
    }
    DEFAULT_PROJ = "watertap"

    def __init__(self):
        try:
            project = os.environ[self.PROJECT_ENV].lower()
        except KeyError:
            project = self.DEFAULT_PROJ
            _log.warning(f"Project name not found in environment variable '{self.PROJECT_ENV}', using default")
        _log.info(f"Deploy for project={project}")
        if project not in self.PROJ.keys():
            valid_projects = ", ".join((str(x) for x in self.PROJ))
            raise ValueError(f"project '{project}' not in ({valid_projects})")
        self.project = project
        self.package = self.PROJ[project]
        self.data_basedir = Path.home() / f".{self.project}"
        try:
            self.data_basedir.mkdir(parents=True, exist_ok=True)
        except (FileNotFoundError, OSError) as err:
            _log.error(f"error creating project data directory '{self.data_basedir}'")
            raise
        _log.info(f"Deployment: project={self.project} package={self.package} data_basedir={self.data_basedir}")


_dpy = Deployment()


class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: List[str] = list(_dpy.package)
    log_dir: Union[Path, None] = None
    custom_flowsheets_dir: Union[Path, None] = None
    data_basedir: Path = _dpy.data_basedir

    # @validator("log_dir", always=True)
    @field_validator("log_dir")
    def validate_log_dir(cls, v):
        if v is None:
            v = _dpy.data_basedir / "logs"
        v.mkdir(parents=True, exist_ok=True)

        logging_format = "[%(levelname)s] %(asctime)s %(name)s " \
                        "(%(filename)s:%(lineno)s): %(message)s"
        logging_file_handler = logging.handlers.RotatingFileHandler(
            v / f"{_dpy.project}-ui_backend_logs.log",
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
        if v is None:
            v = _dpy.data_basedir / "custom_flowsheets"
        v.mkdir(parents=True, exist_ok=True)
        return v

    class Config:
        env_prefix = f"{_dpy.project.upper()}_"


def get_deployment() -> Deployment:
    return _dpy