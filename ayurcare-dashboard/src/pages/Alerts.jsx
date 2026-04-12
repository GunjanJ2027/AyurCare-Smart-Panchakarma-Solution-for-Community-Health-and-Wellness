// src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/admin/dashboard/alerts');
      setAlerts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
      setLoading(false);
    }
  };

  // This removes the alert from the screen so the practitioner can "clear" their inbox
  const handleDismiss = (id) => {
    setAlerts(alerts.filter(alert => (alert._id || alert.id) !== id));
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading triage system...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Attention Triage</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Prioritized list of patients requiring immediate follow-up.</p>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '6px', fontWeight: 'bold' }}>
          {alerts.length} Active Alerts
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '24px' }}>
        
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#10B981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={48} />
            <h3 style={{ margin: 0 }}>All Clear!</h3>
            <p style={{ margin: 0 }}>No patients are currently missing sessions or reporting critically low adherence.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {alerts.map((alert, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E5E7EB', borderLeft: `6px solid ${alert.severity === 'High' ? '#EF4444' : '#F59E0B'}`, borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <AlertTriangle size={24} color={alert.severity === 'High' ? '#EF4444' : '#F59E0B'} />
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: '#111827' }}>{alert.patientName}</h3>
                    <p style={{ margin: 0, color: '#6B7280' }}>
                      <strong style={{ color: '#374151' }}>Reason:</strong> {alert.issue}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleDismiss(alert.id || alert._id)}
                    style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#6B7280', cursor: 'pointer', fontWeight: 'bold' }}>
                    Dismiss
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/patients/${alert.id || alert._id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <FileText size={16} /> Open File
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Alerts;