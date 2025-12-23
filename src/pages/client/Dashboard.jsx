import React, { useState, useEffect } from 'react'; // Import React and hooks for state and lifecycle
import api from '../../services/api'; // Import API service for HTTP requests
import { Package, Clock, FileText } from 'lucide-react'; // Import icon components for UI

const Dashboard = () => { // Define functional component for dashboard page
    const [orders, setOrders] = useState([]); // State for storing user's orders
    const [loading, setLoading] = useState(true); // State for tracking loading status

useEffect(() => { // Effect hook to fetch data on component mount
    const fetchOrders = async () => { // Async function to fetch user orders
        try { // Try block for error handling
             // Hardcoded user ID 1 for now (matches your backend logic)
        const response = await api.get('/marketplace/orders/user/1'); // API call to get orders for user ID 1
        setOrders(response.data); // Update state with fetched orders
      } catch (error) { // Catch block for error handling
        console.error("Failed to fetch orders:", error); // Log error to console
      } finally { // Finally block to clean up
        setLoading(false); // Set loading to false regardless of success/failure
      }
    };
    
     fetchOrders(); // Call the fetch function
  }, []); // Empty dependency array - run only on component mount
  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>; // Show loading indicator

    return ( // Return JSX for component
    <div className="min-h-screen bg-gray-50 py-8 px-4"> {/* Main page container */}
      <div className="max-w-6xl mx-auto"> {/* Centered content container */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1> {/* Dashboard title */}
        {/* Stats Row */} {/* Comment for stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Stats grid container */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center"> {/* Total orders card */}
            <div className="p-3 bg-blue-50 rounded-lg text-primary mr-4"> {/* Icon container */}
              <Package className="w-6 h-6" /> {/* Package icon */}
            </div>
            <div> {/* Text container */}
              <p className="text-sm text-gray-500">Total Orders</p> {/* Stat label */}
              <p className="text-2xl font-bold">{orders.length}</p> {/* Stat value from orders count */}
            </div>
          </div>
        </div> {/* End stats row */}

    


