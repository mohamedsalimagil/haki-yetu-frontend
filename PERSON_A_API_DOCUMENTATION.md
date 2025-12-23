# Person A (Users & Engagement) - API Documentation
*Untracked file for internal reference - NOT committed to version control*

## Overview
This document contains comprehensive API documentation for all endpoints implemented by Person A (Users & Engagement) across all development days. This covers authentication, user profiles, lawyer registration, chat, and user management features.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

---

# Day 1: Authentication Blueprint & JWT Logic

## POST /auth/register
Register a new user (client or advocate).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "client",  // "client" or "advocate"
  "phone": "+254712345678"  // Optional
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```

**Error Responses:**
- `400`: Email already registered, missing required fields, invalid role
- `422`: Validation errors

## POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "client",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `422`: Missing email or password

---

# Day 2: Email Verification & Password Reset

## POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

## POST /auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

## POST /auth/verify-email
Verify email address using verification token.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

---

# Day 2: User Profile Settings

## GET /auth/profile
Get current user's profile information.

**Response (200):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "client",
  "avatar": "https://cloudinary.com/avatar.jpg",
  "bio": "User bio",
  "phone": "+254712345678",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## PUT /auth/profile
Update user profile information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "phone": "+254712345678",
  "avatar": "https://cloudinary.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "Updated Name",
  "role": "client",
  "avatar": "https://cloudinary.com/new-avatar.jpg",
  "bio": "Updated bio",
  "phone": "+254712345678",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

# Day 3: Lawyer Model Extensions

## POST /auth/register/lawyer
Register a new lawyer with extended professional information.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@lawyer.com",
  "password": "securePassword123",
  "role": "advocate",
  "phone": "+254712345678",
  "lawyer_profile": {
    "lsk_number": "LSK/1234/2020",
    "bio": "Experienced corporate lawyer with 8+ years in practice",
    "specializations": ["Corporate Law", "Commercial Law", "Contract Law"],
    "years_of_experience": 8,
    "location": "Nairobi",
    "languages": ["English", "Swahili"],
    "education": "LLB University of Nairobi, 2016\nPostgraduate Diploma in Law, Kenya School of Law, 2017",
    "certifications": "Admitted Advocate of the High Court of Kenya\nMember of Law Society of Kenya",
    "bar_admission": "Admitted to the Bar: January 2018"
  }
}
```

**Response (201):**
```json
{
  "message": "Lawyer registration submitted for review",
  "user_id": 2,
  "status": "pending_verification"
}
```

**Notes:**
- Registration creates a lawyer profile that requires admin verification
- All lawyer_profile fields are optional except lsk_number, bio, and at least one specialization
- Status remains "pending" until admin approves

## GET /lawyer/profile/:id
Get lawyer profile information (public access).

**Response (200):**
```json
{
  "id": 2,
  "user_id": 2,
  "name": "Jane Doe",
  "email": "jane@lawyer.com",
  "bio": "Experienced corporate lawyer with 8+ years in practice",
  "avatar": "https://cloudinary.com/avatar.jpg",
  "lsk_number": "LSK/1234/2020",
  "specializations": ["Corporate Law", "Commercial Law", "Contract Law"],
  "years_of_experience": 8,
  "location": "Nairobi",
  "languages": ["English", "Swahili"],
  "education": "LLB University of Nairobi, 2016...",
  "certifications": "Admitted Advocate of the High Court...",
  "bar_admission": "Admitted to the Bar: January 2018",
  "rating": 4.8,
  "review_count": 24,
  "status": "verified"
}
```

---

# Day 4: Lawyer Availability Logic

## GET /lawyer/availability/:lawyer_id
Get lawyer's available time slots.

**Query Parameters:**
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `week` (optional): Get availability for entire week

**Response (200):**
```json
{
  "lawyer_id": 2,
  "availability": [
    {
      "id": 1,
      "date": "2024-01-20",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "is_available": true
    },
    {
      "id": 2,
      "date": "2024-01-21",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "is_available": true
    }
  ]
}
```

