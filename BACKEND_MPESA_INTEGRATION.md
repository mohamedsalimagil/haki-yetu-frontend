# Backend M-Pesa Integration - Complete Guide

## Overview

This guide documents the complete M-Pesa integration for the Haki Yetu consultation booking system. The integration connects the existing Daraja API implementation with the consultation booking flow, allowing clients to pay for consultations via M-Pesa STK Push.

---

## What Was Implemented

### ✅ 1. Payment Model (`app/payments/models.py`)

Created a new Payment model to track M-Pesa transactions:

```python
class Payment(db.Model):
    __tablename__ = 'payments'

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    consultation_id = db.Column(db.Integer, db.ForeignKey('consultations.id'))
    amount = db.Column(db.Numeric(10, 2))

    # M-Pesa identifiers
    checkout_request_id = db.Column(db.String(100), unique=True, index=True)
    merchant_request_id = db.Column(db.String(100), index=True)
    mpesa_receipt_number = db.Column(db.String(50), index=True)

    # Status tracking
    status = db.Column(db.String(20), default='pending', index=True)
    result_code = db.Column(db.Integer)
    result_desc = db.Column(db.Text)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_date = db.Column(db.DateTime)
```

**Status Values:**
- `pending` - Payment initiated, waiting for customer input
- `completed` - Payment successful
- `failed` - Payment failed or cancelled
- `cancelled` - Payment cancelled by system

---

### ✅ 2. Updated Routes (`app/payments/daraja.py`)

#### **Route 1: POST `/api/payment/mpesa/stk-push`**

Initiates STK Push and creates payment record.

**Request:**
```json
{
  "phone_number": "254708374149",
  "amount": 3000,
  "booking_id": 1,
  "account_reference": "HakiYetu",
  "transaction_desc": "Consultation Payment"
}
```

**Response (Success):**
```json
{
  "success": true,
  "CheckoutRequestID": "ws_CO_12012026103045789",
  "MerchantRequestID": "12345-67890-1",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Payment request sent. Please check your phone."
}
```

**Flow:**
1. Validates phone number format (254XXXXXXXXX)
2. Verifies consultation exists
3. Checks for duplicate payments
4. Initiates M-Pesa STK Push
5. Creates Payment record in database
6. Returns checkout request ID to frontend

---

#### **Route 2: GET `/api/payment/mpesa/status/<checkout_request_id>`**

Checks payment status (used by frontend polling).

**Response:**
```json
{
  "CheckoutRequestID": "ws_CO_12012026103045789",
  "ResultCode": "0",
  "ResultDesc": "The service request is processed successfully",
  "status": "completed",
  "mpesa_receipt_number": "OEI2AK4Q16"
}
```

**Flow:**
1. Queries Payment table for checkout_request_id
2. If status is `pending`, queries M-Pesa API for latest status
3. Updates Payment and Consultation status if changed
4. Returns current status

**Result Codes:**
- `0` - Success
- `1032` - Request in progress
- Other codes - Payment failed

---

#### **Route 3: POST `/api/payment/mpesa/callback`**

Handles M-Pesa callback (webhook from Safaricom).

**Callback Payload:**
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "12345-67890-1",
      "CheckoutRequestID": "ws_CO_12012026103045789",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 3000},
          {"Name": "MpesaReceiptNumber", "Value": "OEI2AK4Q16"},
          {"Name": "TransactionDate", "Value": 20260112103045},
          {"Name": "PhoneNumber", "Value": 254708374149}
        ]
      }
    }
  }
}
```

**Flow:**
1. Verifies callback source (IP whitelist)
2. Checks for duplicate callbacks (idempotency)
3. Finds Payment record by checkout_request_id
4. Extracts M-Pesa receipt number and transaction date
5. Updates Payment status to `completed` or `failed`
6. Updates Consultation `payment_status` and `status`
7. Commits to database
8. Acknowledges callback

**Consultation Status Updates:**
- **Success:** `payment_status='Paid'`, `status='Confirmed'`
- **Failure:** `payment_status='Failed'`, `status` unchanged

---

### ✅ 3. Database Migration

**File:** `migrations/versions/add_payment_model.py`

Creates the `payments` table with:
- Foreign key to `consultations.id`
- Unique index on `checkout_request_id`
- Indexes on `status`, `created_at`, `transaction_date`

**To Apply Migration:**
```bash
cd /home/mike/haki-yetu-b-private
source venv/bin/activate

