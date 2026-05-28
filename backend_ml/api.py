# backend_ml/api.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from main import scan_disease
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "./my_model"

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Save uploaded image to a temp file since scan_disease takes a file path
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        label, confidence = scan_disease(tmp_path, MODEL_PATH)
    finally:
        os.remove(tmp_path)  # clean up temp file

    return {
        "disease": label,
        "confidence": confidence
    }