import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import uploadService from '../../services/upload.service';

const ImageUpload = ({
  onImageUploaded,
  onImageRemoved,
  currentImage = null,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = "",
  showPreview = true,
  circular = false,
  size = "md",
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { success, error: showError } = useToast();

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48"
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setError(null);
      setUploading(true);

      // Compress image if it's large
      let processedFile = file;
      if (file.size > 1024 * 1024) { // Compress if larger than 1MB
        processedFile = await uploadService.compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8
        });
      }

      // Upload to Cloudinary
      const uploadResult = await uploadService.uploadImage(processedFile, {
        maxSize,
        allowedTypes
      });

      onImageUploaded(uploadResult);
      success('Image uploaded successfully!');

    } catch (err) {
      setError(err.message);
      showError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = async () => {
    try {
      if (currentImage?.publicId) {
        await uploadService.deleteImage(currentImage.publicId);
      }
      onImageRemoved();
      success('Image removed successfully!');
    } catch (err) {
      showError('Failed to remove image');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Image Preview */}
        {showPreview && (
          <div className={`relative ${sizeClasses[size]}`}>
            {currentImage?.url ? (
              <div className="relative w-full h-full">
                <img
                  src={currentImage.thumbnailUrl || currentImage.url}
                  alt="Uploaded"
                  className={`w-full h-full object-cover ${
                    circular ? 'rounded-full' : 'rounded-lg'
                  } border-2 border-gray-200`}
                />
                {!disabled && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={!disabled ? triggerFileInput : undefined}
                onDrop={!disabled ? handleDrop : undefined}
                onDragOver={!disabled ? handleDragOver : undefined}
                onDragLeave={!disabled ? handleDragLeave : undefined}
                className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                } ${circular ? 'rounded-full' : ''}`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-gray-500">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm text-center">
                      {disabled ? 'Upload disabled' : 'Click to upload or drag & drop'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Max {maxSize / (1024 * 1024)}MB
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        {!currentImage?.url && !showPreview && (
          <button
            onClick={triggerFileInput}
            disabled={disabled || uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Choose Image</span>
              </>
            )}
          </button>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File Size Info */}
        <div className="text-xs text-gray-500 text-center">
          Supported formats: {allowedTypes.join(', ')} • Max size: {maxSize / (1024 * 1024)}MB
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
