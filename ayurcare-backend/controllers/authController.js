// // ayurcare-backend/controllers/authController.js
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Login attempt for:", email);

//     // 1. Find user in the database
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // 2. Compare Password 
//     // (Note: If you manually added users to MongoDB, use this plain text check)
//     const isMatch = (password === user.password); 
//     console.log("Password match:", isMatch);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // 3. Create the JWT Token (The "ID Card")
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // 4. Send back the token and user info
//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// ayurcare-backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("--- Login Attempt ---");
//     console.log("Login attempt for:", email);

//     // 1. Find user in the database (using trim to remove hidden spaces in email)
//     const user = await User.findOne({ email: email.trim() });
    
//     if (!user) {
//       console.log("❌ User not found in MongoDB!");
//       return res.status(401).json({ message: 'User not found in database.' });
//     }

//     // 2. FORCE PLAIN TEXT COMPARISON
//     // Adding brackets to visually catch invisible spaces in the terminal
//     console.log("Typed Password:", `[${password}]`);
//     console.log("DB Password:   ", `[${user.password}]`);
    
//     const isMatch = (password === user.password); 

//     if (!isMatch) {
//       console.log("❌ Passwords do not match!");
//       return res.status(401).json({ message: 'Password incorrect.' });
//     }

//     // 3. Create the JWT Token (The "ID Card")
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     console.log("✅ Login successful! Generating token...");

//     // 4. Send back the token and user info
//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("--- Login Attempt ---");
    console.log("Login attempt for:", email);

    // 1. Find user in the database
    const user = await User.findOne({ email: email.trim() });
    
    if (!user) {
      console.log("❌ User not found in MongoDB!");
      return res.status(401).json({ message: 'User not found in database.' });
    }

    // 2. SECURE BCRYPT COMPARISON
    // bcrypt.compare takes the plain text typed password and checks it against the DB hash
    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      console.log("❌ Passwords do not match!");
      return res.status(401).json({ message: 'Password incorrect.' });
    }

    // 3. Create the JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("✅ Login successful! Generating token...");

    // 4. Send back the token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email // Good practice to send email back too
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    
    // Find the user by ID and update their name and email
    // (Assuming your user model is named 'User' and imported at the top)
    const User = require('../models/User'); 
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};