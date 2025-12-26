import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LawyerOnboarding from './pages/lawyer/LawyerOnboarding';
import ProfileSettings from './pages/user/ProfileSettings';
import ClientDashboard from './pages/client/ClientDashboard';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import ChatPage from './pages/shared/ChatPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import socketService from './services/socket.service';

// Notification Handler Component
const NotificationHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    const handleNotification = (data) => {
      // Suppress if user is on chat page
      if (location.pathname === '/chat') {
        return;
      }

      // Show toast notification
      toast.success(`${data.from}: ${data.text}`, {
        duration: 4000,
        position: 'top-right',
      });
    };

    socket.on('new_notification', handleNotification);

    return () => {
      socket.off('new_notification', handleNotification);
    };
  }, [location.pathname]);

  return null;
};

// --- Placeholder Components ---
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Welcome to Haki Yetu</h1>
    <p>Empowering Legal Access in Kenya</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/login" style={{ marginRight: '10px' }}>Login</a> | 
      <a href="/register" style={{ marginLeft: '10px' }}>Register</a>
    </div>
  </div>
);

const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h2>User Dashboard</h2>
    <p>Welcome back! You can now access legal services.</p>
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Are you a Lawyer?</h3>
      <p>Complete your professional profile to start helping clients.</p>
      <a href="/lawyer/onboarding" style={{ 
        display: 'inline-block', 
        backgroundColor: '#007bff', 
        color: 'white', 
        padding: '10px 15px', 
        borderRadius: '5px', 
        textDecoration: 'none' 
      }}>
        Complete Lawyer Profile
      </a>
    </div>
  </div>
);

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
            <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:lawyerId" element={<ChatPage />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/lawyer/onboarding" element={<LawyerOnboarding />} />
          </Route>

          {/* Other Routes */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
