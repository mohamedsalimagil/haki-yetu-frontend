import axios from "axios";
import toast from "react-hot-toast";

// Production-ready API configuration
// Explicitly point to Flask backend on port 5001
const API_URL = import.meta.env.VITE_API_URL || "https://haki-yetu-backend.onrender.com/api";
const TOKEN_KEY = "token";
const REFRESH_ENDPOINT = "/auth/refresh";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// JWT expiry check (no external library needed)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // exp is in seconds
  } catch {
    return true;
  }
};

// Request interceptor with expiry check
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem(TOKEN_KEY);

    // Handle FormData - remove Content-Type to let browser set it with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      try {
        const { data } = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        token = data.access_token || data.token;
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 with retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Critical: Refresh failed, force logout to stop loop
      if (originalRequest.url.includes('/auth/refresh')) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      // Skip auto-logout for KYC endpoint
      if (originalRequest.url.includes('/client/kyc')) {
        return Promise.reject(error);
      }

      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const { data } = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const newToken = data.access_token || data.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // Retry with new token
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Force logout on 401 after retry
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    // Network error (no response from server)
    if (!error.response) {
      toast.error(
        "Unable to connect to Haki Yetu servers. Please check your internet connection.",
        {
          duration: 5000,
          icon: '🔌'
        }
      );
    }

    return Promise.reject(error);
  }
);

export default api;
