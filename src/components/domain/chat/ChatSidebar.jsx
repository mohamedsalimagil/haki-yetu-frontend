import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, User, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chat.service';

const ChatSidebar = ({ onSelectConversation, selectedConversationId }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getConversations();

      // Filter out any self-conversations (where participant.id equals current user)
      const filteredData = (data || []).filter(conv => {
        const participantId = conv.participant?.id;
        return participantId && String(participantId) !== String(user?.id);
      });

      setConversations(filteredData);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Could not load conversations');
      // DO NOT use mock data - show empty state instead
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conversation.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateInput) => {
    if (!dateInput) return '';
    const now = new Date();
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Determine if user is a lawyer or client
  const isLawyer = user?.role === 'lawyer' || user?.role === 'advocate';

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
          <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Search - only show if there are conversations */}
        {conversations.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {isLawyer ? (
                <User className="w-8 h-8 text-gray-400" />
              ) : (
                <Calendar className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isLawyer ? 'No Client Messages' : 'No Conversations'}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {isLawyer
                ? "When clients book your services, you'll be able to chat with them here."
                : "Book a consultation with a lawyer to start a conversation."
              }
            </p>

            {!isLawyer && (
              <a
                href="/advocates"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Find an Advocate →
              </a>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedConversationId === conversation.id ? 'bg-primary/5 dark:bg-primary/10 border-r-2 border-r-primary' : ''
                }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {conversation.participant?.avatar ? (
                    <img
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {getInitials(conversation.participant?.name)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.participant?.name || 'Unknown'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>

                  {conversation.serviceName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {conversation.serviceName}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - only show if there are conversations */}
      {conversations.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <span>{conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
