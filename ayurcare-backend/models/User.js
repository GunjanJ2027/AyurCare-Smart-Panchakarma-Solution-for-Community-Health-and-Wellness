// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   age: { type: Number },
//   phone: { type: String },
  
//   // NEW: Fields for Digital Records & Therapy Plans
//   medicalHistory: { type: String, default: '' },
//   therapyPlan: { type: String, default: '' },
//   internalNotes: { type: String, default: '' },
  
//   role: { type: String, enum: ['admin', 'practitioner', 'ngo', 'patient'], default: 'patient' }
// }, { 
//   timestamps: true 
// });

// module.exports = mongoose.model('User', userSchema);

// ayurcare-backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  phone: { type: String },
  
  // Internal private notes (kept as a simple string)
  internalNotes: { type: String, default: '' },
  
  // 👉 NEW: Advanced Therapy Plan Builder array
  therapyPlan: [{
    therapyName: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "7 Days", "14 Days"
    frequency: { type: String, default: "Daily" }, // e.g., "Daily", "Weekly"
    instructions: { type: String } // Specific notes for this step
  }],

  // 👉 NEW: Session Feedback & Adherence Logs array
  medicalHistory: [{
    date: { type: Date },
    therapy: { type: String },
    notes: { type: String },
    feedback: { type: String }
  }],
  
  role: { type: String, enum: ['admin', 'practitioner', 'ngo', 'patient'], default: 'patient' }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);