import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  User, Shield, Bell, CreditCard, ChevronRight, 
  Camera, Share2, Save, Lock, LogOut, CheckCircle 
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);

  // Form State - Pre-filled with user data where available
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_number: '',
    county: 'Nairobi City',
    bio: ''
  });

  // Toggles State (Mock for UI)
  const [notifications, setNotifications] = useState({
    sms: true,
    newsletter: false,
    email: true
  });

  // Load user data into form when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        id_number: user.id_number || '', 
        county: user.county || 'Nairobi City',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use your existing API service
      await api.put('/auth/profile', formData);
      toast.success('Profile updated successfully!');
      // Optional: Refresh user context here if needed
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/client/dashboard')}>
           <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="text-white w-4 h-4" />
           </div>
           <span className="font-bold text-gray-900 text-lg">Haki Yetu</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold border border-blue-200">
             {user?.first_name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT SIDEBAR MENU --- */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            
            {/* User Mini Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
                <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=0D8ABC&color=fff`} alt="Profile" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{user?.first_name} {user?.last_name}</p>
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <CheckCircle size={10} />
                  <span>Verified Client</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {[
                { id: 'details', label: 'My Details', icon: User },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Plan Usage Widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Current Plan</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">BASIC</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Standard Citizen Access</h4>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                 <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-gray-500">2/5 Free Consultations Used</p>
              <button className="text-blue-600 text-xs font-bold mt-3 hover:underline">Upgrade Plan</button>
            </div>
          </aside>


          {/* --- MAIN CONTENT AREA --- */}
          <div className="flex-1 space-y-6">
            
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-500 text-sm">Manage your personal information, security preferences, and account settings.</p>
            </div>

            {/* 1. Profile Card Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=0D8ABC&color=fff`} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-blue-600">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 justify-center sm:justify-start">
                    {user?.first_name} {user?.last_name} 
                    <Shield size={16} className="text-blue-500" />
                  </h2>
                  <p className="text-gray-500 text-sm">Nairobi, Kenya</p>
                  <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">Member Since Jan 2024</span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">ID Verified</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                <Share2 size={16} /> Share Profile
              </button>
            </div>

            {/* 2. Personal Information Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Personal Information</h3>
                <button type="button" className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">National ID / Passport</label>
                    <div className="relative">
                      <input 
                        type="text" name="id_number" value={formData.id_number} placeholder="ID-22334455" readOnly
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500" 
                      />
                      <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Verified</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">County of Residence</label>
                    <select 
                      name="county" value={formData.county} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 bg-white"
                    >
                      <option>Nairobi City</option>
                      <option>Mombasa</option>
                      <option>Kisumu</option>
                      <option>Nakuru</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                  <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </form>

            {/* 3. Bottom Section: Security & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Security */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-blue-600" /> Security
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Change Password</label>
                    <input type="password" placeholder="Current Password" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 mb-2" />
                    <input type="password" placeholder="New Password" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Two-Factor Auth</p>
                      <p className="text-xs text-gray-500">Secure your account with 2FA</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-blue-600" /> Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Case Updates via SMS</p>
                      <p className="text-xs text-gray-500">Receive instant text messages.</p>
                    </div>
                    <button onClick={() => setNotifications({...notifications, sms: !notifications.sms})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${notifications.sms ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.sms ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Legal Newsletters</p>
                      <p className="text-xs text-gray-500">Weekly digest on Kenyan Law.</p>
                    </div>
                    <button onClick={() => setNotifications({...notifications, newsletter: !notifications.newsletter})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${notifications.newsletter ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.newsletter ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Email Reminders</p>
                      <p className="text-xs text-gray-500">For upcoming notarization sessions.</p>
                    </div>
                    <button onClick={() => setNotifications({...notifications, email: !notifications.email})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;