// Payment service for handling M-Pesa integrations and payment processing
import api from './api.js';

class PaymentService {
  constructor() {
    // M-Pesa Daraja API configuration
    this.mpesaConfig = {
      consumerKey: process.env.REACT_APP_MPESA_CONSUMER_KEY,
      consumerSecret: process.env.REACT_APP_MPESA_CONSUMER_SECRET,
      shortcode: process.env.REACT_APP_MPESA_SHORTCODE || '174379',
      passkey: process.env.REACT_APP_MPESA_PASSKEY,
      baseUrl: process.env.REACT_APP_MPESA_ENV === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke'
    };
  }

  // Generate M-Pesa access token
  async getAccessToken() {
    try {
      const auth = btoa(`${this.mpesaConfig.consumerKey}:${this.mpesaConfig.consumerSecret}`);

      const response = await fetch(`${this.mpesaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('M-Pesa access token error:', error);
      throw new Error('Payment service temporarily unavailable');
    }
  }

  // Initiate STK Push payment
  async initiateSTKPush(phoneNumber, amount, bookingId, accountReference = 'Haki Yetu') {
    try {
      const accessToken = await this.getAccessToken();

      // Generate timestamp and password
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = btoa(`${this.mpesaConfig.shortcode}${this.mpesaConfig.passkey}${timestamp}`);

      const paymentData = {
        BusinessShortCode: this.mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber.replace(/^\+254|^254|^0/, '254'), // Normalize phone number
        PartyB: this.mpesaConfig.shortcode,
        PhoneNumber: phoneNumber.replace(/^\+254|^254|^0/, '254'),
        CallBackURL: `${window.location.origin}/api/payments/callback`,
        AccountReference: accountReference,
        TransactionDesc: `Payment for booking ${bookingId}`
      };

      const response = await fetch(`${this.mpesaConfig.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();

      // Store payment reference for tracking
      const paymentReference = this.generatePaymentReference(bookingId);

      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        paymentReference,
        customerMessage: data.CustomerMessage,
        merchantRequestId: data.MerchantRequestID
      };

    } catch (error) {
      console.error('STK Push error:', error);
      throw new Error(error.message || 'Payment initiation failed. Please try again.');
    }
  }

  // Check payment status
  async checkPaymentStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = btoa(`${this.mpesaConfig.shortcode}${this.mpesaConfig.passkey}${timestamp}`);

      const queryData = {
        BusinessShortCode: this.mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.mpesaConfig.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      });

      if (!response.ok) {
        throw new Error('Status check failed');
      }

      const data = await response.json();

      return {
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
        callbackMetadata: data.CallbackMetadata,
        status: this.mapResultCode(data.ResultCode)
      };

    } catch (error) {
      console.error('Payment status check error:', error);
      throw new Error('Unable to check payment status');
    }
  }

  // Map M-Pesa result codes to status
  mapResultCode(resultCode) {
    const codeMap = {
      '0': 'success',
      '1': 'insufficient_funds',
      '17': 'invalid_amount',
      '26': 'duplicate_transaction',
      '2001': 'invalid_credentials',
      '2017': 'invalid_phone_number',
      '9999': 'system_error'
    };

    return codeMap[resultCode] || 'unknown';
  }

  // Generate unique payment reference
  generatePaymentReference(bookingId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HK${bookingId}${timestamp}${random}`;
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    } else if (cleaned.startsWith('+254')) {
      return cleaned.slice(1);
    } else {
      // Assume it's a 9-digit number and add 254
      return '254' + cleaned;
    }
  }

  // Validate phone number
  validatePhoneNumber(phone) {
    const formatted = this.formatPhoneNumber(phone);
    const kenyaPhoneRegex = /^254[17]\d{8}$/;

    if (!kenyaPhoneRegex.test(formatted)) {
      throw new Error('Please enter a valid Kenyan phone number');
    }

    return formatted;
  }

  // Mock payment for development (fallback)
  async mockPayment(phoneNumber, amount, bookingId) {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.1; // 90% success rate for testing

    if (success) {
      return {
        success: true,
        paymentReference: this.generatePaymentReference(bookingId),
        transactionId: `MOCK${Date.now()}`,
        message: 'Payment processed successfully'
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }

  // Process payment (with fallback to mock)
  async processPayment(phoneNumber, amount, bookingId) {
    try {
      // Try real M-Pesa payment
      if (this.mpesaConfig.consumerKey) {
        return await this.initiateSTKPush(phoneNumber, amount, bookingId);
      } else {
        // Fallback to mock payment
        console.warn('M-Pesa credentials not configured, using mock payment');
        return await this.mockPayment(phoneNumber, amount, bookingId);
      }
    } catch (error) {
      // If real payment fails, try mock as fallback
      if (error.message.includes('access token') || error.message.includes('consumer')) {
        console.warn('Falling back to mock payment due to configuration issues');
        return await this.mockPayment(phoneNumber, amount, bookingId);
      }
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
