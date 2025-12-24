import React, { useState, useEffect } from 'react'; // Import React and hooks for state and lifecycle
import api from '../../services/api'; // Import API service for HTTP requests
import { Search, Filter, FileText, Check, XCircle } from 'lucide-react'; // Import icon components for UI

const OrderHistory = () => { // Define functional component for order history page
    const [orders, setOrders] = useState([]); // State for storing user's orders
    const [filter, setFilter] = useState('all'); // State for filter: all, completed, pending
    const [loading, setLoading] = useState(true); // State for tracking loading status

    useEffect(() => { // Effect hook to fetch data on component mount
        const fetchHistory = async () => { // Async function to fetch order history
            try { // Try block for error handling
                // Fetching all orders for User 1
                const response = await api.get('/marketplace/orders/user/1'); // API call to get orders for user ID 1

                setOrders(response.data); // Update state with fetched orders
                } catch (err) { // Catch block for error handling
                  console.error("Failed to load history"); // Log error to console
                } finally { // Finally block to clean up
                  setLoading(false); // Set loading to false regardless of success/failure
      }
    };
    fetchHistory(); // Call the fetch function
}, []); // Empty dependency array - run only on component mount

// Filter Logic
const filteredOrders = orders.filter(order => { // Filter orders based on filter state
    if (filter === 'all') return true; // Return all orders if filter is 'all'
    return order.status === filter; // Return only orders matching the filter status
  });

  return ( // Return JSX for component
    <div className="min-h-screen bg-gray-50 py-12 px-4"> {/* Main page container */}
      <div className="max-w-5xl mx-auto"> {/* Centered content container */}
        <div className="flex justify-between items-center mb-8"> {/* Header container */}
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1> {/* Page title */}
          
          {/* Filter Dropdown */} {/* Comment for filter dropdown */}
          <div className="relative"> {/* Dropdown container with relative positioning */}
            <select 
              value={filter} // Bind value to filter state
              onChange={(e) => setFilter(e.target.value)} // Update filter state on change
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary focus:border-transparent" // Styling classes
            >
              <option value="all">All Transactions</option> {/* All filter option */}
              <option value="completed">Completed</option> {/* Completed filter option */}
              <option value="pending">Pending</option> {/* Pending filter option */}
            </select>
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" /> {/* Filter icon */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"> {/* Table card container */}
          <table className="w-full text-left border-collapse"> {/* Full-width table */}
            <thead> {/* Table header */}
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold"> {/* Header row styling */}
                <th className="px-6 py-4">Reference</th> {/* Reference column header */}
                <th className="px-6 py-4">Service</th> {/* Service column header */}
                <th className="px-6 py-4">Date</th> {/* Date column header */}
                <th className="px-6 py-4">Amount</th> {/* Amount column header */}
                <th className="px-6 py-4">Status</th> {/* Status column header */}
                <th className="px-6 py-4">Invoice</th> {/* Invoice column header */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm"> {/* Table body with dividers */}
              {filteredOrders.map((order) => ( // Map through filtered orders
                <tr key={order.id} className="hover:bg-gray-50 transition"> {/* Table row with hover effect */}
                  <td className="px-6 py-4 font-mono text-gray-600">#{order.order_number}</td> {/* Order reference */}
                  <td className="px-6 py-4 font-medium text-gray-900">{order.service_name}</td> {/* Service name */}
                  <td className="px-6 py-4 text-gray-500"> {/* Date cell */}
                    {new Date(order.created_at).toLocaleDateString()} {/* Formatted date */}
                  </td>
                  <td className="px-6 py-4 font-medium">KES {order.total_amount.toLocaleString()}</td> {/* Formatted amount */}
                  <td className="px-6 py-4"> {/* Status badge cell */}
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium // Status badge
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}> {/* Conditional styling */}
                        {order.status === 'completed' ? <Check className="w-3 h-3 mr-1"/> : null} {/* Check icon for completed */}
                        {order.status} {/* Status text */}
                     </span>
                  </td>
                  <td className="px-6 py-4"> {/* Invoice action cell */}
                    <button className="text-gray-400 hover:text-primary flex items-center text-xs font-semibold"> {/* PDF button */}
                      <FileText className="w-4 h-4 mr-1" /> PDF {/* File icon and text */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && ( // Conditional rendering for empty state
            <div className="text-center py-12 text-gray-400"> {/* Empty state container */}
              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" /> {/* Empty state icon */}
              <p>No transactions found for this filter.</p> {/* Empty state message */}
            </div>
          )}
        </div> {/* End table card */}
      </div> {/* End centered container */}
    </div> // End page container
  );
};

export default OrderHistory; // Export component as default









