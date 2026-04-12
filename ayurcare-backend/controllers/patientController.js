// controllers/patientController.js
const User = require('../models/User');
const Appointment = require('../models/Appointment');
// 1. Get all patients
exports.getPatients = async (req, res) => {
  try {
    // Only find users who are marked as patients
    const patients = await User.find({ role: 'patient' }).sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

// 2. Create a new patient
// exports.createPatient = async (req, res) => {
//   try {
//     const { name, email, phone, age, medicalHistory } = req.body;

//     // Create a new user and force the role to 'patient'
//     // Note: We are setting a dummy password for now. In a real app, you'd auto-generate this or send them an email to set it.
//     const newPatient = new User({
//       name,
//       email,
//       password: 'defaultPassword123', 
//       phone,
//       age,
//       medicalHistory,
//       role: 'patient'
//     });

//     const savedPatient = await newPatient.save();
//     res.status(201).json(savedPatient);
//   } catch (error) {
//     console.error("Error creating patient:", error);
//     res.status(400).json({ message: 'Failed to create patient', error: error.message });
//   }
// };

// 2. Create a new patient (UPDATED FOR NEW SCHEMA)
exports.createPatient = async (req, res) => {
  try {
    // We intentionally leave out 'medicalHistory' from the req.body here
    const { name, email, phone, age } = req.body;

    const newPatient = new User({
      name,
      email,
      password: 'defaultPassword123', 
      phone,
      age,
      role: 'patient',
      // Force these to be clean, empty arrays to match our new powerful Schema!
      medicalHistory: [],
      therapyPlan: [] 
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(400).json({ message: 'Failed to create patient', error: error.message });
  }
};
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const deletedPatient = await User.findByIdAndDelete(patientId);
    
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: 'Server error deleting patient' });
  }
};
// 4. Get Full Patient Profile (Details + Appointments)
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    // Find all appointments for this specific patient
    const appointments = await Appointment.find({ patientId: req.params.id }).sort({ scheduledDate: -1 });
    
    res.status(200).json({ patient, appointments });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Update Patient (Save Therapy Plans & Notes)
exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await User.findByIdAndUpdate(
      req.params.id, 
      { 
        medicalHistory: req.body.medicalHistory,
        therapyPlan: req.body.therapyPlan,
        internalNotes: req.body.internalNotes
      }, 
      { new: true } // Returns the updated document
    );
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateTherapyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { therapyPlan } = req.body;

    // const Patient = require('../models/Patient');
    const User = require('../models/User');
    // const updatedPatient = await Patient.findByIdAndUpdate(
    const updatedPatient = await User.findByIdAndUpdate(
      id,
      { therapyPlan: therapyPlan },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json(updatedPatient.therapyPlan);
  } catch (error) {
    console.error("Error updating therapy plan:", error);
    res.status(500).json({ message: "Server error saving therapy plan." });
  }
};