// // backend/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Patient = require('../models/Patient');
// const Appointment = require('../models/Appointment');
// const Therapy = require('../models/Therapy');
// const Inventory = require('../models/Inventory');
// // GET /api/admin/stats - Fetch real dashboard statistics
// router.get('/stats', async (req, res) => {
//   try {
//     // Count real documents in MongoDB
//     const totalPatients = await Patient.countDocuments();
//     const totalAppointments = await Appointment.countDocuments();
//     const activeTherapies = await Therapy.countDocuments();
    
//     // We'll also fetch a few recent patients just to show some real names in the table
//     const recentPatients = await Patient.find().sort({ _id: -1 }).limit(5);

//     res.json({
//       totalPatients,
//       totalAppointments,
//       activeTherapies,
//       recentPatients
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
// // --- NEW PHARMACY INVENTORY ROUTES ---
// // GET /api/admin/inventory
// router.get('/inventory', async (req, res) => {
//   try {
//     const items = await Inventory.find().sort({ category: 1 });
//     res.json(items);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// // POST /api/admin/inventory (Add new stock)
// router.post('/inventory', async (req, res) => {
//   try {
//     const newItem = new Inventory(req.body);
//     const savedItem = await newItem.save();
//     res.json(savedItem);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });
// // DELETE /api/admin/inventory/:id (Remove stock)
// router.delete('/inventory/:id', async (req, res) => {
//   try {
//     const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
//     if (!deletedItem) {
//       return res.status(404).json({ message: 'Item not found' });
//     }
//     res.json({ message: 'Item permanently deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
// module.exports = router;

// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @route   GET /api/admin/dashboard
// @desc    Get system-wide stats for the NGO Admin
// @access  Private (Requires Token)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // 1. Verify this user is actually an Admin
    const admin = await User.findById(req.user.id).select('-password');
    if (!admin || admin.role !== 'NGO_Admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    // 2. Gather all system data concurrently for speed
    const [patients, practitioners, appointments] = await Promise.all([
      User.find({ role: 'Patient' }).select('-password'),
      User.find({ role: 'Practitioner' }).select('-password'),
      Appointment.find().sort({ scheduledDate: -1 }) // Newest first
    ]);

    // 3. Send the master payload
    res.json({
      admin,
      patients,
      practitioners,
      appointments
    });

  } catch (err) {
    console.error("Admin Dashboard Error:", err.message);
    res.status(500).json({ error: 'Server Error while fetching admin data.' });
  }
});

module.exports = router;