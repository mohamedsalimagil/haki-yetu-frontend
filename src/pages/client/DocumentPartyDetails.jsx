import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, HelpCircle, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentPartyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    kraPin: '',
    address: '',
    previousNameChange: 'no'
  });

  const handleNext = () => {
    alert('Proceeding to Step 2: Declaration');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0A1E41]">Haki Yetu</h1>
              <p className="text-sm text-slate-500">Affidavit of Name Change</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 transition">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2">
              <Save size={16} /> Save & Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-[#0A1E41]">Step 1 of 3</h2>
              <p className="text-sm text-slate-500">Identity Verification & Personal Details</p>
            </div>
            <span className="text-sm font-bold text-[#2563EB]">33% Completed</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#2563EB] h-full rounded-full transition-all duration-300" style={{ width: '33%' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-[#0A1E41] mb-2">Party Details</h3>
              <p className="text-sm text-slate-500 mb-6">
                Please enter the details of the person making this affidavit as they appear on their National ID.
              </p>

              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Juma"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg width="16" height="16" fill="none" className="text-slate-400">
                          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM3 14a5 5 0 0110 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Kamau"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg width="16" height="16" fill="none" className="text-slate-400">
                          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM3 14a5 5 0 0110 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID and KRA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      National ID Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 12345678"
                        value={formData.nationalId}
                        onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg width="16" height="16" fill="none" className="text-slate-400">
                          <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      KRA PIN
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="A000..."
                        value={formData.kraPin}
                        onChange={(e) => setFormData({...formData, kraPin: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg width="16" height="16" fill="none" className="text-slate-400">
                          <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Current Residential Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Plot No, Street, Building, Town/City"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" fill="none" className="text-slate-400">
                        <path d="M3 6L8 2L13 6V13H3V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Previous Name Change */}
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3 mb-4">
                    <HelpCircle size={20} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0A1E41] text-sm mb-1">Previous Name Change History</h4>
                      <p className="text-xs text-slate-600">Have you previously executed a deed poll or affidavit for name change?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="previousNameChange"
                        value="yes"
                        checked={formData.previousNameChange === 'yes'}
                        onChange={(e) => setFormData({...formData, previousNameChange: e.target.value})}
                        className="text-[#2563EB]"
                      />
                      <span className="text-sm font-medium text-slate-700">Yes, I have</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="previousNameChange"
                        value="no"
                        checked={formData.previousNameChange === 'no'}
                        onChange={(e) => setFormData({...formData, previousNameChange: e.target.value})}
                        className="text-[#2563EB]"
                      />
                      <span className="text-sm font-medium text-slate-700">No, this is my first time</span>
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    Next: Declaration <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-[#2563EB]" />
                <h3 className="font-bold text-[#0A1E41]">LIVE DOCUMENT PREVIEW</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Auto-updating
              </p>

              {/* Document Preview */}
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 min-h-[600px]">
                <div className="text-center mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">REPUBLICOF KENYA</p>
                  <p className="text-xs text-slate-500 mt-1">IN THE MATTER OF THE OATHS AND STATUTORY</p>
                  <p className="text-xs text-slate-500">DECLARATIONS ACT</p>
                  <p className="text-xs text-slate-500">CHAPTER 15, LAWS OF KENYA</p>
                  <h4 className="font-bold text-[#0A1E41] mt-4">AFFIDAVIT OF NAME CHANGE</h4>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  <p>
                    I, <span className="font-bold text-[#0A1E41]">[{formData.firstName || 'Juma'} {formData.lastName || 'Kamau'}]</span> of Post Office Box Number __________ in the Republic of Kenya do hereby make oath and state as follows:
                  </p>

                  <p>
                    THAT I am a male adult of sound mind and a holder of National Identity Card Number <span className="font-bold">[{formData.nationalId || '12345678'}]</span> and hence competent to swear this affidavit.
                  </p>

                  <p className="text-xs text-slate-400 italic">
                    2. THAT I was born in __________ on the __________ ...
                  </p>

                  <p className="text-xs text-slate-400 italic">
                    3. THAT I have absolutely renounced and abandoned the use of my former name(s) of [__________]
                  </p>

                  <div className="mt-12 pt-6 border-t border-gray-300">
                    <div className="flex justify-between text-xs">
                      <div>
                        <p className="border-t border-gray-400 pt-1 text-center">DEPONENT</p>
                      </div>
                      <div>
                        <p className="border-t border-gray-400 pt-1 text-center">COMMISSIONER FOR OATHS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-start gap-3">
                  <HelpCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-green-800 mb-1">Need help with details?</p>
                    <p className="text-xs text-green-700">Our verified advocates are online to assist you with this form.</p>
                    <button className="mt-3 text-xs font-bold text-green-700 hover:underline">
                      Start Chat →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPartyDetails;
