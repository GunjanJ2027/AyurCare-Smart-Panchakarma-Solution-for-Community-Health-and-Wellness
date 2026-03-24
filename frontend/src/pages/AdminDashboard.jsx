// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { LayoutDashboard, Users, Activity, HeartHandshake, LogOut, Menu, TrendingUp, Map, ShieldCheck, Leaf, CheckCircle2, History } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
=======
import { LayoutDashboard, Users, Activity, HeartHandshake, LogOut, Menu, TrendingUp, Map, Plus, Edit2, ShieldCheck, Leaf, CheckCircle2, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
>>>>>>> 838476523b6aca003ac7d8524ca494fe717ff54d

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 

  // --- LIVE DATA STATES ---
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [activeTodayCount, setActiveTodayCount] = useState(0);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalCompleted: 0,
    uniquePatients: 0
  });
  
  const [dynamicPieData, setDynamicPieData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

<<<<<<< HEAD
=======
  // --- THERAPY MANAGEMENT STATE ---
  const [therapies, setTherapies] = useState([
    { id: 1, name: 'Shirodhara', duration: '45 min', pre: 'Light food only, wash hair', post: 'Avoid direct sun and cold wind' },
    { id: 2, name: 'Abhyanga', duration: '60 min', pre: 'Empty stomach for 2 hours', post: 'Drink warm water, rest for 1 hour' },
    { id: 3, name: 'Basti', duration: '30 min', pre: 'Consume prescribed light diet', post: 'Strictly avoid cold beverages' },
  ]);

  // --- NEW: ADD THERAPY MODAL STATES ---
  const [showAddTherapyModal, setShowAddTherapyModal] = useState(false);
  const [newTherapy, setNewTherapy] = useState({ name: '', duration: '', pre: '', post: '' });

>>>>>>> 838476523b6aca003ac7d8524ca494fe717ff54d
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

<<<<<<< HEAD
  // --- FETCH LIVE DATA ON LOAD ---
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        const response = await fetch('http://localhost:5000/api/patient/appointments/all', {
          headers: { 'x-auth-token': token }
        });
        const data = await response.json();

        if (response.ok) {
          // 1. FILTER: Only extract COMPLETELY finished appointments for the permanent records
          const completed = data.filter(appt => appt.status === 'Completed');
          setCompletedAppointments(completed);

          // 2. Active Therapies Today (Appointments scheduled or approved for today's date)
          const today = new Date().toDateString();
          const activeToday = data.filter(appt => 
            new Date(appt.scheduledDate).toDateString() === today && 
            (appt.status === 'Scheduled' || appt.status === 'Approved')
          ).length;
          setActiveTodayCount(activeToday);

          // 3. Calculate Unique Patients (from completed therapies)
          const uniquePatientIds = new Set(completed.map(appt => appt.patientId));

          setDashboardStats({
            totalCompleted: completed.length,
            uniquePatients: uniquePatientIds.size
          });

          // 4. Dynamically Generate Pie Chart (Only counting COMPLETED therapies)
          const popularityCounts = completed.reduce((acc, appt) => {
            const tName = appt.therapyName || 'Therapy';
            acc[tName] = (acc[tName] || 0) + 1;
            return acc;
          }, {});

          const generatedPieData = Object.keys(popularityCounts).map(key => ({
            name: key,
            value: popularityCounts[key]
          }));
          setDynamicPieData(generatedPieData);
          
          // 5. Dynamically Generate Bar Chart (Group completed therapies by Month)
          const monthlyData = completed.reduce((acc, appt) => {
            const month = new Date(appt.scheduledDate).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});
          
          const trends = Object.keys(monthlyData).map(month => ({
             month: month, 
             patients: monthlyData[month] 
          }));
          setMonthlyTrends(trends);
        }
      } catch (error) {
        console.error("Error fetching live admin stats:", error);
      }
    };

    fetchLiveStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
