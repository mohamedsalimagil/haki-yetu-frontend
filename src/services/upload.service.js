// Cloudinary upload service for handling image uploads and management
import api from './api.js';

class UploadService {
  constructor() {
    // Cloudinary configuration - in production, these would come from environment variables
    this.cloudinaryConfig = {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo-cloud',
      uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'haki-yetu-uploads',
      apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
      apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET
    };
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      minWidth = 100,
      minHeight = 100
    } = options;

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return true;
  }

  // Upload image to Cloudinary
  async uploadImage(file, options = {}) {
    try {
      // Validate file first
      this.validateFile(file, options);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
      formData.append('cloud_name', this.cloudinaryConfig.cloudName);

      // Add transformation parameters if specified
      if (options.width || options.height) {
        const transformations = [];
        if (options.width) transformations.push(`w_${options.width}`);
        if (options.height) transformations.push(`h_${options.height}`);
        if (options.crop) transformations.push(`c_${options.crop}`);
        formData.append('transformation', transformations.join(','));
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      return {
        publicId: data.public_id,
        url: data.secure_url,
        thumbnailUrl: this.getThumbnailUrl(data.public_id, 150, 150),
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes
      };

    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  // Generate thumbnail URL
  getThumbnailUrl(publicId, width = 150, height = 150) {
    return `https://res.cloudinary.com/${this.cloudinaryConfig.cloudName}/image/upload/c_thumb,w_${width},h_${height}/v1/${publicId}`;
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      // This would typically require server-side implementation for security
      // For now, we'll use the client-side approach (less secure)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_id: publicId,
            api_key: this.cloudinaryConfig.apiKey,
            timestamp: Math.floor(Date.now() / 1000),
            // signature would be generated server-side in production
          })
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Image delete error:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Get optimized image URL with transformations
  getOptimizedUrl(publicId, options = {}) {
    const { width, height, quality = 'auto', format = 'auto' } = options;
    let transformation = `f_${format},q_${quality}`;

    if (width) transformation += `,w_${width}`;
    if (height) transformation += `,h_${height}`;

    return `https://res.cloudinary.com/${this.cloudinaryConfig.cloudName}/image/upload/${transformation}/v1/${publicId}`;
  }

  // Batch upload multiple images
  async uploadMultipleImages(files, options = {}) {
    const uploadPromises = files.map(file => this.uploadImage(file, options));
    return Promise.allSettled(uploadPromises);
  }

  // Compress image before upload (client-side)
  async compressImage(file, options = {}) {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

const uploadService = new UploadService();
export default uploadService;
