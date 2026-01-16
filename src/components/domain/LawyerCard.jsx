import React from 'react';
import { Star, MapPin, Award, MessageCircle } from 'lucide-react';
import StarRating from '../common/StarRating';

const LawyerCard = ({ lawyer, onBookNow, onMessage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header with Avatar and Basic Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {lawyer.first_name?.[0] || lawyer.name?.[0] || 'L'}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {lawyer.first_name} {lawyer.last_name}
              </h3>
              {lawyer.verified && (
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{lawyer.location || 'Nairobi, Kenya'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarRating rating={lawyer.average_rating || 0} size="sm" />
              <span className="text-sm text-gray-600">
                ({lawyer.total_reviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {lawyer.specializations?.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {spec}
            </span>
          ))}
          {lawyer.specializations?.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{lawyer.specializations.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Experience & Bio */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-gray-600 text-sm line-clamp-2">
          {lawyer.bio || 'Experienced legal professional with expertise in various areas of law.'}
        </p>
        {lawyer.years_experience && (
          <p className="text-sm text-gray-500 mt-2">
            {lawyer.years_experience}+ years of experience
          </p>
        )}
      </div>

      {/* Pricing */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="text-2xl font-bold text-green-600">
              KES {lawyer.consultation_fee || lawyer.hourly_rate || lawyer.base_price || 3000}
              {(lawyer.consultation_fee || lawyer.hourly_rate) && <span className="text-sm font-normal">/session</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Response time</p>
            <p className="text-sm font-medium text-gray-900">
              {lawyer.response_time || '< 24h'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4">
        <div className="flex space-x-3">
          <button
            onClick={() => onBookNow(lawyer)}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Book Now
          </button>
          <button
            onClick={() => onMessage(lawyer)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
