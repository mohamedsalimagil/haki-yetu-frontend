import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Search, Filter, FileText, Check, XCircle, Upload } from 'lucide-react';
import FileUpload from '../../components/domain/marketplace/FileUpload'; // Import the new component
import BackButton from '../../components/common/BackButton';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // NEW: State for the Upload Modal
  const [selectedOrderForUpload, setSelectedOrderForUpload] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Use /mine endpoint which gets orders for authenticated user via JWT
        const response = await api.get('/api/marketplace/orders/mine');
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Failed to load history:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        <BackButton className="mb-6" />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-xs uppercase text-gray-500 dark:text-gray-300 font-semibold">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">#{order.order_number}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.service_name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">KES {order.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                      {order.status === 'completed' ? <Check className="w-3 h-3 mr-1" /> : null}
                      {order.status}
                    </span>
                  </td>

                  {/* NEW: Upload Button Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrderForUpload(order.id)}
                      className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center transition"
                    >
                      <Upload className="w-3 h-3 mr-1" /> Upload Doc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>No transactions found for this filter.</p>
            </div>
          )}
        </div>

        {/* NEW: The Upload Modal */}
        {selectedOrderForUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative transition-colors">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Upload Document</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Attach necessary legal documents for Order #{selectedOrderForUpload}</p>

              {/* The Drag & Drop Component */}
              <FileUpload
                orderId={selectedOrderForUpload}
                onUploadSuccess={() => alert('Uploaded successfully!')}
              />

              <button
                onClick={() => setSelectedOrderForUpload(null)}
                className="mt-6 w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition"
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

export default OrderHistory;