# Check migration heads (if multiple, merge first)
flask db heads

# Apply migration
flask db upgrade
```

If there are multiple heads, you'll need to merge them first:
```bash
flask db merge heads -m "Merge migrations"
flask db upgrade
```

---

## Configuration

### Environment Variables

**File:** `/home/mike/haki-yetu-b-private/.env`

```bash
# M-Pesa Daraja API Configuration
SAFARICOM_BASE=https://sandbox.safaricom.co.ke
SAFARICOM_CONSUMER_KEY=your_consumer_key_here
SAFARICOM_CONSUMER_SECRET=your_consumer_secret_here
SAFARICOM_SHORTCODE=174379
SAFARICOM_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# Callback URL (use ngrok for local testing)
CALLBACK_URL_BASE=https://your-ngrok-url.ngrok.io

# Environment
FLASK_ENV=development
```

### Sandbox Credentials

**Consumer Key:** Get from [Safaricom Developer Portal](https://developer.safaricom.co.ke)
**Consumer Secret:** Get from Safaricom Developer Portal
**Business Short Code:** `174379` (sandbox default)
**Passkey:** `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
**Test Phone:** `254708374149`
**Test PIN:** `1234`

---

## Testing

### 1. Local Testing with Ngrok

M-Pesa callbacks require a publicly accessible HTTPS URL. Use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Expose backend port
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update `.env`:

```bash
CALLBACK_URL_BASE=https://abc123.ngrok.io
```

Restart the backend to apply changes.

---

### 2. Test STK Push

**Start Backend:**
```bash
cd /home/mike/haki-yetu-b-private
source venv/bin/activate
python run.py
```

**Test with curl:**
```bash
# Get JWT token first (login)
TOKEN="your_jwt_token_here"

# Initiate STK Push
curl -X POST http://localhost:5000/api/payment/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "phone_number": "254708374149",
    "amount": 3000,
    "booking_id": 1,
    "account_reference": "HakiYetu",
    "transaction_desc": "Test Payment"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "CheckoutRequestID": "ws_CO_...",
  "MerchantRequestID": "...",
  "ResponseCode": "0",
  "CustomerMessage": "Payment request sent. Please check your phone."
}
```

---

### 3. Test Full Flow from Frontend

**Start Frontend:**
```bash
cd /home/mike/haki-yetu-a-frontend
npm run dev
```

**Steps:**
1. Navigate to: `http://localhost:5173/consultation/book/14`
2. Fill in booking details
3. Enter phone: `254708374149`
4. Click "Pay with M-Pesa"
5. Check phone for STK Push prompt
6. Enter PIN: `1234`
7. Verify payment completes and consultation is confirmed

**Frontend will:**
- Call `/api/payment/mpesa/stk-push`
- Poll `/api/payment/mpesa/status/<id>` every 2 seconds
- Show success/failure message
- Redirect to confirmation page on success

---

### 4. Check Database

Verify payment was recorded:

```bash
cd /home/mike/haki-yetu-b-private
source venv/bin/activate
python

from app import create_app, db
from app.payments.models import Payment
from app.documents.models import Consultation

app = create_app()
with app.app_context():
    # Check payments
    payments = Payment.query.all()
    for p in payments:
        print(f"Payment {p.id}: {p.status} - {p.mpesa_receipt_number}")

    # Check consultations
    consultations = Consultation.query.all()
    for c in consultations:
        print(f"Consultation {c.id}: {c.payment_status} - {c.status}")
```

---

