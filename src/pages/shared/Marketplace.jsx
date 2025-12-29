import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import LawyerCard from '../../components/domain/LawyerCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Mock data - in real app this would come from API
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        // This would be a real API call: const response = await api.get('/marketplace/lawyers');
        // For now, using mock data
        const mockLawyers = [
          {
            id: 1,
            first_name: 'Sarah',
            last_name: 'Njeri',
            verified: true,
            location: 'Nairobi CBD',
            average_rating: 4.8,
            total_reviews: 156,
            specializations: ['Corporate Law', 'Contract Law', 'Business Law'],
            bio: 'Experienced corporate lawyer with 8+ years in business law and contract drafting.',
            years_experience: 8,
            hourly_rate: 5000,
            response_time: '< 2h'
          },
          {
            id: 2,
            first_name: 'David',
            last_name: 'Kiprop',
            verified: true,
            location: 'Westlands',
            average_rating: 4.9,
            total_reviews: 203,
            specializations: ['Criminal Law', 'Family Law', 'Constitutional Law'],
            bio: 'Defending justice with integrity and expertise in criminal and family law matters.',
            years_experience: 12,
            hourly_rate: 4500,
            response_time: '< 1h'
          },
          {
            id: 3,
            first_name: 'Grace',
            last_name: 'Wanjiku',
            verified: false,
            location: 'Karen',
            average_rating: 4.7,
            total_reviews: 89,
            specializations: ['Property Law', 'Real Estate', 'Land Disputes'],
            bio: 'Specializing in property law and real estate transactions with a client-first approach.',
            years_experience: 6,
            hourly_rate: 4000,
            response_time: '< 4h'
          },
          {
            id: 4,
            first_name: 'Michael',
            last_name: 'Oduya',
            verified: true,
            location: 'Kilimani',
            average_rating: 4.6,
            total_reviews: 127,
            specializations: ['Employment Law', 'Labor Law', 'HR Consulting'],
            bio: 'Navigating employment law complexities to protect both employers and employees.',
            years_experience: 10,
            hourly_rate: 4800,
            response_time: '< 3h'
          },
          {
            id: 5,
            first_name: 'Ann',
            last_name: 'Muthoni',
            verified: true,
            location: 'Thika',
            average_rating: 4.8,
            total_reviews: 178,
            specializations: ['Family Law', 'Divorce', 'Child Custody'],
            bio: 'Compassionate family law expert helping families navigate difficult transitions.',
            years_experience: 9,
            hourly_rate: 4200,
            response_time: '< 6h'
          },
          {
            id: 6,
            first_name: 'Peter',
            last_name: 'Ndungu',
            verified: false,
            location: 'Nakuru',
            average_rating: 4.5,
            total_reviews: 67,
            specializations: ['Tax Law', 'Corporate Tax', 'Financial Law'],
            bio: 'Tax law specialist helping businesses optimize their tax strategies and compliance.',
            years_experience: 7,
            hourly_rate: 5500,
            response_time: '< 12h'
          }
        ];
        setLawyers(mockLawyers);
      } catch (error) {
        console.error('Failed to fetch lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = `${lawyer.first_name} ${lawyer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = !selectedSpecialization || lawyer.specializations?.includes(selectedSpecialization);
    const matchesLocation = !selectedLocation || lawyer.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  const specializations = [...new Set(lawyers.flatMap(lawyer => lawyer.specializations || []))];
  const locations = [...new Set(lawyers.map(lawyer => lawyer.location).filter(Boolean))];

  const handleBookNow = (lawyer) => {
    // Navigate to the Lawyer Profile page (Step 3)
    navigate(`/lawyer/${lawyer.id}`);
  };

  const handleMessage = (lawyer) => {
    // Navigate to chat with this lawyer
    navigate(`/chat/${lawyer.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Lawyer</h1>
          <p className="mt-2 text-gray-600">Connect with verified legal professionals in Kenya</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lawyers or specializations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <span className="text-sm">
                {filteredLawyers.length} {filteredLawyers.length === 1 ? 'lawyer' : 'lawyers'} found
              </span>
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} type="lawyer-card" />
            ))}
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map(lawyer => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onBookNow={handleBookNow}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
