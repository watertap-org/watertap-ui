import os
import app
import json

class Flowsheet:
    def __init__(self, id) -> None:
        self.id = id
        self.data_path = os.path.join(
            os.path.dirname(app.__file__),
            '../data/flowsheets/%s/data.json' % id)
        self.graph_path = os.path.join(
            os.path.dirname(app.__file__),
            '../data/flowsheets/%s/graph.png' % id)
        self.solve_path = os.path.join(
            os.path.dirname(app.__file__),
            '../data/flowsheets/%s/solve.txt' % id)

        self.data = self.load_json(self.data_path)
        self.graph = self.load_graph(self.graph_path)
        self.solve_result = self.load_txt(self.solve_path)

    def load_txt(self, path):
        with open(path, 'r') as f:
            return f.read()
    
    def load_json(self, path):
        with open(path, 'r') as f:
            return json.load(f)
    
    def load_graph(self, path):
        with open(path, 'rb') as f:
            return f.read()

    def get_data(self):
        return self.data

    def get_graph(self):
        return self.graph

    def solve(self):
        return self.solve_result
