import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, MessageCircle, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chat.service';

const ChatWindow = ({ selectedConversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages via API
  useEffect(() => {
    if (selectedConversation && selectedConversation.participant) {
      setLoading(true);
      setMessages([]);
      const partnerId = selectedConversation.participant.id;
      chatService.getConversationMessages(partnerId)
        .then(msgs => {
          const formatted = (msgs || []).map(m => ({
            id: m.id,
            content: m.message || m.content,
            senderId: m.sender_id,
            timestamp: m.sent_at || m.created_at,
            isMine: String(m.sender_id) === String(user?.id)
          }));
          setMessages(formatted);
        })
        .catch(err => console.error("Error loading messages", err))
        .finally(() => setLoading(false));
    }
  }, [selectedConversation, user?.id]);

  useEffect(() => {
    if (!selectedConversation) return;

    const token = localStorage.getItem('token');
    const socketConnection = io('http://localhost:5000', {
      auth: { token }
    });

    socketConnection.on('connect', () => {
      console.log('Connected to chat server');
      socketConnection.emit('join_chat', {
        partner_id: selectedConversation.participant.id
      });
    });

    socketConnection.on('receive_message', (message) => {
      setMessages(prev => [...prev, {
        id: message.id,
        content: message.message || message.content,
        senderId: message.sender_id,
        timestamp: message.created_at,
        isMine: message.sender_id === user?.id
      }]);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [selectedConversation, user?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedConversation) return;

    const recipientId = selectedConversation.participant.id;
    const content = newMessage.trim();

    try {
      socket.emit('send_message', {
        content,
        recipient_id: recipientId,
        message: content
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Empty state - no conversation selected
  if (!selectedConversation) {
    return (
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Messages</h3>
          <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const participant = selectedConversation.participant;
  const isLawyer = participant.role === 'lawyer' || participant.role === 'advocate';

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {/* Chat Header - Clear display of who you're chatting with */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {participant.avatar ? (
                <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                participant.name?.charAt(0).toUpperCase()
              )}
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>

          {/* Name and role */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {participant.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {isLawyer ? (
                <>
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Advocate
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Client
                </>
              )}
              {selectedConversation.serviceName && (
                <span className="text-gray-400 ml-2">• {selectedConversation.serviceName}</span>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${message.isMine
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                    }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Clean and simple */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
