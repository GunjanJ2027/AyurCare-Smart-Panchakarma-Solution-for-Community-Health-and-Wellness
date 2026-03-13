// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Therapy = require('../models/Therapy');

// GET /api/admin/stats - Fetch real dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Count real documents in MongoDB
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeTherapies = await Therapy.countDocuments();
    
    // We'll also fetch a few recent patients just to show some real names in the table
    const recentPatients = await Patient.find().sort({ _id: -1 }).limit(5);

    res.json({
      totalPatients,
      totalAppointments,
      activeTherapies,
      recentPatients
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;