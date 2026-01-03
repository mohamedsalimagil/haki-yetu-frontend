import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Upload, X, Mail, Phone, MessageSquare, Lock, ChevronDown } from 'lucide-react';
import { disputeCategories } from '../../../data/mockDisputes';

const DisputeForm = () => {
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a random dispute ID
    const disputeId = `HY-2023-${Math.floor(1000 + Math.random() * 9000)}`;
    navigate('/client/disputes/success', { 
      state: { 
        disputeId,
        category: disputeCategories.find(c => c.value === formData.category)?.label || 'General Dispute',
        dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } 
    });
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Haki Yetu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/home" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/services" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="/my-cases" className="text-gray-600 hover:text-gray-900">My Cases</a>
              <a href="/support" className="text-blue-600 font-medium">Support</a>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">Juma Kamau</span>
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Juma+Kamau&background=ec4899&color=fff" 
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/home" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href="/my-cases" className="hover:text-gray-900">My Cases</a>
          <span>/</span>
          <span className="text-gray-900">File a Dispute</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Your Dispute</h1>
          <p className="text-gray-600">
            Please provide as much detail as possible so our advocates can assist you effectively. Your information is secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Dispute Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dispute Category
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {disputeCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Describe the Incident */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Describe the Incident
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="I requested a notarization on [Date] but... (Please include dates, names, and specific details of what went wrong)"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              {/* Supporting Documents */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Supporting Documents
                </label>
                
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-3 mb-4">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      <label htmlFor="file-upload" className="text-blue-600 cursor-pointer hover:text-blue-700">
                        Click to upload
                      </label>
                      {' '}or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
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
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-100 p-1 rounded">
                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
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

              {/* Preferred Method of Resolution */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Preferred Method of Resolution
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition ${
                    formData.resolutionMethod === 'email'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="resolutionMethod"
                      value="email"
                      checked={formData.resolutionMethod === 'email'}
                      onChange={(e) => setFormData({ ...formData, resolutionMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`rounded-lg p-3 mb-3 ${
                      formData.resolutionMethod === 'email' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Mail className={`w-6 h-6 ${
                        formData.resolutionMethod === 'email' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-gray-900 mb-1">Email</span>
                    <span className="text-xs text-gray-500">Response in 24h</span>
                  </label>

                  <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition ${
                    formData.resolutionMethod === 'phone'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="resolutionMethod"
                      value="phone"
                      checked={formData.resolutionMethod === 'phone'}
                      onChange={(e) => setFormData({ ...formData, resolutionMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`rounded-lg p-3 mb-3 ${
                      formData.resolutionMethod === 'phone' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Phone className={`w-6 h-6 ${
                        formData.resolutionMethod === 'phone' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-gray-900 mb-1">Phone Call</span>
                    <span className="text-xs text-gray-500">Schedulable</span>
                  </label>

                  <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition ${
                    formData.resolutionMethod === 'chat'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="resolutionMethod"
                      value="chat"
                      checked={formData.resolutionMethod === 'chat'}
                      onChange={(e) => setFormData({ ...formData, resolutionMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`rounded-lg p-3 mb-3 ${
                      formData.resolutionMethod === 'chat' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <MessageSquare className={`w-6 h-6 ${
                        formData.resolutionMethod === 'chat' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-gray-900 mb-1">In-App Chat</span>
                    <span className="text-xs text-gray-500">Live Support</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Submit Dispute
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Privacy Promise Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=200&fit=crop" 
                  alt="Privacy" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex items-start gap-2 mb-3">
                <div className="bg-blue-600 rounded-full p-1.5">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Privacy Promise</h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                At Haki Yetu, your legal matters are treated with the highest confidentiality. Your dispute details are encrypted (256-bit SSL) and only shared with the review board and the involved advocate.
              </p>

              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                <Lock className="w-4 h-4" />
                <span className="font-medium">End-to-End Encrypted</span>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-2 mb-4">
                <div className="bg-blue-100 rounded-full p-1.5">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Tips for a Faster Resolution</h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Be Specific:</p>
                    <p className="text-xs text-gray-600">Mention dates, times, and specific document names (e.g., "Affidavit of Support").</p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Attach Proof:</p>
                    <p className="text-xs text-gray-600">Upload screenshots of conversations or copies of the erroneous documents.</p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stay Calm:</p>
                    <p className="text-xs text-gray-600">Focus on facts. Our team is here to help mediate objectively.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-600 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold mb-2">NEED URGENT HELP?</h3>
              <p className="text-sm text-blue-100 mb-4">
                For emergencies, call our hotline
              </p>
              <a 
                href="tel:+254700123456" 
                className="text-2xl font-bold hover:text-blue-100 transition"
              >
                +254 700 123 456
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeForm;
