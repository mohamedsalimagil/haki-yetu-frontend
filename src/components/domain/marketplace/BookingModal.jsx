import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import the children components
import BookingForm from './BookingForm'; 
import PaymentModal from './PaymentModal'; 
import bookingService from '../../../services/booking.service';

const BookingModal = ({ service, onClose }) => {
  const navigate = useNavigate();
  
  // State Management
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Input Form, 2 = Booking Created (Success)
  const [bookingData, setBookingData] = useState(null); // Stores the Booking ID from backend
  const [showPayment, setShowPayment] = useState(false); // Switch to Payment View

  // This function is passed down to BookingForm
  const handleBookingSubmit = async (formData) => {
    setLoading(true);
    try {
      // 1. Call Backend to create Booking & Order
      const response = await bookingService.createBooking(formData);
      
      // 2. Save the Booking ID so PaymentModal knows what to pay for
      setBookingData({ id: response.booking_id });
      
      // 3. Move UI to the Success/Pay Prompt step
      setStep(2);
      toast.success("Booking Request Created!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER LOGIC ---

  // 1. If user clicked "Pay Now", show the Payment Modal completely
  if (showPayment && bookingData) {
    return (
      <PaymentModal 
        booking={bookingData} 
        onClose={onClose} 
        onSuccess={() => {
           toast.success("Transaction Complete!");
           navigate('/dashboard/history'); // Redirect to history after payment
           onClose();
        }} 
      />
    );
  }

  // 2. Default View: The Modal Wrapper
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {/* STEP 1: The Input Form */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Book Consultation</h2>
            <p className="text-gray-500 text-sm mb-4">
              Service: <span className="font-semibold text-blue-600">{service.name}</span>
            </p>
            
            {/* Render the Form Component you created earlier */}
            <BookingForm 
                serviceId={service.id} 
                onBookingSubmit={handleBookingSubmit} 
                loading={loading} 
            />
          </div>
        )}

        {/* STEP 2: Booking Created - Prompt for Payment */}
        {step === 2 && (
          <div className="p-8 text-center bg-gray-50 h-full flex flex-col justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Reserved!</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Your appointment slot with the advocate has been temporarily held. 
              Please complete the payment via M-Pesa to confirm the booking.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowPayment(true)}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
              >
                Pay Now with M-Pesa
              </button>
              
              <button 
                onClick={() => { 
                  toast('Saved to Order History', { icon: '📂' });
                  navigate('/dashboard/history'); 
                  onClose(); 
                }}
                className="w-full bg-white text-gray-600 border border-gray-200 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Pay Later
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;