import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Video, Timer, Grid, Download } from 'lucide-react';

const ConsultationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {
    bookingRef: 'HK-2023-8492',
    advocateName: 'Sarah Kamau',
    specialty: 'Corporate Law Specialist',
    rating: 4.9,
    reviews: 124,
    date: 'Thursday, Oct 24, 2023',
    time: '10:00AM-11:00 AM',
    timeZone: 'EAT',
    format: 'Video Consultation',
    duration: '60 Minutes',
    amount: 3500,
    email: 'daniel.otieno@example.com'
  };

  const handleAddToCalendar = () => {
    alert('Calendar event would be created');
  };

  const handleDownloadReceipt = () => {
    alert('Receipt download would start');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/find-lawyer" className="text-gray-600 hover:text-gray-900">Find a Lawyer</a>
              <a href="/my-documents" className="text-gray-600 hover:text-gray-900">My Documents</a>
              <a href="/help" className="text-gray-600 hover:text-gray-900">Help</a>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Consultation Confirmed!
        </h1>
        <p className="text-gray-600 text-center mb-2">
          Your appointment has been successfully scheduled. A confirmation email with the joining link has been sent to{' '}
          <span className="font-medium">{bookingData.email}</span>.
        </p>

        {/* Booking Reference */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm text-gray-500 uppercase">Booking Ref:</span>
          <span className="text-lg font-bold text-blue-600">{bookingData.bookingRef}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Advocate Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bookingData.advocateName)}&background=2563eb&color=fff&size=128`}
                  alt={bookingData.advocateName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{bookingData.advocateName}</h3>
                <p className="text-gray-600">{bookingData.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">{bookingData.rating}</span>
                  <span className="text-sm text-gray-500">({bookingData.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full mb-2">
                <CheckCircle className="w-3 h-3" />
                PAYMENT SUCCESSFUL
              </div>
              <p className="text-3xl font-bold text-gray-900">KES {bookingData.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Session Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Time */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Session Time</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.date}</p>
                    <p className="text-xs text-gray-500">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.time} <span className="text-gray-500">{bookingData.timeZone}</span></p>
                    <p className="text-xs text-gray-500">Time (East Africa Time)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Format */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Session Format</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.format}</p>
                    <p className="text-xs text-gray-500">Via Haki Yetu Secure Meet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Timer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.duration}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-blue-600 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-3">WHAT HAPPENS NEXT?</h3>
              <ol className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="font-semibold">1</span>
                  <span>Please join the call 5 minutes early to test your audio and video.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="font-semibold">2</span>
                  <span>Ensure you have a stable internet connection for the duration of the session.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="font-semibold">3</span>
                  <span>Upload any relevant documents (contracts, ID, letters) to "My Documents" before the session starts.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Grid className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            <Calendar className="w-5 h-5" />
            Add to Calendar
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need to reschedule?{' '}
            <button onClick={() => navigate('/bookings/manage')} className="text-blue-600 hover:text-blue-700 font-medium">
              Manage Booking
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2023 Haki Yetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ConsultationSuccess;
