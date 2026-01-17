import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
   LayoutDashboard, FileText, Briefcase, Calendar, MessageSquare,
   User, Settings, Plus, Video, Clock,
   FileCheck, DollarSign, ChevronRight, Star, TrendingUp
} from 'lucide-react';
const LawyerDashboard = () => {
   const { user, loading: authLoading } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [isOnline, setIsOnline] = useState(true);
   const [autoAccept, setAutoAccept] = useState(true);
   const [dashboardData, setDashboardData] = useState(null);

   //  SECURITY CHECK: Redirect unverified lawyers immediately
   useEffect(() => {
      if (!authLoading && user) {
         const isPending = user.verification_status === 'pending' ||
            user.verification_status === 'submitted' ||
            user.verification_status === 'unverified' ||
            user.status === 'pending';

         if (isPending) {
            console.warn(" Unverified lawyer attempted to access dashboard. Redirecting...");
            navigate('/verification-pending', { replace: true });
         }
      }
   }, [user, authLoading, navigate]);

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);
            // First check verification status
            const profileResponse = await api.get('/lawyer/profile');
            if (profileResponse.data.profile && profileResponse.data.profile.verification_status === 'pending') {
               navigate('/verification-pending');
               return;
            }

            // Then fetch stats
            const statsResponse = await api.get('/lawyer/dashboard/stats');
            setDashboardData(statsResponse.data);
         } catch (error) {
            console.error('Error fetching dashboard data:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, [navigate]);

   const stats = [
      {
         label: 'Pending Notarizations',
         value: dashboardData?.stats?.pendingNotarizations || 0,
         tag: 'Action items',
         icon: FileCheck,
         color: 'text-blue-600',
         bg: 'bg-blue-50',
         route: '/lawyer/queue'
      },
      {
         label: "Today's Consultations",
         value: dashboardData?.stats?.todaysConsultations || 0,
         tag: 'Scheduled',
         icon: Video,
         color: 'text-purple-600',
         bg: 'bg-purple-50',
         route: '/lawyer/calendar'
      },
      {
         label: 'Total Earnings (KES)',
         value: (dashboardData?.stats?.totalEarnings || 0).toLocaleString(),
         tag: 'All time',
         icon: DollarSign,
         color: 'text-green-600',
         bg: 'bg-green-50',
         route: '/lawyer/earnings'
      },
      {
         label: 'Client Rating',
         value: `${dashboardData?.stats?.clientRating || 0.0}/5.0`,
         tag: 'Average',
         icon: Star,
         color: 'text-amber-500',
         bg: 'bg-amber-50',
         route: null
      },
   ];

   if (loading) {
      return (
         <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 flex items-center justify-center transition-colors">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans flex text-slate-800 dark:text-slate-200 transition-colors">

         {/* --- 1. LEFT SIDEBAR --- */}
         <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-20 flex flex-col justify-between hidden lg:flex transition-colors">
            <div>
               <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="bg-[#2563EB] p-1.5 rounded-lg">
                     <FileText className="text-white w-5 h-5" />
                  </div>
                  <div>
                     <h1 className="font-bold text-lg text-[#0A1E41] dark:text-white">Haki Yetu</h1>
                     <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Advocate Portal</p>
                  </div>
               </div>

               <nav className="p-4 space-y-1 mt-4">
                  <NavItem icon={LayoutDashboard} label="Dashboard" active />
                  <NavItem
                     icon={FileCheck}
                     label="Notarization Queue"
                     badge={dashboardData?.stats?.pendingNotarizations > 0 ? dashboardData.stats.pendingNotarizations : null}
                     onClick={() => navigate('/lawyer/queue')}
                  />

                  <NavItem
                     icon={Calendar}
                     label="Calendar"
                     onClick={() => navigate('/lawyer/availability')}
                  />
                  <NavItem
                     icon={MessageSquare}
                     label="Messages"
                     onClick={() => navigate('/lawyer/messages')}
                  />
                  <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
               </nav>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
               <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Availability</span>
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
                     src={`https://ui-avatars.com/api/?name=${user?.first_name || 'Adv'}+${user?.last_name || 'Wanjiku'}&background=0A1E41&color=fff`}
                     className="w-8 h-8 rounded-full"
                     alt="Profile"
                  />
                  <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-bold truncate dark:text-white">Adv. {user?.last_name || 'Wanjiku'}</p>
                     <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Verified Advocate
                     </p>
                  </div>
                  <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300" />
               </div>
            </div>
         </aside>

         {/* --- 2. MAIN CONTENT (CENTER) --- */}
         <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-[#0A1E41] dark:text-white">
                     {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}, Advocate {user?.last_name || 'Counselor'}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                     Here is your activity summary for <span className="font-medium text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </p>
               </div>
               <div className="flex gap-3">
                  <button
                     onClick={() => navigate('/lawyer/availability')}
                     className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                  >
                     <Calendar size={16} /> Manage Availability
                  </button>
                  <button
                     onClick={() => navigate('/lawyer/documents/create')}
                     className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                     <Plus size={16} /> Create Document
                  </button>
               </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
               {stats.map((stat, i) => (
                  <div
                     key={i}
                     className={`bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition ${stat.route ? 'cursor-pointer' : ''}`}
                     onClick={() => stat.route && navigate(stat.route)}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                           <stat.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                           <TrendingUp size={10} /> {stat.tag}
                        </span>
                     </div>
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{stat.label}</p>
                     <h3 className="text-2xl font-bold text-[#0A1E41] dark:text-white mt-1">{stat.value}</h3>
                  </div>
               ))}
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

               {/* Left: Notarization Queue (2/3 width) */}
               <div className="xl:col-span-2 space-y-8">

                  {/* Today's Consultations */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#0A1E41] dark:text-white">Today's Consultations</h3>
                        <Link to="/lawyer/availability" className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline">View Calendar</Link>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboardData?.todaysConsultations && dashboardData.todaysConsultations.length > 0 ? (
                           dashboardData.todaysConsultations.map((consultation, i) => (
                              <div
                                 key={consultation.id}
                                 className={`border rounded-xl p-5 relative overflow-hidden ${consultation.status === 'Starting Soon'
                                    ? 'border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20'
                                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                                    }`}
                              >
                                 <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Video size={64} className="text-blue-600" />
                                 </div>
                                 <span className={`text-[10px] font-bold uppercase tracking-wider ${consultation.status === 'Starting Soon' ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                                    }`}>
                                    {consultation.status}
                                 </span>
                                 <h4 className="font-bold text-[#0A1E41] dark:text-white mt-1 mb-1">{consultation.title}</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                                    <Clock size={12} /> {consultation.time} (EAT)
                                 </p>
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                       <img src={consultation.client.avatar} className="w-6 h-6 rounded-full" alt="Client" />
                                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{consultation.client.name}</span>
                                    </div>
                                    <button className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${consultation.status === 'Starting Soon'
                                       ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                                       : 'bg-gray-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400'
                                       }`}>
                                       {consultation.status === 'Starting Soon' ? 'Join Call →' : 'Waiting...'}
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="col-span-2 text-center py-8 text-slate-400 dark:text-slate-500">
                              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No consultations scheduled for today.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Right: Widgets (1/3 width) */}
               <div className="space-y-6">

                  {/* Messages Widget */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-colors">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#0A1E41] dark:text-white text-sm">Recent Messages</h3>
                        <FileText size={14} className="text-slate-400 cursor-pointer hover:text-[#2563EB]" />
                     </div>
                     <div className="space-y-4">
                        {(dashboardData?.recentMessages || []).map((msg, i) => (
                           <div key={msg.id || i} className="flex gap-3">
                              <img src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.name || 'User'}`} className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700" alt="User" />
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-baseline">
                                    <p className="text-xs font-bold text-[#0A1E41] dark:text-white">{msg.sender?.name || 'Unknown'}</p>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{msg.time}</span>
                                 </div>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{msg.preview || msg.message}</p>
                              </div>
                              {msg.unread && (
                                 <span className="w-2 h-2 bg-[#2563EB] rounded-full mt-1"></span>
                              )}
                           </div>
                        ))}
                        {(!dashboardData?.recentMessages || dashboardData.recentMessages.length === 0) && (
                           <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No new messages</p>
                        )}
                     </div>
                     <button
                        onClick={() => navigate('/lawyer/messages')}
                        className="w-full mt-4 py-2 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 transition border-t border-gray-50 dark:border-gray-700"
                     >
                        View All Messages
                     </button>
                  </div>

                  {/* Quick Availability */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-colors">
                     <h3 className="font-bold text-[#0A1E41] dark:text-white text-sm mb-4">Quick Availability</h3>
                     <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-slate-500 dark:text-slate-400">Today, 24th Oct</span>
                           <span className="font-bold text-slate-700 dark:text-slate-300">3 slots open</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                           {['9:00', '11:00', '14:00', '16:00'].map((time, idx) => (
                              <span
                                 key={time}
                                 className={`px-2 py-1 rounded text-[10px] font-medium ${idx === 0
                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                                    : 'bg-[#2563EB] text-white'
                                    }`}
                              >
                                 {time}
                              </span>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-gray-700 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                           <div>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto-Accept</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">Instant bookings</p>
                           </div>
                        </div>
                        <div
                           onClick={() => setAutoAccept(!autoAccept)}
                           className={`w-10 h-5 ${autoAccept ? 'bg-[#2563EB]' : 'bg-gray-300 dark:bg-gray-600'} rounded-full relative cursor-pointer transition-colors`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform ${autoAccept ? 'right-0.5' : 'left-0.5'}`}></div>
                        </div>
                     </div>
                     <button
                        onClick={() => navigate('/lawyer/availability')}
                        className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                     >
                        Manage Full Schedule
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
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition group ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#0A1E41] dark:hover:text-white'
         }`}>
      <div className="flex items-center gap-3">
         <Icon size={18} className={active ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
         <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
      </div>
      {badge && (
         <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>
      )}
   </button>
);

export default LawyerDashboard;
