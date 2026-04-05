const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/chatbot/query
router.post('/query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ response: "Please provide a question." });
  }

  try {
    // 1. Initialize the AI with your secret key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 2. Select the model (gemini-1.5-flash is fast and optimized for chat)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. The "System Prompt" - This tells the AI who it is and how to behave
    const prompt = `
      You are an expert Ayurvedic health assistant for a platform called AyurCare.
      Answer the following user question strictly using traditional Ayurvedic principles (Vata, Pitta, Kapha, Panchakarma, holistic diets).
      Tone: Empathetic, professional, and holistic.
      Constraint: Keep your answer concise (under 4 sentences). Do not give direct medical diagnoses.
      
      User Question: ${query}
    `;

    // 4. Ask the AI and wait for the real response
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Send the AI's organic text back to the Flutter app
    res.json({ response: responseText });
    
  } catch (err) {
    console.error("AI Generation Error:", err.message);
    res.status(500).json({ response: "I am having trouble connecting to my AI network right now. Please try again later." });
  }
});

module.exports = router;