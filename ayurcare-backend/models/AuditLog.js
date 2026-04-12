// ayurcare-backend/models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminName: { type: String, required: true }, // Who did it?
  action: { type: String, required: true },    // What did they do? (e.g., DELETED_PATIENT)
  target: { type: String, required: true },    // Who was affected? (e.g., "Patient: Anup")
  details: { type: String },                   // Extra context
  date: { type: Date, default: Date.now }      // Exact timestamp
});

module.exports = mongoose.model('AuditLog', auditLogSchema);