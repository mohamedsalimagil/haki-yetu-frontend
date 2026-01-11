import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

const VerificationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-yellow-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-yellow-600">
            <Clock size={48} />
          </div>
          {/* Small checkmark badge */}
          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full border-4 border-white">
            <CheckCircle size={16} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for applying to join Haki Yetu. Our admin team is currently reviewing your 
          <strong> LSK Practice Number</strong> and <strong>Certificate</strong>.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-8 text-left">
          <h3 className="text-sm font-bold text-blue-800 mb-1">What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span> Verification typically takes 24-48 hours.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span> You will receive an email once approved.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span> Once verified, you can set your availability and accept bookings.
            </li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 group"
        >
          Return to Client Dashboard 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>
    </div>
  );
};

export default VerificationPending;