# Consultation Reschedule Feature Implementation Guide

## Overview
This guide documents the implementation of the lawyer consultation reschedule feature with automatic client notifications.

## Features Implemented

### 1. Lawyer Side - Reschedule Functionality
- **Location**: [src/pages/lawyer/AvailabilitySettings.jsx](src/pages/lawyer/AvailabilitySettings.jsx)
- **Features**:
  - View upcoming bookings
  - Click "Reschedule" button to open reschedule modal
  - Select new date and time slot
  - Provide reason for rescheduling (required)
  - Automatic client notification upon confirmation

### 2. Client Side - Notification System
- **Location**: [src/components/common/NotificationBell.jsx](src/components/common/NotificationBell.jsx)
- **Features**:
  - Bell icon with unread count badge
  - Dropdown showing all notifications
  - Mark individual notifications as read
  - Mark all notifications as read
  - Delete notifications
  - Auto-refresh every 30 seconds
  - Different icons for different notification types

### 3. Backend API Services
- **Location**: [src/services/lawyer.service.js](src/services/lawyer.service.js)
- **New Methods**:
  - `rescheduleConsultation(consultationId, newDate, newTimeSlot, reason)`
  - `cancelConsultation(consultationId, reason)`

- **Location**: [src/services/notification.service.js](src/services/notification.service.js)
- **Methods**:
  - `getNotifications()` - Fetch all notifications
  - `markAsRead(notificationId)` - Mark single notification as read
  - `markAllAsRead()` - Mark all notifications as read
  - `deleteNotification(notificationId)` - Delete a notification
  - `getUnreadCount()` - Get count of unread notifications

## How to Use

### For Lawyers - Rescheduling a Consultation

1. Navigate to **My Calendar** page (`/lawyer/availability`)
2. Click on the **"Upcoming Bookings"** tab
3. Find the consultation you want to reschedule
4. Click the **"Reschedule"** button
5. In the modal:
   - Select a new date (must be today or later)
   - Select a new time slot from dropdown
   - Enter a reason for rescheduling (required - client will see this)
6. Click **"Confirm Reschedule"**
7. The client will automatically receive a notification

### For Clients - Viewing Notifications

To add the notification bell to any client page, import and use the component:

```jsx
import NotificationBell from '../../components/common/NotificationBell';

// In your component JSX (typically in header/navbar):
<NotificationBell />
```

**Example Integration in Client Header:**

```jsx
// src/components/layout/ClientHeader.jsx
import React from 'react';
import NotificationBell from '../common/NotificationBell';

const ClientHeader = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Haki Yetu</h1>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
};
```

## API Endpoints Required

The following backend API endpoints are expected:

### Lawyer Endpoints
```
PUT /api/documents/consultations/:id/reschedule
Body: {
  consultation_id: number,
  new_date: string (YYYY-MM-DD),
  new_time_slot: string (HH:MM),
  reason: string
}
Response: { success: boolean, message: string, consultation: object }
```

```
PUT /api/documents/consultations/:id/cancel
Body: {
  cancellation_reason: string
}
Response: { success: boolean, message: string }
```

### Notification Endpoints
```
GET /api/notifications
Response: { notifications: array }
```

```
PUT /api/notifications/:id/read
Response: { success: boolean }
```

```
PUT /api/notifications/read-all
Response: { success: boolean }
```

```
DELETE /api/notifications/:id
Response: { success: boolean }
```

```
GET /api/notifications/unread-count
Response: { count: number }
```

## Notification Data Structure

Notifications should follow this structure:

```javascript
{
  id: number,
  type: string, // 'consultation_rescheduled', 'booking', 'message', 'document', 'alert'
  title: string,
  message: string,
  read: boolean,
  created_at: string (ISO 8601 timestamp),
  user_id: number,
  related_id: number (optional - e.g., consultation_id),
  related_type: string (optional - e.g., 'consultation')
}
```

### Example Notification for Rescheduled Consultation

```javascript
{
  id: 123,
  type: 'consultation_rescheduled',
  title: 'Consultation Rescheduled',
  message: 'Your consultation with Advocate John Kamau has been rescheduled to January 15, 2025 at 14:00. Reason: Court appearance conflict.',
  read: false,
  created_at: '2025-01-11T10:30:00Z',
  user_id: 456,
  related_id: 789,
  related_type: 'consultation'
}
```

