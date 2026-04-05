// // backend/routes/practitioner.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const User = require('../models/User');
// const Patient = require('../models/Patient');
// const Appointment = require('../models/Appointment');
// const sendEmail = require('../utils/sendEmail'); // <-- NEW: Imported Email Utility
// const PDFDocument = require('pdfkit');
// const therapyData = require('../data/therapyData');
// // GET /api/practitioner/dashboard - Get practitioner data and patient list
// router.get('/dashboard', auth, async (req, res) => {
//   try {
//     // 1. Security check: Ensure the logged-in user is actually a Practitioner
//     if (req.user.role !== 'Practitioner') {
//       return res.status(403).json({ message: 'Access denied: Practitioners only' });
//     }

//     // 2. Fetch the practitioner's own account info (excluding the password)
//     const practitionerInfo = await User.findById(req.user.id).select('-password');
    
//     // 3. Fetch all registered patients from the database
//     const allPatients = await Patient.find().sort({ _id: -1 });

//     // 4. Fetch actual appointments (will be empty for now until we build a booking system)
//     const appointments = await Appointment.find({ practitionerId: req.user.id });

//     res.json({
//       practitioner: practitionerInfo,
//       patients: allPatients,
//       appointments: appointments
//     });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // PUT /api/practitioner/patient/:id/dosha - Update a patient's Dosha
// router.put('/patient/:id/dosha', auth, async (req, res) => {
//   try {
//     // Security check
//     if (req.user.role !== 'Practitioner') {
//       return res.status(403).json({ message: 'Access denied: Practitioners only' });
//     }

//     const { doshaProfile } = req.body;

//     // Find the patient and update their profile
//     const updatedPatient = await Patient.findByIdAndUpdate(
//       req.params.id, 
//       { doshaProfile: doshaProfile },
//       { new: true } // This tells MongoDB to return the newly updated document
//     );

//     if (!updatedPatient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     res.json(updatedPatient);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // PUT /api/practitioner/appointment/:id/status - Approve or Decline Appointment
// router.put('/appointment/:id/status', auth, async (req, res) => {
//   try {
//     // Security check
//     if (req.user.role !== 'Practitioner') {
//       return res.status(403).json({ message: 'Access denied: Practitioners only' });
//     }

//     const { status } = req.body;

//     // Find the appointment and update its status
//     const updatedAppt = await Appointment.findByIdAndUpdate(
//       req.params.id, 
//       { status: status },
//       { new: true } 
//     );

//     if (!updatedAppt) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     console.log("=== DEBUGGING EMAIL ===");
//     console.log("1. Status received from frontend:", status);
//     console.log("2. Patient ID attached to appointment:", updatedAppt.patientId);
//     // --- NEW EMAIL LOGIC START ---
//     // Only send the email if the new status is exactly 'Approved'
//     if (status === 'Approved') {
//       try {
//         // Find the patient to get their email address
//         const patient = await User.findById(updatedAppt.patientId);

//         if (patient && patient.email) {
//           const emailMessage = `
//             <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; max-width: 600px; margin: 0 auto;">
//               <h2 style="color: #10B981; text-align: center;">Therapy Approved! 🌿</h2>
//               <p>Namaste <strong>${patient.name}</strong>,</p>
//               <p>Your <strong>${updatedAppt.therapyName || 'Panchakarma'}</strong> therapy has been officially approved by our clinic.</p>
//               <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                 <p style="margin: 0 0 10px 0;"><strong>📅 Date:</strong> ${new Date(updatedAppt.scheduledDate).toLocaleDateString()}</p>
//                 <p style="margin: 0;"><strong>⏰ Time:</strong> ${updatedAppt.time}</p>
//               </div>
//               <h3 style="color: #374151;">Pre-Therapy Guidelines:</h3>
//               <ul style="color: #4b5563; line-height: 1.6;">
//                 <li>Please arrive 15 minutes early to settle in.</li>
//                 <li>Consume only light, easily digestible food (like Khichdi) 12 hours prior.</li>
//                 <li>Avoid cold water and strenuous exercise today.</li>
//               </ul>
//               <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em; text-align: center;">We look forward to aiding your healing journey.<br><em>- The Earth Saviours Foundation & AyurCare Team</em></p>
//             </div>
//           `;

//           // Send the email via Nodemailer
//           await sendEmail({
//             email: patient.email,
//             subject: 'AyurCare: Your Panchakarma Therapy is Confirmed',
//             html: emailMessage
//           });
//         }
//       } catch (emailError) {
//         console.error("Appointment approved, but email failed to send:", emailError);
//         // We catch the error so the backend doesn't crash if Google blocks the email
//       }
//     }
//     // --- NEW EMAIL LOGIC END ---

//     res.json(updatedAppt);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Make sure this is always at the very bottom!
// module.exports = router;


// backend/routes/practitioner.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail'); 
const PDFDocument = require('pdfkit');
const therapyData = require('../data/therapyData');

