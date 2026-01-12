# M-Pesa Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Sandbox Credentials (2 minutes)

1. Go to [https://developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Sign up or login
3. Click "My Apps" → "Create New App"
4. Select "Lipa Na M-Pesa Online"
5. Copy your credentials:

```
Consumer Key: [Your Key Here]
Consumer Secret: [Your Secret Here]
Business Short Code: 174379 (Sandbox default)
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

### Step 2: Configure Backend (1 minute)

Create `.env` file in your backend:

```bash
# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://yourdomain.com/api/payment/mpesa/callback
MPESA_ENVIRONMENT=sandbox
```

### Step 3: Install Backend Code (1 minute)

Copy the Python implementation from [MPESA_INTEGRATION_GUIDE.md](MPESA_INTEGRATION_GUIDE.md#backend-implementation) sections 3 and 4.

Files to create:
- `backend/mpesa_service.py` - M-Pesa service class
- `backend/routes/mpesa.py` - Flask routes

### Step 4: Test the Integration (1 minute)

Use the test phone number that always succeeds:

```
Phone: 254708374149
```

1. Go to booking checkout page
2. Enter phone number: `254708374149`
3. Click "Pay with M-Pesa"
4. Check phone for STK Push prompt
5. Enter PIN: `1234` (sandbox PIN)
6. Wait for confirmation

## 🧪 Testing Scenarios

### ✅ Success Scenario
```
Phone: 254708374149
PIN: 1234
Result: Payment succeeds immediately
```

### ❌ Failure Scenarios

**User Cancellation:**
```
Phone: 254711XXXXX
Action: Cancel the prompt
Result: Payment fails with "Request cancelled by user"
```

**Insufficient Funds:**
```
Phone: 254708374149
Action: Wait for prompt, don't enter PIN
Result: Transaction times out after 60 seconds
```

## 📱 Frontend Usage

The frontend is already integrated! Just ensure your backend endpoints are working:

```javascript
// Already implemented in src/services/mpesa.service.js
import mpesaService from '../../services/mpesa.service';

// Process payment
const result = await mpesaService.processPayment({
  phone_number: '254708374149',
  amount: 3000,
  booking_id: '123',
  account_reference: 'HakiYetu',
  transaction_desc: 'Consultation Payment'
});
```

## 🔍 Verify Backend Endpoints

Test your backend manually:

```bash
# 1. Test STK Push
curl -X POST http://localhost:5000/api/payment/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "254708374149",
    "amount": 100,
    "booking_id": "test123",
    "account_reference": "HakiYetu",
    "transaction_desc": "Test Payment"
  }'

# Expected Response:
# {
#   "CheckoutRequestID": "ws_CO_11012026...",
#   "MerchantRequestID": "12345-67890-1",
#   "ResponseCode": "0",
#   "ResponseDescription": "Success. Request accepted for processing"
# }

# 2. Check Payment Status
curl http://localhost:5000/api/payment/mpesa/status/ws_CO_11012026...
```

## ⚠️ Common Issues & Solutions

### Issue: "Invalid Access Token"
**Solution:** Check your Consumer Key and Secret

### Issue: "Bad Request - Invalid ShortCode"
**Solution:** Use `174379` for sandbox

### Issue: "Callback not working"
**Solution:**
- For local testing, use ngrok: `ngrok http 5000`
- Update MPESA_CALLBACK_URL to ngrok URL

### Issue: "Request Timeout"
**Solution:** Normal in sandbox. User has 60 seconds to complete payment.

## 🌐 Expose Local Server (For Testing Callbacks)

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update .env:
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payment/mpesa/callback
```

## 📊 Monitor Payments

View payment logs in your backend:

```python
# In your Flask app
@app.route('/api/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    return jsonify([{
        'id': p.id,
        'booking_id': p.booking_id,
        'amount': p.amount,
        'phone_number': p.phone_number,
        'status': p.status,
        'created_at': p.created_at.isoformat()
    } for p in payments])
```

## 🎯 Next Steps

1. ✅ Test with sandbox phone number
2. ✅ Verify callback URL is reachable
3. ✅ Check database for payment records
4. ✅ Test failure scenarios
5. 📝 Document your findings
6. 🚀 Apply for production credentials

## 📚 Full Documentation

For complete details, see [MPESA_INTEGRATION_GUIDE.md](MPESA_INTEGRATION_GUIDE.md)

## 🆘 Need Help?

- Safaricom Support: apisupport@safaricom.co.ke
- Developer Portal: https://developer.safaricom.co.ke/support
- Check Status: https://developer.safaricom.co.ke/status

---

**Ready to test?**

1. Start your backend: `python app.py`
2. Start your frontend: `npm run dev`
3. Go to: `http://localhost:5173/consultation/book/14`
4. Use phone: `254708374149`
5. Enter PIN: `1234`

✨ **You're all set!**
