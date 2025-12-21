import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/public/LandingPage';
import ServiceCatalog from './pages/client/ServiceCatalog';

function App() {
  return (
    <div className="font-sans antialiased text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServiceCatalog />} />
        {/* We will add more routes later */}
      </Routes>
    </div>
  );
}

export default App;





