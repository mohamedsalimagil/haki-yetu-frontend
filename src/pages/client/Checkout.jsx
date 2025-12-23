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

  return ( // Return JSX for component
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> {/* Full-screen centered container */}
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden"> {/* Checkout card */}
        
        {/* Header */} {/* Comment for header section */}
        <div className="bg-primary p-6 text-white text-center"> {/* Header container */}
          <h2 className="text-xl font-bold">Secure Checkout</h2> {/* Checkout title */}
          <p className="text-blue-100 text-sm mt-1">Complete your booking</p> {/* Checkout subtitle */}
        </div>

        <div className="p-8"> {/* Main content area */}
          
          {/* Summary Box */} {/* Comment for summary section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex justify-between items-center"> {/* Summary container */}
            <div> {/* Amount display */}
              <p className="text-xs text-gray-500 uppercase font-bold">Total to Pay</p> {/* Amount label */}
              <p className="text-2xl font-bold text-gray-900">KES 1,500</p> {/* Hardcoded amount */}
            </div>
            <Lock className="w-5 h-5 text-gray-400" /> {/* Lock icon */}
          </div>

          {/* Payment Form */} {/* Comment for payment form */}
          {paymentStatus === 'success' ? ( // Conditional rendering for success
            <div className="text-center py-8"> {/* Success screen container */}
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Success icon */}
                <CheckCircle className="w-8 h-8" /> {/* Check circle icon */}
              </div>
              <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3> {/* Success message */}
              <p className="text-gray-500 mt-2">Redirecting to dashboard...</p> {/* Redirect message */}
            </div>
          ) : ( // Else render payment form
            <form onSubmit={handlePayment}> {/* Payment form */}
              <div className="mb-6"> {/* Phone input container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Number</label> {/* Input label */}
                <div className="relative"> {/* Input wrapper for icon positioning */}
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> {/* Phone icon */}
                  <input 
                    type="text" 
                    placeholder="2547XXXXXXXX" // Phone placeholder
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" // Input styling
                    value={phone} // Bind to phone state
                    onChange={(e) => setPhone(e.target.value)} // Update state on change
                    required // Make field required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Format: 254712345678</p> {/* Format helper text */}
              </div>

              {/* Status Message Area */} {/* Comment for status display */}
              {statusMessage && ( // Conditionally render status message
                <div className={`p-3 rounded-lg text-sm text-center mb-4 ${paymentStatus === 'failed' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}> {/* Dynamic styling */}
                  {paymentStatus === 'processing' && <Loader className="w-4 h-4 inline mr-2 animate-spin" />} {/* Loading spinner */}
                  {statusMessage} {/* Display status message */}
                </div>
              )}

              <button 
                type="submit" // Submit button type
                disabled={loading || paymentStatus === 'processing'} // Disable during processing
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center" // Button styling
              >
                {loading ? 'Processing...' : 'Pay with M-Pesa'} {/* Dynamic button text */}
              </button>
            </form>
          )}
        </div> {/* End main content */}
      </div> {/* End checkout card */}
    </div> // End full-screen container
  );
};

export default Checkout; // Export component as default



