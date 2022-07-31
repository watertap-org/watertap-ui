import io
import os
from pathlib import Path
from fastapi import Request, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
import pandas as pd
from typing import Optional, List, Dict

from app.internal.flowsheet.flowsheet import Flowsheet

#    flowsheet_interfaces_handler,
# )

from watertap.ui.api import find_flowsheet_interfaces, WorkflowActions

router = APIRouter(
    prefix="/flowsheets",
    tags=["flowsheets"],
    responses={404: {"description": "Flowsheet not found"}},
)


class Interfaces:
    """List of available flowsheet interfaces."""

    #: If no packages are provided to constructor, use these
    DEFAULT_PACKAGES = ("tutorials", "watertap")

    def __init__(
        self,
        packages: Optional[List[str]] = None,
        add_packages: bool = False,
    ):
        """Build list of flowsheet interfaces from provided package(s).

        Args:
            packages: List of package names. If not given, use list in
               :attr:`DEFAULT_PACKAGES`.
            add_packages: if True, add packages in `packages` to the defaults.
               Otherwise, replace default packages. Does nothing if no packages are
               provided.
        """
        if packages is None:
            pkglist = list(self.DEFAULT_PACKAGES)
        else:
            if add_packages:
                pkglist = list(self.DEFAULT_PACKAGES) + list(packages)
            else:
                pkglist = list(packages)
        assert len(pkglist) > 0, "No packages provided, so no interfaces can be found"
        self._interfaces = []
        interface_iter = find_flowsheet_interfaces(config={"packages": pkglist})
        for i, fsi in enumerate(interface_iter.values()):
            self._interfaces.append(Flowsheet(i, fsi))

    def __getitem__(self, i):
        """Get flowsheet interface at index.

        Args:
            i: Index in list of interfaces (zero-based)

        Raises:
            HTTPException: on IndexError or for a negative index
        """
        if i < 0:
            raise HTTPException(status_code=400, detail=f"Invalid flowsheet id. id={i}")
        try:
            fs = self._interfaces[i]
        except IndexError:
            raise HTTPException(status_code=404, detail=f"Flowsheet not found. id={i}")
        return fs

    def __len__(self):
        return len(self._interfaces)

_interfaces = Interfaces()

# Routes
# ------


@router.get("/")
async def get_all() -> List[Dict]:
    """Get all known flowsheet interfaces."""
    return [
        {
            "id": i,
            "name": _interfaces[i].get_flowsheet_name(),
            "train": "",
            "lastRun": "",
            "created": "",
        }
        for i in range(len(_interfaces))
    ]


@router.get("/{flowsheet_id}/config")
async def get_config(flowsheet_id: int):
    """Get configuration (all information) for a flowsheet."""
    return _interfaces[flowsheet_id].get_flowsheet_json()


@router.get("/{flowsheet_id}/graph")
async def get_graph(flowsheet_id: int) -> StreamingResponse:
    """Get the diagram for the given flowsheet."""
    graph = _interfaces[flowsheet_id].get_graph()
    return StreamingResponse(io.BytesIO(graph), media_type="image/png")


@router.get("/{flowsheet_id}/solve")
async def solve(flowsheet_id: int):
    """Solve the given flowsheet."""
    results, history = _interfaces[flowsheet_id].solve()
    return history


@router.post("/{flowsheet_id}/reset")
async def reset(flowsheet_id: int):
    """Reset the given flowsheet."""
    return _interfaces[flowsheet_id].reset()


@router.post("/{flowsheet_id}/update")
async def update(flowsheet_id: int, request: Request):
    """Update variables in the flowsheet with the JSON value of the `request`."""
    fs = _interfaces[flowsheet_id]
    updated_fs_config = await request.json()
    updated_fs_config = fs.update(updated_fs_config)
    return updated_fs_config


@router.post("/{flowsheet_id}/download")
async def download(flowsheet_id: int, request: Request):
    """Download the comparison of two solutions of the given flowsheet.

    The expected structure of the JSON data in `request` is::

        [
          // first set of outputs
          {"output": {
             "<category-name-1>": {
               "<metric-name-1>": [<value>, "<units>"],
               "<metric-name-2>": [<value>, "<units>"],
               ...
            }
             "<category-name-2>": {
               "<metric-name-1>": [<value>, "<units>"],
               "<metric-name-2>": [<value>, "<units>"],
               ...
            },
            ...
          },
          // repeat for second set of outputs
          {"output": {
             ...
          }
        ]

       The assumption is that the categories, and metrics in each category, are
       the same for each output.
    """
    # extract data from request
    data = await request.json()
    values = data[0]["output"], data[1]["output"]

    # build dataframe for export
    df = pd.DataFrame({}, columns=["category", "metric", "units", "v1", "v2", "v1-v2"])
    idx, first_value = 0, values[0]
    for catg in first_value:
        for metric in first_value[catg]:
            v = [values[i][catg][metric][0] for i in (0, 1)]
            u = [values[i][catg][metric][1] for i in (0, 1)]
            # assume units match
            assert u[0] == u[1]  # front-end should guarantee this
            try:
                delta_v = v[0] - v[1]
            except Exception:
                # don't crash if we can't subract values
                delta_v = pd.NA
            # add row
            df.loc[idx] = [catg, metric, u[0], v[0], v[1], delta_v]
            idx += 1

    # export dataframe
    fs = _interfaces[flowsheet_id]
    fpath = Path(fs.data_dir) / "comparison_results.csv"
    df.to_csv(fpath, index=False)

    return FileResponse(fpath)
