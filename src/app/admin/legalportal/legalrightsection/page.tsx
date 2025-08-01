'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  Eye,
  Users,
  Heart,
  Shield,
  Home,
  Briefcase,
  GraduationCap,
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  FileText
} from 'lucide-react';

interface Right {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  details: string[];
  status: 'active' | 'inactive';
  lastUpdated: string;
  views: number;
}

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  category: string;
  applyLink: string;
  status: 'active' | 'closed' | 'upcoming';
  lastUpdated: string;
  applications: number;
}

interface Resource {
  _id: string;
  title: string;
  language: string;
  size: string;
  format: string;
  downloads: number;
  uploadDate: string;
  status: 'active' | 'inactive';
  fileUrl?: string;
}

export default function AdminLegalRightsSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rights' | 'schemes' | 'resources'>('overview');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'right' | 'scheme' | 'resource'>('right');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rights, setRights] = useState<Right[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [removeCurrentFile, setRemoveCurrentFile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, s, res] = await Promise.all([
          fetch('http://localhost:5000/api/legalsec/rights').then(r => r.json()),
          fetch('http://localhost:5000/api/legalsec/schemes').then(r => r.json()),
          fetch('http://localhost:5000/api/legalsec/resources').then(r => r.json())
        ]);

        // Map the data to ensure consistent structure
        const mappedRights = r.map(item => ({
          ...item,
          icon: getCategoryIcon(item.category) // Add icon dynamically
        }));

        setRights(mappedRights);
        setSchemes(s);
        setResources(res);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // File Upload Function
  const handleFileUpload = async (file: File): Promise<{ url: string; size: number }> => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/legalsec/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Make sure your backend returns this structure
      return {
        url: data.fileUrl || data.url, // Handle both possible response formats
        size: data.fileSize || file.size
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Updated Add Modal Form Submission Handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    let url = '';
    let payload: any = {};
    let endpointType = '';

    if (addModalType === 'right') {
      payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        details: (data.details as string).split('\n').filter(Boolean),
      };
      url = 'http://localhost:5000/api/legalsec/rights';
      endpointType = 'right';
    } else if (addModalType === 'scheme') {
      payload = {
        name: data.title,
        description: data.description,
        category: data.category,
        eligibility: (data.eligibility as string).split('\n').filter(Boolean),
        benefits: (data.benefits as string).split('\n').filter(Boolean),
        applyLink: data.applyLink,
      };
      url = 'http://localhost:5000/api/legalsec/schemes';
      endpointType = 'scheme';
    } else if (addModalType === 'resource') {
      // Handle file upload for resources
      if (selectedFile) {
        try {
          const uploadResult = await handleFileUpload(selectedFile);
          payload = {
            title: data.title,
            language: data.language,
            format: data.format,
            fileUrl: uploadResult.url,
            size: formatFileSize(uploadResult.size),
            downloads: 0, // Initialize downloads
            uploadDate: new Date().toISOString().split('T')[0], // Current date
            status: 'active' // Default status
          };
        } catch (error) {
          alert('File upload failed. Please try again.');
          return;
        }
      } else {
        payload = {
          title: data.title,
          language: data.language,
          format: data.format,
          downloads: 0,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
      }
      url = 'http://localhost:5000/api/legalsec/resources';
      endpointType = 'resource';
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add');

      const newItem = await res.json();
      if (endpointType === 'right') setRights(prev => [...prev, newItem]);
      else if (endpointType === 'scheme') setSchemes(prev => [...prev, newItem]);
      else if (endpointType === 'resource') setResources(prev => [...prev, newItem]);

      setShowAddModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert('Failed to add item. Please try again.');
    }
  };

  // Updated Edit Modal Form Submission Handler
  const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const data = Object.fromEntries(formData.entries());

  let payload: any = {};
  let endpoint = '';
  let _id = editingItem._id;

  if (activeTab === 'rights') {
    payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      details: (data.details as string).split('\n').filter(Boolean),
      status: data.status,
    };
    endpoint = `http://localhost:5000/api/legalsec/rights/${_id}`;
  } else if (activeTab === 'schemes') {
    payload = {
      name: data.title,
      description: data.description,
      category: data.category,
      eligibility: (data.eligibility as string).split('\n').filter(Boolean),
      benefits: (data.benefits as string).split('\n').filter(Boolean),
      applyLink: data.applyLink,
      status: data.status,
    };
    endpoint = `http://localhost:5000/api/legalsec/schemes/${_id}`;
  } else if (activeTab === 'resources') {
    payload = {
      title: data.title,
      language: data.language,
      format: data.format,
      status: data.status,
    };

    // Handle file removal
    if (removeCurrentFile) {
      payload.fileUrl = null; // Remove the current file
      payload.size = '0 MB';
    }

    // Handle new file upload if selected
    if (selectedFile) {
      try {
        const uploadResult = await handleFileUpload(selectedFile);
        payload.fileUrl = uploadResult.url;
        payload.size = formatFileSize(uploadResult.size);
      } catch (error) {
        alert('File upload failed. Please try again.');
        return;
      }
    }

    endpoint = `http://localhost:5000/api/legalsec/resources/${_id}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Failed to update');
    const updatedItem = await res.json();

    if (activeTab === 'rights') {
      setRights(prev => prev.map(item => item._id === _id ? updatedItem : item));
    } else if (activeTab === 'schemes') {
      setSchemes(prev => prev.map(item => item._id === _id ? updatedItem : item));
    } else if (activeTab === 'resources') {
      setResources(prev => prev.map(item => item._id === _id ? updatedItem : item));
    }

    setEditingItem(null);
    setSelectedFile(null);
    setRemoveCurrentFile(false); // Reset the removal flag
  } catch (err) {
    console.error(err);
    alert('Failed to update item. Please try again.');
  }
};

  // Delete Function
  const handleDelete = async (type: 'right' | 'scheme' | 'resource', _id: string) => {
    if (!window.confirm('Are you sure?')) return;

    const url = `http://localhost:5000/api/legalsec/${type}s/${_id}`;
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      if (type === 'right') setRights(prev => prev.filter(i => i._id !== _id));
      if (type === 'scheme') setSchemes(prev => prev.filter(i => i._id !== _id));
      if (type === 'resource') setResources(prev => prev.filter(i => i._id !== _id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete item. Please try again.');
    }
  };

  // Get Category Icon Helper Function
  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'fundamental': <Shield className="w-6 h-6" />,
      'education': <GraduationCap className="w-6 h-6" />,
      'employment': <Briefcase className="w-6 h-6" />,
      'social': <Users className="w-6 h-6" />,
      'property': <Home className="w-6 h-6" />,
      'housing': <Home className="w-6 h-6" />,
      'agriculture': <Globe className="w-6 h-6" />,
      'health': <Heart className="w-6 h-6" />
    };
    return iconMap[category as keyof typeof iconMap] || <Shield className="w-6 h-6" />;
  };

  const stats = {
    totalRights: rights.length,
    activeRights: rights.filter(r => r.status === 'active').length,
    totalSchemes: schemes.length,
    activeSchemes: schemes.filter(s => s.status === 'active').length,
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    totalApplications: schemes.reduce((sum, s) => sum + s.applications, 0),
    totalViews: rights.reduce((sum, r) => sum + r.views, 0)
  };

  const toggleStatus = async (type: 'right' | 'scheme' | 'resource', _id: string) => {
    const currentList =
      type === 'right' ? rights :
        type === 'scheme' ? schemes : resources;

    const item = currentList.find(i => i._id === _id);
    if (!item) return;

    let newStatus = '';
    if (type === 'right' || type === 'resource') {
      newStatus = item.status === 'active' ? 'inactive' : 'active';
    } else if (type === 'scheme') {
      newStatus = item.status === 'active' ? 'closed' : 'active';
    }

    try {
      const res = await fetch(`http://localhost:5000/api/legalsec/${type}s/${_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to toggle');

      const updatedItem = await res.json();
      if (type === 'right') setRights(prev => prev.map(i => i._id === _id ? updatedItem : i));
      else if (type === 'scheme') setSchemes(prev => prev.map(i => i._id === _id ? updatedItem : i));
      else if (type === 'resource') setResources(prev => prev.map(i => i._id === _id ? updatedItem : i));
    } catch (err) {
      console.error(err);
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      case 'upcoming': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Rights & Schemes Management</h1>
            <p className="text-gray-600">Manage rights, government schemes, and downloadable resources</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'rights', label: 'Rights', icon: <Shield className="w-4 h-4" /> },
            { id: 'schemes', label: 'Schemes', icon: <Heart className="w-4 h-4" /> },
            { id: 'resources', label: 'Resources', icon: <Download className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRights}</div>
              <div className="text-gray-600">Legal Rights</div>
              <div className="text-sm text-green-600 mt-2">{stats.activeRights} active</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalSchemes}</div>
              <div className="text-gray-600">Welfare Schemes</div>
              <div className="text-sm text-green-600 mt-2">{stats.activeSchemes} active</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Downloads</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalDownloads.toLocaleString()}</div>
              <div className="text-gray-600">Resource Downloads</div>
              <div className="text-sm text-blue-600 mt-2">{stats.totalResources} resources</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalApplications.toLocaleString()}</div>
              <div className="text-gray-600">Scheme Applications</div>
              <div className="text-sm text-green-600 mt-2">+15% this month</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setAddModalType('right');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-blue-900">Add New Right</div>
                  <div className="text-sm text-blue-600">Create a new legal right entry</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setAddModalType('scheme');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-900">Add New Scheme</div>
                  <div className="text-sm text-green-600">Create a new welfare scheme</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setAddModalType('resource');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-purple-900">Add New Resource</div>
                  <div className="text-sm text-purple-600">Upload a new document</div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rights Tab */}
      {activeTab === 'rights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Legal Rights Management</h2>
            <button
              onClick={() => {
                setAddModalType('right');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Right
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {rights.map((right) => (
              <div key={right._id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {right.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{right.title}</h3>
                      <p className="text-gray-600 mt-1">{right.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Category: {right.category}</span>
                        <span>Updated: {right.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(right.status)}`}>
                      {getStatusIcon(right.status)}
                      {right.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Details:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {right.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(right)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete('right', right._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Welfare Schemes Management</h2>
            <button
              onClick={() => {
                setAddModalType('scheme');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Scheme
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme._id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                      {getCategoryIcon(scheme.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{scheme.name}</h3>
                      <p className="text-gray-600 mt-1">{scheme.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Category: {scheme.category}</span>
                        <span>Applications: {scheme.applications.toLocaleString()}</span>
                        <span>Updated: {scheme.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scheme.status)}`}>
                      {getStatusIcon(scheme.status)}
                      {scheme.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Eligibility:</h4>
                    <div className="space-y-1">
                      {scheme.eligibility.map((criterion, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          {criterion}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Benefits:</h4>
                    <div className="space-y-1">
                      {scheme.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600">Apply at:</span>
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {scheme.applyLink}
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(scheme)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete('scheme', scheme._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Resources Management</h2>
            <button
              onClick={() => {
                setAddModalType('resource');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resource.status)}`}>
                    {getStatusIcon(resource.status)}
                    {resource.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium">{resource.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">{resource.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{resource.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span className="font-medium">{resource.uploadDate}</span>
                    </div>
                  </div>
                </div>

                {resource.fileUrl && (
                  <div className="mb-4">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm w-full justify-center"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(resource)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete('resource', resource._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New {addModalType === 'right' ? 'Right' : addModalType === 'scheme' ? 'Scheme' : 'Resource'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {addModalType === 'scheme' ? 'Name' : 'Title'}
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${addModalType} ${addModalType === 'scheme' ? 'name' : 'title'}`}
                />
              </div>

              {addModalType !== 'resource' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>
              )}


              {(addModalType === 'right' || addModalType === 'scheme') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {addModalType === 'right' && (
                      <>
                        <option value="fundamental">Fundamental</option>
                        <option value="education">Education</option>
                        <option value="employment">Employment</option>
                        <option value="social">Social</option>
                        <option value="property">Property</option>
                      </>
                    )}
                    {addModalType === 'scheme' && (
                      <>
                        <option value="housing">Housing</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="employment">Employment</option>
                      </>
                    )}
                  </select>
                </div>
              )}


              {addModalType === 'right' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Details (one per line)</label>
                  <textarea
                    name="details"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter details, one per line"
                  />
                </div>
              )}

              {addModalType === 'scheme' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility (one per line)</label>
                    <textarea
                      name="eligibility"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter eligibility criteria, one per line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                    <textarea
                      name="benefits"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter benefits, one per line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Link</label>
                    <input
                      name="applyLink"
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}

              {addModalType === 'resource' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      name="language"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      name="format"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select format</option>
                      <option value="PDF">PDF</option>
                      <option value="DOC">DOC</option>
                      <option value="DOCX">DOCX</option>

                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleFileSelect}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, XLS, PPT up to 10MB
                        </p>
                        {selectedFile && (
                          <p className="text-sm text-green-600">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit {activeTab === 'rights' ? 'Right' : activeTab === 'schemes' ? 'Scheme' : 'Resource'}
                </h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setSelectedFile(null);
                    setRemoveCurrentFile(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'schemes' ? 'Name' : 'Title'}
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={activeTab === 'schemes' ? editingItem.name : editingItem.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {activeTab !== 'resources' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    defaultValue={editingItem.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}


              {(activeTab === 'rights' || activeTab === 'schemes') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    required
                    defaultValue={editingItem.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {activeTab === 'rights' && (
                      <>
                        <option value="fundamental">Fundamental</option>
                        <option value="education">Education</option>
                        <option value="employment">Employment</option>
                        <option value="social">Social</option>
                        <option value="property">Property</option>
                      </>
                    )}
                    {activeTab === 'schemes' && (
                      <>
                        <option value="housing">Housing</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="employment">Employment</option>
                      </>
                    )}
                  </select>
                </div>
              )}


              {activeTab === 'rights' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Details (one per line)</label>
                  <textarea
                    name="details"
                    required
                    rows={4}
                    defaultValue={editingItem.details?.join('\n')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {activeTab === 'schemes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility (one per line)</label>
                    <textarea
                      name="eligibility"
                      required
                      rows={3}
                      defaultValue={editingItem.eligibility?.join('\n')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                    <textarea
                      name="benefits"
                      required
                      rows={3}
                      defaultValue={editingItem.benefits?.join('\n')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Link</label>
                    <input
                      name="applyLink"
                      type="url"
                      required
                      defaultValue={editingItem.applyLink}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'resources' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      name="language"
                      required
                      defaultValue={editingItem.language}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      name="format"
                      required
                      defaultValue={editingItem.format}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select format</option>
                      <option value="PDF">PDF</option>
                      <option value="DOC">DOC</option>
                      <option value="DOCX">DOCX</option>
                    </select>
                  </div>

                  {/* Current File Display */}
            {editingItem.fileUrl && !removeCurrentFile && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Current File</h4>
                    <p className="text-sm text-gray-600">{editingItem.title}</p>
                    <p className="text-xs text-gray-500">
                      {editingItem.format} • {editingItem.size}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={editingItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => setRemoveCurrentFile(true)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* File Removal Confirmation */}
            {removeCurrentFile && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-medium text-red-900">File will be removed</h4>
                      <p className="text-sm text-red-700">The current file will be deleted when you save.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemoveCurrentFile(false)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            )}


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Replace File (optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a new file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleFileSelect}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, XLS, PPT up to 10MB
                        </p>
                        {selectedFile && (
                          <p className="text-sm text-green-600">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  required
                  defaultValue={editingItem.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isUploading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setSelectedFile(null);
                    setRemoveCurrentFile(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};