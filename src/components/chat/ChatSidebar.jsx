import React, { useState, useEffect } from 'react';
import { Search, User, Circle } from 'lucide-react';

const ChatSidebar = ({ contacts, onSelectContact, activeContactId, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 h-full border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No conversations yet.</div>
        ) : (
          filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeContactId === contact.id ? 'bg-blue-50 border-r-4 border-primary' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="text-gray-500" />
                </div>
                {onlineUsers.includes(contact.id.toString()) && (
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-current bg-white rounded-full border-2 border-white" />
                )}
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                <p className="text-sm text-gray-500 truncate">Click to chat</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
