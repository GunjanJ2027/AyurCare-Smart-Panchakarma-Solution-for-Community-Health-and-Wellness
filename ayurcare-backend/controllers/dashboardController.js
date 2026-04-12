// controllers/dashboardController.js
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const DailyLog = require('../models/DailyLog');
const moment = require('moment');

// 1. Get Unified KPIs (Powers the Overview Dashboard)
// exports.getKPIs = async (req, res) => {
//   try {
//     // A. Total Patients
//     const totalPatients = await User.countDocuments({ role: 'patient' });

//     // B. Sessions Today
//     const today = moment().startOf('day');
//     const endOfDay = moment().endOf('day');
//     const sessionsToday = await Appointment.countDocuments({
//       scheduledDate: { $gte: today.toDate(), $lte: endOfDay.toDate() }
//     });

//     // C. Active Therapies (For Pie Chart)
//     const therapies = await Appointment.aggregate([
//       // Added a match here so it only counts real, active sessions!
//       { $match: { status: { $in: ['Scheduled', 'Ongoing', 'Completed'] } } },
//       { $group: { _id: "$therapyName", count: { $sum: 1 } } }
//     ]);
//     const pieChartData = therapies.map(t => ({ name: t._id, value: t.count }));

//     // D. Adherence Math & Recovery Trend!
//     const logs = await DailyLog.find().sort({ date: 1 }); // Get all logs, oldest to newest
    
//     let avgAdherence = 0;
//     let recoveryTrend = [];

//     if (logs.length > 0) {
//       let totalAdherenceScore = 0;

//       logs.forEach((log, index) => {
//         // Calculate adherence for this specific day (33.3% for each good habit)
//         let dailyScore = 0;
//         if (log.dietFollowed) dailyScore += 33.33;
//         if (log.medicinesTaken) dailyScore += 33.33;
//         if (log.routineFollowed) dailyScore += 33.34;
//         totalAdherenceScore += dailyScore;

//         // Format data for the Line Chart (Multiply wellness by 10 to make it a 100% scale)
//         recoveryTrend.push({
//           name: `Log ${index + 1}`,
//           score: log.wellnessScore * 10 
//         });
//       });

//       // Calculate the final overall average
//       avgAdherence = Math.round(totalAdherenceScore / logs.length);
//     }

//     // Send it all to the frontend
//     res.status(200).json({
//       totalPatients,
//       sessionsToday,
//       activeTherapies: pieChartData,
//       avgAdherence,
//       recoveryTrend
//     });

//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({ message: 'Server error fetching KPIs' });
//   }
// };

exports.getKPIs = async (req, res) => {
  try {
    const User = require('../models/User');
    const Appointment = require('../models/Appointment');

    // 1. Get Total Patients
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // 2. Setup "Today" boundary
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Fetch ONLY today's appointments, ignoring cancelled ones
    const todaysAppointments = await Appointment.find({
      scheduledDate: today,
      status: { $ne: 'Cancelled' } 
    });

    // 4. Set "Sessions Today"
    const sessionsToday = todaysAppointments.length;

    // 5. Calculate "Active Therapies" pie chart based strictly on today's remaining schedule
    const therapyCounts = {};
    todaysAppointments.forEach(apt => {
      therapyCounts[apt.therapyName] = (therapyCounts[apt.therapyName] || 0) + 1;
    });

    const activeTherapies = Object.keys(therapyCounts).map(name => ({
      name,
      value: therapyCounts[name]
    }));

    // ==========================================
    // 6. REAL DATABASE ADHERENCE & TREND LOGIC
    // ==========================================
    
    // Fetch all historical appointments up to today
    const pastAppointments = await Appointment.find({ scheduledDate: { $lte: new Date() } });
    
    // Calculate REAL Average Adherence (% of past appointments actually Completed)
    const completedCount = pastAppointments.filter(a => a.status === 'Completed').length;
    const avgAdherence = pastAppointments.length > 0 
      ? Math.round((completedCount / pastAppointments.length) * 100) 
      : 0;

    // Calculate REAL Recovery Trend (Completion success rate over the last 4 weeks)
    const recoveryTrend = [];
    for (let i = 4; i >= 1; i--) {
      // Create a 7-day window for each week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (i * 7));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      // Filter appointments that happened during this specific week
      const weekApts = pastAppointments.filter(a => 
        a.scheduledDate >= startOfWeek && a.scheduledDate < endOfWeek
      );
      
      const weekCompleted = weekApts.filter(a => a.status === 'Completed').length;
      
      // Calculate the success score for this specific week
      const weekScore = weekApts.length > 0 
        ? Math.round((weekCompleted / weekApts.length) * 100) 
        : 0;

      recoveryTrend.push({
        name: `Week ${5 - i}`, // Labels them Week 1, Week 2, etc. chronologically
        score: weekScore
      });
    }

    res.status(200).json({
      totalPatients,
      sessionsToday,
      activeTherapies,
      avgAdherence,
      recoveryTrend
    });

  } catch (error) {
    console.error("Error fetching KPIs:", error);
    res.status(500).json({ message: "Server error fetching KPIs" });
  }
};

