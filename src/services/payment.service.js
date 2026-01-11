import api from './api';

const paymentService = {
  // Trigger the Payment
  initiateMpesa: async (bookingId, phoneNumber) => {
    // Matches your backend route: /payments/stk-push
    const response = await api.post('/marketplace/payments/stk-push', {
      booking_id: bookingId,
      phone: phoneNumber
    });
    return response.data;
  },

  // Check Status (Your backend auto-completes it here)
  checkStatus: async (requestId) => {
    // Matches your backend route: /payments/status/<id>
    const response = await api.get(`/marketplace/payments/status/${requestId}`);
    return response.data;
  }
};

export default paymentService;