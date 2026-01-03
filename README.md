# Haki Yetu Digital Platform (Client Application)

Bridging the gap between citizens and legal justice in Kenya through technology.

## Overview

Haki Yetu is a comprehensive 3-sided marketplace platform that connects Kenyan citizens with verified legal professionals. This repository contains the React User Interface for Clients, Lawyers, and Administrators, providing intuitive portals for legal service discovery, case management, and system administration.

## Key Features (Frontend Focused)

### User Journeys
- **Client Portal**: Service discovery, booking, and payment processing
- **Lawyer Portal**: Task queue management, client consultations, and availability settings
- **Admin Portal**: System analytics, user management, and approval workflows

### Security
- `VerificationGuard` component protecting sensitive routes
- JWT token-based authentication with automatic header injection
- Role-based access control for different user types

### User Experience
- Real-time Toast notifications for user feedback
- Responsive Tailwind CSS design optimized for mobile and desktop
- M-Pesa Checkout UI with secure payment flow
- Loading states and error handling throughout the application

## Tech Stack

- React 18 with Vite build system
- Tailwind CSS for responsive styling
- Axios for API communication
- React Router for navigation
- React Hot Toast for notifications
- React Context API for state management

## Setup Instructions

### Prerequisites
- Node.js 16 or higher
- Backend API server running on `http://localhost:5000`

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd haki-yetu-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Test Credentials
Use these seed accounts for testing the application:

- **Client**: `client@haki.com` / `password123`
- **Lawyer**: `lawyer@haki.com` / `password123`
- **Admin**: `admin@haki.com` / `password123`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication guards
│   ├── layout/         # Layout components (Navbar, etc.)
│   └── domain/         # Feature-specific components
├── pages/              # Page components organized by user type
│   ├── auth/           # Authentication pages
│   ├── client/         # Client portal pages
│   ├── lawyer/         # Lawyer portal pages
│   └── admin/          # Admin portal pages
├── services/           # API service functions
├── context/            # React context providers
└── assets/             # Static assets and styles
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Team

- **Beatrice Wambui**: Authentication and User Verification
- **Mohamed Agil**: Marketplace and Business Logic
- **Michael Ndirangu**: Admin Analytics and System Management

## License

This project is part of the Capstone Project for the software development program.
