# M-Pesa Integration Guide - Safaricom Daraja API

## Overview
This guide provides complete instructions for integrating M-Pesa STK Push (Lipa Na M-Pesa Online) into the Haki Yetu platform using the Safaricom Daraja API test environment.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Test Environment Setup](#test-environment-setup)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Going Live](#going-live)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Safaricom Developer Account
- Test phone number (Safaricom line)
- Backend server (Python/Flask or Node.js)
- SSL Certificate (required for callbacks)

### Step 1: Register on Safaricom Developer Portal

1. Visit [https://developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an account or sign in
3. Navigate to **"My Apps"**
4. Click **"Create New App"**
5. Select **"Lipa Na M-Pesa Online"** (STK Push)

### Step 2: Get Your Credentials

After creating your app, you'll receive:

```
Consumer Key: e.g., 9v38Dtu5u2BpsITPmLcXNWGMsjZRWSTG
Consumer Secret: e.g., bclwIPrFARfg8k0L
Business Short Code: 174379 (Sandbox)
Passkey: Get from the test credentials page
```

**Save these credentials securely!**

---

## Test Environment Setup

### Test Credentials (Sandbox)

```bash
# M-Pesa Sandbox Credentials
BASE_URL=https://sandbox.safaricom.co.ke
CONSUMER_KEY=your_consumer_key_here
CONSUMER_SECRET=your_consumer_secret_here
BUSINESS_SHORT_CODE=174379
PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
CALLBACK_URL=https://yourdomain.com/api/payment/mpesa/callback
```

### Test Phone Numbers

Use these phone numbers for testing:

✅ **Success Case:**
```
254708374149
```
This number will always complete the transaction successfully.

❌ **Failure Case:**
```
254711XXXXX
```
Numbers starting with 254711 will fail (simulate user cancellation).

---

## Backend Implementation

### Option 1: Python/Flask Implementation

#### 1. Install Dependencies

```bash
pip install requests flask python-dotenv
```

#### 2. Create `.env` File

```bash
# .env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://yourdomain.com/api/payment/mpesa/callback
MPESA_ENVIRONMENT=sandbox  # or 'production'
```

#### 3. Create `mpesa_service.py`

```python
import requests
import base64
from datetime import datetime
from flask import current_app
import os

class MPesaService:
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.business_short_code = os.getenv('MPESA_BUSINESS_SHORT_CODE', '174379')
        self.passkey = os.getenv('MPESA_PASSKEY')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL')
        self.environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')

        # Set base URL based on environment
        if self.environment == 'production':
            self.base_url = 'https://api.safaricom.co.ke'
        else:
            self.base_url = 'https://sandbox.safaricom.co.ke'

    def get_access_token(self):
        """
        Generates M-Pesa access token
        """
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"

        # Create basic auth string
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        encoded_auth = base64.b64encode(auth_string.encode()).decode('utf-8')

        headers = {
            'Authorization': f'Basic {encoded_auth}'
        }

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()['access_token']
        except Exception as e:
            print(f"Error getting access token: {e}")
            raise

    def generate_password(self):
        """
        Generates password for STK Push
        Format: base64(ShortCode + Passkey + Timestamp)
        """
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        data_to_encode = f"{self.business_short_code}{self.passkey}{timestamp}"
        encoded = base64.b64encode(data_to_encode.encode()).decode('utf-8')
        return encoded, timestamp

    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """
        Initiates STK Push request
        """
        access_token = self.get_access_token()
        password, timestamp = self.generate_password()

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            "BusinessShortCode": self.business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.business_short_code,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            return response.json()
        except Exception as e:
            print(f"STK Push Error: {e}")
            raise

    def query_transaction_status(self, checkout_request_id):
        """
        Queries the status of an STK Push transaction
        """
        access_token = self.get_access_token()
        password, timestamp = self.generate_password()

        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            "BusinessShortCode": self.business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            return response.json()
        except Exception as e:
            print(f"Query Error: {e}")
            raise

# Initialize service
mpesa_service = MPesaService()
```

#### 4. Create Flask Routes

```python
from flask import Blueprint, request, jsonify
from .mpesa_service import mpesa_service
from .models import Payment, Booking
from . import db

mpesa_bp = Blueprint('mpesa', __name__, url_prefix='/api/payment/mpesa')

@mpesa_bp.route('/stk-push', methods=['POST'])
def initiate_stk_push():
    """
    Initiates M-Pesa STK Push
    """
    try:
        data = request.json
        phone_number = data.get('phone_number')
        amount = data.get('amount')
        booking_id = data.get('booking_id')
        account_reference = data.get('account_reference', 'HakiYetu')
        transaction_desc = data.get('transaction_desc', 'Consultation Payment')

        # Validate inputs
        if not phone_number or not amount or not booking_id:
            return jsonify({'error': 'Missing required fields'}), 400

        # Initiate STK Push
        result = mpesa_service.stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )

        # Save payment record
        payment = Payment(
            booking_id=booking_id,
            amount=amount,
            phone_number=phone_number,
            checkout_request_id=result.get('CheckoutRequestID'),
            merchant_request_id=result.get('MerchantRequestID'),
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mpesa_bp.route('/status/<checkout_request_id>', methods=['GET'])
def check_status(checkout_request_id):
    """
    Checks payment status
    """
    try:
        result = mpesa_service.query_transaction_status(checkout_request_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mpesa_bp.route('/callback', methods=['POST'])
def mpesa_callback():
    """
    Handles M-Pesa callback
    """
    try:
        data = request.json
        print("M-Pesa Callback:", data)

        # Extract callback data
        callback_data = data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = callback_data.get('CheckoutRequestID')
        result_code = callback_data.get('ResultCode')
        result_desc = callback_data.get('ResultDesc')

        # Find payment record
        payment = Payment.query.filter_by(
            checkout_request_id=checkout_request_id
        ).first()

        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        # Update payment status
        if result_code == 0:
            # Payment successful
            payment.status = 'completed'
            payment.mpesa_receipt_number = callback_data.get('CallbackMetadata', {}).get('Item', [])[1].get('Value')
            payment.transaction_date = callback_data.get('CallbackMetadata', {}).get('Item', [])[3].get('Value')

            # Update booking status
            booking = Booking.query.get(payment.booking_id)
            if booking:
                booking.payment_status = 'paid'
                booking.status = 'confirmed'
        else:
            # Payment failed
            payment.status = 'failed'
            payment.failure_reason = result_desc

        db.session.commit()

        return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'}), 200

    except Exception as e:
        print(f"Callback Error: {e}")
        return jsonify({'error': str(e)}), 500
```

---

## Frontend Integration

### Using the M-Pesa Service

Update your [BookingCheckout.jsx](src/pages/consultation/BookingCheckout.jsx):

```jsx
import mpesaService from '../../services/mpesa.service';

const handlePayment = async () => {
  setLoading(true);
  setError(null);

  try {
    // Step 1: Create booking
    const bookingResponse = await api.post('/api/documents/consultations/book', {
      advocate_id: advocate.id,
      date: date.toISOString(),
      time: slot.time,
      consultation_type: consultationType,
      duration: 30
    });

    const bookingId = bookingResponse.data.booking_id;

    // Step 2: Process M-Pesa payment
    const paymentResult = await mpesaService.processPayment({
      phone_number: phoneNumber,
      amount: total,
      booking_id: bookingId,
      account_reference: 'HakiYetu',
      transaction_desc: `Consultation with ${advocate.name}`
    });

    if (paymentResult.success) {
      // Payment successful
      navigate('/consultation/confirmation', {
        state: {
          advocate,
          date,
          slot,
          consultationType,
          bookingId,
          amount: total,
          mpesaReceipt: paymentResult.data.mpesa_receipt_number
        }
      });
    } else {
      // Payment failed
      setError(paymentResult.message || 'Payment failed');
    }
  } catch (err) {
    console.error('Payment error:', err);
    setError(err.response?.data?.message || 'Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## Testing

### Step 1: Test STK Push

Use the sandbox test phone number:
```
254708374149
```

### Step 2: Expected Flow

1. User enters phone number
2. User clicks "Pay with M-Pesa"
3. STK Push is sent to user's phone
4. User enters M-Pesa PIN on phone
5. Payment is processed
6. Callback is received
7. Payment status is updated
8. User is redirected to confirmation page

### Step 3: Testing Commands

```bash
# Test with curl
curl -X POST http://localhost:5000/api/payment/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "254708374149",
    "amount": 3000,
    "booking_id": "123",
    "account_reference": "HakiYetu",
    "transaction_desc": "Test Payment"
  }'
```

### Response Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Insufficient funds |
| 1032 | Request cancelled by user |
| 1037 | DS timeout (user took too long) |
| 2001 | Wrong PIN entered |

---

## Going Live

### Step 1: Get Production Credentials

1. Contact Safaricom via [developer support](https://developer.safaricom.co.ke/support)
2. Request production credentials
3. Provide:
   - Till Number or Paybill Number
   - Business Registration documents
   - KRA PIN Certificate

### Step 2: Update Environment Variables

```bash
# Production .env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=your_production_key
MPESA_CONSUMER_SECRET=your_production_secret
MPESA_BUSINESS_SHORT_CODE=your_paybill_or_till
MPESA_PASSKEY=your_production_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payment/mpesa/callback
```

### Step 3: SSL Certificate

**Required for production!**
- Callback URL must use HTTPS
- Get SSL certificate from Let's Encrypt or your hosting provider

### Step 4: Go Live Checklist

- [ ] Production credentials obtained
- [ ] SSL certificate installed
- [ ] Callback URL is publicly accessible
- [ ] Database has payment tables
- [ ] Error logging is set up
- [ ] Customer support is ready
- [ ] Refund process is defined
- [ ] Testing completed with real transactions

---

## Troubleshooting

### Issue: "Invalid Access Token"

**Solution:**
```python
# Regenerate token
access_token = mpesa_service.get_access_token()
```

### Issue: "Request Timeout"

**Cause:** User took too long to enter PIN

**Solution:** Inform user to check their phone and retry

### Issue: "Callback Not Received"

**Check:**
1. Is callback URL publicly accessible?
2. Is URL using HTTPS?
3. Check firewall settings
4. Verify callback URL in M-Pesa portal

### Issue: "Insufficient Funds"

**Solution:** User needs to top up M-Pesa account

### Common Error Codes

```python
ERROR_CODES = {
    '0': 'Success',
    '1': 'Insufficient Funds',
    '1032': 'Cancelled by user',
    '1037': 'Timeout',
    '1': 'The balance is insufficient for the transaction',
    '2001': 'Wrong PIN',
    '1001': 'Unable to lock subscriber',
    '1019': 'Transaction expired'
}
```

---

## Security Best Practices

1. **Never expose credentials** in frontend code
2. **Always validate** phone numbers and amounts on backend
3. **Use HTTPS** for all API calls
4. **Implement rate limiting** to prevent abuse
5. **Log all transactions** for audit purposes
6. **Encrypt sensitive data** in database
7. **Set up monitoring** for failed transactions
8. **Implement retry logic** for network failures

---

## Resources

- [Safaricom Daraja API Documentation](https://developer.safaricom.co.ke/docs)
- [M-Pesa STK Push Guide](https://developer.safaricom.co.ke/lipa-na-m-pesa-online)
- [Test Credentials](https://developer.safaricom.co.ke/test_credentials)
- [Support](https://developer.safaricom.co.ke/support)

---

## Support

For issues or questions:
1. Check [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Email: apisupport@safaricom.co.ke
3. Phone: +254 722 000 000

---

**Last Updated**: January 11, 2026
**Version**: 2.0.0
