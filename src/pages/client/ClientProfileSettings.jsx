import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Bell, CreditCard, Save } from 'lucide-react';
import { userProfile } from '../../data/mockChatData';
import BackButton from '../../components/common/BackButton';

const ClientProfileSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(userProfile);
  const [initialProfile, setInitialProfile] = useState(userProfile); // Store initial state
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setInitialProfile(profile); // Update initial state after save
      localStorage.setItem('userProfile', JSON.stringify(profile)); // Persist to localStorage
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setProfile(initialProfile); // Revert to initial state
  };

  // Check if form data has changed
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <BackButton className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1E41]">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your personal information, security preferences, and account settings.</p>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Save size={16} className="text-white" />
            </div>
            <p className="text-sm font-medium text-green-800">Changes saved successfully!</p>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img 
                  src={profile.avatar} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg" 
                  alt="Profile" 
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A1E41] mb-1">{profile.firstName} {profile.lastName}</h2>
                <p className="text-sm text-slate-500 mb-2">{profile.email}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    {profile.idVerified ? '✓ ID Verified' : 'Pending Verification'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{profile.planName}</span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="font-bold text-[#0A1E41] mb-4 flex items-center gap-2">
                <Shield size={18} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">National ID /Passport Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile.nationalId}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50"
                    />
                    {profile.idVerified && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Verified</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">County of Residence</label>
                  <select 
                    value={profile.county}
                    onChange={(e) => setProfile({...profile, county: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    <option>Nairobi City</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-[#0A1E41] mb-6 flex items-center gap-2">
              <Shield size={18} /> Security
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <h4 className="font-bold text-[#0A1E41] text-sm mb-1">Two-Factor Auth</h4>
                <p className="text-xs text-slate-500">Secure your account with 2FA</p>
              </div>
              <button 
                onClick={() => setProfile({...profile, twoFactorAuth: !profile.twoFactorAuth})}
                className={`w-12 h-6 rounded-full transition ${profile.twoFactorAuth ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-[#0A1E41] mb-6 flex items-center gap-2">
              <Bell size={18} /> Notifications
            </h3>
            
            <div className="space-y-4">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-[#0A1E41] text-sm mb-1">
                      {key === 'caseUpdatesSMS' ? 'Case Updates via SMS' :
                       key === 'legalNewsletters' ? 'Legal Newsletters' :
                       'Email Reminders'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {key === 'caseUpdatesSMS' ? 'Receive instant text messages when your advocate updates your file.' :
                       key === 'legalNewsletters' ? 'Weekly digest on Kenyan Law amendments and news.' :
                       'Reminders for upcoming notarization sessions'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setProfile({
                      ...profile,
                      notifications: {...profile.notifications, [key]: !value}
                    })}
                    className={`w-12 h-6 rounded-full transition ${value ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Plans */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-[#0A1E41] mb-6 flex items-center gap-2">
              <CreditCard size={18} /> Billing & Plans
            </h3>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-[#0A1E41] mb-1">{profile.planName}</h4>
                  <p className="text-sm text-slate-600">
                    {profile.freeConsultationsUsed}/{profile.freeConsultationsTotal} Free Consultations Used
                  </p>
                </div>
                <button className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-lg hover:bg-blue-700 transition">
                  Upgrade Plan
                </button>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#2563EB] h-full rounded-full"
                  style={{ width: `${(profile.freeConsultationsUsed / profile.freeConsultationsTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading || !isDirty}
              className="flex-1 py-3 bg-[#0A1E41] text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading || !isDirty}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileSettings;
