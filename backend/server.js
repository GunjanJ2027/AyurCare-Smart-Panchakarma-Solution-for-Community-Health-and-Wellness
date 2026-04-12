// backend/server.js server files 
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const cors = require('cors');
app.use(cors()); // Allow the mobile app to talk to the server
// app.use('/api/admin/dashboard', dashboardRoutes);
// THE PINGER: This will print every single request to your terminal
app.use((req, res, next) => {
  console.log(`🚀 Incoming Request: ${req.method} ${req.url}`);
  next();
});
const PORT = process.env.PORT || 5000;

// Middleware server files
app.use(cors());
app.use(express.json());
app.locals.foodKnowledgeBase = [];
app.locals.prakritiKnowledgeBase = [];

function loadDataset(filePath, targetArray, datasetName) {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      targetArray.push(row);
    })
    .on('end', () => {
      console.log(`🟢 [Success] ${datasetName} loaded: ${targetArray.length} records!`);
    })
    .on('error', (error) => {
      console.error(`🔴 [Error] Failed to load ${datasetName}:`, error);
    });
}

// Fire up both datasets when the server starts!
loadDataset('./data/food_data.csv', app.locals.foodKnowledgeBase, 'Food & Nutrition Data');
loadDataset('./data/prakriti_data.csv', app.locals.prakritiKnowledgeBase, 'Prakriti & Tridosha Data');
// ---------------------------------------------

// --- THIS IS THE MISSING LINK ---
// This tells the server to route authentication requests to your auth.js file
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/practitioner', require('./routes/practitioner'));
app.use('/api/chatbot', require('./routes/chatbot'));
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
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is live on port ${PORT}`);
  console.log(`🚀 Access via http://localhost:${PORT} (Web)`);
  console.log(`📱 Access via http://10.0.2.2:${PORT} (Emulator)`);
});