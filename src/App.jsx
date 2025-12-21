import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserProfileSettings from './pages/auth/UserProfileSettings';
import LawyerRegistration from './pages/auth/LawyerRegistration';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/lawyer" element={<LawyerRegistration />} />
      <Route path="/profile" element={<UserProfileSettings />} />
      <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
      <Route path="/dashboard/client" element={<ClientDashboard />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
