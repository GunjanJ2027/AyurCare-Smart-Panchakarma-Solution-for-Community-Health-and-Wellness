// backend/server.js server files 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware server files
app.use(cors());
app.use(express.json());

// --- THIS IS THE MISSING LINK ---
// This tells the server to route authentication requests to your auth.js file
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/practitioner', require('./routes/practitioner'));
// Basic test route
app.get('/', (req, res) => {
  res.send('AyurCare Backend API is running!');
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurcare';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB seamlessly'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});