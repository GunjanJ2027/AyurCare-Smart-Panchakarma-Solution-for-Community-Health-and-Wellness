// // routes/appointmentRoutes.js
// const express = require('express');
// const router = express.Router();

// // We must import ALL THREE functions here!
// const { getAppointments, createAppointment, updateAppointmentStatus } = require('../controllers/appointmentController'); 

// router.get('/', getAppointments);
// router.post('/', createAppointment);
// router.put('/:id/status', updateAppointmentStatus); // Now it knows what this is!

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { 
//   getAppointments, 
//   createAppointment, 
//   updateAppointmentStatus,
//   completeAppointment // <--- 1. Import the new function here
// } = require('../controllers/appointmentController');

// // Existing routes
// router.get('/', getAppointments);
// router.post('/', createAppointment);
// router.put('/:id', updateAppointmentStatus);

// // 2. Add the new COMPLETION route
// router.put('/:id/complete', completeAppointment); 

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus,
  completeAppointment 
} = require('../controllers/appointmentController');

// Existing routes
router.get('/', getAppointments);
router.post('/', createAppointment);

// 👉 FIX: Added '/status' to match what the React frontend is sending!
router.put('/:id/status', updateAppointmentStatus);

// Completion route
router.put('/:id/complete', completeAppointment); 

module.exports = router;