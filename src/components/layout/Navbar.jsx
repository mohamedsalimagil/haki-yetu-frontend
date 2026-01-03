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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary hover:text-blue-800 transition-colors">
              Haki Yetu
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              // Not logged in - show login button
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </Link>
            ) : (
              // Logged in - show user controls
              <>
                {user.role === 'client' && (
                  <>
                    <Link
                      to="/services"
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Services</span>
                    </Link>
                    <Link
                      to="/marketplace"
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Find a Lawyer</span>
                    </Link>
                  </>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
