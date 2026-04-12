// src/pages/Overview.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Users, Activity, CalendarCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // We store the unified data here, and alerts separately
  const [stats, setStats] = useState({
    totalPatients: 0,
    sessionsToday: 0,
    activeTherapies: [],
    avgAdherence: 0,
    recoveryTrend: []
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch the unified KPIs and the separate Alerts simultaneously
      const [kpiRes, alertsRes] = await Promise.all([
        api.get('/admin/dashboard/kpis'),
        api.get('/admin/dashboard/alerts')
      ]);

      setStats(kpiRes.data);
      setAlerts(alertsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch live dashboard data:", err);
      setError("Unable to connect to the server. Please ensure the backend is running.");
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Fetching live clinic data...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Clinic Overview</h1>
        <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Real-time monitoring and patient analytics.</p>
      </div>

      {/* --- LIVE KPI CARDS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <KpiCard title="Total Patients" value={stats.totalPatients} icon={<Users size={24} color="#3B82F6" />} bg="#DBEAFE" />
        <KpiCard title="Active Therapies" value={stats.activeTherapies.length} icon={<Activity size={24} color="#8B5CF6" />} bg="#F3E8FF" />
        <KpiCard title="Sessions Today" value={stats.sessionsToday} icon={<CalendarCheck size={24} color="#10B981" />} bg="#D1FAE5" />
        <KpiCard title="Avg. Adherence" value={`${stats.avgAdherence}%`} icon={<TrendingUp size={24} color="#F59E0B" />} bg="#FEF3C7" />
      </div>

      {/* --- LIVE CHARTS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Real Recovery Trends */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Avg. Patient Recovery Trend</h3>
          {stats.recoveryTrend.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer>
                <LineChart data={stats.recoveryTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10}/>
                  <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dx={-10}/>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} cursor={{fill: 'transparent'}}/>
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '100px' }}>Not enough log data to show trends.</p>
          )}
        </div>

        {/* Real Therapy Distribution */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Active Therapies</h3>
          {stats.activeTherapies.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.activeTherapies} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.activeTherapies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '100px' }}>No active therapies assigned.</p>
          )}
        </div>
      </div>

      {/* --- LIVE ALERTS --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle color="#EF4444" size={20} /> High-Risk Patient Alerts
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.length > 0 ? alerts.map(alert => (
            <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderLeft: `4px solid ${alert.severity === 'High' ? '#EF4444' : '#F59E0B'}`, backgroundColor: '#F9FAFB', borderRadius: '0 8px 8px 0' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>{alert.patientName}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>{alert.issue}</p>
              </div>
              <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>
                Review File
              </button>
            </div>
          )) : (
            <p style={{ color: '#6B7280' }}>No active alerts. All patients are on track.</p>
          )}
        </div>
      </div>

    </div>
  );
};

// Reusable KPI Block
const KpiCard = ({ title, value, icon, bg }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: bg, padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>{title}</p>
      <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{value}</h3>
    </div>
  </div>
);

export default Overview;


