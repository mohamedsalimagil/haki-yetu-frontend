import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Plus, User } from 'lucide-react';

const ChatSidebar = ({ onSelectContact, activeContactId, mobileView, onBack }) => {
  const { user } = useAuth();
  const [customId, setCustomId] = useState('');
  
  const handleManualConnect = (e) => {
    e.preventDefault();
    if (!customId) return;
    
    // Create a contact object based on the ID typed
    const contact = {
      id: parseInt(customId),
      first_name: `User ${customId}`,
      last_name: '(Direct)',
      avatar: null
    };
    
    onSelectContact(contact);
  };

  return (
    <div className={`${mobileView ? 'w-full' : 'w-80'} border-r h-full flex flex-col bg-white`}>
      {/* Header Area */}
      <div className="p-4 border-b bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-800">Messages</h2>
          {mobileView && onBack && (
            <button onClick={onBack} className="text-sm text-blue-600 font-bold">Back</button>
          )}
        </div>
        
        {/* ID DISPLAY: Crucial for testing so you know who you are */}
        <div className="text-xs text-slate-500 mb-4 font-mono bg-white p-2 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <span>Logged in as:</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">{user?.first_name} (ID: {user?.id})</span>
        </div>

        {/* DIRECT CONNECT FORM */}
        <form onSubmit={handleManualConnect} className="flex gap-2">
          <input
            type="number"
            placeholder="Enter Partner ID..."
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            className="flex-1 p-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
            title="Start Chat"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
         <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
            <User size={32} />
         </div>
         <p className="text-sm font-bold text-gray-600">No active bookings</p>
         <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
           Use the input above to connect directly with another user ID for testing.
         </p>
      </div>
    </div>
  );
};

export default ChatSidebar;