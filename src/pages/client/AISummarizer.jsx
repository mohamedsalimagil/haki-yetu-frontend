import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Sparkles, Download } from 'lucide-react';
import { aiSummarizerData } from '../../data/mockChatData';

const AISummarizer = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-slate-500">
          <span>Home</span> <span className="mx-2">›</span>
          <span>Tools</span> <span className="mx-2">›</span>
          <span className="text-[#0A1E41] font-medium">AI Summarizer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#0A1E41]">AI Legal Document Summarizer</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Beta Feature</span>
          </div>
          <p className="text-slate-500">
            Instantly analyze Kenyan contracts, court orders, and affidavits. Simplified for wananchi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-[#0A1E41] mb-4">Source Document</h3>
              
              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive 
                    ? 'border-[#2563EB] bg-blue-50' 
                    : 'border-gray-300 hover:border-[#2563EB] hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-[#2563EB]" />
                  </div>
                  <h4 className="font-bold text-[#0A1E41] mb-2">Drop your legal document here</h4>
                  <p className="text-sm text-slate-500 mb-4">Supports PDF, DOCX (Max 20MB)</p>
                  <button className="px-6 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition">
                    Upload a file or drag and drop
                  </button>
                  <p className="text-xs text-slate-400 mt-3">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Options */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0A1E41] mb-2">LENGTH</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                    <option>Standard</option>
                    <option>Brief</option>
                    <option>Detailed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1E41] mb-2">FOCUS</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                    <option>Risk Analysis</option>
                    <option>Key Terms</option>
                    <option>Obligations</option>
                    <option>General Summary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            {aiSummarizerData.recentUploads.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-[#0A1E41] mb-4 text-sm uppercase tracking-wider">Recent Uploads</h3>
                <div className="space-y-3">
                  {aiSummarizerData.recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1E41] truncate">{upload.name}</p>
                        <p className="text-xs text-slate-400">{upload.size} • {upload.uploadedAt}</p>
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2563EB] mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-[#0A1E41] mb-2">Analyzing Document...</h3>
                <p className="text-slate-500">Our AI is reviewing your document for key insights</p>
              </div>
            ) : uploaded ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#0A1E41]">Executive Summary</h2>
                      <p className="text-xs text-slate-500">AI-generated analysis • Verified by Haki Yetu</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-slate-600 font-medium rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                    <Download size={16} />
                    Export PDF
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Document Type */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-sm text-slate-500 mb-2">Document Type</p>
                    <p className="text-lg font-bold text-[#0A1E41]">{aiSummarizerData.sampleSummary.documentType}</p>
                  </div>

                  {/* Parties */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Parties Involved</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Party 1</p>
                        <p className="font-semibold text-[#0A1E41]">{aiSummarizerData.sampleSummary.parties.party1}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Party 2</p>
                        <p className="font-semibold text-[#0A1E41]">{aiSummarizerData.sampleSummary.parties.party2}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Summary</p>
                    <p className="text-slate-700 leading-relaxed">{aiSummarizerData.sampleSummary.executiveSummary}</p>
                  </div>

                  {/* Alerts */}
                  {aiSummarizerData.sampleSummary.alerts.map((alert) => (
                    <div key={alert.id} className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 mb-2">{alert.clause}</h4>
                          <p className="text-sm text-red-800">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Disclaimer */}
                  <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-xs text-yellow-800 flex items-start gap-2">
                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>AI-generated summary. Consult a verified Advocate for advice.</span>
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex gap-4">
                    <button className="flex-1 py-3 bg-[#0A1E41] text-white font-bold rounded-xl hover:bg-slate-800 transition">
                      Ask an Advocate
                    </button>
                    <button className="flex-1 py-3 bg-white border-2 border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition">
                      Analyze Another Document
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1E41] mb-2">Upload a Document to Begin</h3>
                <p className="text-slate-500 max-w-md mx-auto">
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
