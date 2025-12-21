import React from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import React from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
            {service.category || 'Legal Service'}
          </span>
          <span className="font-bold text-xl text-gray-900">
            KES {service.price.toLocaleString()}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {service.description || "Professional legal service provided by verified experts."}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{service.processing_days} Days</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Link 
          to={`/services/${service.id}`}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition text-sm font-medium"
        >
          View Details <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;