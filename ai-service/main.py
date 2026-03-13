# ai-service/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AyurCare AI Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DoshaRequest(BaseModel):
    answers: dict

class ChatRequest(BaseModel):
    message: str

class SentimentRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "AI Microservice is running"}

@app.post("/predict-dosha")
def predict_dosha(request: DoshaRequest):
    scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
    answers = request.answers
    
    if answers.get("frame") == "thin": scores["Vata"] += 3
    elif answers.get("frame") == "medium": scores["Pitta"] += 3
    elif answers.get("frame") == "large": scores["Kapha"] += 3
    
    if answers.get("digestion") == "irregular": scores["Vata"] += 3
    elif answers.get("digestion") == "strong": scores["Pitta"] += 3
    elif answers.get("digestion") == "slow": scores["Kapha"] += 3
    
    if answers.get("sleep") == "light": scores["Vata"] += 2
    elif answers.get("sleep") == "moderate": scores["Pitta"] += 2
    elif answers.get("sleep") == "heavy": scores["Kapha"] += 2
    
    if answers.get("skin") == "dry": scores["Vata"] += 2
    elif answers.get("skin") == "warm_oily": scores["Pitta"] += 2
    elif answers.get("skin") == "cool_thick": scores["Kapha"] += 2

    primary_dosha = max(scores, key=scores.get)
    total_score = sum(scores.values())
    confidence = round((scores[primary_dosha] / total_score) * 100) if total_score > 0 else 0
    
    sorted_doshas = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    if total_score > 0 and (sorted_doshas[0][1] - sorted_doshas[1][1] <= 2):
        primary_dosha = f"{sorted_doshas[0][0]}-{sorted_doshas[1][0]}"
        confidence = round(((sorted_doshas[0][1] + sorted_doshas[1][1]) / total_score) * 100)

    therapy_map = {
        "Vata": ["Basti (Herbal Enema)", "Abhyanga (Warm Oil Massage)", "Shirodhara"],
        "Pitta": ["Virechana (Purgation)", "Shirodhara (Oil Pouring)", "Takradhara"],
        "Kapha": ["Vamana (Therapeutic Emesis)", "Nasya (Nasal Therapy)", "Udvartana (Powder Massage)"],
        "Vata-Pitta": ["Shirodhara", "Basti", "Virechana"],
        "Pitta-Kapha": ["Virechana", "Nasya"],
        "Vata-Kapha": ["Nasya", "Basti", "Udvartana"]
    }
    
    recommended_therapies = therapy_map.get(primary_dosha, ["Consult Practitioner for Custom Plan"])

    return {
        "dosha": primary_dosha,
        "confidence": confidence / 100.0,
        "insights": f"Based on your specific traits, the model detected strong indicators of {primary_dosha} characteristics. Your digestion and sleep patterns heavily influenced this result.",
        "raw_scores": scores,
        "recommendations": recommended_therapies
    }

@app.post("/chatbot")
def ayurveda_chat(request: ChatRequest):
    lower_msg = request.message.lower()
    if any(word in lower_msg for word in ["pain", "ache", "joint", "back"]):
         reply = "For joint or muscle pain, therapies like Kati Basti or Janu Basti are highly recommended. Applying warm Mahanarayan oil can provide immediate relief."
    elif any(word in lower_msg for word in ["digestion", "stomach", "acid", "gas"]):
         reply = "Digestive issues often indicate a Pitta or Vata imbalance. Virechana is an excellent Panchakarma therapy for this. Try sipping warm cumin-coriander-fennel (CCF) tea."
    elif any(word in lower_msg for word in ["sleep", "insomnia", "stress", "anxiety"]):
         reply = "Shirodhara is the ultimate Ayurvedic treatment for stress and sleep issues. It profoundly relaxes the nervous system."
    elif any(word in lower_msg for word in ["book", "appointment", "schedule"]):
         reply = "You can book a therapy session directly from your Patient Dashboard using the 'Book Now' button!"
    else:
         reply = "I am the AyurCare AI assistant. I can help answer questions about Panchakarma therapies, dosha imbalances, and wellness tips. How can I assist you today?"
    return {"reply": reply}

# --- NEW: AI SENTIMENT ANALYSIS ROUTE ---
@app.post("/analyze-sentiment")
def analyze_sentiment(request: SentimentRequest):
    text = request.text.lower()
    
    # Simple NLP keyword algorithm for prototype
    positive_words = ["good", "better", "great", "relief", "energized", "light", "sleep well", "less", "improving"]
    negative_words = ["pain", "worse", "heavy", "tired", "exhausted", "nausea", "ache", "bad", "sluggish", "sore"]

    pos_count = sum(1 for word in positive_words if word in text)
    neg_count = sum(1 for word in negative_words if word in text)

    if pos_count > neg_count:
        sentiment = "Positive Trend"
        status = "Patient is recovering well. Therapy is highly effective."
        color = "green"
    elif neg_count > pos_count:
        sentiment = "Negative / Warning"
        status = "Patient is experiencing discomfort. Intervention or therapy adjustment recommended."
        color = "red"
    else:
        sentiment = "Neutral / Mixed"
        status = "Patient is stabilizing. Continue monitoring daily logs."
        color = "yellow"

    return {
        "sentiment": sentiment,
        "status": status,
        "color": color
    }