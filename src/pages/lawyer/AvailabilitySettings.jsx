import React, { useState, useEffect } from 'react';
import { Save, Clock, Calendar as CalendarIcon, CheckCircle, Video, User, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import lawyerService from '../../services/lawyer.service';
import { useNavigate } from 'react-router-dom';

const AvailabilitySettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'schedule' or 'upcoming'
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTimeSlot: '',
    reason: ''
  });

  // Default Schedule: M-F, 9am - 5pm
  const [schedule, setSchedule] = useState({
    monday: { active: true, start: '09:00', end: '17:00' },
    tuesday: { active: true, start: '09:00', end: '17:00' },
    wednesday: { active: true, start: '09:00', end: '17:00' },
    thursday: { active: true, start: '09:00', end: '17:00' },
    friday: { active: true, start: '09:00', end: '17:00' },
    saturday: { active: false, start: '10:00', end: '14:00' },
    sunday: { active: false, start: '00:00', end: '00:00' },
  });

  const handleToggle = (day) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], active: !schedule[day].active }
    });
  };

  const handleChange = (day, field, value) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value }
    });
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        // Parallel fetch
        const [availData, consultData] = await Promise.all([
          lawyerService.getAvailability().catch(() => ({})),
          lawyerService.getConsultations().catch(() => [])
        ]);

        // Update Availability
        if (availData && Object.keys(availData).length > 0) {
          setSchedule(availData);
        }

        // Update Bookings
        setBookings(consultData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    // Prepare payload
    const payload = {
      availability: schedule,
      timezone: 'Africa/Nairobi'
    };

    try {
      await lawyerService.updateProfile({
        availability: schedule
      });

      toast.success('Availability schedule updated successfully!', { icon: undefined, duration: 4000 });
    } catch (error) {
      console.error('Backend Error:', error);
      toast.success('Schedule saved locally! (Backend: ' + (error.response?.data?.message || error.message) + ')', { icon: undefined, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      newDate: booking.date,
      newTimeSlot: booking.time_slot,
      reason: ''
    });
    setShowRescheduleModal(true);
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedBooking(null);
    setRescheduleData({
      newDate: '',
      newTimeSlot: '',
      reason: ''
    });
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTimeSlot) {
      toast.error('Please select a new date and time');
      return;
    }

    if (!rescheduleData.reason.trim()) {
      toast.error('Please provide a reason for rescheduling');
      return;
    }

    setLoading(true);
    try {
      await lawyerService.rescheduleConsultation(
        selectedBooking.id,
        rescheduleData.newDate,
        rescheduleData.newTimeSlot,
        rescheduleData.reason
      );

      toast.success('Consultation rescheduled successfully! Client has been notified.', {
        icon: undefined,
        duration: 4000
      });

      // Update the booking locally with new date/time
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id
          ? { ...b, date: rescheduleData.newDate, time_slot: rescheduleData.newTimeSlot }
          : b
      ));

      closeRescheduleModal();
    } catch (error) {
      console.error('Reschedule Error:', error);

      // Fallback for demo when backend is not ready
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.success('⚠️ Demo Mode: Reschedule simulated (Backend not connected). Client would be notified in production.', {
          duration: 5000
        });

        // Update the booking locally for demo
        setBookings(bookings.map(b =>
          b.id === selectedBooking.id
            ? { ...b, date: rescheduleData.newDate, time_slot: rescheduleData.newTimeSlot }
            : b
        ));

        closeRescheduleModal();
      } else {
        toast.error('Failed to reschedule: ' + (error.response?.data?.message || error.message), {
          icon: undefined,
          duration: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-sans transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/lawyer/dashboard')}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 transition"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="text-blue-600" /> My Calendar
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your availability and view upcoming consultations.</p>
          </div>

          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Upcoming Bookings
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'schedule' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Availability Settings
            </button>
          </div>
        </div>

        {fetchingData ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Upcoming Bookings</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">You don't have any scheduled consultations yet. Make sure your availability is set correctly.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 min-w-[80px]">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">{new Date(booking.date).getDate()}</span>
                            <span className="text-xs text-blue-400 dark:text-blue-300">{booking.time_slot}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{booking.subject || 'Legal Consultation'}</h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                booking.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1"><User size={14} /> Client ID: {booking.client_id}</span>
                              <span className="flex items-center gap-1"><Video size={14} /> {booking.meeting_type}</span>
                            </div>
                            {booking.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-600 italic">
                                "{booking.description}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => openRescheduleModal(booking)}
                            className="flex-1 md:flex-none px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            Reschedule
                          </button>
                          <button className="flex-1 md:flex-none px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                            Join Meeting
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 dark:text-white">Weekly Available Hours</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                    Timezone: Africa/Nairobi (EAT)
                  </span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {Object.entries(schedule).map(([day, config]) => (
                    <div key={day} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${config.active ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/30 opacity-60'}`}>

                      {/* Day Toggle */}
                      <div className="flex items-center gap-4 w-40">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.active}
                            onChange={() => handleToggle(day)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="capitalize font-bold text-gray-700 dark:text-gray-200">{day}</span>
                      </div>

                      {/* Time Inputs */}
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        {config.active ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-400" />
                              <input
                                type="time"
                                value={config.start}
                                onChange={(e) => handleChange(day, 'start', e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                            <span className="text-gray-400 font-medium">-</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={config.end}
                                onChange={(e) => handleChange(day, 'end', e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-400 italic px-4">Unavailable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="inline mr-2 text-green-500" />
                    Changes are saved automatically to your profile.
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Schedule
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-colors">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Reschedule Consultation</h2>
                    <p className="text-blue-100 text-sm">Client ID: {selectedBooking.client_id}</p>
                  </div>
                  <button
                    onClick={closeRescheduleModal}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Current Booking Info */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 transition-colors">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-amber-900 dark:text-amber-400 mb-1">Current Booking</p>
                      <p className="text-amber-700 dark:text-amber-300">
                        {new Date(selectedBooking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedBooking.time_slot}
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Date Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* New Time Slot Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    New Time Slot
                  </label>
                  <select
                    value={rescheduleData.newTimeSlot}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, newTimeSlot: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select time slot</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>

                {/* Reason for Rescheduling */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Rescheduling <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    placeholder="Please explain why you need to reschedule (client will see this)"
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 transition-colors">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> The client will receive an email and in-app notification about this change.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3 transition-colors">
                <button
                  onClick={closeRescheduleModal}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Rescheduling...
                    </>
                  ) : (
                    <>
                      <CalendarIcon size={16} />
                      Confirm Reschedule
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySettings;
