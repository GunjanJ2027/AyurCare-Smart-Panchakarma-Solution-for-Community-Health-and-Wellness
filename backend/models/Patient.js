// backend/models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: { type: String, required: true },
  age: { type: Number },
  phone: { type: String },
  doshaProfile: { 
    type: String, 
    enum: ['Vata', 'Pitta', 'Kapha', 'Unknown'],
    default: 'Unknown'
  },
  medicalHistory: [{ type: String }],
  emergencyContact: {
    name: { type: String },
    phone: { type: String }
  }
});

module.exports = mongoose.model('Patient', patientSchema);