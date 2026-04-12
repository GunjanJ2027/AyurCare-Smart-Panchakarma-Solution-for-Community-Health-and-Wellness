
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { ArrowLeft, Save, Calendar, FileText, Activity, CheckCircle, TrendingUp } from 'lucide-react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { Download } from 'lucide-react';
// // 👉 NEW IMPORT ADDED HERE
// import TherapyPlanBuilder from '../components/TherapyPlanBuilder';

// const PatientProfile = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
  
//   const [patient, setPatient] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [logs, setLogs] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Editable fields for the file
//   const [formData, setFormData] = useState({
//     medicalHistory: '', internalNotes: ''
//   });

//   // State for the Daily Log form
//   const [logData, setLogData] = useState({
//     dietFollowed: false, medicinesTaken: false, routineFollowed: false, wellnessScore: 5
//   });

//   useEffect(() => {
//     fetchProfile();
//     fetchLogs(); 
//   }, [id]);

//   const fetchProfile = async () => {
//     try {
//       const response = await api.get(`/admin/patients/${id}`);
//       setPatient(response.data.patient);
//       setAppointments(response.data.appointments);
//       setFormData({
//         medicalHistory: response.data.patient.medicalHistory || '',
//         internalNotes: response.data.patient.internalNotes || ''
//       });
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to load profile", err);
//       setLoading(false);
//     }
//   };

//   const fetchLogs = async () => {
//     try {
//       const response = await api.get(`/admin/logs/${id}`);
//       setLogs(response.data);
//     } catch (err) {
//       console.error("Failed to load logs", err);
//     }
//   };

//   const handleSaveNotes = async () => {
//     try {
//       setSaving(true);
//       await api.put(`/admin/patients/${id}`, formData);
//       alert("Patient records updated successfully!");
//       setSaving(false);
//     } catch (err) {
//       alert("Failed to save records.");
//       setSaving(false);
//     }
//   };
//   const generatePDF = () => {
//     if (!patient) return;

//     const doc = new jsPDF();
    
//     // 1. Header (Clinic Name)
//     doc.setFontSize(22);
//     doc.setTextColor(5, 150, 105); // AyurCare Green
//     doc.text("AyurCare Pro", 14, 20);
    
//     doc.setFontSize(16);
//     doc.setTextColor(17, 24, 39); // Dark Gray
//     doc.text("Official Patient Medical Report", 14, 30);
    
//     // 2. Patient Demographics
//     doc.setFontSize(12);
//     doc.setTextColor(107, 114, 128);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
//     doc.text(`Patient Name: ${patient.name}`, 14, 50);
//     doc.text(`Age: ${patient.age || 'N/A'}`, 14, 58);
//     doc.text(`Contact: ${patient.phone || 'N/A'} | ${patient.email}`, 14, 66);

//     let currentY = 80;

//     // 3. Active Therapy Plan (If exists)
//     if (patient.therapyPlan && patient.therapyPlan.length > 0) {
//       doc.setFontSize(14);
//       doc.setTextColor(17, 24, 39);
//       doc.text("Active Therapy Plan", 14, currentY);
      
//       const planData = patient.therapyPlan.map((step, index) => [
//         `Step ${index + 1}`, 
//         step.therapyName, 
//         step.duration, 
//         step.frequency
//       ]);

//       doc.autoTable({
//         startY: currentY + 5,
//         head: [['Stage', 'Therapy', 'Duration', 'Frequency']],
//         body: planData,
//         theme: 'grid',
//         headStyles: { fillColor: [5, 150, 105] }
//       });
      
//       currentY = doc.lastAutoTable.finalY + 15;
//     }

//     // 4. Session History & Feedback (If exists)
//     if (patient.medicalHistory && patient.medicalHistory.length > 0) {
//       doc.setFontSize(14);
//       doc.setTextColor(17, 24, 39);
//       doc.text("Session History & Clinical Notes", 14, currentY);

//       const historyData = patient.medicalHistory.map(record => [
//         new Date(record.date).toLocaleDateString(),
//         record.therapy || 'General',
//         record.notes || 'No notes',
//         record.feedback || 'No feedback'
//       ]);

