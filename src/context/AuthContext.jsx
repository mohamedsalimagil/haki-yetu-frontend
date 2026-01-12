import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import socketService from '../services/socket.service'; // Day 7: Import Socket Service

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user details
          const response = await api.get('/api/auth/me');
          const userData = response.data;

          // Only connect socket if user is verified (not during onboarding)
          if (userData.verification_status === 'verified') {
            socketService.connect(token);
          }

          setUser(userData);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
          socketService.disconnect(); // Ensure clean state
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { access_token, user } = response.data;

      // --- NEW LOGIC: BLOCK PENDING USERS ---
      // If the user is a client and is pending, DO NOT let them log in.
      if (user.role === 'client' && (user.status === 'pending' || user.verification_status === 'pending')) {
        // We throw a specific object so the Login component recognizes it
        throw {
          response: {
            data: {
              error: "ACCOUNT_PENDING",
              message: "Your account is currently under verification. Please wait for admin approval."
            }
          }
        };
      }
      // --------------------------------------

      localStorage.setItem('token', access_token);
      setUser(user);

      // Day 7: Connect socket on successful login
      socketService.connect(access_token);

      // Return user to help with navigation in Login.jsx
      return user;

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Handle file upload if avatar is present
      let response;
      if (userData instanceof FormData) {
        response = await api.post('/api/auth/register', userData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/api/auth/register', userData, { withCredentials: true });
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);

      // Day 7: Connect socket on successful registration
      socketService.connect(access_token);

      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      // Backend returns { error: "..." } or { message: "..." }
      const msg = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      return {
        success: false,
        message: msg
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

    // Day 7: Disconnect socket on logout
    socketService.disconnect();
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- THIS IS THE MISSING EXPORT THAT CAUSED THE ERROR ---
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };
