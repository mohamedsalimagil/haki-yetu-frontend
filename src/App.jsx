import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-primary mb-4">Haki Yetu Digital</h1>
            <p className="text-gray-600">Welcome to the platform</p>
            <div className="mt-6 space-x-4">
              <Link to="/login" className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 transition">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
