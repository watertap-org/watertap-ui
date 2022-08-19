"""
Tests for app.routers.flowsheets module
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.mark.unit
def test_get_all(client):
    response = client.get("/")
    assert response  # non-zero amount of flowsheets
