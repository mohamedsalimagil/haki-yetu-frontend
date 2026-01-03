# Authentication Hardening & Testing Guide
**Haki Yetu Frontend - React + Vite + Axios**

## 📋 SYSTEM ANALYSIS
- **Framework**: React 18.3.1 + Vite 5.4.21
- **HTTP Client**: Axios 1.13.2
- **Router**: React Router DOM 6.30.2
- **Auth Storage**: localStorage (key: "token")
- **API Base**: `http://127.0.0.1:5000/api`
- **Socket**: socket.io-client 4.8.3

---

## ✅ VERIFICATION CHECKLIST

### Authentication Flow
- [ ] Token stored in localStorage on login → PASS if `localStorage.getItem('token')` returns JWT
- [ ] Token attached to all API requests → PASS if Network tab shows `Authorization: Bearer <token>`
- [ ] Expired token triggers logout → PASS if 401 redirects to `/login`
- [ ] Refresh token flow attempts retry → PASS if failed request retries once after refresh
- [ ] Manual token deletion logs user out → PASS if removing token shows login screen

### Route Protection
- [ ] Protected routes require token → PASS if `/client/dashboard` redirects to `/login` without token
- [ ] Login redirects to dashboard → PASS if successful login navigates to `/client/dashboard`
- [ ] 401 from any endpoint triggers logout → PASS if expired token shows login
- [ ] Token persists across page refresh → PASS if F5 maintains authentication

### Chat Persistence
- [ ] Conversations restore on page refresh → PASS if chat history remains after F5
- [ ] Conversation scoped to case_id → PASS if switching cases shows correct messages
- [ ] Socket reconnects after network drop → PASS if offline→online restores chat
- [ ] Last message timestamp updates → PASS if `last_updated` field changes

### Error States
- [ ] Empty services list shows message → PASS if API returns [] displays "No services found"
- [ ] Network error shows retry → PASS if API fails shows "Network error. Retry?"
- [ ] Loading states during API calls → PASS if spinner shows before data loads
- [ ] No advocates available message → PASS if advocates list empty shows placeholder

---

## 🔐 ENHANCED API INTERCEPTOR

Replace `src/services/api.js` with this hardened version:

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000/api";
const TOKEN_KEY = "token";
const REFRESH_ENDPOINT = "/auth/refresh"; // Adjust if different

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// JWT exp check (no library needed)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // exp is in seconds
  } catch {
    return true;
  }
};

