import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Shield, Users, ArrowRight, CheckCircle, Phone, CreditCard, Twitter, Linkedin, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect admin users to admin dashboard
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white font-sans">
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
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#1E40AF] hover:bg-gray-100 transition"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop actions */}
              <div className="hidden md:flex items-center space-x-4">
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
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-6 py-4 space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/advocates"
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Advocates
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#1E40AF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              {/* Verified Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E40AF] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Kenyan Advocates
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Legal Services at<br />
                <span className="text-[#FACC15]">Your Fingertips</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Access verified lawyers, notarize documents remotely, and get legal consultations from anywhere in Kenya through our secure digital platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/advocates"
                  className="bg-[#1E40AF] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition inline-flex items-center justify-center"
                >
                  Find a Lawyer
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-[#1E40AF] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1E40AF] hover:text-white transition inline-flex items-center justify-center"
                >
                  Browse Documents
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
                <div className="aspect-square bg-gradient-to-br from-[#1E40AF] to-blue-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white relative z-10">
                    <Shield className="h-20 w-20 mx-auto mb-6 opacity-90" />
                    <p className="text-xl font-semibold">Legal Services Platform</p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full"></div>
                </div>

                {/* LSK Accreditation Badge - Overlay */}
                <div className="absolute bottom-4 left-4 bg-[#FACC15] text-[#1E40AF] px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                  Law Society of Kenya Accredited
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Ribbon */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              TRUSTED BY LEADING INSTITUTIONS
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold">LSK</div>
              <span className="font-medium">Law Society of Kenya</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold">KRA</div>
              <span className="font-medium">Kenya Revenue Authority</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold">JUD</div>
              <span className="font-medium">Judiciary</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold">CIT</div>
              <span className="font-medium">eCitizen</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-bold">ARD</div>
              <span className="font-medium">ArdhiSasa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accessible Justice for Every Kenyan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our digital platform makes legal services affordable, accessible, and secure for all citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<FileText className="h-12 w-12 text-[#1E40AF]" />}
              title="Instant Document Generator"
              description="Create legally binding documents with AI assistance and expert review within minutes."
              ctaText="Start Drafting →"
              ctaLink="/services/drafting"
            />
            <ServiceCard
              icon={<Shield className="h-12 w-12 text-[#1E40AF]" />}
              title="Remote Notarization"
              description="Get your documents notarized digitally through secure video verification."
              ctaText="Book Notary →"
              ctaLink="/services/notarization"
            />
            <ServiceCard
              icon={<Users className="h-12 w-12 text-[#1E40AF]" />}
              title="Virtual Consultations"
              description="Connect with verified lawyers for personalized legal advice and guidance."
              ctaText="Find Advocate →"
              ctaLink="/advocates"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Haki Yetu Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to access professional legal services
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
              <div className="h-0.5 bg-[#1E40AF] relative">
                <div className="absolute inset-0 bg-[#FACC15]"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              <ProcessStep
                number="1"
                title="Select Service"
                description="Choose from our comprehensive range of legal services and document types."
              />
              <ProcessStep
                number="2"
                title="Verify Identity"
                description="Complete secure identity verification through our trusted partners."
              />
              <ProcessStep
                number="3"
                title="Make Payment"
                description="Pay securely through M-Pesa with our escrow protection system."
              />
              <ProcessStep
                number="4"
                title="Receive Service"
                description="Get your documents delivered digitally with expert legal review."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#1E40AF] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Rights?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans who trust Haki Yetu for their legal needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
            >
              Contact Sales
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
                Bridging the gap between citizens and legal justice in Kenya through innovative technology and trusted partnerships.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link to="/marketplace" className="hover:text-white transition">Find an Advocate</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white transition">For Lawyers</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
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

// Service Card Component
const ServiceCard = ({ icon, title, description, ctaText, ctaLink }) => (
  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed text-center">{description}</p>

    <Link
      to={ctaLink}
      className="text-[#1E40AF] font-semibold hover:text-blue-800 transition inline-flex items-center justify-center w-full"
    >
      {ctaText}
    </Link>
  </div>
);

// Process Step Component
const ProcessStep = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-[#1E40AF] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg mb-4">
        {number}
      </div>
      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FACC15] text-[#1E40AF] rounded-full flex items-center justify-center">
        <CheckCircle className="h-6 w-6" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
