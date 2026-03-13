// src/components/ChatbotWidget.jsx
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! I am the AyurCare AI Assistant. How can I help you with your wellness journey today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsTyping(true);

    try {
      // Call our Python FastAPI Chatbot endpoint
      const response = await fetch('http://localhost:8000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await response.json();
      
      // Simulate a slight delay to feel like "typing"
      setTimeout(() => {
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
        setIsTyping(false);
      }, 600);
      
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-ayurGreen text-white p-4 rounded-full shadow-2xl hover:bg-green-800 hover:scale-110 transition-all flex items-center justify-center animate-bounce-slow"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-ayurGreen text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-bold text-lg">AyurCare Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-green-200 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 text-sm">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-ayurGreen text-white rounded-tr-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-tl-none text-xs italic">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Ayurveda..."
              className="flex-1 p-2 bg-gray-100 border-transparent rounded-lg focus:ring-ayurGreen focus:border-ayurGreen focus:bg-white transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-2 bg-ayurGreen text-white rounded-lg disabled:opacity-50 hover:bg-green-800 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}