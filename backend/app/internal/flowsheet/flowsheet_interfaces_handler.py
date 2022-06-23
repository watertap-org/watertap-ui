from watertap.ui.api import find_flowsheet_interfaces, WorkflowActions
from .flowsheet import Flowsheet

class FlowsheetInterfacesHandler:
    def __init__(self) -> None:
        self.fsi_list = []
        self.fs_interfaces = {}
        self.retrieve_interfaces()

    def retrieve_interfaces(self):
        fsi_id = 0
        for _, fsi_interface in find_flowsheet_interfaces().items():
            fsi = Flowsheet(fsi_id, fsi_interface)
            self.fs_interfaces[fsi_id] = fsi
            fsi_id += 1 # increment id
            self.fsi_list.append(fsi.get_flowsheet_json())

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
