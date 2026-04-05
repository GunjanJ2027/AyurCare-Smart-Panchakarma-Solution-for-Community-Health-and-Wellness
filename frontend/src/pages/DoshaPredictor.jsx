// src/pages/DoshaPredictor.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Activity, Leaf, Wind, Droplets, RefreshCw } from 'lucide-react';

// The Quiz Data Engine
const quizQuestions = [
  {
    id: 1,
    question: "How would you describe your natural physical frame?",
    options: [
      { text: "Thin, slender, prominent joints (Hard to gain weight)", dosha: "vata" },
      { text: "Medium, well-proportioned (Gain/lose weight easily)", dosha: "pitta" },
      { text: "Broad, solid, sturdy (Hard to lose weight)", dosha: "kapha" }
    ]
  },
  {
    id: 2,
    question: "What is your typical skin type?",
    options: [
      { text: "Dry, rough, thin, prone to flaking", dosha: "vata" },
      { text: "Warm, sensitive, prone to acne or redness", dosha: "pitta" },
      { text: "Thick, oily, smooth, pale", dosha: "kapha" }
    ]
  },
  {
    id: 3,
    question: "How do you naturally react to stress?",
    options: [
      { text: "I get anxious, worried, and overthink things", dosha: "vata" },
      { text: "I get irritable, frustrated, or angry", dosha: "pitta" },
      { text: "I withdraw, avoid the issue, or feel lethargic", dosha: "kapha" }
    ]
  },
  {
    id: 4,
    question: "What are your typical sleep patterns?",
    options: [
      { text: "Light sleeper, easily awakened, erratic", dosha: "vata" },
      { text: "Moderate sleeper, but may wake up hot", dosha: "pitta" },
      { text: "Deep, heavy sleeper, hard to wake up", dosha: "kapha" }
    ]
  }
];

export default function DoshaPredictor() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelectOption = (dosha) => {
    setAnswers({ ...answers, [currentStep]: dosha });
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateDosha();
    }
  };

  const calculateDosha = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach(dosha => {
      scores[dosha] += 1;
    });

    // Find the highest score
    const primaryDosha = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    setResult({ profile: primaryDosha, scores });
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl z-10 overflow-hidden border border-green-100">
        <div className="bg-ayurGreen p-6 text-white text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Activity size={32} /> AI Dosha Assessment
          </h1>
          <p className="text-green-100 mt-2">Discover your unique mind-body constitution.</p>
        </div>

        {!result ? (
          <div className="p-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentStep + 1}. {quizQuestions[currentStep].question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {quizQuestions[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.dosha)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    answers[currentStep] === opt.dosha 
                      ? 'border-green-500 bg-green-50 shadow-md transform scale-[1.02]' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-medium ${answers[currentStep] === opt.dosha ? 'text-green-800' : 'text-gray-700'}`}>
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium disabled:opacity-30 transition-colors"
              >
                <ArrowLeft size={20} /> Back
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!answers[currentStep]}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentStep === quizQuestions.length - 1 ? 'Analyze Dosha' : 'Next Question'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              {result.profile === 'vata' && <Wind size={48} />}
              {result.profile === 'pitta' && <Activity size={48} />}
              {result.profile === 'kapha' && <Droplets size={48} />}
            </div>
            
            <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Your Primary Dosha is</h2>
            <h3 className="text-5xl font-black text-green-700 capitalize mb-6">{result.profile}</h3>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto line-height-relaxed">
              Based on your answers, you have a dominant <strong>{result.profile}</strong> constitution. 
              Our practitioners will use this data to customize your Panchakarma oils, diet, and therapy schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/patient-dashboard')} className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Return to Dashboard
              </button>
              <button onClick={resetQuiz} className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors border border-green-200">
                <RefreshCw size={18} /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}