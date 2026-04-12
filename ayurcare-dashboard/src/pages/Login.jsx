// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Activity, Lock, Mail } from 'lucide-react';
import api from '../services/api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     // TODO: Connect this to your real backend API
  //     // const response = await axios.post('/api/auth/login', { email, password });
      
  //     // MOCK LOGIN FOR NOW (Will be replaced with real API call)
  //     setTimeout(() => {
  //       if (email.includes('admin')) {
  //         login({ name: 'Admin User', role: 'admin' });
  //         navigate('/dashboard');
  //       } else if (email.includes('dr')) {
  //         login({ name: 'Dr. Practitioner', role: 'practitioner' });
  //         navigate('/dashboard');
  //       } else {
  //         setError('Invalid credentials');
  //       }
  //       setLoading(false);
  //     }, 1000);

  //   } catch (err) {
  //     setError('Failed to log in. Please check your credentials.');
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Ask the backend for a real token
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user: userData } = response.data;

      // 2. CRITICAL: Save the token to your Local Storage!
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 3. Update the sidebar and enter the app
        login(userData);
        navigate('/dashboard');
      } else {
        setError('Backend did not send a token.');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
            <Activity size={32} color="#059669" />
          </div>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>AyurCare </h2>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', top: '10px', left: '10px' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}
                placeholder="admin@ayurcare.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', top: '10px', left: '10px' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';
// import api from '../services/api'; // Make sure this path is correct!
// import { Activity, Lock, Mail } from 'lucide-react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // --- REAL API CALL ---
//       const response = await api.post('/auth/login', { email, password });
      
//       // 1. Extract data from backend response
//       const { token, user: userData } = response.data;

//       // 2. Save the session token to your browser's "wallet"
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // 3. Update the global state so Sidebar knows the role
//       login(userData);

//       // 4. Send the user to the dashboard
//       navigate('/dashboard');

//     } catch (err) {
//       console.error("Login Error Details:", err.response?.data);
      
//       // If the backend says 'Invalid credentials', it's because the DB check failed
//       const serverMessage = err.response?.data?.message || 'Failed to connect to server.';
//       setError(serverMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
//       <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
//           <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
//             <Activity size={32} color="#059669" />
//           </div>
//           <h2 style={{ margin: 0, color: '#111827', fontSize: '24px' }}>AyurCare Pro</h2>
//           <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' }}>Sign in to your account</p>
//         </div>

//         {error && (
//           <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Email Address</label>
//             <div style={{ position: 'relative' }}>
//               <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', top: '10px', left: '10px' }} />
//               <input 
//                 type="email" 
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}
//                 placeholder="admin@ayurcare.com"
//               />
//             </div>
//           </div>

//           <div>
//             <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Password</label>
//             <div style={{ position: 'relative' }}>
//               <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', top: '10px', left: '10px' }} />
//               <input 
//                 type="password" 
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #D1D5DB', borderRadius: '6px', boxSizing: 'border-box' }}
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;