import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import { Plus, Users, CalendarCheck, TrendingUp, Printer } from 'lucide-react';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [therapistName, setTherapistName] = useState('');
  const [notes, setNotes] = useState('');
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ patientId: '', therapyName: 'Abhyanga (Oil Massage)', date: '', time: '09:00 AM' });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/patient/appointments/all');
      const formattedEvents = response.data.map(appt => {
        const datePart = appt.scheduledDate.substring(0, 10);
        const timeParts = appt.time.split(' ');
        let [hours, minutes] = timeParts[0].split(':');
        if (timeParts[1] === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
        if (timeParts[1] === 'AM' && hours === '12') hours = 0;
        const start = new Date(`${datePart}T${String(hours).padStart(2, '0')}:${minutes}:00`);
        return {
          id: appt._id,
          title: `${appt.therapyName}`,
          start,
          end: new Date(start.getTime() + 60 * 60 * 1000),
          resource: appt,
          color: appt.status === 'Completed' ? '#10B981' : appt.status === 'Cancelled' ? '#EF4444' : '#3B82F6'
        };
      });
      setEvents(formattedEvents);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/auth/users/patients'); 
      setPatients(res.data);
    } catch (e) { console.log("Could not load patients list"); }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/patient/appointment/${selectedEvent._id}/status`, { 
        status: newStatus, 
        therapistName, 
        notes 
      });
      fetchAppointments();
      setSelectedEvent(null);
      setNotes('');
      alert("Updated Successfully");
    } catch (e) { alert("Update failed"); }
  };

  const handleSelectEvent = (e) => { 
    setSelectedEvent(e.resource); 
    setTherapistName(e.resource.therapistName || ''); 
    setNotes(e.resource.notes || ''); 
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patient/book', formData);
      setShowModal(false);
      fetchAppointments();
      alert("Appointment Created!");
    } catch (e) { alert("Booking failed - Check practitioner availability"); }
  };

  const handleGeneratePDF = () => {
    if (!selectedEvent) return;
    
    // 1. Create a new PDF document
    const doc = new jsPDF();
    
    // 2. Add Clinic Header
    doc.setFontSize(22);
    doc.setTextColor(6, 78, 59); // AyurCare Dark Green
    doc.text("AyurCare Pro Clinic", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Official Clinical Prescription & Session Notes", 20, 28);
    doc.line(20, 32, 190, 32); // Horizontal dividing line

    // 3. Add Session Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Therapy: ${selectedEvent.therapyName}`, 20, 45);
    doc.text(`Date & Time: ${selectedEvent.start.toLocaleDateString()} at ${selectedEvent.time}`, 20, 55);
    doc.text(`Attending Therapist: ${therapistName || 'Unassigned'}`, 20, 65);
    doc.text(`Session Status: ${selectedEvent.resource.status}`, 20, 75);

    // 4. Add Clinical Notes
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Prescription & Recommendations:", 20, 95);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    // This splits long text so it doesn't run off the edge of the PDF page
    const splitNotes = doc.splitTextToSize(notes || 'No clinical notes recorded for this session.', 170);
    doc.text(splitNotes, 20, 105);

    // 5. Download the file
    doc.save(`AyurCare_Prescription_${selectedEvent.start.toLocaleDateString().replace(/\//g, '-')}.pdf`);
  };

  // --- ANALYTICS MATH ---
  const today = new Date();
  const appointmentsToday = events.filter(e => {
    return e.start.getDate() === today.getDate() &&
           e.start.getMonth() === today.getMonth() &&
           e.start.getFullYear() === today.getFullYear();
  }).length;

  const completedSessions = events.filter(e => e.resource.status === 'Completed').length;
  const totalPatients = patients.length;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading clinic data...</div>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#064E3B' }}>Clinic Schedule</h2>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <Plus size={20} /> New Appointment
        </button>
      </div>

      {/* --- DASHBOARD ANALYTICS CARDS --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
            <CalendarCheck size={24} color="#2563EB" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: 'bold' }}>Appointments Today</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>{appointmentsToday}</h3>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#F3E8FF', padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
            <Users size={24} color="#9333EA" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: 'bold' }}>Total Patients</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>{totalPatients}</h3>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '50%', marginRight: '16px' }}>
            <TrendingUp size={24} color="#059669" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: 'bold' }}>Completed Sessions</p>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>{completedSessions}</h3>
          </div>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 280px)', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({ style: { backgroundColor: event.color, borderRadius: '6px', border: 'none' } })}
          />
        </div>

        {selectedEvent && (
          <div style={{ width: '350px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Session Details</h3>
              <button 
                onClick={() => { setSelectedEvent(null); setNotes(''); }} 
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>
            <p><strong>Therapy:</strong> {selectedEvent.therapyName}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B7280' }}>ASSIGN THERAPIST</label>
              <input 
                className="input-field"
                value={therapistName}
                onChange={(e) => setTherapistName(e.target.value)}
                placeholder="Staff Name"
                style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #DDD', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B7280', display: 'block', marginBottom: '5px' }}>
                CLINICAL NOTES / PRESCRIPTION
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type diet plan, medicines, or session observations here..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid #D1D5DB',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* --- PDF DOWNLOAD BUTTON --- */}
            <div style={{ marginTop: '12px' }}>
              <button 
                onClick={handleGeneratePDF}
                style={{ width: '100%', padding: '10px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
              >
                <Printer size={18} /> Download as PDF
              </button>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => handleUpdateStatus('Completed')} style={{ padding: '10px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Mark Completed</button>
              <button onClick={() => handleUpdateStatus('Ongoing')} style={{ padding: '10px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Set Ongoing</button>
              <button onClick={() => handleUpdateStatus('Cancelled')} style={{ padding: '10px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel Session</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '400px' }}>
            <h2 style={{ marginTop: 0, color: '#064E3B' }}>New Session</h2>
            <form onSubmit={handleCreateAppointment}>
              <label style={{ display: 'block', marginBottom: '15px' }}>
                Select Patient
                <select 
                  required 
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #DDD' }} 
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                >
                  <option value="">-- Choose a Patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '15px' }}>
                Therapy Type
                <select 
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #DDD' }} 
                  value={formData.therapyName}
                  onChange={(e) => setFormData({...formData, therapyName: e.target.value})}
                >
                  <option>Abhyanga (Oil Massage)</option>
                  <option>Virechana (Detox)</option>
                  <option>Basti</option>
                  <option>Shirodhara</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
                <select onChange={(e) => setFormData({...formData, time: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }}>
                  <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                  <option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid #DDD', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#064E3B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Book Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;