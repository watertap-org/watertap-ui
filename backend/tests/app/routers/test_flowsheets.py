"""
Tests for app.routers.flowsheets module
"""
import json
import os
from urllib.parse import quote

from watertap.ui.fsapi import FlowsheetExport
from fastapi.responses import FileResponse

# add 'examples' to packages, *before* app starts
os.environ["watertap_packages"] = '["watertap", "examples"]'

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.internal import flowsheet_manager as fm


@pytest.fixture
def client():
    return TestClient(app)


def pytest_generate_tests(metafunc):
    if "flowsheet_id" in metafunc.fixturenames:
        from watertap.ui.fsapi import FlowsheetInterface

        module_names = list(FlowsheetInterface.from_installed_packages())
        metafunc.parametrize(
            "flowsheet_id",
            list(module_names),
            scope="module",
        )


def get_flowsheet(client, flowsheet_id, r, get_body=True, query_params=None):
    """Helper function for 'get' of a flowsheet"""
    url = f"/flowsheets/{flowsheet_id}/{r}"
    if query_params:
        url = _add_query_params(url, query_params)
    print(f"get: url={url}")
    response = client.get(url)
    if get_body:
        body = response.json()
    else:
        body = None
    return response, body


def post_flowsheet(
    client: TestClient, flowsheet_id, r, data, get_body=True, query_params=None
):
    """Helper function for 'post' of a flowsheet"""
    url = f"/flowsheets/{flowsheet_id}/{r}"
    if query_params:
        url = _add_query_params(url, query_params)
    if isinstance(data, dict) or isinstance(data, list):
        data = json.dumps(data)
    print(f"post: url={url}")
    response = client.post(url, data=data)
    if get_body:
        body = response.json()
    else:
        body = None
    return response, body


def _add_query_params(url, query_params):
    qp = "&".join(f"{quote(n)}={quote(v)}" for n, v in query_params.items())
    return f"{url}?{qp}"


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
    # get config, bare
    response, body = get_flowsheet(client, flowsheet_id, "config")
    assert response.status_code == 200, body
    # make sure it's a non-empty valid response
    assert body != {}
    fs_exp = FlowsheetExport.parse_obj(body)
    assert fs_exp.name != ""

    # this time build the model, make sure there is content
    response, body = get_flowsheet(
        client, flowsheet_id, "config", query_params={"build": "1"}
    )
    assert response.status_code == 200, body
    config = body
    assert len(config["model_objects"]) > 0


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
        if isinstance(value, float) and var_data["is_input"] and not var_data["is_readonly"]:
            print(f"check {var_name} is_input={var_data['is_input']}")
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
        "obj_key": "something"
    }
    response, update_body = post_flowsheet(client, flowsheet_id, "update", new_body)
    assert response.status_code == 200, update_body


@pytest.mark.unit
def test_save_config(client, flowsheet_id):
    response, body = get_flowsheet(client, flowsheet_id, "config")
    assert response.status_code == 200, body
    config = body
    response, body = post_flowsheet(
        client, flowsheet_id, "save", config, query_params={"name": "test name!", "version": "1"}
    )
    assert response.status_code == 200, body
    assert body == "test name!"

    response, body = post_flowsheet(client, flowsheet_id, "save", config, query_params={"version": "1"})
    assert response.status_code == 200, body
    assert body == "current"


@pytest.mark.unit
def test_load_config(client, flowsheet_id):
    # build/save a named config
    response, body = get_flowsheet(
        client, flowsheet_id, "config", query_params={"build": "1"}
    )
    assert response.status_code == 200
    config = body
    assert len(config["model_objects"]) > 0
    # make recognizable values
    for var_name, var_data in config["model_objects"].items():
        var_data["value"] = 99
    response, body = post_flowsheet(
        client, flowsheet_id, "save", config, query_params={"name": "test name!", "version": "1"}
    )
    # fetch it back & check values
    response, body = get_flowsheet(
        client, flowsheet_id, "load", query_params={"name": "test name!", "version": "1"}
    )
    assert response.status_code == 200, body
    config2 = body
    for var_name, var_data in config2["model_objects"].items():
        assert var_data["value"] == config["model_objects"][var_name]["value"]


@pytest.mark.unit
def test_list_configs(client, flowsheet_id):
    # get current list of names
    response, body = get_flowsheet(client, flowsheet_id, "list", query_params={"version": "1"})
    assert response.status_code == 200
    current_names = body
    # add some more names
    response, body = get_flowsheet(client, flowsheet_id, "config")
    assert response.status_code == 200, body
    config = body
    add_names = [f"name{i}" for i in range(1, 5)]
    for name in add_names:
        response, body = post_flowsheet(
            client, flowsheet_id, "save", config, query_params={"name": name, "version": "1"}
        )
    # check that all names are present
    response, body = get_flowsheet(client, flowsheet_id, "list", query_params={"version": "1"})
    assert response.status_code == 200
    assert set(body) == set(current_names + add_names)


@pytest.mark.unit
def test_download(client, flowsheet_id):
    compare_data = {
        "values": [
            {
                "category1": {
                    "metric1": [1.0, "g/mol"],
                    "metric2": [2.0, "g/mol"],
                    "metric3": [3.0, "g/mol"],
                    "metric4": ["banana", "g/mol"],
                },
                "category2": {
                    "metric1": [1.0, "g/mol"],
                    "metric2": [2.0, "g/mol"],
                    "metric3": [3.0, "g/mol"],
                    "metric4": ["avocado", "g/mol"],
                },
            },
            {
                "category1": {
                    "metric1": [1.5, "g/mol"],
                    "metric2": [2.5, "g/mol"],
                    "metric3": [3.5, "g/mol"],
                    "metric4": [-1, "g/mol"],
                },
                "category2": {
                    "metric1": [1.5, "g/mol"],
                    "metric2": [2.5, "g/mol"],
                    "metric3": [3.5, "g/mol"],
                    "metric4": [-2, "g/mol"],
                },
            },
        ]
    }

    response, _ = post_flowsheet(
        client, flowsheet_id, "download", compare_data, get_body=False
    )
    assert response.status_code == 200
    csv_data = ""
    for chunk in response.iter_content(65536):
        csv_data += str(chunk, encoding="utf-8")
    if "\r\n" in csv_data:
        sep = "\r\n"
    else:
        sep = "\n"
    NUM_ROWS = 4
    for i, line in enumerate(csv_data.split(sep)):
        print(line)
        fields = line.split(",")
        if i == 0:
            assert fields[0] == "category"
            assert fields[1] == "metric"
        elif line.strip() == "":
            pass
        else:
            # first column is category
            cnum = (i - 1) // NUM_ROWS + 1
            category = f"category{cnum}"
            assert fields[0] == category
            # second column is metric
            mnum = (i - 1) % NUM_ROWS + 1
            metric = f"metric{mnum}"
            assert fields[1] == metric
            # last column is difference between 1st and 2nd output values
            if mnum == 4:
                assert fields[-1] == "NA"
            else:
                assert (
                    float(fields[-1])
                    == compare_data["values"][0][category][metric][0]
                    - compare_data["values"][1][category][metric][0]
                )
