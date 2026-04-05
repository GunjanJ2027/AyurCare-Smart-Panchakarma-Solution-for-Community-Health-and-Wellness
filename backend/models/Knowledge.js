const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  response: { type: String, required: true }
});

module.exports = mongoose.model('Knowledge', KnowledgeSchema);