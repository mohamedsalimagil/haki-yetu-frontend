import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FileText, DollarSign, Activity,
  Search, Bell, Check, X, ArrowUpRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminService from '../../services/adminService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const openDisputes = stats?.open_disputes_count || 0;

  // Prepare Chart Data
  const chartData = stats?.usage_trends?.dates?.map((date, index) => ({
    name: date,
    registrations: stats.usage_trends.counts[index]
  })) || [];

  const handleExport = async () => {
    try {
      const blob = await adminService.exportReports();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'haki_yetu_report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Activity summary for {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
          >
            Export Report
          </button>
          <button
            onClick={() => navigate('/admin/templates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {openDisputes > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-800 dark:text-white">New Disputes Attention Required</span>
                <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide">Action Needed</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{openDisputes} new disputes have been submitted and are awaiting resolution.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/disputes')}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm whitespace-nowrap"
          >
            Resolve Disputes
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Clients', val: stats?.total_users?.client || 0, change: '+12%', color: 'blue', icon: <Users className="w-5 h-5" /> },
          { label: 'Pending Lawyers', val: stats?.pending_lawyers_count || 0, change: '+5%', color: 'purple', icon: <Check className="w-5 h-5" /> },
          { label: 'Total Revenue', val: `KES ${(stats?.total_revenue || 0).toLocaleString()}`, change: '+8%', color: 'green', icon: <DollarSign className="w-5 h-5" /> },
          { label: 'Pending Verifications', val: stats?.pending_verifications?.total || stats?.pending_verifications || 0, change: '+2%', color: 'yellow', icon: <Activity className="w-5 h-5" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">{stat.change}</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Trends & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[320px] flex flex-col">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Platform Usage Trends</h3>
          <div className="flex-1 w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="registrations" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/admin/lawyer-verification')} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 hover:shadow-sm transition-all text-center flex flex-col items-center justify-center h-24 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              Verify Lawyer
            </button>
            <button onClick={() => navigate('/admin/templates')} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 hover:shadow-sm transition-all text-center flex flex-col items-center justify-center h-24 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              Upload Template
            </button>
            <button onClick={() => navigate('/admin/client-verification')} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 hover:shadow-sm transition-all text-center flex flex-col items-center justify-center h-24 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              Verify Client
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Pending Verifications & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

        {/* Pending Verifications */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Pending Verifications</h3>
          <div className="space-y-4">
            {stats?.pending_verifications_list?.length > 0 ? (
              stats.pending_verifications_list.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center space-x-4">
                    <img src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}`} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.subtext}</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    // Route based on user role from subtext (contains 'Lawyer' if lawyer)
                    const isLawyer = item.subtext?.toLowerCase().includes('lawyer');
                    navigate(isLawyer ? '/admin/lawyer-verification' : '/admin/client-verification');
                  }} className="text-blue-600 text-xs font-bold hover:underline">
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No pending verifications.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Recent Transactions</h3>
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
                {stats?.recent_transactions?.length > 0 ? (
                  stats.recent_transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 group">
                      <td className="py-4 font-medium text-gray-800">{tx.service}</td>
                      <td className="py-4 text-blue-600">{tx.client}</td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">{tx.status}</span>
                      </td>
                      <td className="py-4 text-right text-gray-600">KES {tx.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500 italic">No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
