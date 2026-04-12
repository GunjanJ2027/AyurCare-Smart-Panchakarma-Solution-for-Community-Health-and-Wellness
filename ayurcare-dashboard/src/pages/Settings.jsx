// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Building, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Settings = () => {
  const { user } = useAuth(); // Getting the REAL logged-in user!
  const [loading, setLoading] = useState(true);

  // Profile data comes from AuthContext, so we don't need to fetch it from the Settings DB
  const [profile, setProfile] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@email.com',
    role: user?.role || 'Admin'
  });

  const [clinic, setClinic] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyDigest: true
  });

  // Fetch real settings from the database on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        if (response.data) {
          setClinic(response.data.clinic);
          setNotifications(response.data.notifications);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save changes to the database
//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put('/admin/settings', {
//         clinic: clinic,
//         notifications: notifications
//       });
//       alert("✅ Settings successfully updated in the database!");
//     } catch (error) {
//       console.error("Failed to save settings:", error);
//       alert("🚨 Failed to save settings.");
//     }
//   };
    const handleSave = async (e) => {
    e.preventDefault();
    try {
      // 1. Save the Clinic and Notification Settings
      await api.put('/admin/settings', {
        clinic: clinic,
        notifications: notifications
      });

      // 2. Save the User Profile (Name & Email)
      // We pass the user ID from your AuthContext so the database knows WHO to update
      await api.put('/auth/profile', {
        userId: user._id || user.id, // Gets your ID from the active login session
        name: profile.name,
        email: profile.email
      });

      alert("✅ Settings and Profile successfully updated in the database!");
      
    } catch (error) {
      console.error("Failed to save data:", error);
      alert("🚨 Failed to save changes. Please try again.");
    }
  };
  if (loading) return <div style={{ padding: '40px' }}>Loading settings...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>System Settings</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280' }}>Manage your clinic preferences and account details.</p>
        </div>
        <button 
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* --- PROFILE SETTINGS CARD (Real User Data) ---
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <User color="#059669" size={20} /> Personal Profile
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Full Name</label>
              <input type="text" value={profile.name} readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Email Address</label>
              <input type="email" value={profile.email} readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Role</label>
              <input type="text" value={profile.role} readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280', boxSizing: 'border-box', cursor: 'not-allowed' }} />
            </div>
          </div>
        </div> */}

        {/* --- PROFILE SETTINGS CARD --- */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <User color="#059669" size={20} /> Personal Profile
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Full Name</label>
              {/* UNLOCKED: Removed readOnly and added onChange */}
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#111827', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Email Address</label>
              {/* UNLOCKED: Removed readOnly and added onChange */}
              <input 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})} 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#111827', boxSizing: 'border-box' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Role (Cannot be changed here)</label>
              {/* KEPT LOCKED: You don't want to accidentally un-admin yourself! */}
              <input 
                type="text" 
                value={profile.role} 
                readOnly 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280', boxSizing: 'border-box', cursor: 'not-allowed' }} 
              />
            </div>
          </div>
        </div>

        {/* --- CLINIC DETAILS CARD (Connected to DB) --- */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <Building color="#3B82F6" size={20} /> Clinic Information
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Clinic Name</label>
              <input type="text" value={clinic.name} onChange={(e) => setClinic({...clinic, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Contact Phone</label>
              <input type="text" value={clinic.phone} onChange={(e) => setClinic({...clinic, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>Clinic Address</label>
              <textarea rows="2" value={clinic.address} onChange={(e) => setClinic({...clinic, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}></textarea>
            </div>
          </div>
        </div>

        {/* --- NOTIFICATIONS CARD (Connected to DB) --- */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <Bell color="#F59E0B" size={20} /> Notification Preferences
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={notifications.emailAlerts} onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#059669' }} />
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>Email Alerts</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Receive alerts for new high-risk patients.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={notifications.smsAlerts} onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#059669' }} />
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>SMS Notifications</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Text message reminders for upcoming sessions.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={notifications.dailyDigest} onChange={(e) => setNotifications({...notifications, dailyDigest: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#059669' }} />
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>Daily Digest</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>A daily summary email of clinic performance.</p>
              </div>
            </label>
          </div>
        </div>

        {/* --- SECURITY CARD --- */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <Shield color="#EF4444" size={20} /> Security & Access
          </h3>
          
          <p style={{ margin: '0 0 16px 0', color: '#6B7280', fontSize: '14px' }}>
            To change your admin password, please verify your current credentials first.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#4B5563' }}>New Password</label>
              <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
            </div>
            <button style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>
              Update Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;