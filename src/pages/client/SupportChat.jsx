import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupportChat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm the Haki Yetu AI Assistant. How can I help you today? You can ask about our services, bookings, payments, or any other questions." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const apiBase = import.meta.env.VITE_API_BASE || 'https://haki-yetu-backend.onrender.com';
            const res = await fetch(`${apiBase}/api/communication/chat/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg })
            });

            if (!res.ok) {
                throw new Error('Failed to get response');
            }

            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "I'm having trouble processing your request. Please try again."
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again in a moment or check our FAQ page."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Bot className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white">AI Support Agent</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Automated assistance • Type "human" or "agent" to escalate</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm p-3 rounded-lg shadow-sm">
                            <span className="inline-block animate-pulse">AI is typing...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                        placeholder="Type your question here..."
                        disabled={loading}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    This is an AI assistant. For complex issues, ask for a human agent.
                </p>
            </div>
        </div>
    );
};

export default SupportChat;
