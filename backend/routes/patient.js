const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Therapy = require('../models/Therapy');
const HealthLog = require('../models/HealthLog'); 

// --- 1. PROFILE ROUTES ---

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

// POST /api/patient/update-dosha - Saves the Dosha Quiz result
router.post('/update-dosha', auth, async (req, res) => {
  try {
    const { dosha } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.doshaProfile = dosha;
    await user.save();
    res.json({ message: "Dosha profile updated!", dosha: user.doshaProfile });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// GET /api/patient/dashboard - Master route for Flutter Home Screen
router.get('/dashboard', auth, async (req, res) => {
  try {
    const patient = await User.findById(req.user.id).select('-password');
    if (!patient) return res.status(404).json({ error: 'Patient profile not found.' });

    const appointments = await Appointment.find({ patientId: req.user.id })
                                          .sort({ scheduledDate: 1 }); 

    res.json({
      patient: patient,
      appointments: appointments
    });
  } catch (err) {
    console.error("Patient Dashboard Error:", err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- 2. SMART SCHEDULING ROUTES ---

// GET /api/patient/available-slots - Real-time availability & Clock Sync
router.get('/available-slots', auth, async (req, res) => {
  const { date } = req.query; // Expects YYYY-MM-DD
  const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHour = now.getHours(); 

    const existingBookings = await Appointment.find({
      scheduledDate: new Date(`${date}T00:00:00.000Z`),
      status: { $ne: 'Cancelled' }
    });

    const bookedTimes = existingBookings.map(b => b.time);
    const practitionerCount = await User.countDocuments({ role: 'Practitioner' });
    
    const availableSlots = allSlots.filter(slot => {
      const bookingsAtTime = bookedTimes.filter(t => t === slot).length;
      if (bookingsAtTime >= practitionerCount) return false;

      if (date === todayStr) {
        let [time, modifier] = slot.split(' ');
        let [hours] = time.split(':');
        let slotHour = parseInt(hours);

        if (modifier === 'PM' && slotHour !== 12) slotHour += 12;
        if (modifier === 'AM' && slotHour === 12) slotHour = 0;

        return slotHour > currentHour;
      }

      return true;
    });

    res.json(availableSlots);
  } catch (err) {
    console.error("Slots Error:", err);
    res.status(500).send('Server Error');
  }
});

// --- UPGRADED BOOKING ROUTE ---
// Works for both Patients (self) and Practitioners (for others)
router.post('/book', auth, async (req, res) => {
  try {
    const { therapyName, date, time, patientId } = req.body;

    // Use provided patientId (if practitioner) or fallback to logged-in user ID
    const targetPatientId = (req.user.role === 'Practitioner' || req.user.role === 'Admin') 
      ? patientId 
      : req.user.id;

    if (!targetPatientId) return res.status(400).json({ error: "Patient ID is required." });

    const busyPractitioners = await Appointment.find({
      scheduledDate: new Date(`${date}T00:00:00.000Z`),
      time: time,
      status: { $ne: 'Cancelled' }
    }).distinct('practitionerId');

    const availablePractitioner = await User.findOne({
      role: 'Practitioner',
      _id: { $nin: busyPractitioners }
    });

    if (!availablePractitioner) {
      return res.status(400).json({ error: 'No practitioners available at this time.' });
    }

    const newAppointment = new Appointment({
      patientId: targetPatientId,
      practitionerId: availablePractitioner._id,
      therapyName,
      time,
      scheduledDate: new Date(`${date}T00:00:00.000Z`),
      status: 'Scheduled'
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Success', appointment: newAppointment });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/patient/appointment/:id/cancel - Cancel a session
router.delete('/appointment/:id/cancel', auth, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, patientId: req.user.id });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    
    appt.status = 'Cancelled';
    await appt.save();
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- 3. DATA FETCHING ROUTES ---

// GET /api/patient/my-appointments - User's personal list
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id }).sort({ scheduledDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/patient/appointments/all - For System Overview
router.get('/appointments/all', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ scheduledDate: 1 }); 
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- 4. FEEDBACK ROUTES ---

// POST /api/patient/appointment/:id/feedback
router.post('/appointment/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const appt = await Appointment.findById(req.params.id);
    
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    
    appt.feedback = { rating, comment };
    await appt.save();
    
    res.json({ message: "Feedback saved successfully!" });
  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).send("Server Error");
  }
});

// --- 5. SMART REMINDERS & THERAPY PLANS ---

const THERAPY_KNOWLEDGE = {
  "Abhyanga (Oil Massage)": {
    duration: "7 Days",
    stages: [
      { phase: "Purva Karma (Prep)", desc: "Internal oleation with medicated ghee to loosen toxins." },
      { phase: "Pradhana Karma (Main)", desc: "Full body herbal oil massage (45 mins daily) to mobilize doshas." },
      { phase: "Paschat Karma (Post)", desc: "Rest, light diet, and avoiding extreme temperatures." }
    ],
    diet: {
      pathya: ["Warm water", "Kitchari (Mung bean & rice)", "Cooked root vegetables", "Ginger tea"],
      apathya: ["Cold/Iced drinks", "Raw salads", "Heavy dairy (Cheese/Ice cream)", "Caffeine"]
    },
    pre: ["Fast for 2 hours before session", "Wear loose cotton clothing", "Hydrate well"],
    post: ["Avoid cold showers for 4 hours", "Stay out of direct sunlight", "Eat a light warm meal"],
    medicines: ["Dhanwantharam Gulika (Before Bed)", "Ashwagandha Arishta (Post Meal)"]
  },
  "Virechana (Detox)": {
    duration: "14 Days",
    stages: [
      { phase: "Snehana & Swedana", desc: "Internal ghee consumption for 3-7 days, followed by steam therapy." },
      { phase: "Pradhana Karma", desc: "Therapeutic purgation on the designated day." },
      { phase: "Samsarjana Krama", desc: "Strict, phased re-introduction of solid foods over 3-5 days." }
    ],
    diet: {
      pathya: ["Peya (Rice water)", "Vilepi (Thick rice soup)", "Warm herbal teas"],
      apathya: ["Spicy/Fried foods", "Meat", "Cold water", "Daytime sleeping"]
    },
    pre: ["Follow strict Snehana diet", "No heavy physical activity", "Drink warm water only"],
    post: ["Strict Samsarjana diet", "Avoid sleep during the day", "Rest in a draft-free room"],
    medicines: ["Avipattikar Churna (Morning)", "Triphala Ghritham"]
  },
  "General Wellness": {
    duration: "Ongoing",
    stages: [
      { phase: "Daily Routine (Dinacharya)", desc: "Waking up early, tongue scraping, and gentle yoga." }
    ],
    diet: {
      pathya: ["Fresh seasonal fruits", "Warm cooked meals", "Hydration"],
      apathya: ["Processed foods", "Late night meals"]
    },
    pre: ["Arrive 10 mins early", "Carry your health ID"],
    post: ["Observe 10 mins of silence", "Note any changes in energy"],
    medicines: ["Daily Chyawanprash (1 tsp)"]
  }
};

// GET /api/patient/reminders - Generate Smart Reminders based on upcoming therapy
router.get('/reminders', auth, async (req, res) => {
  try {
    const upcoming = await Appointment.findOne({ 
      patientId: req.user.id, 
      status: 'Scheduled' 
    }).sort({ scheduledDate: 1 });

    if (!upcoming) {
      return res.json({
        type: "General",
        instructions: THERAPY_KNOWLEDGE["General Wellness"],
        message: "No immediate therapy scheduled. Stay mindful of your Dosha diet!"
      });
    }

    const therapyInfo = THERAPY_KNOWLEDGE[upcoming.therapyName] || THERAPY_KNOWLEDGE["General Wellness"];
    
    res.json({
      therapyName: upcoming.therapyName,
      date: upcoming.scheduledDate,
      time: upcoming.time,
      instructions: therapyInfo,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- 6. HEALTH TRACKING ROUTES ---

// POST /api/patient/health-log - Save today's health metrics
router.post('/health-log', auth, async (req, res) => {
  try {
    const { energy, digestion, sleep, symptoms } = req.body;
    
    const newLog = new HealthLog({
      patientId: req.user.id,
      energy,
      digestion,
      sleep,
      symptoms
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error("Health Log Error:", err);
    res.status(500).send("Server Error");
  }
});

// GET /api/patient/health-logs - Fetch historical data for charts
router.get('/health-logs', auth, async (req, res) => {
  try {
    const logs = await HealthLog.find({ patientId: req.user.id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    console.error("Fetch Logs Error:", err);
    res.status(500).send("Server Error");
  }
});

// --- 7. PRACTITIONER DASHBOARD ROUTES ---

// Update status, notes, and therapist assignment
router.put('/appointment/:id/status', auth, async (req, res) => {
  const { status, notes, therapistName } = req.body;
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (therapistName) appointment.therapistName = therapistName;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).send('Server Error');
  }
});

// GET /api/patient/record/:id - Doctor's view of a specific patient
router.get('/record/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const logs = await HealthLog.find({ patientId: req.params.id }).sort({ date: 1 });
    const appointments = await Appointment.find({ patientId: req.params.id }).sort({ scheduledDate: -1 });

    res.json({
      profile: user,
      logs: logs,
      history: appointments
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;