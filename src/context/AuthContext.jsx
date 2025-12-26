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
          const response = await api.get('/auth/me');
          setUser(response.data);

          // Day 7: Connect socket if user is confirmed
          socketService.connect(token);
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
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      setUser(user);

      // Day 7: Connect socket on successful login
      socketService.connect(access_token);

      return { success: true, user };
    } catch (error) {
      console.error("Login failed", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      // Handle file upload if avatar is present
      let response;
      if (userData instanceof FormData) {
          response = await api.post('/auth/register', userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
      } else {
          response = await api.post('/auth/register', userData);
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);

      // Day 7: Connect socket on successful registration
      socketService.connect(access_token);

      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

    // Day 7: Disconnect socket on logout
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- THIS IS THE MISSING EXPORT THAT CAUSED THE ERROR ---
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };
