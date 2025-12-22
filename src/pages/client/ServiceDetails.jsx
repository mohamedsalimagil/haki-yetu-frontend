import React, { useState, useEffect } from 'react';// Import React and hooks for state and lifecycle
import { useParams, useNavigate } from 'react-router-dom';// Import routing hooks for params and navigation
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';// Import icon components for UI
import api from '../../services/api';// Import API service for HTTP requests

const ServiceDetails = () => { // Define functional component for service details page
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // Get navigation function for routing

    const [service, setService] = useState(null);// State for storing service data
    const [loading, setLoading] = useState(true);// State for tracking loading status
    const [ordering, setOrdering] = useState(false);  // State for tracking order submission
    const [error, setError] = useState(null);// State for storing error messages

    useEffect(() => {// Effect hook to fetch data on component mount
        const fetchService = async () => {// // Async function to fetch service details
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

  const handleOrder = async () => {// Function to handle service ordering
    setOrdering(true);// Set ordering state to true to show processing
    try {// Try block for order submission 
        // Hardcoded client_id for now until Auth is merged
      const payload = { // Create payload for order
        service_id: service.id,// Include service ID from state
        client_id: 1 // Temporary hardcoded client ID
      };
      
      const response = await api.post('/marketplace/orders', payload);// Submit order to API
      alert(`Success! Order #${response.data.order_number} created.`);// Show success message
      navigate('/services'); // Go back to catalog
    } catch (err) {// Catch block for order errors
      alert("Failed to create order. Please try again.");// Show error alert
    } finally {// Finally block to clean up
      setOrdering(false);// Reset ordering state
    }
  };
      
 








 