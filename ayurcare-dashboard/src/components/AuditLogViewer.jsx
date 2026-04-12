// src/components/AuditLogViewer.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Trash2, Edit3, UserPlus, Clock } from 'lucide-react';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/dashboard/audit');
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load audit logs", err);
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('DELETE')) return <Trash2 size={18} color="#EF4444" />;
    if (action.includes('CREATE')) return <UserPlus size={18} color="#10B981" />;
    if (action.includes('UPDATE')) return <Edit3 size={18} color="#3B82F6" />;
    return <ShieldCheck size={18} color="#6B7280" />;
  };

  if (loading) return <div style={{ padding: '20px', color: '#6B7280' }}>Decrypting Secure Ledger...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <ShieldCheck size={28} color="#111827" />
        <div>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '20px' }}>System Audit Logs</h2>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>Immutable record of critical administrative actions.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {logs.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No critical actions have been logged yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                {getActionIcon(log.action)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#111827', fontSize: '15px' }}>{log.adminName}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
                    <Clock size={12} /> {new Date(log.date).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '14px' }}>
                  <span style={{ fontWeight: '600', color: log.action.includes('DELETE') ? '#DC2626' : '#2563EB' }}>[{log.action}]</span> — Target: {log.target}
                </p>
                {log.details && <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>Note: {log.details}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogViewer;