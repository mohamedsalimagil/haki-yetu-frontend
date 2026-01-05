import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Scale, Book, MessageCircle, FileText, Clock, CheckCircle } from 'lucide-react';
import BackButton from '../../../components/common/BackButton';
import { useAuth } from '../../../context/AuthContext';

const SupportLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const quickActions = [
    {
      id: 'dispute',
      icon: Scale,
      title: 'Dispute Resolution',
      description: 'Report an issue with a service',
      buttonText: 'File a Dispute',
      action: () => navigate('/client/support/initiate'),
      primary: true,
      color: 'blue'
    },
    {
      id: 'kb',
      icon: Book,
      title: 'FAQs & Guides',
      description: 'Browse help articles and documentation',
      buttonText: 'View Articles',
      action: () => {},
      color: 'green'
    },
    {
      id: 'chat',
      icon: MessageCircle,
      title: 'Contact Agent',
      description: 'Chat with our support team',
      buttonText: 'Start Chat',
      action: () => {},
      color: 'purple'
    }
  ];

  const recentActivity = [
    // Empty for now - will be populated from API
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton to="/client/dashboard" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hello, {user?.firstName || 'there'}. How can we help you today?
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Get instant answers or connect with our support team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className={`bg-white rounded-xl border-2 ${
                  action.primary ? 'border-blue-500' : 'border-gray-200'
                } p-6 hover:shadow-lg transition`}
              >
                <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 mb-6">{action.description}</p>
                <button
                  onClick={action.action}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    action.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active support requests</p>
              <p className="text-sm text-gray-400 mt-1">
                Your support tickets and disputes will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportLanding;
