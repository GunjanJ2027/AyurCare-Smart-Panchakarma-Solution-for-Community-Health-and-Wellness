// src/pages/AIPredictor.jsx
import { useState } from 'react';
import { Sparkles, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIPredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // State to hold the user's actual answers
  const [answers, setAnswers] = useState({
    frame: '',
    digestion: '',
    sleep: '',
    skin: ''
  });

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Sending REAL user data to the Python backend
      const response = await fetch('http://localhost:8000/predict-dosha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answers }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch AI prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  // Check if all questions are answered
  const isFormComplete = Object.values(answers).every(val => val !== '');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto mb-6">
        <Link to="/patient-dashboard" className="text-purple-600 hover:underline font-medium">← Back to Dashboard</Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Dosha Predictor</h1>
            <p className="text-gray-500">Real-time algorithmic analysis</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handlePredict} className="space-y-8">
            
            {/* Question 1 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">1. How would you describe your physical frame?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['thin', 'medium', 'large'].map(opt => (
                  <button key={opt} type="button" onClick={() => handleChange('frame', opt)} className={`p-4 border rounded-xl text-left capitalize transition-all ${answers.frame === opt ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>
                    {opt} (Light/Sturdy/Heavy)
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">2. How is your digestion and appetite?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button type="button" onClick={() => handleChange('digestion', 'irregular')} className={`p-4 border rounded-xl text-left transition-all ${answers.digestion === 'irregular' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Irregular / Prone to gas</button>
                <button type="button" onClick={() => handleChange('digestion', 'strong')} className={`p-4 border rounded-xl text-left transition-all ${answers.digestion === 'strong' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Strong / Sharp / Acidic</button>
                <button type="button" onClick={() => handleChange('digestion', 'slow')} className={`p-4 border rounded-xl text-left transition-all ${answers.digestion === 'slow' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Slow / Sluggish</button>
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">3. Describe your sleep pattern:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button type="button" onClick={() => handleChange('sleep', 'light')} className={`p-4 border rounded-xl text-left transition-all ${answers.sleep === 'light' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Light / Interrupted</button>
                <button type="button" onClick={() => handleChange('sleep', 'moderate')} className={`p-4 border rounded-xl text-left transition-all ${answers.sleep === 'moderate' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Moderate / Sound</button>
                <button type="button" onClick={() => handleChange('sleep', 'heavy')} className={`p-4 border rounded-xl text-left transition-all ${answers.sleep === 'heavy' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Heavy / Hard to wake</button>
              </div>
            </div>

            {/* Question 4 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">4. What is your skin type?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button type="button" onClick={() => handleChange('skin', 'dry')} className={`p-4 border rounded-xl text-left transition-all ${answers.skin === 'dry' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Dry / Rough / Cold</button>
                <button type="button" onClick={() => handleChange('skin', 'warm_oily')} className={`p-4 border rounded-xl text-left transition-all ${answers.skin === 'warm_oily' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Warm / Prone to acne</button>
                <button type="button" onClick={() => handleChange('skin', 'cool_thick')} className={`p-4 border rounded-xl text-left transition-all ${answers.skin === 'cool_thick' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>Thick / Cool / Oily</button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isFormComplete || loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Analyzing Data...' : 'Calculate Dosha Profile'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-inner">
              <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl text-green-800 font-bold mb-2">Analysis Complete</h3>
              <p className="text-green-600 mb-6 font-medium">Model Confidence Score: {(result.confidence * 100).toFixed(0)}%</p>
              
              <div className="inline-block px-10 py-4 bg-white rounded-full shadow-md text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-ayurGreen">
                {result.dosha}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-lg">
                <Activity className="text-purple-600" /> AI Insights
              </h4>
              <p className="text-gray-700 leading-relaxed text-lg">{result.insights}</p>
            </div>

            {/* --- NEW: THERAPY RECOMMENDATIONS UI --- */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4 text-lg">
                <Sparkles className="text-blue-600" /> AI Recommended Therapies
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.recommendations?.map((therapy, index) => (
                  <span key={index} className="bg-white text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm border border-blue-200">
                    {therapy}
                  </span>
                ))}
              </div>
              <p className="text-sm text-blue-600 mt-4 italic">
                *These recommendations are generated by the AyurCare AI model based on your dominant Dosha. Please consult a practitioner before starting any treatment.
              </p>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full text-center text-purple-600 font-bold text-lg hover:underline py-4"
            >
              ← Retake Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}