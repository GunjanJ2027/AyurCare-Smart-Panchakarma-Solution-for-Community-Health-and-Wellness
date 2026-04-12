import React from 'react';

const Settings = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#064E3B' }}>Clinic Settings</h2>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Profile & Preferences</h3>
        <p style={{ color: '#6B7280' }}>
          This settings panel is currently under construction. Future updates will allow you to manage your clinic profile, adjust business hours, and update billing information.
        </p>
      </div>
    </div>
  );
};

export default Settings;