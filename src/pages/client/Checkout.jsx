import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { CreditCard, Shield, CheckCircle, Loader, ArrowLeft, Phone, Download } from 'lucide-react';


const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'pending', 'processing', 'completed', 'failed'
  const [isPollingPayment, setIsPollingPayment] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      // Check if order data was passed via location state (from NotarizationFlow)
      if (location.state) {
        const { service, amount, timeSlot, document } = location.state;
        setOrder({
          id: orderId,
          service_name: service || 'Document Notarization',
          lawyer_name: 'Haki Yetu Platform',
          amount: amount || 600,
          timeSlot: timeSlot,
          document: document,
          status: 'PENDING'
        });
        setLoading(false);
        return;
      }

      // For notarization service, use static data (no API endpoint needed)
      if (orderId === 'notarization') {
        setOrder({
          id: 'notarization',
          service_name: 'Document Notarization',
          lawyer_name: 'LSK Accredited Advocate',
          amount: 600,
          status: 'PENDING'
        });
        setLoading(false);
        return;
      }

      // For other services, try to fetch from API
      try {
        const response = await api.get(`/marketplace/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (apiError) {
        // If API fails, create default order
        console.log('Using default order data');
        setOrder({
          id: orderId,
          service_name: 'Legal Service',
          lawyer_name: 'Haki Yetu Platform',
          amount: 3000,
          status: 'PENDING'
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status after STK push
  useEffect(() => {
    if (checkoutRequestId && paymentStatus === 'pending') {
      setIsPollingPayment(true);

      const pollPaymentStatus = async () => {
        try {
          const response = await api.post('/api/payment/mpesa/stkpush/status', {
            checkout_request_id: checkoutRequestId
          });
          const status = response.data.status?.toLowerCase();

          if (status === 'completed') {
            setPaymentStatus('completed');
            setIsPollingPayment(false);
            // Navigate to success page with booking data
            navigate('/client/consultation-success', {
              state: {
                booking: {
                  id: order.id, // Use the actual booking/order ID for receipt download
                  checkout_request_id: checkoutRequestId,
                  amount: order.amount,
                  date: new Date().toISOString(),
                  service_type: order.service_name,
                  mpesa_receipt: response.data.mpesa_receipt_number
                },
                lawyer: {
                  name: order.lawyer_name,
                  specialization: 'Legal Services'
                }
              }
            });
          } else if (status === 'failed') {
            setPaymentStatus('failed');
            setIsPollingPayment(false);
            toast.error('Payment failed. Please try again.');
          } else if (status === 'cancelled') {
            setPaymentStatus('cancelled');
            setIsPollingPayment(false);
            toast.error('Payment was cancelled.');
          }
          // Continue polling for 'pending' or 'processing'
        } catch (error) {
          console.error('Error polling payment status:', error);
          // Continue polling on errors unless it's a specific error
        }
      };

      const interval = setInterval(pollPaymentStatus, 3000); // Poll every 3 seconds

      // Stop polling after 5 minutes
      const timeout = setTimeout(() => {
        setIsPollingPayment(false);
        setPaymentStatus('timeout');
        toast.error('Payment verification timed out. Please contact support.');
      }, 300000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [checkoutRequestId, paymentStatus, order, navigate]);

  const handleDownloadTemplate = async (templateId) => {
    try {
      const response = await api.get(`/documents/marketplace/templates/${templateId}/download`, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template_${templateId}.pdf`);
      link.setAttribute('target', '_blank'); // Fallback for some browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Template download failed:', error);
      toast.error('Failed to download template. Please try again.');
    }
  };

  const handlePayment = async () => {
    // Validate phone number
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    // Format phone number (remove spaces, ensure 254 prefix)
    let formattedPhone = phoneNumber.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Validate phone format
    if (!/^254\d{9}$/.test(formattedPhone)) {
      toast.error('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    // CRITICAL: Check if user is logged in before payment
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Your session has expired. Please login to complete payment.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setPaying(true);

      // Prepare payment payload with type differentiation
      const paymentPayload = {
        phone_number: formattedPhone,  // Backend expects snake_case
        amount: Math.round(Number(order.amount)), // Backend expects integer
        account_reference: order.service_name || 'HAKIYETU', // Backend expects snake_case
        description: `Payment for ${order.service_name || 'Haki Yetu'}`, // Backend expects 'description' not 'transactionDesc'
        // Add type differentiation for backend processing
        ...(location.state?.type === 'TEMPLATE'
          ? {
            template_id: location.state.item?.id,
            payment_type: 'TEMPLATE'
          }
          : {
            booking_id: order.id,
            payment_type: 'CONSULTATION'
          }
        )
      };

      // Use the correct M-Pesa STK Push endpoint with explicit Authorization header
      const response = await api.post(
        '/api/payment/mpesa/stkpush',
        paymentPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // STK push successful - start polling for completion
      const checkoutRequestId = response.data?.checkout_request_id;
      const merchantRequestId = response.data?.merchant_request_id;

      if (checkoutRequestId) {
        setCheckoutRequestId(checkoutRequestId);
        setPaymentStatus('pending');
        toast.success('STK Push sent! Please enter your M-Pesa PIN to complete payment.', {
          duration: 5000,
          icon: undefined
        });
      } else if (location.state?.purchaseRef) {
        // For template purchases, verify using purchase reference
        try {
          const verifyResponse = await api.get(`/api/payment/verify/${location.state.purchaseRef}`);
          if (verifyResponse.data.status === 'completed') {
            setPaymentStatus('completed');
            toast.success('Template purchase successful! You can now download your template.');
            // Don't navigate away - stay on checkout page to show download button
          } else {
            setPaymentStatus('pending');
            setCheckoutRequestId(location.state.purchaseRef);
          }
        } catch (verifyError) {
          console.error('Payment verification failed:', verifyError);
          toast.error('Payment verification failed. Please contact support.');
        }
      } else {
        toast.error('Payment request sent but unable to track status. Please check your M-Pesa messages.');
      }

    } catch (error) {
      console.error('Payment failed:', error);

      // Handle authorization errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/services')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <CreditCard className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Haki Yetu</span>
        </div>
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start py-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.service_name}</h3>
                    <p className="text-gray-600">Service by {order.lawyer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">KES {order.amount?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">KES {order.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">KES 0</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">KES {order.amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Phone className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">M-Pesa</p>
                      <p className="text-sm text-gray-600">Pay with your mobile money</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712345678"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the phone number registered with M-Pesa
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Secure Payment</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your payment is processed securely through M-Pesa. Funds are held in escrow until service completion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">KES {order.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">KES 0</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">KES {order.amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status Messages */}
              {isPollingPayment && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader className="animate-spin w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Please enter your M-Pesa PIN</p>
                      <p className="text-xs text-blue-600">Check your phone for the STK Push notification</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">Payment failed. Please try again.</p>
                </div>
              )}

              {paymentStatus === 'timeout' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">Payment verification timed out. Please contact support.</p>
                </div>
              )}

              {paymentStatus === 'completed' && location.state?.type === 'TEMPLATE' && (
                <button
                  onClick={() => handleDownloadTemplate(location.state.item.id)}
                  className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Template
                </button>
              )}

              <button
                onClick={handlePayment}
                disabled={paying || isPollingPayment || paymentStatus === 'completed'}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <>
                    <Loader className="animate-spin w-5 h-5" />
                    Sending STK Push...
                  </>
                ) : isPollingPayment ? (
                  <>
                    <Loader className="animate-spin w-5 h-5" />
                    Waiting for Payment...
                  </>
                ) : paymentStatus === 'completed' ? (
                  <>
                    <CheckCircle size={20} />
                    Payment Completed
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Pay with M-Pesa
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {paymentStatus === 'completed' && location.state?.type === 'TEMPLATE'
                  ? 'Your template is ready for download!'
                  : isPollingPayment
                    ? 'Verifying payment completion...'
                    : 'You will receive an M-Pesa prompt on your phone'
                }
              </p>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-bold text-gray-900 mb-4">Why Choose Haki Yetu?</h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Verified Advocates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Checkout;
