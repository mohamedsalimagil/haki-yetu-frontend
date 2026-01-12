"""
M-Pesa Backend Example - Copy this to your Flask backend

File: backend/mpesa_service.py and backend/routes/mpesa_routes.py
"""

import requests
import base64
from datetime import datetime
import os
from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# ============================================
# PART 1: M-Pesa Service Class
# File: backend/services/mpesa_service.py
# ============================================

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
        """Generate M-Pesa access token"""
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
        """Generate password for STK Push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        data_to_encode = f"{self.business_short_code}{self.passkey}{timestamp}"
        encoded = base64.b64encode(data_to_encode.encode()).decode('utf-8')
        return encoded, timestamp

    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK Push request"""
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
        """Query the status of an STK Push transaction"""
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


# ============================================
# PART 2: Flask Routes
# File: backend/routes/mpesa_routes.py
# ============================================

# Assuming you have these imports in your Flask app
# from flask import Blueprint, request, jsonify
# from your_app import db
# from your_app.models import Payment, Booking

mpesa_bp = Blueprint('mpesa', __name__, url_prefix='/api/payment/mpesa')

@mpesa_bp.route('/stk-push', methods=['POST'])
def initiate_stk_push():
    """Initiates M-Pesa STK Push"""
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

        # Save payment record (adjust based on your database model)
        # payment = Payment(
        #     booking_id=booking_id,
        #     amount=amount,
        #     phone_number=phone_number,
        #     checkout_request_id=result.get('CheckoutRequestID'),
        #     merchant_request_id=result.get('MerchantRequestID'),
        #     status='pending'
        # )
        # db.session.add(payment)
        # db.session.commit()

        return jsonify(result), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


@mpesa_bp.route('/status/<checkout_request_id>', methods=['GET'])
def check_status(checkout_request_id):
    """Checks payment status"""
    try:
        result = mpesa_service.query_transaction_status(checkout_request_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mpesa_bp.route('/callback', methods=['POST'])
def mpesa_callback():
    """Handles M-Pesa callback"""
    try:
        data = request.json
        print("=" * 50)
        print("M-Pesa Callback Received:")
        print(data)
        print("=" * 50)

        # Extract callback data
        callback_data = data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = callback_data.get('CheckoutRequestID')
        result_code = callback_data.get('ResultCode')
        result_desc = callback_data.get('ResultDesc')

        # Find payment record (adjust based on your database model)
        # payment = Payment.query.filter_by(
        #     checkout_request_id=checkout_request_id
        # ).first()

        # if not payment:
        #     return jsonify({'error': 'Payment not found'}), 404

        # Update payment status
        if result_code == 0:
            # Payment successful
            print(f"Payment SUCCESSFUL: {checkout_request_id}")
            # payment.status = 'completed'

            # Extract M-Pesa receipt
            callback_metadata = callback_data.get('CallbackMetadata', {}).get('Item', [])
            for item in callback_metadata:
                if item.get('Name') == 'MpesaReceiptNumber':
                    mpesa_receipt = item.get('Value')
                    print(f"M-Pesa Receipt: {mpesa_receipt}")
                    # payment.mpesa_receipt_number = mpesa_receipt
        else:
            # Payment failed
            print(f"Payment FAILED: {result_desc}")
            # payment.status = 'failed'
            # payment.failure_reason = result_desc

        # db.session.commit()

        # Acknowledge the callback
        return jsonify({
            'ResultCode': 0,
            'ResultDesc': 'Success'
        }), 200

    except Exception as e:
        print(f"Callback Error: {e}")
        return jsonify({'error': str(e)}), 500


# ============================================
# PART 3: Register Blueprint in your Flask App
# File: backend/app.py
# ============================================

# In your main Flask app file:
# from routes.mpesa_routes import mpesa_bp
# app.register_blueprint(mpesa_bp)


# ============================================
# PART 4: Database Model (Optional)
# File: backend/models.py
# ============================================

# class Payment(db.Model):
#     __tablename__ = 'payments'

#     id = db.Column(db.Integer, primary_key=True)
#     booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
#     amount = db.Column(db.Numeric(10, 2), nullable=False)
#     phone_number = db.Column(db.String(15), nullable=False)
#     checkout_request_id = db.Column(db.String(100), unique=True)
#     merchant_request_id = db.Column(db.String(100))
#     mpesa_receipt_number = db.Column(db.String(50))
#     status = db.Column(db.String(20), default='pending')  # pending, completed, failed
#     failure_reason = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationship
#     booking = db.relationship('Booking', backref=db.backref('payments', lazy=True))


# ============================================
# USAGE INSTRUCTIONS
# ============================================

"""
1. Copy PART 1 to: backend/services/mpesa_service.py
2. Copy PART 2 to: backend/routes/mpesa_routes.py
3. Register blueprint as shown in PART 3
4. Add database model from PART 4 (optional)
5. Create .env file with credentials
6. Run migrations if using database
7. Test with: curl -X POST http://localhost:5000/api/payment/mpesa/stk-push ...
"""