## Backend Requirements

### When a Lawyer Reschedules:

1. **Update the consultation record** with new date/time
2. **Create a notification** for the client
3. **Send an email** to the client (optional but recommended)
4. **Return success response** with updated consultation details

### Example Backend Implementation (Python/Flask):

```python
@app.route('/api/documents/consultations/<int:consultation_id>/reschedule', methods=['PUT'])
@login_required
def reschedule_consultation(consultation_id):
    data = request.json
    consultation = Consultation.query.get_or_404(consultation_id)

    # Verify the lawyer owns this consultation
    if consultation.lawyer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    # Update consultation
    old_date = consultation.date
    old_time = consultation.time_slot
    consultation.date = data['new_date']
    consultation.time_slot = data['new_time_slot']
    consultation.status = 'rescheduled'

    # Create notification for client
    notification = Notification(
        user_id=consultation.client_id,
        type='consultation_rescheduled',
        title='Consultation Rescheduled',
        message=f'Your consultation has been rescheduled to {data["new_date"]} at {data["new_time_slot"]}. Reason: {data["reason"]}',
        related_id=consultation_id,
        related_type='consultation'
    )

    db.session.add(notification)
    db.session.commit()

    # Send email notification (optional)
    send_reschedule_email(consultation, old_date, old_time, data['reason'])

    return jsonify({
        'success': True,
        'message': 'Consultation rescheduled successfully',
        'consultation': consultation.to_dict()
    })
```

## Testing the Feature

### Manual Testing Steps:

1. **Setup**:
   - Ensure backend API endpoints are implemented
   - Ensure a lawyer has at least one upcoming consultation
   - Ensure client has access to notifications

2. **Test Reschedule Flow**:
   - Login as lawyer
   - Navigate to `/lawyer/availability`
   - Click "Upcoming Bookings" tab
   - Click "Reschedule" on a consultation
   - Try submitting without reason (should show error)
   - Fill in new date, time, and reason
   - Click "Confirm Reschedule"
   - Verify success toast appears
   - Verify booking list refreshes

3. **Test Notification Flow**:
   - Login as the client whose consultation was rescheduled
   - Check notification bell shows unread count
   - Click bell to open dropdown
   - Verify reschedule notification appears
   - Click mark as read
   - Verify unread count decreases
   - Test delete notification
   - Test mark all as read

## Files Modified/Created

### Modified Files:
1. [src/pages/lawyer/AvailabilitySettings.jsx](src/pages/lawyer/AvailabilitySettings.jsx)
   - Added reschedule modal
   - Added reschedule handlers
   - Connected to API service

2. [src/services/lawyer.service.js](src/services/lawyer.service.js)
   - Added `rescheduleConsultation` method
   - Added `cancelConsultation` method

### Created Files:
1. [src/services/notification.service.js](src/services/notification.service.js)
   - Complete notification API service

2. [src/components/common/NotificationBell.jsx](src/components/common/NotificationBell.jsx)
   - Reusable notification bell component
   - Auto-refreshing notification list
   - Read/delete functionality

## Next Steps

1. **Implement Backend API Endpoints**:
   - Create the reschedule endpoint
   - Create notification endpoints
   - Set up email notifications (optional)

2. **Add Notification Bell to Client Pages**:
   - Add to client dashboard header
   - Add to client navigation bar
   - Test across different client pages

3. **Enhance Notifications**:
   - Add click handlers to navigate to related items
   - Add notification preferences
   - Add push notifications (optional)

4. **Additional Features** (Optional):
   - Allow clients to accept/reject reschedule requests
   - Add calendar sync (Google Calendar, Outlook)
   - Add SMS notifications
   - Add in-app chat for discussing reschedules

## Troubleshooting

### Reschedule button not working:
- Check console for errors
- Verify backend API endpoint is running
- Check network tab for failed requests

### Notifications not appearing:
- Verify notification service is returning data
- Check backend notification creation
- Verify user_id matches in notification records

### Unread count not updating:
- Check if `getUnreadCount` API is working
- Verify polling interval (30 seconds)
- Check for JavaScript console errors

## Support

For issues or questions:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify backend logs for API errors
4. Review this documentation

---

**Last Updated**: January 11, 2025
**Version**: 1.0.0