//       doc.autoTable({
//         startY: currentY + 5,
//         head: [['Date', 'Therapy', 'Practitioner Notes', 'Patient Feedback']],
//         body: historyData,
//         theme: 'striped',
//         headStyles: { fillColor: [59, 130, 246] } // Blue header for history
//       });
//     }

//     // 5. Download Trigger!
//     doc.save(`${patient.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
//   };

//   const handleSaveDailyLog = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/admin/logs', { ...logData, patientId: id });
//       setLogs([response.data, ...logs]); // Instantly show on screen
//       alert("Daily Adherence Log saved successfully!");
//       // Reset log form
//       setLogData({ dietFollowed: false, medicinesTaken: false, routineFollowed: false, wellnessScore: 5 });
//     } catch (err) {
//       alert("Failed to save daily log.");
//       console.error(err);
//     }
//   };

//   if (loading) return <div style={{ padding: '40px' }}>Loading Patient File...</div>;
//   if (!patient) return <div style={{ padding: '40px', color: 'red' }}>Patient not found!</div>;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
//       {/* Header Area */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//         <button onClick={() => navigate('/dashboard/patients')} style={{ background: 'white', border: '1px solid #D1D5DB', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
//           <ArrowLeft size={20} color="#374151" />
//         </button>
//         <div>
//           <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>{patient.name}'s File</h1>
//           <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>
//             {patient.email} | Age: {patient.age || 'N/A'} | Phone: {patient.phone || 'N/A'}
//           </p>
//         </div>
//         <div style={{ marginLeft: 'auto' }}>
//           <button 
//             onClick={handleSaveNotes}
//             disabled={saving}
//             style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//             <Save size={18} /> {saving ? 'Saving...' : 'Save File Notes'}
//           </button>
//         </div>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
//         {/* Left Column: Editable Records */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
//           {/* Adherence Tracker UI */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
//             <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
//               <TrendingUp size={20} /> Log Daily Adherence
//             </h3>
            
//             <form onSubmit={handleSaveDailyLog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
//                   <input type="checkbox" checked={logData.dietFollowed} onChange={(e) => setLogData({...logData, dietFollowed: e.target.checked})} style={{ width: '18px', height: '18px' }} />
//                   Diet Followed
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
//                   <input type="checkbox" checked={logData.medicinesTaken} onChange={(e) => setLogData({...logData, medicinesTaken: e.target.checked})} style={{ width: '18px', height: '18px' }} />
//                   Medicines Taken
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
//                   <input type="checkbox" checked={logData.routineFollowed} onChange={(e) => setLogData({...logData, routineFollowed: e.target.checked})} style={{ width: '18px', height: '18px' }} />
//                   Routine Followed
//                 </label>
//               </div>

//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//                   Overall Wellness Score: <span style={{ color: '#059669', fontWeight: 'bold' }}>{logData.wellnessScore} / 10</span>
//                 </label>
//                 <input 
//                   type="range" min="1" max="10" 
//                   value={logData.wellnessScore} 
//                   onChange={(e) => setLogData({...logData, wellnessScore: parseInt(e.target.value)})}
//                   style={{ width: '100%', cursor: 'pointer' }}
//                 />
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
//                   <span>Poor</span><span>Excellent</span>
//                 </div>
//               </div>

//               <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#F3F4F6', color: '#111827', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' }}>
//                 <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> Submit Daily Log
//               </button>
//             </form>
//           </div>

//           {/* 👉 NEW Advanced Therapy Plan Builder PLACED HERE */}
//           <TherapyPlanBuilder patientId={patient._id} />

//           {/* Existing Notes */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} color="#8B5CF6"/> Internal Practitioner Notes</h3>
//             <textarea value={formData.internalNotes} onChange={(e) => setFormData({...formData, internalNotes: e.target.value})} placeholder="Private notes on patient response..." style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} />
//           </div>
//         </div>

