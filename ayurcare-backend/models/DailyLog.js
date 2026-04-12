// models/DailyLog.js
const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  dietFollowed: { 
    type: Boolean, 
    default: false 
  },
  medicinesTaken: { 
    type: Boolean, 
    default: false 
  },
  routineFollowed: {
    type: Boolean,
    default: false
  },
  // Scale of 1 to 10 (1 = terrible, 10 = feeling great)
  wellnessScore: { 
    type: Number, 
    min: 1, 
    max: 10, 
    required: true 
  },
  symptomsReported: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);