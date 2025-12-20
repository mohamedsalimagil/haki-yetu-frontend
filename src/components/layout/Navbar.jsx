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