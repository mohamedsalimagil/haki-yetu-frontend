import axios from 'axios';
import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    console.log("Dashboard Stats Received:", response.data);
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/api/admin/activity', {
      params: { limit },
    });
    return response.data;
  },

  // User Management
  getAllUsers: async ({ page = 1, limit = 10 } = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: { page, limit },
      withCredentials: true
    });
    return response.data;
  },

  suspendUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://127.0.0.1:5000/api/admin/users/${userId}/suspend`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  activateUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://127.0.0.1:5000/api/admin/users/${userId}/activate`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  // Disputes
  getAllDisputes: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/disputes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  resolveDispute: async (disputeId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://127.0.0.1:5000/api/admin/disputes/${disputeId}/resolve`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  // System Logs
  getSystemLogs: async ({ page = 1, limit = 20 } = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/logs', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: { page, limit },
      withCredentials: true
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params,
      withCredentials: true
    });
    return response.data;
  },

  approveLawyerApplication: async (applicationId) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://127.0.0.1:5000/api/admin/lawyer-applications/${applicationId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  rejectLawyerApplication: async (applicationId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://127.0.0.1:5000/api/admin/lawyer-applications/${applicationId}/reject`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  verifyUser: async (userId, status) => {
    if (status === "approved") {
      return await adminService.approveLawyerApplication(userId);
    } else if (status === "rejected") {
      return await adminService.rejectLawyerApplication(userId, { reason: "Verification failed" });
    }
  },

  getPendingLawyerApplications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/admin/lawyer-applications/pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  // Client verification methods
  getClientQueue: async (status = 'pending') => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://127.0.0.1:5000/api/admin/clients/pending?status=${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  verifyClient: async (clientId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://127.0.0.1:5000/api/admin/verify-user/${clientId}`, { status: 'approved' }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

  rejectClient: async (clientId, reason) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://127.0.0.1:5000/api/admin/clients/${clientId}/reject`, { reason }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  },

};

// Named exports for individual functions
export const getDashboardStats = adminService.getDashboardStats;
export const getRecentActivity = adminService.getRecentActivity;
export const getAllUsers = adminService.getAllUsers;
export const suspendUser = adminService.suspendUser;
export const activateUser = adminService.activateUser;
export const getAllDisputes = adminService.getAllDisputes;
export const resolveDispute = adminService.resolveDispute;
export const getSystemLogs = adminService.getSystemLogs;
export const getAnalytics = adminService.getAnalytics;
export const getPendingLawyerApplications = adminService.getPendingLawyerApplications;
export const approveLawyerApplication = adminService.approveLawyerApplication;
export const rejectLawyerApplication = adminService.rejectLawyerApplication;
export const verifyUser = adminService.verifyUser;

export default adminService;
