// // src/components/Sidebar.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../AuthContext'; // Using your existing AuthContext path
// import { 
//   LayoutDashboard, Calendar, Users, Activity, 
//   FileText, Settings, LogOut, ShieldAlert 
// } from 'lucide-react';

// const Sidebar = () => {
//   const { user, logout } = useAuth();

//   // 1. Define all possible routes with their allowed roles
//   const menuItems = [
//     { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'practitioner', 'ngo'] },
//     { name: 'Schedule', path: '/dashboard/schedule', icon: <Calendar size={20} />, roles: ['admin', 'practitioner'] },
//     { name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} />, roles: ['admin', 'practitioner'] },
//     { name: 'Analytics', path: '/dashboard/analytics', icon: <Activity size={20} />, roles: ['admin', 'ngo'] },
//     { name: 'Reports', path: '/dashboard/reports', icon: <FileText size={20} />, roles: ['admin', 'practitioner', 'ngo'] },
//     { name: 'Alerts', path: '/dashboard/alerts', icon: <ShieldAlert size={20} />, roles: ['admin', 'practitioner'] },
//     { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} />, roles: ['admin'] },
//   ];

//   // 2. Filter logic: Keep only the items that include the current user's role
//   const visibleMenu = menuItems.filter(item => item.roles.includes(user?.role));

//   return (
//     <div style={{ width: '260px', backgroundColor: '#064E3B', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      
//       {/* Logo Area & Role Badge */}
//       <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//         <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <Activity size={24} color="#34D399" /> AyurCare Pro
//         </h2>
//         <span style={{ fontSize: '11px', color: '#A7F3D0', backgroundColor: 'rgba(52, 211, 153, 0.2)', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px', display: 'inline-block' }}>
//           {user?.role || 'Guest'} Portal
//         </span>
//       </div>

//       {/* Navigation Links - Filtered by Role */}
//       <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
//         {visibleMenu.map((item) => (
//           <NavLink 
//             key={item.name}
//             to={item.path}
//             end={item.path === '/dashboard'} 
//             style={({ isActive }) => ({
//               display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
//               color: isActive ? '#10B981' : '#D1D5DB',
//               backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
//               borderRight: isActive ? '4px solid #10B981' : '4px solid transparent',
//               textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s'
//             })}
//           >
//             {item.icon} {item.name}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom Logout Area */}
//       <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
//         <button 
//           onClick={logout}
//           style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'transparent', color: '#FCA5A5', border: '1px solid #FCA5A5', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', justifyContent: 'center' }}
//         >
//           <LogOut size={18} /> Sign Out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { LayoutDashboard, Calendar, Users, Activity, FileText, Settings, LogOut, ShieldAlert, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  // Safe fallback while context loads
  const currentUser = user || { role: 'patient', name: 'Guest' };

  // 1. Restored YOUR exact routes to prevent the forced 404 logout bug
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'practitioner', 'ngo'] },
    { name: 'Schedule', path: '/dashboard/schedule', icon: <Calendar size={20} />, roles: ['admin', 'practitioner'] },
    { name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} />, roles: ['admin', 'practitioner'] },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <Activity size={20} />, roles: ['admin', 'ngo'] },
    { name: 'Reports', path: '/dashboard/reports', icon: <FileText size={20} />, roles: ['admin', 'practitioner', 'ngo'] },
    { name: 'Alerts', path: '/dashboard/alerts', icon: <ShieldAlert size={20} />, roles: ['admin', 'practitioner'] },
    { name: 'Users', path: '/dashboard/users', icon: <ShieldCheck size={20} />, roles: ['admin'] },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} />, roles: ['admin'] },
    
  ];

  // 2. Dynamic RBAC Filtering
  const visibleMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div style={{ width: '250px', height: '100vh', backgroundColor: '#111827', color: 'white', display: 'flex', flexDirection: 'column', padding: '24px', position: 'fixed', left: 0, top: 0, boxSizing: 'border-box', zIndex: 50 }}>
      
      {/* Brand */}
      <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
        <h2 style={{ margin: 0, color: '#10B981', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={24} color="#10B981" /> AyurCare
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
          {currentUser.role} Portal
        </p>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
        {visibleMenu.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'} 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              color: isActive ? 'white' : '#9CA3AF',
              backgroundColor: isActive ? '#374151' : 'transparent',
              textDecoration: 'none',
              fontWeight: '500',
              transition: '0.2s'
            })}
          >
            {item.icon} {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div style={{ borderTop: '1px solid #374151', paddingTop: '24px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {currentUser.name ? currentUser.name.charAt(0) : 'G'}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{currentUser.name}</p>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '12px', textTransform: 'capitalize' }}>{currentUser.role}</p>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={logout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'transparent', border: '1px solid #FCA5A5', color: '#FCA5A5', cursor: 'pointer', borderRadius: '8px', transition: '0.2s', justifyContent: 'center', fontWeight: 'bold' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;