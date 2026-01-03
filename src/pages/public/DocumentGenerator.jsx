import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, CheckCircle, AlertCircle, Zap, Users, Clock, Shield } from 'lucide-react';

const DocumentGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedDocument, setGeneratedDocument] = useState(null);

  const templates = [
    {
      id: 'contract',
      name: 'Service Contract',
      description: 'Professional service agreement between parties',
      icon: <FileText className="h-6 w-6" />,
      price: 'KES 2,500',
      fields: ['clientName', 'serviceProvider', 'serviceDescription', 'paymentTerms', 'duration']
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Confidentiality agreement for business relationships',
      icon: <Shield className="h-6 w-6" />,
      price: 'KES 1,500',
      fields: ['partyA', 'partyB', 'confidentialInfo', 'duration', 'jurisdiction']
    },
    {
      id: 'will',
      name: 'Last Will & Testament',
      description: 'Legal will document with executor appointments',
      icon: <Users className="h-6 w-6" />,
      price: 'KES 3,000',
      fields: ['testatorName', 'executor', 'beneficiaries', 'assets', 'witnesses']
    },
    {
      id: 'power-of-attorney',
      name: 'Power of Attorney',
      description: 'Authorization document for legal representation',
      icon: <CheckCircle className="h-6 w-6" />,
      price: 'KES 2,000',
      fields: ['principal', 'attorney', 'powers', 'duration', 'limitations']
    }
  ];

  const features = [
    { icon: <Zap className="h-6 w-6 text-blue-500" />, text: "AI-Powered Generation" },
    { icon: <Shield className="h-6 w-6 text-green-500" />, text: "Legally Compliant" },
    { icon: <Clock className="h-6 w-6 text-purple-500" />, text: "Instant Creation" },
    { icon: <CheckCircle className="h-6 w-6 text-orange-500" />, text: "Expert Review Available" }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    // Simulate document generation
    setTimeout(() => {
      setGeneratedDocument({
        id: Date.now(),
        name: `${selectedTemplateData.name} - ${formData.clientName || formData.partyA || 'Generated Document'}.pdf`,
        url: '#',
        timestamp: new Date().toLocaleString()
      });
      setCurrentStep(3);
    }, 2000);
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedTemplate;
    if (currentStep === 2) {
      return selectedTemplateData?.fields.every(field => formData[field]?.trim());
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#1E40AF]">
                Haki Yetu
              </Link>
            </div>

            {/* Navigation - Center */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Services</Link>
              <Link to="/advocates" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Advocates</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-[#1E40AF] font-medium transition">Pricing</Link>
            </nav>

            {/* Actions - Right */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FACC15] text-[#1E40AF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered Document Generation
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create Legal Documents in<br />
            <span className="text-[#1E40AF]">Minutes, Not Hours</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate legally binding documents with AI assistance. Our templates are reviewed by LSK-accredited advocates and comply with Kenyan law.
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#1E40AF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= 1 ? 'bg-[#1E40AF] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Choose Template</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-[#1E40AF]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#1E40AF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= 2 ? 'bg-[#1E40AF] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Fill Details</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-[#1E40AF]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#1E40AF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= 3 ? 'bg-[#1E40AF] text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-[#1E40AF] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-white">
                {feature.icon}
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose Your Document Template</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`bg-white p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[#1E40AF] shadow-lg'
                        : 'border-gray-200 hover:border-[#1E40AF]/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${selectedTemplate === template.id ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-[#1E40AF]'}`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                        <p className="text-[#1E40AF] font-semibold">{template.price}</p>
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">This template includes:</p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Legally compliant language</li>
                          <li>• Customizable sections</li>
                          <li>• Digital signature ready</li>
                          <li>• Expert review available</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Form Filling */}
          {currentStep === 2 && selectedTemplateData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Fill in Your Document Details</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedTemplateData.name}</h3>
                  <p className="text-gray-600">{selectedTemplateData.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {selectedTemplateData.fields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()} *
                      </label>
                      {field.includes('description') || field.includes('info') ? (
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                          rows="3"
                          placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                          placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`}
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1E40AF] mb-1">Important Notice</h4>
                      <p className="text-sm text-gray-700">
                        All generated documents are created using legally compliant templates. For complex legal matters, we recommend consulting with a qualified advocate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Generated */}
          {currentStep === 3 && generatedDocument && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Document is Ready!</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Document Generated Successfully</h3>
                  <p className="text-gray-600">Your legal document has been created and is ready for download.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-[#1E40AF]" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{generatedDocument.name}</h4>
                        <p className="text-sm text-gray-600">Generated on {generatedDocument.timestamp}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Ready to Download
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#1E40AF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                  </div>
                </div>

                <div className="bg-[#FACC15]/10 p-6 rounded-lg">
                  <h4 className="font-semibold text-[#1E40AF] mb-3">Need Expert Review?</h4>
                  <p className="text-gray-700 mb-4">
                    Have your document reviewed by a qualified LSK advocate for just KES 1,500. Get peace of mind with professional legal validation.
                  </p>
                  <Link
                    to="/advocates"
                    className="inline-flex items-center gap-2 bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    Find an Advocate
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && selectedTemplate) {
                    setCurrentStep(2);
                  } else if (currentStep === 2 && canProceed()) {
                    handleGenerate();
                  }
                }}
                disabled={!canProceed()}
                className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 1 ? 'Continue' : currentStep === 2 ? 'Generate Document' : 'Next'}
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-[#FACC15]" />
                <span className="text-2xl font-bold">Haki Yetu</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Making legal services accessible and affordable for every Kenyan.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Shield className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <FileText className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white transition">Document Services</Link></li>
                <li><Link to="/services/notarization" className="hover:text-white transition">Notarization</Link></li>
                <li><Link to="/advocates" className="hover:text-white transition">Legal Consultation</Link></li>
                <li><Link to="/services" className="hover:text-white transition">Business Law</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Haki Yetu. All rights reserved. Made with ❤️ for Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentGenerator;
