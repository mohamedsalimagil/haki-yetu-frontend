/**
 * Date formatting utilities for Haki Yetu application
 * Uses native JavaScript Date API for consistency
 */

/**
 * Format date to human-readable string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  return dateObj.toLocaleDateString('en-GB', defaultOptions);
};

/**
 * Format date and time to human-readable string
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format time only
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const now = new Date();

  if (isNaN(dateObj.getTime())) return '';

  const diffInMs = dateObj - now;
  const diffInMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));
  const diffInHours = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60)));
  const diffInDays = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60 * 24)));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) {
    return diffInMs > 0 ? `In ${diffInMinutes}m` : `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) {
    return diffInMs > 0 ? `In ${diffInHours}h` : `${diffInHours}h ago`;
  }
  if (diffInDays < 7) {
    return diffInMs > 0 ? `In ${diffInDays}d` : `${diffInDays}d ago`;
  }

  return formatDate(date);
};

/**
 * Format currency (KES)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'KES 0';

  return `KES ${amount.toLocaleString('en-KE')}`;
};

/**
 * Get time ago string for chat messages
 * @param {Date|string|number} date - Date to format
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const now = new Date();

  if (isNaN(dateObj.getTime())) return '';

  const diffInMs = now - dateObj;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;

  return dateObj.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric'
  });
};
