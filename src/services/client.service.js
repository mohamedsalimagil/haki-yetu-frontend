import api from './api.js';

const clientService = {
  // --- DAY 5: BOOKINGS ---
  /**
   * Fetches all bookings for the logged-in client.
   * Note: Updated to match your current implementation endpoint.
   */
  getMyBookings: async () => {
    const response = await api.get('/marketplace/orders');
    return response.data;
  },

  // --- DAY 2: PROFILE ---
  /**
   * Fetches the client's user profile.
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // --- DAY 6: REPUTATION & REVIEWS ---
  /**
   * Submits a star rating and comment for a lawyer after a completed service.
   * @param {Object} reviewData - { lawyer_id, order_id, rating, comment }
   */
  submitReview: async (reviewData) => {
    try {
      const response = await api.post('/lawyer/reviews', reviewData);
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
    const response = await api.get(`/lawyer/${lawyerId}/rating`);
    return response.data; // Expected: { average_rating, total_reviews }
  },

  /**
   * Fetches all public reviews/comments for a specific lawyer.
   */
  getLawyerReviews: async (lawyerId) => {
    const response = await api.get(`/lawyer/${lawyerId}/reviews`);
    return response.data.reviews || [];
  }
};

export default clientService;
