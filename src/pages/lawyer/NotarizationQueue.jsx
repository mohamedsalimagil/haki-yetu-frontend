import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Briefcase, Calendar, MessageSquare,
  User, Settings, Search, Filter, Clock, AlertTriangle,
  FileCheck, DollarSign, ChevronRight, ChevronDown, Download, Eye, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NotarizationQueue = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [isOnline, setIsOnline] = useState(true);

  // TODO: Replace with API call to fetch notarization queue data
  const notarizationQueue = [];
  const lawyerStats = {
    pendingNotarizations: 0,
    todaysConsultations: 0,
    totalEarnings: 0,
    earnedToday: 0,
    clientRating: 0,
  };

  // Filter queue items
  const filteredQueue = notarizationQueue.filter(item => {
    const matchesSearch = item.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterUrgency === 'all' || item.urgency.toLowerCase() === filterUrgency.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const urgentCount = notarizationQueue.filter(item => item.urgency === 'Urgent').length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 font-sans flex text-slate-800 dark:text-slate-100 transition-colors">

      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 fixed h-full z-20 flex flex-col justify-between hidden lg:flex transition-colors">
        <div>
          <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-slate-700">
            <div className="bg-[#2563EB] p-1.5 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#0A1E41] dark:text-white">Haki Yetu</h1>
              <p className="text-[10px] text-slate-400 font-medium">Advocate Portal</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-4">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => navigate('/lawyer/dashboard')}
            />
            <NavItem
              icon={FileCheck}
              label="Notarization Queue"
              badge="3"
              active
            />
            <NavItem
              icon={Calendar}
              label="Calendar"
              onClick={() => navigate('/lawyer/availability')}
            />
            <NavItem
              icon={MessageSquare}
              label="Messages"
              badge="2"
              onClick={() => navigate('/lawyer/messages')}
            />
            <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Availability</span>
              <span className={`w-2 h-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></span>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`w-full ${isOnline ? 'bg-[#2563EB]' : 'bg-gray-500'} text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          <div className="flex items-center gap-3 px-2">
            <img
              src="https://ui-avatars.com/api/?name=Adv+Wanjiku&background=0A1E41&color=fff"
              className="w-8 h-8 rounded-full"
              alt="Profile"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Adv. Wanjiku</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Verified Advocate
              </p>
            </div>
            <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0A1E41] dark:text-white">Notarization Queue</h1>
              <p className="text-slate-500 text-sm mt-1">
                Review and process pending notarization requests
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm">
                <Download size={16} /> Export List
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
                <FileCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Pending Requests</p>
                <h3 className="text-2xl font-bold text-[#0A1E41] dark:text-white">{lawyerStats.pendingNotarizations}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Urgent Deadlines</p>
                <h3 className="text-2xl font-bold text-[#0A1E41]">{urgentCount}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Earned Today</p>
                <h3 className="text-2xl font-bold text-[#D9A13A]">KES {lawyerStats.earnedToday.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm mb-6 transition-colors">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name or document type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterUrgency('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterUrgency === 'all'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                All ({notarizationQueue.length})
              </button>
              <button
                onClick={() => setFilterUrgency('urgent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterUrgency === 'urgent'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                Urgent ({urgentCount})
              </button>
              <button
                onClick={() => setFilterUrgency('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterUrgency === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${item.urgency === 'Urgent' ? 'bg-red-500' : 'bg-[#2563EB]'
                          }`}>
                          {item.client.avatar}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-[#0A1E41] dark:text-white">{item.client.name}</div>
                          <div className={`text-xs ${item.urgency === 'Urgent' ? 'text-red-500' : 'text-slate-400'}`}>
                            {item.client.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{item.documentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-500">{item.submittedAt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${item.deadline.includes('Today') ? 'text-red-600' : 'text-slate-600'
                        }`}>
                        {item.deadline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.urgency === 'Urgent'
                        ? 'bg-red-100 text-red-700'
                        : item.urgency === 'Normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.urgency === 'Urgent'
                          ? 'bg-red-500'
                          : item.urgency === 'Normal'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                          }`}></span>
                        {item.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/lawyer/queue/review/${item.id}`}
                          className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                        >
                          Review
                        </Link>
                        <button className="p-2 bg-gray-100 text-slate-600 rounded-lg hover:bg-gray-200 transition">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredQueue.length === 0 && (
            <div className="p-12 text-center">
              <FileCheck size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No requests found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Showing {filteredQueue.length} of {notarizationQueue.length} requests
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-gray-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition">
                Next
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

// Helper Component for Sidebar Items
const NavItem = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition group ${active ? 'bg-blue-50 dark:bg-slate-700 text-[#2563EB]' : 'text-slate-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-[#0A1E41] dark:hover:text-white'
      }`}>
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'} />
      <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>
    )}
  </button>
);

export default NotarizationQueue;
