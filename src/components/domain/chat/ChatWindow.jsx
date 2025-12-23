import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, MessageCircle } from 'lucide-react';
import chatService from '../../../services/chat.service';

const ChatWindow = ({ selectedConversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedConversation) return;

    try {
      setLoading(true);
      const data = await chatService.getConversationMessages(selectedConversation.id);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock data if API fails
      const mockMessages = [
        {
          id: 1,
          sender: {
            name: selectedConversation.participant.name,
            role: selectedConversation.participant.role,
            avatar: null
          },
          content: 'Hello! I received your booking request for the legal consultation.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isMine: false
        },
        {
          id: 2,
          sender: {
            name: 'You',
            role: 'client',
            avatar: null
          },
          content: 'Thank you for accepting my request. I need help with understanding my rights regarding property ownership.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
          isMine: true
        },
        {
          id: 3,
          sender: {
            name: selectedConversation.participant.name,
            role: selectedConversation.participant.role,
            avatar: null
          },
          content: 'I understand. Please provide me with the property details and any relevant documents you have.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
          isMine: false
        },
        {
          id: 4,
          sender: {
            name: 'You',
            role: 'client',
            avatar: null
          },
          content: 'I will upload the documents shortly. Also, I have some questions about the process.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isMine: true
        },
        {
          id: 5,
          sender: {
            name: selectedConversation.participant.name,
            role: selectedConversation.participant.role,
            avatar: null
          },
          content: 'Thank you for your response.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isMine: false
        }
      ];
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      content: newMessage.trim()
    };

    try {
      await chatService.sendMessage(selectedConversation.id, messageData);

      // Optimistically add message to UI
      const newMsg = {
        id: Date.now(),
        sender: {
          name: 'You',
          role: 'client', // This should come from auth context
          avatar: null
        },
        content: newMessage.trim(),
        timestamp: new Date(),
        isMine: true
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p>Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
              {selectedConversation.participant.avatar ? (
                <img
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {getInitials(selectedConversation.participant.name)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {selectedConversation.participant.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.serviceName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMine
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isMine ? 'text-primary-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
