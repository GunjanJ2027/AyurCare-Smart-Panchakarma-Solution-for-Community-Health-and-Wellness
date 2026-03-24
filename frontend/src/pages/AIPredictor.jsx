// src/pages/AIPredictor.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Activity, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AIPredictor() {
  const navigate = useNavigate();
  
  // 1. Match these EXACTLY to the Python Machine Learning Encoders
  const [formData, setFormData] = useState({
    body_frame: 'Medium',
    digestion: 'Strong',
    sleep: 'Sound',
    stress: 'Anxious'
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  // 2. The function that talks to the Python FastAPI Server
  const handleAIPrediction = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    setError('');
    setPredictionResult(null);

    try {
      // Sending data to Python (Port 8000)
      const response = await fetch('http://localhost:8000/predict-dosha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setPredictionResult(data);
      } else {
        setError(data.detail || 'Failed to get a prediction from the AI server.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the Python AI Microservice. Is it running on port 8000?');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-3xl z-10">
        <button onClick={() => navigate('/patient-dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-teal-700 p-8 text-white text-center relative overflow-hidden">
            <BrainCircuit size={64} className="mx-auto mb-4 text-green-200 opacity-90" />
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex justify-center items-center gap-2">
              <Sparkles size={24} className="text-yellow-300"/> AI Dosha Diagnostics
            </h1>
            <p className="text-green-100 max-w-xl mx-auto">
              Powered by a Scikit-Learn Random Forest Classifier. Enter your clinical metrics below to run a live predictive inference model.
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20}/>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Form Section */}
              <form onSubmit={handleAIPrediction} className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Activity size={20} className="text-green-600"/> Clinical Inputs
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Body Frame</label>
                  <select value={formData.body_frame} onChange={(e) => setFormData({...formData, body_frame: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                    <option value="Thin">Thin / Slender</option>
                    <option value="Medium">Medium / Athletic</option>
                    <option value="Heavy">Heavy / Broad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Digestion & Appetite</label>
                  <select value={formData.digestion} onChange={(e) => setFormData({...formData, digestion: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                    <option value="Irregular">Irregular / Fluctuating</option>
                    <option value="Strong">Strong / Intense</option>
                    <option value="Sluggish">Sluggish / Slow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sleep Pattern</label>
                  <select value={formData.sleep} onChange={(e) => setFormData({...formData, sleep: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                    <option value="Light">Light / Interrupted</option>
                    <option value="Sound">Sound / Moderate</option>
                    <option value="Deep">Deep / Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stress Response</label>
                  <select value={formData.stress} onChange={(e) => setFormData({...formData, stress: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                    <option value="Anxious">Anxious / Worried</option>
                    <option value="Angry">Angry / Irritable</option>
                    <option value="Withdrawn">Withdrawn / Let It Go</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isPredicting}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2"
                >
                  {isPredicting ? (
                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing Inference...</span>
                  ) : (
                    <><BrainCircuit size={20} /> Run ML Algorithm</>
                  )}
                </button>
              </form>

              {/* Results Section */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-center h-full">
                {!predictionResult ? (
                  <div className="text-center text-gray-400">
                    <BrainCircuit size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Awaiting Data Input</p>
                    <p className="text-sm mt-1 max-w-xs mx-auto">Fill out the clinical parameters and run the algorithm to generate an AI prediction.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 text-green-700 font-bold mb-4 border-b border-green-200 pb-2">
                      <CheckCircle2 size={24} /> Inference Complete
                    </div>
                    
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Predicted Primary Dosha</p>
                    <h2 className="text-4xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      {predictionResult.predicted_dosha} 
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest align-middle">
                        {predictionResult.model_used}
                      </span>
                    </h2>

                    <h4 className="font-bold text-gray-700 mb-3 text-sm">Statistical Probability Matrix:</h4>
                    <div className="space-y-4">
                      {Object.entries(predictionResult.confidence_scores).map(([dosha, score]) => (
                        <div key={dosha}>
                          <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-gray-700">{dosha}</span>
                            <span className={score > 50 ? 'text-green-600' : 'text-gray-500'}>{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-2.5 rounded-full ${score > 50 ? 'bg-green-500' : score > 20 ? 'bg-yellow-400' : 'bg-gray-300'}`} 
                              style={{ width: `${score}%`, transition: 'width 1s ease-in-out' }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 italic shadow-sm">
                      "This analysis is generated dynamically using a trained Machine Learning model hosted on our Python microservice. It interprets complex non-linear relationships between physiological indicators."
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}