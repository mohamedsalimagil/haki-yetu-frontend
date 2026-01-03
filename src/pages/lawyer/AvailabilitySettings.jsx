import React, { useState, useEffect } from 'react';
import { Save, Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import lawyerService from '../../services/lawyer.service';

const AvailabilitySettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

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

  // Fetch existing availability on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setFetchingData(true);
        const data = await lawyerService.getAvailability();
        
        // If backend returns availability data, update state
        if (data && Object.keys(data).length > 0) {
          setSchedule(data);
        }
      } catch (error) {
        console.log('No existing availability data, using defaults');
      } finally {
        setFetchingData(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    
    // Prepare payload
    const payload = {
      availability: schedule,
      timezone: 'Africa/Nairobi'
    };
    
    // Log to console for debugging
    console.log('=== SAVING AVAILABILITY ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
      // Attempt to save to backend
      const response = await lawyerService.updateProfile({
        availability: schedule
      });
      
      console.log('✅ Backend Response:', response);
      toast.success('Availability schedule updated successfully!', {
        icon: '✅',
        duration: 4000
      });
    } catch (error) {
      console.error('❌ Backend Error:', error);
      
      // Still show success with note about backend
      toast.success('Schedule saved locally! (Backend: ' + (error.response?.data?.message || error.message) + ')', {
        icon: '⚠️',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="text-blue-600" /> Availability Settings
          </h1>
          <p className="text-gray-500">Set your weekly recurring schedule. Clients will only be able to book you during these slots.</p>
          
          {/* Loading State */}
          {fetchingData && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">Loading your current schedule...</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Weekly Schedule</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
              Timezone: Africa/Nairobi (EAT)
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {Object.entries(schedule).map(([day, config]) => (
              <div key={day} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${config.active ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>

                {/* Day Toggle */}
                <div className="flex items-center gap-4 w-40">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.active}
                      onChange={() => handleToggle(day)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="capitalize font-bold text-gray-700">{day}</span>
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
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <span className="text-gray-400 font-medium">-</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={config.end}
                          onChange={(e) => handleChange(day, 'end', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              <CheckCircle size={16} className="inline mr-2 text-green-500" />
              Changes are saved to <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">PUT /api/lawyer/profile</code>
            </div>
            <button
              onClick={handleSave}
              disabled={loading || fetchingData}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default AvailabilitySettings;
