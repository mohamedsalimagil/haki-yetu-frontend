import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import DisputeResolution from './DisputeResolution';
import PendingApprovals from './PendingApprovals';
import SystemLogs from './SystemLogs';
import NotificationCenter from '../../components/layout/NotificationCenter';
import ClientVerification from './ClientVerification';
import TemplateManagement from './TemplateManagement';

export default function AdminRoutes() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/disputes" element={<DisputeResolution />} />
          <Route path="/lawyer-verification" element={<PendingApprovals />} />
          <Route path="/client-verification" element={<ClientVerification />} />
          <Route path="/templates" element={<TemplateManagement />} />
          <Route path="/logs" element={<SystemLogs />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}
