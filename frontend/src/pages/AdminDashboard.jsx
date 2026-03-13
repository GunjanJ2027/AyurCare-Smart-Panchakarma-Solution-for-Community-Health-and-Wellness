// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Activity, LogOut, Menu, Home, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State to hold our REAL database data
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    activeTherapies: 0,
    recentPatients: []
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Fetch real data when the dashboard loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Registered Patients', value: dashboardData.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Appointments', value: dashboardData.totalAppointments, icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Available Therapies', value: dashboardData.activeTherapies, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Same as before) */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-ayurGreen text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-green-800">
          {isSidebarOpen && <span className="text-xl font-bold tracking-wider">AyurCare</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-green-800 rounded">
            <Menu size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a href="#" className="flex items-center space-x-3 p-3 bg-green-800 rounded-lg transition-colors"><Home size={20} />{isSidebarOpen && <span>Dashboard</span>}</a>
          <a href="#" className="flex items-center space-x-3 p-3 hover:bg-green-800 rounded-lg transition-colors"><Users size={20} />{isSidebarOpen && <span>Patients</span>}</a>
        </nav>
        <div className="p-4 border-t border-green-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-green-800 rounded-lg transition-colors text-red-200">
            <LogOut size={20} />{isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">NGO Admin Portal - Live Data</h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          
          {loading ? (
            <p>Loading real-time database stats...</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100">
                    <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real Database Patients Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Recently Registered Patients</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="p-4 font-medium border-b border-gray-100">Patient Name</th>
                        <th className="p-4 font-medium border-b border-gray-100">Dosha Profile</th>
                        <th className="p-4 font-medium border-b border-gray-100">Database ID</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {dashboardData.recentPatients.length === 0 ? (
                        <tr><td colSpan="3" className="p-4 text-center">No patients registered yet. Go sign one up!</td></tr>
                      ) : (
                        dashboardData.recentPatients.map((patient) => (
                          <tr key={patient._id} className="hover:bg-gray-50 border-b border-gray-50">
                            <td className="p-4 font-medium text-gray-900">{patient.fullName}</td>
                            <td className="p-4">{patient.doshaProfile}</td>
                            <td className="p-4 text-xs text-gray-400">{patient._id}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}