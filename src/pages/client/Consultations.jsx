import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Video, Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Consultations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockConsultations = [
        {
          id: 1,
          advocateName: 'Adv. Sarah Mwangi',
          advocateImage: 'https://ui-avatars.com/api/?name=Sarah+Mwangi&background=1E40AF&color=fff',
          service: 'Property Dispute Consultation',
          date: '2026-03-02',
          time: '14:00',
          duration: '30 minutes',
          status: 'upcoming',
          meetingLink: '/chat?consultation=1',
          location: 'Video Call',
          amount: 5000,
          notes: 'Property boundary dispute with neighbor'
        },
        {
          id: 2,
          advocateName: 'Adv. David Kiprop',
          advocateImage: 'https://ui-avatars.com/api/?name=David+Kiprop&background=1E40AF&color=fff',
          service: 'Business Contract Review',
          date: '2026-02-28',
          time: '10:00',
          duration: '45 minutes',
          status: 'completed',
          meetingLink: null,
          location: 'Video Call',
          amount: 4500,
          notes: 'Partnership agreement review'
        },
        {
          id: 3,
          advocateName: 'Adv. Grace Wanjiku',
          advocateImage: 'https://ui-avatars.com/api/?name=Grace+Wanjiku&background=1E40AF&color=fff',
          service: 'Family Law Consultation',
          date: '2026-03-05',
          time: '16:00',
          duration: '60 minutes',
          status: 'upcoming',
          meetingLink: '/chat?consultation=3',
          location: 'Video Call',
          amount: 4000,
          notes: 'Child custody arrangement discussion'
        }
      ];
      setConsultations(mockConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (filter === 'all') return true;
    return consultation.status === filter;
  });

  const upcomingCount = consultations.filter(c => c.status === 'upcoming').length;
  const completedCount = consultations.filter(c => c.status === 'completed').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
              <p className="text-gray-600 mt-1">Manage your legal consultations and video meetings</p>
            </div>
            <button
              onClick={() => navigate('/advocates')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <Video className="w-5 h-5" />
              Book New Consultation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Consultations</p>
                  <h3 className="text-3xl font-bold text-gray-900">{consultations.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Upcoming</p>
                  <h3 className="text-3xl font-bold text-gray-900">{upcomingCount}</h3>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                  <h3 className="text-3xl font-bold text-gray-900">{completedCount}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Consultations
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Consultations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading consultations...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultations Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't booked any consultations yet."
                : filter === 'upcoming'
                ? "You have no upcoming consultations."
                : "You have no past consultations."}
            </p>
            <button
              onClick={() => navigate('/advocates')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Book Your First Consultation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={consultation.advocateImage}
                      alt={consultation.advocateName}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {consultation.service}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1 mb-2">
                        <User className="w-4 h-4" />
                        {consultation.advocateName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(consultation.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {consultation.time} ({consultation.duration})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {consultation.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(consultation.status)}`}>
                    {getStatusIcon(consultation.status)}
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                  </span>
                </div>

                {consultation.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Notes:</span> {consultation.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-lg font-bold text-gray-900">
                    KES {consultation.amount.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-3">
                    {consultation.status === 'upcoming' && consultation.meetingLink && (
                      <button
                        onClick={() => navigate(consultation.meetingLink)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </button>
                    )}
                    {consultation.status === 'completed' && (
                      <button
                        onClick={() => navigate('/advocates')}
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        Book Again
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;
