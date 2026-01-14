import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import api from '../../../services/api';

const PaymentStatus = ({ paymentId, onSuccess, onFailure, onCancel }) => {
  const [status, setStatus] = useState('pending'); // pending, processing, completed, failed, cancelled
  const [message, setMessage] = useState('Waiting for M-Pesa PIN entry...');
  const [pollingCount, setPollingCount] = useState(0);
  const [isPolling, setIsPolling] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const MAX_POLLING_ATTEMPTS = 60; // 5 minutes (60 * 5 seconds)
  const POLLING_INTERVAL = 5000; // 5 seconds

  useEffect(() => {
    if (!paymentId || !isPolling) return;

    const pollPaymentStatus = async () => {
      try {
        const response = await api.get(`/api/payments/${paymentId}/status`);
        const paymentStatus = response.data.status;
        const emailConfirmed = response.data.email_sent || response.data.email_confirmed;

        setPollingCount(prev => prev + 1);

        // Update email sent status
        if (emailConfirmed) {
          setEmailSent(true);
        }

        switch (paymentStatus) {
          case 'completed':
            // Only mark as completed if both transaction is done AND email is sent
            if (emailConfirmed) {
              setStatus('completed');
              setMessage('Payment successful! Your KRA-approved receipt has been sent to your email.');
              setIsPolling(false);
              onSuccess && onSuccess(response.data);
            } else {
              // Transaction completed but email not yet sent - keep processing
              setStatus('processing');
              setMessage('Payment confirmed! Sending your KRA-approved receipt to your email...');
            }
            break;

          case 'failed':
            setStatus('failed');
            setMessage('Payment failed. Please try again.');
            setIsPolling(false);
            onFailure && onFailure(response.data);
            break;

          case 'cancelled':
            setStatus('cancelled');
            setMessage('Payment was cancelled.');
            setIsPolling(false);
            onCancel && onCancel(response.data);
            break;

          case 'processing':
            setStatus('processing');
            setMessage(emailSent ? 'Sending receipt to your email...' : 'Processing payment...');
            break;

          default:
            // Still pending, continue polling
            setStatus('pending');
            if (pollingCount >= MAX_POLLING_ATTEMPTS) {
              setMessage('Payment timeout. Please check your M-Pesa messages.');
              setStatus('timeout');
              setIsPolling(false);
              onFailure && onFailure({ error: 'timeout' });
            }
            break;
        }
      } catch (error) {
        console.error('Payment status polling error:', error);

        // If it's a network error, show a different message than "Unable to connect"
        if (!error.response) {
          setMessage('Checking payment status...');
          // Continue polling for network errors
        } else {
          setMessage('Payment verification in progress...');
        }

        // Continue polling even on errors, unless we've exceeded max attempts
        if (pollingCount >= MAX_POLLING_ATTEMPTS) {
          setMessage('Unable to verify payment status. Please contact support.');
          setStatus('error');
          setIsPolling(false);
          onFailure && onFailure(error);
        }
      }
    };

    // Initial poll
    pollPaymentStatus();

    // Set up polling interval
    const intervalId = setInterval(pollPaymentStatus, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [paymentId, pollingCount, isPolling, onSuccess, onFailure, onCancel]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
      case 'timeout':
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-8 h-8 text-gray-500" />;
      case 'processing':
        return <Loader className="w-8 h-8 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-700 dark:text-green-300';
      case 'failed':
      case 'timeout':
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'cancelled':
        return 'text-gray-700 dark:text-gray-300';
      case 'processing':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-yellow-700 dark:text-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full text-center transition-colors">
        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <h3 className={`text-lg font-bold mb-2 ${getStatusColor()}`}>
          {status === 'pending' && 'Processing Payment'}
          {status === 'processing' && 'Processing Payment'}
          {status === 'completed' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
          {status === 'cancelled' && 'Payment Cancelled'}
          {status === 'timeout' && 'Payment Timeout'}
          {status === 'error' && 'Payment Error'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Progress indicator for pending/processing */}
        {(status === 'pending' || status === 'processing') && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((pollingCount / MAX_POLLING_ATTEMPTS) * 100, 90)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Checking status... ({pollingCount * 5}s elapsed)
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          {status === 'completed' && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Continue
            </button>
          )}

          {(status === 'failed' || status === 'timeout' || status === 'error' || status === 'cancelled') && (
            <>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </>
          )}

          {(status === 'pending' || status === 'processing') && (
            <button
              onClick={() => {
                setIsPolling(false);
                setStatus('cancelled');
                setMessage('Payment monitoring cancelled.');
                onCancel && onCancel();
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Additional info for pending state */}
        {status === 'pending' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>M-Pesa Instructions:</strong><br />
              1. Check your phone for the STK Push notification<br />
              2. Enter your M-Pesa PIN<br />
              3. Approve the payment<br />
              4. Wait for confirmation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
