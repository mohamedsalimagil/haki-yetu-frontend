import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import DataTable from '../../components/domain/admin/DataTable';

export default function DisputeResolution() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllDisputes();
      setDisputes(response.disputes || []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!resolution.trim()) {
      alert('Please enter a resolution');
      return;
    }

    try {
      setResolving(true);
      await adminService.resolveDispute(selectedDispute.id, {
        resolution,
        resolutionType: 'admin_decision',
      });
      fetchDisputes();
      setSelectedDispute(null);
      setResolution('');
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      alert('Error resolving dispute');
    } finally {
      setResolving(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Dispute ID', width: '12%' },
    { key: 'order_id', label: 'Order ID', width: '12%' },
    { key: 'client_id', label: 'Client', width: '20%' },
    { key: 'lawyer_id', label: 'Lawyer', width: '20%' },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${value === 'open'
            ? 'bg-red-100 text-red-800'
            : value === 'in_progress'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'created_at', label: 'Opened', width: '15%' },
    {
      key: 'action',
      label: 'Action',
      width: '6%',
      render: (_, dispute) => (
        <button
          onClick={() => setSelectedDispute(dispute)}
          className="text-primary hover:underline text-sm font-semibold"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle size={32} className="text-secondary" />
          Dispute Resolution
        </h1>
        <p className="text-gray-600 mt-1">Manage and resolve customer disputes</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading disputes...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={disputes} />
      )}

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Dispute Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Dispute ID</p>
                <p className="text-gray-900 font-semibold mt-1">{selectedDispute.id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                <p className={`font-semibold mt-1 capitalize ${selectedDispute.status === 'open' ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedDispute.status}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Client ID</p>
                <p className="text-gray-900 font-semibold mt-1">{selectedDispute.client_id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Lawyer ID</p>
                <p className="text-gray-900 font-semibold mt-1">{selectedDispute.lawyer_id}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Title</p>
              <p className="bg-gray-50 p-4 rounded-lg text-gray-900">{selectedDispute.title}</p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Description</p>
              <p className="bg-gray-50 p-4 rounded-lg text-gray-900 whitespace-pre-wrap">{selectedDispute.description}</p>
            </div>

            {selectedDispute.status === 'open' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Resolution
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Enter your resolution decision..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="4"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedDispute(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
              {selectedDispute.status === 'open' && (
                <button
                  onClick={handleResolveDispute}
                  disabled={resolving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-50"
                >
                  {resolving ? 'Resolving...' : 'Resolve Dispute'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
