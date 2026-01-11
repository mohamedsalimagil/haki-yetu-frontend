import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Send, Paperclip, Video, Phone, MoreVertical,
  CheckCheck, Download, Calendar, AlertCircle, Ban, Loader2
} from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const InAppChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Fetch Conversations (Contacts)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const response = await api.get('/chat/conversations');
        // Backend returns list of conversations with partner details
        const conversations = response.data.conversations || [];
        setContacts(conversations);

        // Check if we have a specific partner to select from navigation state
        const targetPartnerId = location.state?.partnerId;
        if (targetPartnerId) {
          // Find or create conversation with this partner
          const existingConvo = conversations.find(
            c => String(c.partner_id) === String(targetPartnerId)
          );
          if (existingConvo) {
            setSelectedContact(existingConvo);
          } else {
            // Create a temporary contact entry for the new conversation
            const partnerName = location.state?.partnerName || 'Lawyer';
            setSelectedContact({
              id: 'new',
              partner_id: targetPartnerId,
              partner_name: partnerName,
              partner_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=1E40AF&color=fff`,
              partner_role: 'lawyer',
              last_message_preview: 'Start a conversation...',
              last_message_time: new Date().toISOString()
            });
          }
        } else if (conversations.length > 0) {
          // Auto-select first contact if no specific partner requested
          setSelectedContact(conversations[0]);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [location.state]);

  // 2. Socket.IO Connection for real-time messaging
  useEffect(() => {
    if (!selectedContact) return;

    const token = localStorage.getItem('token');
    const socketConnection = io('http://localhost:5000', {
      auth: { token }
    });

    socketConnection.on('connect', () => {
      console.log('🔌 Lawyer Chat: Connected to socket server');
      // Join chat room with partner
      socketConnection.emit('join_chat', {
        partner_id: selectedContact.partner_id
      });
    });

    socketConnection.on('receive_message', (message) => {
      console.log('📥 Received message via socket:', message);
      // Add new message to state if it's for this conversation
      const partnerId = selectedContact.partner_id;
      if (String(message.sender_id) === String(partnerId) ||
        String(message.recipient_id) === String(partnerId)) {
        setMessages(prev => {
          // Avoid duplicates by checking if message ID exists
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, {
            id: message.id,
            sender_id: message.sender_id,
            content: message.content || message.message,
            created_at: message.created_at || message.sent_at,
            is_read: message.is_read || false
          }];
        });
      }
    });

    socketConnection.on('disconnect', () => {
      console.log('🔌 Lawyer Chat: Disconnected from socket server');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [selectedContact, user?.id]);

  // 3. Fetch Messages when contact changes (initial load)
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/history/${selectedContact.partner_id}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    // Keep polling as backup (reduced to every 10 seconds since we have socket now)
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const content = messageInput.trim();
    const recipientId = selectedContact.partner_id;

    // Optimistic update
    const newMessage = {
      id: Date.now(), // temporary ID
      sender_id: user.id,
      content: content,
      created_at: new Date().toISOString(),
      is_read: false
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    try {
      // Send via socket for real-time delivery
      if (socket && socket.connected) {
        socket.emit('send_message', {
          recipient_id: recipientId,
          content: content,
          message: content
        });
        console.log('📤 Message sent via socket');
      } else {
        // Fallback to HTTP API
        await api.post('/chat/send', {
          recipient_id: recipientId,
          content: content
        });
        console.log('📤 Message sent via HTTP API');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input value to allow selecting same file again
    e.target.value = '';

    if (!selectedContact) {
      toast.error('Please select a conversation first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('client_id', selectedContact.partner_id);
    formData.append('description', `Shared via chat`);

    setIsUploading(true);
    const toastId = toast.loading('Sharing document...');

    try {
      const response = await api.post('/lawyer/share-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Document shared successfully', { id: toastId });

      // Send a notification message in chat
      const content = `📄 Shared a document: ${file.name}`;
      const recipientId = selectedContact.partner_id;

      // Send via socket
      if (socket && socket.connected) {
        socket.emit('send_message', {
          recipient_id: recipientId,
          content: content,
          message: content
        });
      } else {
        // Fallback HTTP
        await api.post('/chat/send', {
          recipient_id: recipientId,
          content: content
        });
      }

      // Optimistic update for chat UI
      const newMessage = {
        id: Date.now(),
        sender_id: user.id,
        content: content,
        created_at: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, newMessage]);

    } catch (error) {
      console.error('Failed to share document:', error);
      toast.error(error.response?.data?.error || 'Failed to share document', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.partner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#F9FAFB] dark:bg-gray-900 flex overflow-hidden transition-colors">

      {/* --- LEFT: Contacts List --- */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#0A1E41] dark:text-white">Messages</h1>
            <button className="p-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition">
              <Send size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loadingContacts ? (
            <div className="p-4 text-center text-slate-400 text-sm">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">No conversations found.</div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-[#2563EB]' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={contact.partner_avatar || `https://ui-avatars.com/api/?name=${contact.partner_name}`}
                      className="w-12 h-12 rounded-full"
                      alt={contact.partner_name}
                      style={{ filter: 'brightness(0.95)' }}
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-[#0A1E41] dark:text-white truncate">{contact.partner_name}</h3>
                      <span className="text-xs text-slate-400">{new Date(contact.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{contact.last_message_preview}</p>
                  </div>
                  {contact.unread_count > 0 && (
                    <span className="w-5 h-5 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {contact.unread_count}
                    </span>
                  )}
                </div>
              </div>
            )))}
        </div>
      </div>

      {/* --- CENTER: Chat Window --- */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors">
        {!selectedContact ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Send size={48} className="mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedContact.partner_avatar || `https://ui-avatars.com/api/?name=${selectedContact.partner_name}`}
                    className="w-12 h-12 rounded-full"
                    alt={selectedContact.partner_name}
                  />
                </div>
                <div>
                  <h2 className="font-bold text-[#0A1E41] dark:text-white">{selectedContact.partner_name}</h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{selectedContact.partner_role || 'User'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <Video size={18} />
                </button>
                <button className="p-2.5 bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <Phone size={18} />
                </button>
              </div>
            </div>

            {/* Session Notice */}
            <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                <AlertCircle size={14} className="inline mr-1" />
                Communications on Haki Yetu are secure and privileged.
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((msg, index) => {
                const isMe = String(msg.sender_id) === String(user.id);
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${isMe
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-200'
                          }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>

                      <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <CheckCheck size={14} className={msg.is_read ? "text-blue-500" : "text-slate-400"} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
              <div className="flex items-end gap-3">
                <input
                  type="file"
                  id="chat-file-upload"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
                <label
                  htmlFor="chat-file-upload"
                  className={`p-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  title="Share Document"
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
                </label>

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
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
          </>
        )}
      </div>

    </div>
  );
};

export default InAppChat;
