import api from './api.js';

const lawyerService = {
  getProfile: async () => {
    const response = await api.get('/lawyer/profile');
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/lawyer/earnings/history');
    return response.data.history || [];
  },

  getEarningsSummary: async () => {
    const response = await api.get('/lawyer/earnings/summary');
    return response.data;
  },

  getAvailability: async () => {
    const response = await api.get('/lawyer/availability');
    return response.data.availability;
  },

  addAvailability: async (slotData) => {
    const response = await api.post('/lawyer/availability', slotData);
    return response.data.slot;
  },

  deleteAvailability: async (slotId) => {
    const response = await api.delete(`/lawyer/availability/${slotId}`);
    return response.data;
  }
};

export default lawyerService;
