// ayurcare-backend/cron/reminderJob.js
const cron = require('node-cron');
const Appointment = require('../models/Appointment'); // Adjust path if needed
const { sendReminderEmail } = require('../services/emailService');

const startReminderJob = () => {
  // This cron expression means: "Run every day at 8:00 AM"
  // Format: 'Minute Hour DayOfMonth Month DayOfWeek'
  cron.schedule('0 8 * * *', async () => {
    console.log("⏰ CRON JOB: Checking for upcoming appointments...");

    try {
      // 1. Calculate tomorrow's date range
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // 2. Find appointments happening exactly tomorrow
      // Note: Make sure your Appointment model has 'patientId' populated with the User data so we can get their email
      const upcomingAppointments = await Appointment.find({
        date: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        status: 'Scheduled' // Only remind them if it's not cancelled
      }).populate('patientId', 'name email'); 

      console.log(`Found ${upcomingAppointments.length} appointments for tomorrow.`);

      // 3. Loop through and send emails
      for (const appt of upcomingAppointments) {
        if (appt.patientId && appt.patientId.email) {
          await sendReminderEmail(
            appt.patientId.email,
            appt.patientId.name,
            appt.date,
            appt.time, // Assuming you store time separately or derive it from date
            appt.therapyType
          );
        }
      }

    } catch (error) {
      console.error("CRON JOB ERROR:", error);
    }
  });

  console.log("✅ Automated Reminder System initialized.");
};

module.exports = startReminderJob;