// // src/pages/Login.jsx
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Leaf } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to login');
//       }

//       // Save the secure token to the browser
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('role', data.role);

//       // Redirect based on the user's role
//       if (data.role === 'NGO_Admin') {
//         navigate('/admin-dashboard');
//       } else if (data.role === 'Patient') {
//         navigate('/patient-dashboard');
//       } else {
//         navigate('/practitioner-dashboard');
//       }

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-ayurLight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center text-ayurGreen">
//           <Leaf size={48} />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           AyurCare
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Smart Panchakarma Solution
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email address</label>
//               <div className="mt-1">
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="mt-1">
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ayurGreen hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayurGreen disabled:opacity-50"
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//             </div>
//           </form>

//           {/* This is the new sign up link properly placed! */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               New patient?{' '}
//               <Link to="/signup" className="font-medium text-ayurGreen hover:text-green-800">
//                 Create an account
//               </Link>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/Login.jsx
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Leaf } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Looks for data.error (which our backend sends) or falls back to a default message
//         throw new Error(data.error || 'Failed to login');
//       }

//       // 1. Save the secure token and role to the browser
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userRole', data.role);

//       // 2. THE TRAFFIC DIRECTOR: Redirect based on the exact role from MongoDB
//       if (data.role === 'NGO_Admin') {
//         navigate('/admin-dashboard');
//       } else if (data.role === 'Patient') {
//         navigate('/patient-dashboard');
//       } else if (data.role === 'Practitioner') {
//         navigate('/practitioner-dashboard');
//       } else {
//         navigate('/'); // Fallback just in case
//       }

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-ayurLight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center text-ayurGreen">
//           <Leaf size={48} />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           AyurCare
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Smart Panchakarma Solution
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email address</label>
//               <div className="mt-1">
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="mt-1">
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ayurGreen hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayurGreen disabled:opacity-50"
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//             </div>
//           </form>

//           {/* Sign up link properly placed */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               New patient?{' '}
//               <Link to="/signup" className="font-medium text-ayurGreen hover:text-green-800">
//                 Create an account
//               </Link>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, User, Stethoscope, ShieldPlus } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // The state to track which of the 3 buttons is currently clicked
  const [selectedPortal, setSelectedPortal] = useState('Patient'); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // SECURITY CHECK: Ensure they are using the correct door!
      if (data.role !== selectedPortal) {
        throw new Error(`This email is not registered as a ${selectedPortal.replace('_', ' ')}.`);
      }

      // Save the secure token to the browser
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      // Redirect based on the active portal
      if (selectedPortal === 'NGO_Admin') {
        navigate('/admin-dashboard');
      } else if (selectedPortal === 'Patient') {
        navigate('/patient-dashboard');
      } else if (selectedPortal === 'Practitioner') {
        navigate('/practitioner-dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayurLight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-ayurGreen">
          <Leaf size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AyurCare
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select your portal to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* --- THE 3 PORTAL BUTTONS --- */}
          <div className="flex justify-between space-x-2 mb-8 bg-gray-50 p-1 rounded-xl border border-gray-100">
            
            <button
              onClick={() => { setError(''); setSelectedPortal('Patient'); }}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                selectedPortal === 'Patient' 
                  ? 'bg-white shadow-sm text-ayurGreen border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={20} className="mb-1" />
              Patient
            </button>

            <button
              onClick={() => { setError(''); setSelectedPortal('Practitioner'); }}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                selectedPortal === 'Practitioner' 
                  ? 'bg-white shadow-sm text-ayurGreen border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Stethoscope size={20} className="mb-1" />
              Doctor
            </button>

            <button
              onClick={() => { setError(''); setSelectedPortal('NGO_Admin'); }}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                selectedPortal === 'NGO_Admin' 
                  ? 'bg-white shadow-sm text-ayurGreen border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShieldPlus size={20} className="mb-1" />
              Admin
            </button>
            
          </div>
          {/* ----------------------------- */}

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ayurGreen focus:border-ayurGreen"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ayurGreen hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayurGreen disabled:opacity-50"
              >
                {loading ? 'Signing in...' : `Sign in as ${selectedPortal.replace('_', ' ')}`}
              </button>
            </div>
          </form>

          {/* Dynamic Sign-up text based on the portal selected */}
          {selectedPortal === 'Patient' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New patient?{' '}
                <Link to="/signup" className="font-medium text-ayurGreen hover:text-green-800">
                  Create an account
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}