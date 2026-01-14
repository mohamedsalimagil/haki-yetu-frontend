import api from '../api/axios.js';

const notificationService = {
  /**
   * Fetches all notifications for the logged-in user.
   */
  getNotifications: async () => {
    const response = await api.get('/chat/notifications');
    return response.data.notifications || [];
  },

  /**
   * Marks a notification as read.
   * @param {number} notificationId - The ID of the notification to mark as read
   */
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/chat/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Marks all notifications as read.
   */
  markAllAsRead: async () => {
    const response = await api.patch('/chat/notifications/read-all');
    return response.data;
  },

  /**
   * Deletes a notification.
   * @param {number} notificationId - The ID of the notification to delete
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/chat/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Gets the count of unread notifications.
   */
  getUnreadCount: async () => {
    const response = await api.get('/chat/notifications');
    const notifications = response.data.notifications || [];
    return notifications.filter(n => !n.read).length;
  }
};

export default notificationService;
