import os

CHAT_JSX = """import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Send, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Poll for new messages every 2 seconds
  useEffect(() => {
    const fetchMsgs = async () => {
        try {
            const res = await api.get('/communication/messages');
            setMessages(res.data);
        } catch (e) {
            console.error("Chat Error", e);
        }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Optimistic UI update (show message immediately)
    const tempMsg = { id: Date.now(), sender: 'client', text: input, time: 'Now' };
    setMessages([...messages, tempMsg]);
    setInput('');

    try {
        await api.post('/communication/messages', { text: input });
    } catch (e) {
        console.error("Send Error", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">W</div>
        <div>
            <h2 className="font-bold text-gray-800">Wakili Mwerevu</h2>
            <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => {
            const isMe = msg.sender === 'client';
            return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                </div>
            )
        })}
        <div ref={scrollRef}></div>
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition">
            <Send size={20} />
        </button>
      </form>
    </div>
  );
};
export default Chat;
"""

def fix():
    print("🛠 Creating missing Chat.jsx...")
    os.makedirs("src/pages/client", exist_ok=True)
    with open("src/pages/client/Chat.jsx", "w") as f:
        f.write(CHAT_JSX)
    print("✅ Created: src/pages/client/Chat.jsx")

if __name__ == "__main__":
    fix()