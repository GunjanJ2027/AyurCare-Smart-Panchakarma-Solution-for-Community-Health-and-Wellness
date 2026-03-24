// backend/resetDb.js
const mongoose = require('mongoose');
require('dotenv').config(); // Loads your .env file

const Appointment = require('./models/Appointment');

// Use the exact same database connection string from your server.js
// Fallback to localhost if the .env isn't found
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ayurcare'; 

mongoose.connect(dbURI)
  .then(async () => {
    console.log('🔄 Connected to MongoDB...');
    
    // This command deletes EVERY appointment in the database
    await Appointment.deleteMany({});
    
    console.log('✅ Success! All past bookings and history have been wiped clean.');
    console.log('🚪 Disconnecting...');
    
    process.exit(0); // Closes the script
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });