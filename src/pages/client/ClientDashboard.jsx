import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Loader, Upload } from 'lucide-react';
import clientService from '../../services/client.service';
import RatingModal from '../../components/domain/RatingModal';
import DocumentsTab from '../../components/domain/DocumentsTab';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingTab, setBookingTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, orderId: null, lawyerName: '' });

  const itemsPerPage = 10;

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await clientService.getMyBookings();
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filterBookings = (bookings, tab) => tab === 'all' ? bookings : bookings.filter(b => b.status === tab);
  const filteredBookings = filterBookings(bookings, bookingTab);

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
  ];

  const handleRateService = (booking) => {
  setRatingModal({
    isOpen: true,
    orderId: booking.id,
    lawyerId: booking.lawyer_id, 
    lawyerName: booking.lawyer_name
  });
};

  const handleRatingModalClose = () => {
    setRatingModal({
      isOpen: false,
      orderId: null,
      lawyerName: ''
    });
  };

  const handleReviewSubmitted = (reviewData) => {
    // Update the booking status or refresh data if needed
    console.log('Review submitted:', reviewData);
    // You could refresh the bookings data here if needed
  };

  // Pagination logic
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your legal service bookings and orders</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-700">Welcome back, {user?.name || 'Client'}</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Loader className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Documents
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'bookings' && (
          <>
            {/* Booking Status Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setBookingTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        bookingTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-lg shadow">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {bookingTab === 'all' ? "You haven't booked any legal consultations yet" : `No ${bookingTab.replace('_', ' ')} bookings`}
                  </h3>
                  <p className="text-gray-600">
                    {bookingTab === 'all'
                      ? 'When you book legal services, they will appear here.'
                      : `You don't have any ${bookingTab.replace('_', ' ')} bookings at the moment.`
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(booking.status)}
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {booking.service_name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {booking.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              Lawyer: {booking.lawyer_name}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Booked: {formatDate(booking.created_at)}
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 flex flex-col items-end space-y-2">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Service Fee</p>
                            <p className="text-lg font-semibold text-gray-900">
                              KES {booking.base_price?.toLocaleString() || 'TBD'}
                            </p>
                          </div>

                          {booking.status === 'completed' && (
                            <button
                              onClick={() => handleRateService(booking)}
                              className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Rate Service
                            </button>
                          )}

                          {booking.status === 'in_progress' && (
                            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                              Message Lawyer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredBookings.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'documents' && (
          <DocumentsTab bookingId={null} />
        )}

        {/* Rating Modal */}
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={handleRatingModalClose}
          orderId={ratingModal.orderId}
          lawyerName={ratingModal.lawyerName}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;
