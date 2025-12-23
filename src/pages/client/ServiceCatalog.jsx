import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/domain/marketplace/ServiceCard';
import { Search } from 'lucide-react';

const ServiceCatalog = () => { 
    const [services, setServices] = useState([]);//state to hold service data
    const [loading, setLoading] = useState(true);//state to manage loading 
    const [searchTerm, setSearchTerm] = useState('');// state to hold search term 

    useEffect(() => {//fetch services from api on component mount
        const fetchServices = async () => {//async function to fetch services
            try {
        const response = await api.get('/marketplace/services');//fetch service from api
        setServices(response.data);//set service data to state
        } catch (error) {
        console.error("Failed to fetch services:", error);
        } finally {
          setLoading(false);//set loading to false after fetch
        }
    };

    fetchServices();//call fetch services function 
  }, []);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())//filter services based on search term
  );

    return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal Services Catalog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Choose from our list of standardized legal services. Fixed prices, verified lawyers, guaranteed results.
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for a service..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
          /* Grid of Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCatalog;




      





