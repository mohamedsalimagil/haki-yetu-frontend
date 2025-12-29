import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// --- IMPORT REAL PAGES ---
import Home from './pages/Home'; // <--- Now using the Real Landing Page
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// --- DASHBOARDS ---
import ClientDashboard from './pages/client/ClientDashboard';
import ClientOnboarding from './pages/client/ClientOnboarding';
import LawyerProfile from './pages/client/LawyerProfile';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import LawyerOnboarding from './pages/lawyer/LawyerOnboarding';
import AvailabilitySettings from './pages/lawyer/AvailabilitySettings';
import ProfileSettings from './pages/user/ProfileSettings';

// --- SHARED FEATURES ---
import ChatPage from './pages/shared/ChatPage';
import Marketplace from './pages/shared/Marketplace';
import VerificationPending from './pages/shared/VerificationPending';

// --- BOOKING FLOW ---
// TODO: Create these components
// import PaymentPage from './pages/shared/PaymentPage';
// import ConsultationConfirmation from './pages/shared/ConsultationConfirmation';

// --- UTILS ---
import ProtectedRoute from './components/ProtectedRoute';
import socketService from './services/socket.service';

// Notification Handler Component
const NotificationHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    const handleNotification = (data) => {
      // Suppress if user is on the specific chat they are currently viewing
      if (location.pathname.startsWith('/chat')) {
        return;
      }

      // Show toast notification
      toast.success(`${data.from}: ${data.text}`, {
        duration: 4000,
        position: 'top-right',
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    };

    socket.on('new_notification', handleNotification);

    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/onboarding" element={<ClientOnboarding />} />
            <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
            <Route path="/lawyer/onboarding" element={<LawyerOnboarding />} />
            <Route path="/lawyer/availability" element={<AvailabilitySettings />} />

            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/lawyer/:id" element={<LawyerProfile />} /> {/* The Profile View */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:lawyerId" element={<ChatPage />} />

            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
