import pytest

from watertap_ui import (
    util,
)


@pytest.fixture(
    params=[
        "metab"
    ]
)
def flowsheet_name(request) -> str:
    return request.param


class TestFlowsheetLoading:

    @pytest.fixture
    def entry_point(self, flowsheet_name):
        return util.get_flowsheet_entry_point(flowsheet_name)

    def test_get_entrypoint(self, entry_point):
        assert entry_point is not None

    @pytest.mark.xfail
    def test_load_entrypoint(self, entry_point):
        entry_point.load()
