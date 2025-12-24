import api from './api.js';

const lawyerService = {
  // NEW: Create lawyer profile (Day 2)
  createProfile: async (profileData) => {
    const response = await api.post('/lawyer/profile', profileData);
    return response.data;
  },

  // Get lawyer profile
  getProfile: async () => {
    const response = await api.get('/lawyer/profile');
    return response.data;
  },

  // Update lawyer availability
  updateAvailability: async (slots) => {
    const response = await api.put('/lawyer/availability', { slots });
    return response.data;
  },

  // Get lawyer's orders/bookings
  getOrders: async () => {
    const response = await api.get('/marketplace/orders');
    return response.data;
  }
};

export default lawyerService;