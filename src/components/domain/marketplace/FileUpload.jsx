import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

const FileUpload = ({ orderId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]; // We only take the first file for now
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/marketplace/orders/${orderId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      if (onUploadSuccess) onUploadSuccess(response.data.document);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Upload failed. Try a different file.' });
    } finally {
      setUploading(false);
    }
  }, [orderId, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mt-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          {isDragActive ? (
            <p className="text-primary font-bold">Drop the file here...</p>
          ) : (
            <>
              <p className="font-medium text-gray-700">Drag & drop a document here</p>
              <p className="text-xs text-gray-400 mt-1">or click to select (PDF, JPG, DOC)</p>
            </>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mt-3 flex items-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
          {message.text}
        </div>
      )}
    </div>
  );
};

export default FileUpload;