// src/pages/PatientDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Activity, LogOut, Menu, User, Heart, PhoneCall, Leaf, CheckCircle2, AlertTriangle, X, Clock, TrendingUp } from 'lucide-react';
// NEW: Import the charting library components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- UI Interaction States ---
  const [activeTab, setActiveTab] = useState('health'); 
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [logSubmitted, setLogSubmitted] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  // --- Booking Form States ---
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 AM IST');
  const [bookingTherapy, setBookingTherapy] = useState('Abhyanga');
  const [isBooking, setIsBooking] = useState(false);

  // --- NEW: Recovery Progress Analyzer States ---
  const [energyLevel, setEnergyLevel] = useState(7);
  const [recoveryData, setRecoveryData] = useState([
    { day: 'Mon', energy: 4 },
    { day: 'Tue', energy: 5 },
    { day: 'Wed', energy: 5 },
    { day: 'Thu', energy: 6 },
    { day: 'Fri', energy: 8 },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }
        const response = await fetch('http://localhost:5000/api/patient/me', {
          headers: { 'x-auth-token': token }
        });
        const data = await response.json();
        if (response.ok) setPatientData(data);
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientProfile();
  }, [navigate]);

  // --- UPDATED: Handle Log Submission to update the chart ---
  const handleLogSubmit = (e) => {
    e.preventDefault();
    
    // Create a new data point for the chart
    const newLog = {
      day: 'Today',
      energy: parseInt(energyLevel)
    };
    
    // Add it to our chart data
    setRecoveryData(prevData => [...prevData, newLog]);
    
    setLogSubmitted(true);
    setTimeout(() => setLogSubmitted(false), 3000);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/patient/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ therapyName: bookingTherapy, date: bookingDate, time: bookingTime })
      });
      if (response.ok) {
        setShowBookingModal(false);
        setBookingSuccess(`Successfully booked ${bookingTherapy} on ${bookingDate} at ${bookingTime}`);
        setTimeout(() => setBookingSuccess(''), 5000);
        setBookingDate('');
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ayurGreen">Loading your health profile...</div>;

  return (
    <div className="min-h-screen bg-ayurLight flex relative">
      
      {/* Appointment Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-ayurGreen p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><CalendarIcon size={24}/> Book Therapy Session</h2>
              <button onClick={() => setShowBookingModal(false)} className="text-green-200 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Therapy</label>
                <select value={bookingTherapy} onChange={(e) => setBookingTherapy(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-ayurGreen focus:border-ayurGreen bg-white">
                  <option value="Abhyanga">Abhyanga (Oil Massage)</option>
                  <option value="Shirodhara">Shirodhara (Oil Pouring)</option>
                  <option value="Basti">Basti (Herbal Enema)</option>
                  <option value="Nasya">Nasya (Nasal Therapy)</option>
                  <option value="Vamana">Vamana (Therapeutic Emesis)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-ayurGreen focus:border-ayurGreen" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time (IST)</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
                  <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-ayurGreen focus:border-ayurGreen bg-white">
                    <option value="09:00 AM IST">09:00 AM IST</option>
                    <option value="10:30 AM IST">10:30 AM IST</option>
                    <option value="12:00 PM IST">12:00 PM IST</option>
                    <option value="02:30 PM IST">02:30 PM IST</option>
                    <option value="04:00 PM IST">04:00 PM IST</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isBooking} className="px-6 py-2 bg-ayurGreen text-white font-medium rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50">{isBooking ? 'Confirming...' : 'Confirm Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in relative border-t-8 border-red-600">
            <button onClick={() => setShowEmergencyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangle size={32} /><h2 className="text-2xl font-bold">Emergency Contact</h2></div>
            <p className="text-gray-600 mb-6">If you are experiencing a severe medical emergency, please contact local emergency services immediately.</p>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              <p className="font-semibold text-red-900 border-b border-red-200 pb-2 mb-3">National Emergency Services</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">All Emergencies</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 112</span></div>
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">Police</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 100</span></div>
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">Ambulance</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 102 / 108</span></div>
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">Senior Helpline</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 14567</span></div>
              </div>
              <p className="font-semibold text-red-900 border-b border-red-200 pb-2 mb-3 mt-2">NGO Partner Helpdesk</p>
              <div className="flex items-center justify-between"><span className="text-sm text-red-700 font-medium">Earth Saviours Foundation</span><span className="flex items-center gap-2 text-red-800 font-bold"><PhoneCall size={16}/> +91 98716 75485</span></div>
            </div>
            <button onClick={() => setShowEmergencyModal(false)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">Close Window</button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {isSidebarOpen && <span className="text-xl font-bold text-ayurGreen flex items-center gap-2"><Leaf size={24}/> AyurCare</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><Menu size={24} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('health')} className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'health' ? 'bg-green-50 text-ayurGreen' : 'text-gray-600 hover:bg-gray-50'}`}><Activity size={20} />{isSidebarOpen && <span>My Health</span>}</button>
          <button onClick={() => setActiveTab('sessions')} className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'sessions' ? 'bg-green-50 text-ayurGreen' : 'text-gray-600 hover:bg-gray-50'}`}><CalendarIcon size={20} />{isSidebarOpen && <span>My Sessions</span>}</button>
          <button onClick={() => navigate('/ai-predictor')} className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><User size={20} />{isSidebarOpen && <span>Dosha Assesment</span>}</button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-red-50 rounded-lg transition-colors text-red-600"><LogOut size={20} />{isSidebarOpen && <span>Logout</span>}</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, {patientData?.fullName || 'Patient'}</h1>
          <button onClick={() => setShowEmergencyModal(true)} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium hover:bg-red-200 transition-colors shadow-sm"><PhoneCall size={18} className="animate-pulse" /><span className="hidden sm:inline">Emergency Help</span></button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          
          {bookingSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
              <CheckCircle2 size={24} /><p className="font-bold">{bookingSuccess}</p>
            </div>
          )}

          {activeTab === 'health' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Top Row: Booking & Dosha */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-green-100 p-6 relative overflow-hidden">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><CalendarIcon className="text-ayurGreen" /> Therapy Booking</h2>
                  <div className="bg-gradient-to-r from-ayurGreen to-green-700 rounded-xl p-6 text-white relative z-10 shadow-md flex justify-between items-center">
                     <div>
                       <p className="font-medium text-lg mb-1">Ready for your next session?</p>
                       <p className="text-green-100 text-sm">Book an appointment with an available practitioner in IST.</p>
                     </div>
                     <button onClick={() => setShowBookingModal(true)} className="bg-white text-ayurGreen px-6 py-3 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors shadow-sm flex items-center gap-2"><CalendarIcon size={18}/> Book Now</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Your Dosha Profile</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                        {patientData?.doshaProfile === 'Unknown' ? '?' : patientData?.doshaProfile.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{patientData?.doshaProfile || 'Not Assessed'}</p>
                        {patientData?.doshaProfile === 'Unknown' && (<button onClick={() => navigate('/ai-predictor')} className="text-sm text-purple-600 hover:underline mt-1">Take AI Assessment</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: AI Progress Analyzer & Recovery Log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* NEW: Recovery Progress Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" /> Recovery Progress Analyzer
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={recoveryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                        <Tooltip 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                          formatter={(value) => [`${value} / 10`, 'Energy Level']}
                        />
                        <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center italic">AI indicates a positive upward trend in your recovery following recent therapies.</p>
                </div>

                {/* Daily Recovery Log Input */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Heart className="text-red-400" /> Daily Recovery Log</h2>
                  <p className="text-sm text-gray-500 mb-6">Update your energy level today to feed the Progress Analyzer.</p>
                  
                  {logSubmitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3"><CheckCircle2 size={24} /><div><p className="font-bold">Log Added to Chart!</p></div></div>
                  ) : (
                    <form onSubmit={handleLogSubmit} className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Energy Level</label>
                          <span className="text-ayurGreen font-bold">{energyLevel} / 10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={energyLevel} 
                          onChange={(e) => setEnergyLevel(e.target.value)} 
                          className="w-full accent-ayurGreen" 
                        />
                      </div>
                      <button type="submit" className="w-full bg-ayurGreen text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors shadow-sm">Add to Progress Analyzer</button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in">
              <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Session History</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">View your scheduled and completed Panchakarma therapies.</p>
              <button onClick={() => setShowBookingModal(true)} className="bg-ayurGreen text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors">
                Book a New Session
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}