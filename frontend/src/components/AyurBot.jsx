import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AyurBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! I am your AyurCare AI Assistant. You can ask me about herbs (like Ashwagandha), doshas (like Vata), or therapies (like Basti). How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    // 1. Instantly show the user's message
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      // Grab the token in case your backend requires authentication
      const token = localStorage.getItem('token'); 
      
      // 2. Talk to your Node backend
      const response = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ message: userMsg })
      });
      
      // 3. Catch backend crashes immediately
      if (!response.ok) {
         throw new Error(`Server returned a ${response.status} error.`);
      }

      const data = await response.json();
      const finalReply = data.reply || "Oops! My backend sent an empty response.";

      // 4. Show the bot's response
      setIsTyping(false);
      setMessages(prev => [...prev, { text: finalReply, sender: 'bot', category: data.category }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: `🚨 Error connecting to the brain: ${error.message}. Is your Node server running on port 5000?`, 
        sender: 'bot' 
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* --- THE CHAT WINDOW --- */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden mb-4 animate-fade-in" style={{ height: '500px' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold">AyurBot Assistant</h3>
                <p className="text-xs text-green-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> Connected to Database
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-green-100 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* Notice the added "ayurbot-markdown" class for the bot messages */}
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none ayurbot-markdown'
                }`}>
                  
                  {msg.sender === 'bot' && msg.category && (
                     <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1 block">
                       {msg.category} Knowledge
                     </span>
                  )}
                  
                  {/* OPTION 3: THE MARKDOWN RENDERER */}
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <span>{msg.text}</span>
                  )}

                </div>
              </div>
            ))}
            
            {/* Thinking Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm text-gray-500 text-sm font-medium">
                  AyurBot is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Ashwagandha..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* --- THE FLOATING BUTTON --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}