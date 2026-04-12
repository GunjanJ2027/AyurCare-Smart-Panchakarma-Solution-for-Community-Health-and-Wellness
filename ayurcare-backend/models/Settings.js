// ayurcare-backend/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Only one settings document will ever exist, so we give it a static ID
  clinicId: { type: String, default: 'main_clinic', unique: true },
  
  clinic: {
    name: { type: String, default: 'AyurCare Wellness Center' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '123 Ayurveda Street, Wellness District' }
  },
  notifications: {
    emailAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    dailyDigest: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);