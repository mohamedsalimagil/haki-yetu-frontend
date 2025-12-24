import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';

const MessageWindow = ({ activeContact, messages, onSendMessage, currentUserId }) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="text-gray-400" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{activeContact.name}</h3>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
              msg.sender_id === currentUserId
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-white text-gray-800 rounded-tl-none border'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] block mt-1 opacity-70`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2 bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageWindow;
