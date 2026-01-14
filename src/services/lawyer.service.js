import api from './api.js';

const lawyerService = {
  // Lawyer Profile Management
  getProfile: async () => {
    const response = await api.get('/lawyer/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/lawyer/profile', profileData);
    return response.data;
  },

  // Public Lawyer Listings (for "Find a Lawyer" feature)
  getAllLawyers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.specialization) queryParams.append('specialization', filters.specialization);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minRating) queryParams.append('min_rating', filters.minRating);
    if (filters.searchTerm) queryParams.append('search', filters.searchTerm);

    const response = await api.get(`/marketplace/lawyers?${queryParams.toString()}`);
    return response.data.lawyers || [];
  },

  getLawyerById: async (lawyerId) => {
    const response = await api.get(`/marketplace/lawyers/${lawyerId}`);
    return response.data;
  },

  // Earnings & Orders
  getOrders: async () => {
    const response = await api.get('/lawyer/earnings/history');
    return response.data.history || [];
  },

  getEarningsSummary: async () => {
    const response = await api.get('/lawyer/earnings/summary');
    return response.data;
  },

  // Availability Management
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
  },

  // Booking & Consultations
  bookConsultation: async (lawyerId, bookingData) => {
    // Map frontend data to backend expectations
    const payload = {
      advocate_id: lawyerId,
      date: bookingData.date,
      time_slot: bookingData.time,
      service_type: bookingData.service_type || 'consultation',
      notes: bookingData.notes,
      amount: 3000 // Default or fetch from lawyer
    };
    const response = await api.post('/documents/consultations/book', payload);
    return response.data;
  },

  getConsultations: async () => {
    const response = await api.get('/documents/consultations');
    return response.data.consultations || [];
  },

  rescheduleConsultation: async (consultationId, newDate, newTimeSlot, reason) => {
    const payload = {
      consultation_id: consultationId,
      new_date: newDate,
      new_time_slot: newTimeSlot,
      reason: reason
    };
    const response = await api.put(`/documents/consultations/${consultationId}/reschedule`, payload);
    return response.data;
  },

  cancelConsultation: async (consultationId, reason) => {
    const payload = {
      cancellation_reason: reason
    };
    const response = await api.put(`/documents/consultations/${consultationId}/cancel`, payload);
    return response.data;
  }
};

export default lawyerService;
