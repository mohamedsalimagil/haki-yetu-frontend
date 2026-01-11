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

        {/* Orders Table */} {/* Comment for orders table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"> {/* Table card container */}
          <div className="px-6 py-4 border-b border-gray-100"> {/* Table header section */}
            <h2 className="font-bold text-gray-800">Recent Orders</h2> {/* Table title */}
          </div>
          
          <div className="overflow-x-auto"> {/* Scrollable table container */}
            <table className="w-full text-left"> {/* Full-width table */}
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase"> {/* Table header */}
                <tr> {/* Header row */}
                  <th className="px-6 py-3">Order #</th> {/* Order number column header */}
                  <th className="px-6 py-3">Service</th> {/* Service column header */}
                  <th className="px-6 py-3">Date</th> {/* Date column header */}
                  <th className="px-6 py-3">Amount</th> {/* Amount column header */}
                  <th className="px-6 py-3">Status</th> {/* Status column header */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm"> {/* Table body with dividers */}
                {orders.map((order) => ( // Map through orders array
                  <tr key={order.id} className="hover:bg-gray-50"> {/* Table row with hover effect */}
                    <td className="px-6 py-4 font-mono text-gray-600">#{order.order_number}</td> {/* Order number */}
                    <td className="px-6 py-4 font-medium text-gray-900">{order.service_name}</td> {/* Service name */}
                    <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td> {/* Formatted date */}
                    <td className="px-6 py-4">KES {order.total_amount.toLocaleString()}</td> {/* Formatted amount */}
                    <td className="px-6 py-4"> {/* Status badge cell */}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold // Status badge with dynamic classes
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}> {/* Conditional styling */}
                        {order.status} {/* Status text */}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && ( // Conditional rendering for empty state
              <div className="text-center py-10 text-gray-400"> {/* Empty state container */}
                You haven't placed any orders yet. {/* Empty state message */}
              </div>
            )}
          </div> {/* End scrollable container */}
        </div> {/* End table card */}
      </div> {/* End centered container */}
    </div> // End page container
  );
};

export default Dashboard; // Export component as default

    


