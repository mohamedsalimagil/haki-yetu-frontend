import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../context/ToastContext';
import paymentService from '../../services/payment.service';

const PaymentModal = ({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const { success, error: showError } = useToast();

  if (!isOpen) return null;

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^(\+254|254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number')
  });

  const handlePayment = async (values, { setSubmitting, setErrors }) => {
    try {
      setPaymentStatus('processing');

      const result = await paymentService.processPayment(
        values.phoneNumber,
        bookingDetails.amount,
        bookingDetails.id
      );

      setPaymentData(result);

      if (result.success) {
        setPaymentStatus('success');
        success('Payment initiated successfully! Check your phone for M-Pesa prompt.');

        // Call success callback with payment reference
        if (onPaymentSuccess) {
          onPaymentSuccess({
            paymentReference: result.paymentReference,
            transactionId: result.transactionId,
            amount: bookingDetails.amount
          });
        }

        // Auto-close after success
        setTimeout(() => {
          onClose();
          setPaymentStatus('idle');
          setPaymentData(null);
        }, 3000);

      } else {
        throw new Error(result.message || 'Payment failed');
      }

    } catch (err) {
      setPaymentStatus('failed');
      setErrors({ submit: err.message });
      showError(err.message);

      if (onPaymentFailure) {
        onPaymentFailure(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    setPaymentData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Complete Payment
          </h2>
          <button
            onClick={resetModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'idle' && (
            <>
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{bookingDetails.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lawyer:</span>
                    <span className="font-medium">{bookingDetails.lawyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="font-medium">KES {bookingDetails.processingFee || 150}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-2">
                    <span>Total Amount:</span>
                    <span>KES {bookingDetails.amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <Formik
                initialValues={{ phoneNumber: '' }}
                validationSchema={validationSchema}
                onSubmit={handlePayment}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <div className="relative">
                        <Field
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="e.g., 0712345678 or +254712345678"
                          className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                            errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      <ErrorMessage name="phoneNumber">
                        {(msg) => (
                          <p className="mt-1 text-sm text-red-600">{msg}</p>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">M-Pesa Payment Instructions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Enter your registered M-Pesa phone number</li>
                            <li>You'll receive a payment prompt on your phone</li>
                            <li>Enter your M-Pesa PIN to complete the payment</li>
                            <li>Payment will be processed instantly</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <ErrorMessage name="submit">
                      {(msg) => (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={resetModal}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600 mb-4">
                Sending M-Pesa payment request...
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please check your phone for the M-Pesa payment prompt and enter your PIN.
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Your payment has been processed successfully.
              </p>
              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Reference:</span>
                      <span className="font-mono font-medium">{paymentData.paymentReference}</span>
                    </div>
                    {paymentData.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono font-medium">{paymentData.transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">KES {bookingDetails.amount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't process your payment. Please try again.
              </p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
