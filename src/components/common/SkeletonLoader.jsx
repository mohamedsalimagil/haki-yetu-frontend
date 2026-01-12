import React from 'react';

const SkeletonLoader = ({ type }) => {
  if (type === 'lawyer-card') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Pricing */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4">
          <div className="flex space-x-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'booking-card') {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-48"></div>
            </div>

            <div className="space-y-2 pl-8">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 pl-8">
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>

          <div className="ml-6 space-y-3">
            <div className="text-right space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex space-y-2">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
