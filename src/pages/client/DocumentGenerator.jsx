import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, FileText, Briefcase, Home, Users, Scale, HelpCircle } from 'lucide-react';

const DocumentGenerator = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const popularDocuments = [
    {
      id: 1,
      title: 'Tenancy Agreement',
      description: 'Standard residential lease agreement for landlords and...',
      icon: Home,
      verified: true,
      category: 'Real Estate'
    },
    {
      id: 2,
      title: 'Employment Contract',
      description: 'Comprehensive contract for permanent or fixed-term...',
      icon: Briefcase,
      verified: true,
      category: 'HR'
    },
    {
      id: 3,
      title: 'General Affidavit',
      description: 'Sworn statement of fact for use in various legal proceedings or...',
      icon: FileText,
      verified: true,
      category: 'Legal'
    }
  ];

  const businessTemplates = [
    {
      id: 4,
      title: 'Non-Disclosure Agreement (NDA)',
      description: 'Protect your trade secrets and confidential information when...',
      icon: Briefcase,
      verified: true
    },
    {
      id: 5,
      title: 'Partnership Deed',
      description: 'Outline rights, responsibilities, and profit-sharing between business...',
      icon: Users,
      verified: true
    },
    {
      id: 6,
      title: 'Sale of Goods Agreement',
      description: 'Contract for the sale and purchase of goods between a...',
      icon: FileText,
      verified: true
    },
    {
      id: 7,
      title: 'Loan Agreement',
      description: 'Formalizes lending terms including interest, repayment schedule, an...',
      icon: Briefcase,
      verified: true
    },
    {
      id: 8,
      title: 'Consultancy Agreement',
      description: 'Define terms of engagement for independent contractors and...',
      icon: Briefcase,
      verified: true
    },
    {
      id: 9,
      title: 'IP Assignment',
      description: 'Transfer ownership of intellectual property rights from one party to...',
      icon: Scale,
      verified: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'business', label: 'Business & Startups', icon: Briefcase },
    { id: 'realestate', label: 'Real Estate', icon: Home },
    { id: 'hr', label: 'HR & Employment', icon: Users },
    { id: 'family', label: 'Family & Personal', icon: Users },
    { id: 'litigation', label: 'Litigation', icon: Scale }
  ];

  const handleCreateDraft = (doc) => {
    // Navigate to document creation flow
    navigate('/client/documents/create', { state: { documentType: doc.title } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/services" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="/client/documents" className="text-blue-600 font-medium">My Documents</a>
              <a href="/consultations" className="text-gray-600 hover:text-gray-900">Consultations</a>
              <a href="/help" className="text-gray-600 hover:text-gray-900">Help</a>
              <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-gray-900">Sign In</button>
              <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0A1E41] to-[#1e3a5f] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Instant Document Generator
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Draft legally-binding contracts compliant with Kenyan law in minutes. Verified by LSK Advocates.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="pl-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for leases, affidavits, contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-600 rounded-lg p-6 mt-6 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 rounded-full p-3">
                  <HelpCircle className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-center mb-2">Not sure which document to pick?</h4>
              <p className="text-sm text-blue-100 text-center mb-4">
                Talk to a verified advocate for guidance.
              </p>
              <button 
                onClick={() => navigate('/consultations')}
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Ask an Advocate
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Most Popular Documents */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Most Popular Documents</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View all</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularDocuments.map(doc => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        {doc.verified && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                      
                      <button
                        onClick={() => handleCreateDraft(doc)}
                        className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
                      >
                        Create Draft
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Business Templates */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Business Templates</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View all</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {businessTemplates.map(doc => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        {doc.verified && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                      
                      <button
                        onClick={() => handleCreateDraft(doc)}
                        className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
                      >
                        Create Draft
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2023 Haki Yetu. All rights reserved. Legal services provided by verified Advocates.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DocumentGenerator;
