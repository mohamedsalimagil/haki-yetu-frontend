import React, { useState } from 'react';
import {
    User, Lock, Bell, Shield, Save, Mail,
    Smartphone, Globe, Moon, Sun
} from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

    // Mock state for settings
    const [settings, setSettings] = useState({
        siteName: 'Haki Yetu Admin',
        supportEmail: 'support@hakiyetu.co.ke',
        maintenanceMode: false,
        emailNotifications: true,
        pushNotifications: false,
        twoFactorAuth: true,
        theme: 'light'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you'd show a toast here
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage implementation parameters and system preferences</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[500px] transition-colors">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Globe size={18} />
                            <span>General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Lock size={18} />
                            <span>Security</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Bell size={18} />
                            <span>Notifications</span>
                        </button>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Configuration</h3>
                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform Name</label>
                                        <input
                                            type="text"
                                            name="siteName"
                                            value={settings.siteName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="supportEmail"
                                                value={settings.supportEmail}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily disable access for non-admin users</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="maintenanceMode"
                                                checked={settings.maintenanceMode}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for all admin accounts</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="twoFactorAuth"
                                                checked={settings.twoFactorAuth}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
                                        <h4 className="text-sm font-bold text-red-800 mb-2">Danger Zone</h4>
                                        <p className="text-xs text-red-600 mb-4">Irreversible actions for system administration</p>
                                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                                            Reset All Caches
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                name="emailNotifications"
                                                checked={settings.emailNotifications}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">Email Notifications</label>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">Receive daily summaries and critical alerts via email</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                name="pushNotifications"
                                                checked={settings.pushNotifications}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">Push Notifications</label>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">Real-time alerts for new verifications and disputes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    <span>Save Changes</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
