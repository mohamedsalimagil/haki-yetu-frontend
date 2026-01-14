import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Star, MapPin, Calendar, MessageCircle, Phone, Award, Search, Filter, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import BackButton from '../../components/common/BackButton';
import Footer from '../../components/layout/Footer';

const AdvocateDirectory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const specializations = [
    'All',
    'Corporate Law',
    'Family Law',
    'Property Law',
    'Criminal Law',
    'Employment Law',
    'Tax Law',
    'Immigration Law'
  ];

  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await api.get('/documents/advocates');
        // Map API response to match UI structure if needed, or ensure API returns compatible data
        const mappedAdvocates = response.data.advocates.map(adv => ({
          id: adv.id,
          name: adv.name,
          specialization: adv.specialization || 'General Practice',
          lskNumber: adv.lsk_number || 'Pending',
          experience: `${adv.experience_years || 0} years`,
          location: 'Nairobi', // Default or fetch if available
          rating: adv.rating || 5.0,
          reviews: 0, // Placeholder
          languages: ['English', 'Swahili'],
          price: `KES ${adv.consultation_fee || 3000}/session`,
          availability: 'Available Today',
          verified: true,
          image: adv.avatar_url || adv.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(adv.name)}&background=1E40AF&color=fff&size=150`
        }));
        setAdvocates(mappedAdvocates);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        toast.error("Failed to load advocates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const filteredAdvocates = advocates.filter(advocate => {
    const matchesSearch = advocate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advocate.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advocate.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || advocate.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 font-sans transition-colors">


      {/* Back Button */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4 px-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <BackButton to="/services" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Legal Advocate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with verified Kenyan lawyers specializing in your area of need. All advocates are registered with the Law Society of Kenya.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent appearance-none transition-colors"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>All advocates verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span>LSK Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>{advocates.length} advocates available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Advocates Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAdvocates.map((advocate) => (
              <div key={advocate.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <img
                      src={advocate.image}
                      alt={advocate.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{advocate.name}</h3>
                        {advocate.verified && (
                          <Shield className="h-4 w-4 text-green-500" title="Verified LSK Member" />
                        )}
                      </div>
                      <p className="text-[#1E40AF] dark:text-blue-400 font-medium mb-1">{advocate.specialization}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{advocate.lskNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{advocate.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white">{advocate.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({advocate.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{advocate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{advocate.availability}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {advocate.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#1E40AF] dark:text-blue-400">{advocate.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!user) {
                            navigate('/login');
                            return;
                          }
                          if (user.role === 'client' && user.verification_status !== 'verified') {
                            toast.error('This service will be available once you are verified.');
                            return;
                          }
                          navigate(`/consultation/book/${advocate.id}`, { state: { advocate } });
                        }}
                        className="flex-1 bg-[#1E40AF] hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Book Consultation
                      </button>
                      <button className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdvocates.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No advocates found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or browse all specializations.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialization('All');
                }}
                className="mt-4 bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>



      {/* CTA Section */}


      <Footer />
    </div>
  );
};

export default AdvocateDirectory;
