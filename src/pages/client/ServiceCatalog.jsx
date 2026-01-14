import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Shield, FileText, Scale, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ServiceCatalog = () => {
  const navigate = useNavigate();

  // State for services, loading, and filtering
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. State for Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/marketplace/services');
        console.log("Fetched Services:", response.data); // Debug log
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 2. Filter Logic (Handles API response structure)
  const filteredServices = services.filter(service => {
    // Handle different field names from API vs hardcoded data
    const serviceName = service.name || service.title || '';
    const serviceCategory = service.category_name || service.category || '';
    const servicePrice = service.base_price || service.price || 0;

    const matchesSearch = serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Services' || serviceCategory === selectedCategory;

    // Simple Price Logic
    let matchesPrice = true;
    if (selectedPriceRange === 'low') matchesPrice = servicePrice < 2000;
    if (selectedPriceRange === 'mid') matchesPrice = servicePrice >= 2000 && servicePrice <= 10000;
    if (selectedPriceRange === 'high') matchesPrice = servicePrice > 10000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All Services', 'Notarization', 'Business', 'Land & Property', 'Family & Civil'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header Section */}
      <div className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Find the Legal Help You Need</h1>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our comprehensive catalog of legal services fulfilled by verified Kenyan Advocates.
          </p>

          {/* Search Bar (Functional) */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for affidavits, contracts, or services..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter size={18} /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat
                        ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
              <div className="space-y-3">
                {[
                  { label: 'All Prices', val: 'all' },
                  { label: 'Under KES 2,000', val: 'low' },
                  { label: 'KES 2,000 - 10,000', val: 'mid' },
                  { label: 'Above KES 10,000', val: 'high' }
                ].map((range) => (
                  <label key={range.val} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range.val}
                      onChange={() => setSelectedPriceRange(range.val)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCategory}</h2>
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading services...' : `Showing ${filteredServices.length} results`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Services Grid */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full mb-3">
                          {service.category_name || service.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-end justify-between mb-4">
                          <span className="text-gray-400 text-xs">Starting from</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            KES {service.base_price?.toLocaleString() || service.price?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        {/* FIXED: Route to Advocates Page */}
                        <Link
                          to="/advocates"
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors font-medium text-sm"
                        >
                          Book Now <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">No services found matching your criteria.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All Services'); setSelectedPriceRange('all'); }}
                      className="mt-4 text-blue-600 hover:underline text-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalog;
