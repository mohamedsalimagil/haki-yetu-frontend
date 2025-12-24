import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';

const ServiceCard = ({ service }) => {
  // Random gradients for a "Legal Tech" feel since we might not have images for everything
  const gradients = [
    "bg-gradient-to-br from-blue-600 to-blue-800",
    "bg-gradient-to-br from-slate-700 to-slate-900",
    "bg-gradient-to-br from-indigo-600 to-indigo-800"
  ];
  
  // Pick a random style based on ID so it stays consistent
  const bgStyle = gradients[(service.id || 0) % gradients.length];

  // Handle price naming difference (backend uses base_price, frontend sometimes expects price)
  const price = service.base_price || service.price || 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      {/* 1. Header / Visual */}
      <div className={`h-32 ${bgStyle} p-6 relative`}>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
          Legal Verified
        </div>
        <ShieldCheck className="text-white/20 w-16 h-16 absolute -bottom-4 -left-4 transform rotate-12" />
      </div>

      {/* 2. Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {service.description || "Professional legal service provided by verified advocates. Secure and fast turnaround."}
          </p>
        </div>

        {/* 3. Metadata */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-6">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {service.processing_days || 2} Days
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div>Digital Delivery</div>
        </div>

        {/* 4. Footer (Price & Action) */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Starting at</p>
            <p className="text-xl font-bold text-gray-900">
              KES {price.toLocaleString()}
            </p>
          </div>
          
          <Link 
            to={`/services/${service.id}`}
            className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;