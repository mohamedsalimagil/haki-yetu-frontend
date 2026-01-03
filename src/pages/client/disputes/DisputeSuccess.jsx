import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Menu } from 'lucide-react';

const DisputeSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disputeId, category, dateSubmitted } = location.state || {
    disputeId: '#HY-2023-8492',
    category: 'Land Dispute',
    dateSubmitted: 'Oct 24, 2023'
  };

  const steps = [
    { id: 1, label: 'Submitted', sublabel: '', status: 'complete' },
    { id: 2, label: 'Advocate Review', sublabel: 'Est. 48 hours', status: 'current' },
    { id: 3, label: 'Initial Feedback', sublabel: '', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 ml-2">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
          <span>/</span>
          <a href="/legal-services" className="hover:text-gray-700">Legal Services</a>
          <span>/</span>
          <span className="text-gray-900">Confirmation</span>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Dispute Submitted Successfully
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Your case has been securely received and lodged for review.
          </p>

          {/* Submission Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              SUBMISSION DETAILS
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Reference ID</p>
                <p className="text-lg font-bold text-gray-900">{disputeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date Submitted</p>
                <p className="text-lg font-medium text-gray-900">{dateSubmitted}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-lg font-medium text-gray-900">{category}</p>
              </div>
            </div>
          </div>

          {/* What happens next? */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What happens next?</h2>
            
            {/* Stepper */}
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                <div className="h-full bg-blue-600" style={{ width: '33%' }}></div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center" style={{ width: '33%' }}>
                    {/* Step Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 relative z-10 ${
                      step.status === 'complete' 
                        ? 'bg-blue-600' 
                        : step.status === 'current'
                        ? 'bg-white border-4 border-blue-600'
                        : 'bg-white border-2 border-gray-200'
                    }`}>
                      {step.status === 'complete' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : step.status === 'current' ? (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="text-center">
                      <p className={`font-semibold mb-1 ${
                        step.status === 'complete' || step.status === 'current'
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      {step.sublabel && (
                        <p className="text-xs text-gray-500">{step.sublabel}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/client/disputes/list')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Track Status
            </button>
          </div>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-blue-50 rounded-lg p-3 w-fit mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Dispute FAQs</h3>
            <p className="text-sm text-gray-600 mb-4">Common questions about the process</p>
            <a href="/faqs" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Learn More →
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-blue-50 rounded-lg p-3 w-fit mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 mb-4">Need immediate assistance?</p>
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Get Help →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeSuccess;
