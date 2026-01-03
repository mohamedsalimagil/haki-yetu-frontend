import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Mail, Phone, Building,
  Download, FileText, Image as ImageIcon, Eye,
  AlertTriangle, Send, CheckSquare, XCircle, CheckCircle,
  GripVertical
} from 'lucide-react';

// MOCK DATA - In a real app, this comes from your API
const MOCK_LAWYERS = [
  {
    id: 1,
    name: 'Alice Wanjiku',
    lsk: 'P.105/4532/19',
    type: 'Conveyancing',
    status: 'PENDING',
    statusColor: 'yellow',
    location: 'Nairobi, KE',
    submitted: 'Today, 09:42 AM',
    email: 'alice.w@lawfirm.co.ke',
    phone: '+254 712 345 678',
    firm: 'Wanjiku & Partners Advocates',
    imgId: 32,
    docs: [
      { name: 'Current Practicing Certificate (2024)', type: 'PDF', size: '1.2 MB' },
      { name: 'National ID Copy', type: 'JPG', size: '800 KB' },
      { name: 'LSK Letter of Good Standing', type: 'PDF', size: '2.4 MB' }
    ],
    flag: {
      active: true,
      msg: 'The LSK Number provided matches a record in the LSK Public Registry but the firm name differs slightly.'
    }
  },
  {
    id: 2,
    name: 'David Ochieng',
    lsk: 'P.105/2210/15',
    type: 'Litigation',
    status: 'PENDING',
    statusColor: 'yellow',
    location: 'Kisumu, KE',
    submitted: 'Yesterday, 4:15 PM',
    email: 'david.o@legal.co.ke',
    phone: '+254 722 999 000',
    firm: 'Ochieng & Associates',
    imgId: 11,
    docs: [
      { name: 'Practicing Certificate', type: 'PDF', size: '1.0 MB' }
    ],
    flag: { active: false }
  },
  {
    id: 3,
    name: 'Kamau & Mueke Adv.',
    lsk: 'Firm Registration',
    type: 'Commercial Law',
    status: 'INFO REQ',
    statusColor: 'blue',
    location: 'Mombasa, KE',
    submitted: '2d ago',
    email: 'info@kmadvocates.com',
    phone: '+254 733 111 222',
    firm: 'Kamau & Mueke Advocates',
    initials: 'KM',
    docs: [],
    flag: { active: false }
  }
];

