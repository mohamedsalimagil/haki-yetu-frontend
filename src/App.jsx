import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';

// Guards
import VerificationGuard from './components/auth/VerificationGuard';

// Auth & Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import AdvocateDirectory from './pages/public/AdvocateDirectory';
import PricingPage from './pages/public/PricingPage';
import NotarizationFlow from './pages/public/NotarizationFlow';
import ServicesDocuments from './pages/public/ServicesDocuments';
import ServicesProperty from './pages/public/ServicesProperty';
import DocumentGenerator from './pages/public/DocumentGenerator';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserProfileSettings from './pages/auth/UserProfileSettings';
import PendingVerification from './pages/auth/PendingVerification';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import CookiePolicy from './pages/public/CookiePolicy';

// Lawyer Module
import LawyerRegistration from './pages/auth/LawyerRegistration';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import NotarizationQueue from './pages/lawyer/NotarizationQueue';
import LawyerEarnings from './pages/lawyer/LawyerEarnings';
import InAppChat from './pages/lawyer/InAppChat';
import AvailabilitySettings from './pages/lawyer/AvailabilitySettings';

// Client Module
import Dashboard from './pages/client/Dashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import ServiceCatalog from './pages/client/ServiceCatalog';
import ServiceDetails from './pages/client/ServiceDetails';
import Checkout from './pages/client/Checkout';
import OrderHistory from './pages/client/OrderHistory';
import ClientOnboarding from './pages/client/ClientOnboarding';
import ClientVerificationPending from './pages/client/ClientVerificationPending';
import LawyerProfileView from './pages/client/LawyerProfileView';
import ReferralDashboard from './pages/client/ReferralDashboard';
import AISummarizer from './pages/client/AISummarizer';
import ClientProfileSettings from './pages/client/ClientProfileSettings';
import FeedbackForm from './pages/client/FeedbackForm';
import DocumentPartyDetails from './pages/client/DocumentPartyDetails';
import ClientDocumentGenerator from './pages/client/DocumentGenerator';
import ConsultationSuccess from './pages/client/ConsultationSuccess';
import BookingPage from './pages/client/BookingPage';
import Consultations from './pages/client/Consultations';
import TemplateMarketplace from './pages/client/TemplateMarketplace';

// Dispute Module
import InitiateDispute from './pages/client/disputes/InitiateDispute';
import DisputeForm from './pages/client/disputes/DisputeForm';
import DisputeSuccess from './pages/client/disputes/DisputeSuccess';
import DisputeList from './pages/client/disputes/DisputeList';
import ReopenDispute from './pages/client/disputes/ReopenDispute';
import ReopenSuccess from './pages/client/disputes/ReopenSuccess';

// Support Module
import SupportLanding from './pages/client/support/SupportLanding';
import SupportInitiateDispute from './pages/client/support/InitiateDispute';
import DisputeDetails from './pages/client/support/DisputeDetails';
import DisputeConfirmation from './pages/client/support/DisputeConfirmation';
import FAQsPage from './pages/client/support/FAQsPage';
import AIChatPage from './pages/client/support/AIChatPage';

// Admin Module
import AdminRoutes from './pages/admin/AdminRoutes';

