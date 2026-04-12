import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Mail, User } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // <-- Our new search state!

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/auth/users/patients');
      setPatients(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients", error);
      setLoading(false);
    }
  };

  // --- THE MAGIC FILTER LOGIC ---
  // This filters the list instantly as the user types
  const filteredPatients = patients.filter(patient =>{
    const safeName = patient.name || ""; 
    const safeEmail = patient.email || "";
    
    return safeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           safeEmail.toLowerCase().includes(searchTerm.toLowerCase());
});

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading patient database...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#064E3B' }}>Patient Directory</h2>
        <div style={{ backgroundColor: '#DBEAFE', color: '#1E3A8A', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Total: {patients.length}
        </div>
      </div>

      {/* --- LIVE SEARCH BAR --- */}
      <div style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB' }}>
        <Search color="#9CA3AF" style={{ marginRight: '12px' }} size={20} />
        <input
          type="text"
          placeholder="Search patients by name or email address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', color: '#374151', fontFamily: 'inherit' }}
        />
      </div>

      {/* --- PATIENT GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient._id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderTop: '4px solid #10B981', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
                  <User size={24} color="#6B7280" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#111827', fontSize: '18px' }}>{patient.name}</h3>
                  <span style={{ fontSize: '12px', backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Patient</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', color: '#4B5563', fontSize: '14px', marginTop: 'auto' }}>
                <Mail size={16} style={{ marginRight: '8px', color: '#9CA3AF' }} /> {patient.email}
              </div>
              
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', padding: '60px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
            <p style={{ margin: 0, fontSize: '16px' }}>No patients found matching "<strong>{searchTerm}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;