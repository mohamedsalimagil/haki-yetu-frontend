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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Thank you for submitting your details. Your account is currently under review.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Verification in Progress</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>To ensure the integrity of legal services on Haki Yetu, we manually verify all client identities.</p>
                  <div className="mt-3 bg-blue-100 rounded-md p-2 w-fit">
                    <span className="font-semibold text-blue-900">Estimated Time: 2-24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6 flex justify-end">
             <button onClick={logout} className="text-sm text-red-600 hover:text-red-500 font-medium">Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
