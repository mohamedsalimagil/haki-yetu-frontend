import { createContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service"; // Import the service

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might validate the token with the backend here
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      // Backend returns: { access_token: "...", user: {...} }
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setToken(response.data.access_token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Login Error", error);
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setToken(response.data.access_token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Registration Error", error);
      return { 
        success: false, 
        error: error.response?.data?.error || "Registration failed" 
      };
    }
  };

  const logout = () => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};