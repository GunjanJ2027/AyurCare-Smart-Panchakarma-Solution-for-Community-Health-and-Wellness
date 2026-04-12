// src/components/DashboardLayout.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Settings, LogOut } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Deletes the secure token
    window.location.href = '/login';  // Forces a redirect and reloads the app
  };

  const navItems = [
    { name: 'Schedule', path: '/', icon: Calendar },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F3F4F6' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#064E3B', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #047857' }}>
          AyurCare Pro
        </div>
        <div style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#047857' : 'transparent',
                  borderLeft: isActive ? '4px solid #10B981' : '4px solid transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <Icon size={20} style={{ marginRight: '12px' }} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
        <div
          onClick={handleLogout}
          style={{ padding: '24px', display: 'flex', alignItems: 'center', cursor: 'pointer', borderTop: '1px solid #047857' }}
        >
          <LogOut size={20} style={{ marginRight: '12px' }} />
          <span>Logout</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#111827' }}>Practitioner Dashboard</h1>
        </header>
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;