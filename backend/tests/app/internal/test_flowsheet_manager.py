"""
Tests for flowsheet_manager module
"""
from uuid import uuid4
import pytest
from app.internal import flowsheet_manager as fm
from fastapi import HTTPException
import logging

# logging.getLogger("idaes.app.internal.flowsheet_manager").setLevel(logging.DEBUG)
# logging.getLogger("idaes.watertap.ui.fsapi").setLevel(logging.DEBUG)


@pytest.fixture(scope="module")
def mgr():
    return fm.FlowsheetManager(packages=["watertap", "examples"])


def one_id(fm):
    return list(fm._flowsheets.keys())[0]


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
    assert str(d).endswith(name)


@pytest.mark.unit
def test_mgr_flowsheets_property(mgr: fm.FlowsheetManager):
    assert mgr.flowsheets  # we found at least 1


@pytest.mark.unit
def test_mgr_get_diagram(mgr: fm.FlowsheetManager):
    d = mgr.get_diagram(one_id(mgr))
    assert d


@pytest.mark.unit
def test_mgr_getitem(mgr: fm.FlowsheetManager):
    fs = mgr.get_obj(one_id(mgr))
    assert fs
    with pytest.raises(HTTPException):
        _ = mgr.get_obj("this is not a valid flowsheet id")


@pytest.mark.component
def test_mgr_history(mgr: fm.FlowsheetManager):
    fsid = one_id(mgr)
    save_name = "foobar"
    data1, data2 = {"num": 1}, {"num": 2}
    # put initial data and check it is returned
    mgr.put_flowsheet_data(id_=fsid, name=save_name, data=data1)
    data = mgr.get_flowsheet_data(id_=fsid, name=save_name)
    assert len(data) == 1
    assert data[0] == data1
    # change data and check it is returned
    mgr.put_flowsheet_data(id_=fsid, name=save_name, data=data2)
    data = mgr.get_flowsheet_data(id_=fsid, name=save_name)
    assert len(data) == 1
    assert data[0] == data2
