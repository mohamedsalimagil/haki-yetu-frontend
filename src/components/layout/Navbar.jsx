import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Scale, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <Scale className="h-8 w-8 text-secondary" />
            <span className="font-bold text-xl tracking-wide hidden sm:inline">Haki Yetu</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Public Links */}
            {!user ? (
              <>
                <Link to="/services" className="hover:text-gray-300 transition font-medium">
                  Services
                </Link>
                <Link to="/lawyers" className="hover:text-gray-300 transition font-medium">
                  Find a Lawyer
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-secondary rounded hover:bg-red-700 transition font-medium"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {/* Admin Dashboard Link */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="hover:text-gray-300 transition font-medium text-yellow-300"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Client Dashboard Link */}
                {user.role === 'client' && (
                  <Link 
                    to="/dashboard" 
                    className="hover:text-gray-300 transition font-medium"
                  >
                    My Dashboard
                  </Link>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center space-x-3 border-l border-blue-400 pl-6">
                  <div className="text-sm">
                    <p className="font-semibold">{user.name || 'User'}</p>
                    <p className="text-blue-200 text-xs">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-blue-700 rounded-full transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none p-2 hover:bg-blue-700 rounded transition"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-700">
          {!user ? (
            <>
              <Link 
                to="/services" 
                className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/lawyers" 
                className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Find a Lawyer
              </Link>
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md bg-secondary text-center mt-4 font-medium hover:bg-red-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              {/* Admin Links */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium text-yellow-300"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              {/* Client Links */}
              {user.role === 'client' && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <Link 
                    to="/services" 
                    className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    to="/history" 
                    className="block px-3 py-2 rounded-md hover:bg-blue-800 transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Order History
                  </Link>
                </>
              )}

              {/* User Info */}
              <div className="px-3 py-2 border-t border-blue-700 mt-3 pt-3">
                <p className="font-semibold text-sm">{user.name || 'User'}</p>
                <p className="text-blue-200 text-xs">{user.email}</p>
                <p className="text-blue-300 text-xs capitalize">Role: {user.role}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-red-600 transition font-medium mt-2 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;



// import React, { useState } from 'react'; //react library for building user interfaces
// import { Link } from 'react-router-dom';//react-router-dom for navigation between different routes
// import { Menu, X, Scale } from 'lucide-react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-primary text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <Scale className="h-8 w-8 text-secondary" />
//             <span className="font-bold text-xl tracking-wide">Haki Yetu</span>
//           </Link>

//           {/* Desktop Menu */} 
//           <div className="hidden md:flex space-x-8">
//             <Link to="/services" className="hover:text-gray-300 transition">Services</Link>
//             <Link to="/lawyers" className="hover:text-gray-300 transition">Find a Lawyer</Link>
//             <Link to="/login" className="px-4 py-2 bg-secondary rounded hover:bg-red-700 transition">Login</Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-blue-900 px-2 pt-2 pb-3 space-y-1 sm:px-3">
//           <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-blue-800">Services</Link>
//           <Link to="/lawyers" className="block px-3 py-2 rounded-md hover:bg-blue-800">Find a Lawyer</Link>
//           <Link to="/login" className="block px-3 py-2 rounded-md bg-secondary text-center mt-4">Login</Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;