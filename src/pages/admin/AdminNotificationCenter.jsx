import React, { useState } from 'react';
import { Search, Filter, Bell, ChevronDown } from 'lucide-react';

const AdminNotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // TODO: Replace with API call to fetch notifications
  const mockNotifications = [];

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'verification':
        return 'bg-blue-100 text-blue-800';
      case 'system':
        return 'bg-yellow-100 text-yellow-800';
      case 'feedback':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = mockNotifications.filter(notif => {
    if (activeTab === 'unread' && notif.read) return false;
    if (activeTab === 'urgent' && notif.badge !== 'urgent') return false;
    if (activeTab === 'verifications' && notif.badge !== 'verification') return false;
    return true;
  });

  const markAllAsRead = () => {
    alert('All notifications marked as read');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2 rounded">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Haki Yetu Admin</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search disputes, users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Nav */}
            <div className="flex items-center gap-6">
              <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</a>
              <a href="/admin/users" className="text-gray-600 hover:text-gray-900 text-sm">Users</a>
              <a href="/admin/disputes" className="text-gray-600 hover:text-gray-900 text-sm">Disputes</a>
              <a href="/admin/reports" className="text-gray-600 hover:text-gray-900 text-sm">Reports</a>
              
              {/* Notifications Icon */}
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">AD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Center</h1>
            <p className="text-gray-600">Manage alerts, lawyer verifications, and system updates.</p>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Notifications
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  activeTab === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Unread
                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs">3</span>
              </button>
              <button
                onClick={() => setActiveTab('urgent')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === 'urgent'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Urgent Disputes
              </button>
              <button
                onClick={() => setActiveTab('verifications')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === 'verifications'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Verifications
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Priority</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notifications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-8 px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Message Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr 
                    key={notification.id} 
                    className={`hover:bg-gray-50 transition ${!notification.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getBadgeClass(notification.badge)}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.summary}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {notification.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={notification.actionLink}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {notification.action}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">24</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">3</button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationCenter;
