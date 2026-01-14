import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Search, Filter, FileText, Check, XCircle, Upload, Download } from 'lucide-react';
import FileUpload from '../../components/domain/marketplace/FileUpload'; // Import the new component
import BackButton from '../../components/common/BackButton';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [emptyStateMessage, setEmptyStateMessage] = useState('');

  // NEW: State for the Upload Modal
  const [selectedOrderForUpload, setSelectedOrderForUpload] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Use unified transactions endpoint that includes consultations + marketplace orders
        const response = await api.get('/client/transactions');
        setOrders(response.data.orders || []);

        // Clear any previous empty state message on successful fetch
        setEmptyStateMessage('');
      } catch (err) {
        console.error("Failed to load history:", err);

        // Check if backend returns a specific empty state message
        if (err.response?.data?.message) {
          console.log("Backend message:", err.response.data.message);
          // Check for the specific "Breakdown service" message
          if (err.response.data.message.includes("Breakdown service")) {
            setEmptyStateMessage(err.response.data.message);
          }
        }

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

  // Handle PDF download for completed transactions
  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await api.get(`/api/marketplace/orders/${orderId}/receipt`, {
        responseType: 'blob', // Important for PDF downloads
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      // You might want to show a toast notification here
    }
  };

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

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    {/* Upload Document Button */}
                    <button
                      onClick={() => setSelectedOrderForUpload(order.id)}
                      className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center transition mr-2"
                      title="Upload Document"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                    </button>

                    {/* Download Receipt Button - Only for completed transactions */}
                    {order.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReceipt(order.id)}
                        className="text-xs font-bold text-green-600 border border-green-600 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center transition"
                        title="Download Receipt"
                      >
                        <Download className="w-3 h-3 mr-1" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>
                {emptyStateMessage ||
                  (orders.length === 0
                    ? "You do not have any transactions on the Haki Yetu platform yet."
                    : "No transactions found for this filter.")}
              </p>
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
