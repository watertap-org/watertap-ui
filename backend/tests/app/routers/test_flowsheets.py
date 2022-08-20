"""
Tests for app.routers.flowsheets module
"""
import os

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


@pytest.mark.unit
def test_get_all(client):
    response = client.get("/flowsheets")
    assert response.status_code == 200
    assert response.json() != {}


@pytest.mark.unit
def test_get_config(client, flowsheet_id):
    url = f"/flowsheets/{flowsheet_id}/config"
    response = client.get(url)
    body = response.json()
    if response.status_code != 200:
        print(f"response error: {body['detail']}")
    assert response.status_code == 200
    assert body != {}