//         {/* Right Column: Appointment & Log History */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
//           {/* Appointment History */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={20} color="#10B981"/> Session History</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               {appointments.length === 0 ? <p style={{ color: '#6B7280', fontSize: '14px' }}>No sessions booked yet.</p> : (
//                 appointments.map(apt => (
//                   <div key={apt._id} style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', borderLeft: `4px solid ${apt.status === 'Completed' ? '#10B981' : apt.status === 'Ongoing' ? '#F59E0B' : '#3B82F6'}` }}>
//                     <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#111827' }}>{apt.therapyName}</p>
//                     <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{new Date(apt.scheduledDate).toLocaleDateString()} at {apt.time}</p>
//                     <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#F3F4F6', color: '#374151' }}>{apt.status}</span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Log History */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="#F59E0B"/> Recent Adherence</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               {logs.length === 0 ? <p style={{ color: '#6B7280', fontSize: '14px' }}>No logs recorded yet.</p> : (
//                 logs.slice(0, 5).map(log => (
//                   <div key={log._id} style={{ padding: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
//                     <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>{new Date(log.date).toLocaleDateString()}</p>
//                     <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
//                       <span style={{ color: log.dietFollowed ? '#059669' : '#DC2626' }}>{log.dietFollowed ? '✅ Diet' : '❌ Diet'}</span>
//                       <span style={{ color: log.medicinesTaken ? '#059669' : '#DC2626' }}>{log.medicinesTaken ? '✅ Meds' : '❌ Meds'}</span>
//                     </div>
//                     <p style={{ margin: '6px 0 0 0', fontSize: '12px', fontWeight: 'bold' }}>Wellness: {log.wellnessScore}/10</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientProfile;


// src/pages/PatientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Calendar, FileText, Activity, CheckCircle, TrendingUp, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// 👉 NEW IMPORT ADDED HERE
import TherapyPlanBuilder from '../components/TherapyPlanBuilder';

