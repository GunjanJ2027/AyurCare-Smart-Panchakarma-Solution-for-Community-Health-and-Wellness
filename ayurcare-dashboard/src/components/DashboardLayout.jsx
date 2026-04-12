// src/components/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      {/* The Fixed Sidebar */}
      <Sidebar />

      {/* The Main Content Area (Pushed right to make room for the 260px sidebar) */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#374151', fontWeight: '600' }}>
            {/* We will make this dynamic later based on the page */}
            Clinic Dashboard
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Loads Here! */}
        <main style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;