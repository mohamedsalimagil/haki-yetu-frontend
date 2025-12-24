import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/domain/marketplace/ServiceCard';
import { Search, Inbox } from 'lucide-react'; // Added Inbox icon for empty state

const ServiceCatalog = () => { 
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/marketplace/services');
                setServices(response.data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Legal Services Catalog</h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8 text-lg">
            Choose from our list of standardized legal services. Fixed prices, verified lawyers, guaranteed results.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for a service (e.g. Affidavit)..." 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Empty State (POLISH) */}
            {filteredServices.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-white p-6 rounded-full inline-block mb-4 shadow-sm">
                        <Inbox className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceCatalog;