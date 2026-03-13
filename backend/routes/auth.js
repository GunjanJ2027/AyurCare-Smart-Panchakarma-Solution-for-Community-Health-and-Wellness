// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');

const JWT_SECRET = process.env.JWT_SECRET || 'ayurcare_super_secret_key_for_midterm';

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the User
    user = new User({
      email,
      password: hashedPassword,
      role: role || 'Patient'
    });
    await user.save();

    // If the user is a Patient, automatically create their Patient Profile
    if (user.role === 'Patient') {
      const patientProfile = new Patient({
        userId: user._id,
        fullName: fullName || 'New Patient'
      });
      await patientProfile.save();
    }

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create the JWT Token payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Sign the token and send it back to the frontend
    jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;