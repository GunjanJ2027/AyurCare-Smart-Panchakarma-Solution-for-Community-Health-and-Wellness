const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  energy: { type: Number, required: true },     // Scale 1-10
  digestion: { type: Number, required: true },  // Scale 1-10
  sleep: { type: Number, required: true },      // Scale 1-10
  symptoms: { type: String }                    // Any specific notes
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);