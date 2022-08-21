"""
Tests for app.routers.flowsheets module
"""
import json
import os
from watertap.ui.fsapi import FlowsheetExport

# add 'examples' to packages, *before* app starts
os.environ["watertap_packages"] = '["watertap", "examples"]'

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
    """Helper function for 'get' of a flowsheet"""
    url = f"/flowsheets/{flowsheet_id}/{r}"
    response = client.get(url)
    if get_body:
        body = response.json()
    else:
        body = None
    return response, body


def post_flowsheet(client: TestClient, flowsheet_id, r, data, get_body=True):
    """Helper function for 'get' of a flowsheet"""
    url = f"/flowsheets/{flowsheet_id}/{r}"
    if isinstance(data, dict):
        data = json.dumps(data)
    response = client.post(url, data=data)
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
    assert response.status_code == 200, body


@pytest.mark.unit
def test_solve(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "solve")
    assert response.status_code == 200, body


@pytest.mark.unit
def test_update(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "reset")
    assert response.status_code == 200, body
    new_body = body.copy()
    for var_name, var_data in new_body["model_objects"].items():
        value = var_data["value"]
        if isinstance(value, float):
            var_data["value"] += 1
            print(f"changed {var_name}")
    response, update_body = post_flowsheet(client, flowsheet_id, "update", new_body)
    assert response.status_code == 200, update_body
    for var_name, var_data in update_body["model_objects"].items():
        value = var_data["value"]
        if isinstance(value, float):
            print(f"check {var_name}")
            expect_value = new_body["model_objects"][var_name]["value"]
            assert value == expect_value


@pytest.mark.unit
def test_update_missing(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "reset")
    assert response.status_code == 200, body
    new_body = body.copy()
    new_body["model_objects"]["missing"] = {
        "name": "Tank 99 inlet flowrate",
        "value": 2.0,
        "display_units": "None",
        "rounding": 0.0,
        "description": "",
        "is_input": True,
        "is_output": True,
        "is_readonly": False,
        "input_category": None,
        "output_category": None,
    }
    response, update_body = post_flowsheet(client, flowsheet_id, "update", new_body)
    assert response.status_code == 200, update_body

