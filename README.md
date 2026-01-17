# Haki Yetu Digital Platform — Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-green?style=for-the-badge)

**Bridging the gap between citizens and legal justice in Kenya through technology.**

[Features](#features) | [Quick Start](#quick-start) | [Project Structure](#project-structure) | [Team](#team)

</div>

---

## Overview

**Haki Yetu** (Swahili for "Our Rights") is a modern, responsive web application that connects Kenyan citizens with verified legal professionals. This repository contains the **React frontend** that provides intuitive portals for clients seeking legal services, lawyers managing their practice, and administrators overseeing the platform.

### User Portals
- **Client Portal** — Discover services, book consultations, manage appointments, and process payments
- **Lawyer Portal** — Manage client cases, set availability, handle consultations, and track earnings
- **Admin Portal** — Verify users, monitor platform metrics, and manage system settings

---

## Features

### Authentication & Security
- JWT token-based authentication with automatic refresh
- Protected routes with `VerificationGuard` component
- Role-based access control (Client, Lawyer, Admin)
- Secure session management

### Service Marketplace
- Browse legal services by category
- Detailed service pages with lawyer profiles
- Real-time availability checking
- M-Pesa payment integration with checkout UI

### Appointment Management
- Interactive calendar with FullCalendar integration
- Appointment booking and rescheduling
- Real-time availability slots
- Automated reminders and notifications

### Real-time Communication
- In-app messaging with Socket.IO
- Order-based chat rooms
- File sharing and document exchange
- Message notifications and read receipts

### Document Management
- Drag-and-drop document upload
- AI-powered document summarization
- Legal document templates
- Secure document download and sharing

### Analytics Dashboards
- Client: Appointment history, spending overview, case status
- Lawyer: Earnings, client metrics, consultation stats
- Admin: Platform analytics, user verification stats, revenue tracking

### User Experience
- Fully responsive design (mobile-first)
- Dark/light mode support
- Smooth animations with CSS transitions
- Toast notifications for real-time feedback
- Loading states and error handling

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3 with Hooks |
| **Build Tool** | Vite 5.4 |
| **Styling** | Tailwind CSS 3.4 |
| **Routing** | React Router 6.30 |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Real-time** | Socket.IO Client |
| **Forms** | Formik + Yup validation |
| **Calendar** | FullCalendar |
| **Charts** | Recharts |
| **Icons** | Lucide React, React Icons |
| **Notifications** | React Hot Toast |
| **Date Handling** | Day.js |

---

## Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Backend API running at `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:mohamedsalimagil/haki-yetu-frontend.git
   cd haki-yetu-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── assets/                  # Static assets
│   ├── images/             # Images and icons
│   └── styles/             # Global CSS files
├── components/              # Reusable components
│   ├── auth/               # Auth guards and wrappers
│   │   ├── ProtectedRoute.jsx
│   │   └── VerificationGuard.jsx
│   ├── layout/             # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── common/             # Shared UI components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── LoadingSpinner.jsx
│   └── domain/             # Feature-specific components
│       ├── ServiceCard.jsx
│       ├── AppointmentCard.jsx
│       └── ChatMessage.jsx
├── pages/                   # Page components
│   ├── auth/               # Authentication pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── client/             # Client portal pages
│   │   ├── Dashboard.jsx
│   │   ├── Services.jsx
│   │   ├── Appointments.jsx
│   │   └── Messages.jsx
│   ├── lawyer/             # Lawyer portal pages
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   ├── Schedule.jsx
│   │   └── Earnings.jsx
│   ├── admin/              # Admin portal pages
│   │   ├── Dashboard.jsx
│   │   ├── UserVerification.jsx
│   │   └── Analytics.jsx
│   └── public/             # Public pages
│       ├── Landing.jsx
│       └── About.jsx
├── services/                # API service functions
│   ├── api.js              # Axios instance configuration
│   ├── authService.js      # Auth API calls
│   ├── serviceService.js   # Marketplace API calls
│   └── chatService.js      # Chat API calls
├── context/                 # React contexts
│   ├── AuthContext.jsx     # Authentication state
│   └── NotificationContext.jsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.js
│   └── useSocket.js
├── utils/                   # Utility functions
│   ├── apiUtils.js         # API helpers
│   ├── formatters.js       # Data formatting
│   └── validators.js       # Input validation
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## Test Accounts

Use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| **Client** | `client@haki.com` | `password123` |
| **Lawyer** | `lawyer@haki.com` | `password123` |
| **Admin** | `admin@haki.com` | `password123` |

---

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. The `vercel.json` file handles SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Environment Variables for Production

Configure these in your deployment platform:
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## Design System

### Color Palette

| Color | Usage |
|-------|-------|
| **Primary** | `#2563EB` (Blue 600) — Primary actions, links |
| **Secondary** | `#059669` (Emerald 600) — Success states |
| **Accent** | `#7C3AED` (Violet 600) — Highlights |
| **Neutral** | Slate scale — Text, backgrounds |
| **Error** | `#DC2626` (Red 600) — Error states |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, slightly condensed tracking
- **Body**: Regular weight, comfortable line height

---

## Team

| Team Member | Responsibility |
|-------------|----------------|
| **Beatrice Wambui** | Authentication & User Verification UI |
| **Mohamed Agil** | Marketplace & Payment Integration |
| **Michael Ndirangu** | Admin Analytics & Dashboard |

---

## License

This project is developed as part of the **Software Engineering Capstone Project**. It is intended for educational purposes only.

---

<div align="center">

**Made in Kenya**

*Empowering citizens with accessible legal services*

</div>
