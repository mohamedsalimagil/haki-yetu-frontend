import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Briefcase, Calendar, MessageSquare, 
  User, Settings, DollarSign, TrendingUp, Download, 
  FileCheck, Star, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { earningsData, lawyerStats } from '../../data/mockLawyerData';

const LawyerEarnings = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const handleRequestPayout = () => {
    alert('Payout Request Submitted! Funds will be transferred to your M-Pesa within 24-48 hours.');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex text-slate-800">
      
      {/* --- LEFT SIDEBAR --- */}
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
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              onClick={() => navigate('/lawyer/dashboard')} 
            />
            <NavItem 
              icon={FileCheck} 
              label="Notarization Queue" 
              badge="3"
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
            <NavItem 
              icon={DollarSign} 
              label="Earnings & Analytics" 
              active
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
               src="https://ui-avatars.com/api/?name=Adv+Kamau&background=0A1E41&color=fff" 
               className="w-8 h-8 rounded-full" 
               alt="Profile" 
             />
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Adv. Kamau O.</p>
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
              <h1 className="text-2xl font-bold text-[#0A1E41]">Earnings Overview</h1>
              <p className="text-slate-500 text-sm mt-1">
                Track your financial performance and service insights
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition shadow-sm">
                <Download size={16} /> Download Report
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={10} /> +12%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Earnings</p>
            <h3 className="text-2xl font-bold text-[#0A1E41]">KES {earningsData.totalEarnings.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Updated just now</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <FileCheck size={20} />
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Upcoming</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Payouts</p>
            <h3 className="text-2xl font-bold text-[#0A1E41]">KES {earningsData.pendingPayouts.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Due on Friday, 14th Oct</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <Briefcase size={20} />
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={10} /> +8%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">Completed Services</p>
            <h3 className="text-2xl font-bold text-[#0A1E41]">{earningsData.completedServices}</h3>
            <p className="text-xs text-slate-400 mt-1">This year</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <Star size={20} />
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-full">★</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">Client Rating</p>
            <h3 className="text-2xl font-bold text-[#0A1E41]">{earningsData.clientRating}</h3>
            <p className="text-xs text-slate-400 mt-1">Based on {earningsData.reviewCount} reviews</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Revenue History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-[#0A1E41]">Revenue History</h3>
                  <p className="text-xs text-slate-500 mt-1">Income over the last 6 months</p>
                </div>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-4">
                {earningsData.revenueHistory.map((item, i) => {
                  const maxAmount = Math.max(...earningsData.revenueHistory.map(d => d.amount));
                  const height = (item.amount / maxAmount) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group cursor-pointer">
                        <div 
                          className="w-full bg-gradient-to-t from-[#2563EB] to-[#60A5FA] rounded-t-lg transition-all duration-300 hover:from-[#1E40AF] hover:to-[#3B82F6]"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0A1E41] text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            KES {item.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-[#0A1E41]">Recent Transactions</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {earningsData.recentTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {txn.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {txn.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {txn.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0A1E41]">
                          KES {txn.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            txn.status === 'Paid' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Earnings by Service & Payout */}
          <div className="space-y-6">
            
            {/* Earnings by Service (Donut Chart) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-[#0A1E41] mb-6">Earnings by Service</h3>
              
              {/* Donut Chart Visual */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-[20px] border-gray-100 relative">
                    {/* This would be a real donut chart in production */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 rounded-full bg-[#2563EB]" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-[#60A5FA]" style={{ clipPath: 'polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)' }}></div>
                    </div>
                    <div className="absolute inset-[20px] rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Top Source</p>
                        <p className="text-2xl font-bold text-[#2563EB]">45%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {earningsData.earningsByService.map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <span className="text-sm text-slate-700">{service.service}</span>
                    </div>
                    <span className="text-sm font-bold text-[#0A1E41]">{service.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Balance & Payout */}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl border border-blue-600 shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Available Balance</h3>
                <DollarSign size={20} className="opacity-75" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">KES {earningsData.availableBalance.toLocaleString()}</h2>
              <p className="text-xs text-blue-100 mb-6">Minimum payout: KES {earningsData.minimumPayout.toLocaleString()}</p>
              
              <button 
                onClick={handleRequestPayout}
                className="w-full py-3 bg-white text-[#2563EB] font-bold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2 shadow-lg"
              >
                Request Payout <ArrowUpRight size={16} />
              </button>
              
              <p className="text-xs text-blue-100 mt-4 text-center">
                Funds typically arrive within 24-48 hours via M-Pesa
              </p>
            </div>

            {/* Tax Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-[#0A1E41] mb-4 flex items-center gap-2">
                <FileText size={16} /> Tax Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-slate-600">Gross Income</span>
                  <span className="text-sm font-bold text-[#0A1E41]">KES 5,200,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-slate-600">Deductions</span>
                  <span className="text-sm font-bold text-red-600">- KES 700,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-slate-700">Taxable Income</span>
                  <span className="text-lg font-bold text-[#0A1E41]">KES 4,500,250</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-800">KRA Compliant</p>
                  <p className="text-xs text-green-600 mt-1">Your earnings are properly documented for tax purposes</p>
                </div>
              </div>
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

export default LawyerEarnings;
