// ayurcare-backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// const { login } = require('../controllers/authController');
const { register, login, updateProfile } = require('../controllers/authController');
// This creates the route: POST /api/auth/login
router.post('/login', login);
router.put('/profile', updateProfile);
router.post('/register-staff', async (req, res) => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const { name, email, password, role } = req.body;

    // 1. Ensure the role being passed is valid based on your database schema
    if (!['practitioner', 'ngo', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // 2. Hash password dynamically
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save dynamic user to the database
    const newStaff = new User({ name, email, password: hashedPassword, role });
    await newStaff.save();

    res.status(201).json({ message: `${role} successfully created!`, user: newStaff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;