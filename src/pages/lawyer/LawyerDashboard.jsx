import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import lawyerService from '../../services/lawyer.service';
import LawyerOfficesTab from '../../components/domain/LawyerOfficesTab';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, List } from 'lucide-react';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total_earnings: 0, pending_earnings: 0, paid_earnings: 0, transaction_count: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch both bookings (orders) and professional availability slots
      const [profile, orders, earnings] = await Promise.all([
        lawyerService.getProfile(),
        lawyerService.getOrders(),
        lawyerService.getEarningsSummary()
      ]);

      setStats(earnings);
      setHistory(earnings.history || []);

      const calendarEvents = orders.map(order => ({
        title: `Booking: ${order.service_name}`,
        start: new Date(order.created_at),
        backgroundColor: getStatusColor(order.status),
      }));

      setEvents(calendarEvents);
    } catch (err) {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    alert(`Booking: ${event.title}\nStatus: ${event.extendedProps.status}\nService: ${event.extendedProps.serviceName}`);
  };

  const handleDateClick = (info) => {
    alert(`Date clicked: ${info.dateStr}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your schedule and track earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <DollarSign className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-full" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">KES {stats.total_earnings?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="w-10 h-10 text-yellow-500 bg-yellow-50 p-2 rounded-full" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Payout</p>
                <p className="text-2xl font-bold text-gray-900">KES {stats.pending_earnings?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-full" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Payout</p>
                <p className="text-2xl font-bold text-gray-900">KES {stats.paid_earnings?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('calendar')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'calendar' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}><Calendar className="w-4 h-4 mr-2" /> Schedule</button>
              <button onClick={() => setActiveTab('transactions')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}><List className="w-4 h-4 mr-2" /> Transaction History</button>
              <button onClick={() => setActiveTab('offices')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'offices' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}><MapPin className="w-4 h-4 mr-2" /> Offices</button>
            </nav>
          </div>
        </div>

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-lg shadow p-6">
            <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }} initialView="dayGridMonth" events={events} eventClick={handleEventClick} dateClick={handleDateClick} height="auto" />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.length === 0 ? <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No transactions found.</td></tr> : history.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{tx.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES {tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{tx.status.toUpperCase()}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'offices' && <LawyerOfficesTab />}
      </div>
    </div>
  );
};

export default LawyerDashboard;
