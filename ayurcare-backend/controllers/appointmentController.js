// // controllers/appointmentController.js
// const Appointment = require('../models/Appointment');

// // 1. Get all appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId', 'name');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

// // 2. Create a new appointment
// exports.createAppointment = async (req, res) => {
//   try {
//     const newAppointment = new Appointment(req.body);
//     const savedAppointment = await newAppointment.save();
    
//     // We populate the patient name before sending it back so the calendar can display it immediately
//     await savedAppointment.populate('patientId', 'name');
    
//     res.status(201).json(savedAppointment);
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     res.status(400).json({ message: 'Failed to create appointment', error: error.message });
//   }
// };  
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     ).populate('patientId', 'name');

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ message: 'Server error updating appointment' });
//   }
// };

// // controllers/appointmentController.js
// const Appointment = require('../models/Appointment');

// // 1. Get all appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId', 'name');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

// // 2. Create a new appointment with RESOURCE OPTIMIZATION
// exports.createAppointment = async (req, res) => {
//   try {
//     const { patientId, therapistId, date, time, therapyType } = req.body;

//     // 1. Convert incoming date to a searchable format (Midnight)
//     const appointmentDate = new Date(date);
//     appointmentDate.setHours(0, 0, 0, 0);

//     // 2. RESOURCE OPTIMIZATION: Check for conflicts
//     // We check if the therapist is busy OR if the patient is already booked at this exact time/day
//     const existingAppointment = await Appointment.findOne({
//       date: appointmentDate,
//       time: time,
//       $or: [
//         { therapistId: therapistId }, 
//         { patientId: patientId }      
//       ]
//     });

//     if (existingAppointment) {
//       console.log("⚠️ CONFLICT DETECTED: Resource already in use.");
//       return res.status(400).json({ 
//         message: "Slot unavailable. Therapist or Patient already has a session at this time." 
//       });
//     }

//     // 3. No conflict? Proceed with creation
//     const newAppointment = new Appointment({
//       patientId,
//       therapistId,
//       date: appointmentDate,
//       time,
//       therapyType,
//       status: 'Scheduled'
//     });

//     const savedAppointment = await newAppointment.save();
    
//     // 4. Populate the patient name so the calendar UI updates immediately with the name
//     await savedAppointment.populate('patientId', 'name');
    
//     console.log("✅ Appointment booked successfully!");
//     res.status(201).json(savedAppointment);

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(400).json({ message: "Failed to create appointment", error: error.message });
//   }
// };

// // 3. Update appointment status (Complete, Cancel, etc.)
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     ).populate('patientId', 'name');

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ message: 'Server error updating appointment' });
//   }
// };

// controllers/appointmentController.js
// const Appointment = require('../models/Appointment');

// // 1. Get all appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId', 'name');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

// // 2. Create a new appointment with RESOURCE OPTIMIZATION
// exports.createAppointment = async (req, res) => {
//   try {
//     const { patientId, therapistId, date, time, therapyType } = req.body;

//     // 1. Convert incoming date to a searchable format (Midnight)
//     const appointmentDate = new Date(date);
//     appointmentDate.setHours(0, 0, 0, 0);

//     // 2. RESOURCE OPTIMIZATION: Check for conflicts
//     // We check if the therapist is busy OR if the patient is already booked at this exact time/day
//     const existingAppointment = await Appointment.findOne({
//       date: appointmentDate,
//       time: time,
//       $or: [
//         { therapistId: therapistId }, 
//         { patientId: patientId }      
//       ]
//     });

//     if (existingAppointment) {
//       console.log("⚠️ CONFLICT DETECTED: Resource already in use.");
//       return res.status(400).json({ 
//         message: "Slot unavailable. Therapist or Patient already has a session at this time." 
//       });
//     }

//     // 3. No conflict? Proceed with creation
//     const newAppointment = new Appointment({
//       patientId,
//       therapistId,
//       date: appointmentDate,
//       time,
//       therapyType,
//       status: 'Scheduled'
//     });

//     const savedAppointment = await newAppointment.save();
    
//     // 4. Populate the patient name so the calendar UI updates immediately with the name
//     await savedAppointment.populate('patientId', 'name');
    
//     console.log("✅ Appointment booked successfully!");
//     res.status(201).json(savedAppointment);

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(400).json({ message: "Failed to create appointment", error: error.message });
//   }
// };

// // 3. Update appointment status (Complete, Cancel, etc.)
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     ).populate('patientId', 'name');

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ message: 'Server error updating appointment' });
//   }
// };

// controllers/appointmentController.js
// const Appointment = require('../models/Appointment');

// // 1. Get all appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId', 'name');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

// // 2. Create a new appointment with RESOURCE OPTIMIZATION
// exports.createAppointment = async (req, res) => {
//   try {
//     // 1. Grab whatever the frontend sends (including therapistName since you typed "Dr Sharma")
//     const { patientId, therapistName, therapistId, date, time, therapyType } = req.body;