## POST /lawyer/availability
Set/update lawyer availability slots.

**Request Body:**
```json
{
  "slots": [
    {
      "date": "2024-01-20",
      "start_time": "09:00:00",
      "end_time": "12:00:00",
      "is_recurring": false
    },
    {
      "date": "2024-01-20",
      "start_time": "14:00:00",
      "end_time": "17:00:00",
      "is_recurring": false
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Availability updated successfully",
  "slots_created": 2
}
```

## PUT /lawyer/availability/:slot_id
Update specific availability slot.

**Request Body:**
```json
{
  "start_time": "10:00:00",
  "end_time": "16:00:00",
  "is_available": false
}
```

**Response (200):**
```json
{
  "message": "Availability slot updated"
}
```

---

# Day 5: Lawyer "My Earnings" Calculation

## GET /lawyer/earnings
Get lawyer's earnings summary.

**Query Parameters:**
- `period` (optional): "week", "month", "year" (default: "month")
- `year` (optional): Specific year for filtering

**Response (200):**
```json
{
  "summary": {
    "total_earned": 150000.00,
    "pending_payments": 25000.00,
    "available_balance": 125000.00,
    "completed_orders": 45,
    "period": "month"
  },
  "breakdown": [
    {
      "month": "2024-01",
      "earned": 45000.00,
      "orders_completed": 12
    },
    {
      "month": "2024-02",
      "earned": 52000.00,
      "orders_completed": 15
    }
  ]
}
```

## GET /lawyer/earnings/transactions
Get detailed earnings transactions.

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20)
- `status`: "completed", "pending", "paid"

