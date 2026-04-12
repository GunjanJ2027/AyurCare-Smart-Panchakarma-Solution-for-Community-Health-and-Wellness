// ayurcare-backend/fixAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const fixAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database...");

    // 1. Create a secure hash for the word 'admin'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // 2. Find the admin and update their password to the secure hash
    const admin = await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      { password: hashedPassword },
      { new: true }
    );

    if (admin) {
      console.log("✅ Admin account successfully upgraded to bcrypt security!");
    } else {
      console.log("⚠️ Could not find admin@test.com in the database.");
    }
    
    process.exit();
  } catch (error) {
    console.error("Error fixing admin:", error);
    process.exit(1);
  }
};

fixAdminPassword();