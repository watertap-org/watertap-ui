try:
    from importlib import metadata
except ImportError:
    from importlib_metadata import metadata
from typing import (
    Dict,
    Union,
)
from types import ModuleType


class _ENTRY_POINT_GROUPS:
    _namespace = "watertap"
    flowsheets = f"{_namespace}.flowsheets"


EntryPointContent = Union[ModuleType, type, object]


def get_entry_points_by_name(group_name: str) -> Dict[str, metadata.EntryPoint]:
    eps = metadata.entry_points()[group_name]
    # add logic here if/when we have to care about name conflicts
    by_name = {
        ep.name: ep
        for ep in eps
    }
    return by_name


def get_flowsheet_entry_point(name: str) -> metadata.EntryPoint:
    flowsheet_eps = get_entry_points_by_name(
        _ENTRY_POINT_GROUPS.flowsheets
    )
    return flowsheet_eps[name]


def load_flowsheet(name: str) -> EntryPointContent:
    ep = get_flowsheet_entry_point(name)
    return ep.load()
