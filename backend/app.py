import io
import numpy as np
from PIL import Image
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cat vs Dog Classifier",
    description="FastAPI endpoint for 60x60 Keras cat-dog model",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the my trained model
model = tf.keras.models.load_model("cat_dog.keras")

# For Output 
class_names = ['Cat', 'Dog']

@app.get("/")
def home():
    return {"message": "Welcome to your Cat vs Dog Classifier API!"}

@app.get("/predict")
def message():
    return {"message": "GET method on Predict is called."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read uploaded image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Preprocess image
    image = image.resize((60, 60))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Prediction
    prediction = model.predict(img_array)[0][0]


    label = class_names[1] if prediction >= 0.5 else class_names[0]

    confidence = float(prediction if prediction >= 0.5 else 1 - prediction)

    return {
        "filename": file.filename,
        "predicted_class": label,
        "confidence": round(confidence, 4)
    }