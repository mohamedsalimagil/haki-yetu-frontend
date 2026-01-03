import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Send, Paperclip, Video, Phone, MoreVertical, 
  CheckCheck, Download, Calendar, AlertCircle, Ban
} from 'lucide-react';
import { chatContacts, chatMessages, sharedDocuments } from '../../data/mockChatData';

const InAppChat = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(chatContacts[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const messages = chatMessages[selectedContact.id] || [];

  const filteredContacts = chatContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert(`Message sent: ${messageInput}`);
      setMessageInput('');
    }
  };

  return (
    <div className="h-screen bg-[#F9FAFB] flex overflow-hidden">
      
      {/* --- LEFT: Contacts List --- */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#0A1E41]">Messages</h1>
            <button className="p-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition">
              <Send size={16} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search advocates or messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-gray-50 ${
                selectedContact.id === contact.id ? 'bg-blue-50 border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={contact.avatar} className="w-12 h-12 rounded-full" alt={contact.name} />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                  {contact.verified && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px]">✓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-[#0A1E41] truncate">{contact.name}</h3>
                    <span className="text-xs text-slate-400">{contact.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{contact.specialization}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-5 h-5 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CENTER: Chat Window --- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={selectedContact.avatar} className="w-12 h-12 rounded-full" alt={selectedContact.name} />
              {selectedContact.verified && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
            </div>
            <div>
              <h2 className="font-bold text-[#0A1E41]">{selectedContact.name}</h2>
              <p className="text-xs text-slate-500">LSK Practice No. {selectedContact.lskNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-gray-100 text-slate-600 rounded-lg hover:bg-gray-200 transition">
              <Video size={18} />
            </button>
            <button className="p-2.5 bg-gray-100 text-slate-600 rounded-lg hover:bg-gray-200 transition">
              <Phone size={18} />
            </button>
            <button 
              onClick={() => navigate(`/client/lawyer-profile/${selectedContact.id}`)}
              className="px-4 py-2 bg-[#2563EB] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Session Notice */}
        <div className="px-6 py-2 bg-blue-50 border-b border-blue-100">
          <p className="text-xs text-blue-700 text-center">
            <AlertCircle size={14} className="inline mr-1" />
            Session started with LSK Verified Advocate. All communications are privileged.
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {/* Date Divider */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-slate-500">
              {messages[0]?.date || 'Today, Oct 24'}
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md ${msg.senderId === 'USER' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {msg.type === 'text' && (
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.senderId === 'USER'
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white border border-gray-200 text-slate-700'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                )}
                
                {msg.type === 'file' && msg.file && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{msg.file.name}</p>
                      <p className="text-xs text-slate-400">{msg.file.size} • PDF</p>
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                      <Download size={16} className="text-slate-600" />
                    </button>
                  </div>
                )}

                <div className={`flex items-center gap-2 ${msg.senderId === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  {msg.senderId === 'USER' && msg.status === 'read' && (
                    <CheckCheck size={14} className="text-blue-500" />
                  )}
                  {msg.senderId === 'USER' && msg.status === 'delivered' && (
                    <CheckCheck size={14} className="text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <button className="p-3 bg-gray-100 text-slate-600 rounded-xl hover:bg-gray-200 transition">
              <Paperclip size={20} />
            </button>
            
            <div className="flex-1">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message to your advocate..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            <button 
              onClick={handleSendMessage}
              className="p-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT: Profile & Actions Sidebar --- */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100 text-center">
          <img src={selectedContact.avatar} className="w-24 h-24 rounded-full mx-auto mb-3" alt={selectedContact.name} />
          <h3 className="font-bold text-[#0A1E41] mb-1">{selectedContact.name}</h3>
          <p className="text-sm text-slate-500 mb-2">{selectedContact.specialization}</p>
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-3">
            <span className="text-lg font-bold">★</span>
            <span className="text-sm font-bold">{selectedContact.rating}</span>
            <span className="text-xs text-slate-400">({selectedContact.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Shared Documents */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="font-bold text-[#0A1E41] mb-4 text-sm uppercase tracking-wider">Shared Documents</h4>
          <div className="space-y-3">
            {sharedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <span className={`text-xs font-bold ${
                    doc.type === 'pdf' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {doc.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400">{doc.date} • {doc.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <h4 className="font-bold text-[#0A1E41] mb-4 text-sm uppercase tracking-wider">Actions</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left">
              <Calendar size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Schedule Consultation</span>
            </button>
            
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left">
              <Search size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Search in Conversation</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition text-left">
              <Ban size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-700">Block Advocate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InAppChat;
