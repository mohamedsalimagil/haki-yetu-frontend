import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import socketService from '../../services/socket.service';
import { Shield, Lock, Upload, Calendar, MapPin, ChevronRight, FileText, CheckCircle, User } from 'lucide-react';

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const fileInputFront = useRef(null);
  const fileInputBack = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('national_id');

  // State for files
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    documentNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    county: '',
    address: '',
    gender: '',
    kraPin: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('onboarding_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setSelectedDocumentType(draft.selectedDocumentType || 'national_id');
        setFormData({
          documentNumber: draft.documentNumber || '',
          dateOfBirth: draft.dateOfBirth || '',
          phoneNumber: draft.phoneNumber || '',
          county: draft.county || '',
          address: draft.address || '',
          gender: draft.gender || '',
          kraPin: draft.kraPin || '',
        });
        // Note: Files cannot be restored from localStorage, but we can show they were previously uploaded
        if (draft.idFrontName) {
          setIdFront({ name: draft.idFrontName });
        }
        if (draft.idBackName) {
          setIdBack({ name: draft.idBackName });
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and PDF are allowed.');
      e.target.value = null; // Reset input
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      e.target.value = null; // Reset input
      return;
    }

    setFile(file);
    toast.success(` ${file.name} uploaded (${(file.size / 1024).toFixed(1)}KB)`);
  };

  const handleSaveDraft = () => {
    setSaving(true);

    const draftData = {
      selectedDocumentType,
      ...formData,
      idFrontName: idFront?.name,
      idBackName: idBack?.name,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('onboarding_draft', JSON.stringify(draftData));

    setSaving(false);
    toast.success('Draft saved! You can continue later.');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['documentNumber', 'dateOfBirth', 'phoneNumber', 'address', 'gender', 'kraPin'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Validate file uploads
    if (!idFront) {
      toast.error('Please upload your ID front side');
      return;
    }

    if (selectedDocumentType !== 'passport' && !idBack) {
      toast.error('Please upload your ID back side');
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    // Create FormData with specific snake_case keys
    const submitData = new FormData();

    // Append form fields with specific snake_case keys
    submitData.append('phone', formData.phoneNumber || '');
    submitData.append('address', formData.address || '');
    submitData.append('county', formData.county || '');
    submitData.append('document_number', formData.documentNumber || '');
    submitData.append('dob', formData.dateOfBirth || '');
    submitData.append('gender', formData.gender || '');
    submitData.append('kra_pin', formData.kraPin || '');
    submitData.append('id_front', idFront);
    submitData.append('id_back', idBack);

    // Debug: Log submit data
    console.log('Submit data entries:');
    for (let [key, value] of submitData.entries()) {
      console.log(key, typeof value === 'string' ? value : value.name);
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      await api.post('/client/kyc', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      localStorage.setItem('kyc_submitted', 'true');
      toast.success('Documents submitted for verification!');
      navigate('/verification-pending');
    } catch (error) {
      console.error('Error submitting KYC:', error);
      console.error('Server response:', error.response?.data);
      console.error('Backend Validation Error:', error.response?.data);
      if (error.response?.status === 401) {
        toast.error('Verification error: Please re-login if this persists');
      } else {
        toast.error('Failed to submit documents. Please try again.');
      }
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">?</div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col lg:flex-row gap-8">

        {/* --- LEFT FORM --- */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Identity</h1>
            <p className="text-gray-600 dark:text-gray-400">To access legal services, we are required by Kenyan law to verify your identity. Your data is encrypted.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Document Type */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-3">Identification Document</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedDocumentType('national_id')}
                    className={`py-2.5 px-4 rounded-lg border-2 font-bold text-sm transition ${selectedDocumentType === 'national_id'
                      ? 'border-[#1E40AF] bg-blue-50 dark:bg-blue-900/40 text-[#1E40AF] dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    National ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDocumentType('passport')}
                    className={`py-2.5 px-4 rounded-lg border-2 font-bold text-sm transition ${selectedDocumentType === 'passport'
                      ? 'border-[#1E40AF] bg-blue-50 dark:bg-blue-900/40 text-[#1E40AF] dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    Passport
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDocumentType('alien_id')}
                    className={`py-2.5 px-4 rounded-lg border-2 font-bold text-sm transition ${selectedDocumentType === 'alien_id'
                      ? 'border-[#1E40AF] bg-blue-50 dark:bg-blue-900/40 text-[#1E40AF] dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    Alien ID
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Number</label>
                <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="e.g. 12345678" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" required />
              </div>

              {/* --- UPDATED SECTION: DOB, GENDER, PHONE, KRA PIN --- */}

              {/* Row: Date of Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row: Phone & KRA PIN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">KRA PIN</label>
                  <input
                    type="text"
                    name="kraPin"
                    value={formData.kraPin}
                    onChange={handleChange}
                    placeholder="A00..."
                    maxLength={11}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">County of Residence</label>
                <select name="county" value={formData.county} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                  <option value="">Select County</option>
                  <option>Mombasa</option>
                  <option>Kwale</option>
                  <option>Kilifi</option>
                  <option>Tana River</option>
                  <option>Lamu</option>
                  <option>Taita/Taveta</option>
                  <option>Garissa</option>
                  <option>Wajir</option>
                  <option>Mandera</option>
                  <option>Marsabit</option>
                  <option>Isiolo</option>
                  <option>Meru</option>
                  <option>Tharaka-Nithi</option>
                  <option>Embu</option>
                  <option>Kitui</option>
                  <option>Machakos</option>
                  <option>Makueni</option>
                  <option>Nyandarua</option>
                  <option>Nyeri</option>
                  <option>Kirinyaga</option>
                  <option>Murang'a</option>
                  <option>Kiambu</option>
                  <option>Turkana</option>
                  <option>West Pokot</option>
                  <option>Samburu</option>
                  <option>Trans Nzoia</option>
                  <option>Uasin Gishu</option>
                  <option>Elgeyo/Marakwet</option>
                  <option>Nandi</option>
                  <option>Baringo</option>
                  <option>Laikipia</option>
                  <option>Nakuru</option>
                  <option>Narok</option>
                  <option>Kajiado</option>
                  <option>Kericho</option>
                  <option>Bomet</option>
                  <option>Kakamega</option>
                  <option>Vihiga</option>
                  <option>Bungoma</option>
                  <option>Busia</option>
                  <option>Siaya</option>
                  <option>Kisumu</option>
                  <option>Homa Bay</option>
                  <option>Migori</option>
                  <option>Kisii</option>
                  <option>Nyamira</option>
                  <option>Nairobi City</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Physical Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. Westlands, Chiromo Road, Mirage Towers" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" required />
              </div>

              {/* Uploads */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-300">Proof of Identity</label>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {selectedDocumentType === 'passport'
                    ? 'Please upload a clear scanned copy or photo of your passport. Max size 5MB.'
                    : 'Please upload a clear scanned copy or photo of your ID (Front and Back). Max size 5MB.'
                  }
                </p>

                <div className={`grid gap-4 ${selectedDocumentType === 'passport' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {/* Front Side / Passport */}
                  <div
                    onClick={() => fileInputFront.current.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${idFront ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  >
                    <input
                      type="file"
                      ref={fileInputFront}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setIdFront)}
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${idFront ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {idFront ? <CheckCircle size={20} /> : <User size={20} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {idFront
                        ? idFront.name
                        : selectedDocumentType === 'passport'
                          ? 'Passport'
                          : 'ID Front Side'
                      }
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {idFront ? (
                        <>
                          <span className="text-green-600 dark:text-green-400 font-medium">{(idFront.size / 1024).toFixed(1)}KB</span> - Click to change
                        </>
                      ) : (
                        'Click to upload (JPG, PNG, PDF)'
                      )}
                    </span>
                  </div>

                  {/* Back Side (only for National ID and Alien ID) */}
                  {selectedDocumentType !== 'passport' && (
                    <div
                      onClick={() => fileInputBack.current.click()}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${idBack ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                      <input
                        type="file"
                        ref={fileInputBack}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setIdBack)}
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${idBack ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                        {idBack ? <CheckCircle size={20} /> : <FileText size={20} />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{idBack ? idBack.name : 'ID Back Side'}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {idBack ? (
                          <>
                            <span className="text-green-600 dark:text-green-400 font-medium">{(idBack.size / 1024).toFixed(1)}KB</span> - Click to change
                          </>
                        ) : (
                          'Click to upload (JPG, PNG, PDF)'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {loading && uploadProgress > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Uploading Documents...</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">Please do not close this page...</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification →'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="px-6 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Continue Later'}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="font-bold text-gray-900 dark:text-white">Why we need this?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Under the <span className="font-bold text-gray-800 dark:text-gray-200">Advocates Act of Kenya</span>, we must verify the identity of all clients engaging legal counsel to prevent fraud.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900">
              <Lock size={12} /> 256-bit Bank Grade SSL Encryption
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Compliance team reviews docs (2-24 hrs).</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Approval</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">You receive SMS/Email notification.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Access</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard unlocked for services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientOnboarding;
