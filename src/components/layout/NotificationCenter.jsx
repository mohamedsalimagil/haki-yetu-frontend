import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import socketService from '../../services/socket.service';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Verification',
      title: 'New Lawyer Registration',
      message: 'Jomo Kenyatta has submitted their lawyer registration for review.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      action: 'Verify Profile',
      actionUrl: '/admin/approvals'
    },
    {
      id: 2,
      type: 'Urgent',
      title: 'Dispute Resolution Required',
      message: 'Case #4092 requires immediate admin intervention.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      action: 'Review Case',
      actionUrl: '/admin/disputes'
    },
    {
      id: 3,
      type: 'System',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM EAT.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true,
      action: null
    },
    {
      id: 4,
      type: 'Verification',
      title: 'Document Verification Complete',
      message: 'All documents for case #1567 have been verified successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      action: null
    }
  ]);

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    const handleNotification = (data) => {
      const newNotification = {
        id: Date.now(),
        type: data.type || 'System',
        title: data.title || 'New Notification',
        message: data.message || '',
        timestamp: new Date(),
        read: false,
        action: data.action,
        actionUrl: data.actionUrl
      };
      setNotifications(prev => [newNotification, ...prev]);
    };

    socket.on('new_notification', handleNotification);

    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Verification':
        return <CheckCircle className="w-4 h-4" />;
      case 'System':
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'Urgent':
        return 'bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-xs font-medium';
      case 'Verification':
        return 'bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium';
      case 'System':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full text-xs font-medium';
      case 'Feedback':
        return 'bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleAction = (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    markAsRead(notification.id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
        <p className="text-gray-600 mt-2">Stay updated with system alerts and verification requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500">You'll see notifications here when there are updates to review.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition ${!notification.read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeStyles(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {notification.action && (
                      <button
                        onClick={() => handleAction(notification)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                      >
                        {notification.action}
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
