import io
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from paper.paper import Paper

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/ready")
async def ready():
    return {"ready": True}

@app.get("/paper/img")
async def paper_image():
    p = Paper()
    img = p.getImg()
    return StreamingResponse(io.BytesIO(img), media_type="image/png")
