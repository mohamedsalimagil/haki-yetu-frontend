import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Search,
  Plus,
  Settings,
  History,
  Shield,
  Bell,
  ChevronRight,
  LifeBuoy,
  Sparkles
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [nextConsultation, setNextConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation Handlers
  const goToMarketplace = () => navigate('/marketplace');
  const goToChat = () => navigate('/chat');
  const resumeOnboarding = () => navigate('/client/onboarding');

  const showComingSoon = (feature) => {
    toast.success(`${feature} module coming in Phase 2!`, {
      icon: '🚧',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallel requests for better performance
        const [casesRes, dashboardRes, consultationsRes] = await Promise.allSettled([
          api.get('/api/case/cases'),
          api.get('/api/client/dashboard'),
          api.get('/api/client/consultations')
        ]);

        // Handle Cases
        if (casesRes.status === 'fulfilled') {
          setCases(casesRes.value.data.cases || []);
        }

        // Handle Dashboard Stats
        if (dashboardRes.status === 'fulfilled') {
          setDashboardData(dashboardRes.value.data);
        }

        // Handle Next Consultation
        if (consultationsRes.status === 'fulfilled') {
          const upcoming = consultationsRes.value.data.consultations || [];
          // Filter for future dates if needed, for now taking the first one assuming API sort order
          setNextConsultation(upcoming.length > 0 ? upcoming[0] : null);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load some dashboard information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format cases for display
  const recentActivity = (cases || []).slice(0, 3).map(caseItem => ({
    service: caseItem?.case_title || caseItem?.title || 'Legal Case',
    id: `#${caseItem?.id || 'N/A'}`,
    date: caseItem?.next_hearing_date
      ? new Date(caseItem.next_hearing_date).toLocaleDateString('en-GB')
      : new Date(caseItem?.created_at || Date.now()).toLocaleDateString('en-GB'),
    status: caseItem?.status || 'Open',
    statusColor: caseItem?.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
      caseItem?.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
        'bg-green-100 text-green-700'
  }));

  // Calculate stats from real data
  const stats = [
    {
      label: 'Active Cases',
      value: (cases?.filter(c => c?.status === 'Open' || c?.status === 'Active') || []).length.toString(),
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      label: 'Upcoming Consultations',
      value: dashboardData?.statistics?.consultations?.toString() || '0',
      icon: Video,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'Completed Orders',
      value: dashboardData?.statistics?.completed_orders?.toString() || '0',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
  ];

  const quickServices = [
    { title: 'Remote Notarization', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Draft Contract', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Book Advocate', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Land Search', icon: Search, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleQuickService = (title) => {
    let state = {};

    switch (title) {
      case 'Remote Notarization':
        // Route to all advocates as per user request
        state = { serviceCategory: 'All', serviceName: 'Remote Notarization' };
        break;
      case 'Draft Contract':
        // Route to all advocates as per user request
        state = { serviceCategory: 'All', serviceName: 'Draft Contract' };
        break;
      case 'Land Search':
        state = { serviceCategory: 'property', serviceName: 'Land Search' };
        break;
      case 'Book Advocate':
        // No filter, show all
        state = { serviceCategory: 'All', serviceName: 'All Advocates' };
        break;
      default:
        navigate('/marketplace');
        return;
    }

    navigate('/advocates', { state });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex font-sans transition-colors">

      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex flex-col justify-between fixed h-full z-10 transition-colors">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-700">
            <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg">Haki Yetu</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 mt-6">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium transition">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button onClick={() => navigate('/documents')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <FileText size={20} />
              My Documents
            </button>
            <button onClick={() => navigate('/client/consultations')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <Video size={20} />
              Consultations
            </button>
            <button onClick={() => navigate('/history')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <History size={20} />
              Order History
            </button>
            <button onClick={() => navigate('/client/support')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <LifeBuoy size={20} />
              Support
            </button>
            <button onClick={() => navigate('/client/ai-summarizer')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <Sparkles size={20} />
              AI Summarizer
            </button>
            <button onClick={() => navigate('/settings')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition">
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </div>

        {/* Bottom Badge */}
        <div className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Verified Secure</span>
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
              Your data is encrypted. All advocates are LSK verified.
            </p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-64">

        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Haki Yetu</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-gray-900 dark:text-white">Dashboard</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-6">

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Individual Account</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=0D8ABC&color=fff`} alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {(() => {
                  const hour = new Date().getHours();
                  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                  const title = user?.gender?.toLowerCase() === 'female' ? 'Madam' : 'Mr';
                  return `${greeting}, ${title} ${user?.last_name || user?.first_name || 'Client'}`;
                })()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Welcome to your legal dashboard. You have <span className="font-semibold text-primary">{cases?.filter(c => c?.status === 'Open')?.length || 0} active cases</span>.
              </p>
            </div>
            <button
              onClick={goToMarketplace}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
            >
              <Plus size={18} />
              Start New Request
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Quick Services & Recent Activity */}
            <div className="lg:col-span-2 space-y-8">

              {/* Quick Services */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">Quick Services</h3>
                  <button onClick={goToMarketplace} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    View All Services
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickServices.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickService(service.title)}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition flex flex-col items-center text-center gap-4 group h-full"
                    >
                      <div className={`p-3 rounded-full ${service.bg} group-hover:scale-110 transition-transform`}>
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">{service.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">Active Cases</h3>
                  <button className="text-gray-400 hover:text-blue-600 transition">
                    <LayoutDashboard size={18} />
                  </button>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="p-6">
                    <SkeletonLoader count={3} />
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">{error}</p>
                    <p className="text-xs text-gray-500">Please ensure Flask backend is running at http://127.0.0.1:5000</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && recentActivity.length === 0 && (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Active Cases</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Start by requesting a legal service</p>
                    <button
                      onClick={goToMarketplace}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Services
                    </button>
                  </div>
                )}

                {/* Data Table */}
                {!loading && !error && recentActivity.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-medium">Case Title</th>
                          <th className="px-6 py-4 font-medium">Case ID</th>
                          <th className="px-6 py-4 font-medium">Next Hearing</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Chat</th>
                          <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivity.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <FileText size={16} />
                              </div>
                              <span className="font-medium text-gray-800 dark:text-white text-sm">{item?.service || 'Case'}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item?.id || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item?.date || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item?.statusColor || 'bg-gray-100 text-gray-700'}`}>
                                {item?.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {item?.status === 'Open' || item?.status === 'Active' ? (
                                <button
                                  onClick={() => navigate(`/chat?caseId=${item.id.replace('#', '')}`)}
                                  className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                                >
                                  <Video size={14} />
                                  Chat
                                </button>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => showComingSoon('Case Details')}
                                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!loading && !error && recentActivity.length > 0 && (
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
                    <button
                      onClick={() => showComingSoon('Case History')}
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                      View All Cases <Users size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">

              {/* Document Status Widget */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <h3 className="font-bold text-gray-800 dark:text-white mb-6 text-sm">Document Status</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Total Documents</span>
                      <span className="font-medium text-gray-800 dark:text-white">{dashboardData?.statistics?.total_documents || 0}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/documents')}
                  className="w-full mt-8 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  View All Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
