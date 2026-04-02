import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot } from 'lucide-react';

export default function SakhiChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, I'm Sakhi. How can I support you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Send to mock backend
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      
      const botMsg = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { id: Date.now() + 1, text: "I'm having trouble connecting right now, but please know you are not alone.", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      <div className="bg-shop-secondary p-4 flex items-center gap-3 border-b border-[#c8c8e6]">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-shop-secondary shadow-sm">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Sakhi</h2>
          <p className="text-xs text-gray-600 font-medium">Always here for you</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-shop-primary text-white rounded-tr-none' 
                : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-shop-primary/50 text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-shop-primary text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#e0a8b8] transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
