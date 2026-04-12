// // src/pages/Analytics.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api'; 
// import { Users, Activity, CalendarCheck, TrendingUp, BrainCircuit, Clock, UserCog, AlertTriangle, MessageSquare } from 'lucide-react';
// import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

// // 👉 Your new component perfectly imported here
// import FeedbackDashboard from '../components/FeedbackDashboard';
// import AuditLogViewer from '../components/AuditLogViewer';

// import { Shield } from 'lucide-react';
// const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

// const Analytics = () => {
//   const [activeTab, setActiveTab] = useState('overview'); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // State for Overview Tab
//   const [stats, setStats] = useState({
//     totalPatients: 0, sessionsToday: 0, activeTherapies: [], avgAdherence: 0, recoveryTrend: []
//   });
  
//   // State for Advanced Insights Tab
//   const [insights, setInsights] = useState({
//     therapistWorkload: [],
//     peakHours: [],
//     dropoutRisks: []
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [kpiRes, insightsRes] = await Promise.all([
//         api.get('/admin/dashboard/kpis'),
//         api.get('/admin/dashboard/advanced-insights') 
//       ]);
      
//       setStats(kpiRes.data);
//       setInsights(insightsRes.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch live dashboard data:", err);
//       setError("Unable to connect to the server.");
//       setLoading(false);
//     }
//   };

//   if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Calculating real-time analytics...</div>;
//   if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>{error}</div>;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
//       {/* Header & Tabs */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
//         <div>
//           <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Analytics & Reports</h1>
//           <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Real-time monitoring and advanced clinic insights.</p>
//         </div>
        
//         <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
//           <button 
//             onClick={() => setActiveTab('overview')}
//             style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'overview' ? 'white' : 'transparent', color: activeTab === 'overview' ? '#111827' : '#6B7280', boxShadow: activeTab === 'overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
//             Clinic Overview
//           </button>
//           <button 
//             onClick={() => setActiveTab('insights')}
//             style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'insights' ? 'white' : 'transparent', color: activeTab === 'insights' ? '#111827' : '#6B7280', boxShadow: activeTab === 'insights' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
//             <BrainCircuit size={16} /> Advanced Insights
//           </button>
//           <button 
//             onClick={() => setActiveTab('feedback')}
//             style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'feedback' ? 'white' : 'transparent', color: activeTab === 'feedback' ? '#111827' : '#6B7280', boxShadow: activeTab === 'feedback' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
//             <MessageSquare size={16} /> Patient Feedback
//           </button>
//         </div>
//       </div>

//       {/* =========================================
//           TAB 1: CLINIC OVERVIEW
//           ========================================= */}
//       {activeTab === 'overview' && (
//         <>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
//             <KpiCard title="Total Patients" value={stats.totalPatients} icon={<Users size={24} color="#3B82F6" />} bg="#DBEAFE" />
//             <KpiCard title="Active Therapies" value={stats.activeTherapies.length} icon={<Activity size={24} color="#8B5CF6" />} bg="#F3E8FF" />
//             <KpiCard title="Sessions Today" value={stats.sessionsToday} icon={<CalendarCheck size={24} color="#10B981" />} bg="#D1FAE5" />
//             <KpiCard title="Avg. Adherence" value={`${stats.avgAdherence}%`} icon={<TrendingUp size={24} color="#F59E0B" />} bg="#FEF3C7" />
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
//             <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//               <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Avg. Patient Recovery Trend</h3>
//               <div style={{ height: '300px', width: '100%' }}>
//                 <ResponsiveContainer>
//                   <LineChart data={stats.recoveryTrend}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
//                     <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10}/>
//                     <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dx={-10}/>
//                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
//                     <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//               <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Active Therapies</h3>
//               <div style={{ height: '300px', width: '100%' }}>
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie data={stats.activeTherapies} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                       {stats.activeTherapies.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
//                     </Pie>
//                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }}/>
//                     <Legend verticalAlign="bottom" height={36} iconType="circle" />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* =========================================
//           TAB 2: ADVANCED INSIGHTS
//           ========================================= */}
//       {activeTab === 'insights' && (
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <Clock color="#8B5CF6" size={20} /> Room & Peak Hour Utilization
//             </h3>
//             <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Real-time traffic based on scheduled appointments.</p>
//             {insights.peakHours.length > 0 ? (
//               <div style={{ height: '250px', width: '100%' }}>
//                 <ResponsiveContainer>
//                   <AreaChart data={insights.peakHours}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
//                     <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
//                     <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
//                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
//                     <Area type="monotone" dataKey="patients" stroke="#8B5CF6" fill="#EDE9FE" strokeWidth={3} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>No schedule data available.</div>
//             )}
//           </div>

//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//             <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <UserCog color="#3B82F6" size={20} /> Therapist Workload (Active)
//             </h3>
//             <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Active session distribution across your staff.</p>
//             {insights.therapistWorkload.length > 0 ? (
//               <div style={{ height: '250px', width: '100%' }}>
//                 <ResponsiveContainer>
//                   <BarChart data={insights.therapistWorkload} layout="vertical" margin={{ left: 20 }}>
//                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
//                     <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
//                     <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
//                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
//                     <Bar dataKey="sessions" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>No therapists assigned yet.</div>
//             )}
//           </div>

//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
//             <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <AlertTriangle color="#EF4444" size={20} /> AI Predictive Drop-Out Risk
//             </h3>
            
//             {insights.dropoutRisks.length > 0 ? (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
//                 {insights.dropoutRisks.map((patient, idx) => (
//                   <div key={idx} style={{ padding: '16px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div>
//                       <h4 style={{ margin: '0 0 4px 0', color: '#991B1B', fontSize: '16px' }}>{patient.name}</h4>
//                       <p style={{ margin: 0, color: '#DC2626', fontSize: '14px' }}>{patient.reason}</p>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#991B1B', fontWeight: 'bold', textTransform: 'uppercase' }}>Drop-Out Risk</p>
//                       <h2 style={{ margin: 0, color: '#DC2626', fontSize: '24px' }}>{patient.risk}</h2>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ color: '#059669', fontSize: '14px', backgroundColor: '#D1FAE5', padding: '16px', borderRadius: '8px' }}>
//                 ✅ All patients are showing strong adherence. No drop-out risks detected based on current session data.
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* =========================================
//           TAB 3: PATIENT FEEDBACK (Perfectly Wired)
//           ========================================= */}
//       {activeTab === 'feedback' && (
//         <FeedbackDashboard />
//       )}

//     </div>
//   );
// };

// // Reusable KPI Block
// const KpiCard = ({ title, value, icon, bg }) => (
//   <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
//     <div style={{ backgroundColor: bg, padding: '12px', borderRadius: '50%', marginRight: '16px' }}>{icon}</div>
//     <div>
//       <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>{title}</p>
//       <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{value}</h3>
//     </div>
//   </div>
// );

// export default Analytics;

// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Users, Activity, CalendarCheck, TrendingUp, BrainCircuit, Clock, UserCog, AlertTriangle, MessageSquare, Shield } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

// 👉 Your components perfectly imported here
import FeedbackDashboard from '../components/FeedbackDashboard';
import AuditLogViewer from '../components/AuditLogViewer';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

const Analytics = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || { role: 'patient' };
  const [activeTab, setActiveTab] = useState('overview'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Overview Tab
  const [stats, setStats] = useState({
    totalPatients: 0, sessionsToday: 0, activeTherapies: [], avgAdherence: 0, recoveryTrend: []
  });
  
  // State for Advanced Insights Tab
  const [insights, setInsights] = useState({
    therapistWorkload: [],
    peakHours: [],
    dropoutRisks: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [kpiRes, insightsRes] = await Promise.all([
        api.get('/admin/dashboard/kpis'),
        api.get('/admin/dashboard/advanced-insights') 
      ]);
      
      setStats(kpiRes.data);
      setInsights(insightsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch live dashboard data:", err);
      setError("Unable to connect to the server.");
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Calculating real-time analytics...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEE2E2', borderRadius: '8px' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Analytics & Reports</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Real-time monitoring and advanced clinic insights.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'overview' ? 'white' : 'transparent', color: activeTab === 'overview' ? '#111827' : '#6B7280', boxShadow: activeTab === 'overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
            Clinic Overview
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'insights' ? 'white' : 'transparent', color: activeTab === 'insights' ? '#111827' : '#6B7280', boxShadow: activeTab === 'insights' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BrainCircuit size={16} /> Advanced Insights
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'feedback' ? 'white' : 'transparent', color: activeTab === 'feedback' ? '#111827' : '#6B7280', boxShadow: activeTab === 'feedback' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={16} /> Patient Feedback
          </button>
          {/* 👉 NEW: Security Audit Tab */}
          <button 
            onClick={() => setActiveTab('audit')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'audit' ? 'white' : 'transparent', color: activeTab === 'audit' ? '#111827' : '#6B7280', boxShadow: activeTab === 'audit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} /> Security Audit
          </button>
        </div>
      </div>

      {/* =========================================
          TAB 1: CLINIC OVERVIEW
          ========================================= */}
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <KpiCard title="Total Patients" value={stats.totalPatients} icon={<Users size={24} color="#3B82F6" />} bg="#DBEAFE" />
            <KpiCard title="Active Therapies" value={stats.activeTherapies.length} icon={<Activity size={24} color="#8B5CF6" />} bg="#F3E8FF" />
            <KpiCard title="Sessions Today" value={stats.sessionsToday} icon={<CalendarCheck size={24} color="#10B981" />} bg="#D1FAE5" />
            <KpiCard title="Avg. Adherence" value={`${stats.avgAdherence}%`} icon={<TrendingUp size={24} color="#F59E0B" />} bg="#FEF3C7" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Avg. Patient Recovery Trend</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={stats.recoveryTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10}/>
                    <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dx={-10}/>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                    <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Active Therapies</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={stats.activeTherapies} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {stats.activeTherapies.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }}/>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================
          TAB 2: ADVANCED INSIGHTS
          ========================================= */}
      {activeTab === 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock color="#8B5CF6" size={20} /> Room & Peak Hour Utilization
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Real-time traffic based on scheduled appointments.</p>
            {insights.peakHours.length > 0 ? (
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={insights.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                    <Area type="monotone" dataKey="patients" stroke="#8B5CF6" fill="#EDE9FE" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>No schedule data available.</div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCog color="#3B82F6" size={20} /> Therapist Workload (Active)
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>Active session distribution across your staff.</p>
            {insights.therapistWorkload.length > 0 ? (
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={insights.therapistWorkload} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                    <Bar dataKey="sessions" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>No therapists assigned yet.</div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle color="#EF4444" size={20} /> AI Predictive Drop-Out Risk
            </h3>
            
            {insights.dropoutRisks.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {insights.dropoutRisks.map((patient, idx) => (
                  <div key={idx} style={{ padding: '16px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#991B1B', fontSize: '16px' }}>{patient.name}</h4>
                      <p style={{ margin: 0, color: '#DC2626', fontSize: '14px' }}>{patient.reason}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#991B1B', fontWeight: 'bold', textTransform: 'uppercase' }}>Drop-Out Risk</p>
                      <h2 style={{ margin: 0, color: '#DC2626', fontSize: '24px' }}>{patient.risk}</h2>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#059669', fontSize: '14px', backgroundColor: '#D1FAE5', padding: '16px', borderRadius: '8px' }}>
                ✅ All patients are showing strong adherence. No drop-out risks detected based on current session data.
              </p>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 3: PATIENT FEEDBACK (Perfectly Wired)
          ========================================= */}
      {activeTab === 'feedback' && (
        <FeedbackDashboard />
      )}

      {/* =========================================
          TAB 4: SECURITY AUDIT LOGS (Feature 15)
          ========================================= */}
      {activeTab === 'audit' && (
        <AuditLogViewer />
      )}

    </div>
  );
};

// Reusable KPI Block
const KpiCard = ({ title, value, icon, bg }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
    <div style={{ backgroundColor: bg, padding: '12px', borderRadius: '50%', marginRight: '16px' }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>{title}</p>
      <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{value}</h3>
    </div>
  </div>
);

export default Analytics;