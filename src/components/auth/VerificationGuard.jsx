import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerificationGuard = () => {
  const { user } = useAuth();

  // If user is not loaded yet, show loading or redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check verification status
  const verificationStatus = user.verification_status;

  // If status is pending or unverified, redirect to appropriate pending page
  if (verificationStatus === 'pending' || verificationStatus === 'unverified') {
    if (user.role === 'client') {
      return <Navigate to="/client/verification-pending" replace />;
    } else if (user.role === 'lawyer') {
      return <Navigate to="/verification-pending" replace />;
    }
  }

  // If status is verified, allow access to the protected routes
  if (verificationStatus === 'verified') {
    return <Outlet />;
  }

  // Default fallback - redirect to login if status is unknown
  return <Navigate to="/login" replace />;
};

export default VerificationGuard;
