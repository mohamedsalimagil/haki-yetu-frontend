import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

const BookingForm = ({ onBookingSubmit, loading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }
    // Pass data back to parent
    onBookingSubmit({ date, time });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mt-6">
      <h3 className="font-bold text-gray-900 mb-4">Book an Appointment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Disable past dates
              required
            />
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Choose a slot...</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
        >
          {loading ? 'Checking Availability...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;