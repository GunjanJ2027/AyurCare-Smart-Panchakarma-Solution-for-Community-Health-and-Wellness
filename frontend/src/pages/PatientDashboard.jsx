// src/pages/PatientDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Activity, LogOut, Menu, User, Heart, PhoneCall, Leaf, CheckCircle2, AlertTriangle, X, Clock, TrendingUp, Star, ListChecks, Volume2, Languages } from 'lucide-react';
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

  // --- LIVE DATA STATE ---
  const [myAppointments, setMyAppointments] = useState([]);

  // --- Booking Form States ---
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 AM IST');
  const [bookingTherapy, setBookingTherapy] = useState('Virechana');
  const [isBooking, setIsBooking] = useState(false);

  // --- Recovery States ---
  const [recoveryLog, setRecoveryLog] = useState({ energy: 7, sleep: 5, pain: 2, mood: 'Good' });
  const [recoveryData, setRecoveryData] = useState([
    { day: 'Mon', energy: 4, sleep: 4, pain: 6 },
    { day: 'Tue', energy: 5, sleep: 5, pain: 5 },
    { day: 'Wed', energy: 5, sleep: 6, pain: 4 },
    { day: 'Thu', energy: 6, sleep: 7, pain: 3 },
    { day: 'Fri', energy: 8, sleep: 8, pain: 2 },
  ]);

  // --- Feedback States ---
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [checklist, setChecklist] = useState({ dinner: false, exercise: false, water: false });

  // --- ACCESSIBILITY & LOCALIZATION STATES ---
  const [lang, setLang] = useState('en'); 
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- TRANSLATION DICTIONARY ---
  const t = {
    en: {
      welcome: "Welcome,",
      emergency: "Emergency Help",
      healthTab: "My Health",
      sessionsTab: "My Sessions & Feedback",
      doshaTab: "Dosha Assessment",
      bookingHeader: "Therapy Booking & Preparation",
      bookNow: "Book Now",
      guidelines: "Pre-Procedure Guidelines",
      readAloud: "Read Instructions Aloud",
      stopReading: "Stop Audio",
      logout: "Logout",
      instructionText: "Please follow these instructions for your Virechana therapy. One: Have a light dinner the previous night. Two: Avoid heavy exercise for 24 hours. Three: Drink two glasses of warm water in the morning."
    },
    hi: {
      welcome: "स्वागत है,",
      emergency: "आपातकालीन सहायता",
      healthTab: "मेरा स्वास्थ्य",
      sessionsTab: "मेरे सत्र और प्रतिक्रिया",
      doshaTab: "दोष मूल्यांकन",
      bookingHeader: "थेरेपी बुकिंग और तैयारी",
      bookNow: "अभी बुक करें",
      guidelines: "प्रक्रिया से पहले के दिशा-निर्देश",
      readAloud: "निर्देशों को जोर से पढ़ें",
      stopReading: "ऑडियो रोकें",
      logout: "लॉग आउट",
      instructionText: "कृपया अपनी विरेचन थेरेपी के लिए इन निर्देशों का पालन करें। एक: पिछली रात हल्का भोजन लें। दो: चौबीस घंटे तक भारी व्यायाम से बचें। तीन: सुबह दो गिलास गर्म पानी पिएं।"
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }
        
        const profileRes = await fetch('http://localhost:5000/api/patient/me', { headers: { 'x-auth-token': token } });
        if (profileRes.ok) setPatientData(await profileRes.json());

        const apptRes = await fetch('http://localhost:5000/api/patient/my-appointments', { headers: { 'x-auth-token': token } });
        if (apptRes.ok) setMyAppointments(await apptRes.json());

      } catch (error) { console.error("Error", error); } 
      finally { setLoading(false); }
    };
    fetchPatientData();
  }, [navigate]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(t[lang].instructionText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; 
      utterance.rate = 0.9; 
      
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  const handleLogSubmit = (e) => {
    e.preventDefault();
    setRecoveryData(prev => [...prev, { day: 'Today', energy: parseInt(recoveryLog.energy), sleep: parseInt(recoveryLog.sleep), pain: parseInt(recoveryLog.pain) }]);
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
        const newAppt = await response.json();
        setMyAppointments(prev => [...prev, newAppt.appointment]); 
        setShowBookingModal(false);
        setBookingSuccess(`Confirmed: ${bookingTherapy} on ${bookingDate} at ${bookingTime}`);
        setTimeout(() => setBookingSuccess(''), 5000);
      }
    } catch (error) { console.error("Error", error); } 
    finally { setIsBooking(false); }
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  // --- LOGIC TO FIND COMPLETED THERAPIES ---
  const completedAppointments = myAppointments.filter(appt => appt.status === 'Completed');
  const latestCompletedAppt = completedAppointments.length > 0 ? completedAppointments[completedAppointments.length - 1] : null;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ayurGreen">Loading...</div>;

  return (
    <div className="min-h-screen bg-ayurLight flex relative">
      
      {/* Booking Modal */}
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
                  <option value="Virechana">Virechana (Purgation)</option>
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative border-t-8 border-red-600">
            <button onClick={() => setShowEmergencyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangle size={32} /><h2 className="text-2xl font-bold">Emergency Contact</h2></div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              <p className="font-semibold text-red-900 border-b border-red-200 pb-2 mb-3">National Emergency Services</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">All Emergencies</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 112</span></div>
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">Ambulance</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 102 / 108</span></div>
                <div className="flex flex-col"><span className="text-xs text-red-700 font-medium uppercase tracking-wider">Senior Helpline</span><span className="flex items-center gap-1 text-red-800 font-bold text-lg"><PhoneCall size={16}/> 14567</span></div>
              </div>
              <p className="font-semibold text-red-900 border-b border-red-200 pb-2 mb-3 mt-2">NGO Partner Helpdesk</p>
              <div className="flex items-center justify-between"><span className="text-sm text-red-700 font-medium">Earth Saviours</span><span className="flex items-center gap-2 text-red-800 font-bold"><PhoneCall size={16}/> +91 98716 75485</span></div>
            </div>
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
          <button onClick={() => setActiveTab('health')} className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'health' ? 'bg-green-50 text-ayurGreen' : 'text-gray-600 hover:bg-gray-50'}`}><Activity size={20} />{isSidebarOpen && <span>{t[lang].healthTab}</span>}</button>
          <button onClick={() => setActiveTab('sessions')} className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'sessions' ? 'bg-green-50 text-ayurGreen' : 'text-gray-600 hover:bg-gray-50'}`}><CalendarIcon size={20} />{isSidebarOpen && <span>{t[lang].sessionsTab}</span>}</button>
          <button onClick={() => navigate('/ai-predictor')} className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><User size={20} />{isSidebarOpen && <span>{t[lang].doshaTab}</span>}</button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full hover:bg-red-50 rounded-lg transition-colors text-red-600"><LogOut size={20} />{isSidebarOpen && <span>{t[lang].logout}</span>}</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">{t[lang].welcome} {patientData?.fullName || 'Patient'}</h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setLang(lang === 'en' ? 'hi' : 'en');
                if (isSpeaking) window.speechSynthesis.cancel(); 
              }}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <Languages size={18} /> {lang === 'en' ? 'हिंदी' : 'English'}
            </button>

            <button onClick={() => setShowEmergencyModal(true)} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium hover:bg-red-200 transition-colors shadow-sm"><PhoneCall size={18} className="animate-pulse" /><span className="hidden sm:inline">{t[lang].emergency}</span></button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          
          {bookingSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
              <CheckCircle2 size={24} /><p className="font-bold">{bookingSuccess}</p>
            </div>
          )}

          {activeTab === 'health' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LIVE Dynamic Booking & Voice Guidance */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-green-100 p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><CalendarIcon className="text-ayurGreen" /> {t[lang].bookingHeader}</h2>
                    <button onClick={() => setShowBookingModal(true)} className="bg-ayurGreen text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-800 transition-colors shadow-sm">
                      {t[lang].bookNow}
                    </button>
                  </div>

                  {myAppointments.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center text-gray-500">
                      <p className="font-medium text-lg mb-2">No upcoming therapies scheduled.</p>
                      <p className="text-sm">Click 'Book Now' to schedule your next Panchakarma session.</p>
                    </div>
                  ) : (
                    myAppointments.map((appt, index) => (
                      <div key={index} className="bg-gradient-to-br from-ayurGreen to-green-700 rounded-xl p-6 text-white relative z-10 shadow-md mb-4">
                        <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-4">
                          <div>
                            <p className="font-bold text-xl mb-1">Upcoming: {appt.therapyName}</p>
                            <p className="text-green-100 text-sm">
                              {new Date(appt.scheduledDate).toLocaleDateString()} at {appt.time}
                            </p>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                            appt.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            appt.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            appt.status === 'Declined' ? 'bg-red-100 text-red-800 border-red-200 line-through' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2"><ListChecks size={18}/> {t[lang].guidelines}</h4>
                            <button 
                              onClick={handleSpeak}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-ayurGreen hover:bg-green-50'}`}
                            >
                              <Volume2 size={14} /> {isSpeaking ? t[lang].stopReading : t[lang].readAloud}
                            </button>
                          </div>

                          <div className="bg-black/10 rounded-lg p-4 border border-white/20 space-y-3 text-sm">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={checklist.dinner} onChange={(e) => setChecklist({...checklist, dinner: e.target.checked})} className="w-5 h-5 rounded accent-green-500" />
                              <span className={checklist.dinner ? "line-through opacity-70" : ""}>
                                {lang === 'en' ? 'Have a light dinner the previous night' : 'पिछली रात हल्का भोजन लें'}
                              </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={checklist.exercise} onChange={(e) => setChecklist({...checklist, exercise: e.target.checked})} className="w-5 h-5 rounded accent-green-500" />
                              <span className={checklist.exercise ? "line-through opacity-70" : ""}>
                                {lang === 'en' ? 'Avoid heavy exercise for 24 hours' : 'चौबीस घंटे तक भारी व्यायाम से बचें'}
                              </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={checklist.water} onChange={(e) => setChecklist({...checklist, water: e.target.checked})} className="w-5 h-5 rounded accent-green-500" />
                              <span className={checklist.water ? "line-through opacity-70" : ""}>
                                {lang === 'en' ? 'Drink 2 glasses of warm water in the morning' : 'सुबह दो गिलास गर्म पानी पिएं'}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Session History</h2>
                
                {myAppointments.length === 0 ? (
                   <p className="text-gray-500 mb-4">You have no past or upcoming sessions.</p>
                ) : (
                   <div className="space-y-3 mb-6 mt-4 text-left max-w-2xl mx-auto">
                     {myAppointments.map(appt => (
                       <div key={appt._id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm">
                          <div>
                            <p className="font-bold text-gray-800">{appt.therapyName}</p>
                            <p className="text-sm text-gray-500">{new Date(appt.scheduledDate).toLocaleDateString()} at {appt.time}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                            appt.status === 'Completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            appt.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            appt.status === 'Declined' ? 'bg-red-100 text-red-800 border-red-200 line-through' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {appt.status}
                          </span>
                       </div>
                     ))}
                   </div>
                )}
                <button onClick={() => setShowBookingModal(true)} className="mt-2 bg-ayurGreen text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors">Book a New Session</button>
              </div>

              {/* DYNAMIC FEEDBACK & RECOVERY SYSTEM */}
              {latestCompletedAppt && (
                <>
                  {!feedbackSubmitted ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-left max-w-2xl mx-auto animate-fade-in">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Rate Your Recent Therapy</h3>
                      <p className="text-gray-500 text-sm mb-6">Help us monitor quality for the community. How was your recent <strong>{latestCompletedAppt.therapyName}</strong> session?</p>
                      
                      <form onSubmit={submitFeedback}>
                        <div className="flex items-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="bg-transparent border-none outline-none focus:outline-none"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRating(star)}
                            >
                              <Star size={32} className={`transition-colors duration-200 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                        
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                        <textarea required value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us about your experience..." className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-ayurGreen focus:border-ayurGreen mb-4"></textarea>
                        
                        <button type="submit" disabled={rating === 0} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">Submit Review</button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      
                      <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-200 text-center max-w-2xl mx-auto flex flex-col items-center shadow-sm">
                        <CheckCircle2 size={36} className="mb-2" />
                        <p className="font-bold text-lg">Feedback Received!</p>
                        <p className="text-sm">Your post-procedure recovery tracker is now active below.</p>
                      </div>

                      {/* --- UNLOCKED RECOVERY TRACKER --- */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pt-4 border-t border-gray-200">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="text-blue-500" /> Recovery Progress Analyzer</h2>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={recoveryData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} /><YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} /><Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} /><Line type="monotone" dataKey="energy" name="Energy" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} /><Line type="monotone" dataKey="sleep" name="Sleep" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} /><Line type="monotone" dataKey="pain" name="Pain" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} /></LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Heart className="text-red-400" /> Daily Post-Procedure Log</h2>
                          {logSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3 h-full"><CheckCircle2 size={32} /><div><p className="font-bold">Log Saved!</p><p className="text-sm">Chart updated.</p></div></div>
                          ) : (
                            <form onSubmit={handleLogSubmit} className="space-y-4">
                              <div><div className="flex justify-between mb-1 text-sm"><label className="font-medium text-gray-700">Energy Level</label><span className="text-ayurGreen font-bold">{recoveryLog.energy}/10</span></div><input type="range" min="1" max="10" value={recoveryLog.energy} onChange={(e) => setRecoveryLog({...recoveryLog, energy: e.target.value})} className="w-full accent-ayurGreen" /></div>
                              <div><div className="flex justify-between mb-1 text-sm"><label className="font-medium text-gray-700">Sleep Quality</label><span className="text-blue-500 font-bold">{recoveryLog.sleep}/10</span></div><input type="range" min="1" max="10" value={recoveryLog.sleep} onChange={(e) => setRecoveryLog({...recoveryLog, sleep: e.target.value})} className="w-full accent-blue-500" /></div>
                              <div><div className="flex justify-between mb-1 text-sm"><label className="font-medium text-gray-700">Pain Level</label><span className="text-red-500 font-bold">{recoveryLog.pain}/10</span></div><input type="range" min="1" max="10" value={recoveryLog.pain} onChange={(e) => setRecoveryLog({...recoveryLog, pain: e.target.value})} className="w-full accent-red-500" /></div>
                              <button type="submit" className="w-full bg-ayurGreen text-white py-2 rounded-lg font-medium hover:bg-green-800 transition-colors shadow-sm">Save Log</button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}