import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-6">You do not have the necessary permissions to view this page.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default Unauthorized;
