import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Printer, Book, MessageCircle, Search } from 'lucide-react';

const DisputeConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disputeId, category, dateSubmitted } = location.state || {
    disputeId: '#HY-2023-8492',
    category: 'Land Dispute',
    dateSubmitted: 'October 24, 2023'
  };

  const steps = [
    {
      id: 1,
      label: 'Submitted',
      subtitle: 'We have your files',
      status: 'completed'
    },
    {
      id: 2,
      label: 'Advocate Review',
      subtitle: 'Est. 48 hours',
      status: 'active'
    },
    {
      id: 3,
      label: 'Initial Feedback',
      subtitle: 'Next step',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/client/dashboard')} className="hover:text-blue-600">Dashboard</button>
            <span>/</span>
            <button onClick={() => navigate('/client/support')} className="hover:text-blue-600">Legal Services</button>
            <span>/</span>
            <span className="text-gray-900">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Dispute Submitted Successfully
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Thank you for trusting <span className="text-blue-600 font-semibold">Haki Yetu</span>. Your case has been securely received and logged in our system for review.
          </p>

          {/* Submission Details Box */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">SUBMISSION DETAILS</h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Printer className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Reference ID</p>
                <p className="font-bold text-gray-900">{disputeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date Submitted</p>
                <p className="font-semibold text-gray-900">{dateSubmitted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-blue-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                  </svg>
                  {category}
                </p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-6">What happens next?</h3>
            
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              <div className="absolute top-6 left-0 w-1/3 h-0.5 bg-blue-600 -z-10" />
              
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    step.status === 'completed' 
                      ? 'bg-blue-600' 
                      : step.status === 'active'
                      ? 'bg-white border-2 border-blue-600'
                      : 'bg-gray-200'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : step.status === 'active' ? (
                      <Search className="w-6 h-6 text-blue-600" />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <p className={`font-semibold text-sm text-center ${
                    step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 text-center">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => navigate('/client/dashboard')}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/client/support')}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Track Status →
            </button>
          </div>

          {/* Help Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
              <div className="bg-blue-100 rounded-lg p-2">
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Dispute FAQs</h4>
                <p className="text-xs text-gray-600">Common questions about the process</p>
              </div>
            </button>

            <button className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
              <div className="bg-blue-100 rounded-lg p-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Contact Support</h4>
                <p className="text-xs text-gray-600">Need immediate assistance?</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm11-3a1 1 0 10-2 0v3a1 1 0 001 1h1a1 1 0 100-2h0V7z"/>
            </svg>
            Proudly serving Kenya
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisputeConfirmation;
