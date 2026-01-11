import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/client/Dashboard';
import OrderHistory from '../../pages/client/OrderHistory';
import MyDocuments from '../../pages/client/MyDocuments';
import UserProfileSettings from '../../pages/auth/UserProfileSettings';

export default function ClientRoutes() {
  return (
    <Routes>
      {/* Default route (renders at /dashboard) */}
      <Route index element={<Dashboard />} /> 
      
      {/* Sub-routes */}
      <Route path="history" element={<OrderHistory />} />
      <Route path="documents" element={<MyDocuments />} />
      <Route path="profile" element={<UserProfileSettings />} />
    </Routes>
  );
}