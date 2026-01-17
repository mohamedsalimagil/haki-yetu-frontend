import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import api from '../../api/axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category_id: ''
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/admin/services');
      setServices(res.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      const errorMsg = error.response?.data?.message || 'Failed to load services';
      toast.error(errorMsg);
    }
  };

  const fetchCategories = async () => {
    try {
      // Better: Use the environment variable
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://haki-yetu-backend.onrender.com';
      const response = await axios.get(`${baseUrl}/marketplace/categories`);
      console.log("Categories API Response:", response.data); //  Debug log

      // SAFE GUARD: Check if response.data is the array, or if it's wrapped
      const categoryData = response.data;

      if (Array.isArray(categoryData)) {
        setCategories(categoryData);
      } else if (categoryData.categories && Array.isArray(categoryData.categories)) {
        // Handle case where backend returns { categories: [...] }
        setCategories(categoryData.categories);
      } else if (categoryData.data && Array.isArray(categoryData.data)) {
        // Handle case where backend returns { data: [...] }
        setCategories(categoryData.data);
      } else {
        console.warn("Unexpected categories format:", categoryData);
        setCategories([]); // Fallback to empty array to prevent crash
      }

    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Fallback to empty array
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService.id}`, formData);
        toast.success('Service updated successfully!');
      } else {
        await api.post('/admin/services', formData);
        toast.success('Service created successfully!');
      }

      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ name: '', description: '', base_price: '', category_id: '' });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save service. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      base_price: service.base_price,
      category_id: service.category_id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${id}`);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        const errorMsg = error.response?.data?.message || 'Failed to delete service';
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace Services</h1>
          <p className="text-gray-400">Manage available legal services and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({ name: '', description: '', base_price: '', category_id: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-gray-700 text-xs rounded-full text-blue-400 font-medium">
                {service.category_name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400 text-sm">Starting from</span>
              <span className="text-xl font-bold text-green-400">KES {service.base_price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Affidavit Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Select a Category</option>

                  {/* Check if 'categories' is actually an array before mapping */}
                  {Array.isArray(categories) && categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Price (KES)</label>
                <input
                  type="number"
                  required
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Brief description of the service..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Save size={20} />
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
