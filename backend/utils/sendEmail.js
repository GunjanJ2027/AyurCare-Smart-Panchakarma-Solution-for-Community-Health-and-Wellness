// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: 'AyurCare Community Health <gunjabdkm@gmail.com>',
      to: options.email,
      subject: options.subject,
      html: options.html, // We use HTML so we can make the emails look beautiful
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error('Email could not be sent:', error);
  }
};

module.exports = sendEmail;