// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // <--- ADDED THIS IMPORT
const User = require('../models/User');

// ==========================================
// 1. REGISTER A NEW USER
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    user = new User({
      name, // Added name field here
      email,
      password: hashedPassword,
      role: role || 'Patient'
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================================
// 2. LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token: token,
      role: user.role,
      message: `Welcome back, ${user.role}!`
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================================
// 3. GET ALL REGISTERED PATIENTS (For Dashboard)
// ==========================================
router.get('/users/patients', auth, async (req, res) => {
  try {
    // Finds all users where role is 'Patient', returns name, email, and ID
    const patients = await User.find({ role: 'Patient' }).select('name email _id');
    res.json(patients);
  } catch (err) {
    console.error("Fetch Patients Error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;