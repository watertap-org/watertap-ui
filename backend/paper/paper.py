import os

class Paper:
    def __init__(self) -> None:
        self.imgPath = os.path.join(os.path.dirname(__file__), 'jointjs_idaes_img.png')
        self.file = None
        self.loadFile()
    
    def loadFile(self):
        with open(self.imgPath, 'rb') as f:
            print("type(f):", type(f))
            print(dir(f))
            self.file = f.read()

    def getImg(self):
        return self.file
