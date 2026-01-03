import React from 'react';
import {
  Search, Plus, FileText, MoreVertical,
  Edit2, Trash2, Download, Eye, Filter
} from 'lucide-react';

const TemplateManagement = () => {
  // Mock Data
  const templates = [
    { id: 'TMP-2024-001', name: 'Affidavit of Name Change', category: 'Civil Registration', version: '2.4', status: 'Active', date: 'Oct 24, 2023', author: 'Jane Doe', type: 'doc' },
    { id: 'TMP-2024-042', name: 'Standard Employment Contract', category: 'Human Resources', version: 'v1.1', status: 'Active', date: 'Nov 02, 2023', author: 'System Admin', type: 'doc' },
    { id: 'TMP-2024-089', name: 'Land Sale Agreement (Draft)', category: 'Property', version: 'v8.9', status: 'Draft', date: 'Yesterday', author: 'M. Kamau', type: 'draft' },
    { id: 'TMP-2022-011', name: 'NDA 2022 Agreement', category: 'Corporate', version: 'v3.9', status: 'Archived', date: 'Jan 10, 2023', author: 'System', type: 'archive' },
    { id: 'TMP-2024-656', name: 'Partnership Agreement', category: 'Corporate', version: 'v1.2', status: 'Active', date: 'Aug 15, 2023', author: 'J. Dee', type: 'doc' },
  ];

  return (
    <div className="space-y-6 bg-gray-50 p-8 h-[calc(100vh-64px)] overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Legal Template Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage master legal document templates for the Instant Document Generator.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
            <Download className="inline-block w-4 h-4 mr-2" />
            Export List
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 text-sm font-medium transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Upload New Template
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Templates', count: 142, icon: <FileText size={24}/>, bg: 'bg-blue-50 text-blue-600' },
          { title: 'Active', count: 115, icon: <CheckCircle size={24}/>, bg: 'bg-green-50 text-green-600' },
          { title: 'Drafts', count: 12, icon: <Edit2 size={24}/>, bg: 'bg-yellow-50 text-yellow-600' },
          { title: 'Archived', count: 15, icon: <Archive size={24}/>, bg: 'bg-gray-50 text-gray-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
             <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
               {card.icon}
             </div>
             <div>
               <span className="block text-gray-500 text-xs uppercase font-bold">{card.title}</span>
               <span className="block text-2xl font-bold text-gray-800">{card.count}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
         <div className="flex-1 relative">
           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
           <input
             type="text"
             placeholder="Search templates by title or keyword..."
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
           />
         </div>
         <div className="flex space-x-4">
           <div className="relative">
             <select className="appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 bg-white text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
               <option>All Categories</option>
               <option>Civil Registration</option>
               <option>Property</option>
               <option>Corporate</option>
             </select>
             <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
           </div>
           <div className="relative">
             <select className="appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 bg-white text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
               <option>All Statuses</option>
               <option>Active</option>
               <option>Draft</option>
               <option>Archived</option>
             </select>
             <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
           </div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Template Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Modified</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {templates.map((template, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      template.type === 'draft' ? 'bg-yellow-50 text-yellow-600' :
                      template.type === 'archive' ? 'bg-gray-100 text-gray-500' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div>
                       <div className="font-bold text-gray-800">{template.name}</div>
                       <div className="text-xs text-gray-400 font-mono">{template.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 border border-gray-200">
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{template.version}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${
                    template.status === 'Active' ? 'bg-green-100 text-green-700' :
                    template.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                       template.status === 'Active' ? 'bg-green-500' :
                       template.status === 'Draft' ? 'bg-yellow-500' :
                       'bg-gray-500'
                    }`}></span>
                    <span>{template.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="text-gray-900 font-medium">{template.date}</div>
                  <div className="text-xs text-gray-400">by {template.author}</div>
                </td>

                {/* --- UPDATED ACTIONS COLUMN --- */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View/Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer (Optional) */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <span>Showing 1-5 of 142 templates</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons (since we're inside the same file for this snippet)
const CheckCircle = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const Archive = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
);

export default TemplateManagement;
