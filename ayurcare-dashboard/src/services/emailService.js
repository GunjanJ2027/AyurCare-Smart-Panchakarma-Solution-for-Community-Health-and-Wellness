// ayurcare-backend/services/emailService.js
const nodemailer = require('nodemailer');

// Configure the "post office"
const transporter = nodemailer.createTransport({
  service: 'gmail', // We will use Gmail for testing
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// The actual function to send the email
const sendReminderEmail = async (patientEmail, patientName, date, time, therapy) => {
  try {
    const mailOptions = {
      from: `"AyurCare Pro" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: `Reminder: Your upcoming ${therapy} session`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Hello ${patientName},</h2>
          <p>This is a friendly reminder from AyurCare Clinic regarding your upcoming session.</p>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Therapy:</strong> ${therapy}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          <p>Please arrive 10 minutes early. If you need to reschedule, please contact the clinic.</p>
          <br/>
          <p>Warm regards,</p>
          <p><strong>The AyurCare Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Reminder sent successfully to ${patientEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${patientEmail}:`, error.message);
  }
};

module.exports = { sendReminderEmail };