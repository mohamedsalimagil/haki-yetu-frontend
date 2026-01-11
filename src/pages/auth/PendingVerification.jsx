import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const PendingVerification = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('kyc_submitted') !== 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Thank you for submitting your details. Your account is currently under review.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Verification in Progress</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                  <p>To ensure the integrity of legal services on Haki Yetu, we manually verify all client identities.</p>
                  <div className="mt-3 bg-blue-100 dark:bg-blue-800 rounded-md p-2 w-fit">
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Estimated Time: 2-24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
