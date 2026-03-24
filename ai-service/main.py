# ai-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI(title="AyurCare AI Microservice")

# Allow your React app to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML Model and Encoders into memory when the server starts
try:
    model = joblib.load('dosha_model.pkl')
    encoders = joblib.load('encoders.pkl')
    print("AI Model loaded successfully into memory.")
except Exception as e:
    print("Error loading model. Did you run train_model.py first?")

# Define the exact data structure we expect from React
class DoshaAssessmentInput(BaseModel):
    body_frame: str
    digestion: str
    sleep: str
    stress: str

@app.get("/")
async def root():
    return {"message": "AyurCare AI Microservice is running."}

@app.post("/predict-dosha")
async def predict_dosha(patient_data: DoshaAssessmentInput):
    try:
        # 1. Convert the incoming JSON into a Pandas DataFrame
        input_df = pd.DataFrame([patient_data.dict()])

        # 2. Encode the incoming text into numbers using our saved encoders
        for column in input_df.columns:
            if column in encoders:
                # Handle cases where the user inputs a string the model hasn't seen
                try:
                    input_df[column] = encoders[column].transform(input_df[column])
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Invalid value for {column}")

        # 3. Run the Machine Learning Prediction
        prediction = model.predict(input_df)
        predicted_dosha = prediction[0]

        # 4. Get the confidence probabilities for the evaluator to see!
        probabilities = model.predict_proba(input_df)[0]
        confidence_scores = {
            class_name: round(prob * 100, 2) 
            for class_name, prob in zip(model.classes_, probabilities)
        }

        return {
            "status": "success",
            "predicted_dosha": predicted_dosha,
            "confidence_scores": confidence_scores,
            "model_used": "RandomForestClassifier"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))