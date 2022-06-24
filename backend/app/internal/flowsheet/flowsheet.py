import os
import app
import json
import shutil

from watertap.ui.api import WorkflowActions

class Flowsheet:
    def __init__(self, id: int, flowsheet_interface) -> None:
        self.id = id
        self.flowsheet_interface = flowsheet_interface
        self.flowsheet_interface_json = None
        self.default_data_path = None
        self.data_path = None
        self.graph_path = None
        self.solve_path = None

        self.prepare_env()
        self.build()
        self._save_default_flowsheet()

        self.default_data = self.load_json(self.default_data_path)
        self.data = self.load_json(self.data_path)
        self.graph = self.load_graph(self.graph_path)
        #self.solve_results = self.load_txt(self.solve_path)

    def prepare_env(self):
        self.data_dir = os.path.join(
            os.path.dirname(app.__file__), '../data/flowsheets/%d' % self.id)

        if not os.path.exists(self.data_dir):
            # Create data directory for this flowsheet
            os.makedirs(self.data_dir)
            # TODO Remove later: Copy fake graph
            shutil.copyfile(
                os.path.join(self.data_dir, '../fake/graph.png'), # src
                os.path.join(self.data_dir, 'graph.png') # dst
                )

        self.default_data_path = os.path.join(self.data_dir, 'default_data.json')
        self.data_path = os.path.join(self.data_dir, 'data.json')
        self.graph_path = os.path.join(self.data_dir, 'graph.png')
        self.solve_path = os.path.join(self.data_dir, 'solve.txt')

    def build(self):
        self.flowsheet_interface.run_action(WorkflowActions.build)
        self.flowsheet_interface_json = self.flowsheet_interface.dict()
        self.flowsheet_interface_json['id'] = self.id

    def update(self, flowsheet_config):
        self.flowsheet_interface.update(flowsheet_config)
        self._save_flowsheet()
        return self.flowsheet_interface.dict()

    def solve(self):
        self.flowsheet_interface.run_action(WorkflowActions.solve)
        results = self.flowsheet_interface.dict()
        results['id'] = self.id
        with open(self.solve_path, 'w') as f:
            #f.write(results)
            json.dump(results, f, indent=4)
        return results

    def reset(self):
        with open(self.default_data_path, 'r') as f:
            self.default_fsi_json = json.load(f)
            return self.update(self.default_fsi_json)

    def _save_default_flowsheet(self):
        with open(self.default_data_path, 'w') as f_d, open(self.data_path, 'w') as f:
            json.dump(self.flowsheet_interface_json, f_d, indent=4)
            json.dump(self.flowsheet_interface_json, f, indent=4)

    def _save_flowsheet(self):
        with open(self.data_path, 'w') as f:
            json.dump(self.flowsheet_interface_json, f, indent=4)

    def load_txt(self, path):
        with open(path, 'r') as f:
            return f.read()
    
    def load_json(self, path):
        with open(path, 'r') as f:
            return json.load(f)
    
    def load_graph(self, path):
        with open(path, 'rb') as f:
            return f.read()

    def get_flowsheet_json(self):
        return self.flowsheet_interface_json

    def get_graph(self):
        return self.graph
