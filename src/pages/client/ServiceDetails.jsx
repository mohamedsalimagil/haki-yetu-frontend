import React, { useState, useEffect } from 'react';// Import React and hooks for state and lifecycle
import { useParams, useNavigate, useLocation } from 'react-router-dom';// Import routing hooks for params and navigation (Combined to fix error)
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';// Import icon components for UI
import api from '../../services/api';// Import API service for HTTP requests
import BookingForm from '../../components/domain/marketplace/BookingForm';

const ServiceDetails = () => { // Define functional component for service details page
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // Get navigation function for routing

    const [service, setService] = useState(null);// State for storing service data
    const [loading, setLoading] = useState(true);// State for tracking loading status
    const [ordering, setOrdering] = useState(false);  // State for tracking order submission
    const [error, setError] = useState(null);// State for storing error messages

    useEffect(() => {// Effect hook to fetch data on component mount
        const fetchService = async () => {// Async function to fetch service details
            try {// Try block for error handling
                const response = await api.get(`/marketplace/services/${id}`);// API call to get service by ID
                setService(response.data);// Update state with fetched service data
            } catch (err) {// Catch block for error handling
                setError('Service not found');// Set error message if fetch fails
            } finally {// Finally block to clean up
                setLoading(false);// Set loading to false regardless of success/failure
            }
        };
        fetchService();// Call the fetch function
    }, [id]);// Dependency array - re-run when ID changes

    const handleBooking = async ({ date, time }) => {
        setOrdering(true);
        
        // 1. SAFETY: Ensure we have strings
        // If 'date' is a Date object, convert it. If it's a string, keep it.
        const dateStr = typeof date === 'object' ? date.toISOString().split('T')[0] : date;
        
        // Ensure time is just HH:MM (remove seconds if they exist)
        const timeStr = time.length > 5 ? time.substring(0, 5) : time;

        const payload = {
            client_id: 1, 
            lawyer_id: 1, 
            service_id: parseInt(id),
            date: dateStr,
            time: timeStr
        };

        console.log(" Sending Payload:", payload); // Look at this in Console (F12)

        try {
            const response = await api.post('/marketplace/bookings', payload);
            alert(`Success! Reference: ${response.data.booking_reference}`);
            
            // Navigate to checkout with the price data
            navigate(`/checkout/${response.data.booking_id}`, { 
                state: { 
                    serviceName: service.name,
                    price: service.price // <--- Pass the real price here
                } 
            });
            
        } catch (err) {
            console.error(" Booking Failed:", err);
            
            // 2. BETTER ERROR MESSAGE: Show exactly what the backend said
            if (err.response) {
                alert(`Server Error: ${err.response.data.error || err.response.statusText}`);
            } else {
                alert("Network Error: Could not reach the server.");
            }
        } finally {
            setOrdering(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;// Show loading indicator
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;// Show error message

    return ( // Return JSX for component
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-6 hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-3">
                    
                    {/* Left: Info Section */}
                    <div className="md:col-span-2 p-8">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded-full">
                            {service.category || 'Legal'}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{service.name}</h1>
                        <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-primary" />
                                {service.processing_days} Days Turnaround
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Verified Lawyer
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Box (UPDATED) */}
                    <div className="bg-gray-50 p-8 border-l border-gray-100 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm">Consultation Fee</p>
                            <p className="text-4xl font-bold text-gray-900">
                                KES {service.price ? service.price.toLocaleString() : '0'}
                            </p>
                        </div>
                        
                        {/* THIS IS THE NEW PART: The Booking Form Component */}
                        <BookingForm onBookingSubmit={handleBooking} loading={ordering} />
                        
                        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Payment held in escrow
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;