const PatientProfile = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [logs, setLogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields for the file
  const [formData, setFormData] = useState({
    medicalHistory: '', internalNotes: ''
  });

  // State for the Daily Log form
  const [logData, setLogData] = useState({
    dietFollowed: false, medicinesTaken: false, routineFollowed: false, wellnessScore: 5
  });

  useEffect(() => {
    fetchProfile();
    fetchLogs(); 
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/admin/patients/${id}`);
      setPatient(response.data.patient);
      setAppointments(response.data.appointments);
      setFormData({
        medicalHistory: response.data.patient.medicalHistory || '',
        internalNotes: response.data.patient.internalNotes || ''
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile", err);
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/admin/logs/${id}`);
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await api.put(`/admin/patients/${id}`, formData);
      alert("Patient records updated successfully!");
      setSaving(false);
    } catch (err) {
      alert("Failed to save records.");
      setSaving(false);
    }
  };

  const generatePDF = () => {
    if (!patient) return;

    const doc = new jsPDF();
    
    // 1. Header (Clinic Name)
    doc.setFontSize(22);
    doc.setTextColor(5, 150, 105); // AyurCare Green
    doc.text("AyurCare", 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39); // Dark Gray
    doc.text("Official Patient Medical Report", 14, 30);
    
    // 2. Patient Demographics
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`Patient Name: ${patient.name}`, 14, 50);
    doc.text(`Age: ${patient.age || 'N/A'}`, 14, 58);
    doc.text(`Contact: ${patient.phone || 'N/A'} | ${patient.email}`, 14, 66);

    let currentY = 80;

    // 3. Active Therapy Plan (If exists)
    if (patient.therapyPlan && patient.therapyPlan.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text("Active Therapy Plan", 14, currentY);
      
      const planData = patient.therapyPlan.map((step, index) => [
        `Step ${index + 1}`, 
        step.therapyName, 
        step.duration, 
        step.frequency
      ]);

      doc.autoTable({
        startY: currentY + 5,
        head: [['Stage', 'Therapy', 'Duration', 'Frequency']],
        body: planData,
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] }
      });
      
      currentY = doc.lastAutoTable.finalY + 15;
    }

    // 4. Session History & Feedback (If exists)
    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text("Session History & Clinical Notes", 14, currentY);

      const historyData = patient.medicalHistory.map(record => [
        new Date(record.date).toLocaleDateString(),
        record.therapy || 'General',
        record.notes || 'No notes',
        record.feedback || 'No feedback'
      ]);

      doc.autoTable({
        startY: currentY + 5,
        head: [['Date', 'Therapy', 'Practitioner Notes', 'Patient Feedback']],
        body: historyData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] } // Blue header for history
      });
    }

    // 5. Download Trigger!
    doc.save(`${patient.name.replace(/\s+/g, '_')}_Medical_Report.pdf`);
  };

  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/logs', { ...logData, patientId: id });
      setLogs([response.data, ...logs]); // Instantly show on screen
      alert("Daily Adherence Log saved successfully!");
      // Reset log form
      setLogData({ dietFollowed: false, medicinesTaken: false, routineFollowed: false, wellnessScore: 5 });
    } catch (err) {
      alert("Failed to save daily log.");
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Patient File...</div>;
  if (!patient) return <div style={{ padding: '40px', color: 'red' }}>Patient not found!</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/dashboard/patients')} style={{ background: 'white', border: '1px solid #D1D5DB', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} color="#374151" />
        </button>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>{patient.name}'s File</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>
            {patient.email} | Age: {patient.age || 'N/A'} | Phone: {patient.phone || 'N/A'}
          </p>
        </div>
        
        {/* 👉 THE NEW PDF DOWNLOAD BUTTON */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button 
            onClick={generatePDF}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
            <Download size={18} /> Download Full Report
          </button>

          <button 
            onClick={handleSaveNotes}
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save File Notes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Editable Records */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Adherence Tracker UI */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
              <TrendingUp size={20} /> Log Daily Adherence
            </h3>
            
            <form onSubmit={handleSaveDailyLog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  <input type="checkbox" checked={logData.dietFollowed} onChange={(e) => setLogData({...logData, dietFollowed: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  Diet Followed
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  <input type="checkbox" checked={logData.medicinesTaken} onChange={(e) => setLogData({...logData, medicinesTaken: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  Medicines Taken
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  <input type="checkbox" checked={logData.routineFollowed} onChange={(e) => setLogData({...logData, routineFollowed: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  Routine Followed
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Overall Wellness Score: <span style={{ color: '#059669', fontWeight: 'bold' }}>{logData.wellnessScore} / 10</span>
                </label>
                <input 
                  type="range" min="1" max="10" 
                  value={logData.wellnessScore} 
                  onChange={(e) => setLogData({...logData, wellnessScore: parseInt(e.target.value)})}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  <span>Poor</span><span>Excellent</span>
                </div>
              </div>

              <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#F3F4F6', color: '#111827', border: '1px solid #D1D5DB', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> Submit Daily Log
              </button>
            </form>
          </div>

          {/* 👉 NEW Advanced Therapy Plan Builder PLACED HERE */}
          <TherapyPlanBuilder patientId={patient._id} />

          {/* Existing Notes */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} color="#8B5CF6"/> Internal Practitioner Notes</h3>
            <textarea value={formData.internalNotes} onChange={(e) => setFormData({...formData, internalNotes: e.target.value})} placeholder="Private notes on patient response..." style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>

        {/* Right Column: Appointment & Log History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Appointment History */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={20} color="#10B981"/> Session History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appointments.length === 0 ? <p style={{ color: '#6B7280', fontSize: '14px' }}>No sessions booked yet.</p> : (
                appointments.map(apt => (
                  <div key={apt._id} style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', borderLeft: `4px solid ${apt.status === 'Completed' ? '#10B981' : apt.status === 'Ongoing' ? '#F59E0B' : '#3B82F6'}` }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#111827' }}>{apt.therapyName}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>{new Date(apt.scheduledDate).toLocaleDateString()} at {apt.time}</p>
                    <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#F3F4F6', color: '#374151' }}>{apt.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log History */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="#F59E0B"/> Recent Adherence</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.length === 0 ? <p style={{ color: '#6B7280', fontSize: '14px' }}>No logs recorded yet.</p> : (
                logs.slice(0, 5).map(log => (
                  <div key={log._id} style={{ padding: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>{new Date(log.date).toLocaleDateString()}</p>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                      <span style={{ color: log.dietFollowed ? '#059669' : '#DC2626' }}>{log.dietFollowed ? '✅ Diet' : '❌ Diet'}</span>
                      <span style={{ color: log.medicinesTaken ? '#059669' : '#DC2626' }}>{log.medicinesTaken ? '✅ Meds' : '❌ Meds'}</span>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', fontWeight: 'bold' }}>Wellness: {log.wellnessScore}/10</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientProfile;