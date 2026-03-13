// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, HeartHandshake, LogOut, Menu, TrendingUp, Map, Plus, Edit2, ShieldCheck, Leaf, CheckCircle2, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, impact, therapies

  // --- MOCK DATA FOR CHARTS ---
  const recoveryTrends = [
    { month: 'Jan', recoveryScore: 65, patients: 120 },
    { month: 'Feb', recoveryScore: 70, patients: 150 },
    { month: 'Mar', recoveryScore: 78, patients: 180 },
    { month: 'Apr', recoveryScore: 85, patients: 220 },
    { month: 'May', recoveryScore: 92, patients: 280 },
  ];

  const therapyPopularity = [
    { name: 'Shirodhara', value: 35 },
    { name: 'Abhyanga', value: 25 },
    { name: 'Basti', value: 20 },
    { name: 'Virechana', value: 15 },
    { name: 'Nasya', value: 5 },
  ];
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  // --- THERAPY MANAGEMENT STATE ---
  const [therapies, setTherapies] = useState([
    { id: 1, name: 'Shirodhara', duration: '45 min', pre: 'Light food only, wash hair', post: 'Avoid direct sun and cold wind' },
    { id: 2, name: 'Abhyanga', duration: '60 min', pre: 'Empty stomach for 2 hours', post: 'Drink warm water, rest for 1 hour' },
    { id: 3, name: 'Basti', duration: '30 min', pre: 'Consume prescribed light diet', post: 'Strictly avoid cold beverages' },
  ]);

  // --- NEW: ADD THERAPY MODAL STATES ---
  const [showAddTherapyModal, setShowAddTherapyModal] = useState(false);
  const [newTherapy, setNewTherapy] = useState({ name: '', duration: '', pre: '', post: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

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
          <button onClick={() => setActiveTab('impact')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'impact' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <HeartHandshake size={20} />{isSidebarOpen && <span>NGO Impact Metrics</span>}
          </button>
          <button onClick={() => setActiveTab('therapies')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'therapies' ? 'bg-green-600 font-medium text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <Activity size={20} />{isSidebarOpen && <span>Therapy Management</span>}
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
            System Live & Healthy
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Total Registered Patients</p><Users className="text-blue-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">1,248</h3>
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1"><TrendingUp size={16}/> +12% this month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Active Therapies Today</p><Activity className="text-purple-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">42</h3>
                  <p className="text-sm text-gray-500 mt-2">Across 3 community centers</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Completed Sessions</p><CheckCircle2 className="text-green-500" size={24}/></div>
                  <h3 className="text-3xl font-bold text-gray-800 mt-4">8,450</h3>
                  <p className="text-sm text-gray-500 mt-2">All-time record</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 bg-green-50">
                  <div className="flex justify-between items-start"><p className="text-green-800 font-medium">Overall Success Rate</p><HeartHandshake className="text-green-600" size={24}/></div>
                  <h3 className="text-3xl font-bold text-green-700 mt-4">94.2%</h3>
                  <p className="text-sm text-green-600 mt-2">Based on patient feedback</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Therapy Volume</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recoveryTrends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="patients" fill="#10B981" radius={[4, 4, 0, 0]} name="Sessions Conducted" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Therapy Popularity Breakdown</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={therapyPopularity} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                        {therapyPopularity.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NGO IMPACT DASHBOARD */}
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
                  <p className="text-4xl font-extrabold text-gray-900">12,450+</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-t-blue-500 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Leaf size={32}/></div>
                  <h4 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Free Therapies Sponsored</h4>
                  <p className="text-4xl font-extrabold text-gray-900">8,200</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-t-orange-500 text-center">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><Map size={32}/></div>
                  <h4 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Rural Participation</h4>
                  <p className="text-4xl font-extrabold text-gray-900">68%</p>
                </div>
              </div>

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
            </div>
          )}

        </main>
      </div>
    </div>
  );
}