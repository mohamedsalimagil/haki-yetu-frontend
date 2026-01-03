import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Search, 
  Briefcase, 
  Scale, 
  Building2, 
  Home, 
  Users, 
  FileText,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  ClipboardList,
  FileCheck,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const ServiceCatalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [activeTab, setActiveTab] = useState('Affidavits');

  // Fetch services from Flask backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/marketplace/services');
        setServices(response.data.services || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError(err.response?.data?.message || 'Failed to load services');
        // Fallback to mock data if backend fails
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fallback mock service data
  const mockServices = [
    {
      id: 1,
      title: 'Affidavit Commissioning',
      description: 'Expert witnessing of affidavits. We handle name change, loss of documents, or any sworn statements.',
      price: 1500,
      category: 'notarization',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
      verified: true,
      tag: 'INSTANT'
    },
    {
      id: 2,
      title: 'Certified True Copies',
      description: 'Certification of documents. Verification of original copies of academic and official ID cards, and passports by an advocate.',
      price: 1000,
      category: 'notarization',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=250&fit=crop',
      verified: true
    },
    {
      id: 3,
      title: 'Power of Attorney',
      description: 'Drafting and witnessing of power of Attorney documents for property or financial matters.',
      price: 3500,
      category: 'notarization',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=250&fit=crop',
      verified: false
    },
    {
      id: 4,
      title: 'Company Registration',
      description: 'Full incorporation service for Private Limited Companies including name reservation.',
      price: 15000,
      category: 'business',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
      verified: true
    },
    {
      id: 5,
      title: 'CR12 Official Search',
      description: 'Get an official CR12 form showing current company directors and shares.',
      price: 2500,
      category: 'business',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      verified: true
    },
    {
      id: 6,
      title: 'Partnership Agreement',
      description: 'Comprehensive drafting of partnership deeds tailored to your business.',
      price: 0,
      category: 'business',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      verified: true
    }
  ];

  // Filter services based on category and search
  const notarizationServices = services.filter(s => 
    (!selectedCategory || selectedCategory === 'all' || s.category === 'notarization') &&
    (s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm)
  );

  const businessServices = services.filter(s => 
    (!selectedCategory || selectedCategory === 'all' || s.category === 'business') &&
    (s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm)
  );

  const categories = [
    { id: 'all', label: 'All Services', icon: Scale },
    { id: 'notarization', label: 'Notarization', icon: FileText },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'property', label: 'Land & Property', icon: Home },
    { id: 'family', label: 'Family & Civil', icon: Users }
  ];

  const tabs = [
    { id: 'Affidavits', label: 'Affidavits', icon: FileText },
    { id: 'Company Reg', label: 'Company Reg', icon: Building2 },
    { id: 'Tenancy', label: 'Tenancy', icon: Home },
    { id: 'Custody', label: 'Custody', icon: Users },
    { id: 'Wills', label: 'Wills', icon: FileCheck },
    { id: 'Consultations', label: 'Consultations', icon: MessageSquare }
  ];

  const priceRanges = [
    { id: 'under1000', label: 'Under KES1,000', min: 0, max: 1000 },
    { id: '1000-5000', label: 'KES1,000-5,000', min: 1000, max: 5000 },
    { id: 'above5000', label: 'Above KES 5,000', min: 5000, max: Infinity },
    { id: 'quote', label: 'Request Quote', min: 0, max: 0 }
  ];

  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRange(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleBookService = (service) => {
    if (!user) {
      toast.error('Please log in to book services');
      navigate('/login');
      return;
    }

    if (user.verification_status !== 'verified') {
      toast.error('Please complete your verification to book services');
      navigate('/client/onboarding');
      return;
    }

    toast.success(`Booking ${service.title}...`);
    navigate('/checkout', { state: { service } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/service-catalog" className="text-blue-600 font-medium">Service Catalog</a>
              <a href="/advocates" className="text-gray-600 hover:text-gray-900">Advocates</a>
              <a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Log In</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-gray-900">
                    Log In
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark Blue Background */}
      <div className="bg-[#0A1E41] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find the Legal Help You Need
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Browse our comprehensive catalog of legal services fulfilled by verified Kenyan Advocates. Fast, secure, and transparent.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="pl-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for affidavits, contracts, or service..."
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPriceRange.includes(range.id)}
                        onChange={() => handlePriceRangeChange(range.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* LSK Verified Badge */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-blue-600 rounded-full p-2">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="font-bold text-blue-900 mb-1">LSK Verified</h4>
                  <p className="text-xs text-blue-700">
                    All services are fulfilled by advocates licensed by the Law Society of Kenya
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Category Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-3 overflow-x-auto">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* How it Works Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-8 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-6">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">1.Select Service</h3>
                    <p className="text-sm text-blue-100">
                      Browse and pick the service you need
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">2.Provide Details</h3>
                    <p className="text-sm text-blue-100">
                      Fill in necessary information and upload forms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">3.Connect</h3>
                    <p className="text-sm text-blue-100">
                      Navigate with the advocate and receive documents
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                <SkeletonLoader count={6} />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Backend Connection Issue</h3>
                  <p className="text-sm text-yellow-700 mb-2">{error}</p>
                  <p className="text-xs text-yellow-600">Showing sample data. Please ensure Flask backend is running at http://127.0.0.1:5000</p>
                </div>
              </div>
            )}

            {/* Notarization Services Section */}
            {!loading && notarizationServices.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Notarization Services</h2>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notarizationServices.map(service => (
                  <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        {service.verified && (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title || 'Service'}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description || 'No description available'}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {service.price > 0 ? `KES ${service.price.toLocaleString()}` : 'Request Quote'}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBookService(service)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State - Notarization */}
            {!loading && notarizationServices.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl mb-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Notarization Services Found</h3>
                <p className="text-sm text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Business & Corporate Section */}
            {!loading && businessServices.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Business & Corporate</h2>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessServices.map(service => (
                  <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        {service.verified && (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title || 'Service'}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description || 'No description available'}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {service.price > 0 ? `KES ${service.price.toLocaleString()}` : 'Request Quote'}
                          </div>
                          {service.price === 0 && (
                            <div className="text-xs text-gray-500">Contact for pricing</div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBookService(service)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State - Business */}
            {!loading && businessServices.length === 0 && services.length > 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Business Services Found</h3>
                <p className="text-sm text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
              </div>
              <p className="text-sm text-gray-600">
                Democratizing access to justice in Kenya through technology
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Notarization</a></li>
                <li><a href="#" className="hover:text-gray-900">Business Registration</a></li>
                <li><a href="#" className="hover:text-gray-900">Land Transfers</a></li>
                <li><a href="#" className="hover:text-gray-900">Wills & Probate</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Advocates</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Data Protection</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">© 2024 Haki Yetu. All rights reserved. Powered by KCBInnovations</p>
            <div className="flex items-center gap-2">
              <img src="/mpesa-icon.png" alt="M-Pesa" className="h-6" onError={(e) => e.target.style.display = 'none'} />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceCatalog;