// Shared
import Chat from './pages/Chat';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = [
    '/lawyer/dashboard',
    '/lawyer/earnings',
    '/client/dashboard',
    '/dashboard'
  ];

  // Check if current path matches admin or hidden routes
  const shouldHideNavbar =
    location.pathname.startsWith('/admin') ||
    hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {/* ✅ FIXED: Only show Navbar if not on a hidden route */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Redirect /services to /marketplace to avoid confusion */}
        <Route path="/services" element={<Navigate to="/marketplace" replace />} />
        
        <Route path="/services/drafting" element={<DocumentGenerator />} />
        <Route path="/advocates" element={<AdvocateDirectory />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/services/notarization" element={<NotarizationFlow />} />
        <Route path="/services/documents" element={<ServicesDocuments />} />
        <Route path="/services/property" element={<ServicesProperty />} />
        <Route path="/disputes" element={<DisputeList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-pending" element={<PendingVerification />} />

        {/* --- Legal Routes --- */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* --- Lawyer Routes --- */}
        <Route path="/lawyer/onboarding" element={<LawyerRegistration />} />
        <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
        <Route path="/lawyer/queue" element={<NotarizationQueue />} />
        <Route path="/lawyer/queue/review/:id" element={<div className="p-8 text-center">Review Page - Coming Soon</div>} />
        <Route path="/lawyer/earnings" element={<LawyerEarnings />} />
        <Route path="/lawyer/messages" element={<InAppChat />} />
        <Route path="/lawyer/availability" element={<AvailabilitySettings />} />
        <Route path="/lawyer/:id" element={<LawyerProfileView />} />

        {/* --- Client Onboarding Routes --- */}
        <Route path="/client/onboarding" element={<ClientOnboarding />} />
        <Route path="/client/verification-pending" element={<ClientVerificationPending />} />
        <Route path="/client/dashboard" element={
          user && user.verification_status === 'verified' ? <ClientDashboard /> : user ? <Navigate to="/verification-pending" replace /> : <Navigate to="/" replace />
        } />

        {/* --- Client Marketplace Routes --- */}
        {/* ⚠️ NOTE: This confirms your Service Cards must link to /marketplace/:id */}
        <Route path="/marketplace" element={<ServiceCatalog />} />
        <Route path="/marketplace/:id" element={<ServiceDetails />} />
        
        <Route path="/client/templates" element={<TemplateMarketplace />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />

        {/* --- Client Advanced Features --- */}
        <Route path="/client/lawyer-profile/:id" element={<LawyerProfileView />} />
        <Route path="/client/referral" element={<ReferralDashboard />} />
        <Route path="/client/ai-summarizer" element={<AISummarizer />} />
        <Route path="/client/settings" element={<ClientProfileSettings />} />
        <Route path="/client/feedback" element={<FeedbackForm />} />
        <Route path="/client/document/party-details" element={<DocumentPartyDetails />} />
        <Route path="/client/book/:id" element={<BookingPage />} />
        <Route path="/client/messages" element={<InAppChat />} />
        <Route path="/client/messages/new" element={<InAppChat />} />
        <Route path="/client/consultation/confirmation" element={<ConsultationSuccess />} />
        <Route path="/client/documents" element={<ClientDocumentGenerator />} />
        <Route path="/client/documents/create" element={<DocumentPartyDetails />} />
        <Route path="/client/consultations" element={<Consultations />} />
        <Route path="/bookings/manage" element={<div className="p-8 text-center">Manage Bookings - Coming Soon</div>} />

        {/* --- Client Support Routes --- */}
        <Route path="/client/support" element={<SupportLanding />} />
        <Route path="/client/support/initiate" element={<SupportInitiateDispute />} />
        <Route path="/client/support/details" element={<DisputeDetails />} />
        <Route path="/client/support/details/:orderId" element={<DisputeDetails />} />
        <Route path="/client/support/confirmation" element={<DisputeConfirmation />} />
        <Route path="/client/support/faqs" element={<FAQsPage />} />
        <Route path="/client/support/chat" element={<AIChatPage />} />

        {/* --- Consultation Booking Routes --- */}
        <Route path="/consultation/book/:id" element={<BookingPage />} />
        <Route path="/consultation/checkout" element={<div>Checkout Page Coming Soon</div>} />
        <Route path="/consultation/confirmation" element={<div>Confirmation Page Coming Soon</div>} />

        {/* --- Client Dispute Routes --- */}
        <Route path="/client/disputes/initiate" element={<InitiateDispute />} />
        <Route path="/client/disputes/new" element={<InitiateDispute />} />
        <Route path="/client/disputes/form" element={<DisputeForm />} />
        <Route path="/client/disputes/success" element={<DisputeSuccess />} />
        <Route path="/client/disputes/list" element={<DisputeList />} />
        <Route path="/client/disputes/history" element={<DisputeList />} />
        <Route path="/client/disputes/:id" element={<div className="p-8 text-center">Dispute Details - Coming Soon</div>} />
        <Route path="/client/disputes/reopen" element={<ReopenDispute />} />
        <Route path="/client/disputes/reopen/:id" element={<ReopenDispute />} />
        <Route path="/client/disputes/reopen-success" element={<ReopenSuccess />} />

        {/* --- Admin Routes --- */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* --- Verification Protected Routes --- */}
        <Route element={<VerificationGuard />}>
          <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/profile" element={<UserProfileSettings />} />
          <Route path="/settings" element={<ClientProfileSettings />} />
          <Route path="/history" element={<OrderHistory />} />
        </Route>

        {/* --- Catch-all for undefined routes --- */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1><p className="text-gray-600">Page not found</p><a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go Home</a></div></div>} />
      </Routes>
    </>
  );
}

export default App;