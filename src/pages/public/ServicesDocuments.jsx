import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const ServicesDocuments = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton className="mb-6" />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Services</h1>
          <p className="text-gray-600 mb-6">
            Professional document drafting and legal services for affidavits, contracts, and agreements.
          </p>
          <div className="text-sm text-gray-500">
            This feature is coming soon. Contact support for immediate assistance.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDocuments;
