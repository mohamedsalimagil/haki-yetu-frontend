export const mockNotifications = [
  {
    id: 1,
    type: 'Urgent',
    badge: 'urgent',
    title: 'New Dispute Filed: Case #4092',
    message: 'Breach of Contract claim filed in Nairobi. Requires immediate triage.',
    summary: 'Breach of Contract claim filed in Nairobi. Requires immediate triage.',
    time: '2 mins ago',
    action: 'Resolve Now',
    actionLink: '/admin/disputes/4092',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'Verification',
    badge: 'verification',
    title: 'New Advocate Registration',
    message: 'Jomo Kenyatta (ID: 88291) pending LSK document review.',
    summary: 'Jomo Kenyatta (ID: 88291) pending LSK document review.',
    time: '15 mins ago',
    action: 'Verify Profile',
    actionLink: '/admin/approvals',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'System',
    badge: 'system',
    title: 'Payment Gateway Warning',
    message: '5 failed M-Pesa transactions detected in the last hour.',
    summary: '5 failed M-Pesa transactions detected in the last hour.',
    time: '1 hour ago',
    action: 'View Logs',
    actionLink: '/admin/logs',
    read: false,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'Feedback',
    badge: 'feedback',
    title: 'Client Review Received',
    message: '5-star rating received for Advocate Sarah M.',
    summary: '5-star rating received for Advocate Sarah M.',
    time: '3 hours ago',
    action: 'Read Review',
    actionLink: '/admin/reviews',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    type: 'Urgent',
    badge: 'urgent',
    title: 'High-Value Dispute Escalated',
    message: 'Case #4088 involving KES 50,000 has been escalated.',
    summary: 'Case #4088 involving KES 50,000 has been escalated.',
    time: '5 hours ago',
    action: 'Review Case',
    actionLink: '/admin/disputes/4088',
    read: true,
    priority: 'high'
  },
  {
    id: 6,
    type: 'Verification',
    badge: 'verification',
    title: 'Client KYC Pending',
    message: 'Alice Wambui submitted ID documents for verification.',
    summary: 'Alice Wambui submitted ID documents for verification.',
    time: '1 day ago',
    action: 'Verify Documents',
    actionLink: '/admin/client-verification',
    read: true,
    priority: 'medium'
  },
  {
    id: 7,
    type: 'System',
    badge: 'system',
    title: 'Scheduled Maintenance',
    message: 'System backup completed successfully at 2:00 AM.',
    summary: 'System backup completed successfully at 2:00 AM.',
    time: '2 days ago',
    action: 'View Details',
    actionLink: '/admin/logs',
    read: true,
    priority: 'low'
  }
];

export const notificationStats = {
  total: 24,
  unread: 3,
  urgent: 2,
  verifications: 4
};

export const notificationTypes = [
  { value: 'all', label: 'All Notifications', count: 24 },
  { value: 'unread', label: 'Unread', count: 3 },
  { value: 'urgent', label: 'Urgent Disputes', count: 2 },
  { value: 'verifications', label: 'Verifications', count: 4 }
];