//     // 2. Convert incoming date to a searchable format (Midnight)
//     const appointmentDate = new Date(date);
//     appointmentDate.setHours(0, 0, 0, 0);

//     // 3. RESOURCE OPTIMIZATION: Check for conflicts
//     // Use therapistName or therapistId depending on what your frontend actually sends
//     const existingAppointment = await Appointment.findOne({
//       scheduledDate: appointmentDate, // Fixed schema name
//       time: time,
//       $or: [
//         { therapistId: therapistId || therapistName }, // Checks whichever one is provided
//         { patientId: patientId }      
//       ]
//     });

//     if (existingAppointment) {
//       console.log("⚠️ CONFLICT DETECTED: Resource already in use.");
//       return res.status(400).json({ 
//         message: "Slot unavailable. Therapist or Patient already has a session at this time." 
//       });
//     }

//     // 4. Map the frontend data to your EXACT MongoDB Schema names
//     const newAppointment = new Appointment({
//       patientId: patientId,
//       therapistId: therapistId || therapistName, // Catch "Dr Sharma" if sent as therapistName
//       scheduledDate: appointmentDate,            // 🟢 FIXED: Maps 'date' to 'scheduledDate'
//       time: time,
//       therapyName: therapyType,                  // 🟢 FIXED: Maps 'therapyType' to 'therapyName'
//       status: 'Scheduled'
//     });

//     const savedAppointment = await newAppointment.save();
    
//     // 5. Populate the patient name so the calendar UI updates immediately
//     await savedAppointment.populate('patientId', 'name');
    
//     console.log("✅ Appointment booked successfully!");
//     res.status(201).json(savedAppointment);

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(400).json({ message: "Failed to create appointment", error: error.message });
//   }
// };

// // 3. Update appointment status (Complete, Cancel, etc.)
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     ).populate('patientId', 'name');

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ message: 'Server error updating appointment' });
//   }
// };

// controllers/appointmentController.js
// const Appointment = require('../models/Appointment');
// const Patient = require('../models/Patient');
// // 1. Get all appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate('patientId', 'name');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: 'Server error fetching appointments' });
//   }
// };

// // 2. Create a new appointment with RESOURCE OPTIMIZATION
// exports.createAppointment = async (req, res) => {
//   try {
//     const { patientId, therapistName, therapistId, date, time, therapyType } = req.body;

//     // --- THE DATE FIXER ---
//     // If the date comes in as DD-MM-YYYY (e.g., "10-04-2026"), JavaScript will fail.
//     // We need to split it and rearrange it to YYYY-MM-DD so it parses correctly.
//     let parsedDate;
//     if (date && date.includes('-') && date.split('-')[0].length === 2) {
//       // It looks like DD-MM-YYYY
//       const parts = date.split('-');
//       // Rearrange to YYYY-MM-DD (parts[2]-parts[1]-parts[0])
//       parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
//     } else {
//       // It's already a standard format
//       parsedDate = new Date(date);
//     }
    
//     // Safety check: Did our parsing fail?
//     if (isNaN(parsedDate.getTime())) {
//       console.log("❌ Frontend sent an unreadable date format:", date);
//       return res.status(400).json({ message: "Invalid date format provided." });
//     }

//     // Set to absolute midnight for exact searching
//     parsedDate.setHours(0, 0, 0, 0);
//     // ----------------------

//     // 3. RESOURCE OPTIMIZATION: Check for conflicts
//     const existingAppointment = await Appointment.findOne({
//       scheduledDate: parsedDate, // Use our newly fixed date object
//       time: time,
//       $or: [
//         { therapistId: therapistId || therapistName }, 
//         { patientId: patientId }      
//       ]
//     });

//     if (existingAppointment) {
//       console.log("⚠️ CONFLICT DETECTED: Resource already in use.");
//       return res.status(400).json({ 
//         message: "Slot unavailable. Therapist or Patient already has a session at this time." 
//       });
//     }

//     // 4. Map the frontend data to your EXACT MongoDB Schema names
//     const newAppointment = new Appointment({
//       patientId: patientId,
//       therapistId: therapistId || therapistName,
//       scheduledDate: parsedDate,  // Use our newly fixed date object
//       time: time,
//       therapyName: therapyType,
//       status: 'Scheduled'
//     });

//     const savedAppointment = await newAppointment.save();
    
//     // 5. Populate the patient name
//     await savedAppointment.populate('patientId', 'name');
    
//     console.log("✅ Appointment booked successfully!");
//     res.status(201).json(savedAppointment);

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(400).json({ message: "Failed to create appointment", error: error.message });
//   }
// };

