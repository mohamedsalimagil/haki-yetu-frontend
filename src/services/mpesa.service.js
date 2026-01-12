import api from './api.js';

/**
 * M-Pesa Service - Handles M-Pesa STK Push and payment verification
 *
 * Test Environment Credentials:
 * - Consumer Key: Get from https://developer.safaricom.co.ke
 * - Consumer Secret: Get from https://developer.safaricom.co.ke
 * - Passkey: Provided by Safaricom for test environment
 * - Business Short Code: 174379 (Sandbox)
 *
 * Test Phone Numbers:
 * - 254708374149 (Always succeeds)
 * - 254711XXXXX (Always fails)
 */

const mpesaService = {
  /**
   * Initiates an M-Pesa STK Push request
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.phone_number - Phone number in format 254XXXXXXXXX
   * @param {number} paymentData.amount - Amount to charge
   * @param {string} paymentData.booking_id - Booking reference
   * @param {string} paymentData.account_reference - Account reference (e.g., 'HakiYetu')
   * @param {string} paymentData.transaction_desc - Transaction description
   * @returns {Promise<Object>} Payment response with checkout request ID
   */
  initiateSTKPush: async (paymentData) => {
    try {
      const response = await api.post('/api/payment/mpesa/stk-push', {
        phone_number: formatPhoneNumber(paymentData.phone_number),
        amount: Math.round(paymentData.amount), // M-Pesa requires whole numbers
        booking_id: paymentData.booking_id,
        account_reference: paymentData.account_reference || 'HakiYetu',
        transaction_desc: paymentData.transaction_desc || 'Consultation Payment'
      });

      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error);
      throw error;
    }
  },

  /**
   * Checks the status of an M-Pesa transaction
   * @param {string} checkoutRequestID - The checkout request ID from STK Push
   * @returns {Promise<Object>} Transaction status
   */
  checkTransactionStatus: async (checkoutRequestID) => {
    try {
      const response = await api.get(`/api/payment/mpesa/status/${checkoutRequestID}`);
      return response.data;
    } catch (error) {
      console.error('M-Pesa Status Check Error:', error);
      throw error;
    }
  },

  /**
   * Polls for payment status with timeout
   * @param {string} checkoutRequestID - The checkout request ID
   * @param {number} maxAttempts - Maximum polling attempts (default: 30)
   * @param {number} intervalMs - Interval between polls in ms (default: 2000)
   * @returns {Promise<Object>} Final payment status
   */
  pollPaymentStatus: async (checkoutRequestID, maxAttempts = 30, intervalMs = 2000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await mpesaService.checkTransactionStatus(checkoutRequestID);

        // Check if payment is complete
        if (status.ResultCode === '0') {
          return {
            success: true,
            status: 'completed',
            message: 'Payment successful',
            data: status
          };
        }

        // Check if payment failed
        if (status.ResultCode && status.ResultCode !== '0') {
          return {
            success: false,
            status: 'failed',
            message: status.ResultDesc || 'Payment failed',
            data: status
          };
        }

        // Payment still pending, wait before next attempt
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      } catch (error) {
        // If it's the last attempt, throw the error
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        // Otherwise, wait and try again
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    // Timeout reached
    return {
      success: false,
      status: 'timeout',
      message: 'Payment verification timed out. Please check your M-Pesa messages.'
    };
  },

  /**
   * Processes complete payment flow (initiate + poll for result)
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Final payment result
   */
  processPayment: async (paymentData) => {
    try {
      // Step 1: Initiate STK Push
      const stkResponse = await mpesaService.initiateSTKPush(paymentData);

      if (!stkResponse.CheckoutRequestID) {
        throw new Error('Failed to initiate M-Pesa payment');
      }

      // Step 2: Poll for payment status
      const result = await mpesaService.pollPaymentStatus(
        stkResponse.CheckoutRequestID,
        30, // Max 30 attempts
        2000 // Check every 2 seconds
      );

      return {
        ...result,
        checkoutRequestID: stkResponse.CheckoutRequestID,
        merchantRequestID: stkResponse.MerchantRequestID
      };
    } catch (error) {
      console.error('M-Pesa Payment Processing Error:', error);
      throw error;
    }
  },

  /**
   * Validates M-Pesa transaction
   * @param {string} transactionId - M-Pesa transaction ID (e.g., OEI2AK4Q16)
   * @returns {Promise<Object>} Validation result
   */
  validateTransaction: async (transactionId) => {
    try {
      const response = await api.get(`/api/payment/mpesa/validate/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('M-Pesa Validation Error:', error);
      throw error;
    }
  },

  /**
   * Refunds an M-Pesa payment (for cancellations)
   * @param {Object} refundData - Refund details
   * @param {string} refundData.transaction_id - Original M-Pesa transaction ID
   * @param {number} refundData.amount - Amount to refund
   * @param {string} refundData.reason - Refund reason
   * @returns {Promise<Object>} Refund result
   */
  refundPayment: async (refundData) => {
    try {
      const response = await api.post('/api/payment/mpesa/refund', refundData);
      return response.data;
    } catch (error) {
      console.error('M-Pesa Refund Error:', error);
      throw error;
    }
  }
};

/**
 * Formats phone number to M-Pesa format (254XXXXXXXXX)
 * @param {string} phone - Phone number in various formats
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    // Already in correct format
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    // Add country code
    cleaned = '254' + cleaned;
  }

  return cleaned;
}

/**
 * Validates phone number format for M-Pesa
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidMpesaPhone(phone) {
  const formatted = formatPhoneNumber(phone);
  // M-Pesa phone numbers should be 12 digits starting with 254
  return /^254[17]\d{8}$/.test(formatted);
}

export default mpesaService;
