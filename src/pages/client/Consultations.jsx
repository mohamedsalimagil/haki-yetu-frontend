import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Video, Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle, Trash2, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import clientService from '../../services/client.service';
import BackButton from '../../components/common/BackButton';
import { toast } from 'react-hot-toast';

const Consultations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [cancelling, setCancelling] = useState(null); // Track which booking is being cancelled

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await clientService.getConsultations();
      // Map API response to component format
      const mappedConsultations = data.map(c => ({
        id: c.id,
        lawyerId: c.lawyer_id,
        advocateName: c.lawyer_name || 'Lawyer',
        advocateImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.lawyer_name || 'L')}&background=1E40AF&color=fff`,
        service: c.subject || c.service_type || 'Legal Consultation',
        date: c.date,
        time: c.time_slot || c.time,
        duration: '30 minutes',
        status: (c.status || '').toLowerCase(),
        meetingLink: `https://meet.jit.si/HakiYetu-${c.id}-${user.id}`, // Always use Jitsi, ignore DB value
        location: c.meeting_type === 'online' ? 'Video Call' : 'In Person',
        amount: c.amount || 3000,
        notes: c.description
      }));
      setConsultations(mappedConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (consultationId) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;

    try {
      setCancelling(consultationId);
      await clientService.cancelConsultation(consultationId);
      toast.success('Consultation cancelled successfully');
      // Update local state
      setConsultations(prev => prev.map(c =>
        c.id === consultationId ? { ...c, status: 'cancelled' } : c
      ));
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel consultation');
    } finally {
      setCancelling(null);
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
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <BackButton className="mb-6" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Consultations</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your legal consultations and video meetings</p>
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Consultations</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{consultations.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Upcoming</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{upcomingCount}</h3>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{completedCount}</h3>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors">
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              All Consultations
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading consultations...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
            <Video className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Consultations Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={consultation.advocateImage}
                      alt={consultation.advocateName}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {consultation.service}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-2">
                        <User className="w-4 h-4" />
                        {consultation.advocateName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Notes:</span> {consultation.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    KES {consultation.amount.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-3">
                    {(consultation.status === 'upcoming' || consultation.status === 'pending' || consultation.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(consultation.id)}
                        disabled={cancelling === consultation.id}
                        className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {cancelling === consultation.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Cancel
                      </button>
                    )}
                    {(consultation.status === 'upcoming' || consultation.status === 'confirmed') && consultation.meetingLink && (
                      <button
                        onClick={() => window.open(consultation.meetingLink, '_blank', 'noreferrer')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </button>
                    )}
                    {consultation.status === 'completed' && (
                      <button
                        onClick={() => navigate('/advocates')}
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium"
                      >
                        Book Again
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/client/messages', { state: { partnerId: consultation.lawyerId, partnerName: consultation.advocateName } })}
                      className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition font-medium flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message Lawyer
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
