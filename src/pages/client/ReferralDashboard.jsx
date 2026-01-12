import React, { useState } from 'react';
import { Copy, Gift, Users, TrendingUp, CheckCircle, Clock, Share2 } from 'lucide-react';

const ReferralDashboard = () => {
  const [copied, setCopied] = useState(false);

  // TODO: Replace with API call to fetch referral data
  const referralData = {
    referralLink: 'user123',
    totalWalletBalance: 0,
    lifetimeEarned: 0,
    nextReward: 500,
    totalReferrals: 0,
    pendingCredits: 0,
    pendingUsers: 0,
    howItWorks: [
      {
        step: 1,
        title: 'Share Your Link',
        description: 'Send your unique link to friends via WhatsApp or Email.',
      },
      {
        step: 2,
        title: 'Friend Registers',
        description: 'They get 10% off their first legal service or consultation.',
      },
      {
        step: 3,
        title: 'You Earn Rewards',
        description: 'Receive KES 500 credit immediately after their service completion.',
      },
    ],
    referralHistory: [],
    activityFeed: [],
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://haki-yetu.co.ke/ref/${referralData.referralLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1E41]">Refer & Earn</h1>
          <p className="text-slate-500 mt-2">Empower your network with justice. Gift friends 10% off legal services and earn <span className="font-bold text-[#D9A13A]">KES 500</span> for every successful referral.</p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Referral Link Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Refer & Earn Legal Credits</h2>
                <p className="text-blue-100 text-sm">Share justice, earn rewards</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <label className="text-xs text-blue-100 uppercase tracking-wider mb-2 block">Your Unique Referral Link</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={`haki-yetu.co.ke/ref/${referralData.referralLink.split('/').pop()}`}
                  readOnly
                  className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-white text-[#2563EB] font-bold rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <p className="text-sm text-blue-100 mb-3">Share via:</p>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 size={16} /> WhatsApp
                </button>
                <button className="flex-1 py-3 bg-blue-400 hover:bg-blue-500 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 size={16} /> Telegram
                </button>
                <button className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 size={16} /> Email
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1E41]">Wallet Balance</h3>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Gift size={20} className="text-green-600" />
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Wallet Balance</p>
              <h2 className="text-3xl font-bold text-[#0A1E41]">KES {referralData.totalWalletBalance.toLocaleString()}</h2>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle size={12} /> Available to spend
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-slate-400 mb-1">Lifetime Earned</p>
                <p className="text-lg font-bold text-[#D9A13A]">KES {referralData.lifetimeEarned.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Next Reward</p>
                <p className="text-lg font-bold text-[#2563EB]">+ KES {referralData.nextReward}</p>
              </div>
            </div>

            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
              View Wallet History →
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold text-[#0A1E41] mb-6">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {referralData.howItWorks.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1E41] mb-2">{step.title}</h4>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={20} className="text-[#2563EB]" />
              <h4 className="font-bold text-[#0A1E41]">Total Referrals</h4>
            </div>
            <p className="text-4xl font-bold text-[#0A1E41] mb-2">{referralData.totalReferrals}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <TrendingUp size={12} className="text-green-500" /> +2 this week
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-amber-500" />
              <h4 className="font-bold text-[#0A1E41]">Pending Credits</h4>
            </div>
            <p className="text-4xl font-bold text-amber-600 mb-2">KES {referralData.pendingCredits.toLocaleString()}</p>
            <p className="text-xs text-slate-400">{referralData.pendingUsers} users completing service</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={20} className="text-green-500" />
              <h4 className="font-bold text-[#0A1E41]">Success Rate</h4>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">83%</p>
            <p className="text-xs text-slate-400">Referrals completed services</p>
          </div>
        </div>

        {/* Referral History & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral History */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-[#0A1E41]">Referral History</h3>
              <span className="text-xs text-slate-400">{referralData.referralHistory.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Friend/Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Invited</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {referralData.referralHistory.map((ref) => (
                    <tr key={ref.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold">
                            {ref.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0A1E41]">{ref.name}</p>
                            <p className="text-xs text-slate-400">{ref.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {ref.dateInvited}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          ref.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          ref.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#D9A13A]">
                        {ref.reward ? `KES ${ref.reward}` : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#0A1E41]">Activity Feed</h3>
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded">{referralData.activityFeed.filter(a => a.highlight).length} New</span>
            </div>

            <div className="space-y-4">
              {referralData.activityFeed.map((activity) => (
                <div key={activity.id} className={`p-4 rounded-xl border ${
                  activity.highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'reward' ? 'bg-green-500' :
                      activity.type === 'registration' ? 'bg-blue-500' :
                      'bg-amber-500'
                    }`}>
                      {activity.type === 'reward' && <Gift size={14} className="text-white" />}
                      {activity.type === 'registration' && <Users size={14} className="text-white" />}
                      {activity.type === 'milestone' && <TrendingUp size={14} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#0A1E41] mb-1">{activity.title}</h4>
                      <p className="text-xs text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs font-medium text-[#2563EB] hover:underline">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
