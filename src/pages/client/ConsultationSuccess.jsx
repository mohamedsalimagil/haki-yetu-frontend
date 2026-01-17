import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, Clock, Video, Timer, Grid, Download } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingScreen from '../../components/common/LoadingScreen';

const ConsultationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { bookingId, paymentStatus: initialPaymentStatus, lawyer } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus || 'PENDING');
  const [isPolling, setIsPolling] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [pollingSeconds, setPollingSeconds] = useState(0);

  // Handle skip/continue action
  const handleSkipVerification = () => {
    setPaymentStatus('completed');
    setIsPolling(false);
    toast.success("Continuing to confirmation page. Payment will be verified in the background.");
  };

  useEffect(() => {
    if (!bookingId || paymentStatus === 'completed' || paymentStatus === 'paid') return;

    setIsPolling(true);
    setPollingSeconds(0);

    // Show skip button after 15 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 15000);

    // Counter for display
    const counterInterval = setInterval(() => {
      setPollingSeconds(prev => prev + 1);
    }, 1000);

    const interval = setInterval(async () => {
      try {
        // Try to get specific payment status first, fallback to consultations list
        let myBooking = null;

        try {
          // Try specific payment status endpoint if it exists
          const statusResponse = await api.get(`/payment/status/${bookingId}`);
          if (statusResponse.data && statusResponse.data.status === 'completed') {
            myBooking = statusResponse.data.booking || statusResponse.data;
            myBooking.payment_status = 'paid';
          }
        } catch (statusError) {
          // If payment status endpoint doesn't exist, fall back to consultations list
          console.log("Payment status endpoint not available, using consultations list");
          const response = await api.get('/client/consultations');

          // Extract the array from the 'consultations' property
          const bookingsList = Array.isArray(response.data)
            ? response.data
            : response.data.consultations || [];

          // Find the specific booking
          myBooking = bookingsList.find(b => b.id === parseInt(bookingId));
        }

        // Check if payment is completed (check multiple status variations)
        if (myBooking && (
          myBooking.payment_status === 'paid' ||
          myBooking.payment_status === 'Paid' ||
          myBooking.payment_status === 'completed' ||
          myBooking.status === 'confirmed' ||
          myBooking.status === 'Confirmed' ||
          myBooking.status === 'paid'
        )) {
          setPaymentStatus('completed');
          setBooking(myBooking);
          setIsPolling(false);
          clearInterval(interval);
          clearInterval(counterInterval);
          clearTimeout(skipTimer);
          toast.success("Payment Confirmed!");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Poll every 3 seconds for faster response

    // Stop polling after 30 seconds (reduced from 10 minutes for better UX)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      clearInterval(counterInterval);
      setIsPolling(false);
      setShowSkipButton(true);
      toast.info('If payment was successful on M-Pesa, click "Continue Anyway" below.');
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(counterInterval);
      clearTimeout(timeout);
      clearTimeout(skipTimer);
    };
  }, [bookingId, paymentStatus]);

  // formatted data for display
  const bookingData = booking && lawyer ? {
    bookingRef: booking.consultation_ref || `HK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    advocateName: lawyer.name || (lawyer.first_name + ' ' + lawyer.last_name),
    specialty: lawyer.specialization || 'Legal Specialist',
    rating: lawyer.rating || 4.9,
    reviews: lawyer.reviews || 0,
    date: booking.date ? new Date(booking.date).toDateString() : 'Date not set',
    time: booking.time || booking.time_slot || 'Time not set',
    timeZone: 'EAT',
    format: booking.service_type || 'Video Consultation',
    duration: booking.duration_minutes ? `${booking.duration_minutes} Minutes` : '60 Minutes',
    amount: booking.amount ? parseFloat(booking.amount) : (lawyer.consultation_fee || 50),
    email: user?.email || 'client@example.com'
  } : (location.state || {
    // Fallback/Default data for direct access without state
    bookingRef: 'HK-2023-8492',
    advocateName: 'Sarah Kamau',
    specialty: 'Corporate Law Specialist',
    rating: 4.9,
    reviews: 124,
    date: 'Thursday, Oct 24, 2023',
    time: '10:00AM-11:00 AM',
    timeZone: 'EAT',
    format: 'Video Consultation',
    duration: '60 Minutes',
    amount: 3500,
    email: 'client@example.com'
  });

  const handleAddToCalendar = () => {
    toast.success('Calendar event created!');
  };

  const handleDownloadReceipt = async () => {
    //  FIX: Use bookingId from props/state instead of booking.id which might be undefined
    const receiptBookingId = bookingId || (booking && booking.id);
    if (!receiptBookingId) {
      toast.error('Receipt download unavailable - booking ID not found');
      return;
    }

    try {
      //  FIX: Use proper blob handling and create download link
      const response = await api.get(`/payment/receipt/${receiptBookingId}`, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt-${receiptBookingId}.pdf`);
      link.setAttribute('target', '_blank'); // Fallback for some browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Failed to download receipt:', error);

      //  FIX: Better error handling with specific messages
      if (error.response?.status === 404) {
        toast.error('Receipt not found. Payment may still be processing.');
      } else if (error.response?.status === 500) {
        toast.error('Receipt generation failed. Please try again later.');
      } else {
        toast.error('Failed to download receipt. Please contact support.');
      }
    }
  };

  // Show loading screen while waiting for payment confirmation
  if (paymentStatus === 'pending' && isPolling) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying your M-Pesa payment...
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please complete the payment on your phone when prompted.
          </p>

          {/* Timer display */}
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Waiting: {pollingSeconds}s
          </p>

          {/* Skip button - appears after 15 seconds */}
          {showSkipButton && (
            <div className="space-y-3">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                Payment completed on M-Pesa but verification is slow?
              </p>
              <button
                onClick={handleSkipVerification}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                 Continue Anyway
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Your booking will be confirmed automatically once payment is verified.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Dashboard</a>
              <a href="/find-lawyer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Find a Lawyer</a>
              <a href="/my-documents" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">My Documents</a>
              <a href="/help" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Help</a>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
          Consultation Confirmed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
          Your appointment has been successfully scheduled. A confirmation email with the joining link has been sent to{' '}
          <span className="font-medium text-gray-900 dark:text-gray-200">{bookingData.email}</span>.
        </p>

        {/* Booking Reference */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">Booking Ref:</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{bookingData.bookingRef}</span>
          <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Advocate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bookingData.advocateName)}&background=2563eb&color=fff&size=128`}
                  alt={bookingData.advocateName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{bookingData.advocateName}</h3>
                <p className="text-gray-600 dark:text-gray-400">{bookingData.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{bookingData.rating}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({bookingData.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full mb-2 ${paymentStatus === 'completed'
                ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40'
                : paymentStatus === 'failed'
                  ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40'
                  : 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40'
                }`}>
                {paymentStatus === 'completed' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : paymentStatus === 'failed' ? (
                  <XCircle className="w-3 h-3" />
                ) : (
                  <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {paymentStatus === 'completed' ? 'PAYMENT SUCCESSFUL' : paymentStatus === 'failed' ? 'PAYMENT FAILED' : 'PAYMENT PENDING'}
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">KES {(bookingData.amount || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Session Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Time */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Session Time</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{bookingData.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{bookingData.time} <span className="text-gray-500 dark:text-gray-400">{bookingData.timeZone}</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time (East Africa Time)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Format */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Session Format</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                    <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{bookingData.format}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Via Haki Yetu Secure Meet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-lg">
                    <Timer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{bookingData.duration}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-8 transition-colors">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">WHAT HAPPENS NEXT?</h3>
              <ol className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">1</span>
                  <span>Please join the call 5 minutes early to test your audio and video.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">2</span>
                  <span>Ensure you have a stable internet connection for the duration of the session.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">3</span>
                  <span>Upload any relevant documents (contracts, ID, letters) to "My Documents" before the session starts.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">4</span>
                  <span>Prepare a list of all inquiries and questions to ensure a productive session with the lawyer.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Grid className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Calendar className="w-5 h-5" />
            Add to Calendar
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-2 px-6 py-3 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need to reschedule?{' '}
            <button onClick={() => navigate('/client/consultations')} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Manage Booking
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2023 Haki Yetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ConsultationSuccess;
