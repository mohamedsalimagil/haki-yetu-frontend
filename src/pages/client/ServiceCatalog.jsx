import React, { useState } from 'react';
import { Search, Filter, ArrowRight, Shield, FileText, Scale, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ServiceCatalog = () => {
  const navigate = useNavigate();

  // 1. State for Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Sample Data (or fetch from API)
  const services = [
    { id: 1, title: 'Affidavit Service', category: 'Notarization', price: 1500, description: 'Sworn statement confirming identity or facts.', icon: FileText },
    { id: 2, title: 'Contract Review', category: 'Business', price: 5000, description: 'Professional review of business contracts.', icon: Briefcase },
    { id: 3, title: 'Land Transfer', category: 'Land & Property', price: 12000, description: 'Legal assistance with property transfer.', icon: Scale },
    { id: 4, title: 'Certified Copies', category: 'Notarization', price: 500, description: 'Official certification of original documents.', icon: Shield },
    { id: 5, title: 'Legal Consultation', category: 'Family & Civil', price: 3000, description: 'General legal advice session.', icon: Scale },
    { id: 6, title: 'Company Registration', category: 'Business', price: 15000, description: 'Full registration service for new companies.', icon: Briefcase },
  ];

  // 2. Filter Logic (Fixes Search & Sidebar)
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;

    // Simple Price Logic
    let matchesPrice = true;
    if (selectedPriceRange === 'low') matchesPrice = service.price < 2000;
    if (selectedPriceRange === 'mid') matchesPrice = service.price >= 2000 && service.price <= 10000;
    if (selectedPriceRange === 'high') matchesPrice = service.price > 10000;

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
              <p className="text-gray-500 text-sm">Showing {filteredServices.length} results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full mb-3">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-end justify-between mb-4">
                      <span className="text-gray-400 text-xs">Starting from</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        KES {service.price.toLocaleString()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalog;
