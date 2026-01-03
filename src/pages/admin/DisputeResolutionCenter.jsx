import React, { useState } from 'react';
import { Search, TrendingUp, Clock, DollarSign, AlertTriangle, ChevronLeft } from 'lucide-react';
import { mockDisputeDetails } from '../../data/mockDisputes';

const DisputeResolutionCenter = () => {
  const [selectedCase, setSelectedCase] = useState('HY-4092');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const cases = [
    {
      id: 'HY-4092',
      parties: 'J. Doe vs Adv. Kember',
      subtitle: 'Lawyer No-show',
      service: 'Notarization',
      status: 'Pending Review',
      statusColor: 'yellow'
    },
    {
      id: 'HY-4088',
      parties: 'Alice M. vs Adv. Maina',
      subtitle: 'Payment Dispute',
      service: 'Consultation',
      status: 'Escalated',
      statusColor: 'red'
    },
    {
      id: 'HY-4012',
      parties: 'Sarah K. vs Adv. Ochieng',
      subtitle: 'Quality of Service',
      service: 'Drafting',
      status: 'Resolved',
      statusColor: 'green'
    }
  ];

  const caseDetails = mockDisputeDetails[selectedCase] || mockDisputeDetails['HY-4092'];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Escalated':
        return 'bg-red-100 text-red-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#0A1E41] text-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">Haki Yetu</h1>
                <p className="text-xs text-blue-200">ADMIN PANEL</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </a>
            <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">Users</span>
            </a>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">Disputes</span>
            </button>
            <a href="/admin/logs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">Logs</span>
            </a>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Dashboard</span>
                <span>&gt;</span>
                <span className="text-gray-900 font-medium">Dispute Resolution Center</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution Center</h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Open Disputes</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">24</p>
                <span className="text-sm text-green-600 font-medium">+12% vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Mediation</h3>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">8</p>
                <span className="text-sm text-green-600 font-medium">+2 new today</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Resolution Time</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">48 hrs</p>
                <span className="text-sm text-green-600 font-medium">-5 hrs improved</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Refunds (KES)</h3>
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">120k</p>
                <span className="text-sm text-red-600 font-medium">+1% increase</span>
              </div>
            </div>
          </div>

          {/* Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Case List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Case ID, Client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Statuses</option>
                    <option>Pending Review</option>
                    <option>Escalated</option>
                    <option>Resolved</option>
                  </select>
                </div>

                {/* Case Items */}
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {cases.map((caseItem) => (
                    <button
                      key={caseItem.id}
                      onClick={() => setSelectedCase(caseItem.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedCase === caseItem.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-blue-600">#{caseItem.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{caseItem.parties}</p>
                      <p className="text-xs text-gray-600 mb-2">{caseItem.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{caseItem.service}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Case Details */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Case #{selectedCase}</h2>
                    <p className="text-sm text-gray-600">Opened Oct 24 • Notarization</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(caseDetails.status)}`}>
                    {caseDetails.status}
                  </span>
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Issue Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{caseDetails.description}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Value: <span className="font-semibold">KES {caseDetails.value?.toLocaleString()}</span></span>
                    <span className="text-gray-600">Priority: <span className="font-semibold text-red-600">{caseDetails.priority}</span></span>
                  </div>
                </div>

                {/* Evidence */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Evidence</h3>
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                {/* Communication Log */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Communication Log</h3>
                  <div className="space-y-3">
                    {caseDetails.communicationLog?.map((log, index) => (
                      <div key={index} className={`p-3 rounded-lg ${log.type === 'system' ? 'bg-gray-100' : 'bg-blue-50'}`}>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{log.sender}</p>
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Approve Refund (KES {caseDetails.value?.toLocaleString()})
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Message
                  </button>
                  <button className="px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                    Sanction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolutionCenter;
