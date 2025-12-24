import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smartphone, Lock, CheckCircle, Loader } from 'lucide-react';
import api from '../../services/api';

const Checkout = () => { // Define functional component for checkout page
    const { bookingId } = useParams(); // Get booking ID from URL parameters
    const navigate = useNavigate(); // Get navigation function for routing

    const [phone, setPhone] = useState(''); // State for storing phone number input
    const [loading, setLoading] = useState(false); // State for tracking payment initiation loading
    const [paymentStatus, setPaymentStatus] = useState('idle'); // State for payment flow: idle, processing, success, failed
    const [statusMessage, setStatusMessage] = useState(''); // State for user feedback messages

    // POLLING FUNCTION
    const pollPaymentStatus = async (requestId) => { // Async function to poll payment status
        setPaymentStatus('processing'); // Set status to processing when polling starts
        setStatusMessage('Check your phone... Enter M-Pesa PIN.'); // Update user message

        const intervalId = setInterval(async () => { // Create polling interval
            try { // Try block for polling requests
                const response = await api.get(`/marketplace/payments/status/${requestId}`); // API call to check payment status

                if (response.data.status === 'completed') { // Check if payment is completed
          clearInterval(intervalId); // Stop polling
          setPaymentStatus('success'); // Update status to success
          setStatusMessage('Payment Received! Redirecting...'); // Update success message
          setTimeout(() => navigate('/dashboard'), 3000); // Redirect after 3 seconds
        }
      } catch (err) { // Catch block for polling errors
        console.error("Polling error", err); // Log error to console
      }
    }, 2000); // Check every 2 seconds

    // Stop checking after 60 seconds (timeout)
    setTimeout(() => { // Set timeout to stop polling
      clearInterval(intervalId); // Clear polling interval
      if (paymentStatus !== 'success') { // Check if payment hasn't succeeded
        setPaymentStatus('failed'); // Set status to failed
        setStatusMessage('Payment timed out. Please try again.'); // Update timeout message
      }
    }, 60000); // 60 second timeout
  };

  const handlePayment = async (e) => { // Function to handle payment submission
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    setStatusMessage('Initiating M-Pesa STK Push...'); // Update status message

    try { // Try block for payment initiation
      const payload = { // Create payment payload
        booking_id: bookingId, // Include booking ID from URL
        phone: phone // Include phone number from state
      };
      
      const response = await api.post('/marketplace/payments/stk-push', payload); // Initiate STK push
      
      // Start Polling 
      const requestId = response.data.CheckoutRequestID; // Extract checkout request ID
      pollPaymentStatus(requestId); // Start polling with request ID
      
    } catch (err) { // Catch block for payment initiation errors
      setPaymentStatus('failed'); // Set payment status to failed
      setStatusMessage('Failed to initiate payment.'); // Update error message
    } finally { // Finally block to clean up
      setLoading(false); // Reset loading state
    }
  };

 return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-12">
      <div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Order Summary (Darker/Contrast) */}
        <div className="lg:w-1/2 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <p className="text-slate-400 text-sm">Review your booking details before payment.</p>
            
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <span className="text-slate-300">Service</span>
                <span className="font-medium">Legal Consultation</span> {/* You can fetch real name if needed */}
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <span className="text-slate-300">Booking Reference</span>
                <span className="font-mono text-yellow-400">#{bookingId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <span className="text-slate-300">Processing Time</span>
                <span className="font-medium">Instant</span>
              </div>
            </div>
          </div>

          <div className="mt-8 relative z-10">
            <div className="flex justify-between items-end">
              <p className="text-slate-400">Total Due</p>
              <p className="text-4xl font-bold text-white">KES 1,500</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Payment Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-white relative">
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
            <p className="text-sm text-gray-500">Secure transaction via M-Pesa</p>
          </div>

          {/* SUCCESS STATE */}
          {paymentStatus === 'success' ? (
             <div className="text-center py-12 animate-fade-in">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
               <p className="text-gray-500">Your booking is secure. Redirecting...</p>
             </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">M-Pesa Phone Number</label>
                <div className="relative group">
                  <Smartphone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="2547XXXXXXXX"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium text-gray-900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status Message Bubble */}
              {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center text-sm ${
                    paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border border-red-100' : 
                    paymentStatus === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                    'bg-gray-50 text-gray-600'
                  }`}>
                  {paymentStatus === 'processing' && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {statusMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || paymentStatus === 'processing'}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
              >
                {loading ? 'Initiating Push...' : 'Pay Now'}
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-6">
                 <Lock className="w-3 h-3" />
                 <span>Encrypted & Secure Payment</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout; // Export component as default



