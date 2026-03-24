// backend/routes/patient.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Therapy = require('../models/Therapy');

// GET /api/patient/me - Get current logged in patient's profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Patient.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Patient profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/patient/book - Book a new therapy session (UPDATED & BULLETPROOF)
router.post('/book', auth, async (req, res) => {
  try {
    const { therapyName, date, time } = req.body;

    // Safely find a practitioner, but don't crash if one doesn't exist yet
    let practitioner = await User.findOne({ role: 'Practitioner' });
    let practId = practitioner ? practitioner._id : null;

    // Create and SAVE the appointment with the new fields
    const newAppointment = new Appointment({
      patientId: req.user.id,
      practitionerId: practId,
      therapyName: therapyName, 
      time: time,
      scheduledDate: new Date(`${date}T00:00:00.000Z`), 
      status: 'Scheduled',
      notes: `Patient booked via portal.`
    });

    await newAppointment.save();
    
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).send('Server Error');
  }
});

// GET /api/patient/my-appointments - Fetch ONLY the logged-in patient's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    // Find appointments belonging to this specific user
    const appointments = await Appointment.find({ patientId: req.user.id }).sort({ scheduledDate: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/patient/appointments/all - Fetch ALL appointments for Admin/Doctor
router.get('/appointments/all', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ scheduledDate: 1 }); 
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;