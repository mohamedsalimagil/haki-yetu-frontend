import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import DataTable from '../../components/domain/admin/DataTable';
import Pagination from '../../components/common/Pagination';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;

    try {
      setActionLoading(true);
      await adminService.suspendUser(userId);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert('Error suspending user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setActionLoading(true);
      await adminService.activateUser(userId);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to activate user:', error);
      alert('Error activating user');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', width: '20%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'role', label: 'Role', width: '15%' },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Joined', width: '15%' },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (_, user) => (
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded transition">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
          <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-lg z-10 min-w-max border border-gray-200">
            <button
              onClick={() => setSelectedUser(user)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-b border-gray-100"
            >
              View Details
            </button>
            {user.status === 'active' && (
              <button
                onClick={() => handleSuspendUser(user.id)}
                className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                disabled={actionLoading}
              >
                Suspend
              </button>
            )}
            {user.status === 'suspended' && (
              <button
                onClick={() => handleActivateUser(user.id)}
                className="block w-full text-left px-4 py-2 hover:bg-green-50 text-green-600 text-sm"
                disabled={actionLoading}
              >
                Activate
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage platform users</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex gap-4 flex-wrap transition-colors">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={filteredUsers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Details</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{selectedUser.name}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Email</p>
                <p className="text-gray-900 dark:text-white font-medium break-all">{selectedUser.email}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Role</p>
                <p className="text-gray-900 dark:text-white font-medium capitalize">{selectedUser.role}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Status</p>
                <p className={`font-medium capitalize ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedUser.status}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Joined</p>
                <p className="text-gray-900 dark:text-white font-medium">{selectedUser.createdAt}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition font-medium"
              >
                Close
              </button>
              {selectedUser.status === 'active' && (
                <button
                  onClick={() => handleSuspendUser(selectedUser.id)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading ? <span className="animate-spin mr-2">⏳</span> : <Ban size={16} className="mr-2" />}
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
