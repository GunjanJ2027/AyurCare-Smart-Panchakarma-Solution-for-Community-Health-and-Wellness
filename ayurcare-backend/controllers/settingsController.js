// ayurcare-backend/controllers/settingsController.js
const Settings = require('../models/Settings');

// 1. Get the current settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ clinicId: 'main_clinic' });
    
    // If no settings exist yet, create the default ones
    if (!settings) {
      settings = await Settings.create({ clinicId: 'main_clinic' });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error fetching settings" });
  }
};

// 2. Update the settings
exports.updateSettings = async (req, res) => {
  try {
    const { clinic, notifications } = req.body;

    const updatedSettings = await Settings.findOneAndUpdate(
      { clinicId: 'main_clinic' },
      { clinic, notifications },
      { new: true, upsert: true } // Upsert creates it if it somehow got deleted
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error updating settings" });
  }
};