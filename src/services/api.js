import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // This points to your Flask Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// This "export default" is exactly what your error was missing
export default api;