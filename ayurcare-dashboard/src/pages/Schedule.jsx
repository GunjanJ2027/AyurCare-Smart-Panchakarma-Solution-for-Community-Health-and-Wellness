

// // src/pages/Schedule.jsx
// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import api from '../services/api';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { Plus, X, Edit3 } from 'lucide-react';

// const localizer = momentLocalizer(moment);

// const Schedule = () => {
//   const [events, setEvents] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Explicitly control calendar navigation so buttons work!
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentView, setCurrentView] = useState('week');

//   // --- MODAL STATES ---
//   const [isNewModalOpen, setIsNewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null); // Holds the event you clicked on
  
//   // --- COMPLETE SESSION STATE ---
//   const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
//   const [activeAppt, setActiveAppt] = useState(null); // Which appointment are we completing?
//   const [internalNotes, setInternalNotes] = useState('');
//   const [patientFeedback, setPatientFeedback] = useState('');

//   const [formData, setFormData] = useState({
//     patientId: '', therapyName: 'Abhyanga', scheduledDate: '', time: '09:00 AM', therapistName: ''
//   });

//   // Get today's date in YYYY-MM-DD format to disable past dates in the calendar picker
//   const todayString = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     fetchAppointments();
//     fetchPatientsList();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await api.get('/admin/appointments');
//       const formattedEvents = response.data.map(apt => {
//         const dateStr = moment(apt.scheduledDate).format('YYYY-MM-DD');
//         const start = moment(`${dateStr} ${apt.time}`, 'YYYY-MM-DD hh:mm A').toDate();
//         return {
//           id: apt._id,
//           title: `${apt.therapyName} (${apt.patientId?.name || 'Unknown'})`,
//           start: start,
//           end: moment(start).add(1, 'hours').toDate(),
//           status: apt.status,
//           therapist: apt.therapistName,
//           rawPatientId: apt.patientId?._id
//         };
//       });
//       setEvents(formattedEvents);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch appointments:", err);
//       setLoading(false);
//     }
//   };

//   const fetchPatientsList = async () => {
//     try {
//       const res = await api.get('/admin/patients/list').catch(() => ({ data: [] }));
//       setPatients(res.data);
//     } catch (err) {
//       console.error("No patients found yet.");
//     }
//   };

//   // --- CREATE APPOINTMENT (WITH TIME TRAVEL VALIDATION) ---
//   const handleCreateAppointment = async (e) => {
//     e.preventDefault();

//     // STRICT VALIDATION: Check if the exact chosen time is in the past
//     const startDateTime = moment(`${formData.scheduledDate} ${formData.time}`, 'YYYY-MM-DD hh:mm A').toDate();
//     if (startDateTime < new Date()) {
//       alert("Time travel forbidden! You cannot book an appointment in the past.");
//       return; // Stops the function immediately
//     }

//     try {
//       const response = await api.post('/admin/appointments', formData);
//       const newApt = response.data;
//       const dateStr = moment(newApt.scheduledDate).format('YYYY-MM-DD');
//       const start = moment(`${dateStr} ${newApt.time}`, 'YYYY-MM-DD HH:mm A').toDate();
      
//       const newEvent = {
//         id: newApt._id,
//         title: `${newApt.therapyName} (${newApt.patientId?.name || 'Unknown'})`,
//         start: start,
//         end: moment(start).add(1, 'hours').toDate(),
//         status: newApt.status,
//         therapist: newApt.therapistName
//       };

//       setEvents([...events, newEvent]); 
//       setIsNewModalOpen(false); 
//     } catch (err) {
//       alert("Failed to create appointment.");
//     }
//   };

//   // --- UPDATE APPOINTMENT STATUS (CANCEL / COMPLETE) ---
//   const handleUpdateStatus = async (newStatus) => {
//     try {
//       await api.put(`/admin/appointments/${selectedEvent.id}/status`, { status: newStatus });
      
//       // Update the event in the UI instantly
//       setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, status: newStatus } : ev));
//       setIsEditModalOpen(false);
//     } catch (err) {
//       alert("Failed to update status.");
//     }
//   };

