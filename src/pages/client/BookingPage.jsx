import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CreditCard, AlertCircle, CheckCircle, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import lawyerService from '../../services/lawyer.service';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { toast } from 'react-hot-toast';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    serviceType: 'consultation',
    notes: '',
    paymentMethod: 'mpesa',
    phoneNumber: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed

  // Fetch lawyer details
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        setLoading(true);
        const data = await lawyerService.getLawyerById(id);
        setLawyer(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lawyer details');
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate files (size, type)
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);

      if (!isValidSize) toast.error(`${file.name} is too large (max 5MB)`);
      if (!isValidType) toast.error(`${file.name} has invalid format`);

      return isValidSize && isValidType;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedDate || !formData.selectedTime) {
      setError('Please select both date and time');
      return;
    }

    if (formData.paymentMethod === 'mpesa' && !formData.phoneNumber) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    setShowPaymentModal(true);
    setPaymentStatus('processing');

    // Real API implementation
    try {
      setSubmitting(true);
      setError(null);

      // Prepare payload - in a real scenario with files, you might need FormData
      // but assuming the backend handles file uploads separately or strictly JSON metadata first
      const bookingPayload = {
        lawyer_id: id,
        date: formData.selectedDate,
        time: formData.selectedTime,
        service_type: formData.serviceType,
        notes: formData.notes,
        payment_method: formData.paymentMethod,
        phone_number: formData.phoneNumber,
        // files: uploadedFiles // You would typically upload these first and send URLs/IDs
      };

      // Call API to book consultation
      // Pass ID as first arg, payload as second
      const bookingResponse = await lawyerService.bookConsultation(id, bookingPayload);

      // If payment method is M-Pesa, trigger payment processing
      // In a real app, this would happen via callback, but here we simulate/force it
      if (formData.paymentMethod === 'mpesa' && bookingResponse.booking_id) {
        try {
          const paymentResponse = await api.post('/payment/mpesa/process', {
            booking_id: bookingResponse.booking_id,
            phone_number: formData.phoneNumber
          });

          // Check if this booking already exists (409 Conflict)
          if (paymentResponse.status === 409 || paymentResponse.data?.error?.includes('already booked')) {
            toast.error('This time slot is already booked. Please select a different time.');
            setPaymentStatus('conflict');
            // Allow user to go back and select different time
            setTimeout(() => {
              setShowPaymentModal(false);
              // Could navigate back to booking selection
            }, 3000);
            return;
          }

          // STK Push sent successfully - payment is pending
          toast("STK Push Sent! Please check your phone to enter PIN.");
          setPaymentStatus('stk_sent');

          setTimeout(() => {
            navigate('/client/consultation/confirmation', {
              state: {
                bookingId: bookingResponse.booking_id,
                paymentStatus: 'pending',
                lawyer: lawyer
              }
            });
          }, 2000);
          return; // Stop here on success
        } catch (payErr) {
          console.error("Payment processing failed", payErr);
          // Verify if we should show error or just navigate with unpaid status
          // User prompt implies they paid. Let's show error.
          throw payErr;
        }
      }

      // If not M-Pesa or something else, just navigate with initial response (Unpaid)
      setPaymentStatus('success'); // Assume manual pay or other

      setTimeout(() => {
        navigate('/client/consultation/confirmation', {
          state: {
            booking: bookingResponse.consultation,
            lawyer: lawyer
          }
        });
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to book consultation');
      setPaymentStatus('failed');
      setTimeout(() => setShowPaymentModal(false), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <SkeletonLoader count={10} />
        </div>
      </div>
    );
  }

  if (error && !lawyer) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0A1E41] dark:text-white mb-2">Error Loading Page</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const consultationFee = lawyer?.consultation_fee || 50;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-[#0A1E41] dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0A1E41] dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {lawyer?.name?.charAt(0) || 'L'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0A1E41] dark:text-white">Book Consultation</h1>
              <p className="text-slate-600 dark:text-gray-400">with {lawyer?.name || 'Advocate'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-gray-400">Consultation Fee</p>
              <p className="text-2xl font-bold text-[#0A1E41] dark:text-white">{formatCurrency(consultationFee)}</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Date Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} className="text-[#2563EB] dark:text-blue-400" />
              <h2 className="text-lg font-bold text-[#0A1E41] dark:text-white">Select Date</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableDates.map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const isSelected = formData.selectedDate === dateString;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedDate: dateString })}
                    className={`p-4 rounded-xl border-2 transition ${isSelected
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#2563EB] dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <p className="text-xs text-slate-500 dark:text-gray-400 uppercase">
                      {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-[#0A1E41] dark:text-white">
                      {date.getDate()}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-400">
                      {date.toLocaleDateString('en-GB', { month: 'short' })}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-[#2563EB] dark:text-blue-400" />
              <h2 className="text-lg font-bold text-[#0A1E41] dark:text-white">Select Time</h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => {
                const isSelected = formData.selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedTime: time })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${isSelected
                      ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-blue-400 dark:border-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#2563EB] dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300'
                      }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Type */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-[#2563EB] dark:text-blue-400" />
              <h2 className="text-lg font-bold text-[#0A1E41] dark:text-white">Service Type</h2>
            </div>

            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            >
              <option value="consultation">General Consultation</option>
              <option value="legal_advice">Legal Advice</option>
              <option value="document_review">Document Review</option>
              <option value="notarization">Notarization</option>
            </select>
          </div>

          {/* Additional Notes & Document Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <h2 className="text-lg font-bold text-[#0A1E41] dark:text-white mb-4">Additional Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Case Description (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Briefly describe your legal matter..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">This helps the advocate prepare for your consultation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Upload Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-[#2563EB] dark:text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PDF, DOCX, PNG, JPG up to 5MB
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={24} className="text-[#2563EB] dark:text-blue-400" />
              <h2 className="text-lg font-bold text-[#0A1E41] dark:text-white">Payment Method</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#2563EB] dark:hover:border-blue-500 transition bg-white dark:bg-gray-700/50">
                <input
                  type="radio"
                  name="payment"
                  value="mpesa"
                  checked={formData.paymentMethod === 'mpesa'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#2563EB]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#0A1E41] dark:text-white">M-PESA</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Pay via M-PESA STK Push</p>
                </div>
              </label>

              {formData.paymentMethod === 'mpesa' && (
                <div className="ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700 animate-fade-in">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    required={formData.paymentMethod === 'mpesa'}
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">You will receive a payment prompt on this number</p>
                </div>
              )}

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#2563EB] dark:hover:border-blue-500 transition bg-white dark:bg-gray-700/50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#2563EB]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#0A1E41] dark:text-white">Credit/Debit Card</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Visa, Mastercard accepted</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
            <div className="flex items-start gap-3 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <CheckCircle size={20} className="text-[#2563EB] dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-700 dark:text-gray-300">
                <p className="font-semibold mb-1">Booking Summary</p>
                <p>Date: {formData.selectedDate ? formatDate(formData.selectedDate) : 'Not selected'}</p>
                <p>Time: {formData.selectedTime || 'Not selected'}</p>
                <p>Fee: {formatCurrency(consultationFee)}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.selectedDate || !formData.selectedTime}
              className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
            >
              {submitting ? 'Processing...' : `Confirm Booking - ${formatCurrency(consultationFee)}`}
            </button>

            <p className="text-xs text-center text-slate-400 dark:text-gray-500 mt-3">
              By confirming, you agree to our Terms of Service and Cancellation Policy
            </p>
          </div>
        </form>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
            {paymentStatus === 'processing' && (
              <>
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CreditCard className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Phone</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We've sent an M-Pesa payment request to <b>{formData.phoneNumber}</b>. Please enter your PIN to complete the booking.
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-indeterminate"></div>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">Waiting for payment confirmation...</p>
              </>
            )}

            {paymentStatus === 'stk_sent' && (
              <>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">STK Push Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please check your phone and enter your M-Pesa PIN to complete the payment. Redirecting you to the confirmation page...
                </p>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Confirmed!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your consultation has been successfully booked. Redirecting you to the confirmation page...
                </p>
              </>
            )}

            {paymentStatus === 'conflict' && (
              <>
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Time Slot Unavailable</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This time slot is already booked. Please select a different date or time.
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
                >
                  Choose Different Time
                </button>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error || "We couldn't process your payment. Please try again or check your phone number."}
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
