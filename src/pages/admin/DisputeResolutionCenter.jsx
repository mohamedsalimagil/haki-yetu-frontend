import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, DollarSign, AlertTriangle, ChevronLeft } from 'lucide-react';
import { getAllDisputes, resolveDispute } from '../../services/adminService';

const DisputeResolutionCenter = () => {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchDisputes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDisputes();
      if (data && data.disputes) {
        setDisputes(data.disputes);
        if (data.disputes.length > 0 && !selectedCaseId) {
          setSelectedCaseId(data.disputes[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const selectedCase = disputes.find(d => d.id === selectedCaseId);

  const handleResolve = async () => {
    if (!selectedCase) return;
    const resolution = prompt("Enter resolution details:", "Resolved after review.");
    if (resolution) {
      try {
        await resolveDispute(selectedCase.id, { resolution });
        alert('Dispute resolved.');
        fetchDisputes();
      } catch (error) {
        console.error("Resolution failed:", error);
        alert('Failed to resolve dispute.');
      }
    }
  };


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted':
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Escalated':
        return 'bg-red-100 text-red-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter logic
  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d.id).includes(searchTerm);
    const matchesStatus = statusFilter === 'All Statuses' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-[calc(100vh-64px)] flex transition-colors">
      {/* Sidebar - LIST */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Disputes Queue</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Case ID, Client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Statuses</option>
            <option>Submitted</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading disputes...</div>
          ) : filteredDisputes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No disputes found.</div>
          ) : (
            filteredDisputes.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCaseId(caseItem.id)}
                className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${selectedCaseId === caseItem.id ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-blue-600">#{caseItem.id}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(caseItem.status)}`}>
                    {caseItem.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{caseItem.client_name} vs {caseItem.lawyer_name || 'System'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">{caseItem.title || 'Dispute'}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - DETAILS */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedCase ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case #{selectedCase.id}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date: {selectedCase.created_at ? new Date(selectedCase.created_at).toLocaleDateString() : 'N/A'} • {selectedCase.title}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedCase.status)}`}>
                {selectedCase.status}
              </span>
            </div>

            {/* Issue Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Issue Description</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedCase.description}</p>
              </div>
            </div>

            {/* Resolution Info (if resolved) */}
            {selectedCase.resolution && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Resolution</h3>
                <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg p-4 border border-green-100 dark:border-green-800">
                  <p className="text-sm">{selectedCase.resolution}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              {selectedCase.status !== 'Resolved' && (
                <button
                  onClick={handleResolve}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Resolve Dispute
                </button>
              )}

            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Select a dispute to view details.</div>
        )}
      </div>
    </div>
  );
};

export default DisputeResolutionCenter;
