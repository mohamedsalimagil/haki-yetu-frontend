import api from './api.js';

const lawyerService = {
  // Lawyer Profile Management
  getProfile: async () => {
    const response = await api.get('/api/lawyer/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/lawyer/profile', profileData);
    return response.data;
  },

  // Public Lawyer Listings (for "Find a Lawyer" feature)
  getAllLawyers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.specialization) queryParams.append('specialization', filters.specialization);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minRating) queryParams.append('min_rating', filters.minRating);
    if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
    
    const response = await api.get(`/api/lawyers?${queryParams.toString()}`);
    return response.data.lawyers || [];
  },

  getLawyerById: async (lawyerId) => {
    const response = await api.get(`/api/lawyers/${lawyerId}`);
    return response.data;
  },

  // Earnings & Orders
  getOrders: async () => {
    const response = await api.get('/api/lawyer/earnings/history');
    return response.data.history || [];
  },

  getEarningsSummary: async () => {
    const response = await api.get('/api/lawyer/earnings/summary');
    return response.data;
  },

  // Availability Management
  getAvailability: async () => {
    const response = await api.get('/api/lawyer/availability');
    return response.data.availability;
  },

  addAvailability: async (slotData) => {
    const response = await api.post('/api/lawyer/availability', slotData);
    return response.data.slot;
  },

  deleteAvailability: async (slotId) => {
    const response = await api.delete(`/api/lawyer/availability/${slotId}`);
    return response.data;
  },

  // Booking & Consultations
  bookConsultation: async (lawyerId, bookingData) => {
    const response = await api.post(`/api/lawyers/${lawyerId}/book`, bookingData);
    return response.data;
  }
};

export default lawyerService;
