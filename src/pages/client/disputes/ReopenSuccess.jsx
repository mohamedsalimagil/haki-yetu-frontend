import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';

const ReopenSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disputeId, originalId, status } = location.state || {
    disputeId: '#HY-DISP-890',
    originalId: '#HY-8832',
    status: 'Pending Review'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">Jomo Kenyatta</span>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">JK</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border-4 border-t-blue-600 p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Dispute Reopening Request Submitted!
          </h1>
          <p className="text-gray-600 mb-8">
            We have successfully received your request to reopen <span className="font-semibold">Dispute {originalId}</span>. Our legal admin team has been notified and will review your submitted evidence and explanation.
          </p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reference ID</p>
                <p className="text-lg font-bold text-gray-900">{disputeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Status</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Est. Response</p>
                <p className="text-lg font-medium text-gray-900">24-48 Hours</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/client/disputes/list')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Track Status
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-8">
            A confirmation SMS and email have been sent to your registered contacts.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Haki Yetu. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReopenSuccess;
