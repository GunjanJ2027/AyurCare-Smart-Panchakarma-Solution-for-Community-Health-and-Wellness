// src/components/TherapyPlanBuilder.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Save, Activity, Edit2, X } from 'lucide-react';

const TherapyPlanBuilder = ({ patientId }) => {
  const [plan, setPlan] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Step Form State
  const [newStep, setNewStep] = useState({
    therapyName: 'Abhyanga',
    duration: '',
    frequency: 'Daily',
    instructions: ''
  });

  const availableTherapies = ['Abhyanga', 'Shirodhara', 'Basti', 'Virechana', 'Nasya', 'Panchakarma (Full)'];

  useEffect(() => {
    // Fetch the patient's existing plan from the DB
    const fetchPlan = async () => {
      try {
        const response = await api.get(`/admin/patients/${patientId}`);
        if (response.data.therapyPlan) {
          setPlan(response.data.therapyPlan);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch plan", err);
        setLoading(false);
      }
    };
    if (patientId) fetchPlan();
  }, [patientId]);

  const handleAddStep = () => {
    if (!newStep.duration) return alert("Please specify a duration.");
    setPlan([...plan, newStep]);
    setNewStep({ therapyName: 'Abhyanga', duration: '', frequency: 'Daily', instructions: '' }); // Reset
  };

  const handleRemoveStep = (index) => {
    const updatedPlan = plan.filter((_, i) => i !== index);
    setPlan(updatedPlan);
  };

  const handleSavePlan = async () => {
    try {
      await api.put(`/admin/patients/${patientId}/therapy-plan`, { therapyPlan: plan });
      setIsEditing(false);
      alert("✅ Therapy Plan successfully saved to database!");
    } catch (err) {
      console.error(err);
      alert("🚨 Failed to save therapy plan.");
    }
  };

  if (loading) return <div>Loading Plan...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="#059669" size={20} /> Assigned Therapy Plan
        </h3>
        
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            <Edit2 size={14} /> Edit Plan
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
             <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSavePlan} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              <Save size={14} /> Save to DB
            </button>
          </div>
        )}
      </div>

      {/* Plan Display / Edit Mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {plan.length === 0 && !isEditing && (
          <p style={{ color: '#9CA3AF', margin: 0, fontStyle: 'italic' }}>No active therapies assigned.</p>
        )}

        {/* Existing Steps */}
        {plan.map((step, index) => (
          <div key={index} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#111827', fontSize: '16px' }}>
                <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginRight: '8px' }}>Step {index + 1}</span>
                {step.therapyName}
              </h4>
              <p style={{ margin: '0 0 8px 0', color: '#4B5563', fontSize: '14px' }}><strong>Duration:</strong> {step.duration} ({step.frequency})</p>
              {step.instructions && <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', fontStyle: 'italic' }}>"{step.instructions}"</p>}
            </div>
            
            {isEditing && (
              <button onClick={() => handleRemoveStep(index)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}

        {/* Add New Step Form (Only visible when editing) */}
        {isEditing && (
          <div style={{ marginTop: '16px', padding: '16px', border: '1px dashed #059669', borderRadius: '8px', backgroundColor: '#F0FDF4' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#059669', fontSize: '14px' }}>+ Add New Therapy Step</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <select value={newStep.therapyName} onChange={(e) => setNewStep({...newStep, therapyName: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                {availableTherapies.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" placeholder="Duration (e.g. 7 Days)" value={newStep.duration} onChange={(e) => setNewStep({...newStep, duration: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
              <select value={newStep.frequency} onChange={(e) => setNewStep({...newStep, frequency: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
              </select>
            </div>
            
            <input type="text" placeholder="Specific Instructions / Custom Notes..." value={newStep.instructions} onChange={(e) => setNewStep({...newStep, instructions: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box', marginBottom: '12px' }} />
            
            <button onClick={handleAddStep} style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Step to Plan
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TherapyPlanBuilder;