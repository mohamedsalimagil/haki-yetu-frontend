import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileText, Download, Eye, FolderOpen } from 'lucide-react';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We need a route to "Get All My Documents". 
    // Since we haven't built a specific one, we will fetch orders and extract docs, 
    // OR we can quickly add a route. For now, let's mock the display logic or 
    // assume we fetch from a new endpoint we'll create in a second.
    const fetchDocs = async () => {
      try {
        // Let's add this endpoint to backend in Step 6
        const response = await api.get('/api/marketplace/documents/user/1');
        setDocuments(response.data);
      } catch (err) {
        console.error("Failed to load docs");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDownload = (url, filename) => {
    // Create a temporary link to force download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <FolderOpen className="w-8 h-8 mr-3 text-primary" />
          My Document Repository
        </h1>

        {loading ? (
          <p>Loading files...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-primary">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-1 truncate" title={doc.original_name}>
                  {doc.original_name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">Generated File</p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleDownload(doc.url, doc.filename)}
                    className="flex-1 flex items-center justify-center py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </button>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-400">
                You have no documents yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
