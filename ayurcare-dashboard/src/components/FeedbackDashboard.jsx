// // src/components/FeedbackDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { MessageSquare, AlertOctagon, ThumbsUp, Plus, X } from 'lucide-react';

// const FeedbackDashboard = () => {
//   const [data, setData] = useState({ totalReviews: 0, complaintCount: 0, positiveCount: 0, feedbacks: [] });
//   const [loading, setLoading] = useState(true);
  
//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [patients, setPatients] = useState([]);
//   const [newFeedback, setNewFeedback] = useState({ patientId: '', therapy: 'Abhyanga', feedbackText: '' });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await api.get('/admin/dashboard/feedback');
//       setData(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to load feedback", err);
//       setLoading(false);
//     }
//   };

//   const openModal = async () => {
//     setIsModalOpen(true);
//     if (patients.length === 0) {
//       const res = await api.get('/admin/patients');
//       setPatients(res.data);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/admin/dashboard/feedback', newFeedback);
//       setIsModalOpen(false);
//       setNewFeedback({ patientId: '', therapy: 'Abhyanga', feedbackText: '' });
//       fetchData(); // Refresh dashboard
//       alert("Feedback logged successfully!");
//     } catch (err) {
//       alert("Failed to save feedback.");
//     }
//   };

//   if (loading) return <div>Loading Feedback Intelligence...</div>;

//   const satisfactionRate = data.totalReviews > 0 ? Math.round((data.positiveCount / data.totalReviews) * 100) : 100;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
//       {/* Top KPI Row */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
//         <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
//           <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><ThumbsUp color="#10B981" /></div>
//           <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Patient Satisfaction</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{satisfactionRate}%</h3></div>
//         </div>
//         <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
//           <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><MessageSquare color="#3B82F6" /></div>
//           <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Total Reviews</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{data.totalReviews}</h3></div>
//         </div>
//         <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
//           <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><AlertOctagon color="#EF4444" /></div>
//           <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Flagged Complaints</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{data.complaintCount}</h3></div>
//         </div>
//       </div>

