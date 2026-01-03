import React, { useState, useEffect, useRef } from 'react';
import AdminService from '../../services/adminService';
import {
  Search, Filter, Flag, Clock, CheckCircle,
  Copy, RotateCw, ZoomIn, Download, Info, X, Check,
  GripVertical, Loader, ChevronDown
} from 'lucide-react';

const ClientVerification = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeDocTab, setActiveDocTab] = useState('front'); // 'front', 'back', 'selfie'
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await AdminService.getClientQueue('pending');
        setClients(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  // --- 2. ACTIONS ---
  const handleVerify = async () => {
    if (!selectedId) return;
    if (window.confirm("Are you sure you want to verify this client?")) {
      try {
        await AdminService.verifyClient(selectedId);
        const updatedList = clients.filter(c => c.id !== selectedId);
        setClients(updatedList);
        if (updatedList.length > 0) setSelectedId(updatedList[0].id);
        else setSelectedId(null);
      } catch (err) {
        alert("Action failed");
      }
    }
  };

  // --- 3. HELPER: DATA & IMAGES ---
  const selectedClient = clients.find(c => c.id === selectedId);

  const getCurrentImage = () => {
    if (!selectedClient) return null;
    switch (activeDocTab) {
      case 'front': return selectedClient.id_front_url;
      case 'back': return selectedClient.id_back_url;
      case 'selfie': return selectedClient.selfie_url;
      default: return null;
    }
  };

  const currentImageUrl = getCurrentImage();

  // --- RESIZING LOGIC ---
  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };
  const stopResizing = () => setIsResizing(false);
  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 280 && newWidth < 600) setSidebarWidth(newWidth);
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

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans overflow-hidden select-none" ref={sidebarRef}>

      {/* --- LEFT SIDEBAR --- */}
      <div style={{ width: sidebarWidth }} className="bg-white border-r border-gray-200 flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-sm">Verification Queue</h2>
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{clients.length} Pending</span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Name or ID" className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"><Filter className="w-4 h-4" /></button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            <button className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">All Pending</button>
            <button className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-200 whitespace-nowrap">Urgent</button>
            <button className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-200 whitespace-nowrap">Resubmissions</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => { setSelectedId(client.id); setActiveDocTab('front'); }}
              className={`p-4 border-b border-gray-100 cursor-pointer group relative transition-colors ${
                selectedId === client.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                     <img src={`https://ui-avatars.com/api/?name=${client.name}&background=random`} alt={client.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{client.name}</h4>
                    <p className="text-xs text-gray-500 truncate">ID: {client.id_number} • Nairobi</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">10m ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center transition-colors z-20" onMouseDown={startResizing}>
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className="flex-1 flex flex-col min-w-[600px] overflow-hidden bg-gray-50">
        {selectedClient ? (
          <>
            {/* Header */}
            <div className="bg-white px-8 py-5 border-b border-gray-200 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h1>
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">PENDING REVIEW</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Submitted: {selectedClient.created_at ? new Date(selectedClient.created_at).toLocaleString() : 'N/A'}</span>
                  </div>
                  <span>📍 {selectedClient.location}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">
                  <Flag className="w-4 h-4" />
                  <span>Flag Risk</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex gap-6 h-full">

                {/* Submitted Data Card */}
                <div className="w-[35%] bg-white rounded-xl shadow-sm border border-gray-200 p-0 h-fit flex flex-col">
                  <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted Data</h3>
                    <button className="text-blue-600 text-xs font-semibold hover:underline">Edit</button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Full Legal Name</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-semibold text-lg">{selectedClient.name}</span>
                        <CheckCircle className="w-4 h-4 text-green-500 fill-current bg-white rounded-full" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">ID Number</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-semibold text-lg">{selectedClient.id_number}</span>
                        <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Date of Birth</label>
                        <span className="text-gray-900 font-semibold text-sm">{selectedClient.dob || '01 Jan 1990'}</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Gender</label>
                        <span className="text-gray-900 font-semibold text-sm">{selectedClient.gender || 'Unknown'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">KRA PIN</label>
                      <span className="text-gray-900 font-semibold text-sm">{selectedClient.kra_pin}</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold text-sm">{selectedClient.phone}</span>
                        <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">OTP Verified</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Physical Address</label>
                      <p className="text-gray-900 font-medium text-sm leading-relaxed">
                        P.O. Box 437, Nairobi<br/>Langata Road, Karen
                      </p>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="p-5 border-t border-gray-100 mt-auto bg-white rounded-b-xl">
                     <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Admin Internal Notes</label>
                     <textarea
                      placeholder="Add a note for other admins..."
                      className="w-full text-sm p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20 placeholder:text-gray-400"
                     ></textarea>
                  </div>
                </div>

                {/* Document Proofs */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-0 flex flex-col h-full overflow-hidden">
                   <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Proofs</h3>
                     </div>
                     <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
                        {['front', 'back', 'selfie'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveDocTab(tab)}
                            className={`text-[11px] font-semibold px-4 py-1 rounded-md transition-all capitalize ${
                              activeDocTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab === 'front' ? 'ID Front' : tab === 'back' ? 'ID Back' : 'Selfie'}
                          </button>
                        ))}
                     </div>
                     <div className="flex space-x-4 text-gray-400">
                        <ZoomIn className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                        <RotateCw className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                        <Download className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                     </div>
                   </div>

                   <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center relative overflow-hidden">
                      {currentImageUrl ? (
                        <div className="relative shadow-lg rounded-lg overflow-hidden group">
                           <img
                             src={currentImageUrl}
                             alt={`${activeDocTab} view`}
                             className="max-w-full max-h-[500px] object-contain"
                           />
                           <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                             id_document.jpg • 2.4 MB
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                           <div className="w-16 h-12 bg-gray-100 rounded mb-4 flex items-center justify-center">
                              <span className="w-8 h-1 bg-gray-300 rounded"></span>
                           </div>
                           <p className="text-sm font-medium">No document uploaded</p>
                        </div>
                      )}
                   </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 p-4 px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] shrink-0 z-20">
               <div className="flex items-center space-x-2 text-gray-500">
                 <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">i</div>
                 <span className="text-xs">Verify all data matches the document before approving.</span>
               </div>
               <div className="flex space-x-3">
                 <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">?</div>
                    <span>Request Info</span>
                 </button>
                 <button className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Reject KYC</span>
                 </button>
                 <button onClick={handleVerify} className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 flex items-center space-x-2 shadow-sm">
                    <Check className="w-4 h-4" />
                    <span>Verify Client</span>
                 </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">Select a client to view details.</div>
        )}
      </div>
    </div>
  );
};

export default ClientVerification;
