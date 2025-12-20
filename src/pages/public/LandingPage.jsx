import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, UserCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Legal Services, Simplified.</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Connect with verified lawyers and notarize documents from the comfort of your home.
        </p>
        <div className="space-x-4">
          <Link to="/services" className="bg-secondary px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
            Explore Services
          </Link>
          <Link to="/register" className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition">
            Join as Lawyer
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<FileText className="h-12 w-12 text-primary" />} 
          title="Instant Notarization" 
          desc="Upload your documents and get them stamped within minutes." 
        />
        <FeatureCard 
          icon={<UserCheck className="h-12 w-12 text-primary" />} 
          title="Verified Lawyers" 
          desc="All professionals are vetted against the LSK database." 
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-12 w-12 text-primary" />} 
          title="Secure Payments" 
          desc="Powered by M-Pesa. Your money is held in escrow until the job is done." 
        />
      </div>
    </div>
  );
};

// Simple internal component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default LandingPage;