## Routes Summary

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/payment/mpesa/stk-push` | POST | Initiate payment | ✅ JWT |
| `/api/payment/mpesa/status/<id>` | GET | Check payment status | ✅ JWT |
| `/api/payment/mpesa/callback` | POST | M-Pesa webhook | ❌ None |
| `/api/payment/mpesa/stkpush/query` | POST | Legacy status check | ✅ JWT |

**Note:** The callback route doesn't require authentication (it's called by Safaricom), but it verifies the source IP address.

---

## Frontend Integration

The frontend M-Pesa service (`src/services/mpesa.service.js`) handles:

1. **Phone Number Validation:**
   ```javascript
   export function isValidMpesaPhone(phone) {
     const formatted = formatPhoneNumber(phone);
     return /^254[17]\d{8}$/.test(formatted);
   }
   ```

2. **STK Push Initiation:**
   ```javascript
   const result = await mpesaService.processPayment({
     phone_number: phoneNumber,
     amount: total,
     booking_id: bookingId,
     account_reference: 'HakiYetu',
     transaction_desc: `Consultation with ${advocate.name}`
   });
   ```

3. **Status Polling:**
   - Polls every 2 seconds
   - Maximum 30 attempts (60 seconds)
   - Shows loading toast with countdown

---

## Error Handling

### Common Errors

**1. Phone Number Format Error**
```json
{
  "success": false,
  "error": "Invalid phone number format. Use 254XXXXXXXXX"
}
```
**Solution:** Ensure phone starts with 254 and is 12 digits.

---

**2. Consultation Already Paid**
```json
{
  "success": false,
  "error": "This consultation has already been paid for"
}
```
**Solution:** Check `Payment.query.filter_by(consultation_id=X, status='completed')`.

---

**3. Consultation Not Found**
```json
{
  "success": false,
  "error": "Consultation not found"
}
```
**Solution:** Verify booking_id exists in consultations table.

---

**4. STK Push Failed**
```json
{
  "success": false,
  "error": "Failed to initiate payment"
}
```
**Possible Causes:**
- Invalid M-Pesa credentials
- Network timeout
- Safaricom API down

**Check logs:** Backend will log the detailed error from Daraja API.

---

**5. Callback Not Received**

**Symptoms:** Payment stuck in `pending` status.

**Troubleshooting:**
1. Verify callback URL is publicly accessible (test with curl)
2. Check ngrok is running: `ngrok http 5000`
3. Check backend logs for callback data
4. Verify Safaricom sandbox is operational

---

**6. Payment Timeout**

**Frontend shows:** "Payment verification timeout"

**Causes:**
- User cancelled on phone
- Network issues
- STK Push expired (30 seconds)

**Solution:** Payment status will be updated when callback arrives (late). Optionally implement manual status refresh button.

---

## Security Considerations

### 1. Callback IP Whitelisting

The callback handler verifies requests come from Safaricom IPs:

```python
safaricom_ips = [
    '196.201.214.200',
    '196.201.214.206',
    '196.201.213.114',
    # ... more IPs
]
```

**Production:** Remove the development bypass:
```python
# Remove this in production:
if os.getenv('FLASK_ENV') == 'development':
    return True
```

---

### 2. Idempotency

Duplicate callbacks are ignored:

```python
if checkout_request_id in processed_callbacks:
    logger.info(f"Duplicate callback ignored: {checkout_request_id}")
    return jsonify({'ResultCode': 0}), 200
```

**Production:** Use Redis or database-backed cache instead of in-memory dict.

---

### 3. Amount Validation

Always verify the amount in the callback matches the consultation amount:

```python
# TODO: Add amount verification
if payment_info.get('Amount') != float(payment.amount):
    logger.warning(f"Amount mismatch: expected {payment.amount}, got {payment_info.get('Amount')}")
    # Handle mismatch
