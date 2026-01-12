import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, CheckCircle, Clock, FileText, UserCheck, ArrowRight, Mail } from 'lucide-react';

const VerificationPending = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Shield className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Haki Yetu</span>
        </div>
        <button onClick={handleLogout} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm">
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-64px)]">
        <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center p-12">

          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Your profile is currently under review. Once your details are verified and everything adds up, you will be informed via email and officially added to the site.
          </p>

          {/* Status Steps */}
          <div className="flex justify-center items-center gap-4 mb-10 relative">
            {/* Connecting Line */}
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-100 -z-10"></div>

            <div className="flex flex-col items-center gap-2 w-24">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <UserCheck size={20} />
              </div>
              <span className="text-xs font-bold text-blue-700">Registered</span>
            </div>

            <div className="flex flex-col items-center gap-2 w-24">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold text-blue-700">Documents</span>
            </div>

            <div className="flex flex-col items-center gap-2 w-24">
              <div className="w-10 h-10 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                <Clock size={20} className="animate-pulse" />
              </div>
              <span className="text-xs font-bold text-gray-900">Verification</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left flex items-start gap-4 mb-8">
            <div className="bg-white p-2 rounded-lg shrink-0">
              <Shield className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">We are verifying your credentials</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our team is manually checking the details you provided. You will receive an email notification as soon as this process is complete.
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                <Mail size={12} />
                Notification will be sent via Email
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              Check your email for updates
            </div>
            <a href="#" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              Need help? Contact Support <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
