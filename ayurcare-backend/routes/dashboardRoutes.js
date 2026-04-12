// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();

// Import ONLY the functions we actually kept in the controller
const { getKPIs, getAlerts } = require('../controllers/dashboardController');
const { getAdvancedInsights } = require('../controllers/dashboardController');
const { getFeedbackData, addFeedback, getAuditLogs, createAuditLog } = require('../controllers/dashboardController');
// This single "God Route" now powers the entire Overview Dashboard
router.get('/kpis', getKPIs);

// We will save this route for when we build the Alerts page later
router.get('/alerts', getAlerts);
router.get('/advanced-insights', getAdvancedInsights);
router.get('/feedback', getFeedbackData);
router.get('/audit', getAuditLogs);
router.post('/feedback', addFeedback);
router.post('/audit', createAuditLog);
module.exports = router;    