```

---

### 4. SSL/HTTPS

M-Pesa requires HTTPS for callbacks.

**Production:**
- Use proper SSL certificate (Let's Encrypt)
- Configure nginx/apache with HTTPS
- Update `CALLBACK_URL_BASE` to production domain

---

## Production Deployment

### 1. Update Environment

```bash
SAFARICOM_BASE=https://api.safaricom.co.ke
SAFARICOM_CONSUMER_KEY=prod_consumer_key
SAFARICOM_CONSUMER_SECRET=prod_consumer_secret
SAFARICOM_SHORTCODE=your_paybill_number
SAFARICOM_PASSKEY=production_passkey
CALLBACK_URL_BASE=https://hakiyetu.com
FLASK_ENV=production
```

---

### 2. Database Migration

```bash
cd /home/mike/haki-yetu-b-private
source venv/bin/activate
flask db upgrade
```

---

### 3. Test Production Credentials

Before going live:
1. Test with real phone number
2. Use small amount (e.g., KES 10)
3. Verify callback is received
4. Check payment updates in database

---

### 4. Monitoring

Set up monitoring for:
- Failed payments (status = 'failed')
- Stuck payments (pending > 5 minutes)
- Callback errors (check logs)
- High error rates

**Example Query:**
```sql
SELECT COUNT(*) FROM payments WHERE status = 'failed' AND created_at > NOW() - INTERVAL '1 day';
```

---

## Troubleshooting Guide

### Payment Stuck in Pending

**Check:**
1. Was callback received? → Check backend logs
2. Is ngrok running? → `ngrok http 5000`
3. Is callback URL correct? → Check `.env`
4. Manual status check:
   ```bash
   curl http://localhost:5000/api/payment/mpesa/status/ws_CO_...
   ```

---

### Database Connection Issues

**Error:** `sqlalchemy.exc.OperationalError`

**Solution:**
1. Check PostgreSQL is running: `systemctl status postgresql`
2. Verify database credentials in `.env`
3. Test connection:
   ```python
   from app import create_app, db
   app = create_app()
   with app.app_context():
       db.session.execute('SELECT 1')
   ```

---

### M-Pesa API Errors

**Error:** `DarajaError: Failed to authenticate`

**Solution:**
1. Verify consumer key/secret are correct
2. Check Safaricom Developer Portal for app status
3. Regenerate credentials if expired

---

## Maintenance

### Cleanup Old Payments

Pending payments older than 24 hours can be marked as cancelled:

```python
from datetime import datetime, timedelta
from app import create_app, db
from app.payments.models import Payment

app = create_app()
with app.app_context():
    cutoff = datetime.utcnow() - timedelta(days=1)
    old_payments = Payment.query.filter(
        Payment.status == 'pending',
        Payment.created_at < cutoff
    ).all()

    for p in old_payments:
        p.status = 'cancelled'
        p.failure_reason = 'Timeout - No callback received'

    db.session.commit()
    print(f"Cancelled {len(old_payments)} old payments")
```

---

### View Payment Statistics

```python
from app import create_app, db
from app.payments.models import Payment
from sqlalchemy import func

app = create_app()
with app.app_context():
    stats = db.session.query(
        Payment.status,
        func.count(Payment.id).label('count'),
        func.sum(Payment.amount).label('total')
    ).group_by(Payment.status).all()

    for status, count, total in stats:
        print(f"{status}: {count} payments, Total: KES {total or 0}")
```

---

## Support Resources

- **Safaricom API Documentation:** https://developer.safaricom.co.ke/docs
- **M-Pesa Support:** apisupport@safaricom.co.ke
- **Developer Portal:** https://developer.safaricom.co.ke
- **Frontend Documentation:** [MPESA_INTEGRATION_GUIDE.md](MPESA_INTEGRATION_GUIDE.md)
- **Quick Start Guide:** [MPESA_QUICK_START.md](MPESA_QUICK_START.md)

---

## Files Modified/Created

### Backend:
- ✅ `app/payments/models.py` (NEW) - Payment model
- ✅ `app/payments/daraja.py` (MODIFIED) - Updated routes
- ✅ `migrations/versions/add_payment_model.py` (NEW) - Database migration

### Frontend:
- ✅ `src/services/mpesa.service.js` (NEW) - M-Pesa integration service
- ✅ `src/pages/consultation/BookingCheckout.jsx` (MODIFIED) - Payment UI

### Documentation:
- ✅ `MPESA_INTEGRATION_GUIDE.md` - Comprehensive guide
- ✅ `MPESA_QUICK_START.md` - 5-minute setup guide
- ✅ `BACKEND_MPESA_INTEGRATION.md` - This file

---

**Integration Complete!** 🎉

The M-Pesa payment system is now fully integrated with the consultation booking flow. Clients can pay for consultations via STK Push, and the system automatically updates consultation status when payments are confirmed.

---

**Last Updated:** January 12, 2026
**Version:** 1.0.0
