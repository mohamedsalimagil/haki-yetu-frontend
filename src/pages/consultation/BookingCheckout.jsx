import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, CheckCircle, AlertCircle, Loader, Phone, Video, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { advocate, date, slot, consultationType } = location.state || {};
  
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '0712345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!advocate || !date || !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Booking Information</h2>
          <p className="text-gray-600 mb-4">Please start from the advocate directory.</p>
          <button
            onClick={() => navigate('/advocates')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Advocate Directory
          </button>
        </div>
      </div>
    );
  }

  const consultationFee = 3500;
  const processingFee = 0;
  const total = consultationFee + processingFee;

  const formatDate = () => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the booking
      const bookingResponse = await api.post('/api/documents/consultations/book', {
        advocate_id: advocate.id,
        date: date.toISOString(),
        time: slot.time,
        consultation_type: consultationType,
        duration: 30
      });

      const bookingId = bookingResponse.data.booking_id;

      // Step 2: Process M-Pesa payment
      const paymentResponse = await api.post('/api/payment/mpesa/process', {
        booking_id: bookingId,
        phone_number: phoneNumber.replace(/\s/g, ''),
        amount: total
      });

      // Simulate a delay for M-Pesa processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Navigate to confirmation
      navigate('/consultation/confirmation', {
        state: {
          advocate,
          date,
          slot,
          consultationType,
          bookingId,
          amount: total,
          bookingReference: `HK-2023-${Math.floor(Math.random() * 10000)}`,
          meetingLink: `https://meet.hakiyetu.com/${bookingId}`,
          userEmail: user?.email || 'daniel.otieno@example.com'
        }
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button onClick={() => navigate('/advocates')} className="hover:text-blue-600">Select Lawyer</button>
              <ChevronRight size={16} />
              <button onClick={() => navigate(-1)} className="hover:text-blue-600">Schedule Consultation</button>
              <ChevronRight size={16} />
              <span className="text-blue-600 font-semibold">Payment</span>
              <ChevronRight size={16} />
              <span className="text-gray-400">Confirmation</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Service Details */}
              <div className="mb-6">
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Legal Consultation</h3>
                    <p className="text-sm text-gray-600">Service by Haki Yetu Platform</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">KES {consultationFee.toLocaleString()}</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">KES {consultationFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold text-gray-900">KES {processingFee}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">KES {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">{formatDate()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">{slot.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {consultationType === 'video' ? (
                      <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    ) : (
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Format</p>
                      <p className="font-semibold text-gray-900 capitalize">{consultationType} Consultation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">30 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
                
                {/* M-Pesa Option */}
                <div className="border-2 border-blue-500 rounded-lg p-4 mb-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 rounded-lg p-2">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">M-Pesa</p>
                        <p className="text-sm text-gray-600">Pay with your mobile money</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-blue-600"></div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712345678"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Enter the phone number registered with M-Pesa</p>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">Secure Payment</p>
                    <p className="text-sm text-yellow-700">
                      Your payment is processed securely through M-Pesa. Funds are held in escrow until service completion.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || !phoneNumber}
                  className={`w-full mt-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition ${
                    loading || !phoneNumber
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing M-Pesa Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Pay with M-Pesa
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  You will receive an M-Pesa prompt on your phone
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold text-gray-900">KES {consultationFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold text-gray-900">KES {processingFee}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !phoneNumber}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  loading || !phoneNumber
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Pay with M-Pesa
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                You will receive an M-Pesa prompt on your phone
              </p>

              {/* Why Choose Haki Yetu */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Why Choose Haki Yetu?</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Verified Advocates</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Secure Payments</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>24/7 Support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Money Back Guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
