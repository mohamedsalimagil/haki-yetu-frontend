import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Upload, X, Mail, Phone, MessageSquare, ChevronDown, Lock, Lightbulb } from 'lucide-react';

const DisputeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    resolutionMethod: 'email'
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const disputeCategories = [
    { value: 'service_delivery', label: 'Service Delivery Issue' },
    { value: 'payment', label: 'Payment Dispute' },
    { value: 'quality', label: 'Service Quality' },
    { value: 'communication', label: 'Communication Issue' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB'
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const disputeId = `#HY-2023-${Math.floor(1000 + Math.random() * 9000)}`;
    navigate('/client/support/confirmation', {
      state: {
        disputeId,
        category: disputeCategories.find(c => c.value === formData.category)?.label || 'General Dispute',
        dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <button onClick={() => navigate('/client/dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/client/support')} className="hover:text-blue-600 dark:hover:text-blue-400">My Cases</button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">File a Dispute</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tell Us About Your Dispute</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please provide as much detail as possible so our advocates can assist you effectively. Your information is secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors">
              {/* Dispute Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Dispute Category
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {disputeCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Describe the Incident */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Describe the Incident
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="I requested a notarization on [Date] but... (Please include dates, names, and specific details of what went wrong)"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>

              {/* Supporting Documents */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Supporting Documents
                </label>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                >
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    <label htmlFor="file-upload" className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300">
                      Click to upload
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG or DOCX (MAX. 10MB)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preferred Method of Resolution */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Preferred Method of Resolution
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'email', icon: Mail, label: 'Email', subtitle: 'Response in 24h' },
                    { value: 'phone', icon: Phone, label: 'Phone Call', subtitle: 'Schedulable' },
                    { value: 'chat', icon: MessageSquare, label: 'In-App Chat', subtitle: 'Live Support' }
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition ${formData.resolutionMethod === method.value
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <input
                          type="radio"
                          name="resolutionMethod"
                          value={method.value}
                          checked={formData.resolutionMethod === method.value}
                          onChange={(e) => setFormData({ ...formData, resolutionMethod: e.target.value })}
                          className="sr-only"
                        />
                        <Icon className={`w-6 h-6 mb-3 ${formData.resolutionMethod === method.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        <span className="font-semibold text-gray-900 dark:text-white mb-1">{method.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{method.subtitle}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Submit Dispute →
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Info Sidebar */}
          <div className="space-y-6">
            {/* Privacy Promise */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Privacy Promise</h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                At Haki Yetu, your legal matters are treated with the highest confidentiality. Your dispute details are encrypted (256-bit SSL) and only shared with the review board and the involved advocate.
              </p>

              <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                <Lock className="w-4 h-4" />
                <span className="font-medium">End-to-End Encrypted</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 p-6 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <h3 className="font-bold text-gray-900 dark:text-white">Tips for a Faster Resolution</h3>
              </div>

              <ul className="space-y-3">
                {[
                  { title: 'Be Specific:', desc: 'Mention dates, times, and specific document names (e.g., "Affidavit of Support").' },
                  { title: 'Attach Proof:', desc: 'Upload screenshots of conversations or copies of the erroneous documents.' },
                  { title: 'Stay Calm:', desc: 'Focus on facts. Our team is here to help mediate objectively.' }
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="bg-blue-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{tip.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{tip.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Urgent Help */}
            <div className="bg-blue-600 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold mb-2">NEED URGENT HELP?</h3>
              <p className="text-sm text-blue-100 mb-4">For emergencies, call our hotline</p>
              <a href="tel:+254700123456" className="text-2xl font-bold hover:text-blue-100 transition">
                +254 700 123 456
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
