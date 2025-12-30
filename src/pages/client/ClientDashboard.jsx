import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
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
  ChevronRight 
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Navigation Handlers
  const goToMarketplace = () => navigate('/marketplace');
  const goToChat = () => navigate('/chat');
  
  const showComingSoon = (feature) => {
    toast.success(`${feature} module coming in Phase 2!`, {
      icon: '🚧',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  // --- MOCK DATA ---
  const stats = [
    { label: 'Pending Actions', value: '2', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Upcoming Consultations', value: '1', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed Orders', value: '14', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const quickServices = [
    { title: 'Remote Notarization', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Draft Contract', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Book Advocate', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Land Search', icon: Search, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentActivity = [
    { service: 'Affidavit of Service', id: '#2034', date: 'Today, 9:41AM', status: 'Ready', statusColor: 'bg-green-100 text-green-700' },
    { service: 'Virtual Consultation', id: '#2031', date: 'Tomorrow, 2:00PM', status: 'Scheduled', statusColor: 'bg-blue-100 text-blue-700' },
    { service: 'Land Search - Nairobi', id: '#2028', date: 'Oct 24, 2023', status: 'Processing', statusColor: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col justify-between fixed h-full z-10">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Haki Yetu</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Client Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 mt-6">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button onClick={() => showComingSoon('Documents')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition">
              <FileText size={20} />
              My Documents
            </button>
            <button onClick={goToChat} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition">
              <Video size={20} />
              Consultations
            </button>
            <button onClick={() => showComingSoon('History')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition">
              <History size={20} />
              Order History
            </button>
            <button onClick={() => navigate('/settings')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition">
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </div>

        {/* Bottom Badge */}
        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-800 uppercase">Verified Secure</span>
            </div>
            <p className="text-xs text-blue-600/80 leading-relaxed">
              Your data is encrypted. All advocates are LSK verified.
            </p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-64">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500">
            <span>Haki Yetu</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-gray-900">Dashboard</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
              />
            </div>
            
            <button className="relative text-gray-500 hover:text-gray-700 transition">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500">Individual Account</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-200">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                Jambo, {user?.first_name} <span className="text-2xl">👋</span>
              </h1>
              <p className="text-gray-500">
                Here is your legal overview. You have <span className="font-semibold text-blue-600">2 pending actions</span> requiring attention.
              </p>
            </div>
            <button 
              onClick={goToMarketplace} 
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
            >
              <Plus size={18} />
              Start New Request
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
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
                  <h3 className="text-base font-bold text-gray-800">Quick Services</h3>
                  <button onClick={goToMarketplace} className="text-blue-600 text-sm font-medium hover:underline">
                    View All Services
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickServices.map((service, index) => (
                    <button 
                      key={index} 
                      onClick={goToMarketplace} 
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition flex flex-col items-center text-center gap-4 group h-full"
                    >
                      <div className={`p-3 rounded-full ${service.bg} group-hover:scale-110 transition-transform`}>
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 leading-tight">{service.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-base font-bold text-gray-800">Recent Activity</h3>
                  <button className="text-gray-400 hover:text-blue-600 transition">
                    <LayoutDashboard size={18} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-medium">Service</th>
                        <th className="px-6 py-4 font-medium">Order ID</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentActivity.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                              <FileText size={16} />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{item.service}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{item.id}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => showComingSoon('Order Details')} 
                              className="text-blue-600 text-sm font-medium hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-center">
                  <button 
                    onClick={() => showComingSoon('Order History')}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    View Full History <Users size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
               <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
                 
                 <div className="flex justify-between items-start mb-6 relative z-10">
                   <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Next Appointment</span>
                   <div className="p-2 bg-slate-800 rounded-lg">
                     <Video className="text-blue-400" size={16} />
                   </div>
                 </div>
                 
                 <h3 className="text-lg font-bold mb-1 relative z-10">Legal Consultation</h3>
                 <p className="text-slate-400 text-xs mb-6 relative z-10">Property Dispute Resolution</p>

                 <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center gap-4 border border-slate-700/50 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shrink-0">
                      <span className="text-xs font-bold text-white">SM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">Adv. Sarah Mwangi</p>
                      <p className="text-slate-400 text-xs">High Court Advocate</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 text-slate-300 text-xs mb-6 relative z-10">
                   <Clock size={14} className="text-blue-400" />
                   <span>Tomorrow, 2:00 PM - 2:30 PM</span>
                 </div>

                 <button 
                   onClick={goToChat} 
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/20 relative z-10"
                 >
                   Join Meeting Room
                 </button>
               </div>
               
               {/* Document Status Widget */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                 <h3 className="font-bold text-gray-800 mb-6 text-sm">Document Status</h3>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-xs mb-2">
                       <span className="text-gray-500">Completed</span>
                       <span className="font-medium text-gray-800">14</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                       <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                     </div>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-xs mb-2">
                       <span className="text-gray-500">In Review</span>
                       <span className="font-medium text-gray-800">3</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                       <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs mb-2">
                       <span className="text-gray-500">Action Required</span>
                       <span className="font-medium text-gray-800">2</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-1.5">
                       <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: '15%' }}></div>
                     </div>
                   </div>
                 </div>
                 <button 
                   onClick={() => showComingSoon('My Documents')}
                   className="w-full mt-8 py-2.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
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