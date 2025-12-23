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
