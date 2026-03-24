// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  therapyName: { type: String, required: true }, // Add this!
  time: { type: String }, // Add this!
  scheduledDate: { type: Date },
  status: { type: String, default: 'Scheduled' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);