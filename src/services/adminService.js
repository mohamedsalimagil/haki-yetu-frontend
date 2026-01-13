import axios from 'axios';
import api from './api';

// Use environment variable for API base URL (production vs development)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
    const response = await axios.get(`${API_BASE}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: { page, limit },
    });
    return response.data;
  },

  suspendUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_BASE}/api/admin/users/${userId}/suspend`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  activateUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_BASE}/api/admin/users/${userId}/activate`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  // Disputes
  getAllDisputes: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/admin/disputes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  resolveDispute: async (disputeId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_BASE}/api/admin/disputes/${disputeId}/resolve`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  // System Logs
  getSystemLogs: async ({ page = 1, limit = 20 } = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/admin/logs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: { page, limit },
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/admin/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params,
    });
    return response.data;
  },

  approveLawyerApplication: async (applicationId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/api/admin/lawyer-applications/${applicationId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  rejectLawyerApplication: async (applicationId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/api/admin/lawyer-applications/${applicationId}/reject`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
    const response = await axios.get(`${API_BASE}/api/admin/lawyer-applications/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  // Client verification methods
  getClientQueue: async (status = 'pending') => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/admin/clients/pending?status=${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  verifyClient: async (clientId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/api/admin/verify-user/${clientId}`, { status: 'approved' }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  },

  rejectClient: async (clientId, reason) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/api/admin/clients/${clientId}/reject`, { reason }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  },

  // Templates
  getTemplates: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/api/documents/templates`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  createTemplate: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/api/documents/templates`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateTemplate: async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_BASE}/api/documents/templates/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteTemplate: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE}/api/documents/templates/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  exportReports: async () => {
    const response = await api.get('/api/admin/reports/export', {
      responseType: 'blob'
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
export const getTemplates = adminService.getTemplates;
export const createTemplate = adminService.createTemplate;
export const updateTemplate = adminService.updateTemplate;
export const deleteTemplate = adminService.deleteTemplate;
export const exportReports = adminService.exportReports;

export default adminService;
