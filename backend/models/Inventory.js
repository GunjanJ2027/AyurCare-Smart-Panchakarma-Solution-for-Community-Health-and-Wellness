// backend/models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Oils', 'Herbs', 'Equipment'
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true }, // e.g., 'ml', 'grams', 'bottles'
  lastRestocked: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);