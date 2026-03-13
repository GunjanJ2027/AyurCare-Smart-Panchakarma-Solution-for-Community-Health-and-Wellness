// backend/routes/patient.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');

// GET /api/patient/me - Get current logged in patient's profile
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id comes from the auth middleware!
    const profile = await Patient.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  // backend/routes/patient.js (Add this below the /me route)
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Therapy = require('../models/Therapy');

// POST /api/patient/book - Book a new therapy session
router.post('/book', auth, async (req, res) => {
  try {
    const { therapyName, date, time } = req.body;

    // 1. Find a practitioner to assign this to (for the prototype, we just grab the first available doctor)
    const practitioner = await User.findOne({ role: 'Practitioner' });
    if (!practitioner) {
      return res.status(400).json({ message: 'No practitioners currently available in the system.' });
    }

    // 2. Find or create the requested therapy in the database
    let therapy = await Therapy.findOne({ name: therapyName });
    if (!therapy) {
      therapy = new Therapy({ name: therapyName, durationMinutes: 60 });
      await therapy.save();
    }

    // 3. Create the new appointment
    const newAppointment = new Appointment({
      patientId: req.user.id,
      practitionerId: practitioner._id,
      therapyId: therapy._id,
      scheduledDate: new Date(`${date}T00:00:00.000Z`), // Store the date
      status: 'Scheduled',
      notes: `Patient requested time: ${time} IST`
    });

    await newAppointment.save();
    
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
});

module.exports = router;