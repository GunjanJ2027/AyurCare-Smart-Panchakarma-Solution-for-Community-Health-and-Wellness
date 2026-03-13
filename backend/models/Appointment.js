// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  practitionerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Linking to the Practitioner's User account
    required: true
  },
  therapyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapy',
    required: true
  },
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);