// Chat service for handling chat-related API calls and real-time features
import api from './api.js';

// Mock data for development and fallback
const mockMessages = {
  1: [
    {
      id: 1,
      sender: { name: 'Jane Mwangi', role: 'advocate', avatar: null },
      content: 'Hello! Thank you for booking my services. I received your booking request.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isMine: false
    },
    {
      id: 2,
      sender: { name: 'John Doe', role: 'client', avatar: null },
      content: 'Hi Jane! Yes, I need help with property documentation. When can we discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      isMine: true
    },
    {
      id: 3,
      sender: { name: 'Jane Mwangi', role: 'advocate', avatar: null },
      content: 'I\'m available this afternoon at 2 PM. Would that work for you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isMine: false
    },
    {
      id: 4,
      sender: { name: 'John Doe', role: 'client', avatar: null },
      content: 'Perfect! 2 PM works great. I\'ll be ready to discuss the property details.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isMine: true
    },
    {
      id: 5,
      sender: { name: 'Jane Mwangi', role: 'advocate', avatar: null },
      content: 'Excellent! Please prepare any documents you have related to the property. I\'ll review them during our call.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isMine: false
    }
  ],
  2: [
    {
      id: 1,
      sender: { name: 'Michael Oduya', role: 'advocate', avatar: null },
      content: 'Good morning! I noticed you booked my contract drafting service.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isMine: false
    },
    {
      id: 2,
      sender: { name: 'John Doe', role: 'client', avatar: null },
      content: 'Yes, I need a service agreement drafted for my business partnership.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
      isMine: true
    }
  ],
  3: [
    {
      id: 1,
      sender: { name: 'Sarah Wanjiku', role: 'advocate', avatar: null },
      content: 'Hello! Regarding your family law consultation booking.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isMine: false
    }
  ]
};

const chatService = {
  // Get user's conversations (active case assignments)
  getConversations: async () => {
    try {
      // Try to fetch from API first
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to mock data if API fails
      return [
        {
          id: 1,
          participant: {
            name: 'Jane Mwangi',
            role: 'advocate',
            avatar: null
          },
          lastMessage: 'Excellent! Please prepare any documents you have related to the property.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 10),
          unreadCount: 1,
          serviceName: 'Property Dispute Resolution'
        },
        {
          id: 2,
          participant: {
            name: 'Michael Oduya',
            role: 'advocate',
            avatar: null
          },
          lastMessage: 'Yes, I need a service agreement drafted for my business partnership.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          unreadCount: 0,
          serviceName: 'Contract Drafting'
        },
        {
          id: 3,
          participant: {
            name: 'Sarah Wanjiku',
            role: 'advocate',
            avatar: null
          },
          lastMessage: 'Hello! Regarding your family law consultation booking.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
          unreadCount: 0,
          serviceName: 'Family Law Consultation'
        }
      ];
    }
  },

  // Get messages for a specific conversation
  getConversationMessages: async (conversationId) => {
    try {
      // Try to fetch from API first
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      // Fallback to mock data if API fails
      return mockMessages[conversationId] || [];
    }
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, messageData) => {
    try {
      // Try to send via API first
      const response = await api.post(`/chat/conversations/${conversationId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // Simulate successful message send for demo
      const newMessage = {
        id: Date.now(),
        sender: { name: 'John Doe', role: 'client', avatar: null },
        content: messageData.content,
        timestamp: new Date(),
        isMine: true
      };

      // Add to mock data
      if (!mockMessages[conversationId]) {
        mockMessages[conversationId] = [];
      }
      mockMessages[conversationId].push(newMessage);

      return newMessage;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId) => {
    try {
      const response = await api.put(`/chat/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // Simulate successful read marking
      return { success: true };
    }
  },

  // Get conversation details
  getConversationDetails: async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      // Return mock conversation details
      const conversations = await chatService.getConversations();
      return conversations.find(conv => conv.id === conversationId) || null;
    }
  },

  // Format timestamp for display
  formatMessageTime: (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  },

  // Get message bubble styles based on sender
  getMessageBubbleStyles: (isMine) => {
    return {
      container: `flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`,
      bubble: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isMine
          ? 'bg-primary text-white rounded-br-none'
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`,
      timestamp: `text-xs mt-1 ${isMine ? 'text-right' : 'text-left'} ${
        isMine ? 'text-gray-300' : 'text-gray-500'
      }`
    };
  }
};

export default chatService;
