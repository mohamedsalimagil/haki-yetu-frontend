import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/admin.service';

export default function PendingApprovals() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingLawyerApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    if (!window.confirm('Approve this lawyer application?')) return;

    try {
      setProcessLoading(true);
      await adminService.approveLawyerApplication(applicationId);
      // Refresh list
      fetchApplications();
      // Close modal
      setSelectedApp(null);
    } catch (error) {
      console.error('Failed to approve application:', error);
      alert('Error approving application');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleReject = async (applicationId) => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    if (!window.confirm('Reject this lawyer application?')) return;

    try {
      setProcessLoading(true);
      await adminService.rejectLawyerApplication(applicationId, {
        reason: rejectionReason,
      });
      // Refresh list
      fetchApplications();
      // Close modal & reset state
      setSelectedApp(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject application:', error);
      alert('Error rejecting application');
    } finally {
      setProcessLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Applications</h1>
        <p className="text-gray-600 mt-1">Review and approve pending lawyer registrations</p>
      </div>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No pending applications</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{app.lawyerName}</h3>
                  <p className="text-gray-600 text-sm mt-1">{app.email}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold uppercase">LSK Number</p>
                      <p className="text-gray-900 font-medium mt-1">{app.lskNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold uppercase">Specialization</p>
                      <p className="text-gray-900 font-medium mt-1">{app.specialization}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition font-medium ml-4 flex-shrink-0"
                >
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedApp.lawyerName}</h3>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Email</p>
                <p className="text-gray-900 font-medium mt-1">{selectedApp.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">LSK Number</p>
                <p className="text-gray-900 font-medium mt-1">{selectedApp.lskNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Specialization</p>
                <p className="text-gray-900 font-medium mt-1">{selectedApp.specialization}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold uppercase">Bio</p>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedApp.bio}</p>
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why rejecting (optional)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
              {selectedApp.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={processLoading}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    <XCircle size={18} className="mr-2" />
                    {processLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    disabled={processLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    {processLoading ? 'Processing...' : 'Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}