// 2. Get High-Risk Alerts (Saved for later!)
exports.getAlerts = async (req, res) => {
  try {
    // Find patients who have "Cancelled" or "Missed" their last 2 sessions
    const missedSessions = await Appointment.aggregate([
      { $match: { status: 'Cancelled' } },
      { $group: { _id: "$patientId", missedCount: { $sum: 1 } } },
      { $match: { missedCount: { $gte: 1 } } } // High risk if missed 2 or more
    ]);

    // Populate patient details for the alerts
    const alerts = [];
    for (const record of missedSessions) {
      const patient = await User.findById(record._id).select('name');
      if (patient) {
        alerts.push({
          id: patient._id,
          patientName: patient.name,
          issue: `Missed ${record.missedCount} sessions`,
          severity: record.missedCount > 3 ? 'High' : 'Medium'
        });
      }
    }

    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Server error fetching alerts" });
  }
};

// const Appointment = require('../models/Appointment'); // Ensure this is imported at the top
// const Patient = require('../models/Patient');

exports.getAdvancedInsights = async (req, res) => {
  try {
    // ---------------------------------------------------------
    // 1. FEATURE 10: Therapist Workload (Real Data)
    // Counts all Scheduled, Ongoing, or Completed sessions per therapist
    // ---------------------------------------------------------
    const workloadData = await Appointment.aggregate([
      { $match: { status: { $in: ['Scheduled', 'Ongoing', 'Completed'] } } },
      { $group: { _id: "$therapistId", sessions: { $sum: 1 } } },
      { $sort: { sessions: -1 } }
    ]);
    
    const therapistWorkload = workloadData.map(item => ({
      name: item._id || 'Unassigned',
      sessions: item.sessions
    }));

    // ---------------------------------------------------------
    // 2. FEATURE 10: Peak Hours Analysis (Real Data)
    // Groups appointments by their scheduled time to find busy hours
    // ---------------------------------------------------------
    const timeData = await Appointment.aggregate([
      { $group: { _id: "$time", patients: { $sum: 1 } } },
      { $sort: { _id: 1 } } // Sort by time alphabetically/numerically
    ]);

    const peakHours = timeData.map(item => ({
      time: item._id || 'Unknown',
      patients: item.patients
    }));

    // ---------------------------------------------------------
    // 3. FEATURE 16: Predictive Drop-Out Risk (Real Data)
    // Algorithm: High risk if a patient has missed/cancelled recent sessions
    // ---------------------------------------------------------
    const riskyAppointments = await Appointment.find({ 
      status: { $in: ['Missed', 'Cancelled'] } 
    }).populate('patientId', 'name');

    const riskMap = {};
    riskyAppointments.forEach(apt => {
      if (apt.patientId) {
        if (!riskMap[apt.patientId._id]) {
          riskMap[apt.patientId._id] = { name: apt.patientId.name, misses: 0 };
        }
        riskMap[apt.patientId._id].misses += 1;
      }
    });

    const dropoutRisks = Object.values(riskMap).map(p => {
      // Basic risk algorithm: 1 miss = 30% risk, 2 misses = 60%, 3+ = 90%
      let riskPercentage = Math.min(p.misses * 30, 95); 
      return {
        name: p.name,
        risk: `${riskPercentage}%`,
        reason: `Missed or cancelled ${p.misses} session(s)`,
        trend: 'down'
      };
    });

    // Send the real calculated data back to React
    res.status(200).json({
      therapistWorkload,
      peakHours,
      dropoutRisks
    });

  } catch (error) {
    console.error("Error fetching advanced insights:", error);
    res.status(500).json({ message: "Server error fetching advanced insights." });
  }
};