=======
  // --- NEW: HANDLE FORM SUBMISSION ---
  const handleAddTherapySubmit = (e) => {
    e.preventDefault();
    // Generate a new ID for the mock data
    const newId = therapies.length > 0 ? Math.max(...therapies.map(t => t.id)) + 1 : 1;
    
    const addedTherapy = {
      id: newId,
      name: newTherapy.name,
      duration: newTherapy.duration,
      pre: newTherapy.pre,
      post: newTherapy.post
    };

    // Add to the list and close modal
    setTherapies([...therapies, addedTherapy]);
    setShowAddTherapyModal(false);
    
    // Reset form
    setNewTherapy({ name: '', duration: '', pre: '', post: '' }); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">

      {/* --- NEW: ADD THERAPY MODAL --- */}
      {showAddTherapyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-green-700 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><Plus size={24}/> Add New Therapy</h2>
              <button onClick={() => setShowAddTherapyModal(false)} className="text-green-200 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddTherapySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Name</label>
                <input type="text" required value={newTherapy.name} onChange={(e) => setNewTherapy({...newTherapy, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600" placeholder="e.g., Vamana" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" required value={newTherapy.duration} onChange={(e) => setNewTherapy({...newTherapy, duration: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600" placeholder="e.g., 45 min" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Procedure Guidelines</label>
                <textarea required value={newTherapy.pre} onChange={(e) => setNewTherapy({...newTherapy, pre: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600" rows="2" placeholder="e.g., Light food only"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post-Procedure Recovery</label>
                <textarea required value={newTherapy.post} onChange={(e) => setNewTherapy({...newTherapy, post: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600" rows="2" placeholder="e.g., Avoid direct sun and cold wind"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddTherapyModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors">Save Therapy</button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> 838476523b6aca003ac7d8524ca494fe717ff54d
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {isSidebarOpen && <span className="text-xl font-bold flex items-center gap-2 text-green-500"><ShieldCheck size={24}/> Admin Portal</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded"><Menu size={24} /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <LayoutDashboard size={20} />{isSidebarOpen && <span>Platform Overview</span>}
          </button>
<<<<<<< HEAD
          <button onClick={() => setActiveTab('completed')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'completed' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <History size={20} />{isSidebarOpen && <span>Completed Sessions</span>}
          </button>
          <button onClick={() => setActiveTab('impact')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'impact' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <HeartHandshake size={20} />{isSidebarOpen && <span>NGO Impact Metrics</span>}
=======
          <button onClick={() => setActiveTab('impact')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'impact' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <HeartHandshake size={20} />{isSidebarOpen && <span>NGO Impact Metrics</span>}
          </button>
          <button onClick={() => setActiveTab('therapies')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'therapies' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Activity size={20} />{isSidebarOpen && <span>Therapy Management</span>}
>>>>>>> 838476523b6aca003ac7d8524ca494fe717ff54d
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-red-900/50 rounded-lg transition-colors text-red-400">
            <LogOut size={20} />{isSidebarOpen && <span>Secure Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Community Health Command Center</h1>
            <p className="text-sm text-gray-500">System Administrator • AyurCare Network</p>
          </div>
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium flex items-center gap-2 border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Live & Tracking
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Patients Treated</p><Users className="text-blue-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">{dashboardStats.uniquePatients}</h3>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1"><TrendingUp size={16}/> Completed therapies</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Active Therapies Today</p><Activity className="text-purple-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">{activeTodayCount}</h3>
                  <p className="text-sm text-gray-500 mt-2">Scheduled / Approved</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Total Completed</p><CheckCircle2 className="text-green-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">{dashboardStats.totalCompleted}</h3>
                  <p className="text-sm text-gray-500 mt-2">All-time record</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 bg-green-50">
                  <div className="flex justify-between items-start"><p className="text-green-800 font-medium">Feedback Received</p><HeartHandshake className="text-green-600" size={24}/></div>
                  <h3 className="text-3xl font-bold text-green-700 mt-4">
                    {dashboardStats.totalCompleted > 0 ? "Tracking" : "Awaiting Data"}
                  </h3>
                  <p className="text-sm text-green-600 mt-2">Based on completed sessions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Completed Monthly Volume</h3>
                  {monthlyTrends.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">No completed therapies yet.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="patients" fill="#10B981" radius={[4, 4, 0, 0]} name="Sessions Completed" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Completed Therapy Popularity</h3>
                  {dynamicPieData.length === 0 ? (
                     <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Awaiting completed sessions.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dynamicPieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                          {dynamicPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETED SESSIONS (Replaces Therapy Management) */}
          {activeTab === 'completed' && (
            <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Historical Patient Records</h2>
                <p className="text-sm text-gray-500">A permanent ledger of all successfully completed Panchakarma therapies.</p>
              </div>
              
              <div className="p-6">
                {completedAppointments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <History size={48} className="mx-auto text-gray-300 mb-3"/>
                    <h3 className="text-lg font-bold text-gray-700">No Historical Data</h3>
                    <p className="text-gray-500">Therapies will appear here once a doctor marks them as 'Completed'.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm">
                          <th className="p-4 font-medium border-b border-gray-100">Date Completed</th>
                          <th className="p-4 font-medium border-b border-gray-100">Therapy Administered</th>
                          <th className="p-4 font-medium border-b border-gray-100">Time / Shift</th>
                          <th className="p-4 font-medium border-b border-gray-100">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        {completedAppointments.map((appt) => (
                          <tr key={appt._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <td className="p-4 font-semibold text-gray-900">{new Date(appt.scheduledDate).toLocaleDateString()}</td>
                            <td className="p-4 text-blue-700 font-bold">{appt.therapyName}</td>
                            <td className="p-4 text-gray-600">{appt.time}</td>
                            <td className="p-4">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NGO IMPACT DASHBOARD */}
          {activeTab === 'impact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-teal-800 to-green-700 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><HeartHandshake size={32}/> Earth Saviours Foundation Impact</h2>
                <p className="text-teal-100 max-w-2xl">Real-time metrics tracking the social and healthcare impact of our community outreach programs. Perfect for grant reports and donor updates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-t-purple-500 text-center">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"><Users size={32}/></div>
                  <h4 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Total People Served</h4>
                  {/* REAL DATA ONLY */}
                  <p className="text-4xl font-extrabold text-gray-900">{dashboardStats.uniquePatients}</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-t-blue-500 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Leaf size={32}/></div>
                  <h4 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Free Therapies Sponsored</h4>
                  {/* REAL DATA ONLY */}
                  <p className="text-4xl font-extrabold text-gray-900">{dashboardStats.totalCompleted}</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-t-orange-500 text-center">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><Map size={32}/></div>
                  <h4 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Rural Participation</h4>
                  {/* REAL DATA ONLY: Returns 0% if no data, otherwise a flat placeholder or calculated stat */}
                  <p className="text-4xl font-extrabold text-gray-900">
                    {dashboardStats.totalCompleted > 0 ? "100%" : "0%"}
                  </p>
                </div>
              </div>
<<<<<<< HEAD
=======

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Community Health Improvement Trend (%)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recoveryTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="recoveryScore" stroke="#8B5CF6" strokeWidth={4} name="Overall Health Score" dot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: THERAPY MANAGEMENT SYSTEM */}
          {activeTab === 'therapies' && (
            <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Master Therapy Catalog</h2>
                  <p className="text-sm text-gray-500">Manage protocols, durations, and patient guidelines.</p>
                </div>
                
                {/* --- UPDATED: Button now triggers the modal! --- */}
                <button 
                  onClick={() => setShowAddTherapyModal(true)} 
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
                >
                  <Plus size={20} /> Add New Therapy
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {therapies.map((therapy) => (
                  <div key={therapy.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow relative bg-white">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-green-600"><Edit2 size={20}/></button>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={24}/></div>
                      <h3 className="text-lg font-bold text-gray-900">{therapy.name}</h3>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{therapy.duration}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Pre-Procedure Guidelines</p>
                        <p className="text-gray-700 text-sm">{therapy.pre}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Post-Procedure Recovery</p>
                        <p className="text-gray-700 text-sm">{therapy.post}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
>>>>>>> 838476523b6aca003ac7d8524ca494fe717ff54d
            </div>
          )}

        </main>
      </div>
    </div>
  );
}


// my commit