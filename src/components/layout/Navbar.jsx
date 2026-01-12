import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut, User, Menu, X, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'lawyer') return '/lawyer/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/client/dashboard';
  };

  // Check if lawyer is verified (allowed to access dashboard)
  const isLawyerVerified = () => {
    if (!user) return false;
    if (user.role !== 'lawyer') return true; // Non-lawyers always pass
    const status = user.verification_status || user.status;
    return status === 'verified' || status === 'approved';
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo and Primary Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/haki%20logo%201.png" alt="Haki Yetu" className="h-16 w-16 object-contain rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-lg group-hover:shadow-xl transition-shadow" />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#1E40AF] via-blue-600 to-[#FACC15] bg-clip-text text-transparent">
                  Haki Yetu
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase -mt-1">
                  Digital Justice
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
              {!user ? (
                <>
                  <Link to="/services" className="hover:text-primary transition">Services</Link>
                  <Link to="/advocates" className="hover:text-primary transition">Find a Lawyer</Link>
                  <Link to="/pricing" className="hover:text-primary transition">Pricing</Link>
                  <Link to="/about" className="hover:text-primary transition">About</Link>
                </>
              ) : (
                <>
                  {/* Only show Dashboard link if user is verified AND not an admin (admins use sidebar) */}
                  {isLawyerVerified() && user.role !== 'admin' && (
                    <Link to={getDashboardLink()} className="hover:text-primary transition flex items-center gap-1">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'client' && (
                    <Link to="/marketplace" className="hover:text-primary transition">Services</Link>
                  )}
                  {user.role === 'client' && (
                    <Link to="/advocates" className="hover:text-primary transition">Advocates</Link>
                  )}
                  {/* Hide Messages for admins */}
                  {user.role !== 'admin' && (
                    <Link to="/chat" className="hover:text-primary transition flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Section: Auth & Mobile Menu */}
          <div className="flex items-center gap-4">

            {/* Authenticated State */}
            {user ? (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                      {user.avatar_url || user.profile_image_url ? (
                        <img
                          src={user.avatar_url || user.profile_image_url}
                          alt={user.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-xs">
                          {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                      {user.first_name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to={user.role === 'client' ? "/client/settings" : "/profile"}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>
                      {/* Only show Dashboard link if user is verified AND not an admin */}
                      {isLawyerVerified() && user.role !== 'admin' && (
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Public State Buttons */
              <div className="hidden md:flex items-center gap-3">
                <ThemeToggle />
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-blue-800 transition shadow-sm hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            {!user ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Theme</span>
                  <ThemeToggle />
                </div>
                <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Services</Link>
                <Link to="/advocates" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Advocates</Link>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Pricing</Link>
                <div className="pt-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium">Log In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-medium">Get Started</Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                      {user.first_name ? user.first_name[0] : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                {/* Only show Dashboard link if user is verified AND not an admin */}
                {isLawyerVerified() && user.role !== 'admin' && (
                  <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                    <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <Link to="/client/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
