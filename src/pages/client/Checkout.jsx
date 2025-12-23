import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smartphone, Lock, CheckCircle, Loader } from 'lucide-react';
import api from '../../services/api';

const Checkout = () => { // Define functional component for checkout page
    const { bookingId } = useParams(); // Get booking ID from URL parameters
    const navigate = useNavigate(); // Get navigation function for routing

    const [phone, setPhone] = useState(''); // State for storing phone number input
    const [loading, setLoading] = useState(false); // State for tracking payment initiation loading
    const [paymentStatus, setPaymentStatus] = useState('idle'); // State for payment flow: idle, processing, success, failed
    const [statusMessage, setStatusMessage] = useState(''); // State for user feedback messages

    // POLLING FUNCTION
    const pollPaymentStatus = async (requestId) => { // Async function to poll payment status
        setPaymentStatus('processing'); // Set status to processing when polling starts
        setStatusMessage('Check your phone... Enter M-Pesa PIN.'); // Update user message

        const intervalId = setInterval(async () => { // Create polling interval
            try { // Try block for polling requests
                const response = await api.get(`/marketplace/payments/status/${requestId}`); // API call to check payment status

                if (response.data.status === 'completed') { // Check if payment is completed
          clearInterval(intervalId); // Stop polling
          setPaymentStatus('success'); // Update status to success
          setStatusMessage('Payment Received! Redirecting...'); // Update success message
          setTimeout(() => navigate('/dashboard'), 3000); // Redirect after 3 seconds
        }
      } catch (err) { // Catch block for polling errors
        console.error("Polling error", err); // Log error to console
      }
    }, 2000); // Check every 2 seconds


