// backend/models/Therapy.js
const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number, required: true },
  targetDosha: [{ type: String }] // e.g., ['Vata', 'Pitta']
});

module.exports = mongoose.model('Therapy', therapySchema);