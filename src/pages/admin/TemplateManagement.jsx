import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, Download, MoreVertical, Edit2, Trash2, X, UploadCloud, Loader } from 'lucide-react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../../services/adminService';
import { getFullUrl } from '../../utils/apiUtils';

const getDownloadUrl = (filePath) => {
  if (!filePath) return '#';
  // Extract just the filename (e.g., "contract.pdf") from the full path
  // Handle paths that might be full URLs or system paths or just filenames
  const filename = filePath.split(/[/\\]/).pop();
  return `http://127.0.0.1:5000/api/documents/download/${filename}`;
};

const TemplateManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);





  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    description: '',
    file: null
  });
  const [editingId, setEditingId] = useState(null);

  // --- FETCH DATA ---
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getTemplates();
      if (data && data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // --- ACTIONS ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.name || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingId && !formData.file) {
      alert('Please select a file');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description || '');
      if (formData.file) {
        data.append('file', formData.file);
      }

      let result;
      if (editingId) {
        result = await updateTemplate(editingId, data);
      } else {
        result = await createTemplate(data);
      }

      console.log('Success:', result);

      alert(editingId ? 'Template updated successfully' : 'Template uploaded successfully');
      setShowUploadModal(false);
      setFormData({ name: '', category: 'General', description: '', file: null });
      setEditingId(null);
      fetchTemplates();
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Failed to save template: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (template) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      file: null // Don't require file on edit unless changing
    });
    setShowUploadModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
        setTemplates(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
        alert('Failed to delete template.');
      }
    }
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'General', description: '', file: null });
    setShowUploadModal(true);
  };

  const handlePublishToggle = async (template) => {
    try {
      const newPublishedState = !template.published;
      await api.patch(`/api/documents/templates/${template.id}/publish`, {
        published: newPublishedState
      });
      toast.success(newPublishedState ? 'Template published to marketplace!' : 'Template unpublished from marketplace');
      fetchTemplates();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update publish status';
      toast.error(errorMsg);
    }
  };

  // --- FILTERING ---
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || t.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Legal Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage master document templates for the platform.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Template</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm flex justify-between items-center transition-colors">
        <div className="flex items-center space-x-4">
          {['All', 'Corporate', 'Civil', 'Criminal', 'Real Estate'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === 'All' ? 'all' : tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${(activeTab === 'all' && tab === 'All') || activeTab === tab
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" /></div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">No templates found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="relative">
                    <div className="flex space-x-1">
                      <button onClick={() => handleEdit(template)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(template.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" title={template.name}>{template.name}</h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 space-x-2">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{template.category}</span>
                  <span>•</span>
                  <span>Ver {template.version || '1.0'}</span>
                  <span>•</span>
                  <span>{template.date || 'Just now'}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10">
                  {template.description || "No description provided."}
                </p>
                <a
                  href={getDownloadUrl(template.file_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center space-x-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Template</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Template' : 'Upload Template'}</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Non-Disclosure Agreement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>General</option>
                  <option>Corporate</option>
                  <option>Civil</option>
                  <option>Criminal</option>
                  <option>Real Estate</option>
                  <option>Family</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description of the template..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document File</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200">
                  {editingId ? 'Save Changes' : 'Upload Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