//   // --- COMPLETE SESSION FUNCTION ---
//   const handleCompleteSession = async (e) => {
//     e.preventDefault();
//     try {
//       // Send the notes to our brand new backend route
//       await api.put(`/admin/appointments/${activeAppt.id}/complete`, {
//         internalNotes: internalNotes,
//         patientFeedback: patientFeedback
//       });

//       // Update the calendar instantly without refreshing the page
//       setEvents(events.map(ev => 
//         ev.id === activeAppt.id ? { ...ev, status: 'Completed' } : ev
//       ));

//       // Close modal and clear the form
//       setIsCompleteModalOpen(false);
//       setInternalNotes('');
//       setPatientFeedback('');
//       setActiveAppt(null);
//       alert("✅ Session completed! Notes have been saved to the patient's medical file.");
      
//     } catch (err) {
//       alert("🚨 Failed to complete session.");
//       console.error(err);
//     }
//   };

//   // Helper function to open the modal for a specific appointment
//   const openCompleteModal = (appointment) => {
//     setActiveAppt(appointment);
//     setIsCompleteModalOpen(true);
//   };

//   const eventStyleGetter = (event) => {
//     let backgroundColor = '#3B82F6'; // Default Blue
//     if (event.status === 'Completed') backgroundColor = '#10B981'; // Green
//     if (event.status === 'Ongoing') backgroundColor = '#F59E0B';   // Orange
//     if (event.status === 'Cancelled' || event.status === 'Missed') backgroundColor = '#EF4444'; // Red

//     // If it's cancelled, make it look slightly faded/crossed out
//     const opacity = (event.status === 'Cancelled') ? 0.6 : 1;
//     const textDecoration = (event.status === 'Cancelled') ? 'line-through' : 'none';

//     return { style: { backgroundColor, borderRadius: '5px', color: 'white', border: 'none', display: 'block', opacity, textDecoration } };
//   };

//   // Open Edit Modal when clicking an existing event
//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setIsEditModalOpen(true);
//   };

//   if (loading) return <div style={{ padding: '40px' }}>Loading Schedule...</div>;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', position: 'relative' }}>
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//         <div>
//           <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Therapy Schedule</h1>
//           <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Manage appointments and practitioner availability.</p>
//         </div>
//         <button 
//           onClick={() => setIsNewModalOpen(true)}
//           style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//           <Plus size={18} /> New Appointment
//         </button>
//       </div>

//       <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//         <Calendar 
//           localizer={localizer} 
//           events={events} 
//           startAccessor="start" 
//           endAccessor="end" 
//           style={{ height: '100%' }} 
//           views={['month', 'week', 'day']} 
//           eventPropGetter={eventStyleGetter}
//           onSelectEvent={handleEventClick} // Trigger Edit Modal on Click
//           // Explicitly control navigation state
//           date={currentDate}
//           onNavigate={(newDate) => setCurrentDate(newDate)}
//           view={currentView}
//           onView={(newView) => setCurrentView(newView)}
//         />
//       </div>

//       {/* --- 1. NEW APPOINTMENT MODAL --- */}
//       {isNewModalOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
//           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h2 style={{ margin: 0 }}>Book Session</h2>
//               <button onClick={() => setIsNewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
//             </div>

//             <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Select Patient</label>
//                 <select required value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
//                   <option value="">-- Choose a Patient --</option>
//                   {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Therapy Type</label>
//                 <select value={formData.therapyName} onChange={(e) => setFormData({...formData, therapyName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
//                   <option value="Abhyanga">Abhyanga</option>
//                   <option value="Shirodhara">Shirodhara</option>
//                   <option value="Basti">Basti</option>
//                   <option value="Pizhichil">Pizhichil</option>
//                 </select>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Date</label>
//                   <input type="date" required min={todayString} value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
//                 </div>
                
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Time</label>
//                   <input 
//                     type="time" 
//                     required 
//                     min={formData.scheduledDate === todayString ? new Date().toTimeString().slice(0, 5) : undefined}
//                     value={moment(formData.time, "hh:mm A").format("HH:mm")} 
//                     onChange={(e) => setFormData({...formData, time: moment(e.target.value, "HH:mm").format("hh:mm A")})} 
//                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
//                   />
//                 </div>

