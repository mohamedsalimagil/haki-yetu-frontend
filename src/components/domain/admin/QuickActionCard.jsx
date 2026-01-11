import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function QuickActionCard({ title, description, action, link, icon }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl mb-3">{icon}</div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-primary transition flex-shrink-0" size={24} />
      </div>
      <div className="mt-4 inline-flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition">
        {action} <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
}