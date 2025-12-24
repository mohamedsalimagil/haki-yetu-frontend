import React, { useState } from 'react';
import { FileText, Code, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const APIDocumentation = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const apiSections = [
    {
      id: 'auth',
      title: 'Authentication',
      description: 'User authentication and authorization endpoints',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'User login with email and password',
          request: `{
  "email": "user@example.com",
  "password": "password123"
}`,
          response: `{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "client"
  }
}`
        },
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'User registration',
          request: `{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "client"
}`,
          response: `{
  "message": "User registered successfully",
  "user_id": 1
}`
        }
      ]
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Legal service management endpoints',
      endpoints: [
        {
          method: 'GET',
          path: '/api/services',
          description: 'Get all available services',
          response: `{
  "services": [
    {
      "id": 1,
      "name": "Affidavit Commissioning",
      "description": "Official affidavit services",
      "base_price": 1500,
      "category": "Document Services"
    }
  ]
}`
        },
        {
          method: 'GET',
          path: '/api/services/{id}',
          description: 'Get service details by ID',
          response: `{
  "id": 1,
  "name": "Affidavit Commissioning",
  "description": "Official affidavit services",
  "requirements": ["ID Copy", "Affidavit Draft"],
  "base_price": 1500
}`
        }
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings',
      description: 'Service booking and management endpoints',
      endpoints: [
        {
          method: 'POST',
          path: '/api/bookings',
          description: 'Create a new service booking',
          request: `{
  "service_id": 1,
  "lawyer_id": 6,
  "description": "Need affidavit commissioning",
  "urgency_level": "normal"
}`,
          response: `{
  "booking_id": "HD7473123456",
  "status": "draft",
  "amount": 1500,
  "message": "Booking created successfully"
}`
        },
        {
          method: 'GET',
          path: '/api/bookings/my-bookings',
          description: 'Get user\'s bookings',
          response: `{
  "bookings": [
    {
      "id": 1,
      "service_name": "Affidavit Commissioning",
      "lawyer_name": "Advocate James Sang",
      "status": "pending",
      "amount": 1500,
      "created_at": "2025-12-20T10:30:00Z"
    }
  ]
}`
        },
        {
          method: 'PUT',
          path: '/api/bookings/{id}/status',
          description: 'Update booking status',
          request: `{
  "status": "in_progress",
  "notes": "Started working on the affidavit"
}`,
          response: `{
  "message": "Booking status updated successfully"
}`
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      description: 'Payment processing and M-Pesa integration',
      endpoints: [
        {
          method: 'POST',
          path: '/api/payments/initiate',
          description: 'Initiate M-Pesa payment',
          request: `{
  "booking_id": 1,
  "phone_number": "+254712345678",
  "amount": 1500
}`,
          response: `{
  "checkout_request_id": "ws_CO_123456789",
  "response_code": "0",
  "payment_reference": "HK11234567890123",
  "customer_message": "Success. Request accepted for processing"
}`
        },
        {
          method: 'GET',
          path: '/api/payments/status/{checkout_request_id}',
          description: 'Check payment status',
          response: `{
  "result_code": "0",
  "result_desc": "The service request is processed successfully",
  "status": "success",
  "callback_metadata": {
    "amount": 1500,
    "mpesa_receipt_number": "QHR123456",
    "transaction_date": "20251220123000"
  }
}`
        }
      ]
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Document upload and management endpoints',
      endpoints: [
        {
          method: 'POST',
          path: '/api/documents/upload',
          description: 'Upload document for booking',
          request: `FormData: {
  file: (PDF/JPG/PNG file),
  booking_id: 1,
  document_type: "affidavit_draft"
}`,
          response: `{
  "document_id": 1,
  "filename": "affidavit_draft.pdf",
  "url": "https://cloudinary.com/...",
  "status": "uploaded"
}`
        },
        {
          method: 'GET',
          path: '/api/documents/booking/{booking_id}',
          description: 'Get documents for a booking',
          response: `{
  "documents": [
    {
      "id": 1,
      "filename": "affidavit_draft.pdf",
      "type": "application/pdf",
      "size": 245760,
      "uploaded_at": "2025-12-20T10:30:00Z",
      "status": "uploaded"
    }
  ]
}`
        }
      ]
    },
    {
      id: 'chat',
      title: 'Chat & Communication',
      description: 'Real-time messaging and notifications',
      endpoints: [
        {
          method: 'GET',
          path: '/api/chat/conversations',
          description: 'Get user conversations',
          response: `{
  "conversations": [
    {
      "id": 1,
      "participant": {
        "name": "Advocate James Sang",
        "role": "advocate"
      },
      "last_message": "Document ready for review",
      "unread_count": 2,
      "service_name": "Affidavit Commissioning"
    }
  ]
}`
        },
        {
          method: 'POST',
          path: '/api/chat/conversations/{id}/messages',
          description: 'Send message in conversation',
          request: `{
  "content": "Hello, I have a question about the affidavit"
}`,
          response: `{
  "message_id": 1,
  "content": "Hello, I have a question about the affidavit",
  "timestamp": "2025-12-21T10:30:00Z",
  "is_mine": true
}`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          </div>
          <p className="text-lg text-gray-600">
            Complete API reference for Haki Yetu Digital Platform
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Interactive API Explorer</p>
                <p className="mb-2">For a full interactive API experience with live testing, visit our Swagger documentation:</p>
                <a
                  href="/api/docs"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>Swagger UI Documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Base URL */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Base URL</h2>
          <code className="px-3 py-2 bg-gray-100 rounded text-sm font-mono">
            https://api.haki-yetu.co.ke
          </code>
          <p className="text-sm text-gray-600 mt-2">
            For development: <code className="px-2 py-1 bg-gray-100 rounded text-xs">http://localhost:5000</code>
          </p>
        </div>

        {/* Authentication */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              Include the JWT token in the Authorization header for authenticated requests:
            </p>
            <code className="block text-sm font-mono bg-white p-2 rounded border">
              Authorization: Bearer {'<your_jwt_token>'}
            </code>
          </div>
        </div>

        {/* API Sections */}
        <div className="space-y-6">
          {apiSections.map((section) => (
            <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections[section.id] && (
                <div className="border-t border-gray-200">
                  {section.endpoints.map((endpoint, index) => (
                    <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                      {/* Endpoint Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4">{endpoint.description}</p>

                      {/* Request/Response */}
                      <div className="space-y-4">
                        {endpoint.request && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Request Body</h5>
                            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <code>{endpoint.request}</code>
                            </pre>
                          </div>
                        )}

                        {endpoint.response && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Response</h5>
                            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <code>{endpoint.response}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>For technical support or API questions, contact our development team.</p>
          <p className="mt-2">
            <a href="mailto:api@haki-yetu.co.ke" className="text-primary hover:underline">
              api@haki-yetu.co.ke
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
