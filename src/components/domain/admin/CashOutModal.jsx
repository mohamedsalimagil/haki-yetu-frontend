import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import adminService from '../../../services/adminService';

const CashOutModal = ({ isOpen, onClose, adminWalletBalance, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // form, confirm, processing, success, error

  const minimumAmount = 5000;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawalAmount = parseInt(amount.replace(/,/g, ''));

    // Validate amount
    if (withdrawalAmount < minimumAmount) {
      alert(`Minimum withdrawal amount is KES ${minimumAmount.toLocaleString()}`);
      return;
    }

    if (withdrawalAmount > adminWalletBalance) {
      alert('Withdrawal amount cannot exceed your available balance');
      return;
    }

    // Validate phone number
    if (!phoneNumber.match(/^254\d{9}$/)) {
      alert('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('processing');
    setLoading(true);

    try {
      const withdrawalAmount = parseInt(amount.replace(/,/g, ''));
      await adminService.initiateCashOut(withdrawalAmount, phoneNumber);

      setStep('success');
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Cash out failed:', error);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setAmount('');
    setPhoneNumber('');
    setStep('form');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative transition-colors">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {step === 'form' && 'Withdraw Earnings'}
            {step === 'confirm' && 'Confirm Withdrawal'}
            {step === 'processing' && 'Processing Withdrawal'}
            {step === 'success' && 'Withdrawal Successful'}
            {step === 'error' && 'Withdrawal Failed'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Balance
              </label>
              <div className="text-2xl font-bold text-green-600">
                KES {adminWalletBalance.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdrawal Amount (KES)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: KES {minimumAmount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\s/g, ''))}
                placeholder="0712345678"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Number registered with M-Pesa
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Processing Time
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Funds typically arrive within 24-48 hours via M-Pesa.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue to Confirm
            </button>
          </form>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Withdrawal Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">KES {parseInt(amount.replace(/,/g, '')).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phone Number:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                  <span className="font-medium text-gray-900 dark:text-white">KES 0</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Final Confirmation
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This action cannot be undone. Please confirm the details are correct.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="text-center space-y-4">
            <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Processing Withdrawal</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Please wait while we process your withdrawal request...
              </p>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Withdrawal Initiated!</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Your withdrawal request has been submitted. Funds will be sent to {phoneNumber} within 24-48 hours.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Done
            </button>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="text-center space-y-4">
            <X className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Withdrawal Failed</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We encountered an error processing your withdrawal. Please try again or contact support.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CashOutModal;
