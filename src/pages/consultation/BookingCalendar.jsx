import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, Shield, Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const BookingCalendar = () => {
  const { advocateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get advocate data from navigation state or use default
  const advocateFromState = location.state?.advocate;
  
  const [advocate, setAdvocate] = useState(advocateFromState || {
    id: advocateId,
    name: 'Advocate Sarah Kamau',
    specialization: 'Corporate Law Specialist',
    lskNumber: 'P105/9876',
    location: 'Nairobi, Kenya',
    rating: 4.9,
    reviews: 120,
    price: 'KES 3,500',
    image: 'https://ui-avatars.com/api/?name=Sarah+Kamau&background=1E40AF&color=fff&size=150'
  });

  const [selectedDate, setSelectedDate] = useState(new Date('2023-10-05'));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [consultationType, setConsultationType] = useState('video');
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date('2023-10-01'));

  // Mock time slots (in a real app, these would come from the API)
  const mockSlots = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: true, popular: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: false },
    { time: '01:00 PM', available: true },
    { time: '01:30 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: true },
    { time: '03:00 PM', available: true },
  ];

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      // In a real app, call the API:
      // const response = await api.get(`/api/documents/advocates/${advocateId}/availability?date=${selectedDate.toISOString()}`);
      // setAvailableSlots(response.data.slots);
      
      // For now, use mock data
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots(mockSlots);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleContinue = () => {
    if (selectedSlot) {
      navigate('/consultation/checkout', {
        state: {
          advocate,
          date: selectedDate,
          slot: selectedSlot,
          consultationType
        }
      });
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const renderCalendar = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
      const isSelected = isValidDay && 
        currentDate.getDate() === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <button
          key={i}
          onClick={() => isValidDay && setSelectedDate(currentDate)}
          disabled={!isValidDay}
          className={`h-12 rounded-lg font-medium transition ${
            isSelected
              ? 'bg-blue-600 text-white'
              : isValidDay
              ? 'hover:bg-gray-100 text-gray-900'
              : 'text-transparent cursor-default'
          }`}
        >
          {isValidDay ? dayNumber : ''}
        </button>
      );
    }

    return days;
  };

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button onClick={() => navigate('/advocates')} className="hover:text-blue-600">Select Lawyer</button>
              <ChevronRight size={16} />
              <span className="text-blue-600 font-semibold">Schedule Consultation</span>
              <ChevronRight size={16} />
              <span className="text-gray-400">Payment</span>
              <ChevronRight size={16} />
              <span className="text-gray-400">Confirmation</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Advocate Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              {/* Advocate Photo */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={advocate.image}
                    alt={advocate.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Advocate Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{advocate.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Shield size={14} className="text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">LSK Verified {advocate.lskNumber}</span>
                </div>
                <p className="text-gray-600 mb-3">{advocate.specialization}</p>
                <p className="text-sm text-gray-500">{advocate.location}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="font-semibold">{advocate.rating}</span>
                  <span className="text-gray-500 text-sm">({advocate.reviews} reviews)</span>
                </div>
              </div>

              {/* Fee */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="text-2xl font-bold text-blue-600">{advocate.price}</span>
                </div>
                <p className="text-sm text-gray-500">/30 min</p>
              </div>

              {/* Consultation Type */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Consultation Type</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConsultationType('video')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition ${
                      consultationType === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Video size={18} />
                    <span className="font-medium">Video Call</span>
                  </button>
                  <button
                    onClick={() => setConsultationType('audio')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition ${
                      consultationType === 'audio'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Phone size={18} />
                    <span className="font-medium">Audio Call</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <Shield size={14} className="mt-0.5 flex-shrink-0" />
                  <span>Video link will be sent via email after booking</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar & Time Slots */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Date & Time</h2>
              <p className="text-gray-600 mb-8">Choose a slot for your 30-minute consultation.</p>

              {/* Calendar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{monthName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>
              </div>

              {/* Selected Date Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-600 uppercase tracking-wider">{formatSelectedDate().split(',')[0]}, {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.available}
                      className={`py-3 px-4 rounded-lg font-medium transition ${
                        selectedSlot?.time === slot.time
                          ? 'bg-blue-600 text-white'
                          : slot.available
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone Note */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Clock size={16} />
                <span>Times are shown in East Africa Time (EAT)</span>
              </div>

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 rounded-lg p-3">
                        <Calendar size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Selected Slot</p>
                        <p className="font-bold text-gray-900">{formatSelectedDate().split(',').slice(0, 2).join(',')} at {selectedSlot.time}</p>
                        <p className="text-sm text-blue-600 capitalize">{consultationType} Call</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedSlot}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition ${
                  selectedSlot
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Payment
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
