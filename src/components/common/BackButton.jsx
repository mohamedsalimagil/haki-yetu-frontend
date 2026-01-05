import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to = '/client/dashboard', label = 'Go Back', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ${className}`}
      aria-label="Go back to dashboard"
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
};

export default BackButton;
