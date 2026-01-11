import React from 'react';

export default function RecentActivityTable({ activities }) {
  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div>
              <p className="font-semibold text-sm text-gray-900">{activity.action.replace(/_/g, ' ').toUpperCase()}</p>
              <p className="text-gray-600 text-xs mt-1">{activity.user} • {activity.timestamp}</p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                activity.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : activity.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {activity.type}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
