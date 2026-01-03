import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  LayoutDashboard, FileText, Briefcase, Calendar, MessageSquare, 
  User, Settings, Plus, Video, Clock, 
  FileCheck, DollarSign, ChevronRight, Star, TrendingUp
} from 'lucide-react';
import { 
  lawyerStats, 
  notarizationQueue, 
  todaysConsultations, 
  recentMessages 
} from '../../data/mockLawyerData';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await api.get('/lawyer/profile');
        if (response.data.profile.verification_status === 'pending') {
          navigate('/verification-pending');
        } else if (response.data.profile.verification_status === 'verified') {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, [navigate]);

  const stats = [
    { 
      label: 'Pending Notarizations', 
      value: lawyerStats.pendingNotarizations, 
      tag: '+2 new', 
      icon: FileCheck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      route: '/lawyer/queue'
    },
    { 
      label: "Today's Consultations", 
      value: lawyerStats.todaysConsultations, 
      tag: 'Next in 30m', 
      icon: Video, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      route: '/lawyer/calendar'
    },
    { 
      label: 'Total Earnings (KES)', 
      value: lawyerStats.totalEarnings.toLocaleString(), 
      tag: '+15% vs last wk', 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      route: '/lawyer/earnings'
    },
    { 
      label: 'Client Rating', 
      value: `${lawyerStats.clientRating}/5.0`, 
      tag: '+0.1', 
      icon: Star, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      route: null
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex text-slate-800">
      
      {/* --- 1. LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col justify-between hidden lg:flex">
        <div>
          <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
            <div className="bg-[#2563EB] p-1.5 rounded-lg">
               <FileText className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#0A1E41]">Haki Yetu</h1>
              <p className="text-[10px] text-slate-400 font-medium">Advocate Portal</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-4">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem 
              icon={FileCheck} 
              label="Notarization Queue" 
              badge={lawyerStats.pendingNotarizations > 0 ? '3' : null}
              onClick={() => navigate('/lawyer/queue')} 
            />
            <NavItem icon={Briefcase} label="My Cases" />
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
            <NavItem icon={User} label="Profile" />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
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
               src={`https://ui-avatars.com/api/?name=${user?.first_name || 'Adv'}+${user?.last_name || 'Wanjiku'}&background=0A1E41&color=fff`} 
               className="w-8 h-8 rounded-full" 
               alt="Profile" 
             />
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Adv. {user?.last_name || 'Wanjiku'}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Verified Advocate
                </p>
             </div>
             <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT (CENTER) --- */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-2xl font-bold text-[#0A1E41]">Karibu, Advocate {user?.last_name || 'Wanjiku'}</h1>
              <p className="text-slate-500 text-sm mt-1">
                Here is your daily activity summary for <span className="font-medium text-slate-700">Tuesday, 24th Oct.</span>
              </p>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => navigate('/lawyer/availability')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition shadow-sm"
              >
                 <Calendar size={16} /> Manage Availability
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                 <Plus size={16} /> Create Document
              </button>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
           {stats.map((stat, i) => (
             <div 
               key={i} 
               className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition ${stat.route ? 'cursor-pointer' : ''}`}
               onClick={() => stat.route && navigate(stat.route)}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                   </div>
                   <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                     <TrendingUp size={10} /> {stat.tag}
                   </span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#0A1E41] mt-1">{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           
           {/* Left: Notarization Queue (2/3 width) */}
           <div className="xl:col-span-2 space-y-8">
              
              {/* Notarization Queue Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#0A1E41] flex items-center gap-2">
                         <span className="w-1 h-5 bg-red-500 rounded-full"></span> Urgent Actions - Pending Notarizations
                      </h3>
                    </div>
                    <Link to="/lawyer/queue" className="text-xs font-bold text-[#2563EB] hover:underline">
                      View All
                    </Link>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-gray-50">
                          <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-100">
                          {notarizationQueue.slice(0, 3).map((item, i) => (
                             <tr key={i} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                        item.urgency === 'Urgent' ? 'bg-red-500' : 'bg-[#2563EB]'
                                      }`}>
                                         {item.client.avatar}
                                      </div>
                                      <div className="ml-3">
                                         <div className="text-sm font-medium text-gray-900">{item.client.name}</div>
                                         <div className={`text-xs ${item.urgency === 'Urgent' ? 'text-red-500' : 'text-slate-400'}`}>
                                           {item.client.type}
                                         </div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center gap-2">
                                     <FileText size={14} className="text-slate-400" />
                                     <span className="text-sm text-gray-500">{item.documentType}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                   {item.submittedAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                   }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        item.urgency === 'Urgent' ? 'bg-red-500' : 'bg-yellow-500'
                                      }`}></span>
                                      {item.urgency}
                                   </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                   <Link 
                                     to={`/lawyer/queue/review/${item.id}`}
                                     className="text-[#2563EB] hover:text-blue-800 transition font-semibold"
                                   >
                                      Review
                                   </Link>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Today's Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#0A1E41]">Today's Consultations</h3>
                    <button className="text-xs font-bold text-[#2563EB] hover:underline">View Calendar</button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {todaysConsultations.map((consultation, i) => (
                      <div 
                        key={consultation.id}
                        className={`border rounded-xl p-5 relative overflow-hidden ${
                          consultation.status === 'Starting Soon' 
                            ? 'border-blue-100 bg-blue-50/50' 
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                         <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Video size={64} className="text-blue-600" />
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${
                           consultation.status === 'Starting Soon' ? 'text-[#2563EB]' : 'text-slate-400'
                         }`}>
                           {consultation.status}
                         </span>
                         <h4 className="font-bold text-[#0A1E41] mt-1 mb-1">{consultation.title}</h4>
                         <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                           <Clock size={12}/> {consultation.time} (EAT)
                         </p>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                               <img src={consultation.client.avatar} className="w-6 h-6 rounded-full" alt="Client" />
                               <span className="text-xs font-bold text-slate-700">{consultation.client.name}</span>
                            </div>
                            <button className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                              consultation.status === 'Starting Soon'
                                ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                                : 'bg-gray-100 text-slate-500'
                            }`}>
                              {consultation.status === 'Starting Soon' ? 'Join Call →' : 'Waiting...'}
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right: Widgets (1/3 width) */}
           <div className="space-y-6">
              
              {/* Messages Widget */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#0A1E41] text-sm">Recent Messages</h3>
                    <FileText size={14} className="text-slate-400 cursor-pointer hover:text-[#2563EB]" />
                 </div>
                 <div className="space-y-4">
                    {recentMessages.map((msg, i) => (
                       <div key={msg.id} className="flex gap-3">
                          <img src={msg.sender.avatar} className="w-8 h-8 rounded-full border border-gray-100" alt="User" />
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline">
                                <p className="text-xs font-bold text-[#0A1E41]">{msg.sender.name}</p>
                                <span className="text-[10px] text-slate-400">{msg.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 truncate mt-0.5">{msg.preview}</p>
                          </div>
                          {msg.unread && (
                            <span className="w-2 h-2 bg-[#2563EB] rounded-full mt-1"></span>
                          )}
                       </div>
                    ))}
                 </div>
                 <button 
                   onClick={() => navigate('/lawyer/messages')}
                   className="w-full mt-4 py-2 text-xs font-bold text-[#2563EB] hover:text-blue-700 transition border-t border-gray-50"
                 >
                   View All Messages
                 </button>
              </div>

              {/* Quick Availability */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                 <h3 className="font-bold text-[#0A1E41] text-sm mb-4">Quick Availability</h3>
                 <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-xs mb-2">
                       <span className="text-slate-500">Today, 24th Oct</span>
                       <span className="font-bold text-slate-700">3 slots open</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                       {['9:00', '11:00', '14:00', '16:00'].map((time, idx) => (
                          <span 
                            key={time} 
                            className={`px-2 py-1 rounded text-[10px] font-medium ${
                              idx === 0 
                                ? 'bg-gray-200 text-gray-400' 
                                : 'bg-[#2563EB] text-white'
                            }`}
                          >
                            {time}
                          </span>
                       ))}
                    </div>
                 </div>
                 <div className="flex items-center justify-between mb-4 bg-slate-50 rounded-xl p-3">
                   <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-slate-400" />
                     <div>
                       <p className="text-xs font-semibold text-slate-700">Auto-Accept</p>
                       <p className="text-[10px] text-slate-400">Instant bookings</p>
                     </div>
                   </div>
                   <div className="w-10 h-5 bg-[#2563EB] rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                   </div>
                 </div>
                 <button 
                    onClick={() => navigate('/lawyer/availability')}
                    className="w-full py-2 bg-gray-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                 >
                    Manage Full Schedule
                 </button>
              </div>

              {/* Tax Reporting */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#0A1E41] text-sm flex items-center gap-2">
                       <FileText size={14} /> Tax Reporting
                    </h3>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">KRA Compliant</span>
                 </div>
                 
                 <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tax Year</p>
                         <p className="text-sm font-semibold text-slate-700">2023</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase tracking-wider">Period</p>
                         <p className="text-sm font-semibold text-slate-700">Annual</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Taxable Income</p>
                      <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                        <TrendingUp size={10} /> +12%
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A1E41]">KES 4,500,250</h3>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                       <div className="bg-[#2563EB] w-3/4 h-full rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                       <span>Gross: KES 5.2M</span>
                       <span>Deductions: KES 700K</span>
                    </div>
                 </div>

                 <div className="flex gap-2 mb-4">
                   <button className="flex-1 py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1">
                     <FileText size={12} className="text-red-500" /> PDF Report
                   </button>
                   <button className="flex-1 py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1">
                     <FileText size={12} className="text-green-500" /> CSV Data
                   </button>
                 </div>

                 <button className="w-full py-2.5 bg-[#0A1E41] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2">
                    Generate Full Tax Report <ChevronRight size={12} />
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
     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition group ${
     active ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-500 hover:bg-gray-50 hover:text-[#0A1E41]'
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

export default LawyerDashboard;
