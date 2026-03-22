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
  
  // --- Modal States ---
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [clinicalNote, setClinicalNote] = useState('');
  
  // --- NEW: Sentiment Analysis States ---
  const [patientFeedback, setPatientFeedback] = useState("Feeling quite exhausted today. The joint pain is slightly better, but I feel very sluggish after yesterday's therapy.");
  const [sentimentResult, setSentimentResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
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
          patients: prevData.patients.map(patient => 
            patient._id === patientId ? { ...patient, doshaProfile: newDosha } : patient
          )
        }));
        showToast('Dosha profile updated successfully!');
      }
    } catch (error) {
      console.error("Failed to update dosha:", error);
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    showToast(`Clinical notes saved for ${selectedPatient.fullName}`);
    setSelectedPatient(null);
    setClinicalNote('');
    setSentimentResult(null); // Reset sentiment when modal closes
  };

  // --- NEW: AI Sentiment Analysis Function ---
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
    } catch (error) {
      console.error("Sentiment analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showToast = (message) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-700">Loading Clinical Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* --- Patient Record Modal --- */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-800 p-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h2 className="text-xl font-bold flex items-center gap-2"><ClipboardType size={24}/> Clinical Record</h2>
              <button onClick={() => {setSelectedPatient(null); setSentimentResult(null);}} className="text-teal-200 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}</h3>
                  <p className="text-gray-500">Patient ID: {selectedPatient._id}</p>
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold border border-orange-200">
                  Dosha: {selectedPatient.doshaProfile}
                </div>
              </div>

              {/* --- NEW: AI Sentiment Analysis Panel --- */}
              <div className="mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600"/> Latest Patient Feedback
                </h4>
                
                <textarea 
                  value={patientFeedback}
                  onChange={(e) => setPatientFeedback(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 mb-3 focus:ring-teal-500 focus:border-teal-500"
                  rows="3"
                />

                {!sentimentResult ? (
                  <button 
                    onClick={runSentimentAnalysis}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition-colors border border-purple-200 disabled:opacity-50"
                  >
                    <BrainCircuit size={18} /> {isAnalyzing ? 'Analyzing Tone...' : 'Run AI Sentiment Analysis'}
                  </button>
                ) : (
                  <div className={`mt-2 p-4 rounded-lg border ${
                    sentimentResult.color === 'green' ? 'bg-green-50 border-green-200 text-green-800' : 
                    sentimentResult.color === 'red' ? 'bg-red-50 border-red-200 text-red-800' : 
                    'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}>
                    <p className="font-bold flex items-center gap-2 mb-1">
                      AI Sentiment: {sentimentResult.sentiment}
                    </p>
                    <p className="text-sm opacity-90">{sentimentResult.status}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveNote}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Add New Clinical Note</label>
                <textarea 
                  required
                  value={clinicalNote}
                  onChange={(e) => setClinicalNote(e.target.value)}
                  placeholder="Enter observation notes, dietary recommendations, or therapy adjustments here..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-teal-500 focus:border-teal-500 mb-4"
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => {setSelectedPatient(null); setSentimentResult(null);}} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">Save to Record</button>
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
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-teal-700 rounded-lg transition-colors text-red-200">
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
          <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium flex items-center gap-2 shadow-sm border border-teal-100">
            <Clock size={18} /><span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
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
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Users className="text-teal-600" /> Registered Patients</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="p-4 font-medium border-b border-gray-100">Patient Name</th>
                        <th className="p-4 font-medium border-b border-gray-100">Set Dosha Profile</th>
                        <th className="p-4 font-medium border-b border-gray-100">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {dashboardData.patients.length === 0 ? (
                        <tr><td colSpan="3" className="p-4 text-center">No patients found.</td></tr>
                      ) : (
                        dashboardData.patients.map((patient) => (
                          <tr key={patient._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <td className="p-4 font-semibold text-gray-900">{patient.fullName}</td>
                            <td className="p-4 text-orange-600 font-medium">
                              <select 
                                value={patient.doshaProfile} 
                                onChange={(e) => handleDoshaUpdate(patient._id, e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
                              >
                                <option value="Unknown">Unknown</option>
                                <option value="Vata">Vata</option>
                                <option value="Pitta">Pitta</option>
                                <option value="Kapha">Kapha</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <button 
                                onClick={() => setSelectedPatient(patient)}
                                className="text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                              >
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

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl shadow-sm p-6 text-white">
                  <h3 className="text-teal-100 text-sm font-medium mb-4 flex items-center gap-2"><Calendar size={16} /> Upcoming Appointments</h3>
                  <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-teal-50 text-sm">No appointments scheduled for today yet.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in h-[60vh] flex flex-col justify-center items-center">
              <Calendar size={64} className="text-gray-200 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Schedule is Clear</h2>
              <p className="text-gray-500 max-w-md">You currently have no Panchakarma therapy sessions booked for today. Enjoy your downtime or review patient records.</p>
              <button onClick={() => setActiveTab('patients')} className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                View Patient Roster
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
// practioner fix