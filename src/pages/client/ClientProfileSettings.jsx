import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Bell, CreditCard, Save, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/common/BackButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ClientProfileSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // Get user and updater from context
  const [profile, setProfile] = useState(null);
  const [initialProfile, setInitialProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Initialize state from auth user
  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone_number || '', // Assuming field name
        nationalId: user.national_id || '', // Assuming field name
        county: user.county || 'Nairobi',
        avatar: user.avatar_url || user.profile_image_url || '',
        bio: user.bio || '',
        // Defaults for UI state not in DB yet
        idVerified: user.verification_status === 'verified',
        planName: 'Basic Plan',
        notifications: {
          caseUpdatesSMS: true,
          legalNewsletters: false,
          emailReminders: true
        }
      };
      setProfile(userData);
      setInitialProfile(userData);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to update profile
      const updatePayload = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
        avatar_url: profile.avatar,
        phone_number: profile.phone,
        county: profile.county
      };

      const response = await api.put('/auth/profile', updatePayload);

      // Update local storage and context
      if (response.data && response.data.user) {
        // Merge existing user with updates
        const updatedUser = { ...user, ...response.data.user };
        updateUser(updatedUser); // Update context
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist
      }

      toast.success('Profile updated successfully!');
      setInitialProfile(profile); // Reset dirty state
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setShowUrlInput(false);
  };

  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  // Check if form data has changed
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <BackButton className="mb-6" to="/client/dashboard" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1E41] dark:text-white">Profile Settings</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2">Manage your personal information, security preferences, and account settings.</p>
        </div>

        <div className="space-y-6">

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 transition-colors">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative group">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover"
                    alt="Profile"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=0D8ABC&color=fff`; }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}

                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] dark:bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-500 transition cursor-pointer z-10"
                  title="Update Profile Picture"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-[#0A1E41] dark:text-white mb-1">{profile.firstName} {profile.lastName}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{profile.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${profile.idVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                    {profile.idVerified ? ' ID Verified' : 'Pending Verification'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">{profile.planName}</span>
                </div>
              </div>
            </div>

            {/* Avatar URL Input (Toggled) */}
            {showUrlInput && (
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2 transition-colors">
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Profile Image URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="https://example.com/my-photo.jpg"
                      value={profile.avatar}
                      onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowUrlInput(false)}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 font-medium text-sm transition"
                  >
                    Done
                  </button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Paste a direct link to an image (e.g. from LinkedIn or GitHub).
                </p>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="font-bold text-[#0A1E41] dark:text-white mb-4 flex items-center gap-2">
                <Shield size={18} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">County of Residence</label>
                  <select
                    value={profile.county}
                    onChange={(e) => setProfile({ ...profile, county: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option>Nairobi City</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                    <option>Eldoret</option>
                    <option>Kiambu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pb-8 transition-all duration-300 sticky bottom-4">
            <button
              onClick={handleSave}
              disabled={loading || !isDirty}
              className="flex-1 py-3 bg-[#0A1E41] dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading || !isDirty}
              className="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50"
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
