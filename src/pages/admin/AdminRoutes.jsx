import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import DisputeResolution from './DisputeResolution';
import PendingApprovals from './PendingApprovals';
import SystemLogs from './SystemLogs';

export default function AdminRoutes() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/disputes" element={<DisputeResolution />} />
          <Route path="/approvals" element={<PendingApprovals />} />
          <Route path="/logs" element={<SystemLogs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}