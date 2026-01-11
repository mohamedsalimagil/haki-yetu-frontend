import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings, Bell, Scale } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'User Management', path: '/admin/users', icon: '👥' },
    { label: 'Pending Approvals', path: '/admin/approvals', icon: '✅' },
    { label: 'Disputes', path: '/admin/disputes', icon: '⚠️' },
    { label: 'System Logs', path: '/admin/logs', icon: '📝' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-700 flex items-center space-x-3">
          <Scale className="h-8 w-8 text-secondary flex-shrink-0" />
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-xl tracking-wide">Haki Yetu</h1>
              <p className="text-xs text-blue-300">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-600'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-blue-700 space-y-3">
          {sidebarOpen && (
            <div className="text-sm bg-blue-600/30 p-3 rounded-lg">
              <p className="font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="text-blue-200 text-xs truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-4 py-2 hover:bg-blue-600 rounded-lg transition"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 hover:bg-red-600 rounded-lg transition"
            title="Logout"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
            <p className="text-sm text-gray-500">Manage platform operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Settings size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
