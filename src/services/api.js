import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // This points to your Flask Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// This "export default" is exactly what your error was missing
// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;