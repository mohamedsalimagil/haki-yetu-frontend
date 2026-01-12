import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Upload, X, ArrowRight } from 'lucide-react';

const ReopenDispute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispute = location.state?.dispute || {
    id: 'KE-2023-892',
    ref: '#KE-2023-892',
    serviceType: 'Land Transfer Notarization',
    resolution: 'Resolved in favor of Advocate',
    resolutionDate: 'Oct 12, 2023',
    originalSubmission: 'Sep 28, 2023'
  };

  const [formData, setFormData] = useState({
    reason: '',
    newEvidence: []
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB'
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reopenId = `HY-DISP-${Math.floor(100 + Math.random() * 900)}`;
    navigate('/client/disputes/reopen-success', {
      state: {
        disputeId: reopenId,
        originalId: dispute.ref,
        status: 'Pending Review'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 6l3 1v13l-3-1V6zm14 13V6l3-1v13l-3 1zM8 6l4 1v13l-4-1V6z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">LegalKe</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/my-disputes" className="text-blue-600 font-medium">My Disputes</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Legal Help
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href="/my-disputes" className="hover:text-gray-900">My Disputes</a>
          <span>/</span>
          <span className="text-gray-900">Dispute #{dispute.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reopen Dispute #{dispute.id}
              </h1>
              <p className="text-gray-600">
                We are sorry to hear you are dissatisfied. Please provide details below.
              </p>
            </div>

            {/* Important Criteria */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Criteria for Reopening</h3>
                <p className="text-sm text-blue-800">
                  Only reopen if you have <span className="font-semibold">new evidence</span> or a procedure was missed.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Reason */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Why do you disagree with the resolution?
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Please be specific about overlooked facts.
                </p>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Explain clearly why the previous resolution was insufficient..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              {/* New Evidence */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Supporting Evidence (Optional)
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-blue-500 transition">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-3 mb-4">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      <label htmlFor="reopen-file-upload" className="text-blue-600 cursor-pointer hover:text-blue-700">
                        Upload a file
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                    <input
                      id="reopen-file-upload"
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/client/disputes/list')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Submit Reopening Request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Case Summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">CASE SUMMARY</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Original Dispute ID</p>
                  <p className="text-sm font-semibold text-gray-900">{dispute.ref}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Topic</p>
                  <p className="text-sm text-gray-900">{dispute.serviceType}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date Closed</p>
                  <p className="text-sm text-gray-900">{dispute.resolutionDate}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Previous Resolution</p>
                  <p className="text-sm px-3 py-1.5 bg-red-50 text-red-700 rounded-lg inline-block">
                    {dispute.resolution}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Need immediate assistance?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  If this is an emergency, contact support.
                </p>
                <button className="w-full text-blue-600 hover:bg-blue-50 border border-blue-600 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2">
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReopenDispute;
