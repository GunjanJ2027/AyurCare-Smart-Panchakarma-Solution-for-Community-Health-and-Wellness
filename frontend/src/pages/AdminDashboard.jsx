// // src/pages/AdminDashboard.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { generatePrescription } from '../utils/generatePrescription';
// import { 
//   LayoutDashboard, Users, Activity, HeartHandshake, LogOut, 
//   Menu, TrendingUp, Map, ShieldCheck, Leaf, CheckCircle2, History, Download, Package, Plus, Languages, Trash2
// } from 'lucide-react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation(); 
  
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview'); 
//   const [completedAppointments, setCompletedAppointments] = useState([]);
//   const [activeTodayCount, setActiveTodayCount] = useState(0);
//   const [dashboardStats, setDashboardStats] = useState({ totalCompleted: 0, uniquePatients: 0 });
//   const [dynamicPieData, setDynamicPieData] = useState([]);
//   const [monthlyTrends, setMonthlyTrends] = useState([]);
  
//   const [inventory, setInventory] = useState([]);
//   const [newItem, setNewItem] = useState({ itemName: '', category: 'Oils', quantity: '', unit: 'ml' });

//   const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     navigate('/');
//   };

//   const toggleLanguage = () => {
//     const newLang = i18n.language === 'en' ? 'hi' : 'en';
//     i18n.changeLanguage(newLang);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) { navigate('/'); return; }

//         const apptRes = await fetch('http://localhost:5000/api/patient/appointments/all', {
//           headers: { 'x-auth-token': token }
//         });
//         const apptData = await apptRes.json();

//         if (apptRes.ok) {
//           const completed = apptData.filter(appt => appt.status === 'Completed');
//           setCompletedAppointments(completed);
          
//           const uniquePatientIds = new Set(completed.map(appt => appt.patientId));
//           setDashboardStats({ totalCompleted: completed.length, uniquePatients: uniquePatientIds.size });

//           // Calculate Pie Chart Data
//           const popularity = completed.reduce((acc, curr) => {
//             acc[curr.therapyName] = (acc[curr.therapyName] || 0) + 1;
//             return acc;
//           }, {});
//           setDynamicPieData(Object.keys(popularity).map(name => ({ name, value: popularity[name] })));

//           // Calculate Monthly Trends
//           const months = completed.reduce((acc, curr) => {
//             const m = new Date(curr.scheduledDate).toLocaleString('default', { month: 'short' });
//             acc[m] = (acc[m] || 0) + 1;
//             return acc;
//           }, {});
//           setMonthlyTrends(Object.keys(months).map(m => ({ month: m, patients: months[m] })));
//         }

//         const invRes = await fetch('http://localhost:5000/api/admin/inventory', {
//           headers: { 'x-auth-token': token }
//         });
//         if (invRes.ok) setInventory(await invRes.json());

//       } catch (error) { console.error(error); }
//     };
//     fetchData();
//   }, [navigate]);

//   const handleAddInventory = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch('http://localhost:5000/api/admin/inventory', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
//         body: JSON.stringify(newItem)
//       });
//       if (res.ok) {
//         const addedItem = await res.json();
//         setInventory([...inventory, addedItem]);
//         setNewItem({ itemName: '', category: 'Oils', quantity: '', unit: 'ml' }); 
//       }
//     } catch (err) { console.error(err); }
//   };

