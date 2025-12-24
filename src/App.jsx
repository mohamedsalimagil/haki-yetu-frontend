import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the provider
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// --- Placeholder Components for Day 1 (So the app doesn't crash) ---
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Welcome to Haki Yetu</h1>
    <p>Day 1: Auth System Ready</p>
    <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a>
  </div>
);

const Dashboard = () => <h2>Dashboard (Coming Day 2)</h2>;
// ------------------------------------------------------------------

function App() {
  return (
    // 1. Wrap everything in AuthProvider so Login/Register can access context
    <AuthProvider>
      {/* 2. Wrap routes in Router for navigation */}
      <Router>
        <Routes>
          {/* Day 1 Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Placeholders */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;