**Response (200):**
```json
{
  "transactions": [
    {
      "id": 1,
      "order_id": 123,
      "service_name": "Contract Drafting",
      "amount": 15000.00,
      "status": "completed",
      "completed_at": "2024-01-15T14:30:00Z",
      "paid_at": "2024-01-16T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

# Day 5: Client Dashboard

## GET /client/dashboard
Get client's dashboard overview.

**Response (200):**
```json
{
  "active_orders": 3,
  "completed_orders": 12,
  "total_spent": 125000.00,
  "recent_orders": [
    {
      "id": 123,
      "service_name": "Contract Drafting",
      "lawyer_name": "Jane Doe",
      "status": "in_progress",
      "created_at": "2024-01-10T10:00:00Z",
      "due_date": "2024-01-20T17:00:00Z"
    }
  ]
}
```

## GET /client/orders
Get client's order history with filtering.

**Query Parameters:**
- `status`: "pending", "in_progress", "completed", "cancelled"
- `page`: Page number
- `per_page`: Items per page

**Response (200):**
```json
{
  "orders": [
    {
      "id": 123,
      "service_name": "Contract Drafting",
      "lawyer_name": "Jane Doe",
      "lawyer_avatar": "https://cloudinary.com/avatar.jpg",
      "status": "in_progress",
      "price": 15000.00,
      "created_at": "2024-01-10T10:00:00Z",
      "due_date": "2024-01-20T17:00:00Z",
      "can_rate": false
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 15,
    "total_pages": 1
  }
}
```

---

# Day 6: Reviews and Ratings Logic

## POST /reviews
Submit a review for a completed order.

**Request Body:**
```json
{
  "order_id": 123,
  "rating": 5,
  "comment": "Excellent service, very professional and timely delivery",
  "would_recommend": true
}
```

**Response (201):**
```json
{
  "id": 1,
  "order_id": 123,
  "rating": 5,
  "comment": "Excellent service, very professional and timely delivery",
  "would_recommend": true,
  "created_at": "2024-01-16T10:00:00Z"
}
```

**Notes:**
- Only clients can review completed orders
- One review per order allowed
- Rating must be 1-5 stars

## GET /lawyer/:id/reviews
Get reviews for a specific lawyer.

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page
- `rating`: Filter by rating (1-5)

**Response (200):**
```json
{
  "lawyer_id": 2,
  "average_rating": 4.8,
  "total_reviews": 24,
  "reviews": [
    {
      "id": 1,
      "client_name": "John Doe",
      "rating": 5,
      "comment": "Excellent service...",
      "created_at": "2024-01-16T10:00:00Z",
      "would_recommend": true
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 24,
    "total_pages": 3
  }
}
```

## GET /reviews/my-reviews
Get reviews submitted by current user.

**Response (200):**
```json
{
  "reviews": [
    {
      "id": 1,
      "order_id": 123,
      "lawyer_name": "Jane Doe",
      "service_name": "Contract Drafting",
      "rating": 5,
      "comment": "Excellent service...",
      "created_at": "2024-01-16T10:00:00Z"
    }
  ]
}
```

---

# Day 6: Rating Modal (Frontend Component)
*This is a frontend component, documented here for completeness*

The rating modal appears after order completion and includes:
- 5-star rating selector
- Text comment field
- "Would recommend" checkbox
- Submit button with loading state

---

# Day 7: Socket.IO Real-time Chat Setup

## WebSocket Events (Person A)
Real-time chat events handled by Person A implementation:

### Connection
```
Client connects: /api/communication/chat
Authentication: JWT token required
```

### Events Subscribed
- `connect`: Connection established
- `disconnect`: Connection lost
- `message_received`: New message from other user
- `typing_start`: User started typing
- `typing_stop`: User stopped typing
- `message_read`: Message marked as read

### Events Emitted
- `join_conversation`: Join specific chat room
- `send_message`: Send message to conversation
- `start_typing`: Indicate typing status
- `stop_typing`: Clear typing status
- `mark_read`: Mark messages as read

---

# Day 7: Chat Interface (Sidebar & List)

## GET /communication/conversations
Get user's active conversations.

**Response (200):**
```json
{
  "conversations": [
    {
      "id": 1,
      "other_user": {
        "id": 2,
        "name": "Jane Doe",
        "avatar": "https://cloudinary.com/avatar.jpg",
        "role": "advocate"
      },
      "last_message": {
        "content": "I've reviewed your contract draft",
        "timestamp": "2024-01-15T14:30:00Z",
        "sender_id": 2
      },
      "unread_count": 3,
      "order_id": 123
    }
  ]
}
```

---

# Day 8: Chat Persistence

## GET /communication/messages/:conversation_id
Get messages for a specific conversation.

**Query Parameters:**
- `page`: Page number
- `per_page`: Messages per page (default: 50)
- `before`: Get messages before this timestamp

**Response (200):**
```json
{
  "conversation_id": 1,
  "messages": [
    {
      "id": 1,
      "sender_id": 2,
      "content": "Hello! I've received your documents.",
      "message_type": "text",
      "timestamp": "2024-01-15T10:00:00Z",
      "is_read": true,
      "attachments": []
    },
    {
      "id": 2,
      "sender_id": 1,
      "content": "Thank you. Please review the contract.",
      "message_type": "text",
      "timestamp": "2024-01-15T10:05:00Z",
      "is_read": false,
      "attachments": ["contract_draft.pdf"]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 2,
    "has_more": false
  }
}
```

## POST /communication/messages
Send a message in a conversation.

**Request Body:**
```json
{
  "conversation_id": 1,
  "content": "Please find the updated contract attached",
  "message_type": "text",
  "attachments": ["updated_contract.pdf"]
}
```

**Response (201):**
```json
{
  "id": 3,
  "conversation_id": 1,
  "sender_id": 1,
  "content": "Please find the updated contract attached",
  "message_type": "text",
  "timestamp": "2024-01-15T10:10:00Z",
  "attachments": [
    {
      "id": 1,
      "filename": "updated_contract.pdf",
      "url": "/api/documents/download/123"
    }
  ]
}
```

---

# Day 8: Chat Window (Features)

## PUT /communication/messages/:message_id/read
Mark message as read.

**Response (200):**
```json
{
  "message": "Message marked as read"
}
```

## WebSocket Message Format
Real-time messages follow this structure:
```json
{
  "event": "message_received",
  "data": {
    "conversation_id": 1,
    "message": {
      "id": 3,
      "sender_id": 2,
      "content": "New message content",
      "timestamp": "2024-01-15T10:10:00Z",
      "message_type": "text"
    }
  }
}
```

---

# Day 9: Connect Chat to Bookings

## GET /communication/conversation/:order_id
Get or create conversation for a specific order.

**Response (200):**
```json
{
  "conversation_id": 1,
  "order_id": 123,
  "participants": [
    {
      "id": 1,
      "name": "John Doe",
      "role": "client"
    },
    {
      "id": 2,
      "name": "Jane Doe",
      "role": "advocate"
    }
  ],
  "created": true  // false if conversation already existed
}
```

---

# Day 9: Alerts & Notifications

## GET /notifications
Get user's notifications.

**Query Parameters:**
- `unread_only`: true/false (default: false)
- `page`: Page number
- `per_page`: Items per page

**Response (200):**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "order_status_change",
      "title": "Order Status Updated",
      "message": "Your contract drafting order is now complete",
      "is_read": false,
      "created_at": "2024-01-15T14:30:00Z",
      "data": {
        "order_id": 123,
        "old_status": "in_progress",
        "new_status": "completed"
      }
    },
    {
      "id": 2,
      "type": "new_message",
      "title": "New Message",
      "message": "You have a new message from Jane Doe",
      "is_read": false,
      "created_at": "2024-01-15T15:00:00Z",
      "data": {
        "conversation_id": 1,
        "sender_name": "Jane Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 15,
    "unread_count": 5
  }
}
```

## PUT /notifications/:id/read
Mark notification as read.

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

## PUT /notifications/mark-all-read
Mark all notifications as read.

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "marked_count": 5
}
```

---

# Day 10: UI/UX Polish (Person A Components)

## Components Updated:
- Login/Register Forms: Enhanced styling and validation
- User Profile Settings: Improved form layout and Cloudinary integration
- Lawyer Registration Form: Multi-step wizard with professional styling
- Client Dashboard: Responsive card layouts
- Lawyer Dashboard: Calendar view improvements
- Chat Interface: Message bubbles and real-time indicators

---

# Day 11: Unit Tests for Auth & Lawyer Flows

## Test Coverage Areas:
- Authentication endpoints (login, register, profile updates)
- Lawyer registration with extended profile fields
- JWT token validation and refresh
- Password hashing and verification
- Email verification workflow
- Profile update validations
- Lawyer availability management
- Earnings calculation logic
- Review and rating system
- Chat message persistence
- Notification system

---

# Implementation Status Summary

## ✅ Completed (Days 1-3)
- [x] Day 1: Auth Context & Login/Register Forms
- [x] Day 2: User Profile Settings
- [x] Day 3: Lawyer Registration Multi-step Form

## 🔄 In Progress / Planned
- [ ] Day 4: Lawyer Availability Logic (Backend)
- [ ] Day 4: Lawyer Dashboard (Calendar View) (Frontend)
- [ ] Day 5: Lawyer "My Earnings" Calculation (Backend)
- [ ] Day 5: Client Dashboard (Frontend)
- [ ] Day 6: Reviews and Ratings Logic (Backend)
- [ ] Day 6: Rating Modal (Frontend)
- [ ] Day 7: Socket.IO Real-time Chat Setup (Backend)
- [ ] Day 7: Chat Interface (Sidebar & List) (Frontend)
- [ ] Day 8: Chat Persistence (Backend)
- [ ] Day 8: Chat Window (Features) (Frontend)
- [ ] Day 9: Connect Chat to Bookings (Integration)
- [ ] Day 9: Alerts & Notifications (Frontend)
- [ ] Day 10: UI/UX Polish (Frontend)
- [ ] Day 11: Unit Tests (Testing)

---

*This document will be updated with each new Person A feature implementation. Keep it untracked for internal reference only.*
