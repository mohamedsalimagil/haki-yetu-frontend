import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import Navbar from './components/layout/Navbar';

// Guards
import VerificationGuard from './components/auth/VerificationGuard';

// Auth & Public Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserProfileSettings from './pages/auth/UserProfileSettings';
import PendingVerification from './pages/auth/PendingVerification';

// Lawyer Module (Person A)
import LawyerRegistration from './pages/auth/LawyerRegistration';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';

// Client/Marketplace Module (Person B)
import Dashboard from './pages/client/Dashboard';
import ServiceCatalog from './pages/client/ServiceCatalog';
import ServiceDetails from './pages/client/ServiceDetails';
import Checkout from './pages/client/Checkout';
import OrderHistory from './pages/client/OrderHistory';
import MyDocuments from './pages/client/MyDocuments';
import ClientOnboarding from './pages/client/ClientOnboarding';
import ClientVerificationPending from './pages/client/ClientVerificationPending';

// Admin Module (Person C)
import AdminRoutes from './pages/admin/AdminRoutes';

// Shared
import Chat from './pages/Chat';

function App() {
  return (
    <>
      {/* Navbar appears on all pages (Note: You might want to hide this for /admin routes later) */}
      <Navbar />
      
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-pending" element={<PendingVerification />} />

        {/* --- Lawyer Routes (Person A) --- */}
        <Route path="/lawyer/onboarding" element={<LawyerRegistration />} />

        {/* --- Client Onboarding Routes (Person B) --- */}
        <Route path="/client/onboarding" element={<ClientOnboarding />} />
        <Route path="/client/verification-pending" element={<ClientVerificationPending />} />

        {/* --- Client Marketplace Routes (Person B) --- */}
        <Route path="/services" element={<ServiceCatalog />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />

        {/* --- Verification Protected Routes --- */}
        <Route path="/" element={<VerificationGuard />}>
          <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/client" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route path="/history" element={<OrderHistory />} />
        <Route path="/documents" element={<MyDocuments />} />
        <Route path="/profile" element={<UserProfileSettings />} />

        {/* --- Admin Routes (Person C) --- */}
        {/* This wildcard matches anything starting with /admin and delegates it to AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default App;