// Request interceptor with expiry check
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem(TOKEN_KEY);
    
    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      try {
        const { data } = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        token = data.access_token || data.token;
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 with retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip auto-logout for KYC endpoint
      if (originalRequest.url.includes('/client/kyc')) {
        return Promise.reject(error);
      }

      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const { data } = await axios.post(`${API_URL}${REFRESH_ENDPOINT}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newToken = data.access_token || data.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest); // Retry with new token
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Force logout on 401 after retry
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
```

**What Changed:**
1. JWT expiry detection before each request
2. Automatic refresh attempt if token expired
3. Retry original request once after refresh
4. Force logout if refresh fails
5. Environment variable for API base

---

## 🧪 CLI TESTING COMMANDS

### 1. Test Expired Token (curl)
```bash
# Generate expired JWT (use jwt.io or backend script)
EXPIRED_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.fake"

# Test API with expired token
curl -X GET http://127.0.0.1:5000/api/client/dashboard \
  -H "Authorization: Bearer $EXPIRED_TOKEN" \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized
```

### 2. Test Missing Token
```bash
curl -X GET http://127.0.0.1:5000/api/client/dashboard \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized or 403 Forbidden
```

### 3. Test Token Refresh
```bash
# Valid token
TOKEN=$(cat token.txt) # Store your valid token in token.txt

curl -X POST http://127.0.0.1:5000/api/auth/refresh \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Expected: { "access_token": "new_jwt_here" }
```

### 4. Simulate Network Failure
```bash
# Point to invalid host
curl -X GET http://999.999.999.999:5000/api/services \
  --max-time 5

# Expected: Connection timeout after 5s
```

### 5. Test Valid Request
```bash
TOKEN=$(cat token.txt)

curl -X GET http://127.0.0.1:5000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Expected: 200 OK with services array
```

---

## 🧪 AUTOMATED TEST EXAMPLES

### Setup (Add to package.json)
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Unit Test: Token Expiry Detection
**File:** `src/services/__tests__/auth.test.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('JWT Token Expiry', () => {
  const createToken = (expInSeconds) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp: expInSeconds }));
    return `${header}.${payload}.signature`;
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  it('should detect expired token', () => {
    const expiredToken = createToken(Math.floor(Date.now() / 1000) - 3600); // 1 hour ago
    expect(isTokenExpired(expiredToken)).toBe(true);
  });

  it('should accept valid token', () => {
    const validToken = createToken(Math.floor(Date.now() / 1000) + 3600); // 1 hour future
    expect(isTokenExpired(validToken)).toBe(false);
  });

  it('should reject malformed token', () => {
    expect(isTokenExpired('invalid.token')).toBe(true);
  });
});
```

**Run:** `npm test`

### Integration Test: 401 Redirect
**File:** `src/__tests__/auth-redirect.test.jsx`

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import api from '../services/api';

describe('401 Redirect Behavior', () => {
  it('should redirect to login on 401', async () => {
    const mockPush = vi.fn();
    delete window.location;
    window.location = { href: '' };

    // Mock API to return 401
    vi.spyOn(api, 'get').mockRejectedValue({
      response: { status: 401 }
    });

    await api.get('/client/dashboard').catch(() => {});

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });
  });
});
```

### E2E Test: Chat Restoration
**File:** `tests/e2e/chat-persistence.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('chat conversation persists after refresh', async ({ page }) => {
  // Login
  await page.goto('http://localhost:5174/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Navigate to chat
  await page.waitForURL('**/client/dashboard');
  await page.click('text=Chat');
  
  // Send message
  await page.fill('textarea[placeholder*="message"]', 'Test message');
  await page.click('button:has-text("Send")');
  
  // Verify message appears
  await expect(page.locator('text=Test message')).toBeVisible();
  
  // Refresh page
  await page.reload();
  
  // Verify message still visible
  await expect(page.locator('text=Test message')).toBeVisible();
});
```

**Run:** `npx playwright test`

---

## 💬 CHAT PERSISTENCE SPECIFICATION

### Required Metadata Keys
```javascript
{
  conversation_id: "uuid",           // Unique conversation identifier
  conversation_type: "user_case",    // Type: user_case | user_advocate | group
  related_case_id: "123",            // Case ID this conversation belongs to
  related_advocate_id: "456",        // Advocate ID (if applicable)
  user_id: "789",                    // Current user ID
  participants: ["user_id", "advocate_id"], // All conversation participants
  last_updated: "2026-03-01T14:30:00Z",    // ISO timestamp
  last_message: "Preview text...",   // Last message preview
  unread_count: 2,                   // Number of unread messages
  is_active: true                    // Whether conversation is active
}
```

### Restoration Algorithm (Pseudocode)

```javascript
// On page load or component mount
async function restoreConversation() {
  const caseId = getCurrentCaseIdFromURL(); // From query param or route
  
  // Step 1: Fetch conversation metadata
  const conversationData = await fetchFromLocalStorage(`conversation_${caseId}`) 
    || await api.get(`/chat/conversations/${caseId}`);
  
  // Step 2: Validate conversation belongs to current user
  if (conversationData.user_id !== currentUser.id) {
    throw new Error("Unauthorized access");
  }
  
  // Step 3: Load message history
  const messages = await api.get(`/chat/conversations/${conversationData.conversation_id}/messages`, {
    params: { since: conversationData.last_updated }
  });
  
  // Step 4: Reconnect socket with conversation context
  socket.emit('join_conversation', {
    conversation_id: conversationData.conversation_id,
    case_id: caseId,
    user_id: currentUser.id
  });
  
  // Step 5: Update UI with restored data
  setChatState({
    conversation: conversationData,
    messages: messages.data,
    isConnected: true
  });
  
  // Step 6: Mark messages as read
  await api.post(`/chat/conversations/${conversationData.conversation_id}/mark_read`);
  
  // Step 7: Cache conversation in localStorage for offline support
  localStorage.setItem(`conversation_${caseId}`, JSON.stringify(conversationData));
}
```

### Implementation in React

**File:** `src/hooks/useChatPersistence.js`

```javascript
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../services/socket.service';

export function useChatPersistence() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  
  const [chatState, setChatState] = useState({
    conversation: null,
    messages: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!caseId) return;

    const restoreChat = async () => {
      try {
        // Try localStorage first (offline support)
        const cached = localStorage.getItem(`conversation_${caseId}`);
        if (cached) {
          const conversation = JSON.parse(cached);
          setChatState(prev => ({ ...prev, conversation }));
        }

        // Fetch latest from API
        const { data: conversation } = await api.get(`/chat/conversations/case/${caseId}`);
        const { data: messages } = await api.get(`/chat/conversations/${conversation.id}/messages`);

        // Update state
        setChatState({
          conversation,
          messages,
          loading: false,
          error: null
        });

        // Cache for offline
        localStorage.setItem(`conversation_${caseId}`, JSON.stringify(conversation));

        // Join socket room
        socket.emit('join_conversation', {
          conversation_id: conversation.id,
          case_id: caseId
        });

      } catch (error) {
        setChatState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    restoreChat();

    // Cleanup
    return () => {
      socket.emit('leave_conversation', { case_id: caseId });
    };
  }, [caseId]);

  return chatState;
}
```

---

## 🚫 EMPTY & ERROR STATES

### Implementation Checklist

#### 1. No Services Found
**Location:** `src/pages/public/ServicesPage.jsx`, `src/pages/client/ServiceCatalog.jsx`

```jsx
{services.length === 0 && !loading && (
  <div className="text-center py-16">
    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Legal Services Available
    </h3>
    <p className="text-gray-600 mb-6">
      We're currently updating our service catalog. Please check back soon or contact support.
    </p>
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
      Contact Support
    </button>
  </div>
)}
```

#### 2. No Advocates Available
**Location:** `src/pages/public/AdvocateDirectory.jsx`

```jsx
{filteredAdvocates.length === 0 && (
  <div className="text-center py-16">
    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Advocates Match Your Criteria
    </h3>
    <p className="text-gray-600 mb-6">
      Try adjusting your filters or search terms. All our advocates are LSK-certified.
    </p>
    <button
      onClick={() => { setSearchTerm(''); setSelectedSpecialization('All'); }}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      Clear Filters
    </button>
  </div>
)}
```

#### 3. No Available Time Slots
**Location:** `src/pages/public/NotarizationFlow.jsx`

```jsx
{availableSlots.length === 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No Time Slots Available Today
    </h3>
    <p className="text-gray-700 mb-4">
      All advocates are currently booked. Try selecting a different date or request priority scheduling.
    </p>
    <div className="flex gap-3 justify-center">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        View Next Week
      </button>
      <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg">
        Request Priority
      </button>
    </div>
  </div>
)}
```

#### 4. Network Failure Fallback
**Location:** Global error handler in `src/services/api.js`

```javascript
// Add to response interceptor
if (!error.response) {
  // Network error (no response from server)
  toast.error(
    "Unable to connect to Haki Yetu servers. Please check your internet connection.",
    { 
      duration: 5000,
      icon: '🔌',
      action: {
        label: 'Retry',
        onClick: () => window.location.reload()
      }
    }
  );
}
```

**Component-level error UI:**

```jsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Connection Error
    </h3>
    <p className="text-gray-700 mb-4">
      {error.message || "Unable to load data. Please check your connection and try again."}
    </p>
    <button
      onClick={retryFunction}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
)}
```

---

## 🧪 MANUAL TEST PLAN

### Test Session Setup (5 min)
1. Open browser DevTools (F12) → Application tab
2. Clear localStorage: `localStorage.clear()`
3. Clear cookies and cache
4. Open Network tab to monitor requests
5. Start backend: `python app.py` (ensure running on port 5000)
6. Start frontend: `npm run dev` (note the port - likely 5174)

### Test Case 1: Expired Token Handling
**Steps:**
1. Login normally → observe token in localStorage
2. Copy token value
3. Go to [jwt.io](https://jwt.io) and decode it
4. Note the `exp` timestamp (e.g., 1709308800)
5. In DevTools Console, modify token:
   ```javascript
   // Get current token
   let token = localStorage.getItem('token');
   // Decode, modify exp, re-encode
   let [header, payload, signature] = token.split('.');
   let decoded = JSON.parse(atob(payload));
   decoded.exp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
   let newPayload = btoa(JSON.stringify(decoded));
   localStorage.setItem('token', `${header}.${newPayload}.${signature}`);
   ```
6. Refresh page or make API request
7. **Expected:** Redirect to `/login` within 2 seconds

**Pass Criteria:** User sees login page, token removed from localStorage

### Test Case 2: 401 Auto-Logout
**Steps:**
1. Login successfully
2. In Network tab, find any API request (e.g., `/api/client/dashboard`)
3. Right-click → Copy as cURL
4. In terminal, modify token to invalid:
   ```bash
   curl 'http://127.0.0.1:5000/api/client/dashboard' \
     -H 'Authorization: Bearer INVALID_TOKEN'
   ```
5. Observe 401 response
6. In browser, trigger same request (refresh dashboard)
7. **Expected:** Redirect to login

**Pass Criteria:** 401 triggers logout, user cannot access protected content

### Test Case 3: Chat Persistence Across Refresh
**Steps:**
1. Login and navigate to `/chat?caseId=123`
2. Type and send 3 test messages
3. Observe messages in UI
4. Press F5 (hard refresh)
5. Wait for page reload
6. **Expected:** All 3 messages still visible, conversation restored

**Pass Criteria:** Chat history intact, no data loss, conversation context maintained

### Test Case 4: Network Failure Handling
**Steps:**
1. Open DevTools → Network tab → Set throttling to "Offline"
2. Try to load services page
3. Observe error message
4. **Expected:** Friendly error with "Retry" button
5. Set throttling back to "Online"
6. Click "Retry"
7. **Expected:** Data loads successfully

**Pass Criteria:** Error message user-friendly, retry mechanism works

### Test Case 5: Empty State Validation
**Steps:**
1. Modify API response to return empty arrays:
   ```javascript
   // In DevTools Console (temporarily mock)
   api.get = async () => ({ data: { services: [] } });
   ```
2. Navigate to Services page
3. **Expected:** "No services available" message with CTA
4. Navigate to Advocates page
5. Apply filter that matches no advocates
6. **Expected:** "No advocates match" with "Clear Filters" button

**Pass Criteria:** Every empty list shows informative placeholder, not blank white space

### Test Case 6: Token Refresh Flow
**Steps:**
1. Login successfully
2. Wait until token is 1 minute from expiry (or manually set exp)
3. Make API request (e.g., load dashboard)
4. In Network tab, observe:
   - Original request with old token
   - Call to `/auth/refresh` endpoint
   - Retry of original request with new token
5. **Expected:** Seamless refresh, no user interruption

**Pass Criteria:** Token refreshes automatically, user stays logged in

---

## 🔧 ENVIRONMENT SETUP

### Create `.env` file in project root:

```bash
# API Configuration
VITE_API_BASE=http://127.0.0.1:5000/api
VITE_SOCKET_URL=http://127.0.0.1:5000

# Auth Configuration
VITE_TOKEN_KEY=token
VITE_REFRESH_ENDPOINT=/auth/refresh

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_CHAT_PERSISTENCE=true
```

### Update `vite.config.js`:

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE || 'http://127.0.0.1:5000',
          changeOrigin: true
        }
      }
    }
  };
});
```

---

## 📦 QUICK START COMMANDS

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run E2E tests
npx playwright test

# Simulate expired token test
node scripts/test-expired-token.js

# Check for security vulnerabilities
npm audit

# Lint code
npm run lint
```

---

## 🐛 DEBUGGING TIPS

### Check Token in Console:
```javascript
// View current token
console.log(localStorage.getItem('token'));

// Decode token payload
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
console.log('User ID:', payload.sub || payload.user_id);
```

### Monitor API Calls:
```javascript
// Log all axios requests
import api from './services/api';
api.interceptors.request.use(req => {
  console.log('→', req.method.toUpperCase(), req.url);
  return req;
});
api.interceptors.response.use(res => {
  console.log('←', res.status, res.config.url);
  return res;
});
```

### Socket Connection Status:
```javascript
import { socket } from './services/socket.service';
console.log('Socket connected:', socket.connected);
socket.on('connect', () => console.log('✓ Socket connected'));
socket.on('disconnect', () => console.log('✗ Socket disconnected'));
```

---

## 📚 ADDITIONAL RESOURCES

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Axios Interceptors Docs](https://axios-http.com/docs/interceptors)
- [React Router Auth Guide](https://reactrouter.com/en/main/start/tutorial#adding-authentication)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-01  
**Maintainer:** Haki Yetu DevOps Team
