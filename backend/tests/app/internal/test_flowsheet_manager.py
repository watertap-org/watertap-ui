"""
Tests for flowsheet_manager module
"""
from uuid import uuid4
import pytest
from app.internal import flowsheet_manager as fm

@pytest.fixture
def mgr():
    return fm.FlowsheetManager()


@pytest.mark.unit
def test_info():
    info = fm.FlowsheetInfo(id_="foo", name="foo")


@pytest.mark.unit
def test_mgr_construct(mgr):
    assert mgr is not None


@pytest.mark.unit
def test_mgr_get_flowsheet_dir(mgr: fm.FlowsheetManager):
    name = uuid4().hex  # assure it doesn't exist, which is OK
    d = mgr.get_flowsheet_dir(name)
    assert d.endswith(name)

@pytest.mark.unit
def test_mgr_flowsheets_property(mgr: fm.FlowsheetManager):
    pass
