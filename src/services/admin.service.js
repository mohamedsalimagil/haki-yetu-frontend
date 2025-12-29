import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/admin/activity', {
      params: { limit },
    });
    return response.data;
  },

  // User Management
  getAllUsers: async ({ page = 1, limit = 10 } = {}) => {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/activate`);
    return response.data;
  },

  // Disputes
  getAllDisputes: async () => {
    const response = await api.get('/admin/disputes');
    return response.data;
  },

  resolveDispute: async (disputeId, data) => {
    const response = await api.patch(`/admin/disputes/${disputeId}/resolve`, data);
    return response.data;
  },

  // Lawyer Applications
  getPendingLawyerApplications: async () => {
    const response = await api.get('/admin/lawyer-applications/pending');
    return response.data;
  },

  approveLawyerApplication: async (applicationId) => {
    const response = await api.patch(`/admin/lawyer-applications/${applicationId}/approve`);
    return response.data;
  },

  rejectLawyerApplication: async (applicationId, data) => {
    const response = await api.patch(
      `/admin/lawyer-applications/${applicationId}/reject`,
      data
    );
    return response.data;
  },

  // System Logs
  getSystemLogs: async ({ page = 1, limit = 20 } = {}) => {
    const response = await api.get('/admin/logs', {
      params: { page, limit },
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};

export default adminService;
