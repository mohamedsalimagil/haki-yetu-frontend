import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, totalReviews, showCount = true }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      {showCount && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
