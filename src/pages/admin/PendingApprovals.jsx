import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Mail, Phone, Building, Flag,
  Download, FileText, Image as ImageIcon, Eye,
  AlertTriangle, Send, CheckSquare, XCircle, CheckCircle,
  GripVertical, Loader, X
} from 'lucide-react';
import {
  getPendingLawyerApplications,
  approveLawyerApplication,
  rejectLawyerApplication
} from '../../services/adminService';
import { getFullUrl } from '../../utils/apiUtils';

// Backend base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://haki-yetu-backend.onrender.com';

const LawyerVerification = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sidebarRef = useRef(null);

  // Admin checks state
  const [adminChecks, setAdminChecks] = useState({
    identityVerified: false,
    lskConfirmed: false,
    documentsAuthentic: false
  });



  // Helper function to get lawyer name with robust fallbacks
  const getLawyerName = (lawyer) => {
    if (lawyer.name) return lawyer.name; // Combined string from backend
    if (lawyer.first_name && lawyer.last_name) return `${lawyer.first_name} ${lawyer.last_name}`; // CamelCase
    if (lawyer.first_name && lawyer.last_name) return `${lawyer.first_name} ${lawyer.last_name}`; // snake_case
    return "Unknown Lawyer"; // Final fallback
  };



  // --- FETCH DATA ---
  const fetchLawyers = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingLawyerApplications();

      // Debug: Log document URLs from backend
      console.log("📄 Backend lawyer data:", data);
      if (data.length > 0) {
        console.log("📎 First lawyer document URLs:", {
          practicing_certificate_url: data[0].practicing_certificate_url,
          national_id_url: data[0].national_id_url,
          id_front_url: data[0].id_front_url,
          resume_url: data[0].resume_url,
          cv_url: data[0].cv_url
        });
      }

      // Map backend data to frontend structure if necessary, or use directly
      const formattedData = data.map(l => {
        // Use helper function for robust name handling
        const lawyerName = getLawyerName(l);
        return {
          id: l.id,
          user_id: l.id, // Explicitly map user_id for chat
          name: lawyerName,
          lsk: l.lsk_number || l.id_number || 'N/A',
          lsk_number: l.lsk_number,
          type: l.specialization || 'General',
          specialization: l.specialization,
          experience_years: l.experience_years,
          bio: l.bio,
          bar_admission_date: l.bar_admission_date,
          status: l.verification_status === 'pending' ? 'PENDING' : (l.verification_status || 'PENDING').toUpperCase(),
          statusColor: l.verification_status === 'pending' ? 'yellow' : 'green',
          location: l.county || 'Nairobi, KE',
          submitted: l.created_at ? new Date(l.created_at).toLocaleDateString() : 'N/A',
          email: l.email,
          phone: l.phone || l.phone_number,
          firm: l.firm_name || 'N/A',
          initials: lawyerName !== "Unknown Lawyer" ? lawyerName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'UL',
          // Personal details
          gender: l.gender,
          id_number: l.id_number,
          kra_pin: l.kra_pin,
          date_of_birth: l.date_of_birth || l.dob,
          address: l.address,
          // Document URLs from backend
          practicing_certificate_url: l.practicing_certificate_url,
          national_id_url: l.national_id_url || l.id_front_url,
          id_front_url: l.id_front_url,
          id_back_url: l.id_back_url,
          resume_url: l.resume_url || l.cv_url,
          bar_certificate_url: l.bar_certificate_url,
          // Build docs array with robust fallbacks
          docs: [
            (l.practicing_certificate_url || l.certificate_url || l.practicing_certificate) && { name: "Practicing Certificate", url: l.practicing_certificate_url || l.certificate_url || l.practicing_certificate, type: "PDF", size: "Document" },
            (l.national_id_url || l.id_front_url || l.identification_document || l.id_document || l.id_card_url) && { name: "National ID", url: l.national_id_url || l.id_front_url || l.identification_document || l.id_document || l.id_card_url, type: "Image", size: "Document" },
            l.id_back_url && { name: "National ID (Back)", url: l.id_back_url, type: "Image", size: "Document" },
            (l.resume_url || l.cv_url || l.curriculum_vitae) && { name: "Curriculum Vitae", url: l.resume_url || l.cv_url || l.curriculum_vitae, type: "PDF", size: "Document" },
            l.bar_certificate_url && { name: "Bar Certificate", url: l.bar_certificate_url, type: "PDF", size: "Document" }
          ].filter(Boolean),
          flag: { active: false }
        };
      });
      setLawyers(formattedData);
      if (formattedData.length > 0) setSelectedId(formattedData[0].id);
    } catch (error) {
      console.error("Failed to fetch pending lawyers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  // Get the data for the currently selected lawyer
  const selectedLawyer = lawyers.find(l => l.id === selectedId);

  // --- ACTIONS ---
  const handleVerify = async () => {
    if (!selectedLawyer) return;
    if (confirm(`Are you sure you want to verify ${selectedLawyer.name}?`)) {
      try {
        await approveLawyerApplication(selectedLawyer.id);
        alert('Lawyer verified successfully!');
        // Remove from list
        setLawyers(prev => prev.filter(l => l.id !== selectedLawyer.id));
        setSelectedId(null);
        // fetchLawyers(); // Optional: refresh list
      } catch (error) {
        console.error("Verification failed:", error);
        alert('Failed to verify lawyer.');
      }
    }
  };

  const handleReject = async () => {
    if (!selectedLawyer) return;
    const reason = prompt("Enter rejection reason:", "Documents did not meet requirements.");
    if (reason) {
      try {
        await rejectLawyerApplication(selectedLawyer.id, { rejection_reason: reason });
        alert('Lawyer rejected.');
        setLawyers(prev => prev.filter(l => l.id !== selectedLawyer.id));
        setSelectedId(null);
      } catch (error) {
        console.error("Rejection failed:", error);
        alert('Failed to reject lawyer.');
      }
    }
  };

  // Download All documents handler
  const handleDownloadAll = async () => {
    if (!selectedLawyer?.docs || selectedLawyer.docs.length === 0) {
      alert('No documents available to download.');
      return;
    }

    for (const doc of selectedLawyer.docs) {
      try {
        const fullUrl = getFullUrl(doc.url);
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = `${selectedLawyer.name}_${doc.name}`.replace(/\s+/g, '_');
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Small delay to ensure browser handles multiple downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Download failed for', doc.name, error);
      }
    }
  };

  // Flag Risk handler - persists to database
  const handleFlagRisk = async () => {
    if (!selectedLawyer) return;
    try {
      const response = await api.post(`/admin/users/${selectedLawyer.id}/flag`);
      // Update local state
      setLawyers(lawyers.map(l => l.id === selectedLawyer.id ? { ...l, risk_status: response.data.risk_status } : l));
    } catch (error) {
      console.error("Flag risk failed", error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden select-none transition-colors" ref={sidebarRef}>

      {/* ---------------- LEFT SIDEBAR (RESIZABLE) ---------------- */}
      <div
        style={{ width: sidebarWidth }}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-none"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 dark:text-white">Verification Queue</h2>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded">
              {lawyers.length} Pending
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Toggle */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors">
            <button
              onClick={() => setActiveTab('pending')}
              className={`text-xs font-semibold py-1.5 rounded-md text-center transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`text-xs font-semibold py-1.5 rounded-md text-center transition-all ${activeTab === 'reviewed' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              Reviewed
            </button>
          </div>
        </div>

        {/* List of Applicants (Interactive) */}
        <div className="overflow-y-auto flex-1">
          {lawyers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No pending applications.</div>
          ) : (
            lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                onClick={() => setSelectedId(lawyer.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer group relative transition-colors ${selectedId === lawyer.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
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
                        <img src={getFullUrl(lawyer.profile_picture_url || `https://i.pravatar.cc/150?img=${lawyer.id}`)} alt={lawyer.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{getLawyerName(lawyer)}</h4>
                      <p className="text-xs text-gray-500 truncate">{lawyer.lsk} • {lawyer.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    {lawyer.risk_status && <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-1 rounded">RISK</span>}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lawyer.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                      {lawyer.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pl-13 ml-12">
                  <p className="text-xs text-gray-400">{lawyer.submitted}</p>
                  {selectedId === lawyer.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                </div>
              </div>
            ))
          )}
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
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900 min-w-[500px] transition-colors">
        {selectedLawyer ? (
          <>
            {/* Detail Header */}
            <div className="bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm shrink-0">
                  {selectedLawyer.initials ? (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-300">{selectedLawyer.initials}</div>
                  ) : (
                    <img src={getFullUrl(selectedLawyer.profile_picture_url || `https://i.pravatar.cc/150?img=${selectedLawyer.id}`)} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getLawyerName(selectedLawyer)}</h1>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-200 dark:border-yellow-700">
                      {selectedLawyer.status} REVIEW
                    </span>
                    {selectedLawyer.risk_status && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide animate-pulse">HIGH RISK</span>}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">💼</span>
                      <span className="text-xs uppercase font-bold text-gray-400 dark:text-gray-500">LSK No:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{selectedLawyer.lsk}</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{selectedLawyer.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">

                <button
                  onClick={handleFlagRisk}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium ${selectedLawyer.risk_status ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400' : 'bg-white dark:bg-gray-700 border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{selectedLawyer.risk_status ? 'Unflag Risk' : 'Flag Risk'}</span>
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleVerify}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm shadow-green-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify & Activate</span>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900 transition-colors">
              <div className="flex space-x-6 border-b border-gray-100 dark:border-gray-700 mb-6">
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-2 px-1">Submitted Data</button>
              </div>

              <div className="grid grid-cols-2 gap-8 items-start">

                {/* -------- LEFT COLUMN -------- */}
                <div className="space-y-6">

                  {/* Lawyer Information Card - NEW */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-colors">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Lawyer Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">LSK Number</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.lsk_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Specialization</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.specialization || 'General Law'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Experience (Years)</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.experience_years || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Gender</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.gender || 'N/A'}</p>
                        </div>
                      </div>
                      {selectedLawyer.bar_admission_date && (
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Bar Admission Date</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{new Date(selectedLawyer.bar_admission_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedLawyer.bio && (
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Bio</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedLawyer.bio}</p>
                        </div>
                      )}
                      {selectedLawyer.kra_pin && (
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">KRA PIN</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.kra_pin}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Practice Areas Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-colors">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Practice Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium border border-gray-200 dark:border-gray-600">{selectedLawyer.type}</span>
                    </div>
                  </div>

                </div>

                {/* -------- RIGHT COLUMN -------- */}
                <div className="space-y-6">

                  {/* Submitted Credentials Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-colors">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Submitted Credentials</h3>
                      <button
                        onClick={handleDownloadAll}
                        className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Download All ({selectedLawyer.docs.length})
                      </button>
                    </div>
                    <div className="space-y-4">
                      {selectedLawyer.docs.length > 0 ? selectedLawyer.docs.map((doc, idx) => (
                        <div key={idx} className="flex items-center group cursor-pointer">
                          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg flex items-center justify-center mr-3"><FileText className="w-5 h-5" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{doc.type} • {doc.size} • Uploaded today</p>
                          </div>
                          <div className="flex space-x-3 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={getFullUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              <Eye className="w-5 h-5" />
                            </a>
                            <a href={getFullUrl(doc.url)} download className="hover:text-blue-600">
                              <Download className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">No documents available.</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Details Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-colors">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Contact Details</h3>
                    <div className="space-y-5">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500"><Mail className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email Address</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500"><Phone className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedLawyer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Automated System Flag (Conditional) */}
                  {selectedLawyer.flag && selectedLawyer.flag.active && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-100 dark:border-orange-800 p-5 transition-colors">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-orange-900 dark:text-orange-300 text-sm">Automated System Flag</h4>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mt-2 leading-relaxed">
                            {selectedLawyer.flag.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Admin Checks Card - Moved from left column */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-colors">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Admin Checks</h3>
                    <div className="space-y-4">
                      <label
                        className="flex items-center space-x-3 cursor-pointer select-none"
                        onClick={() => setAdminChecks(prev => ({ ...prev, identityVerified: !prev.identityVerified }))}
                      >
                        <div className={`${adminChecks.identityVerified ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'} rounded w-5 h-5 flex items-center justify-center transition-colors`}>
                          {adminChecks.identityVerified && <CheckSquare className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-sm font-medium ${adminChecks.identityVerified ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>Identity Verified</span>
                      </label>
                      <label
                        className="flex items-center space-x-3 cursor-pointer select-none"
                        onClick={() => setAdminChecks(prev => ({ ...prev, lskConfirmed: !prev.lskConfirmed }))}
                      >
                        <div className={`${adminChecks.lskConfirmed ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'} rounded w-5 h-5 flex items-center justify-center transition-colors`}>
                          {adminChecks.lskConfirmed && <CheckSquare className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-sm font-medium ${adminChecks.lskConfirmed ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>LSK Portal Confirmed</span>
                      </label>
                      <label
                        className="flex items-center space-x-3 cursor-pointer select-none"
                        onClick={() => setAdminChecks(prev => ({ ...prev, documentsAuthentic: !prev.documentsAuthentic }))}
                      >
                        <div className={`${adminChecks.documentsAuthentic ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'} rounded w-5 h-5 flex items-center justify-center transition-colors`}>
                          {adminChecks.documentsAuthentic && <CheckSquare className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-sm font-medium ${adminChecks.documentsAuthentic ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>Documents Authentic</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Select an applicant to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerVerification;
