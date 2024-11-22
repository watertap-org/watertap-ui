"""
Tests for app.internal.settings module.
"""
import logging
import os
import pytest
from app.internal.settings import Deployment, AppSettings

__author__ = "Dan Gunter"

app_log = logging.getLogger("app.internal.settings")


def test_deployment_valid_projects():
    # use approved project names
    for p in Deployment.PROJ:
        d = Deployment(p)
        assert d.project == p


def test_deployment_invalid_projects():
    # try bad project names
    for name in "bad", "", "\U0001f600":
        with pytest.raises(ValueError):
            _ = Deployment(name)


def test_deployment_env_default():
    dpy = Deployment()
    assert dpy.project == Deployment.DEFAULT_PROJ

def test_appsettings():
    settings = AppSettings(
        packages = ["watertap"],
        log_dir = "./nawi/logs",
        custom_flowsheets_dir = "./nawi/custom_flowsheets",
        data_basedir = "./nawi/",
    )
    assert settings.packages
    assert settings.log_dir
    assert settings.custom_flowsheets_dir
    assert settings.data_basedir
