import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Eye, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';
import uploadService from '../../services/upload.service';
import { useToast } from '../../context/ToastContext';

const DocumentsTab = ({ bookingId }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [bookingId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      const mockDocuments = [
        {
          id: 1,
          name: 'Affidavit Draft.pdf',
          type: 'application/pdf',
          size: 245760,
          uploadedAt: '2025-12-20T10:30:00Z',
          status: 'uploaded',
          url: '#'
        },
        {
          id: 2,
          name: 'ID Copy.jpg',
          type: 'image/jpeg',
          size: 512000,
          uploadedAt: '2025-12-20T10:35:00Z',
          status: 'uploaded',
          url: '#'
        }
      ];
      setDocuments(mockDocuments);
    } catch (err) {
      showError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);

      // Upload file using upload service
      const uploadResult = await uploadService.uploadImage(file, {
        maxSize: 10 * 1024 * 1024, // 10MB for documents
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      });

      // Create document record
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
        url: uploadResult.url,
        cloudinaryId: uploadResult.publicId
      };

      setDocuments(prev => [...prev, newDocument]);
      success('Document uploaded successfully!');

    } catch (err) {
      showError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (document) => {
    // In a real app, this would trigger a download from the server
    // For now, we'll simulate it
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Download started');
  };

  const handleView = (document) => {
    // Open document in new tab
    window.open(document.url, '_blank');
  };

  const handleDelete = async (document) => {
    try {
      if (document.cloudinaryId) {
        await uploadService.deleteImage(document.cloudinaryId);
      }

      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      success('Document deleted successfully');

    } catch (err) {
      showError('Failed to delete document');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <img src="/file-image.svg" alt="Image" className="w-8 h-8" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Document Management</h3>
          <p className="text-sm text-gray-600">
            Upload and manage documents for your legal service booking
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Upload Documents</h4>
            <p className="text-sm text-gray-600 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
            </p>
          </div>

          <div className="mt-4">
            <ImageUpload
              onImageUploaded={handleFileUpload}
              label=""
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              allowedTypes={['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              showPreview={false}
              className="inline-block"
            />
          </div>

          {uploading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading document...</span>
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Uploaded Documents</h4>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs mt-1">Upload documents above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(document.type)}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">{document.name}</h5>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(document.size)}</span>
                      <span>Uploaded {formatDate(document.uploadedAt)}</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(document.status)}
                        <span className="capitalize">{document.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(document)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(document)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Document Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upload clear, legible copies of all required documents</li>
              <li>Ensure documents are not password-protected</li>
              <li>Maximum file size is 10MB per document</li>
              <li>Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
              <li>All uploads are encrypted and stored securely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
