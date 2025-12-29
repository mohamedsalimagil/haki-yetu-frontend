import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, FileText, Video, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">Haki Yetu</span>
            </div>
            
            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
              <a href="#services" className="hover:text-blue-600 transition">Services</a>
              <a href="#advocates" className="hover:text-blue-600 transition">Find an Advocate</a>
              <a href="#about" className="hover:text-blue-600 transition">About</a>
              <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <button 
                  onClick={() => navigate(user.role === 'lawyer' ? '/lawyer/dashboard' : '/client/dashboard')}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition font-medium shadow-md"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="text-gray-900 font-medium hover:text-blue-600 hidden sm:block">
                    Login
                  </button>
                  <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/20">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Trusted by 5,000+ Kenyans
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Legal Services at <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Your Fingertips
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Connect with verified lawyers, automate legal documents, and access justice securely, fast, and affordably.
              </p>

              {/* Search Bar */}
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row gap-2 max-w-md border border-gray-100">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Find a Lawyer or Service..." 
                    className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Search
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">4.9/5</span> rating from verified clients
                </div>
              </div>
            </div>

            {/* Right Image (Hero) */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 opacity-10 blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Legal Services" 
                className="relative rounded-[2.5rem] shadow-2xl w-full object-cover h-[500px] border-4 border-white transform hover:scale-[1.02] transition duration-500"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-[-20px] bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">LSK Verified</p>
                  <p className="font-bold text-gray-900">Active Advocate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TRUSTED BY --- */}
      <div className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Trusted by Leading Institutions</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold text-gray-600">LSK</span>
            <span className="text-xl font-bold text-gray-600">KRA</span>
            <span className="text-xl font-bold text-gray-600">Judiciary</span>
            <span className="text-xl font-bold text-gray-600">eCitizen</span>
            <span className="text-xl font-bold text-gray-600">ArdhiSasa</span>
          </div>
        </div>
      </div>

      {/* --- SERVICES SECTION --- */}
      <div id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Our Core Services</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Accessible Justice for Every Kenyan</h3>
            <p className="text-gray-600 text-lg">We simplify the legal process with three key pillars designed for your convenience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: FileText, 
                title: "Instant Document Generator", 
                desc: "Create customized contracts, affidavits, and agreements in minutes using our AI-powered templates.", 
                color: "text-blue-600", bg: "bg-blue-50"
              },
              { 
                icon: Video, 
                title: "Remote Notarization", 
                desc: "Get your documents notarized online via verified video calls with licensed advocates.", 
                color: "text-indigo-600", bg: "bg-indigo-50"
              },
              { 
                icon: Shield, 
                title: "Virtual Consultations", 
                desc: "Book 1-on-1 video sessions with specialized lawyers for instant legal advice tailored to your needs.", 
                color: "text-emerald-600", bg: "bg-emerald-50"
              }
            ].map((service, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-white">
                <div className={`w-14 h-14 ${service.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
                <button className={`flex items-center gap-2 font-semibold ${service.color} hover:gap-3 transition-all`}>
                  Start Now <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-blue-500 w-6 h-6" />
              <span className="text-xl font-bold text-white">Haki Yetu</span>
            </div>
            <p className="text-sm leading-relaxed">
              Democratizing access to justice in Kenya through technology, security, and professional excellence.
            </p>
          </div>
          
          {[
            { header: "Platform", links: ["Services", "Find an Advocate", "Pricing", "For Lawyers"] },
            { header: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { header: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] }
          ].map((col, idx) => (
            <div key={idx}>
              <h5 className="text-white font-bold mb-4">{col.header}</h5>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}><a href="#" className="hover:text-blue-500 transition text-sm">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © 2025 Haki Yetu Digital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;