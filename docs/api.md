# Haki Yetu Digital Platform - API Documentation

## Overview
This document outlines the API endpoints consumed by the Haki Yetu frontend application. All endpoints are prefixed with `/api` and require JWT authentication for protected routes.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Authentication Endpoints

### POST /auth/login
Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "bio": "User bio"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "client" // or "advocate"
}
```

**Response (201):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already exists"
}
```

### PUT /auth/profile
Update user profile information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "bio": "Updated bio",
  "avatar": "https://cloudinary.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "name": "Updated Name",
  "role": "client",
  "avatar": "https://cloudinary.com/new-avatar.jpg",
  "bio": "Updated bio"
}
```

## Marketplace Endpoints

### GET /marketplace/services
Get list of available legal services.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Affidavit Commissioning",
    "description": "Document authentication service",
    "base_price": 1500.00,
    "processing_days": 2,
    "category_id": 1
  }
]
```

### POST /marketplace/orders
Create a new service order.

**Request Body:**
```json
{
  "service_id": 1,
  "lawyer_id": 2,
  "description": "Order description",
  "documents": ["doc1.pdf", "doc2.pdf"]
}
```

**Response (201):**
```json
{
  "id": 1,
  "service_id": 1,
  "client_id": 3,
  "lawyer_id": 2,
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### GET /marketplace/orders
Get user's orders (filtered by role).

**Response (200):**
```json
[
  {
    "id": 1,
    "service_name": "Affidavit Commissioning",
    "status": "in_progress",
    "created_at": "2024-01-15T10:30:00Z",
    "lawyer_name": "Jane Doe"
  }
]
```

## Lawyer Endpoints

### GET /lawyer/profile
Get lawyer profile information.

**Response (200):**
```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@lawyer.com",
  "bio": "Experienced lawyer",
  "avatar": "https://cloudinary.com/avatar.jpg",
  "lsK_number": "LSK12345",
  "specializations": ["Family Law", "Property Law"]
}
```

### PUT /lawyer/availability
Update lawyer availability slots.

**Request Body:**
```json
{
  "slots": [
    {
      "date": "2024-01-20",
      "start_time": "09:00",
      "end_time": "17:00"
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Availability updated successfully"
}
```

## Communication Endpoints

### GET /communication/messages/:conversation_id
Get messages for a conversation.

**Response (200):**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "content": "Hello, I need help with my case",
    "timestamp": "2024-01-15T10:30:00Z",
    "message_type": "text"
  }
]
```

### POST /communication/messages
Send a message.

**Request Body:**
```json
{
  "conversation_id": 1,
  "content": "Thank you for your assistance",
  "message_type": "text"
}
```

**Response (201):**
```json
{
  "id": 2,
  "sender_id": 2,
  "content": "Thank you for your assistance",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

## Admin Endpoints

### GET /admin/users
Get all users (admin only).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "status": "active",
    "created_at": "2024-01-10T08:00:00Z"
  }
]
```

### PUT /admin/users/:id/status
Update user status (admin only).

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Violation of terms"
}
```

**Response (200):**
```json
{
  "message": "User status updated"
}
```

## Error Response Format
All endpoints follow a consistent error response format:

```json
{
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "details": {} // Optional additional error details
}
```

## Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting
- Authenticated requests: 1000 per hour
- Unauthenticated requests: 100 per hour
- File uploads: 10 per hour

## File Upload
- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX, JPG, PNG
- Images are stored on Cloudinary
- Documents are stored locally/AWS S3

## Real-time Features
- WebSocket connections for chat: `ws://localhost:5000`
- Events: `message_received`, `order_updated`, `notification`

## Versioning
API version is included in the URL path: `/api/v1/`
Current version: v1

## Pagination
List endpoints support pagination:
```
GET /api/resource?page=1&per_page=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
