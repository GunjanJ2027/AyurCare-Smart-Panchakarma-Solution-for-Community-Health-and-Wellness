// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PractitionerDashboard from './pages/PractitionerDashboard';
import AIPredictor from './pages/AIPredictor';
import DoshaPredictor from './pages/DoshaPredictor';
// --- HERE IS THE MISSING IMPORT! ---


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/practitioner-dashboard" element={<PractitionerDashboard />} />
        <Route path="/ai-predictor" element={<AIPredictor />} />
        <Route path="/ai-predictor" element={<DoshaPredictor />} />
      </Routes>
      
      {/* Floating Chatbot visible on all pages */}
      
    </Router>
  );
}

export default App;