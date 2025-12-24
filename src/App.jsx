import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserProfileSettings from './pages/auth/UserProfileSettings';
import LawyerRegistration from './pages/auth/LawyerRegistration';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import Home from './pages/Home';
import APIDocumentation from './pages/APIDocumentation';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/common/ToastContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/lawyer" element={<LawyerRegistration />} />
          <Route path="/profile" element={<UserProfileSettings />} />
          <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/api/docs" element={<APIDocumentation />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