//       {/* Review Feed */}
//       <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h3 style={{ margin: 0, color: '#374151' }}>Recent Session Feedback</h3>
//           <button onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//             <Plus size={16} /> Log New Feedback
//           </button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           {data.feedbacks.length === 0 ? <p style={{ color: '#6B7280' }}>No feedback logged yet.</p> : data.feedbacks.map((fb, idx) => (
//             <div key={idx} style={{ padding: '16px', border: `1px solid ${fb.isComplaint ? '#FCA5A5' : '#E5E7EB'}`, backgroundColor: fb.isComplaint ? '#FEF2F2' : '#F9FAFB', borderRadius: '8px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                 <strong style={{ color: '#111827' }}>{fb.patientName} <span style={{ fontWeight: 'normal', color: '#6B7280', fontSize: '14px' }}>— {fb.therapy}</span></strong>
//                 <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(fb.date).toLocaleDateString()}</span>
//               </div>
//               <p style={{ margin: 0, color: '#374151' }}>"{fb.feedback}"</p>
//               {fb.isComplaint && <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#DC2626', fontWeight: 'bold', backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '4px' }}>🚨 Automated Flag: Needs Review</span>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Feedback Modal */}
//       {isModalOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
//           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//               <h2 style={{ margin: 0, fontSize: '20px' }}>Log Patient Feedback</h2>
//               <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
//             </div>
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <select required value={newFeedback.patientId} onChange={(e) => setNewFeedback({...newFeedback, patientId: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
//                 <option value="">-- Select Patient --</option>
//                 {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//               </select>
//               <select value={newFeedback.therapy} onChange={(e) => setNewFeedback({...newFeedback, therapy: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
//                 <option value="Abhyanga">Abhyanga</option>
//                 <option value="Shirodhara">Shirodhara</option>
//                 <option value="Basti">Basti</option>
//               </select>
//               <textarea required placeholder="What did the patient say?" value={newFeedback.feedbackText} onChange={(e) => setNewFeedback({...newFeedback, feedbackText: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', height: '100px' }}></textarea>
//               <button type="submit" style={{ padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Feedback</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackDashboard;

// src/components/FeedbackDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, AlertOctagon, ThumbsUp, Plus, X } from 'lucide-react';

const FeedbackDashboard = () => {
  // Ultra-safe initial state
  const [data, setData] = useState({ 
    totalReviews: 0, 
    complaintCount: 0, 
    positiveCount: 0, 
    feedbacks: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ patientId: '', therapy: 'Abhyanga', feedbackText: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get('/admin/dashboard/feedback');
      
      // Ensure we always have an array even if the backend sends nothing
      setData({
        totalReviews: res.data?.totalReviews || 0,
        complaintCount: res.data?.complaintCount || 0,
        positiveCount: res.data?.positiveCount || 0,
        feedbacks: res.data?.feedbacks || []
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load feedback", err);
      setError(true);
      setLoading(false);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    try {
      if (patients.length === 0) {
        const res = await api.get('/admin/patients');
        // Ensure patients is always an array
        setPatients(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch patients for modal", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/dashboard/feedback', newFeedback);
      setIsModalOpen(false);
      setNewFeedback({ patientId: '', therapy: 'Abhyanga', feedbackText: '' });
      fetchData(); // Refresh dashboard
      alert("Feedback logged successfully!");
    } catch (err) {
      alert("Failed to save feedback.");
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading Patient Feedback...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEF2F2', borderRadius: '8px' }}>Failed to connect to the feedback database. Please restart your backend server.</div>;

  // Safe math calculation to prevent dividing by zero
  const satisfactionRate = data.totalReviews > 0 ? Math.round((data.positiveCount / data.totalReviews) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><ThumbsUp color="#10B981" /></div>
          <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Patient Satisfaction</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{satisfactionRate}%</h3></div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><MessageSquare color="#3B82F6" /></div>
          <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Total Reviews</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{data.totalReviews}</h3></div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '50%', marginRight: '16px' }}><AlertOctagon color="#EF4444" /></div>
          <div><p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Flagged Complaints</p><h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#111827' }}>{data.complaintCount}</h3></div>
        </div>
      </div>

      {/* Review Feed */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#374151' }}>Recent Session Feedback</h3>
          <button onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Plus size={16} /> Log New Feedback
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.feedbacks.length === 0 ? <p style={{ color: '#6B7280' }}>No feedback logged yet.</p> : data.feedbacks.map((fb, idx) => (
            <div key={idx} style={{ padding: '16px', border: `1px solid ${fb.isComplaint ? '#FCA5A5' : '#E5E7EB'}`, backgroundColor: fb.isComplaint ? '#FEF2F2' : '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#111827' }}>{fb.patientName} <span style={{ fontWeight: 'normal', color: '#6B7280', fontSize: '14px' }}>— {fb.therapy}</span></strong>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(fb.date).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: 0, color: '#374151' }}>"{fb.feedback}"</p>
              {fb.isComplaint && <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', color: '#DC2626', fontWeight: 'bold', backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '4px' }}>🚨 Automated Flag: Needs Review</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Log Patient Feedback</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6B7280" /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select required value={newFeedback.patientId} onChange={(e) => setNewFeedback({...newFeedback, patientId: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <select value={newFeedback.therapy} onChange={(e) => setNewFeedback({...newFeedback, therapy: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="Abhyanga">Abhyanga</option>
                <option value="Shirodhara">Shirodhara</option>
                <option value="Basti">Basti</option>
              </select>
              <textarea required placeholder="What did the patient say?" value={newFeedback.feedbackText} onChange={(e) => setNewFeedback({...newFeedback, feedbackText: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', height: '100px' }}></textarea>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Feedback</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;