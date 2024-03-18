"""
Configuration for the backend
"""
from pathlib import Path
import logging
from typing import List, Union
from pydantic import validator, field_validator
from pydantic_settings import BaseSettings



class AppSettings(BaseSettings):
    #: List of package names in which to look for flowsheets
    packages: List[str] = ["watertap"]
    data_basedir: Union[Path, None] = None
    log_dir: Union[Path, None] = None
    custom_flowsheets_dir: Union[Path, None] = None

    # @validator("data_basedir", always=True)
    @field_validator("data_basedir")
    def validate_data_basedir(cls, v):
        if v is None:
            v = Path.home() / ".watertap" / "flowsheets"
        v.mkdir(parents=True, exist_ok=True)
        return v

    # @validator("log_dir", always=True)
    @field_validator("log_dir")
    def validate_log_dir(cls, v):
        if v is None:
            v = Path.home() / ".watertap" / "logs"
        v.mkdir(parents=True, exist_ok=True)
        
        loggingFormat = "[%(levelname)s] %(asctime)s %(name)s (%(filename)s:%(lineno)s): %(message)s"
        loggingFileHandler = logging.handlers.RotatingFileHandler(v / "watertap-ui_backend_logs.log", backupCount=2, maxBytes=5000000)
        logging.basicConfig(level=logging.INFO, format=loggingFormat, handlers=[loggingFileHandler])
        return v
    
    # @validator("custom_flowsheets_dir", always=True)
    @field_validator("custom_flowsheets_dir")
    def validate_custom_flowsheets_dir(cls, v):
        if v is None:
            v = Path.home() / ".watertap" / "custom_flowsheets"
        v.mkdir(parents=True, exist_ok=True)
        return v

    class Config:
        env_prefix = "watertap_"