//               </div>

//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Therapist Name</label>
//                 <input type="text" required value={formData.therapistName} onChange={(e) => setFormData({...formData, therapistName: e.target.value})} placeholder="e.g., Dr. Sharma" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
//               </div>

//               <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
//                 Save Appointment
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- 2. EDIT / CANCEL MODAL --- */}
//       {isEditModalOpen && selectedEvent && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
//           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20}/> Manage Session</h2>
//               <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
//             </div>

//             <div style={{ marginBottom: '24px', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
//               <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '18px' }}>{selectedEvent.title}</p>
//               <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}><strong>Time:</strong> {moment(selectedEvent.start).format('MMMM Do, h:mm a')}</p>
//               <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}><strong>Therapist:</strong> {selectedEvent.therapist}</p>
//               <p style={{ margin: '0', color: '#6B7280' }}><strong>Current Status:</strong> <span style={{ fontWeight: 'bold', color: selectedEvent.status === 'Cancelled' ? '#EF4444' : '#111827' }}>{selectedEvent.status}</span></p>
//             </div>

//             {/* Quick Action Buttons */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               {selectedEvent.status !== 'Completed' && (
//                 <button 
//                   /* 🟢 CHANGED THIS BUTTON TO OPEN THE NOTES MODAL 🟢 */
//                   onClick={() => {
//                     setIsEditModalOpen(false);
//                     openCompleteModal(selectedEvent);
//                   }} 
//                   style={{ padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
//                   Mark as Completed
//                 </button>
//               )}
              
//               {selectedEvent.status !== 'Cancelled' && (
//                 <button onClick={() => handleUpdateStatus('Cancelled')} style={{ padding: '12px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
//                   Cancel Session
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>
//       )}

//       {/* --- 3. COMPLETE SESSION MODAL (NEW) --- */}
//       {isCompleteModalOpen && activeAppt && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '500px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//               <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Complete Session</h2>
//               <button onClick={() => setIsCompleteModalOpen(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px' }}>
//                 ✕
//               </button>
//             </div>
            
//             <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px' }}>
//               Session: <span style={{ fontWeight: '600', color: '#059669' }}>{activeAppt.title}</span>
//             </p>

//             <form onSubmit={handleCompleteSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Doctor's Internal Notes</label>
//                 <textarea 
//                   required
//                   rows="3"
//                   style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
//                   placeholder="e.g., Patient responded well to Abhyanga. Muscle stiffness reduced."
//                   value={internalNotes}
//                   onChange={(e) => setInternalNotes(e.target.value)}
//                 ></textarea>
//               </div>

//               <div>
//                 <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Patient Feedback / Symptoms</label>
//                 <textarea 
//                   required
//                   rows="2"
//                   style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
//                   placeholder="e.g., Patient reported feeling relaxed but slightly thirsty."
//                   value={patientFeedback}
//                   onChange={(e) => setPatientFeedback(e.target.value)}
//                 ></textarea>
//               </div>

//               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
//                 <button 
//                   type="button" 
//                   onClick={() => setIsCompleteModalOpen(false)}
//                   style={{ padding: '8px 16px', color: '#4B5563', backgroundColor: '#F3F4F6', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', borderRadius: '4px', border: 'none', fontWeight: '500', cursor: 'pointer' }}
//                 >
//                   Save & Complete Session
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Schedule;



