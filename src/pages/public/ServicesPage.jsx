import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Users, Scale, Home, Briefcase, Gavel, Search, ArrowRight, CheckCircle } from 'lucide-react';

const ServicesPage = () => {
  const categories = [
    {
      title: "Document Services",
      description: "Legal document creation and processing",
      icon: <FileText className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Contract Drafting", price: "From KES 2,500", route: "/services" },
        { name: "Will Writing", price: "From KES 3,000", route: "/services" },
        { name: "Agreement Templates", price: "From KES 1,500", route: "/services" },
        { name: "Legal Letters", price: "From KES 1,000", route: "/services" }
      ]
    },
    {
      title: "Notarization Services",
      description: "Official document authentication",
      icon: <Shield className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Document Notarization", price: "From KES 500", route: "/services/notarization" },
        { name: "Affidavit Preparation", price: "From KES 2,000", route: "/services" },
        { name: "Power of Attorney", price: "From KES 3,500", route: "/services" },
        { name: "Statutory Declaration", price: "From KES 2,500", route: "/services" }
      ]
    },
    {
      title: "Legal Consultation",
      description: "Expert legal advice and guidance",
      icon: <Users className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Initial Consultation", price: "KES 2,000/session", route: "/advocates" },
        { name: "Legal Review", price: "From KES 5,000", route: "/advocates" },
        { name: "Case Assessment", price: "KES 3,000", route: "/advocates" },
        { name: "Document Analysis", price: "From KES 2,500", route: "/advocates" }
      ]
    },
    {
      title: "Property & Land Services",
      description: "Real estate and property law",
      icon: <Home className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Land Search", price: "From KES 1,500", route: "/services" },
        { name: "Title Deed Verification", price: "From KES 2,000", route: "/services" },
        { name: "Property Agreements", price: "From KES 4,000", route: "/services" },
        { name: "Lease Agreements", price: "From KES 3,000", route: "/services" }
      ]
    },
    {
      title: "Business Law",
      description: "Corporate and commercial legal services",
      icon: <Briefcase className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Company Registration", price: "From KES 15,000", route: "/services" },
        { name: "Business Contracts", price: "From KES 5,000", route: "/services" },
        { name: "Partnership Agreements", price: "From KES 4,000", route: "/services" },
        { name: "Employment Contracts", price: "From KES 3,500", route: "/services" }
      ]
    },
    {
      title: "Dispute Resolution",
      description: "Mediation and legal dispute services",
      icon: <Scale className="h-8 w-8 text-[#1E40AF]" />,
      services: [
        { name: "Mediation Services", price: "From KES 10,000", route: "/services" },
        { name: "Arbitration Support", price: "From KES 15,000", route: "/services" },
        { name: "Court Representation", price: "From KES 25,000", route: "/services" },
        { name: "Legal Opinion", price: "From KES 8,000", route: "/services" }
      ]
    }
  ];

  const features = [
    { icon: <CheckCircle className="h-6 w-6 text-green-500" />, text: "Verified LSK Lawyers" },
    { icon: <Shield className="h-6 w-6 text-blue-500" />, text: "Secure Payment Processing" },
    { icon: <Users className="h-6 w-6 text-purple-500" />, text: "24/7 Customer Support" },
    { icon: <FileText className="h-6 w-6 text-orange-500" />, text: "Digital Document Delivery" }
  ];

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
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Legal Services Catalog
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive legal services tailored for Kenyan citizens and businesses. All services delivered by verified LSK advocates.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
              />
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

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-800 font-medium">{service.name}</span>
                      <span className="text-[#1E40AF] font-semibold">{service.price}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={category.services[0].route}
                  className="inline-flex items-center gap-2 bg-[#1E40AF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition w-full justify-center"
                >
                  View All Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E40AF] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Help Choosing a Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our legal experts are here to guide you through the process and recommend the best services for your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/advocates"
              className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
            >
              Speak to an Advocate
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
            >
              Contact Support
            </Link>
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
                  <Gavel className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Briefcase className="h-5 w-5" />
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

export default ServicesPage;
