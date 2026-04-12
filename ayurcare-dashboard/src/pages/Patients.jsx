// src/pages/Patients.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Plus, Search, FileText, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth to check roles

const Patients = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user details
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  // const fetchPatients = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.get('/admin/patients');
  //     setPatients(response.data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error("Failed to fetch patients:", err);
  //     setLoading(false);
  //   }
  // };
  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // 1. Grab the token directly
      const token = localStorage.getItem('token');
      console.log("🔑 Manually attaching token:", token ? "FOUND IT" : "MISSING");

      // 2. Force it into the headers manually!
      const response = await api.get('/admin/patients', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setLoading(false);
    }
  };

  // const handleCreatePatient = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.post('/admin/patients', formData);
  //     setPatients([response.data, ...patients]); 
  //     setIsModalOpen(false); 
  //     setFormData({ name: '', email: '', phone: '', age: '', medicalHistory: '' }); 
  //   } catch (err) {
  //     alert("Failed to add patient. If using email, make sure it is unique!");
  //     console.error(err);
  //   }
  // };
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Grab token
      
      // Pass the formData AND the headers manually
      const response = await api.post('/admin/patients', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPatients([response.data, ...patients]); 
      setIsModalOpen(false); 
      setFormData({ name: '', email: '', phone: '', age: '', medicalHistory: '' }); 
    } catch (err) {
      alert("Failed to add patient. If using email, make sure it is unique!");
      console.error(err);
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to completely delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/patients/${id}`);
      setPatients(patients.filter(patient => patient._id !== id));
      await api.post('/admin/dashboard/audit', {
        adminName: user?.name || 'System Admin',
        action: 'DELETED_PATIENT',
        target: `Patient Name: ${name}`,
        details: `Permanently removed from the database by an administrator.`
      });
    } catch (err) {
      alert("Failed to delete the patient.");
      console.error(err);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '40px' }}>Loading patient database...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Patient Directory</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Manage patient profiles and medical history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Plus size={18} /> Add Patient
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '16px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search patients by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Patient Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              <th style={{ padding: '16px', color: '#374151', fontWeight: '600' }}>Patient Name</th>
              <th style={{ padding: '16px', color: '#374151', fontWeight: '600' }}>Contact Info</th>
              <th style={{ padding: '16px', color: '#374151', fontWeight: '600' }}>Age</th>
              <th style={{ padding: '16px', color: '#374151', fontWeight: '600' }}>Joined</th>
              <th style={{ padding: '16px', color: '#374151', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                  No patients found. Click "Add Patient" to get started.
                </td>
              </tr>
            ) : (
              filteredPatients.map(patient => (
                <tr key={patient._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {patient.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '500', color: '#111827' }}>{patient.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280' }}>
                    <div style={{ fontSize: '14px' }}>{patient.email}</div>
                    <div style={{ fontSize: '12px' }}>{patient.phone || 'No phone'}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#6B7280' }}>{patient.age || '--'}</td>
                  <td style={{ padding: '16px', color: '#6B7280' }}>{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}> 
                    
                    <button 
                      onClick={() => navigate(`/dashboard/patients/${patient._id}`)} 
                      style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#374151' }}
                    >
                      <FileText size={14} /> View File
                    </button>
                    
                    {/* --- ROLE PROTECTED DELETE BUTTON --- */}
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDeletePatient(patient._id, patient.name)}
                        style={{ padding: '6px 10px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: '#DC2626' }}
                        title="Delete Patient"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD PATIENT MODAL --- */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Register New Patient</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
            </div>

            <form onSubmit={handleCreatePatient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Age</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone Number</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Patient Profile
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;