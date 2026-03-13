// backend/routes/practitioner.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// GET /api/practitioner/dashboard - Get practitioner data and patient list
router.get('/dashboard', auth, async (req, res) => {
  try {
    // 1. Security check: Ensure the logged-in user is actually a Practitioner
    if (req.user.role !== 'Practitioner') {
      return res.status(403).json({ message: 'Access denied: Practitioners only' });
    }

    // 2. Fetch the practitioner's own account info (excluding the password)
    const practitionerInfo = await User.findById(req.user.id).select('-password');
    
    // 3. Fetch all registered patients from the database
    const allPatients = await Patient.find().sort({ _id: -1 });

    // 4. Fetch actual appointments (will be empty for now until we build a booking system)
    const appointments = await Appointment.find({ practitionerId: req.user.id });

    res.json({
      practitioner: practitionerInfo,
      patients: allPatients,
      appointments: appointments
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE GOES HERE ---
// PUT /api/practitioner/patient/:id/dosha - Update a patient's Dosha
router.put('/patient/:id/dosha', auth, async (req, res) => {
  try {
    // Security check
    if (req.user.role !== 'Practitioner') {
      return res.status(403).json({ message: 'Access denied: Practitioners only' });
    }

    const { doshaProfile } = req.body;

    // Find the patient and update their profile
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      { doshaProfile: doshaProfile },
      { new: true } // This tells MongoDB to return the newly updated document
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Make sure this is always at the very bottom!
module.exports = router;