// ayurcare-backend/controllers/dashboardController.js (Add to bottom)
const Patient = require('../models/Patient');

exports.getFeedbackData = async (req, res) => {
  try {
    // const Patient = require('../models/Patient');
    const User = require('../models/User');
    // Fetch ALL patients to ensure we don't miss any newly created arrays
    // const patients = await Patient.find({}); 
    const patients = await User.find({ role: 'patient', 'medicalHistory.0': { $exists: true } });
    let allFeedback = [];
    let complaintCount = 0;

    patients.forEach(p => {
      // Check if the medicalHistory array exists and has items
      if (p.medicalHistory && p.medicalHistory.length > 0) {
        p.medicalHistory.forEach(record => {
          if (record.feedback) {
            // Sentiment Analysis
            const isComplaint = record.feedback.toLowerCase().match(/(bad|pain|worst|hurt|late|unprofessional|dirty|missed|unhappy|issue)/);
            if (isComplaint) complaintCount++;
            
            allFeedback.push({
              id: record._id,
              patientId: p._id,
              patientName: p.name,
              date: record.date || new Date(),
              therapy: record.therapy || 'General Consultation',
              feedback: record.feedback,
              isComplaint: !!isComplaint
            });
          }
        });
      }
    });

    // Sort by newest feedback first
    allFeedback.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      totalReviews: allFeedback.length,
      complaintCount,
      positiveCount: allFeedback.length - complaintCount,
      feedbacks: allFeedback
    });

  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error fetching feedback." });
  }
};

// 2. Quick-Log new feedback into a patient's file (UPDATED)
// exports.addFeedback = async (req, res) => {
//   try {
//     const Patient = require('../models/Patient');
//     const { patientId, therapy, feedbackText } = req.body;
    
//     // Find patient and push the new feedback safely
//     const updatedPatient = await Patient.findByIdAndUpdate(
//       patientId, 
//       {
//         $push: { 
//           medicalHistory: { 
//             date: new Date(), 
//             therapy: therapy, 
//             feedback: feedbackText 
//           } 
//         }
//       },
//       { new: true } // Returns the updated document
//     );

//     if (!updatedPatient) {
//       return res.status(404).json({ message: "Patient not found." });
//     }

//     console.log("Feedback saved for:", updatedPatient.name); // Logs to your terminal so you know it worked!
//     res.status(201).json({ message: "Feedback successfully logged!" });
//   } catch (error) {
//     console.error("Error saving feedback:", error);
//     res.status(500).json({ message: "Failed to save feedback." });
//   }
// };

// // 2. Quick-Log new feedback (THE BULLETPROOF WAY)
// exports.addFeedback = async (req, res) => {
//   try {
//     console.log("\n📡 ---- INCOMING FEEDBACK SIGNAL ----");
    
//     const Patient = require('../models/Patient');
//     const { patientId, therapy, feedbackText } = req.body;
    
//     // 1. Manually fetch the patient first
//     const patient = await Patient.findById(patientId);

//     if (!patient) {
//       console.log("❌ MONGODB ERROR: Cannot find patient ID:", patientId);
//       return res.status(404).json({ message: "Patient not found." });
//     }

//     // 2. Safety Check: If they don't have a medicalHistory array yet, make one!
//     if (!patient.medicalHistory) {
//       patient.medicalHistory = [];
//     }

