# 📱 M-Pesa Integration - README

## 🎯 Quick Links

| Document | Purpose | Time |
|----------|---------|------|
| [Quick Start](MPESA_QUICK_START.md) | Get running in 5 minutes | 5 min |
| [Integration Guide](MPESA_INTEGRATION_GUIDE.md) | Complete implementation details | 30 min |
| [Backend Example](backend_example_mpesa.py) | Copy-paste backend code | 2 min |
| [Implementation Summary](MPESA_IMPLEMENTATION_SUMMARY.md) | What was implemented | 5 min |

## ⚡ Super Quick Start

```bash
# 1. Get credentials (5 min)
Visit: https://developer.safaricom.co.ke
Create app → Copy credentials

# 2. Configure backend (.env file)
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# 3. Copy backend code
cp backend_example_mpesa.py your-backend/

# 4. Test
Phone: 254708374149
PIN: 1234
```

## 📚 What's Included

### Frontend (Already Implemented ✅)
- [src/services/mpesa.service.js](src/services/mpesa.service.js) - M-Pesa service
- [src/pages/consultation/BookingCheckout.jsx](src/pages/consultation/BookingCheckout.jsx) - Payment page

### Backend (You Need to Implement)
- STK Push endpoint
- Status check endpoint
- Callback handler

See [backend_example_mpesa.py](backend_example_mpesa.py) for complete code.

## 🧪 Test Credentials

**Sandbox:**
```
Business Short Code: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
Test Phone: 254708374149
Test PIN: 1234
```

## 🚀 Test Now

1. Start backend: `python app.py`
2. Start frontend: `npm run dev`
3. Go to: `http://localhost:5173/consultation/book/14`
4. Enter phone: `254708374149`
5. Click "Pay with M-Pesa"
6. Enter PIN: `1234` on your phone

## 📞 Need Help?

- **Safaricom:** apisupport@safaricom.co.ke
- **Portal:** https://developer.safaricom.co.ke
- **Docs:** https://developer.safaricom.co.ke/docs

## ✨ Features

✅ STK Push integration
✅ Real-time status polling
✅ Phone validation
✅ Error handling
✅ Success/failure notifications
✅ Payment timeout handling
✅ User-friendly UI

## 🔄 Payment Flow

```
User → "Pay M-Pesa" → STK Push → Phone Prompt → Enter PIN → ✅ Success
```

## 📝 Next Steps

1. [ ] Get Safaricom credentials
2. [ ] Set up backend endpoints
3. [ ] Test with sandbox
4. [ ] Apply for production
5. [ ] Go live!

---

**Ready to integrate?** Start with [MPESA_QUICK_START.md](MPESA_QUICK_START.md)
