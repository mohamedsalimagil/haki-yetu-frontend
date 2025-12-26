import api from './api';

const chatService = {
  getContacts: () => {
    return api.get('/chat/contacts');
  },

  getMessages: (partnerId) => {
    return api.get(`/chat/history/${partnerId}`);
  },

  uploadFile: (formData) => {
    return api.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default chatService;
