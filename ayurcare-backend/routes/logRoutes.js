// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const { addDailyLog, getPatientLogs } = require('../controllers/logController');

router.post('/', addDailyLog);
router.get('/:patientId', getPatientLogs);

module.exports = router;