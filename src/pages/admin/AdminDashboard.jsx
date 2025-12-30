import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertCircle, Users, CheckCircle } from 'lucide-react';
import adminService from '../../services/admin.service';
import StatCard from '../../components/domain/admin/StatCard';
import RecentActivityTable from '../../components/domain/admin/RecentActivityTable';
import QuickActionCard from '../../components/domain/admin/QuickActionCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(10),
        ]);
        setStats(statsRes);
        setRecentActivity(activityRes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin</h1>
        <p className="text-gray-600 mt-2">System Overview & Quick Actions</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`KES ${stats.total_revenue?.toLocaleString() || '0'}`}
            change="+12%"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Users"
            value={stats.total_users?.total || stats.total_users || '0'}
            change="+8%"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pending_verifications || '0'}
            change="3 new"
            icon={<AlertCircle className="w-6 h-6" />}
            color="yellow"
            status="warning"
          />
          <StatCard
            title="Active Lawyers"
            value={stats.active_lawyers || '0'}
            change="+5%"
            icon={<CheckCircle className="w-6 h-6" />}
            color="blue"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Review Applications"
          description="12 pending lawyer approvals"
          action="Review"
          link="/admin/approvals"
          icon="✅"
        />
        <QuickActionCard
          title="Manage Disputes"
          description="5 active disputes requiring attention"
          action="Resolve"
          link="/admin/disputes"
          icon="⚠️"
        />
        <QuickActionCard
          title="System Logs"
          description="View activity & security logs"
          action="View Logs"
          link="/admin/logs"
          icon="📝"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <Link to="/admin/logs" className="text-primary hover:text-blue-700 text-sm font-semibold">
            View All →
          </Link>
        </div>
        <RecentActivityTable activities={recentActivity} />
      </div>
    </div>
  );
}
