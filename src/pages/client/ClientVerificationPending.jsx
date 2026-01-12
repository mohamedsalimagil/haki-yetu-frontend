import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientVerificationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Registration Successful!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Thank you for submitting your details. Your account is currently under review.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700 transition-colors">

          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">✓</div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Registered</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">✓</div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Documents</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-blue-600 dark:border-blue-500 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-2">3</div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">Verification</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 transition-colors">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Verification in Progress</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <p>Once admin approves your signup details you will be notified and be able to access lawyer services.</p>
                  <div className="mt-3 bg-blue-100 dark:bg-blue-800 rounded-md p-2 w-fit">
                    <span className="font-semibold text-blue-900 dark:text-blue-200">Estimated Time: 2-24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
            <button onClick={() => navigate('/')} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">Return to Homepage</button>
            <span className="text-sm text-gray-500 dark:text-gray-400">Check your email for updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientVerificationPending;
