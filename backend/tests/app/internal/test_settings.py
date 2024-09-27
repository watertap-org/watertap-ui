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
        os.environ[Deployment.PROJECT_ENV] = p
        d = Deployment()
        assert d.project == p


def test_deployment_invalid_projects():
    # try bad project names
    for name in "bad", "", "\U0001f600":
        os.environ[Deployment.PROJECT_ENV] = name
        with pytest.raises(ValueError):
            _ = Deployment()


def test_deployment_env_default():
    # unset the env entirely
    del os.environ[Deployment.PROJECT_ENV]
    dpy = Deployment()
    assert dpy.project == Deployment.DEFAULT_PROJ

def test_appsettings():
    settings = AppSettings()
    assert settings.packages
    assert settings.log_dir
    assert settings.custom_flowsheets_dir
    assert settings.data_basedir
