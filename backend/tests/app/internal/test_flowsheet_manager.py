"""
Tests for flowsheet_manager module
"""
from uuid import uuid4
import pytest
from app.internal import flowsheet_manager as fm
from fastapi import HTTPException
import logging
import time


# logging.getLogger("idaes.app.internal.flowsheet_manager").setLevel(logging.DEBUG)
# logging.getLogger("idaes.watertap.ui.fsapi").setLevel(logging.DEBUG)


@pytest.fixture(scope="module")
def mgr():
    return fm.FlowsheetManager(packages=["watertap", "tests.app.internal.examples"])


def one_id(fm, filter_func=None):
    for key in fm._flowsheets:
        if filter_func is None or filter_func(key):
            return key
    return None


@pytest.mark.unit
def test_info():
    info = fm.FlowsheetInfo(id_="foo", name="foo")


@pytest.mark.unit
def test_mgr_construct(mgr):
    assert mgr is not None


@pytest.mark.unit
def test_mgr_get_flowsheet_dir(mgr: fm.FlowsheetManager):
    with pytest.raises(HTTPException):
        mgr.get_flowsheet_dir(uuid4().hex)


@pytest.mark.unit
def test_mgr_flowsheets_property(mgr: fm.FlowsheetManager):
    assert mgr.flowsheets  # we found at least 1


@pytest.mark.unit
def test_mgr_get_diagram(mgr: fm.FlowsheetManager):
    no_diagram = "nodiagram"
    print(f"All flowsheets: {mgr._flowsheets.keys()}")

    # get an examples module
    mod_id = one_id(
        mgr, filter_func=lambda k: (k.startswith("tests") and no_diagram not in k)
    )
    print(f"Getting diagram: {mod_id}")
    d = mgr.get_diagram(mod_id)
    assert d
    # known size of "diagram"
    assert 18000 < len(d) < 19000

    # module has no API fails
    with pytest.raises(HTTPException):
        mgr.get_diagram("watertap.core.wt_database")

    # raw pkg fails
    with pytest.raises(HTTPException):
        mgr.get_diagram("examples")

    mod_id2 = mod_id.replace("api_example", f"api_example_{no_diagram}")
    print(f"Getting diagram: {mod_id2}")
    b = mgr.get_diagram(mod_id2)
    assert len(b) == 0


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


@pytest.mark.unit
def test_info():
    info = fm.FlowsheetInfo(id_="an-id", name="A name")
    assert info.id_ == "an-id"
    assert info.name == "a name"  # normalized to lowercase
    assert info.description == ""
    assert info.module == ""
    assert info.built is False
    assert info.ts == 0

    info.updated()
    assert info.ts > 0
    assert info.built is False

    ts = info.ts
    time.sleep(0.5)
    info.updated(built=True)
    assert info.built is True
    assert ts < info.ts
