import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Download, Eye, FolderOpen, Inbox } from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const MyDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await api.get('/client/documents');
        setDocuments(response.data?.documents || []);
      } catch (err) {
        console.error("Failed to load docs:", err);
        // No mock fallback - show empty state
        setDocuments([]);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <BackButton className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <FolderOpen className="w-8 h-8 mr-3 text-primary" />
          My Document Repository
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate" title={doc.original_name}>
                  {doc.original_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Generated File</p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(doc.url, doc.filename)}
                    className="flex-1 flex items-center justify-center py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </button>
                </div>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="col-span-3 text-center py-16">
                <Inbox className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No Documents Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Documents shared by your lawyer will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
