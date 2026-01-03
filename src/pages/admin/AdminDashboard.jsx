import React from 'react';
import {
  Users, FileText, DollarSign, Activity,
  Search, Bell, Check, X, ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Activity summary for October 24, 2023</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm">
            + New Template
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-800">New Disputes Attention Required</span>
              <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide">Action Needed</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">3 new disputes have been submitted and are awaiting resolution.</p>
          </div>
        </div>
        <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm whitespace-nowrap">
          Resolve Disputes
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Clients', val: '1,450', change: '+12%', color: 'blue', icon: <Users className="w-5 h-5"/> },
          { label: 'Verified Advocates', val: '320', change: '+5%', color: 'purple', icon: <Check className="w-5 h-5"/> },
          { label: 'Monthly Revenue', val: 'KES 450k', change: '+8%', color: 'green', icon: <DollarSign className="w-5 h-5"/> },
          { label: 'Services Today', val: '28', change: '+2%', color: 'yellow', icon: <Activity className="w-5 h-5"/> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">{stat.change}</span>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Trends & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[320px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Platform Usage Trends</h3>
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
               {/* Simplified CSS-only chart representation for placeholder */}
               <svg viewBox="0 0 500 150" className="w-full h-full opacity-50 stroke-blue-500 fill-none stroke-2">
                 <path d="M0,150 C100,100 200,150 250,50 C300,-50 400,100 500,80" />
               </svg>
            </div>
            <span className="relative z-10 text-sm font-medium text-gray-500">[Line Chart Visualization Component]</span>
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">Last 30 Days</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Verify Lawyer', 'Upload Template', 'Broadcast Alert', 'Support Tickets'].map(action => (
              <button key={action} className="p-4 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-blue-600 hover:shadow-sm transition-all text-center flex flex-col items-center justify-center h-24 border border-transparent hover:border-gray-200">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Pending Verifications & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

        {/* Pending Verifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Pending Verifications</h3>
          <div className="space-y-4">
            {[
              { name: 'Wanjiku & Associates', sub: 'LSK/2023/892', bg: 'bg-gray-200' },
              { name: 'Omondi Law Chambers', sub: 'LSK/2023/104', bg: 'bg-gray-200' },
              { name: 'Grace Achieng', sub: 'LSK/2023/441', bg: 'bg-gray-200' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full ${item.bg}`}></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100">
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50 group">
                  <td className="py-4 font-medium text-gray-800">Affidavit of Support</td>
                  <td className="py-4 text-blue-600">John Kamau</td>
                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">Pending</span>
                  </td>
                  <td className="py-4 text-right text-gray-600">KES 1,500</td>
                </tr>
                <tr className="group">
                  <td className="py-4 font-medium text-gray-800">Land Sale Agrmt</td>
                  <td className="py-4 text-blue-600">Mary Njoroge</td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Completed</span>
                  </td>
                  <td className="py-4 text-right text-gray-600">KES 5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
