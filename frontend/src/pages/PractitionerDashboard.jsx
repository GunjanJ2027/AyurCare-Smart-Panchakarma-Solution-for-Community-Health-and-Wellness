// src/pages/PractitionerDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, LogOut, Menu, Clock, FileText, CheckCircle2, X, ClipboardType, Activity, MessageSquare, BrainCircuit } from 'lucide-react';

export default function PractitionerDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({ practitioner: null, patients: [], appointments: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients');
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [clinicalNote, setClinicalNote] = useState('');
  const [patientFeedback, setPatientFeedback] = useState("Feeling quite exhausted today. The joint pain is slightly better, but I feel very sluggish after yesterday's therapy.");
  const [sentimentResult, setSentimentResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveAppointments, setLiveAppointments] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        const response = await fetch('http://localhost:5000/api/practitioner/dashboard', {
          headers: { 'x-auth-token': token }
        });
        const data = await response.json();
        if (response.ok) setDashboardData(data);

        const apptResponse = await fetch('http://localhost:5000/api/patient/appointments/all', {
          headers: { 'x-auth-token': token }
        });
        const apptData = await apptResponse.json();
        if (apptResponse.ok) setLiveAppointments(apptData);

      } catch (error) { console.error("Error", error); } 
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleDoshaUpdate = async (patientId, newDosha) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/practitioner/patient/${patientId}/dosha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ doshaProfile: newDosha })
      });
      if (response.ok) {
        setDashboardData(prevData => ({
          ...prevData,
          patients: prevData.patients.map(patient => patient._id === patientId ? { ...patient, doshaProfile: newDosha } : patient)
        }));
        showToast('Dosha profile updated successfully!');
      }
    } catch (error) { console.error(error); }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/practitioner/appointment/${apptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setLiveAppointments(prev => prev.map(appt => 
          appt._id === apptId ? { ...appt, status: newStatus } : appt
        ));
        showToast(`Appointment ${newStatus}!`);
      }
    } catch (error) { console.error(error); }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    showToast(`Clinical notes saved for ${selectedPatient.fullName}`);
    setSelectedPatient(null);
    setClinicalNote('');
    setSentimentResult(null); 
  };

  const runSentimentAnalysis = async () => {
    setIsAnalyzing(true);
    setSentimentResult(null);
    try {
      const response = await fetch('http://localhost:8000/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: patientFeedback })
      });
      const data = await response.json();
      setSentimentResult(data);
    } catch (error) { console.error(error); } 
    finally { setIsAnalyzing(false); }
  };

  const showToast = (message) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  // --- TIME CHECK LOGIC ---
  const isTimePast = (dateString, timeString) => {
    const now = new Date();
    const apptDate = new Date(dateString); 
    
    try {
      // Extract hour, minute, and AM/PM using Regex
      const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const period = timeMatch[3].toUpperCase();
        
        // Convert to 24-hour format for correct JS Date comparison
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        apptDate.setHours(hours, minutes, 0, 0);
      }
    } catch (e) {
      console.error("Time parse error", e);
    }
    
    // Returns true if the current time is greater than or equal to the appt time
    return now >= apptDate;
  };

  const activePatientIds = liveAppointments
    .filter(appt => appt.status === 'Approved' || appt.status === 'Completed')
    .map(appt => String(appt.patientId));

  const filteredPatients = dashboardData.patients.filter(patient => 
    activePatientIds.includes(String(patient.userId)) || 
    activePatientIds.includes(String(patient._id))
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-700">Loading Clinical Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* Patient Record Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-800 p-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h2 className="text-xl font-bold flex items-center gap-2"><ClipboardType size={24}/> Clinical Record</h2>
              <button onClick={() => {setSelectedPatient(null); setSentimentResult(null);}} className="text-teal-200 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}</h3>
                  <p className="text-gray-500">Patient ID: {selectedPatient._id}</p>
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold border border-orange-200">
                  Dosha: {selectedPatient.doshaProfile || 'Unknown'}
                </div>
              </div>

              <div className="mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MessageSquare size={18} className="text-blue-600"/> Latest Patient Feedback</h4>
                <textarea value={patientFeedback} onChange={(e) => setPatientFeedback(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 mb-3" rows="3"/>
                {!sentimentResult ? (
                  <button onClick={runSentimentAnalysis} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 border border-purple-200">
                    <BrainCircuit size={18} /> {isAnalyzing ? 'Analyzing Tone...' : 'Run AI Sentiment Analysis'}
                  </button>
                ) : (
                  <div className={`mt-2 p-4 rounded-lg border ${sentimentResult.color === 'green' ? 'bg-green-50 border-green-200 text-green-800' : sentimentResult.color === 'red' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                    <p className="font-bold flex items-center gap-2 mb-1">AI Sentiment: {sentimentResult.sentiment}</p>
                    <p className="text-sm opacity-90">{sentimentResult.status}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveNote}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Add New Clinical Note</label>
                <textarea required value={clinicalNote} onChange={(e) => setClinicalNote(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 h-24 mb-4"></textarea>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => {setSelectedPatient(null); setSentimentResult(null);}} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">Save to Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-teal-800 text-white transition-all duration-300 flex flex-col z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-teal-700">
          {isSidebarOpen && <span className="text-xl font-bold tracking-wider">AyurCare Pro</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-teal-700 rounded"><Menu size={24} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'patients' ? 'bg-teal-900 font-medium' : 'hover:bg-teal-700'}`}>
            <Users size={20} />{isSidebarOpen && <span>My Patients</span>}
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'schedule' ? 'bg-teal-900 font-medium' : 'hover:bg-teal-700'}`}>
            <Calendar size={20} />{isSidebarOpen && <span>Today's Schedule</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-teal-700">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-teal-700 rounded-lg text-red-200">
            <LogOut size={20} />{isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Welcome, Dr. {dashboardData.practitioner?.fullName || 'Practitioner'}</h1>
            <p className="text-sm text-gray-500">Panchakarma Specialist</p>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {updateMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={20} /> {updateMessage}
            </div>
          )}

          {activeTab === 'patients' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
              <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Users className="text-teal-600" /> Active Patient Roster</h2>
                </div>
                <div className="overflow-x-auto min-h-[200px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="p-4 font-medium border-b border-gray-100">Patient Name</th>
                        <th className="p-4 font-medium border-b border-gray-100">Set Dosha Profile</th>
                        <th className="p-4 font-medium border-b border-gray-100">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="p-8 text-center text-gray-500">
                            <Users size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No active patients currently assigned.</p>
                            <p className="text-xs mt-1">Patients will appear here once their therapies are Approved or Completed.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient) => (
                          <tr key={patient._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <td className="p-4 font-semibold text-gray-900">{patient.fullName}</td>
                            <td className="p-4 text-orange-600 font-medium">
                              <select 
                                value={patient.doshaProfile || 'Unknown'} 
                                onChange={(e) => handleDoshaUpdate(patient._id, e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                              >
                                <option value="Unknown">Unknown</option>
                                <option value="Vata">Vata</option>
                                <option value="Pitta">Pitta</option>
                                <option value="Kapha">Kapha</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <button onClick={() => setSelectedPatient(patient)} className="text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100">
                                <FileText size={16} /> View Record
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LIVE APPOINTMENTS WIDGET */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl shadow-sm p-6 text-white">
                  <h3 className="text-teal-100 text-sm font-medium mb-4 flex items-center gap-2"><Calendar size={16} /> Upcoming Appointments</h3>
                  {liveAppointments.length === 0 ? (
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm text-center">
                      <p className="text-teal-50 text-sm">No appointments scheduled for today yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {liveAppointments.map((appt) => (
                        <div key={appt._id} className="bg-white border border-teal-500/30 p-4 rounded-lg shadow-sm text-gray-800">
                           <h4 className="font-bold text-teal-800">{appt.therapyName}</h4>
                           <p className="text-sm font-medium text-gray-600 mt-1">{new Date(appt.scheduledDate).toLocaleDateString()}</p>
                           <p className={`text-sm mt-1 px-2 py-1 rounded inline-block font-bold ${
                             appt.status === 'Approved' ? 'bg-green-100 text-green-800' :
                             appt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                             appt.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                           }`}>
                             {appt.status}
                           </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            
            /* SCHEDULE TAB - FULL VIEW */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in min-h-[60vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Calendar className="text-teal-600" size={28} /> Master Schedule</h2>
                <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">{liveAppointments.length} Bookings</span>
              </div>

              {liveAppointments.length === 0 ? (
                <div className="text-center mt-20">
                  <Calendar size={64} className="text-gray-200 mb-4 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Your Schedule is Clear</h2>
                  <p className="text-gray-500 max-w-md mx-auto">You currently have no Panchakarma therapy sessions booked.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {liveAppointments.map((appt) => {
                    const canComplete = isTimePast(appt.scheduledDate, appt.time);

                    return (
                      <div key={appt._id} className={`border-l-4 p-5 rounded-lg shadow-sm flex flex-col ${
                        appt.status === 'Approved' ? 'border-green-500 bg-green-50' :
                        appt.status === 'Completed' ? 'border-blue-500 bg-blue-50' :
                        appt.status === 'Declined' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                             appt.status === 'Approved' ? 'bg-green-200 text-green-900' :
                             appt.status === 'Completed' ? 'bg-blue-200 text-blue-900' :
                             appt.status === 'Declined' ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{appt.therapyName} Booking</h3>
                        <div className="text-sm text-gray-600 space-y-1 flex-grow">
                          <p className="flex items-center gap-2"><Calendar size={14}/> {new Date(appt.scheduledDate).toLocaleDateString()}</p>
                          <p className="flex items-center gap-2"><Clock size={14}/> {appt.time}</p>
                        </div>

                        {/* ACTION BUTTONS (Only show if still 'Scheduled') */}
                        {appt.status === 'Scheduled' && (
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => handleUpdateStatus(appt._id, 'Approved')} className="flex-1 bg-green-600 text-white font-medium py-1.5 rounded hover:bg-green-700 transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleUpdateStatus(appt._id, 'Declined')} className="flex-1 bg-red-600 text-white font-medium py-1.5 rounded hover:bg-red-700 transition-colors">
                              Decline
                            </button>
                          </div>
                        )}

                        {/* ACTION BUTTONS (Show if 'Approved' with TIME LOCK) */}
                        {appt.status === 'Approved' && (
                          <div className="mt-4 flex flex-col gap-1">
                            <button 
                              onClick={() => handleUpdateStatus(appt._id, 'Completed')} 
                              disabled={!canComplete}
                              className={`flex-1 font-medium py-1.5 rounded transition-colors shadow-sm ${
                                canComplete 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Mark as Completed
                            </button>
                            
                            {!canComplete && (
                              <p className="text-xs text-center text-gray-500 font-medium mt-1">
                                Available after {appt.time}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}