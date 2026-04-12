
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Schedule from './pages/Schedule';
import Patients from './pages/Patients';
import api from './services/api';
import Settings from './pages/Settings';
// --- REAL AUTHENTICATION COMPONENT ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     if (isLogin) {
  //       // Log in to existing account
  //       const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
  //       localStorage.setItem('token', res.data.token);
  //       window.location.href = '/'; // Reload to clear states and mount dashboard
  //     } else {
  //       // Register a NEW Doctor Account
  //       await api.post('/auth/register', { 
  //         name: formData.name, 
  //         email: formData.email, 
  //         password: formData.password, 
  //         role: 'Practitioner' 
  //       });
  //       alert('Doctor account created! Please log in.');
  //       setIsLogin(true); // Switch back to login view
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.error || 'Authentication failed. Check your credentials.');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        // 1. Send login request to backend
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        const token = res.data.token;

        // 2. Decode the token payload to check the user's role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.user.role;

        // 3. THE BOUNCER: Kick out Patients
        if (userRole === 'Patient' || userRole === 'patient') {
          setError('Access Denied: This dashboard is for clinic staff only. Patients must use the mobile app.');
          return; // Stop the login process entirely
        }

        // 4. If they are a Practitioner/Admin, let them in!
        localStorage.setItem('token', token);
        window.location.href = '/'; 

      } else {
        // Register a NEW Doctor Account
        await api.post('/auth/register', { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          role: 'Practitioner' 
        });
        alert('Doctor account created! Please log in.');
        setIsLogin(true); // Switch back to login view
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || 'Authentication failed. Check your credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F0FDF4' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#064E3B', marginBottom: '8px' }}>
          {isLogin ? 'AyurCare Pro Login' : 'Register Doctor'}
        </h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
          {isLogin ? 'Enter your credentials to access the dashboard' : 'Create an account to manage patients'}
        </p>

        {error && <div style={{ padding: '10px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Dr. Full Name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
          />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Need a doctor account? Register here.' : 'Already have an account? Log in.'}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <AuthScreen />} />
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Schedule />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/patients" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Patients />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/settings" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;