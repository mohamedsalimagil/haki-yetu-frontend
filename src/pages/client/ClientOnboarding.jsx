import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { Shield, Lock, Upload, Calendar, MapPin, ChevronRight, FileText, CheckCircle, User } from 'lucide-react';

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const fileInputFront = useRef(null);
  const fileInputBack = useRef(null);
  const [loading, setLoading] = useState(false);

  // State for files
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  const handleFileChange = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success('Document uploaded');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFront || !idBack) {
      toast.error('Please upload both sides of your ID');
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    // Get form data and create FormData with specific snake_case keys
    const formDataObj = new FormData(e.target);
    const submitData = new FormData();

    // Debug: Log form data for troubleshooting
    console.log('Form data entries:');
    for (let [key, value] of formDataObj.entries()) {
      console.log(key, value);
    }

    // Append form fields with specific snake_case keys
    submitData.append('phone', formDataObj.get('phone') || '');
    submitData.append('address', formDataObj.get('address') || '');
    submitData.append('county', formDataObj.get('county') || '');
    submitData.append('document_number', formDataObj.get('documentNumber') || formDataObj.get('document_number') || '');
    submitData.append('dob', formDataObj.get('dob') || '');
    submitData.append('id_front', idFront);
    submitData.append('id_back', idBack);

    // Debug: Log submit data
    console.log('Submit data entries:');
    for (let [key, value] of submitData.entries()) {
      console.log(key, typeof value === 'string' ? value : value.name);
    }

    setLoading(true);
    try {
      await api.post('/client/kyc', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token,
        },
      });
      toast.success('Documents submitted for verification!');
      navigate('/client/verification-pending');
    } catch (error) {
      console.error('Error submitting KYC:', error);
      console.error('Server response:', error.response?.data);
      console.error('Backend Validation Error:', error.response?.data);
      toast.error('Failed to submit documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="text-white w-4 h-4" />
           </div>
           <span className="font-bold text-gray-900 text-lg">Haki Yetu</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">?</div>
           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col lg:flex-row gap-8">

        {/* --- LEFT FORM --- */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">To access legal services, we are required by Kenyan law to verify your identity. Your data is encrypted.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Document Type */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Identification Document</label>
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" className="py-2.5 px-4 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold text-sm">National ID</button>
                  <button type="button" className="py-2.5 px-4 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50">Passport</button>
                  <button type="button" className="py-2.5 px-4 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50">Alien ID</button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                  <input type="text" name="documentNumber" placeholder="e.g. 12345678" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative">
                    <input type="date" name="dob" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <Calendar className="absolute right-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (M-Pesa enabled)</label>
                  <input type="tel" name="phone" placeholder="+254 7XX XXX XXX" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">County of Residence</label>
                  <select name="county" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option>Nairobi City</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                <input type="text" name="address" placeholder="e.g. Westlands, Chiromo Road, Mirage Towers" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              {/* Uploads */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900">Proof of Identity</label>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Please upload a clear scanned copy or photo of your ID (Front and Back). Max size 5MB.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front Side */}
                  <div
                    onClick={() => fileInputFront.current.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${idFront ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <input type="file" ref={fileInputFront} className="hidden" onChange={(e) => handleFileChange(e, setIdFront)} accept="image/*" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${idFront ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {idFront ? <CheckCircle size={20} /> : <User size={20} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{idFront ? idFront.name : 'ID Front Side'}</span>
                    <span className="text-xs text-gray-400 mt-1">{idFront ? 'Click to change' : 'Click to upload'}</span>
                  </div>

                  {/* Back Side */}
                  <div
                    onClick={() => fileInputBack.current.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${idBack ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <input type="file" ref={fileInputBack} className="hidden" onChange={(e) => handleFileChange(e, setIdBack)} accept="image/*" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${idBack ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {idBack ? <CheckCircle size={20} /> : <FileText size={20} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{idBack ? idBack.name : 'ID Back Side'}</span>
                    <span className="text-xs text-gray-400 mt-1">{idBack ? 'Click to change' : 'Click to upload'}</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-70"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification →'}
                </button>
                <button type="button" className="px-6 py-3.5 text-gray-500 font-medium hover:text-gray-700">
                  Save & Continue Later
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-blue-600" size={20} />
              <h3 className="font-bold text-gray-900">Why we need this?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Under the <span className="font-bold text-gray-800">Advocates Act of Kenya</span>, we must verify the identity of all clients engaging legal counsel to prevent fraud.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-white px-3 py-2 rounded-lg border border-green-100">
              <Lock size={12} /> 256-bit Bank Grade SSL Encryption
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Review</p>
                  <p className="text-xs text-gray-500">Compliance team reviews docs (2-24 hrs).</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Approval</p>
                  <p className="text-xs text-gray-500">You receive SMS/Email notification.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Access</p>
                  <p className="text-xs text-gray-500">Dashboard unlocked for services.</p>
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
