// controllers/logController.js
const DailyLog = require('../models/DailyLog');

// 1. Save a new daily log
exports.addDailyLog = async (req, res) => {
  try {
    const newLog = new DailyLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(400).json({ message: 'Failed to save log', error: error.message });
  }
};

// 2. Get all logs for a specific patient
exports.getPatientLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
};