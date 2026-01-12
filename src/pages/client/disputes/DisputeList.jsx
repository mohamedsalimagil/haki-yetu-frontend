import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, RotateCcw, Download, Grid, FileText, User, ClipboardList } from 'lucide-react';

const DisputeList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // TODO: Replace with API call to fetch disputes
  const mockDisputes = [];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const disputes = activeTab === 'active' ? mockDisputes.active : mockDisputes.archived;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Haki Yetu</h1>
                <p className="text-xs text-gray-500">Client Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <Grid className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </a>
            <a href="/services" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              <span className="text-sm">My Services</span>
            </a>
            <a href="/documents" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm">My Documents</span>
            </a>
            <a href="/client/disputes/list" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm font-medium">My Disputes</span>
            </a>
            <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <User className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </a>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">WM</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Wangari Maathai</p>
                <p className="text-xs text-gray-500">wangari.maathai@email.com</p>
              </div>
            </div>
            <button className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">My Disputes History</h1>
              <p className="text-gray-600">Track the status and resolution progress of your reported issues. We are committed to ensuring fair service delivery across Kenya.</p>
            </div>
            <button
              onClick={() => navigate('/client/disputes/initiate')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              File New Dispute
            </button>
          </div>

          {/* Tabs and Search */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Active Disputes
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === 'active' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {mockDisputes.active.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('archive')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'archive'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Dispute Archive
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Reference #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            {activeTab === 'active' && (
              <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter by Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    All Active
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    In Progress
                  </button>
                </div>
              </div>
            )}

            {/* Disputes Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      REF #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date {activeTab === 'active' ? 'Submitted' : 'Resolved'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Assigned Advocate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{dispute.ref}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{dispute.serviceType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {activeTab === 'active' ? dispute.dateSubmitted : dispute.dateResolved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dispute.assignedAdvocate ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">
                                {dispute.assignedAdvocate.avatar}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900">{dispute.assignedAdvocate.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">-- Not Assigned --</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(dispute.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {dispute.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/client/disputes/${dispute.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {activeTab === 'archive' && (
                            <button
                              onClick={() => navigate('/client/disputes/reopen', { state: { dispute } })}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Reopen Dispute"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing 1 to {disputes.length} of {activeTab === 'active' ? '3' : '2'} {activeTab === 'active' ? 'active' : 'archived'} results
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Archive Section - Export History */}
          {activeTab === 'archive' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Dispute Archive
                  </h3>
                  <p className="text-sm text-gray-600">History of resolved and closed cases.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition">
                  <Download className="w-4 h-4" />
                  Export History
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Showing {mockDisputes.archived.length} archived records
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeList;
