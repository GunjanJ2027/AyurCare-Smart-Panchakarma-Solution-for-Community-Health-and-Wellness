// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Printer, Building, User as UserIcon } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('clinic'); // 'clinic' or 'patient'
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  const [clinicData, setClinicData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load patients list for the dropdown
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/admin/patients/list');
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to load patients for reports");
      }
    };
    fetchPatients();
  }, []);

  // Fetch the specific report data when buttons are clicked
  const generateReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'clinic') {
        const res = await api.get('/admin/dashboard/kpis');
        setClinicData(res.data);
        setPatientData(null);
      } else if (reportType === 'patient' && selectedPatientId) {
        const res = await api.get(`/admin/patients/${selectedPatientId}`);
        setPatientData(res.data);
        setClinicData(null);
      }
    } catch (error) {
      alert("Failed to generate report.");
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* CSS to hide controls during printing and format the page */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background-color: white; }
            .print-container { box-shadow: none !important; border: none !important; padding: 0 !important; }
          }
        `}
      </style>

      {/* --- REPORT CONTROLS (Hidden during print) --- */}
      <div className="no-print" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={24} color="#059669" /> Report Generator
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => { setReportType(e.target.value); setClinicData(null); setPatientData(null); }}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', width: '200px' }}>
              <option value="clinic">Clinic Performance Summary</option>
              <option value="patient">Individual Patient History</option>
            </select>
          </div>

          {reportType === 'patient' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Patient</label>
              <select 
                value={selectedPatientId} 
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', width: '250px' }}>
                <option value="">-- Choose a Patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <button 
            onClick={generateReport}
            disabled={reportType === 'patient' && !selectedPatientId}
            style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>

          {(clinicData || patientData) && (
            <button 
              onClick={handlePrint}
              style={{ padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <Printer size={18} /> Print / Save as PDF
            </button>
          )}
        </div>
      </div>

      {/* --- REPORT OUTPUT AREA --- */}
      
      {/* 1. Clinic Summary Template */}
      {clinicData && (
        <div className="print-container" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#111827' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #E5E7EB', paddingBottom: '20px', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Building size={28} /> AyurCare Clinic
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Official Performance Summary • Generated {new Date().toLocaleDateString()}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <p style={{ margin: 0, color: '#6B7280', fontWeight: 'bold' }}>Total Registered Patients</p>
              <h1 style={{ margin: '10px 0 0 0', fontSize: '36px', color: '#111827' }}>{clinicData.totalPatients}</h1>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <p style={{ margin: 0, color: '#6B7280', fontWeight: 'bold' }}>Average Patient Adherence</p>
              <h1 style={{ margin: '10px 0 0 0', fontSize: '36px', color: '#111827' }}>{clinicData.avgAdherence}%</h1>
            </div>
          </div>

          <h3>Active Therapy Distribution</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '2px solid #D1D5DB', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Therapy Name</th>
                <th style={{ padding: '12px' }}>Active Sessions</th>
              </tr>
            </thead>
            <tbody>
              {clinicData.activeTherapies.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontStyle: 'italic' }}>
                    No active sessions on record. (Sessions may be cancelled or none are booked).
                  </td>
                </tr>
              ) : (
                clinicData.activeTherapies.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{t.name}</td>
                    <td style={{ padding: '12px' }}>{t.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Individual Patient Template */}
      {patientData && (
        <div className="print-container" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#111827' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #E5E7EB', paddingBottom: '20px', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Building size={28} /> AyurCare Clinic
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Confidential Medical Record • Generated {new Date().toLocaleDateString()}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <UserIcon size={40} color="#6B7280" />
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{patientData.patient.name}</h3>
              <p style={{ margin: 0, color: '#6B7280' }}>Email: {patientData.patient.email} | Phone: {patientData.patient.phone || 'N/A'} | Age: {patientData.patient.age || 'N/A'}</p>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>Assigned Therapy Plan</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#374151', marginBottom: '30px' }}>
            {patientData.patient.therapyPlan || 'No active plan recorded.'}
          </p>

          <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>Session History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '2px solid #D1D5DB', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Therapy</th>
                <th style={{ padding: '12px' }}>Therapist</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {patientData.appointments.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center', color: '#6B7280' }}>No sessions on record.</td></tr>
              ) : (
                patientData.appointments.map(apt => (
                  <tr key={apt._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px' }}>{new Date(apt.scheduledDate).toLocaleDateString()} at {apt.time}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{apt.therapyName}</td>
                    <td style={{ padding: '12px' }}>{apt.therapistName}</td>
                    <td style={{ padding: '12px', color: apt.status === 'Completed' ? '#10B981' : apt.status === 'Cancelled' ? '#EF4444' : '#111827' }}>{apt.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default Reports;