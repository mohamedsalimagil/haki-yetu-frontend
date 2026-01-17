import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Shield, Users, ArrowRight, CheckCircle, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/layout/Footer';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();




  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors">


      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 py-20 px-6 transition-colors">
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

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Legal Services at<br />
                <span className="text-[#FACC15]">Your Fingertips</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                Access verified lawyers, notarize documents remotely, and get legal consultations from anywhere in Kenya through our secure digital platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/advocates"
                  className="bg-[#1E40AF] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition inline-flex items-center justify-center"
                >
                  Find a Lawyer
                </Link>
                {user && (
                  <Link
                    to="/services"
                    className="hidden border-2 border-[#1E40AF] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1E40AF] hover:text-white transition inline-flex items-center justify-center"
                  >
                    Browse Documents
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column - Creative Visual (White Box + Line Drawing) */}
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-2xl relative overflow-visible group border border-gray-100 dark:border-gray-700">

                <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center relative overflow-visible z-10 p-8 pb-12">

                  {/* Kenyan Flag Background Splashes */}
                  <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
                    {/* Black stripe */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-black rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                    {/* Red stripe */}
                    <div className="absolute top-1/4 -right-10 w-48 h-48 bg-red-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
                    {/* Green stripe */}
                    <div className="absolute -bottom-10 left-1/4 w-44 h-44 bg-green-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                    {/* White/Shield accent */}
                    <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  </div>

                  {/* Animated SVG Justice Scales - Simple Clean Design */}
                  <div className="relative mb-4 w-56 h-60 z-10">
                    <svg viewBox="0 0 200 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      {/* Gradients - define first */}
                      <defs>
                        <linearGradient id="poleGradient" x1="100" y1="26" x2="100" y2="170">
                          <stop offset="0%" stopColor="#1E40AF" />
                          <stop offset="50%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#1E40AF" />
                        </linearGradient>
                        <linearGradient id="barGradient" x1="30" y1="55" x2="170" y2="55">
                          <stop offset="0%" stopColor="#DC2626" />
                          <stop offset="50%" stopColor="#FACC15" />
                          <stop offset="100%" stopColor="#16A34A" />
                        </linearGradient>
                      </defs>

                      {/* Top ornament */}
                      <circle cx="100" cy="18" r="8" fill="#FACC15" className="animate-pulse" />

                      {/* Crossbar - solid line connecting the scales */}
                      <line x1="30" y1="55" x2="170" y2="55" stroke="#1E40AF" strokeWidth="6" strokeLinecap="round" />

                      {/* Left Scale */}
                      <path d="M30 55 L15 110" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '1s' }} />
                      <path d="M30 55 L45 110" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '1s' }} />
                      <ellipse cx="30" cy="115" rx="22" ry="8" fill="#1E40AF" className="animate-draw" style={{ animationDelay: '1.5s' }} />
                      <path d="M8 115 Q15 135 30 140 Q45 135 52 115" fill="rgba(30, 64, 175, 0.3)" stroke="#1E40AF" strokeWidth="2" className="animate-draw" style={{ animationDelay: '1.6s' }} />

                      {/* Right Scale */}
                      <path d="M170 55 L155 110" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '1.2s' }} />
                      <path d="M170 55 L185 110" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" className="animate-draw" style={{ animationDelay: '1.2s' }} />
                      <ellipse cx="170" cy="115" rx="22" ry="8" fill="#1E40AF" className="animate-draw" style={{ animationDelay: '1.8s' }} />
                      <path d="M148 115 Q155 135 170 140 Q185 135 192 115" fill="rgba(30, 64, 175, 0.3)" stroke="#1E40AF" strokeWidth="2" className="animate-draw" style={{ animationDelay: '1.9s' }} />

                      {/* Main Vertical Pole - solid color, drawn LAST so it appears on top */}
                      <line x1="100" y1="26" x2="100" y2="150" stroke="#1E40AF" strokeWidth="8" strokeLinecap="round" />

                      {/* Center connector on crossbar */}
                      <circle cx="100" cy="55" r="6" fill="#1E40AF" stroke="#FACC15" strokeWidth="2" className="animate-draw" style={{ animationDelay: '0.6s' }} />

                      {/* Middle Base Stem - trapezoid connecting pole to base */}
                      <polygon points="92,150 108,150 115,170 85,170" fill="#1E40AF" className="animate-draw" style={{ animationDelay: '0.1s' }} />
                      {/* Decorative ring on stem */}
                      <ellipse cx="100" cy="155" rx="10" ry="3" fill="#3B82F6" className="animate-draw" style={{ animationDelay: '0.12s' }} />

                      {/* Base Platform */}
                      <rect x="60" y="170" width="80" height="10" rx="5" fill="#1E40AF" className="animate-draw" style={{ animationDelay: '0.15s' }} />
                      {/* Green accent base */}
                      <rect x="75" y="180" width="50" height="6" rx="3" fill="#16A34A" className="animate-draw" style={{ animationDelay: '0.2s' }} />
                    </svg>
                  </div>

                  {/* Graffiti-style Slogan */}
                  <div className="text-center animate-fade-in opacity-0 z-10 relative w-full overflow-visible">
                    {/* Graffiti text with hand-drawn effect */}
                    <div className="relative inline-block" style={{ paddingRight: '30px', marginRight: '10px' }}>
                      {/* Shadow/3D effect layers */}
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight absolute -left-1 top-1 text-black/20 dark:text-black/40 whitespace-nowrap"
                        style={{
                          fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive",
                          transform: 'rotate(-2deg)'
                        }}
                      >
                        Uko na Lawyer?
                      </h2>
                      {/* Main graffiti text */}
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight relative whitespace-nowrap"
                        style={{
                          fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive",
                          background: 'linear-gradient(135deg, #000 0%, #DC2626 25%, #16A34A 50%, #DC2626 75%, #000 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          transform: 'rotate(-2deg)',
                          paddingRight: '10px'
                        }}
                      >
                        Uko na Lawyer?
                      </h2>
                      {/* Decorative underline stroke */}
                      <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 15">
                        <path
                          d="M5 8 Q50 3 100 10 T195 6"
                          stroke="url(#underlineGradient)"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          className="animate-draw"
                          style={{ animationDelay: '3s' }}
                        />
                        <defs>
                          <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#000" />
                            <stop offset="50%" stopColor="#DC2626" />
                            <stop offset="100%" stopColor="#16A34A" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-lg tracking-wide mt-4 italic">
                      ✨ Justice drawn for you ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-6 bg-[#F9FAFB] dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Accessible Justice for Every Kenyan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our digital platform makes legal services affordable, accessible, and secure for all citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<FileText className="h-12 w-12 text-[#1E40AF]" />}
              title="AI Document Summarizer"
              description="Upload complex legal documents and get instant AI-powered summaries with key insights."
            />
            <ServiceCard
              icon={<Shield className="h-12 w-12 text-[#1E40AF]" />}
              title="Remote Notarization"
              description="Get your documents notarized digitally through secure video verification."
            />
            <ServiceCard
              icon={<Users className="h-12 w-12 text-[#1E40AF]" />}
              title="Virtual Consultations"
              description="Connect with verified lawyers for personalized legal advice and guidance."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Haki Yetu Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
                title="Verify Identity"
                description="Complete secure identity verification through our trusted partners."
              />
              <ProcessStep
                number="2"
                title="Select Service"
                description="Choose from our comprehensive range of legal services and document types."
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
      <section className="bg-[#1E40AF] text-white py-10 md:py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Secure Your Rights?
          </h2>
          <p className="text-lg text-blue-100 mb-5 max-w-2xl mx-auto">
            Join thousands of Kenyans who trust Haki Yetu for their legal needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <Link
                to="/register"
                className="bg-[#FACC15] text-[#1E40AF] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-400 transition inline-flex items-center justify-center"
              >
                Get Started
              </Link>
            ) : (
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'lawyer' ? '/lawyer/dashboard' : '/client/dashboard'}
                className="bg-[#FACC15] text-[#1E40AF] px-6 py-3 rounded-lg font-bold text-base hover:bg-yellow-400 transition inline-flex items-center justify-center"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">{description}</p>
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
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;