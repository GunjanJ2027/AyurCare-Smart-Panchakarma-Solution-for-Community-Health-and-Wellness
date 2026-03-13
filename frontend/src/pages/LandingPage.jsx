// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { Leaf, Heart, Activity, Brain, Calendar, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 text-ayurGreen">
              <Leaf size={28} />
              <span className="font-bold text-xl tracking-wide">AyurCare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-ayurGreen font-medium transition-colors">Log In</Link>
              <Link to="/signup" className="bg-ayurGreen text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition-colors shadow-sm">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-ayurLight/50 -z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-6 border border-green-200">
            <Heart size={16} /> Community Health & Wellness Initiative
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Traditional Panchakarma, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ayurGreen to-teal-500">Powered by Smart AI.</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A digital healthcare platform designed to bridge the gap between ancient Ayurvedic healing and modern technology, improving patient adherence and therapy outcomes for community wellness centers.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="flex items-center gap-2 bg-ayurGreen text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-green-800 transition-all shadow-lg hover:shadow-xl">
              Start Your Healing Journey <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </div>

      {/* About Us / NGO Partnership Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-800 to-ayurGreen rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-12 sm:p-16 text-center text-white">
              <h2 className="text-3xl font-bold mb-6">In Proud Collaboration With <br/> The Earth Saviours Foundation</h2>
              <p className="text-lg text-teal-50 max-w-4xl mx-auto leading-relaxed">
                AyurCare was developed with a deep commitment to community service. By partnering with The Earth Saviours Foundation, we aim to provide streamlined, high-quality Panchakarma therapy management for marginalized and elderly patients. Our platform empowers NGOs and wellness centers to efficiently schedule treatments, track recovery, and ensure no patient is left behind.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Overview (NOW CLICKABLE!) */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose AyurCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Link 1: Goes to the working AI Predictor Demo */}
            <Link to="/ai-predictor" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                AI-Powered Insights <ArrowRight size={18} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600">From Dosha prediction models to therapy recommendation systems, our AI suite personalizes your holistic treatment plan. <span className="text-purple-600 font-medium">Try the Demo →</span></p>
            </Link>

            {/* Link 2: Directs to Signup to start booking */}
            <Link to="/signup" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                Smart Scheduling <ArrowRight size={18} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600">Built-in calendar systems allow patients to easily book therapies in IST, reducing missed appointments and practitioner downtime. <span className="text-blue-600 font-medium">Create Account →</span></p>
            </Link>

            {/* Link 3: Directs to Signup to start tracking */}
            <Link to="/signup" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                Recovery Tracking <ArrowRight size={18} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600">Daily recovery logs and progress analyzers help doctors monitor post-therapy adherence and adjust treatments dynamically. <span className="text-red-600 font-medium">Join Now →</span></p>
            </Link>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="flex justify-center items-center gap-2 mb-4 text-white">
          <Leaf size={24} className="text-ayurGreen" />
          <span className="font-bold text-xl tracking-wide">AyurCare</span>
        </div>
        <p>© 2026 AyurCare Smart Panchakarma Solution. Built for Community Wellness.</p>
      </footer>
    </div>
  );
}