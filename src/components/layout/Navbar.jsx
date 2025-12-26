import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null; // Don't show navbar if not logged in

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              Haki Yetu
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user.role === 'client' && (
              <Link
                to="/marketplace"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Find a Lawyer</span>
              </Link>
            )}

            <Link
              to="/chat"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>

            <NotificationBell />

            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span>{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
