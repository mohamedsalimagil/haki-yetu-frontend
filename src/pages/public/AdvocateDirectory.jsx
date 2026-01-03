import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Star, MapPin, Calendar, MessageCircle, Phone, Award, Search, Filter, ChevronRight } from 'lucide-react';

const AdvocateDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const specializations = [
    'All',
    'Corporate Law',
    'Family Law',
    'Property Law',
    'Criminal Law',
    'Employment Law',
    'Tax Law',
    'Immigration Law'
  ];

  const advocates = [
    {
      id: 1,
      name: 'Adv. Sarah Mwangi',
      specialization: 'Corporate Law',
      lskNumber: 'LSK/1234/2018',
      experience: '8 years',
      location: 'Nairobi',
      rating: 4.9,
      reviews: 127,
      languages: ['English', 'Swahili'],
      price: 'KES 5,000/session',
      availability: 'Available Today',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=Sarah+Mwangi&background=1E40AF&color=fff&size=150'
    },
    {
      id: 2,
      name: 'Adv. David Kiprop',
      specialization: 'Property Law',
      lskNumber: 'LSK/2345/2016',
      experience: '10 years',
      location: 'Nakuru',
      rating: 4.8,
      reviews: 89,
      languages: ['English', 'Swahili'],
      price: 'KES 4,500/session',
      availability: 'Available Tomorrow',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=David+Kiprop&background=1E40AF&color=fff&size=150'
    },
    {
      id: 3,
      name: 'Adv. Grace Wanjiku',
      specialization: 'Family Law',
      lskNumber: 'LSK/3456/2019',
      experience: '6 years',
      location: 'Eldoret',
      rating: 4.7,
      reviews: 156,
      languages: ['English', 'Swahili', 'Luo'],
      price: 'KES 4,000/session',
      availability: 'Available This Week',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=Grace+Wanjiku&background=1E40AF&color=fff&size=150'
    },
    {
      id: 4,
      name: 'Adv. Michael Oduya',
      specialization: 'Criminal Law',
      lskNumber: 'LSK/4567/2015',
      experience: '12 years',
      location: 'Kisumu',
      rating: 4.9,
      reviews: 203,
      languages: ['English', 'Swahili', 'Luo'],
      price: 'KES 6,000/session',
      availability: 'Available Today',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=Michael+Oduya&background=1E40AF&color=fff&size=150'
    },
    {
      id: 5,
      name: 'Adv. Ann Njoroge',
      specialization: 'Employment Law',
      lskNumber: 'LSK/5678/2020',
      experience: '5 years',
      location: 'Mombasa',
      rating: 4.6,
      reviews: 78,
      languages: ['English', 'Swahili'],
      price: 'KES 4,200/session',
      availability: 'Available Next Week',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=Ann+Njoroge&background=1E40AF&color=fff&size=150'
    },
    {
      id: 6,
      name: 'Adv. Peter Kamau',
      specialization: 'Tax Law',
      lskNumber: 'LSK/6789/2017',
      experience: '9 years',
      location: 'Thika',
      rating: 4.8,
      reviews: 145,
      languages: ['English', 'Swahili'],
      price: 'KES 5,500/session',
      availability: 'Available Today',
      verified: true,
      image: 'https://ui-avatars.com/api/?name=Peter+Kamau&background=1E40AF&color=fff&size=150'
    }
  ];

  const filteredAdvocates = advocates.filter(advocate => {
    const matchesSearch = advocate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advocate.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advocate.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || advocate.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Legal Advocate
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified Kenyan lawyers specializing in your area of need. All advocates are registered with the Law Society of Kenya.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none bg-white"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>All advocates verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span>LSK Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>{advocates.length} advocates available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Advocates Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAdvocates.map((advocate) => (
              <div key={advocate.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <img
                      src={advocate.image}
                      alt={advocate.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{advocate.name}</h3>
                        {advocate.verified && (
                          <Shield className="h-4 w-4 text-green-500" title="Verified LSK Member" />
                        )}
                      </div>
                      <p className="text-[#1E40AF] font-medium mb-1">{advocate.specialization}</p>
                      <p className="text-sm text-gray-500">{advocate.lskNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-900">{advocate.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{advocate.rating}</span>
                        <span className="text-sm text-gray-500">({advocate.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{advocate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{advocate.availability}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {advocate.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#1E40AF]">{advocate.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/client/book/${advocate.id}`, { state: { advocate } })}
                        className="flex-1 bg-[#1E40AF] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Book Consultation
                      </button>
                      <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdvocates.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No advocates found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all specializations.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialization('All');
                }}
                className="mt-4 bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E40AF] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can't Find the Right Advocate?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our legal experts can help match you with the perfect advocate for your specific needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-[#FACC15] text-[#1E40AF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center"
            >
              Get Matched
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1E40AF] transition inline-flex items-center justify-center"
            >
              Learn More
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
                Connecting Kenyans with verified legal professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Users className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FACC15] transition">
                  <Award className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link to="/advocates" className="hover:text-white transition">Find an Advocate</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white transition">For Lawyers</Link></li>
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

export default AdvocateDirectory;
