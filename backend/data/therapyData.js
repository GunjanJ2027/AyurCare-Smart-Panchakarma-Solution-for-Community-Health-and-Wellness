// backend/data/therapyData.js
const therapyKnowledgeBase = {
  "Virechana": {
    title: "Virechana Protocol (Purgation Therapy)",
    tagline: "Detoxification for Pitta Dosha",
    description: "Virechana is a medically supervised purgation therapy that primarily cleanses the gastrointestinal tract and purifies the blood of excess Pitta toxins.",
    benefits: ["Clears skin disorders", "Improves digestion and metabolism", "Reduces internal inflammation"],
    instructions: "Patient must strictly follow a light diet (Kichari) for 3 days post-therapy. Drink only warm water. Avoid direct sunlight and cold winds."
  },
  "Shirodhara": {
    title: "Shirodhara Protocol (Oil Pouring)",
    tagline: "Deep Nervous System Restoration",
    description: "Shirodhara involves gently pouring liquids over the forehead (the 'third eye'). It profoundly relaxes the nervous system and balances Vata dosha.",
    benefits: ["Relieves stress and anxiety", "Improves sleep quality", "Reduces hypertension"],
    instructions: "Keep the head covered and warm for 24 hours post-treatment. Avoid caffeine and heavy screens. Rest in a quiet environment."
  },
  "Abhyanga": {
    title: "Abhyanga Protocol (Ayurvedic Massage)",
    tagline: "Full-Body Oleation Therapy",
    description: "A full-body massage using warm, herb-infused oils specific to the patient's dosha. Promotes lymphatic drainage and deep tissue nourishment.",
    benefits: ["Nourishes the skin", "Lubricates joints", "Stimulates internal organs"],
    instructions: "Leave the oil on the body for at least 30 minutes before taking a warm (not hot) shower. Use a mild herbal soap."
  },
  "Basti": {
    title: "Basti Protocol (Herbal Enema)",
    tagline: "The Mother of All Treatments",
    description: "Basti involves the introduction of herbal decoctions and oils into the colon. It is the most effective treatment for balancing severe Vata disorders.",
    benefits: ["Cleanses the colon", "Relieves chronic constipation", "Strengthens the lower back and bones"],
    instructions: "Patient must rest immediately following the procedure. Consume only easily digestible, warm, soupy foods for the next 2 meals."
  }
};

module.exports = therapyKnowledgeBase;