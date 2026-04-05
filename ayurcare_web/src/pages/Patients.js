import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Activity, FileText } from 'lucide-react';

const Patients = () => {
  const [patientList, setPatientList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/users/patients').then(res => setPatientList(res.data));
  }, []);

  const fetchPatientDetail = async (id) => {
    setLoading(true);
    setSelectedId(id);
    try {
      const res = await api.get(`/patient/record/${id}`);
      setDetail(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Left Column: Patient List */}
      <div style={{ width: '300px', backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px' }}>Patients</h3>
        {patientList.map(p => (
          <div 
            key={p._id}
            onClick={() => fetchPatientDetail(p._id)}
            style={{ 
              padding: '12px', 
              cursor: 'pointer', 
              borderRadius: '8px',
              backgroundColor: selectedId === p._id ? '#ECFDF5' : 'transparent',
              border: selectedId === p._id ? '1px solid #10B981' : '1px solid transparent',
              marginBottom: '8px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{p.email}</div>
          </div>
        ))}
      </div>

      {/* Right Column: Details & Charts */}
      <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '30px', overflowY: 'auto' }}>
        {!selectedId ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#9CA3AF' }}>Select a patient to view clinical records</div>
        ) : loading ? (
          <div>Loading records...</div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0 }}>{detail?.profile.name}</h2>
                <p style={{ color: '#6B7280' }}>Dosha Profile: <span style={{ color: '#10B981', fontWeight: 'bold' }}>{detail?.profile.doshaProfile || 'Not Tested'}</span></p>
              </div>
              <div style={{ padding: '10px 20px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>PATIENT ID:</span><br/>
                <code>{detail?.profile._id}</code>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '30px 0' }} />

            {/* Live Chart Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Activity size={20} color="#10B981" />
                <h3 style={{ margin: 0 }}>Health Recovery Trends</h3>
              </div>
              
              <div style={{ height: '300px', width: '100%' }}>
                {detail?.logs.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={detail.logs}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(str) => str.substring(5,10)} />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} name="Energy" />
                      <Line type="monotone" dataKey="digestion" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6 }} name="Digestion" />
                      <Line type="monotone" dataKey="sleep" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} name="Sleep" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px', color: '#9CA3AF' }}>
                    No health logs submitted by patient yet.
                  </div>
                )}
              </div>
            </div>

            {/* Treatment History */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <FileText size={20} color="#10B981" />
                <h3 style={{ margin: 0 }}>Treatment History</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontSize: '14px' }}>
                    <th style={{ padding: '12px' }}>Therapy</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {detail?.history.map(h => (
                    <tr key={h._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{h.therapyName}</td>
                      <td style={{ padding: '12px' }}>{h.scheduledDate.substring(0,10)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '12px', color: h.status === 'Completed' ? '#059669' : '#3B82F6' }}>{h.status}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', fontStyle: 'italic' }}>
                        {h.feedback ? `⭐ ${h.feedback.rating}/5` : 'No feedback yet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;