//     // 3. Push the new feedback into the array
//     patient.medicalHistory.push({
//       date: new Date(),
//       therapy: therapy,
//       feedback: feedbackText
//     });

//     // 4. Save the patient file
//     await patient.save();

//     console.log("✅ SUCCESS: Feedback saved perfectly for:", patient.name);
//     console.log("-----------------------------------\n");
//     res.status(201).json({ message: "Feedback successfully logged!" });
    
//   } catch (error) {
//     console.error("🔥 CRASH ERROR:", error.message);
//     res.status(500).json({ message: "Failed to save feedback." });
//   }
// };  

// 2. Quick-Log new feedback (DIAGNOSTIC & REPAIR MODE)
// exports.addFeedback = async (req, res) => {
//   try {
//     console.log("\n📡 ---- INCOMING FEEDBACK SIGNAL ----");
//     const { patientId, therapy, feedbackText } = req.body;
    
//     // Force it to a pure string and strip any hidden invisible spaces
//     const cleanId = String(patientId).trim();
//     console.log("🔍 Looking for ID exactly:", cleanId);

//     const Patient = require('../models/Patient');

//     // 1. Fetch ALL patients to see what is actually inside MongoDB
//     const allPatients = await Patient.find({});
//     console.log(`📂 Found ${allPatients.length} total patients in the 'Patient' collection.`);

//     // 2. Manually search through them to bypass Mongoose's strict formatting
//     let targetPatient = null;
//     for (let i = 0; i < allPatients.length; i++) {
//       if (allPatients[i]._id.toString() === cleanId) {
//         targetPatient = allPatients[i];
//         break;
//       }
//     }

//     // 3. If STILL not found, print out the receipts!
//     if (!targetPatient) {
//       console.log("❌ MONGODB ERROR: Cannot find that ID anywhere in the Patient collection!");
//       console.log("Here are the actual IDs that MongoDB has right now:");
//       allPatients.forEach(p => console.log(`   👉 Name: ${p.name || 'Unknown'} | ID: ${p._id.toString()}`));
//       console.log("-----------------------------------\n");
//       return res.status(404).json({ message: "Patient not found in DB." });
//     }

//     // 4. We found them! Save the feedback safely.
//     if (!targetPatient.medicalHistory) {
//       targetPatient.medicalHistory = [];
//     }

//     targetPatient.medicalHistory.push({
//       date: new Date(),
//       therapy: therapy,
//       feedback: feedbackText
//     });

//     await targetPatient.save();

//     console.log("✅ SUCCESS: Feedback saved perfectly for:", targetPatient.name);
//     console.log("-----------------------------------\n");
//     res.status(201).json({ message: "Feedback successfully logged!" });

//   } catch (error) {
//     console.error("🔥 CRASH ERROR:", error.message);
//     res.status(500).json({ message: "Failed to save feedback." });
//   }
// };

exports.addFeedback = async (req, res) => {
  try {
    const User = require('../models/User'); // 👉 CHANGED TO User
    const { patientId, therapy, feedbackText } = req.body;
    
    const patient = await User.findById(patientId); // 👉 CHANGED TO User

    if (!patient) return res.status(404).json({ message: "Patient not found." });

    if (!patient.medicalHistory) {
      patient.medicalHistory = [];
    }

    patient.medicalHistory.push({
      date: new Date(),
      therapy: therapy,
      feedback: feedbackText
    });

    await patient.save();
    res.status(201).json({ message: "Feedback successfully logged!" });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to save feedback." });
  }
};


// ayurcare-backend/controllers/dashboardController.js (Add to bottom)

// Fetch the 50 most recent security logs
exports.getAuditLogs = async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog');
    const logs = await AuditLog.find().sort({ date: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Server error fetching logs." });
  }
};

// Create a new secure log entry
exports.createAuditLog = async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog');
    const { adminName, action, target, details } = req.body;
    
    const newLog = new AuditLog({ adminName, action, target, details });
    await newLog.save();
    
    res.status(201).json({ message: "Action securely logged." });
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({ message: "Failed to create audit log." });
  }
};