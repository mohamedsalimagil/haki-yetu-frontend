import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import lawyerService from '../../services/lawyer.service';
import api from '../../services/api'; // Standard API for direct calls
import { useAuth } from '../../context/AuthContext';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [availability, setAvailability] = useState([]); // New state for slots
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailability(); // Fetch Day 4 slots
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get('/lawyer/availability');
      setAvailability(res.data.availability);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    // Fetch both bookings (orders) and professional availability slots
    const [ordersRes, availabilityRes] = await Promise.all([
      lawyerService.getOrders(),
      api.get('/lawyer/availability')
    ]);

    // 1. Map Orders to specific dates
    const orderEvents = ordersRes.map(order => ({
      title: `Booking: ${order.service_name}`,
      start: new Date(order.created_at),
      backgroundColor: getStatusColor(order.status),
    }));

    // 2. Map Weekly Availability to recurring calendar events
    const availabilityEvents = availabilityRes.data.availability.map(slot => ({
      daysOfWeek: [slot.day_of_week], // 0 for Sunday, 1 for Monday in FullCalendar
      startTime: slot.start_time,
      endTime: slot.end_time,
      display: 'background', // Shows as shaded background hours
      color: '#e8f5e9',      // Light green for available hours
    }));

    setEvents([...orderEvents, ...availabilityEvents]);
  } catch (err) {
    setError('Failed to load schedule');
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b'; 
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // ... (Keep handleEventClick and handleDateClick) ...

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your schedule and bookings</p>
          </div>
          <button 
            onClick={() => setShowAvailabilityForm(!showAvailabilityForm)}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            {showAvailabilityForm ? 'View Calendar' : 'Manage Availability'}
          </button>
        </div>

        {!showAvailabilityForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
            {/* ... FullCalendar Code ... */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recurring Weekly Availability</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availability.map(slot => (
                    <tr key={slot.id}>
                      <td className="px-6 py-4">{slot.day_name}</td>
                      <td className="px-6 py-4">{slot.start_time} - {slot.end_time}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Available</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;