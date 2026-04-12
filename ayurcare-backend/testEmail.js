// ayurcare-backend/testEmail.js
require('dotenv').config();
const { sendReminderEmail } = require('./services/emailService');

// Put YOUR personal email here to test it
const testEmail = "gunjabdkm@gmail.com"; 

console.log("🚀 Firing real email test...");

sendReminderEmail(
  testEmail, 
  "Admin Tester", // Patient Name
  new Date('2026-04-12'), // Date
  "10:00 AM", // Time
  "Abhyanga Therapy" // Therapy
).then(() => {
  console.log("✅ Check your inbox on your phone!");
  process.exit();
});