// // 3. Update appointment status (Complete, Cancel, etc.)
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     ).populate('patientId', 'name');

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ message: 'Server error updating appointment' });
//   }
// };
// // 4. Complete a session and save notes to Patient's file
// exports.completeAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { internalNotes, patientFeedback } = req.body;

//     // 1. Mark the appointment as Completed
//     // (FIX: Swapped 'new: true' to 'returnDocument: after' to kill the warning)
//     const appointment = await Appointment.findByIdAndUpdate(
//       id, 
//       { status: 'Completed' }, 
//       { returnDocument: 'after' } 
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // 2. Find the patient and inject the notes into their Medical History
//     const patient = await Patient.findById(appointment.patientId);
    
//     // FIX: Only save notes and print the name IF the patient actually exists
//     if (patient) {
//       patient.medicalHistory.push({
//         date: appointment.scheduledDate,
//         therapy: appointment.therapyName,
//         notes: internalNotes,
//         feedback: patientFeedback
//       });
//       await patient.save();
//       console.log(`✅ Session completed for ${patient.name}. Notes saved!`);
//     } else {
//       console.log(`⚠️ Appointment completed, but Patient file was missing. Notes could not be saved.`);
//     }

//     // 3. Send back the updated appointment
//     await appointment.populate('patientId', 'name');
    
//     res.status(200).json(appointment);

//   } catch (error) {
//     console.error("Error completing session:", error);
//     res.status(500).json({ message: 'Server error completing session' });
//   }
// };


const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// 1. Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId', 'name');
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

// 2. Create a new appointment with RESOURCE OPTIMIZATION
exports.createAppointment = async (req, res) => {
  try {
    // 🟢 FIXED: Grab the exact variable names your React formData is sending!
    const { patientId, therapistName, scheduledDate, time, therapyName } = req.body;

    // --- THE DATE FIXER ---
    let parsedDate;
    if (scheduledDate && scheduledDate.includes('-') && scheduledDate.split('-')[0].length === 2) {
      // It looks like DD-MM-YYYY
      const parts = scheduledDate.split('-');
      parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    } else {
      // It's already a standard format
      parsedDate = new Date(scheduledDate);
    }
    
    // Safety check
    if (isNaN(parsedDate.getTime())) {
      console.log("❌ Frontend sent an unreadable date format:", scheduledDate);
      return res.status(400).json({ message: "Invalid date format provided." });
    }

    // Set to absolute midnight for exact searching
    parsedDate.setHours(0, 0, 0, 0);
    // ----------------------

    // 3. RESOURCE OPTIMIZATION: Check for conflicts
    const existingAppointment = await Appointment.findOne({
      scheduledDate: parsedDate,
      time: time,
      $or: [
        { therapistId: therapistName }, // You are sending the name string
        { patientId: patientId }      
      ]
    });

    if (existingAppointment) {
      console.log("⚠️ CONFLICT DETECTED: Resource already in use.");
      return res.status(400).json({ 
        message: "Slot unavailable. Therapist or Patient already has a session at this time." 
      });
    }

    // 4. Save to Database
    const newAppointment = new Appointment({
      patientId: patientId,
      therapistId: therapistName,
      scheduledDate: parsedDate,  
      time: time,
      therapyName: therapyName, 
      status: 'Scheduled'
    });

    const savedAppointment = await newAppointment.save();
    
    // 5. Populate the patient name
    await savedAppointment.populate('patientId', 'name');
    
    console.log("✅ Appointment booked successfully!");
    res.status(201).json(savedAppointment);

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(400).json({ message: "Failed to create appointment", error: error.message });
  }
};

// 3. Update appointment status (Complete, Cancel, etc.)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('patientId', 'name');

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: 'Server error updating appointment' });
  }
};

// 4. Complete a session and save notes to Patient's file
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { internalNotes, patientFeedback } = req.body;

    // 1. Mark the appointment as Completed
    // (FIX: Swapped 'new: true' to 'returnDocument: after' to kill the warning)
    const appointment = await Appointment.findByIdAndUpdate(
      id, 
      { status: 'Completed' }, 
      { returnDocument: 'after' } 
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2. Find the patient and inject the notes into their Medical History
    const patient = await Patient.findById(appointment.patientId);
    
    // FIX: Only save notes and print the name IF the patient actually exists
    if (patient) {
      patient.medicalHistory.push({
        date: appointment.scheduledDate,
        therapy: appointment.therapyName,
        notes: internalNotes,
        feedback: patientFeedback
      });
      await patient.save();
      console.log(`✅ Session completed for ${patient.name}. Notes saved!`);
    } else {
      console.log(`⚠️ Appointment completed, but Patient file was missing. Notes could not be saved.`);
    }

    // 3. Send back the updated appointment
    await appointment.populate('patientId', 'name');
    
    res.status(200).json(appointment);

  } catch (error) {
    console.error("Error completing session:", error);
    res.status(500).json({ message: 'Server error completing session' });
  }
};