// GET /api/practitioner/dashboard - Get practitioner data and patient list
router.get('/dashboard', auth, async (req, res) => {
  try {
    // 1. Security check: Ensure the logged-in user is actually a Practitioner
    if (req.user.role !== 'Practitioner') {
      return res.status(403).json({ message: 'Access denied: Practitioners only' });
    }

    // 2. Fetch the practitioner's own account info (excluding the password)
    const practitionerInfo = await User.findById(req.user.id).select('-password');
    
    // 3. Fetch all registered patients from the database
    const allPatients = await Patient.find().sort({ _id: -1 });

    // 4. Fetch actual appointments (will be empty for now until we build a booking system)
    const appointments = await Appointment.find({ practitionerId: req.user.id });

    res.json({
      practitioner: practitionerInfo,
      patients: allPatients,
      appointments: appointments
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/practitioner/patient/:id/dosha - Update a patient's Dosha
router.put('/patient/:id/dosha', auth, async (req, res) => {
  try {
    // Security check
    if (req.user.role !== 'Practitioner') {
      return res.status(403).json({ message: 'Access denied: Practitioners only' });
    }

    const { doshaProfile } = req.body;

    // Find the patient and update their profile
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      { doshaProfile: doshaProfile },
      { new: true } 
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/practitioner/appointment/:id/status - Approve or Decline Appointment
router.put('/appointment/:id/status', auth, async (req, res) => {
  try {
    // Security check
    if (req.user.role !== 'Practitioner') {
      return res.status(403).json({ message: 'Access denied: Practitioners only' });
    }

    const { status } = req.body;

    // Find the appointment and update its status
    const updatedAppt = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status: status },
      { new: true } 
    );

    if (!updatedAppt) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status === 'Approved') {
      try {
        const patient = await User.findById(updatedAppt.patientId);

        if (patient && patient.email) {
          const emailMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981; text-align: center;">Therapy Approved! 🌿</h2>
              <p>Namaste <strong>${patient.name}</strong>,</p>
              <p>Your <strong>${updatedAppt.therapyName || 'Panchakarma'}</strong> therapy has been officially approved by our clinic.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>📅 Date:</strong> ${new Date(updatedAppt.scheduledDate).toLocaleDateString()}</p>
                <p style="margin: 0;"><strong>⏰ Time:</strong> ${updatedAppt.time}</p>
              </div>
              <h3 style="color: #374151;">Pre-Therapy Guidelines:</h3>
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>Please arrive 15 minutes early to settle in.</li>
                <li>Consume only light, easily digestible food (like Khichdi) 12 hours prior.</li>
                <li>Avoid cold water and strenuous exercise today.</li>
              </ul>
              <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em; text-align: center;">We look forward to aiding your healing journey.<br><em>- The Earth Saviours Foundation & AyurCare Team</em></p>
            </div>
          `;

          await sendEmail({
            email: patient.email,
            subject: 'AyurCare: Your Panchakarma Therapy is Confirmed',
            html: emailMessage
          });
        }
      } catch (emailError) {
        console.error("Appointment approved, but email failed to send:", emailError);
      }
    }

    res.json(updatedAppt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// THE DYNAMIC PDF ROUTE
// ==========================================
router.get('/generate-pdf/:therapyName', (req, res) => {
  try {
    const therapyName = req.params.therapyName;
    const data = therapyData[therapyName];

    // If they ask for a therapy we don't have data for, throw an error
    if (!data) {
      return res.status(404).json({ error: "Therapy details not found." });
    }

    // 1. Set up the browser to expect a PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AyurCare_${therapyName}_Plan.pdf`);

    // 2. Initialize the PDF Document
    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe the PDF directly to the user's browser download
    doc.pipe(res);

    // 3. Draw the PDF Design
    // Header
    doc.fontSize(25).fillColor('#2e7d32').text('AyurCare Official Protocol', { align: 'center' });
    doc.moveDown();
    
    // Title & Tagline
    doc.fontSize(20).fillColor('#000000').text(data.title);
    doc.fontSize(12).fillColor('#666666').text(data.tagline, { italic: true });
    doc.moveDown();

    // Description
    doc.fontSize(14).fillColor('#2e7d32').text('Overview');
    doc.fontSize(12).fillColor('#000000').text(data.description, { align: 'justify' });
    doc.moveDown();

    // Benefits (Drawing bullet points)
    doc.fontSize(14).fillColor('#2e7d32').text('Key Benefits');
    data.benefits.forEach(benefit => {
      doc.fontSize(12).fillColor('#000000').text(`• ${benefit}`, { indent: 20 });
    });
    doc.moveDown();

    // Instructions
    doc.fontSize(14).fillColor('#2e7d32').text('Post-Therapy Instructions');
    doc.fontSize(12).fillColor('#000000').text(data.instructions);
    
    // Footer
    doc.moveDown(3);
    doc.fontSize(10).fillColor('#999999').text('Generated by AyurCare Smart Panchakarma System', { align: 'center' });

    // 4. Finalize the PDF (This sends it to the user!)
    doc.end();

  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).send("Error generating PDF");
  }
});

// Make sure this is always at the very bottom!
module.exports = router;