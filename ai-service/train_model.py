# ai-service/train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

print("Booting up ML Training Sequence...")

# 1. Create a synthetic dataset based on Ayurvedic principles
# Features: Body Frame, Digestion, Sleep Pattern, Stress Response
data = {
    'body_frame': ['Thin', 'Medium', 'Heavy', 'Thin', 'Medium', 'Heavy', 'Thin', 'Medium', 'Heavy', 'Thin'],
    'digestion': ['Irregular', 'Strong', 'Sluggish', 'Irregular', 'Strong', 'Sluggish', 'Strong', 'Irregular', 'Sluggish', 'Irregular'],
    'sleep': ['Light', 'Sound', 'Deep', 'Light', 'Sound', 'Deep', 'Light', 'Sound', 'Deep', 'Light'],
    'stress': ['Anxious', 'Angry', 'Withdrawn', 'Anxious', 'Angry', 'Withdrawn', 'Anxious', 'Angry', 'Withdrawn', 'Anxious'],
    'target_dosha': ['Vata', 'Pitta', 'Kapha', 'Vata', 'Pitta', 'Kapha', 'Vata', 'Vata', 'Kapha', 'Vata']
}

df = pd.DataFrame(data)

# 2. Machine Learning models only understand numbers. We must encode the text.
encoders = {}
for column in ['body_frame', 'digestion', 'sleep', 'stress']:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    encoders[column] = le # Save the encoder so we can use it on user input later

# 3. Separate Features (X) and Target (y)
X = df.drop('target_dosha', axis=1)
y = df['target_dosha']

# 4. Initialize and Train the Random Forest Classifier
print("Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 5. Save the trained model and the encoders to disk
joblib.dump(model, 'dosha_model.pkl')
joblib.dump(encoders, 'encoders.pkl')

print("Success! AI Model trained and saved as 'dosha_model.pkl'")