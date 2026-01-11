import api from './api';

const bookingService = {
  createBooking: async (data) => {
    // data = { service_id, lawyer_id, date, time }
    const response = await api.post('/marketplace/bookings', data);
    return response.data;
  },

  // Helper to fetch available lawyers for a service (Mock for now)
  getAvailableLawyers: async (serviceId) => {
    // In a real app, you'd fetch lawyers who specialize in this service
    // For now, we return a mock list or fetch all lawyers
    // const response = await api.get(`/marketplace/services/${serviceId}/lawyers`);
    return [
      { id: 1, name: "Advocate Wahome", specialization: "General" },
      { id: 2, name: "Advocate Ochieng", specialization: "Family Law" }
    ];
  }
};

export default bookingService;