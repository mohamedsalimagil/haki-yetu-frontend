import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-4">Haki Yetu Digital</h1>
        <p className="text-gray-600 mb-6">Legal Services Platform</p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/login" className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                  Client Sign Up
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Welcome back, {user.name}!</p>
                <div className="flex flex-col gap-2">
                  {user.role === 'advocate' && (
                    <Link to="/dashboard/lawyer" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                      Go to Lawyer Dashboard
                    </Link>
                  )}
                  {user.role === 'client' && (
                    <Link to="/dashboard/client" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                      Go to Client Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Profile Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
          {!user && (
            <div>
              <Link to="/register/lawyer" className="text-primary hover:text-blue-700 text-sm underline">
                Register as a Legal Professional
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
