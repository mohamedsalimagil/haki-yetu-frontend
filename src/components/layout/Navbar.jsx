import React, { useState } from 'react'; //react library for building user interfaces
import { Link } from 'react-router-dom';//react-router-dom for navigation between different routes
import { Menu, X, Scale } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-secondary" />
            <span className="font-bold text-xl tracking-wide">Haki Yetu</span>
          </Link>

          {/* Desktop Menu */} 
          <div className="hidden md:flex space-x-8">
            <Link to="/services" className="hover:text-gray-300 transition">Services</Link>
            <Link to="/lawyers" className="hover:text-gray-300 transition">Find a Lawyer</Link>
            <Link to="/login" className="px-4 py-2 bg-secondary rounded hover:bg-red-700 transition">Login</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-blue-800">Services</Link>
          <Link to="/lawyers" className="block px-3 py-2 rounded-md hover:bg-blue-800">Find a Lawyer</Link>
          <Link to="/login" className="block px-3 py-2 rounded-md bg-secondary text-center mt-4">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;