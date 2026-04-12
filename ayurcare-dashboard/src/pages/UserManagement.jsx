// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import { ShieldCheck, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'practitioner'
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Sending the exact payload we tested in the console
      const response = await fetch('http://localhost:5000/api/auth/register-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you eventually lock down this endpoint, add your token here:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      // Show success message and clear the form
      setStatus({ type: 'success', message: `${formData.name} successfully added as ${formData.role}!` });
      setFormData({ name: '', email: '', password: '', role: 'practitioner' });

    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, color: '#111827', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} color="#059669" /> System Administration
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>
          Securely provision access for new practitioners, administrators, and NGO partners.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Create User Form Card */}
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
            <UserPlus size={20} color="#3B82F6" /> Create New User
          </h2>

          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Name Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Dr. Ramesh"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
              />
            </div>

            {/* Email Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="e.g. ramesh@ayurcare.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>Temporary Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Assign a secure password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>Access Level (Role)</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="practitioner">Medical Practitioner</option>
                <option value="ngo">NGO Partner</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            {/* Status Messages */}
            {status.message && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '6px', 
                backgroundColor: status.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                color: status.type === 'success' ? '#065F46' : '#991B1B',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500'
              }}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ marginTop: '8px', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Provisioning Account...' : 'Create User Account'}
            </button>
          </form>
        </div>

        {/* Security Info Card (Optional Polish) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827' }}>Role Permissions</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', fontSize: '14px', lineHeight: '1.6' }}>
              <li><strong style={{ color: '#111827' }}>System Admin:</strong> Full access to all modules, analytics, and user provisioning.</li>
              <li><strong style={{ color: '#111827' }}>Practitioner:</strong> Can view schedule, manage patient profiles, and log daily adherence.</li>
              <li><strong style={{ color: '#111827' }}>NGO Partner:</strong> View-only access to specific clinic analytics and macro reporting.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;