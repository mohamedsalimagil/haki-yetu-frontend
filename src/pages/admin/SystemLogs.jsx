import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import adminService from '../../services/admin.service';
import DataTable from '../../components/domain/admin/DataTable';
import Pagination from '../../components/common/Pagination';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemLogs({
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setLogs(response.logs || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  const columns = [
    { key: 'action', label: 'Action', width: '20%' },
    { key: 'resource_type', label: 'Resource', width: '15%' },
    { key: 'resource_id', label: 'Resource ID', width: '12%' },
    { key: 'description', label: 'Description', width: '35%' },
    { key: 'created_at', label: 'Timestamp', width: '18%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-600 mt-1">Admin activity and system audit logs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        >
          <option value="all">All Actions</option>
          <option value="suspend_user">Suspend User</option>
          <option value="activate_user">Activate User</option>
          <option value="approve_lawyer">Approve Lawyer</option>
          <option value="reject_lawyer">Reject Lawyer</option>
          <option value="resolve_dispute">Resolve Dispute</option>
        </select>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading logs...</p>
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={filteredLogs} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
