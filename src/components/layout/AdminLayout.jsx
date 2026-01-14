import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gavel, Users, FileText, Settings, LogOut, Bell, Search, AlertTriangle, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Dispute Resolution', path: '/admin/disputes', icon: AlertTriangle },
    { label: 'Template Management', path: '/admin/templates', icon: FileText },
    { label: 'Client Verification', path: '/admin/client-verification', icon: Users },
    { label: 'Lawyer Verification', path: '/admin/lawyer-verification', icon: Gavel },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col z-10 transition-colors">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/haki%20logo%201.png" alt="Haki Yetu" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">Haki Yetu</span>
          </Link>
        </div>

        <nav className="flex-1 mt-4">
          <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</div>

          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
              />
            </Link>
          ))}

          <div className="px-6 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
          <Link to="/admin/settings">
            <SidebarItem icon={Settings} label="Settings" active={isActive('/admin/settings')} />
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search across platform..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <Bell className="text-gray-500 dark:text-gray-400 cursor-pointer" size={20} />
            <div className="text-right">
              <div className="text-sm font-bold text-gray-800 dark:text-white">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Super Admin</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
