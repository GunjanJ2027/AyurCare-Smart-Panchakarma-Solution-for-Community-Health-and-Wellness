// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db'); 

// // 1. Import Routes
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const patientRoutes = require('./routes/patientRoutes'); // Imported here!
// const logRoutes = require('./routes/logRoutes');
// const authRoutes = require('./routes/authRoutes');
// const startReminderJob = require('./cron/reminderJob');
// // 2. Initialize the App (This MUST happen before we use 'app')
// const app = express();

// // 3. Middleware
// app.use(cors()); 
// app.use(express.json());

// // 4. Connect to MongoDB
// connectDB();

// // 5. Mount Routes (Now it's safe to use 'app'!)
// app.use('/api/admin/dashboard', dashboardRoutes);
// app.use('/api/admin/appointments', appointmentRoutes);
// app.use('/api/admin/patients', patientRoutes); // Mounted safely here!
// app.use('/api/admin/logs', logRoutes);
// app.use('/api/auth', authRoutes);
// // 6. Health Check Route
// app.get('/', (req, res) => {
//   res.send('AyurCare API is running...');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

// 1. Import Routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes'); 
const logRoutes = require('./routes/logRoutes');
const authRoutes = require('./routes/authRoutes');

// Import the Cron Job
const startReminderJob = require('./cron/reminderJob');

// 2. Initialize the App
const app = express();

// 3. Middleware
app.use(cors()); 
app.use(express.json());

// 4. Connect to MongoDB
connectDB();

// 5. Mount Routes
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/appointments', appointmentRoutes);
app.use('/api/admin/patients', patientRoutes); 
app.use('/api/admin/logs', logRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/admin/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin/settings', require('./routes/settingsRoutes'));
// 6. Health Check Route
app.get('/', (req, res) => {
  res.send('AyurCare API is running...');
});

const PORT = process.env.PORT || 5000;

// 7. Start the Server AND the Alarm Clock
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the automated email checker!
  startReminderJob(); 
});