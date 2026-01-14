import BackButton from '../../components/common/BackButton';

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, Check, Copy, Download, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AISummarizer = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const fileInputRef = useRef(null);

  const handleCopySummary = () => {
    if (!summary) return;

    const summaryText = `
Document Type: ${summary.documentType || 'Legal Document'}

${summary.parties ? `Parties:
- ${summary.parties.party1 || 'Party 1'}
- ${summary.parties.party2 || 'Party 2'}` : ''}

Summary:
${summary.executiveSummary || summary.summary || 'No summary available'}

${summary.alerts?.length > 0 ? `Alerts:
${summary.alerts.map(a => `- ${a.clause}: ${a.description}`).join('\n')}` : ''}
    `.trim();

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      toast.success('Summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast.error('Failed to copy');
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);

      // For text files, read as text
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For PDFs and other files, read as base64
        reader.readAsDataURL(file);
      }
    });
  };

  const processFile = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc|txt)$/i)) {
      toast.error('Please upload a PDF, DOCX, DOC, or TXT file');
      return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);
    setAnalyzing(true);

    try {
      // Step 1: Upload the document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const uploadRes = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const docId = uploadRes.data.document?.id || uploadRes.data.id;
      const documentUrl = uploadRes.data.document?.file_url || uploadRes.data.file_url;

      if (!docId) {
        throw new Error('Failed to get document ID from upload');
      }

      // Step 2: Read file content for summarization
      let fileContent = '';
      try {
        fileContent = await readFileContent(file);
        // If it's base64 encoded, extract just the content part for a simple description
        if (fileContent.startsWith('data:')) {
          // For binary files, send filename and type as context
          fileContent = `[Document: ${file.name}] - This is a ${file.type} document. Please provide a general summary based on common legal document structures.`;
        }
      } catch (readError) {
        console.warn('Could not read file content, using filename:', readError);
        fileContent = `[Document: ${file.name}]`;
      }

      // Step 3: Summarize the document - handle streaming response
      const summaryRes = await api.post(`/chat/summarize/${docId}`, {
        content: fileContent,
        document_url: documentUrl
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000 // 2 minutes timeout for AI processing
      });

      // Handle different response formats from Gemini
      let summaryData;
      if (typeof summaryRes.data === 'string') {
        // Handle plain text response
        summaryData = {
          summary: summaryRes.data,
          documentType: 'Legal Document',
          parties: null,
          alerts: []
        };
      } else {
        // Handle structured JSON response
        summaryData = summaryRes.data.summary || summaryRes.data || {};
      }

      // Extract content from various possible response structures
      const content = summaryData.content || summaryData.text || summaryData.summary || summaryData.response || summaryData.message;

      setSummary({
        documentType: summaryData.document_type || summaryData.documentType || summaryData.type || 'Legal Document',
        parties: summaryData.parties || null,
        executiveSummary: content || 'Analysis completed. Please check the summary details above.',
        alerts: summaryData.alerts || summaryData.risks || summaryData.warnings || []
      });

      // Add to recent uploads
      setRecentUploads(prev => [{
        id: docId,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: 'Just now'
      }, ...prev.slice(0, 4)]);

      setUploaded(true);
      toast.success('Document analyzed successfully!');

    } catch (error) {
      console.error('Error processing file:', error);

      // Show error and allow retry
      toast.error('Failed to analyze document. Please try again.');

      // Reset state to allow retry
      setSelectedFile(null);
      setAnalyzing(false);
      return;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeAnother = () => {
    setUploaded(false);
    setSelectedFile(null);
    setSummary(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <BackButton className="mb-4" />

        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-slate-500 dark:text-gray-400">
          <span>Home</span> <span className="mx-2">›</span>
          <span>Tools</span> <span className="mx-2">›</span>
          <span className="text-[#0A1E41] dark:text-white font-medium">AI Summarizer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#0A1E41] dark:text-white">AI Legal Document Summarizer</h1>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full uppercase">Beta Feature</span>
          </div>
          <p className="text-slate-500 dark:text-gray-400">
            Instantly analyze Kenyan contracts, court orders, and affidavits. Simplified for wananchi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6 transition-colors">
              <h3 className="font-bold text-[#0A1E41] dark:text-white mb-4">Source Document</h3>

              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${dragActive
                  ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#2563EB] hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-[#2563EB] dark:text-blue-400" />
                  </div>
                  <h4 className="font-bold text-[#0A1E41] dark:text-white mb-2">Drop your legal document here</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Supports PDF, DOCX, DOC, TXT (Max 20MB)</p>
                  <button
                    onClick={handleButtonClick}
                    className="px-6 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition"
                  >
                    Upload a file or drag and drop
                  </button>
                  {selectedFile && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-3 font-medium">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0A1E41] dark:text-gray-300 mb-2">LENGTH</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Standard</option>
                    <option>Brief</option>
                    <option>Detailed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1E41] dark:text-gray-300 mb-2">FOCUS</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Risk Analysis</option>
                    <option>Key Terms</option>
                    <option>Obligations</option>
                    <option>General Summary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            {recentUploads.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
                <h3 className="font-bold text-[#0A1E41] dark:text-white mb-4 text-sm uppercase tracking-wider">Recent Uploads</h3>
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1E41] dark:text-white truncate">{upload.name}</p>
                        <p className="text-xs text-slate-400 dark:text-gray-400">{upload.size} • {upload.uploadedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Results Section */}
          <div className="lg:col-span-2">
            {analyzing ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center transition-colors">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2563EB] mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-[#0A1E41] dark:text-white mb-2">Analyzing Document...</h3>
                <p className="text-slate-500 dark:text-gray-400">Our AI is reviewing your document for key insights</p>
              </div>
            ) : uploaded ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#0A1E41] dark:text-white">Executive Summary</h2>
                      <p className="text-xs text-slate-500 dark:text-gray-300">AI-generated analysis • Verified by Haki Yetu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
                    >
                      {copied ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Summary'}
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2">
                      <Download size={16} />
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Document Type */}
                  <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Document Type</p>
                    <p className="text-lg font-bold text-[#0A1E41] dark:text-white">{summary?.documentType || 'Legal Document'}</p>
                  </div>

                  {/* Parties - only show if available */}
                  {summary?.parties && (
                    <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Parties Involved</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-xs text-slate-400 dark:text-gray-400 mb-1">Party 1</p>
                          <p className="font-semibold text-[#0A1E41] dark:text-white">{summary.parties.party1 || 'Not specified'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-xs text-slate-400 dark:text-gray-400 mb-1">Party 2</p>
                          <p className="font-semibold text-[#0A1E41] dark:text-white">{summary.parties.party2 || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Summary</p>
                    <p className="text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{summary?.executiveSummary || 'No summary available.'}</p>
                  </div>

                  {/* Alerts - only show if available */}
                  {summary?.alerts?.length > 0 && summary.alerts.map((alert, index) => (
                    <div key={alert.id || index} className="mb-6 p-6 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">{alert.clause || alert.title || 'Alert'}</h4>
                          <p className="text-sm text-red-800 dark:text-red-300">{alert.description || alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Disclaimer */}
                  <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>AI-generated summary. Consult a verified Advocate for advice.</span>
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => navigate('/advocates')}
                      className="flex-1 py-3 bg-[#0A1E41] dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition"
                    >
                      Ask an Advocate
                    </button>
                    <button
                      onClick={handleAnalyzeAnother}
                      className="flex-1 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                      Analyze Another Document
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center transition-colors">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-[#2563EB] dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1E41] dark:text-white mb-2">Upload a Document to Begin</h3>
                <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto">
                  Our AI will analyze your legal document and provide a detailed summary with key insights and risk analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummarizer;
