import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import lawyerService from '../../services/lawyer.service';
import {
  Shield, CheckCircle, Upload, Lock, Globe,
  HelpCircle, ChevronRight, Briefcase, Gavel,
  FileText, Users, Home, X, FileCheck
} from 'lucide-react';

const LawyerOnboarding = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to hidden file input

  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [certificateFile, setCertificateFile] = useState(null); // Store selected file
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lskNumber: '',
    yearOfAdmission: '',
    firmName: ''
  });

  const specializations = [
    { id: 'family', label: 'Family Law', icon: Users },
    { id: 'corporate', label: 'Corporate', icon: Briefcase },
    { id: 'conveyancing', label: 'Conveyancing', icon: Home },
    { id: 'ip', label: 'IP Law', icon: Globe },
    { id: 'litigation', label: 'Litigation', icon: Gavel },
  ];

  const toggleSpecialization = (id) => {
    if (selectedSpecializations.includes(id)) {
      setSelectedSpecializations(selectedSpecializations.filter(item => item !== id));
    } else {
      setSelectedSpecializations([...selectedSpecializations, id]);
    }
  };

  // --- FILE HANDLING LOGIC ---
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic validation (size < 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      setCertificateFile(file);
      toast.success("Certificate attached successfully");
    }
  };

  const removeFile = (e) => {
    e.stopPropagation(); // Prevent opening dialog again
    setCertificateFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // ---------------------------

  const handleSave = async (e) => {
    e.preventDefault();

    if (!certificateFile) {
      toast.error("Please upload your Practicing Certificate to continue.");
      return;
    }

    if (!formData.lskNumber.trim() || !formData.yearOfAdmission.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (selectedSpecializations.length === 0) {
      toast.error("Please select at least one area of specialization.");
      return;
    }

    setLoading(true);

    try {
      const profileData = new FormData();

      // Required fields
      profileData.append('lsk_number', formData.lskNumber);
      profileData.append('experience_years', formData.yearOfAdmission); // Year of admission mapped to experience

      // Calculate experience years from year of admission
      const currentYear = new Date().getFullYear();
      const admissionYear = parseInt(formData.yearOfAdmission);
      const calculatedExperience = admissionYear && !isNaN(admissionYear) ? Math.max(0, currentYear - admissionYear) : 0;
      profileData.append('experience_years', calculatedExperience.toString());

      // Optional fields
      if (formData.firmName) {
        profileData.append('firm_name', formData.firmName);
      }

      // Specialization - convert array to comma-separated string
      const specializationString = selectedSpecializations.join(', ');
      profileData.append('specialization', specializationString);

      // Bio field (optional but helpful)
      profileData.append('bio', `Specializing in ${specializationString}`);

      // File upload
      profileData.append('practicing_certificate', certificateFile);

      // Use createProfile instead of updateProfile for new registrations
      await lawyerService.createProfile(profileData);

      toast.success('Profile submitted for Admin Verification!');
      navigate('/verification-pending');
    } catch (error) {
      console.error('Error creating profile:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create profile';
      toast.error(`Profile creation failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Shield className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">Haki Yetu</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Help Center</button>
          <button className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition">
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- LEFT COLUMN: FORM --- */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partner with Haki Yetu</h1>
              <p className="text-gray-500 dark:text-gray-400">Complete your professional profile to start offering verified legal services and remote notarization.</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span>Step 2 of 4</span>
                <span>Professional Verification</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-1/2 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <form onSubmit={handleSave} className="space-y-8">

                {/* 1. Bar Admission */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Briefcase size={20} className="text-blue-600 dark:text-blue-400" /> Professional Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LSK Practice Number</label>
                      <input
                        type="text"
                        name="lskNumber"
                        placeholder="e.g. P.105/1234/2023"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors"
                        value={formData.lskNumber}
                        onChange={(e) => setFormData({ ...formData, lskNumber: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Used to verify your status with the Law Society of Kenya.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year of Admission</label>
                      <input
                        type="text"
                        name="yearOfAdmission"
                        placeholder="YYYY"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors"
                        value={formData.yearOfAdmission}
                        onChange={(e) => setFormData({ ...formData, yearOfAdmission: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Law Firm Name</label>
                      <input
                        type="text"
                        name="firmName"
                        placeholder="e.g. Wanjiku & Associates Advocates (Optional)"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 transition-colors"
                        value={formData.firmName}
                        onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                {/* 2. Specialization */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield size={20} className="text-blue-600 dark:text-blue-400" /> Areas of Specialization
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select all areas where you are qualified to provide counsel.</p>
                  <div className="flex flex-wrap gap-3">
                    {specializations.map((spec) => (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => toggleSpecialization(spec.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSpecializations.includes(spec.id)
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500'
                          }`}
                      >
                        <spec.icon size={16} />
                        {spec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                {/* 3. Document Verification (FIXED) */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <FileText size={20} className="text-blue-600 dark:text-blue-400" /> Document Verification
                  </h3>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Current Practicing Certificate</label>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                  {/* Interactive Upload Area */}
                  {!certificateFile ? (
                    <div
                      onClick={handleFileClick}
                      className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-500 transition cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                    </div>
                  ) : (
                    // Success State (File Selected)
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                          <FileCheck size={24} className="text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-800 dark:text-green-200">{certificateFile.name}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">{(certificateFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded-full text-green-700 dark:text-green-300 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <button type="button" className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? 'Verifying...' : <>Save & Continue <ChevronRight size={18} /></>}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR --- */}
          <div className="space-y-6">

            {/* Blue Card */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">Why join the network?</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Join over 500+ verified Advocates serving clients across Kenya through our secure digital platform.
              </p>
            </div>

            {/* Value Props */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-6 transition-colors">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Guaranteed Payment</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We secure your fees in escrow before you start work. No more chasing invoices.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Secure Documents</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bank-grade encryption for all generated documents and client data.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Expanded Reach</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connect with clients across Kenya instantly without leaving your office.</p>
                </div>
              </div>
            </div>

            {/* Support Widget */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 transition-colors">
              <div className="flex -space-x-2">
                <img src="https://ui-avatars.com/api/?name=Support&background=333&color=fff" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700" alt="Support" />
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700 text-white text-[10px] font-bold">
                  24/7
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Need help registering?</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">Chat with support</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerOnboarding;
