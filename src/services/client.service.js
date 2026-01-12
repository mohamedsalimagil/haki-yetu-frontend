import api from './api.js';

const clientService = {
  // --- DAY 5: BOOKINGS ---
  /**
   * Fetches all bookings for the logged-in client.
   * Note: Updated to match your current implementation endpoint.
   */
  getMyBookings: async () => {
    const response = await api.get('/api/marketplace/orders');
    return response.data;
  },

  // --- DAY 2: PROFILE ---
  /**
   * Fetches the client's user profile.
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // --- DAY 6: REPUTATION & REVIEWS ---
  /**
   * Submits a star rating and comment for a lawyer after a completed service.
   * @param {Object} reviewData - { lawyer_id, order_id, rating, comment }
   */
  submitReview: async (reviewData) => {
    try {
      const response = await api.post('/api/lawyer/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  },

  /**
   * Fetches the average rating and total review count for a specific lawyer.
   */
  getLawyerRating: async (lawyerId) => {
    const response = await api.get(`/api/lawyer/${lawyerId}/rating`);
    return response.data; // Expected: { average_rating, total_reviews }
  },

  /**
   * Fetches all public reviews/comments for a specific lawyer.
   */
  getLawyerReviews: async (lawyerId) => {
    const response = await api.get(`/api/lawyer/${lawyerId}/reviews`);
    return response.data.reviews || [];
  },

  /**
   * Creates a new dispute for an order.
   * @param {FormData} formData - Contains order_id, category, description, evidence (file)
   */
  createDispute: async (formData) => {
    const response = await api.post('/api/client/disputes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetches all disputes filed by the client.
   */
  getMyDisputes: async () => {
    const response = await api.get('/api/client/disputes/mine');
    return response.data;
  },

  /**
   * Cancel a consultation booking.
   * @param {number} consultationId - The ID of the consultation to cancel
   */
  cancelConsultation: async (consultationId) => {
    const response = await api.post(`/api/documents/consultations/${consultationId}/cancel`);
    return response.data;
  },

  /**
   * Fetches all consultations for the logged-in client.
   */
  getConsultations: async () => {
    const response = await api.get('/api/documents/consultations');
    return response.data.consultations || [];
  }
};

export default clientService;