//   const handleDeleteInventory = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`http://localhost:5000/api/admin/inventory/${id}`, {
//         method: 'DELETE',
//         headers: { 'x-auth-token': token }
//       });
//       if (res.ok) setInventory(inventory.filter(item => item._id !== id));
//     } catch (err) { console.error(err); }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex relative">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col z-20`}>
//         <div className="p-4 flex items-center justify-between border-b border-gray-800">
//           {isSidebarOpen && <span className="text-xl font-bold flex items-center gap-2 text-green-500"><ShieldCheck size={24}/> {t('admin_portal')}</span>}
//           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded"><Menu size={24} /></button>
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><LayoutDashboard size={20} />{isSidebarOpen && <span>{t('platform_overview')}</span>}</button>
//           <button onClick={() => setActiveTab('completed')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'completed' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><History size={20} />{isSidebarOpen && <span>{t('completed_sessions')}</span>}</button>
//           <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><Package size={20} />{isSidebarOpen && <span>{t('pharmacy_stock')}</span>}</button>
//           <button onClick={() => setActiveTab('impact')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'impact' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><HeartHandshake size={20} />{isSidebarOpen && <span>{t('ngo_impact')}</span>}</button>
//         </nav>
//         <div className="p-4 border-t border-gray-800">
//           <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-red-900/50 rounded-lg text-red-400"><LogOut size={20} />{isSidebarOpen && <span>{t('secure_logout')}</span>}</button>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center border-b border-gray-200">
//           <div><h1 className="text-2xl font-semibold text-gray-800">{t('command_center')}</h1><p className="text-sm text-gray-500">System Administrator • AyurCare Network</p></div>
//           <div className="flex items-center gap-4">
//             <button onClick={toggleLanguage} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-300"><Languages size={18} /> {i18n.language === 'en' ? 'हिंदी' : 'English'}</button>
//             <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium flex items-center gap-2 border border-green-100"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>System Live</div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          
//           {/* TAB 1: OVERVIEW */}
//           {activeTab === 'overview' && (
//             <div className="space-y-6 animate-fade-in">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                   <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Patients Treated</p><Users className="text-blue-500" size={24}/></div>
//                   <h3 className="text-3xl font-bold text-gray-800 mt-4">{dashboardStats.uniquePatients}</h3>
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                   <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Total Completed</p><CheckCircle2 className="text-green-500" size={24}/></div>
//                   <h3 className="text-3xl font-bold text-gray-800 mt-4">{dashboardStats.totalCompleted}</h3>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4">Therapy Popularity</h3>
//                   {dynamicPieData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart><Pie data={dynamicPieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">{dynamicPieData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}</Pie><Tooltip /><Legend /></PieChart>
//                     </ResponsiveContainer>
//                   ) : <div className="m-auto text-gray-400">Waiting for completed sessions...</div>}
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
//                    <h3 className="text-lg font-bold text-gray-800 mb-4">Treatment Trends</h3>
//                    {monthlyTrends.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="patients" fill="#10B981" radius={[4, 4, 0, 0]} /></BarChart>
//                     </ResponsiveContainer>
//                   ) : <div className="h-full flex items-center justify-center text-gray-400">No monthly data yet.</div>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 2: COMPLETED SESSIONS */}
//           {activeTab === 'completed' && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gray-50">
//                 <h2 className="text-xl font-bold text-gray-800">Historical Patient Records</h2>
//               </div>
//               <div className="p-6">
//                 {completedAppointments.length === 0 ? (
//                   <div className="text-center py-12"><History size={48} className="mx-auto text-gray-300 mb-3"/><p>No history found.</p></div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                       <thead><tr className="text-gray-500 text-sm border-b"><th className="p-4">Date</th><th className="p-4">Therapy</th><th className="p-4">Actions</th></tr></thead>
//                       <tbody>
//                         {completedAppointments.map((appt) => (
//                           <tr key={appt._id} className="border-b">
//                             <td className="p-4">{new Date(appt.scheduledDate).toLocaleDateString()}</td>
//                             <td className="p-4 font-bold text-blue-600">{appt.therapyName}</td>
//                             <td className="p-4"><button onClick={() => generatePrescription('Patient', appt.therapyName, 'Vata', appt.scheduledDate)} className="text-green-600 bg-green-50 px-3 py-1 rounded-md"><Download size={16} /></button></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* TAB 3: INVENTORY */}
//           {activeTab === 'inventory' && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <h3 className="font-bold mb-4">Add New Stock</h3>
//                 <form onSubmit={handleAddInventory} className="space-y-4">
//                   <input type="text" required value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Item Name" />
//                   <div className="flex gap-2">
//                     <input type="number" required value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-1/2 p-2 border rounded-lg" placeholder="Qty" />
//                     <select value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} className="w-1/2 p-2 border rounded-lg"><option value="ml">ml</option><option value="grams">grams</option></select>
//                   </div>
//                   <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Save</button>
//                 </form>
//               </div>
//               <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <table className="w-full text-left">
//                   <thead><tr className="border-b text-gray-500 text-sm"><th className="p-3">Item</th><th className="p-3">Qty</th><th className="p-3">Action</th></tr></thead>
//                   <tbody>
//                     {inventory.map((item) => (
//                       <tr key={item._id} className="border-b">
//                         <td className="p-3 font-bold">{item.itemName}</td>
//                         <td className="p-3">{item.quantity} {item.unit}</td>
//                         <td className="p-3"><button onClick={() => handleDeleteInventory(item._id)} className="text-red-400"><Trash2 size={16} /></button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* TAB 4: IMPACT */}
//           {activeTab === 'impact' && (
//             <div className="space-y-6">
//               <div className="bg-gradient-to-r from-teal-800 to-green-700 rounded-2xl p-8 text-white">
//                 <h2 className="text-3xl font-bold flex items-center gap-3"><HeartHandshake size={32}/> NGO Impact</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white p-8 rounded-2xl shadow-sm text-center border-t-4 border-purple-500">
//                    <p className="text-gray-500 text-sm">Total Served</p>
//                    <p className="text-4xl font-bold">{dashboardStats.uniquePatients}</p>
//                 </div>
//                 <div className="bg-white p-8 rounded-2xl shadow-sm text-center border-t-4 border-blue-500">
//                    <p className="text-gray-500 text-sm">Free Therapies</p>
//                    <p className="text-4xl font-bold">{dashboardStats.totalCompleted}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }


// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Stethoscope, Calendar as CalendarIcon, 
  Activity, CheckCircle, Clock, LogOut, Download, Database
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState({
    admin: null,
    patients: [],
    practitioners: [],
    appointments: []
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Go back to login
  };

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'x-auth-token': token }
        });

        if (res.ok) {
          const data = await res.json();
          setSystemData(data);
        }
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemData();
  }, [navigate]);

  const { patients, practitioners, appointments, admin } = systemData;
  const pendingAppts = appointments.filter(a => a.status === 'Scheduled');
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p className="text-emerald-800 font-bold">Connecting to Master Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col z-20 shadow-xl hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <span className="text-xl font-bold flex items-center gap-2 text-emerald-400"><Shield size={28}/> Command Center</span>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">{admin?.name || 'NGO Admin'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Activity size={20} /><span>System Overview</span></button>
          <button onClick={() => setActiveTab('practitioners')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium ${activeTab === 'practitioners' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Stethoscope size={20} /><span>Doctors & Staff</span></button>
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all font-medium ${activeTab === 'patients' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Users size={20} /><span>Patient Database</span></button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-red-900/30 rounded-xl text-red-400 transition-colors"><LogOut size={20} /><span>Secure Logout</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center border-b border-slate-200">
          <div className="md:hidden flex items-center gap-2 text-emerald-600 font-bold"><Shield size={24}/> Menu</div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-800">AyurCare Network</h1>
            <p className="text-sm text-slate-500 font-medium">Real-time NGO Monitoring</p>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
              {/* Stat Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div><p className="text-sm font-bold text-slate-500 uppercase">Total Patients</p><h3 className="text-3xl font-black text-slate-800">{patients.length}</h3></div>
                  <div className="bg-blue-50 p-3 rounded-xl"><Users className="text-blue-500" size={32} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div><p className="text-sm font-bold text-slate-500 uppercase">Active Doctors</p><h3 className="text-3xl font-black text-slate-800">{practitioners.length}</h3></div>
                  <div className="bg-teal-50 p-3 rounded-xl"><Stethoscope className="text-teal-500" size={32} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div><p className="text-sm font-bold text-slate-500 uppercase">Pending Approvals</p><h3 className="text-3xl font-black text-slate-800">{pendingAppts.length}</h3></div>
                  <div className="bg-amber-50 p-3 rounded-xl"><Clock className="text-amber-500" size={32} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div><p className="text-sm font-bold text-slate-500 uppercase">Therapies Done</p><h3 className="text-3xl font-black text-slate-800">{completedAppts.length}</h3></div>
                  <div className="bg-green-50 p-3 rounded-xl"><CheckCircle className="text-green-500" size={32} /></div>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2"><Database size={18} className="text-emerald-500"/> System Activity Log</h2>
                  <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700"><Download size={16}/> Export CSV</button>
                </div>
                <div className="p-0">
                  {appointments.length === 0 ? (
                    <p className="p-8 text-center text-slate-500 font-medium">No activity in the network yet.</p>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-white border-b border-slate-100">
                        <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">Therapy</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.slice(0, 8).map((appt) => (
                          <tr key={appt._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-sm font-medium text-slate-700 flex items-center gap-2"><CalendarIcon size={14} className="text-slate-400"/> {new Date(appt.scheduledDate).toLocaleDateString()}</td>
                            <td className="p-4 text-sm font-bold text-slate-800">{appt.therapyName}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                appt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                appt.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>{appt.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3 Placeholders (You can expand these tables later if needed!) */}
          {activeTab === 'practitioners' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
              <Stethoscope size={48} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-700">Practitioner Directory</h2>
              <p className="text-slate-500">Currently managing {practitioners.length} active doctors.</p>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-700">Master Patient Database</h2>
              <p className="text-slate-500">Currently tracking {patients.length} registered patients.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}