const LawyerVerification = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedId, setSelectedId] = useState(1);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Get the data for the currently selected lawyer
  const selectedLawyer = MOCK_LAWYERS.find(l => l.id === selectedId) || MOCK_LAWYERS[0];

  // --- RESIZING LOGIC ---
  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 250 && newWidth < 600) { // Min 250px, Max 600px
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans overflow-hidden select-none" ref={sidebarRef}>

      {/* ---------------- LEFT SIDEBAR (RESIZABLE) ---------------- */}
      <div
        style={{ width: sidebarWidth }}
        className="bg-white border-r border-gray-200 flex flex-col shrink-0 transition-none"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Verification Queue</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded">
              {MOCK_LAWYERS.length} Pending
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
             <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
             <input
               type="text"
               placeholder="Search..."
               className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
               <Filter className="w-4 h-4" />
             </button>
          </div>

          {/* Tab Toggle */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg">
             <button
               onClick={() => setActiveTab('pending')}
               className={`text-xs font-semibold py-1.5 rounded-md text-center transition-all ${activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Pending
             </button>
             <button
               onClick={() => setActiveTab('reviewed')}
               className={`text-xs font-semibold py-1.5 rounded-md text-center transition-all ${activeTab === 'reviewed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Reviewed
             </button>
          </div>
        </div>

        {/* List of Applicants (Interactive) */}
        <div className="overflow-y-auto flex-1">
          {MOCK_LAWYERS.map((lawyer) => (
            <div
              key={lawyer.id}
              onClick={() => setSelectedId(lawyer.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer group relative transition-colors ${
                selectedId === lawyer.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                 <div className="flex items-center space-x-3 overflow-hidden">
                   {lawyer.initials ? (
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0">
                        {lawyer.initials}
                      </div>
                   ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img src={`https://i.pravatar.cc/150?img=${lawyer.imgId}`} alt={lawyer.name} className="w-full h-full object-cover" />
                      </div>
                   )}
                   <div className="min-w-0">
                     <h4 className="font-bold text-gray-900 text-sm truncate">{lawyer.name}</h4>
                     <p className="text-xs text-gray-500 truncate">{lawyer.lsk} • {lawyer.type}</p>
                   </div>
                 </div>
                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                   lawyer.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                 }`}>
                   {lawyer.status}
                 </span>
              </div>
              <div className="flex justify-between items-center mt-2 pl-13 ml-12">
                 <p className="text-xs text-gray-400">{lawyer.submitted}</p>
                 {selectedId === lawyer.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- DRAG HANDLE ---------------- */}
      <div
        className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center transition-colors z-10"
        onMouseDown={startResizing}
      >
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>

      {/* ---------------- RIGHT PANEL (DETAILS) ---------------- */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white min-w-[500px]">

        {/* Detail Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-start">
          <div className="flex items-center space-x-4">
             <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                {selectedLawyer.initials ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">{selectedLawyer.initials}</div>
                ) : (
                  <img src={`https://i.pravatar.cc/150?img=${selectedLawyer.imgId}`} className="w-full h-full object-cover" />
                )}
             </div>
             <div>
                <div className="flex items-center space-x-3">
                   <h1 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h1>
                   <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded border border-yellow-200">
                     {selectedLawyer.status} REVIEW
                   </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">💼</span>
                    <span className="text-xs uppercase font-bold text-gray-400">LSK No:</span>
                    <span className="text-gray-700 font-medium">{selectedLawyer.lsk}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>{selectedLawyer.location}</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="font-bold text-gray-500 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center">?</span>
              <span>Request Info</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm shadow-green-200">
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Activate</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
           <div className="flex space-x-6 border-b border-gray-100 mb-6">
             <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-2 px-1">Overview & Docs</button>
           </div>

           <div className="grid grid-cols-2 gap-8 items-start">

              {/* -------- LEFT COLUMN -------- */}
              <div className="space-y-6">

                {/* Contact Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Contact Details</h3>
                  <div className="space-y-5">
                     <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400"><Mail className="w-4 h-4"/></div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedLawyer.email}</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400"><Phone className="w-4 h-4"/></div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedLawyer.phone}</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400"><Building className="w-4 h-4"/></div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Firm Name</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedLawyer.firm}</p>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Practice Areas Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Practice Areas</h3>
                  <div className="flex flex-wrap gap-2">
                     <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">{selectedLawyer.type}</span>
                     <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">General Law</span>
                  </div>
                </div>

                {/* Admin Checks Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Checks</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                       <div className="bg-blue-600 text-white rounded w-5 h-5 flex items-center justify-center"><CheckSquare className="w-3.5 h-3.5" /></div>
                       <span className="text-sm font-medium text-gray-700">Identity Verified</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                       <div className="border border-gray-300 rounded w-5 h-5"></div>
                       <span className="text-sm font-medium text-gray-500">LSK Portal Confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                       <div className="border border-gray-300 rounded w-5 h-5"></div>
                       <span className="text-sm font-medium text-gray-500">Documents Authentic</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* -------- RIGHT COLUMN -------- */}
              <div className="space-y-6">

                {/* Submitted Credentials Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                   <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted Credentials</h3>
                      <button className="text-xs text-blue-600 font-medium hover:underline">Download All</button>
                   </div>
                   <div className="space-y-4">
                      {selectedLawyer.docs.length > 0 ? selectedLawyer.docs.map((doc, idx) => (
                        <div key={idx} className="flex items-center group cursor-pointer">
                           <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mr-3"><FileText className="w-5 h-5"/></div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-400">PDF • {doc.size} • Uploaded today</p>
                           </div>
                           <div className="flex space-x-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-5 h-5 hover:text-gray-600"/>
                              <Download className="w-5 h-5 hover:text-gray-600"/>
                           </div>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-400 italic">No documents available.</p>
                      )}
                   </div>
                </div>

                {/* Automated System Flag (Conditional) */}
                {selectedLawyer.flag && selectedLawyer.flag.active && (
                  <div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
                     <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-orange-900 text-sm">Automated System Flag</h4>
                          <p className="text-sm text-orange-800 mt-2 leading-relaxed">
                            {selectedLawyer.flag.msg}
                          </p>
                        </div>
                     </div>
                  </div>
                )}

                {/* Internal Notes */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Internal Notes</h3>
                  <div className="relative">
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 placeholder:text-gray-300"
                      placeholder="Add a note for other admins..."
                    ></textarea>
                    <button className="absolute bottom-3 right-3 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700">
                       <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerVerification;
