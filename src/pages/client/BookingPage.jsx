import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CreditCard, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import lawyerService from '../../services/lawyer.service';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import SkeletonLoader from '../../components/common/SkeletonLoader';

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
    paymentMethod: 'mpesa'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.selectedDate || !formData.selectedTime) {
      setError('Please select both date and time');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const bookingData = {
        lawyer_id: id,
        date: formData.selectedDate,
        time: formData.selectedTime,
        service_type: formData.serviceType,
        notes: formData.notes,
        payment_method: formData.paymentMethod
      };

      const response = await lawyerService.bookConsultation(id, bookingData);
      
      // Redirect to success page
      navigate('/client/consultation/confirmation', {
        state: { booking: response, lawyer }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book consultation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <SkeletonLoader count={10} />
        </div>
      </div>
    );
  }

  if (error && !lawyer) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0A1E41] mb-2">Error Loading Page</h2>
          <p className="text-slate-600 mb-4">{error}</p>
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

  const consultationFee = lawyer?.consultation_fee || 3000;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#0A1E41] mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0A1E41] rounded-full flex items-center justify-center text-white font-bold text-xl">
              {lawyer?.name?.charAt(0) || 'L'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0A1E41]">Book Consultation</h1>
              <p className="text-slate-600">with {lawyer?.name || 'Advocate'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Consultation Fee</p>
              <p className="text-2xl font-bold text-[#0A1E41]">{formatCurrency(consultationFee)}</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Date Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#0A1E41]">Select Date</h2>
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
                    className={`p-4 rounded-xl border-2 transition ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50'
                        : 'border-gray-200 hover:border-[#2563EB] hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs text-slate-500 uppercase">
                      {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-[#0A1E41]">
                      {date.getDate()}
                    </p>
                    <p className="text-xs text-slate-600">
                      {date.toLocaleDateString('en-GB', { month: 'short' })}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#0A1E41]">Select Time</h2>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => {
                const isSelected = formData.selectedTime === time;
                
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedTime: time })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-gray-200 hover:border-[#2563EB] hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#0A1E41]">Service Type</h2>
            </div>
            
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              required
            >
              <option value="consultation">General Consultation</option>
              <option value="legal_advice">Legal Advice</option>
              <option value="document_review">Document Review</option>
              <option value="notarization">Notarization</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0A1E41] mb-4">Additional Notes (Optional)</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Briefly describe your legal matter..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
            />
            <p className="text-xs text-slate-400 mt-2">This helps the advocate prepare for your consultation</p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={24} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#0A1E41]">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#2563EB] transition">
                <input
                  type="radio"
                  name="payment"
                  value="mpesa"
                  checked={formData.paymentMethod === 'mpesa'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#2563EB]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#0A1E41]">M-PESA</p>
                  <p className="text-sm text-slate-500">Pay via M-PESA STK Push</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#2563EB] transition">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#2563EB]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#0A1E41]">Credit/Debit Card</p>
                  <p className="text-sm text-slate-500">Visa, Mastercard accepted</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-4 p-4 bg-blue-50 rounded-xl">
              <CheckCircle size={20} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-700">
                <p className="font-semibold mb-1">Booking Summary</p>
                <p>Date: {formData.selectedDate ? formatDate(formData.selectedDate) : 'Not selected'}</p>
                <p>Time: {formData.selectedTime || 'Not selected'}</p>
                <p>Fee: {formatCurrency(consultationFee)}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.selectedDate || !formData.selectedTime}
              className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : `Confirm Booking - ${formatCurrency(consultationFee)}`}
            </button>

            <p className="text-xs text-center text-slate-400 mt-3">
              By confirming, you agree to our Terms of Service and Cancellation Policy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
