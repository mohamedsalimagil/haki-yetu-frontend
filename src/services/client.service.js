import api from './api.js';

const clientService = {
  // Get client's orders/bookings
  getMyBookings: async () => {
    const response = await api.get('/marketplace/orders');
    return response.data;
  },

  // Get client profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default clientService;
