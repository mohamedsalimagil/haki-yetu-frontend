import React, { useState } from 'react';
import { Star, X, Loader } from 'lucide-react';
import clientService from '../../services/client.service';
import { useAuth } from '../../context/AuthContext';

const RatingModal = ({ isOpen, onClose, orderId, lawyerId, lawyerName, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the clientService instead of a raw fetch
      const reviewData = await clientService.submitReview({
        lawyer_id: lawyerId, // Now passed as a prop from ClientDashboard
        order_id: orderId,
        rating: rating,
        comment: comment.trim() || null
      });

      setSuccess(true);

      // Notify parent component to update UI (e.g., hide the "Rate" button)
      if (onReviewSubmitted) {
        onReviewSubmitted(reviewData);
      }

      // Close modal after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      // Handle errors from the service
      setError(err.response?.data?.error || err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoverRating(0);
      setComment('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rate this Lawyer</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600 fill-current" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your review has been submitted successfully.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  How would you rate your experience with <span className="font-semibold">{lawyerName}</span>?
                </p>

                {/* Star Rating Selection */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isSubmitting}
                      className="focus:outline-none disabled:opacity-50 transform transition hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex justify-between px-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Comment Field */}
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="What did you like or what could be improved?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
