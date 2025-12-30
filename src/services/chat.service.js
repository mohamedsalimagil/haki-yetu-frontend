// Chat service for handling chat-related API calls
import api from './api.js';

const chatService = {
  // Get user's conversations (active case assignments)
  getConversations: async () => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  getConversationMessages: async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, messageData) => {
    try {
      const response = await api.post(`/chat/conversations/${conversationId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId) => {
    try {
      const response = await api.put(`/chat/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Get conversation details
  getConversationDetails: async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  }
};

export default chatService;
