import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, ShoppingCart, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TemplateMarketplace = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/documents/marketplace/templates');
      setTemplates(res.data);
    } catch (error) {
      console.error("Failed to load templates", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (template) => {
    try {
      // Initiate purchase request
      const response = await api.post(`/documents/marketplace/templates/${template.id}/purchase`);

      // Redirect to checkout with purchase data
      navigate('/checkout', {
        state: {
          service: template.name,
          amount: template.price,
          type: 'TEMPLATE',
          item: template,
          purchaseRef: response.data.purchase_ref || response.data.reference
        }
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  const handleDownload = (template) => {
    // Free: Direct Download - Handle both Cloudinary URLs and local paths
    const downloadUrl = template.file_url || template.file_path;
    if (downloadUrl) {
      if (downloadUrl.startsWith('http')) {
        // Cloudinary URL
        window.open(downloadUrl, '_blank');
      } else {
        // Local path - construct full URL
        const apiBase = import.meta.env.VITE_API_BASE || 'https://haki-yetu-backend.onrender.com';
        const fullUrl = `${apiBase}/api/documents/download/${downloadUrl.split('/').pop()}`;
        window.open(fullUrl, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Legal Templates</h1>
          <p className="text-gray-400">Professional legal documents ready for download.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                  {template.category || 'General'}
                </div>
                <span className="text-lg font-bold text-white">
                  {template.price > 0 ? `KES ${template.price.toLocaleString()}` : 'Free'}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {template.description || template.desc || "No description available"}
              </p>

              <button
                onClick={() => template.price > 0 ? handlePurchase(template) : handleDownload(template)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {template.price > 0 ? <ShoppingCart size={18} /> : <Download size={18} />}
                {template.price > 0 ? 'Purchase' : 'Download Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateMarketplace;
