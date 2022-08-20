"""
Tests for app.routers.flowsheets module
"""
import os
from watertap.ui.fsapi import FlowsheetExport

# add 'examples' to packages, *before* app starts
os.environ["watertap_packages"] = "[\"watertap\", \"examples\"]"

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.internal import flowsheet_manager as fm


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(scope="module")
def flowsheet_id():
    mgr = fm.FlowsheetManager()
    return list(mgr._flowsheets.keys())[0]


def get_flowsheet(client, flowsheet_id, r, get_body=True):
    """Helper function"""
    url = f"/flowsheets/{flowsheet_id}/{r}"
    response = client.get(url)
    if get_body:
        body = response.json()
    else:
        body = None
    return response, body

# ---------------------------------


@pytest.mark.unit
def test_get_all(client):
    response = client.get("/flowsheets")
    assert response.status_code == 200
    body = response.json()
    for item in body:
        # validates the result object, too
        info = fm.FlowsheetInfo.parse_obj(item)
        assert info.name != ""


@pytest.mark.unit
def test_get_config(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "config")
    if response.status_code != 200:
        print(f"response error: {body['detail']}")
    assert response.status_code == 200
    # make sure it's a non-empty valid response
    assert body != {}
    fs_exp = FlowsheetExport.parse_obj(body)
    assert fs_exp.name != ""


@pytest.mark.unit
def test_get_diagram(client, flowsheet_id):
    response, _ = get_flowsheet(client, flowsheet_id, "diagram", get_body=False)


@pytest.mark.component
def test_reset(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "reset")


@pytest.mark.component
def test_solve(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "solve")
