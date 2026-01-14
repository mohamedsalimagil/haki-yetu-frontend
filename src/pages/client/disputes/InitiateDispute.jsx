import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Info, FileText, ClipboardCheck, Users, Calendar, Loader } from 'lucide-react';
import clientService from '../../../services/client.service';

const InitiateDispute = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('All Services');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Using "getMyBookings" which corresponds to /api/marketplace/orders
        const data = await clientService.getMyBookings();
        if (data && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    // Basic search - can be improved
    const searchLower = searchTerm.toLowerCase();
    const idMatch = order.id.toString().includes(searchLower);
    const serviceMatch = order.service_name?.toLowerCase().includes(searchLower);
    const advocateMatch = order.advocate_name?.toLowerCase().includes(searchLower);

    return idMatch || serviceMatch || advocateMatch;
  });

  const handleSelectOrder = (order) => {
    navigate('/client/disputes/form', { state: { order } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">Home</button>
              <button onClick={() => navigate('/marketplace')} className="text-gray-600 hover:text-gray-900">Services</button>
              <button onClick={() => navigate('/client/consultations')} className="text-gray-600 hover:text-gray-900">My Cases</button>
              <button onClick={() => navigate('/client/dashboard')} className="text-gray-600 hover:text-gray-900">Wallet</button>
              <button onClick={() => navigate('/client/support')} className="text-blue-600 font-medium">Support</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Book Advocate
              </button>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">JK</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/client/support')} className="hover:text-gray-900">Support</button>
          <span>/</span>
          <span className="text-gray-900">Initiate Dispute</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Service to Dispute</h1>
          <p className="text-gray-600">
            Please choose the transaction below that you are experiencing issues with. Our team is here to help ensure fair legal service delivery.
          </p>
        </div>

        {/* Dispute Resolution Process Banner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="bg-blue-100 rounded-full p-2">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">DISPUTE RESOLUTION PROCESS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">1. Select Transaction</h4>
                <p className="text-sm text-gray-600">
                  Choose the specific order from your history below.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">2. Provide Details</h4>
                <p className="text-sm text-gray-600">
                  Describe the issue and attach any evidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">3. Resolution</h4>
                <p className="text-sm text-gray-600">
                  Our team mediates to find a fair solution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID or Advocate Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Services</option>
                <option>Notarization</option>
                <option>Consultation</option>
                <option>Drafting</option>
                <option>Registration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option>Last 30 Days</option>
                  <option>Last 60 Days</option>
                  <option>Last 90 Days</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No transactions found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Advocate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cost (KES)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => handleSelectOrder(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600">
                          {order.service_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {order.advocate_name ? order.advocate_name.charAt(0) : '?'}
                            </div>
                            <span className="text-sm text-gray-900">{order.advocate_name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount ? order.amount.toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'completed' || order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectOrder(order);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            Report Issue
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredOrders.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Can't find the transaction you are looking for?{' '}
            <button onClick={() => navigate('/client/support')} className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitiateDispute;
