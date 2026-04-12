// // ayurcare-backend/models/Patient.js
// const mongoose = require('mongoose');

// const patientSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   phone: { 
//     type: String 
//   },
//   age: { 
//     type: Number 
//   },
//   assignedTherapy: { 
//     type: String 
//   },
  
//   // 👉 This is where the "Complete Session" notes will be saved!
//   medicalHistory: [{
//     date: { type: Date },
//     therapy: { type: String },
//     notes: { type: String },
//     feedback: { type: String }
//   }]
  
// }, { timestamps: true });

// module.exports = mongoose.model('Patient', patientSchema);


// ayurcare-backend/models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String 
  },
  age: { 
    type: Number 
  },
  assignedTherapy: { 
    type: String 
  },
  
  // 👉 NEW: Advanced Therapy Plan Builder array
  therapyPlan: [{
    therapyName: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "7 Days", "14 Days"
    frequency: { type: String, default: "Daily" }, // e.g., "Daily", "Weekly"
    instructions: { type: String } // Specific notes for this step
  }],

  // 👉 This is where the "Complete Session" notes will be saved!
  medicalHistory: [{
    date: { type: Date },
    therapy: { type: String },
    notes: { type: String },
    feedback: { type: String }
  }]
  
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);