// src/pages/Schedule.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, X, Edit3 } from 'lucide-react';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Explicitly control calendar navigation so buttons work!
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');

  // --- MODAL STATES ---
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Holds the event you clicked on
  
  // --- COMPLETE SESSION STATE ---
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeAppt, setActiveAppt] = useState(null); // Which appointment are we completing?
  const [internalNotes, setInternalNotes] = useState('');
  const [patientFeedback, setPatientFeedback] = useState('');

  const [formData, setFormData] = useState({
    patientId: '', therapyName: 'Abhyanga', scheduledDate: '', time: '09:00 AM', therapistName: ''
  });

  // Get today's date in YYYY-MM-DD format to disable past dates in the calendar picker
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAppointments();
    fetchPatientsList();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/admin/appointments');
      const formattedEvents = response.data.map(apt => {
        const dateStr = moment(apt.scheduledDate).format('YYYY-MM-DD');
        const start = moment(`${dateStr} ${apt.time}`, 'YYYY-MM-DD hh:mm A').toDate();
        return {
          id: apt._id,
          title: `${apt.therapyName} (${apt.patientId?.name || 'Unknown'})`,
          start: start,
          end: moment(start).add(1, 'hours').toDate(),
          status: apt.status,
          therapist: apt.therapistName,
          rawPatientId: apt.patientId?._id
        };
      });
      setEvents(formattedEvents);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setLoading(false);
    }
  };

  const fetchPatientsList = async () => {
    try {
      const res = await api.get('/admin/patients/list').catch(() => ({ data: [] }));
      setPatients(res.data);
    } catch (err) {
      console.error("No patients found yet.");
    }
  };

  // --- CREATE APPOINTMENT (WITH TIME TRAVEL VALIDATION) ---
  const handleCreateAppointment = async (e) => {
    e.preventDefault();

    // STRICT VALIDATION: Check if the exact chosen time is in the past
    const startDateTime = moment(`${formData.scheduledDate} ${formData.time}`, 'YYYY-MM-DD hh:mm A').toDate();
    if (startDateTime < new Date()) {
      alert("Time travel forbidden! You cannot book an appointment in the past.");
      return; // Stops the function immediately
    }

    try {
      const response = await api.post('/admin/appointments', formData);
      const newApt = response.data;
      const dateStr = moment(newApt.scheduledDate).format('YYYY-MM-DD');
      const start = moment(`${dateStr} ${newApt.time}`, 'YYYY-MM-DD HH:mm A').toDate();
      
      const newEvent = {
        id: newApt._id,
        title: `${newApt.therapyName} (${newApt.patientId?.name || 'Unknown'})`,
        start: start,
        end: moment(start).add(1, 'hours').toDate(),
        status: newApt.status,
        therapist: newApt.therapistName
      };

      setEvents([...events, newEvent]); 
      setIsNewModalOpen(false); 
    } catch (err) {
      alert("Failed to create appointment.");
    }
  };

  // --- UPDATE APPOINTMENT STATUS (CANCEL / COMPLETE) ---
  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/admin/appointments/${selectedEvent.id}/status`, { status: newStatus });
      
      // Update the event in the UI instantly
      setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, status: newStatus } : ev));
      setIsEditModalOpen(false);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // --- COMPLETE SESSION FUNCTION ---
  const handleCompleteSession = async (e) => {
    e.preventDefault();
    try {
      // Send the notes to our brand new backend route
      await api.put(`/admin/appointments/${activeAppt.id}/complete`, {
        internalNotes: internalNotes,
        patientFeedback: patientFeedback
      });

      // Update the calendar instantly without refreshing the page
      setEvents(events.map(ev => 
        ev.id === activeAppt.id ? { ...ev, status: 'Completed' } : ev
      ));

      // Close modal and clear the form
      setIsCompleteModalOpen(false);
      setInternalNotes('');
      setPatientFeedback('');
      setActiveAppt(null);
      alert("✅ Session completed! Notes have been saved to the patient's medical file.");
      
    } catch (err) {
      alert("🚨 Failed to complete session.");
      console.error(err);
    }
  };

  // Helper function to open the modal for a specific appointment
  const openCompleteModal = (appointment) => {
    setActiveAppt(appointment);
    setIsCompleteModalOpen(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6'; // Default Blue
    if (event.status === 'Completed') backgroundColor = '#10B981'; // Green
    if (event.status === 'Ongoing') backgroundColor = '#F59E0B';   // Orange
    if (event.status === 'Cancelled' || event.status === 'Missed') backgroundColor = '#EF4444'; // Red

    // If it's cancelled, make it look slightly faded/crossed out
    const opacity = (event.status === 'Cancelled') ? 0.6 : 1;
    const textDecoration = (event.status === 'Cancelled') ? 'line-through' : 'none';

    return { style: { backgroundColor, borderRadius: '5px', color: 'white', border: 'none', display: 'block', opacity, textDecoration } };
  };

  // Open Edit Modal when clicking an existing event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Schedule...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>Therapy Schedule</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Manage appointments and practitioner availability.</p>
        </div>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Plus size={18} /> New Appointment
        </button>
      </div>

      <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Calendar 
          localizer={localizer} 
          events={events} 
          startAccessor="start" 
          endAccessor="end" 
          style={{ height: '100%' }} 
          views={['month', 'week', 'day']} 
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick} // Trigger Edit Modal on Click
          // Explicitly control navigation state
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
        />
      </div>

      {/* --- 1. NEW APPOINTMENT MODAL --- */}
      {isNewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Book Session</h2>
              <button onClick={() => setIsNewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
            </div>

            <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Select Patient</label>
                <select required value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                  <option value="">-- Choose a Patient --</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Therapy Type</label>
                <select value={formData.therapyName} onChange={(e) => setFormData({...formData, therapyName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                  <option value="Abhyanga">Abhyanga</option>
                  <option value="Shirodhara">Shirodhara</option>
                  <option value="Basti">Basti</option>
                  <option value="Pizhichil">Pizhichil</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Date</label>
                  <input type="date" required min={todayString} value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Time</label>
                  <input 
                    type="time" 
                    required 
                    min={formData.scheduledDate === todayString ? new Date().toTimeString().slice(0, 5) : undefined}
                    value={moment(formData.time, "hh:mm A").format("HH:mm")} 
                    onChange={(e) => setFormData({...formData, time: moment(e.target.value, "HH:mm").format("hh:mm A")})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
                  />
                </div>

              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Therapist Name</label>
                <input type="text" required value={formData.therapistName} onChange={(e) => setFormData({...formData, therapistName: e.target.value})} placeholder="e.g., Dr. Sharma" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. EDIT / CANCEL MODAL --- */}
      {isEditModalOpen && selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20}/> Manage Session</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
            </div>

            <div style={{ marginBottom: '24px', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '18px' }}>{selectedEvent.title}</p>
              <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}><strong>Time:</strong> {moment(selectedEvent.start).format('MMMM Do, h:mm a')}</p>
              <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}><strong>Therapist:</strong> {selectedEvent.therapist}</p>
              <p style={{ margin: '0', color: '#6B7280' }}><strong>Current Status:</strong> <span style={{ fontWeight: 'bold', color: selectedEvent.status === 'Cancelled' ? '#EF4444' : '#111827' }}>{selectedEvent.status}</span></p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Only show 'Complete' if it's not already completed AND the appointment time has actually started/passed */}
              {selectedEvent.status !== 'Completed' && new Date() >= selectedEvent.start && (
                <button 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    openCompleteModal(selectedEvent);
                  }} 
                  style={{ padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Mark as Completed
                </button>
              )}
              
              {selectedEvent.status !== 'Cancelled' && (
                <button onClick={() => handleUpdateStatus('Cancelled')} style={{ padding: '12px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancel Session
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- 3. COMPLETE SESSION MODAL (NEW) --- */}
      {isCompleteModalOpen && activeAppt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Complete Session</h2>
              <button onClick={() => setIsCompleteModalOpen(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px' }}>
                ✕
              </button>
            </div>
            
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px' }}>
              Session: <span style={{ fontWeight: '600', color: '#059669' }}>{activeAppt.title}</span>
            </p>

            <form onSubmit={handleCompleteSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Doctor's Internal Notes</label>
                <textarea 
                  required
                  rows="3"
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="e.g., Patient responded well to Abhyanga. Muscle stiffness reduced."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Patient Feedback / Symptoms</label>
                <textarea 
                  required
                  rows="2"
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', boxSizing: 'border-box' }}
                  placeholder="e.g., Patient reported feeling relaxed but slightly thirsty."
                  value={patientFeedback}
                  onChange={(e) => setPatientFeedback(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsCompleteModalOpen(false)}
                  style={{ padding: '8px 16px', color: '#4B5563', backgroundColor: '#F3F4F6', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', borderRadius: '4px', border: 'none', fontWeight: '500', cursor: 'pointer' }}
                >
                  Save & Complete Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Schedule;