import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const ServicesProperty = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton className="mb-6" />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Home className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property & Land Services</h1>
          <p className="text-gray-600 mb-6">
            Expert legal services for land transfers, title deeds, property disputes, and real estate law.
          </p>
          <div className="text-sm text-gray-500">
            This feature is coming soon. Contact support for immediate assistance.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesProperty;
