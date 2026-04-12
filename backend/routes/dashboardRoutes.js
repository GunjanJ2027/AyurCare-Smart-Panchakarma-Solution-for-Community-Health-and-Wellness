// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getKPIs, 
  getRecoveryTrends, 
  getTherapyDistribution, 
  getAlerts 
} = require('../controllers/dashboardController');

// Add your authentication/admin middleware here to protect these routes!
// router.use(protect, authorize('admin', 'practitioner'));

router.get('/kpis', getKPIs);
router.get('/recovery-trends', getRecoveryTrends);
router.get('/therapy-distribution', getTherapyDistribution);
router.get('/alerts', getAlerts);

module.exports = router;