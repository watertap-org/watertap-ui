import logging
from watertap.ui.api import find_flowsheet_interfaces, WorkflowActions
from .flowsheet import Flowsheet

_log = logging.getLogger(__name__)
_h = logging.StreamHandler()
_h.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
_log.addHandler(_h)
# for debugging, force level
_log.setLevel(logging.DEBUG)


class FlowsheetInterfacesHandler:
    def __init__(self) -> None:
        self.fsi_list = []
        self.fs_interfaces = {}
        self.retrieve_interfaces()

    def retrieve_interfaces(self):
        fsi_id = 0
        config = {'packages': ['tutorials', 'watertap']}
        for _, fsi_interface in find_flowsheet_interfaces(config=config).items():
            fsi = Flowsheet(fsi_id, fsi_interface)
            self.fs_interfaces[fsi_id] = fsi
            fsi_id += 1 # increment id
            self.fsi_list.append(fsi.get_flowsheet_json())
            _log.info(f"Added flowsheet: {fsi_interface.name}")

    def get_list(self):
        return self.fsi_list

    def get_interface(self, id: int):
        if id not in self.fs_interfaces:
            raise KeyError(
                "Flowsheet interface with id '%d' is not identified" % id)
        return self.fs_interfaces[id]

    def get_interface_json(self, id: int):
        if id not in self.fs_interfaces:
            raise KeyError(
                "Flowsheet interface with id '%d' is not identified" % id)
        return self.fsi_list[id]


flowsheet_interfaces_handler = FlowsheetInterfacesHandler()
