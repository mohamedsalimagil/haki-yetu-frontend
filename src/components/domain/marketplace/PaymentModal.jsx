import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, CheckCircle, Loader, X } from 'lucide-react';
import paymentService from '../../../services/payment.service';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // input, processing, success
  const [requestId, setRequestId] = useState(null);

  // Poll for status when in 'processing' state
  useEffect(() => {
    let interval;
    if (step === 'processing' && requestId) {
      interval = setInterval(async () => {
        try {
          const res = await paymentService.checkStatus(requestId);
          console.log("Payment Status:", res);
          
          if (res.status === 'completed') {
            setStep('success');
            clearInterval(interval);
            toast.success("Payment Received!");
            // Wait 1.5s to show success checkmark, then close
            setTimeout(() => onSuccess(), 1500); 
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000); // Check every 2 seconds
    }
    return () => clearInterval(interval);
  }, [step, requestId, onSuccess]);

  const handlePay = async (e) => {
    e.preventDefault();
    // Basic Safaricom validation
    if (!phone.startsWith('254') && !phone.startsWith('07') && !phone.startsWith('01')) {
      toast.error("Please enter a valid Safaricom number");
      return;
    }

    setLoading(true);
    try {
      const res = await paymentService.initiateMpesa(booking.id, phone);
      
      // *** KEY FIX: Using 'CheckoutRequestID' from your Python return ***
      if (res.CheckoutRequestID) {
        setRequestId(res.CheckoutRequestID);
        setStep('processing');
      } else {
        toast.error("Invalid response from server");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative">
        
        {step !== 'processing' && step !== 'success' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        )}

        {/* --- STEP 1: INPUT --- */}
        {step === 'input' && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">M-Pesa Checkout</h3>
                <p className="text-xs text-gray-500">Secure Payment</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-bold">KES 1,500</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tax (16%)</span>
                <span className="font-bold">KES 240</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-bold text-lg text-green-700">
                <span>Total</span>
                <span>KES 1,740</span>
              </div>
            </div>

            <form onSubmit={handlePay}>
              <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
              <input 
                type="text" 
                placeholder="2547XXXXXXXX" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none font-mono text-lg mb-4"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                {loading ? 'Initiating...' : 'Pay Now'}
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Lock size={12} /> Encrypted & Secure
            </div>
          </div>
        )}

        {/* --- STEP 2: PROCESSING --- */}
        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
              <Smartphone className="absolute inset-0 m-auto text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your phone</h3>
            <p className="text-gray-500 text-sm">
              We sent an STK push to <span className="font-mono font-bold text-gray-800">{phone}</span>. 
              <br/>Enter your MPESA PIN to complete.
            </p>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 'success' && (
          <div className="p-12 text-center bg-green-50">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
            <p className="text-green-700 text-sm">
              Your consultation has been secured. Redirecting...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;