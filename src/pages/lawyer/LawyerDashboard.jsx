import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  LayoutDashboard, FileText, Briefcase, Calendar, MessageSquare, 
  User, Settings, Plus, Video, Clock, 
  FileCheck, DollarSign, ChevronRight
} from 'lucide-react';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  // --- MOCK DATA FOR UI ---
  const stats = [
    { label: 'Pending Notarizations', value: '12', tag: '+2 new', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Consultations", value: '4', tag: 'Next in 30m', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Earnings (KES)', value: '45,000', tag: '+15% vs last wk', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Client Rating', value: '4.8/5.0', tag: '+0.1', icon: User, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const pendingNotarizations = [
    { client: 'Wanjiku Mwangi', type: 'Affidavit of Support', time: '10:30 AM', status: 'Pending', avatar: 'WM' },
    { client: 'Kevin Omondi', type: 'Land Sale Agreement', time: '09:15 AM', status: 'Pending', avatar: 'KO' },
    { client: 'Faith Mutua', type: 'Power of Attorney', time: 'Yesterday', status: 'Urgent', avatar: 'FM' },
  ];

  const messages = [
    { name: 'Sarah Njoroge', text: 'Attached the ID document you requested...', time: '2m ago', avatar: 'https://ui-avatars.com/api/?name=Sarah+Njoroge&background=random' },
    { name: 'John Kibet', text: 'Can we reschedule our meeting?', time: '1h ago', avatar: 'https://ui-avatars.com/api/?name=John+Kibet&background=random' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-800">
      
      {/* --- 1. LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col justify-between hidden lg:flex">
        <div>
          <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
            <div className="bg-blue-600 p-1.5 rounded-lg">
               <FileText className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Haki Yetu</h1>
              <p className="text-[10px] text-slate-400 font-medium">Advocate Portal</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-4">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={FileCheck} label="Notarization Queue" badge="3" />
            <NavItem icon={Briefcase} label="My Cases" />
            {/* LINKED: This now goes to the Availability Settings page you built */}
            <NavItem icon={Calendar} label="Calendar" onClick={() => navigate('/lawyer/availability')} />
            <NavItem icon={MessageSquare} label="Messages" badge="2" />
            <NavItem icon={User} label="Profile" />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Availability</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
             </div>
             <button className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                Go Offline
             </button>
          </div>
          
          <div className="flex items-center gap-3 px-2">
             <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=333&color=fff`} className="w-8 h-8 rounded-full" alt="Profile" />
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-slate-400">Verified Advocate</p>
             </div>
             <Settings size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT (CENTER) --- */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-2xl font-bold text-slate-900">Karibu, Advocate {user?.last_name}</h1>
              <p className="text-slate-500 text-sm mt-1">Here is your daily activity summary for <span className="font-medium text-slate-700">Today</span>.</p>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => navigate('/lawyer/availability')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition shadow-sm"
              >
                 <Calendar size={16} /> Manage Availability
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                 <Plus size={16} /> Create Document
              </button>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                   </div>
                   <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">{stat.tag}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           
           {/* Left: Notarization Queue (2/3 width) */}
           <div className="xl:col-span-2 space-y-8">
              
              {/* Notarizations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <span className="w-1 h-5 bg-red-500 rounded-full"></span> Urgent Actions - Pending Notarizations
                    </h3>
                    <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                 </div>
                 
                 <div className="space-y-4">
                    {pendingNotarizations.map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-100 group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">
                                {item.avatar}
                             </div>
                             <div>
                                <p className="font-bold text-sm text-slate-900">{item.client}</p>
                                <p className="text-xs text-slate-500">{item.type}</p>
                             </div>
                          </div>
                          <div className="text-right flex items-center gap-6">
                             <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock size={12}/> {item.time}</span>
                             <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                {item.status}
                             </span>
                             <button className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition">Review →</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Consultations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Today's Consultations</h3>
                    <button className="text-xs font-bold text-blue-600 hover:underline">View Calendar</button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-5 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-3 opacity-10">
                          <Video size={64} className="text-blue-600" />
                       </div>
                       <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Starting Soon</span>
                       <h4 className="font-bold text-slate-900 mt-1 mb-1">Civil Case Consultation</h4>
                       <p className="text-xs text-slate-500 flex items-center gap-1 mb-4"><Clock size={12}/> 2:00 PM - 2:45 PM (EAT)</p>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <img src="https://ui-avatars.com/api/?name=Amina+Juma" className="w-6 h-6 rounded-full" alt="Client" />
                             <span className="text-xs font-bold text-slate-700">Amina Juma</span>
                          </div>
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">Join Call →</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Widgets (1/3 width) */}
           <div className="space-y-6">
              
              {/* Messages Widget */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Recent Messages</h3>
                    <FileText size={14} className="text-slate-400" />
                 </div>
                 <div className="space-y-4">
                    {messages.map((msg, i) => (
                       <div key={i} className="flex gap-3">
                          <img src={msg.avatar} className="w-8 h-8 rounded-full border border-gray-100" alt="User" />
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline">
                                <p className="text-xs font-bold text-slate-900">{msg.name}</p>
                                <span className="text-[10px] text-slate-400">{msg.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 truncate mt-0.5">{msg.text}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition border-t border-gray-50">View All Messages</button>
              </div>

              {/* Quick Availability */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                 <h3 className="font-bold text-slate-900 text-sm mb-4">Quick Availability</h3>
                 <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-xs mb-2">
                       <span className="text-slate-500">Today, 24th Oct</span>
                       <span className="font-bold text-slate-700">3 slots open</span>
                    </div>
                    <div className="flex gap-2">
                       {['9:00', '11:00', '14:00', '16:00'].map(time => (
                          <span key={time} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-slate-600">{time}</span>
                       ))}
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
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                       <DollarSign size={14} /> Tax Reporting
                    </h3>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">KRA Compliant</span>
                 </div>
                 
                 <div className="bg-slate-900 rounded-xl p-4 text-white mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <DollarSign size={48} />
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Taxable Income</p>
                    <h3 className="text-xl font-bold">KES 4,500,250</h3>
                    <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
                       <div className="bg-green-500 w-3/4 h-full"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[8px] text-slate-400">
                       <span>Gross: KES 5.2M</span>
                       <span>Deductions: KES 700K</span>
                    </div>
                 </div>

                 <button className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2">
                    Generate Tax Report <ChevronRight size={12} />
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
     active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
  }`}>
     <div className="flex items-center gap-3">
        <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
        <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
     </div>
     {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>
     )}
  </button>
);

export default LawyerDashboard;
