import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, FileText, Calendar, MousePointer } from 'lucide-react';
import { mockOrders } from '../../../data/mockDisputes';

const InitiateDispute = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('All Services');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.advocate.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSelectOrder = (order) => {
    navigate('/client/support/details', { state: { order } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/client/dashboard')} className="hover:text-blue-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/client/support')} className="hover:text-blue-600">Support</button>
            <span>/</span>
            <span className="text-gray-900">Initiate Dispute</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            <h3 className="font-semibold text-gray-900">DISPUTE RESOLUTION PROCESS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                <MousePointer className="w-6 h-6 text-blue-600" />
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
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
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
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      {order.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {order.advocate.avatar}
                        </div>
                        <span className="text-sm text-gray-900">{order.advocate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed' 
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
                        Report Issue →
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
              Showing 1 to {filteredOrders.length} of 12 results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
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
