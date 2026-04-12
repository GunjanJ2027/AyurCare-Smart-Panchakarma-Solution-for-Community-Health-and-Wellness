// routes/patientRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import Controllers
const { 
  getPatients, 
  createPatient, 
  deletePatient, 
  getPatientProfile, 
  updatePatient,
  updateTherapyPlan 
} = require('../controllers/patientController');

// 2. Import Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// --- ROUTES ---

// General Patient Management
router.get('/', protect, getPatients);
router.post('/', protect, createPatient);
router.get('/list', protect, getPatients); 

// Patient Profile & Treatment History
router.get('/:id', protect, getPatientProfile);
router.put('/:id', protect, updatePatient);
router.put('/:id/therapy-plan', updateTherapyPlan);
// ONLY Admins can delete a patient record!
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;