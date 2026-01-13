import React, { useState, useEffect, useRef, useMemo } from 'react';
import AdminService from '../../services/adminService';
import { getFullUrl } from '../../utils/apiUtils';
import {
  Search, Filter, Flag, Clock, CheckCircle,
  Copy, RotateCw, ZoomIn, Download, Info, X, Check,
  GripVertical, Loader, ChevronDown
} from 'lucide-react';

// Backend base URL for constructing image URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

import { useNavigate } from 'react-router-dom';



const ClientVerification = () => {
  const [clients, setClients] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'urgent', 'resubmitted'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeDocTab, setActiveDocTab] = useState('front'); // 'front', 'back'
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  // Image manipulation state
  const [imgRotation, setImgRotation] = useState(0);
  const [imgZoom, setImgZoom] = useState(1);

  const sidebarRef = useRef(null);

  // --- 1. FETCH DATA ---
  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        // AdminService.getClientQueue takes status... 
        // We might need to change AdminService or pass query param?
        // AdminService.getClientQueue usually takes 'pending'.
        // My backend update supports ?filter=urgent.
        // I'll assume AdminService.getClientQueue takes a second arg or I should call fetch directly?
        // Or I can modify AdminService. BUT I can't modify AdminService easily without reading it.
        // Assuming AdminService.getClientQueue(status, filter) or similar? 
        // Let's just use raw fetch for now or try to append generic query?
        // Wait, line 89: AdminService.getClientQueue('pending');
        // If I change it to `AdminService.getClientQueue('pending?filter=' + filterType)` it might work if it concatenates.
        // Or I'll just check if I can use fetch directly to be safe, but I prefer consistency.
        // I'll assume AdminService isn't robust enough and use direct fetch if needed, 
        // OR better: Assume getClientQueue takes query params.
        // Actually, I'll use direct fetch to ensure it works with my NEW backend param.
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/api/admin/clients/pending`;
        if (filterType !== 'all') {
          url += `?filter=${filterType}`;
        }
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setClients(data);
          if (data.length > 0) setSelectedId(data[0].id);
          else setSelectedId(null);
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [filterType]);

  // --- 2. ACTIONS ---
  const handleVerify = async () => {
    if (!selectedId) return;
    if (window.confirm("Are you sure you want to verify this client?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/admin/verify-user/${selectedId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'approved' })
        });

        if (response.ok) {
          const updatedList = clients.filter(c => c.id !== selectedId);
          setClients(updatedList);
          if (updatedList.length > 0) setSelectedId(updatedList[0].id);
          else setSelectedId(null);
          alert("Client verified successfully!");
        } else {
          const err = await response.json();
          alert(`Failed to verify: ${err.message || err.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Verify failed:", err);
        alert("Action failed: " + err.message);
      }
    }
  };

  const handleFlagRisk = async () => {
    if (!selectedId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${selectedId}/flag`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        // Update local state
        setClients(clients.map(c => c.id === selectedId ? { ...c, risk_status: data.risk_status } : c));
      }
    } catch (error) {
      console.error("Flag risk failed", error);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;

    // confirm action
    if (!window.confirm(`Are you sure you want to reject ${selectedClient.name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Using generic verify-user endpoint which handles both approved/rejected statuses
      const response = await fetch(`${API_BASE_URL}/api/admin/verify-user/${selectedId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        // Update UI: Remove client from list
        setClients(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
        alert("Client rejected successfully.");
      } else {
        const err = await response.json();
        alert(`Failed to reject: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error rejecting client:", error);
      alert("System error. Please try again.");
    }
  };




  // --- 3. HELPER: DATA & IMAGES ---
  const selectedClient = clients.find(c => c.id === selectedId);



  const currentImageUrl = useMemo(() => {
    if (!selectedClient) return null;
    let url = null;
    switch (activeDocTab) {
      case 'front':
        url = selectedClient.id_front_url || selectedClient.national_id_url;
        break;
      case 'back':
        // Robust fallback for back ID
        url = selectedClient.id_back_url || selectedClient.national_id_back_url;
        break;
      default:
        return null;
    }
    return getFullUrl(url);
  }, [selectedClient, activeDocTab]);

  // --- RESIZING LOGIC ---
  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  // Reset image manipulation when client or tab changes
  useEffect(() => {
    setImgRotation(0);
    setImgZoom(1);
  }, [selectedClient, activeDocTab]);

  // Image action handlers
  const handleRotate = () => {
    setImgRotation((prev) => prev + 90);
  };

  const handleZoom = () => {
    // Toggle between 1x, 1.5x, and 2x zoom
    setImgZoom((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  const handleDownload = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document_proof_${selectedClient?.id || 'doc'}_${activeDocTab}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert("Could not download image. Try right-clicking and 'Save Image As'.");
    }
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

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden select-none transition-colors" ref={sidebarRef}>

      {/* --- LEFT SIDEBAR --- */}
      <div style={{ width: sidebarWidth }} className="hidden lg:flex bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col shrink-0 z-10 w-full lg:w-auto h-full transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white text-sm">Verification Queue</h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">{clients.length} Pending</span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Name or ID" className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><Filter className="w-4 h-4" /></button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilterType('all')}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${filterType === 'all' ? 'bg-gray-900 dark:bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              All Pending
            </button>
            <button
              onClick={() => setFilterType('urgent')}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${filterType === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Urgent
            </button>
            <button
              onClick={() => setFilterType('resubmitted')}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${filterType === 'resubmitted' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Resubmissions
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => { setSelectedId(client.id); setActiveDocTab('front'); }}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer group relative transition-colors ${selectedId === client.id ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${client.name}&background=random`} alt={client.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{client.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {client.id_number} • Nairobi</p>
                  </div>
                </div>
                {client.risk_status && <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] uppercase font-bold px-1 rounded ml-1">RISK</span>}
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">10m ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 cursor-col-resize items-center justify-center transition-colors z-20" onMouseDown={startResizing}>
        <GripVertical className="w-3 h-3 text-gray-400 dark:text-gray-500" />
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className="flex-1 flex flex-col min-w-0 lg:min-w-[600px] overflow-hidden bg-gray-50 dark:bg-gray-900 h-full transition-colors">
        {selectedClient ? (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start shrink-0 transition-colors">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.name}</h1>
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">PENDING REVIEW</span>
                  {selectedClient.risk_status && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide animate-pulse">HIGH RISK</span>}
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Submitted: {selectedClient.created_at ? new Date(selectedClient.created_at).toLocaleString() : 'N/A'}</span>
                  </div>
                  <span>📍 {selectedClient.location}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleFlagRisk}
                  className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm font-medium ${selectedClient.risk_status ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{selectedClient.risk_status ? 'Unflag Risk' : 'Flag Risk'}</span>
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button onClick={handleVerify} className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 flex items-center space-x-2 shadow-sm">
                  <Check className="w-4 h-4" />
                  <span>Verify Client</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex gap-6 h-full">

                {/* Submitted Data Column (Wrapped) */}
                <div className="w-[35%] flex flex-col gap-6 h-full overflow-y-auto pr-2">
                  {/* Submitted Data Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-0 flex flex-col shrink-0 transition-colors">
                    <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted Data</h3>
                    </div>

                    <div className="p-6 space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Full Legal Name</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-white font-semibold text-lg">{selectedClient.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-500 fill-current bg-white dark:bg-gray-800 rounded-full" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">ID Number</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-white font-semibold text-lg">{selectedClient.id_number || selectedClient.national_id || 'N/A'}</span>
                          <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Date of Birth</label>
                          <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClient.dob || '01 Jan 1990'}</span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Gender</label>
                          <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClient.gender || 'Not Specified'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">KRA PIN</label>
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClient.kra_pin || 'Not Provided'}</span>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Email Address</label>
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClient.email || 'Not Provided'}</span>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Phone Number</label>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClient.phone_number || selectedClient.phone || 'N/A'}</span>
                          <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">OTP Verified</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1">Physical Address</label>
                        <p className="text-gray-900 dark:text-white font-medium text-sm leading-relaxed">
                          {selectedClient.address || 'Not Provided'}
                        </p>
                      </div>
                    </div>



                  </div>

                  {/* ADMIN CHECKS SECTION */}
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shrink-0">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                      Admin Checks
                    </h3>
                    <div className="space-y-3">
                      {['Identity Verified', 'Documents Authentic', 'Risk Assessment Cleared'].map((label) => (
                        <label key={label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer border border-transparent hover:border-gray-600">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800 transition-all"
                          />
                          <span className="text-gray-300 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document Proofs */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-0 flex flex-col h-full overflow-hidden transition-colors">
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document Proofs</h3>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 space-x-1">
                      {['front', 'back'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveDocTab(tab)}
                          className={`text-[11px] font-semibold px-4 py-1 rounded-md transition-all capitalize ${activeDocTab === tab ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                          {tab === 'front' ? 'ID Front' : 'ID Back'}
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-4 text-gray-400 dark:text-gray-500">
                      <button onClick={handleZoom} title={`Zoom (${imgZoom}x)`} className="hover:text-gray-600 transition">
                        <ZoomIn className="w-4 h-4 cursor-pointer" />
                      </button>
                      <button onClick={handleRotate} title="Rotate 90°" className="hover:text-gray-600 transition">
                        <RotateCw className="w-4 h-4 cursor-pointer" />
                      </button>
                      <button onClick={() => handleDownload(currentImageUrl)} title="Download" className="hover:text-gray-600 transition">
                        <Download className="w-4 h-4 cursor-pointer" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center relative overflow-hidden">
                    {currentImageUrl ? (
                      <div className="relative shadow-lg rounded-lg overflow-hidden group">
                        <img
                          src={currentImageUrl}
                          alt={`${activeDocTab} view`}
                          className="max-w-full max-h-[500px] object-contain transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `scale(${imgZoom}) rotate(${imgRotation}deg)`
                          }}
                        />
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                          id_document.jpg • {imgZoom > 1 ? `${imgZoom}x zoom` : 'Original'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
                          <span className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded"></span>
                        </div>
                        <p className="text-sm font-medium">No document uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 px-8 flex justify-center items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] shrink-0 z-20 transition-colors">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">i</div>
                <span className="text-xs">Verify all data matches the document before approving.</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 transition-colors">Select a client to view details.</div>
        )}
      </div>

      {/* Modals */}



    </div>
  );
};
export default ClientVerification;
