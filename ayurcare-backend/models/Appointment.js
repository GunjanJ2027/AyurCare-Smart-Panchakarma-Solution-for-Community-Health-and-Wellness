// ayurcare-backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapyName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  time: { type: String, required: true },
  therapistName: { type: String, default: 'Unassigned' },
  status: { type: String, enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'Missed'], default: 'Scheduled' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);