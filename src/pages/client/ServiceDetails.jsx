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
  if (loading) return <div className="text-center py-20">Loading...</div>;// Show loading indicator
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;// Show error message

  return ( // Return JSX for component
    <div className="min-h-screen bg-gray-50 py-12 px-4"> {/* Main page container */}
      <div className="max-w-4xl mx-auto"> {/* Centered content container */}
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-6 hover:text-primary"> {/* Back button */}
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services {/* Back icon and text */}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-3"> {/* Main card with grid */}
          
          {/* Left: Info */} {/* Comment for info section */}
          <div className="md:col-span-2 p-8"> {/* Left column container */}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded-full"> {/* Category badge */}
              {service.category || 'Legal'} {/* Display category or default */}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{service.name}</h1> {/* Service name */}
            <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p> {/* Service description */}
            
            <div className="flex items-center space-x-6 text-sm text-gray-500"> {/* Metadata container */}
              <div className="flex items-center"> {/* Processing time */}
                <Clock className="w-5 h-5 mr-2 text-primary" /> {/* Clock icon */}
                {service.processing_days} Days Turnaround {/* Processing days */}
              </div>
              <div className="flex items-center"> {/* Verification badge */}
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> {/* Check icon */}
                Verified Lawyer {/* Verification text */}
              </div>
            </div>
          </div>

          {/* Right: Action Box */} {/* Comment for action section */}
          <div className="bg-gray-50 p-8 border-l border-gray-100 flex flex-col justify-center"> {/* Right column container */}
            <div className="text-center mb-6"> {/* Price container */}
              <p className="text-gray-500 text-sm">Total Cost</p> {/* Price label */}
              <p className="text-4xl font-bold text-gray-900">KES {service.price.toLocaleString()}</p> {/* Formatted price */}
            </div>
            
            <button  // Order button
              onClick={handleOrder} // Click handler
              disabled={ordering} // Disable when ordering
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-800 transition disabled:opacity-50" // Styling
            >
              {ordering ? 'Processing...' : 'Order Service'} {/* Dynamic button text */}
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center"> {/* Disclaimer */}
              <AlertCircle className="w-3 h-3 mr-1" /> Payment is held in escrow {/* Escrow note */}
            </p>
          </div>
          
        </div> {/* End main card */}
      </div> {/* End centered container */}
    </div> // End page container
  );
};

export default ServiceDetails; // Export component as default

      
 








 