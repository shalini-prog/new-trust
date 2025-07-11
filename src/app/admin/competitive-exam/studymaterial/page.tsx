'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSave, 
  FaTimes, 
  FaEye,
  FaUpload,
  FaDownload,
  FaStar,
  FaSort,
  FaFile,
  FaImage,
  FaFileAlt
} from 'react-icons/fa';

interface StudyMaterial {
  _id: string;
  title: string;
  category: string;
  type: string;
  subject: string;
  thumbnail: string;
  downloadUrl: string;
  rating: number;
  downloads: number;
  date: string;
  description?: string;
  fileSize?: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function AdminStudyMaterials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'downloads' | 'rating' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<StudyMaterial>>({
    title: '',
    category: 'ncert',
    type: 'Book',
    subject: '',
    thumbnail: '',
    downloadUrl: '',
    rating: 0,
    downloads: 0,
    description: '',
    fileSize: '',
    status: 'active'
  });

  const [selectedFiles, setSelectedFiles] = useState<{
    thumbnail: File | null;
    material: File | null;
  }>({
    thumbnail: null,
    material: null
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ncert', label: 'NCERT Books' },
    { value: 'standard', label: 'Standard Books' },
    { value: 'notes', label: 'Topic-Wise Notes' },
    { value: 'handwritten', label: 'Handwritten Notes' },
    { value: 'videos', label: 'Video Lectures' },
    { value: 'current', label: 'Current Affairs' }
  ];

  const materialTypes = ['Book', 'Notes', 'Video', 'Paper', 'Guide'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/emat');
      setMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  // Fixed upload functions with proper error handling
  const uploadThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadStatus('Uploading thumbnail...');
      const res = await axios.post('http://localhost:5000/api/emat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress / 2); // Half progress for thumbnail
          }
        }
      });

      if (res.data && res.data.url) {
        return res.data.url;
      } else {
        throw new Error('Invalid response from thumbnail upload');
      }
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      throw new Error('Failed to upload thumbnail');
    }
  };

  const uploadMaterialFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading material file...');
      const res = await axios.post('http://localhost:5000/api/emat/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(50 + (progress / 2)); // Second half of progress
          }
        }
      });

      if (res.data && res.data.url) {
        return res.data.url;
      } else {
        throw new Error('Invalid response from file upload');
      }
    } catch (err) {
      console.error('Material file upload failed:', err);
      throw new Error('Failed to upload material file');
    }
  };

  const handleFileSelect = (type: 'thumbnail' | 'material', file: File) => {
    // File size validation
    const maxSize = type === 'thumbnail' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for thumbnail, 100MB for material
    
    if (file.size > maxSize) {
      alert(`File size too large. Maximum size is ${type === 'thumbnail' ? '10MB' : '100MB'}`);
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [type]: file
    }));

    if (type === 'material') {
      // Auto-calculate file size
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        fileSize: `${sizeInMB} MB`
      }));
    }
  };

  const handleAddMaterial = async () => {
    try {
      // Validation
      if (!formData.title || !formData.subject || !formData.category) {
        alert('Please fill in all required fields');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('Starting upload...');

      let thumbnailUrl = formData.thumbnail || '';
      let downloadUrl = formData.downloadUrl || '';

      // Upload files if selected
      if (selectedFiles.thumbnail) {
        thumbnailUrl = await uploadThumbnail(selectedFiles.thumbnail);
      }

      if (selectedFiles.material) {
        downloadUrl = await uploadMaterialFile(selectedFiles.material);
      }

      // Prepare material data
      const materialData = {
        title: formData.title,
        category: formData.category,
        type: formData.type,
        subject: formData.subject,
        rating: formData.rating || 0,
        downloads: formData.downloads || 0,
        description: formData.description || '',
        fileSize: formData.fileSize || '',
        status: formData.status || 'active',
        thumbnail: thumbnailUrl,
        downloadUrl: downloadUrl
      };

      setUploadStatus('Saving material...');
      setUploadProgress(90);

      const res = await axios.post('http://localhost:5000/api/emat', materialData);

      if (res.data) {
        setMaterials(prev => [...prev, res.data]);
        setShowAddModal(false);
        resetForm();
        setUploadProgress(100);
        setUploadStatus('Upload complete!');
        
        // Clear status after 2 seconds
        setTimeout(() => {
          setUploadStatus('');
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Add Material Failed:', error);
      alert(`Failed to add material: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditMaterial = async () => {
    if (!selectedMaterial) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('Starting update...');

      let thumbnailUrl = formData.thumbnail || '';
      let downloadUrl = formData.downloadUrl || '';

      // Upload new files if selected
      if (selectedFiles.thumbnail) {
        thumbnailUrl = await uploadThumbnail(selectedFiles.thumbnail);
      }

      if (selectedFiles.material) {
        downloadUrl = await uploadMaterialFile(selectedFiles.material);
      }

      const materialData = {
        title: formData.title,
        category: formData.category,
        type: formData.type,
        subject: formData.subject,
        rating: formData.rating || 0,
        downloads: formData.downloads || 0,
        description: formData.description || '',
        fileSize: formData.fileSize || '',
        status: formData.status || 'active',
        thumbnail: thumbnailUrl,
        downloadUrl: downloadUrl
      };

      setUploadStatus('Updating material...');
      setUploadProgress(90);

      const response = await axios.put(`http://localhost:5000/api/emat/${selectedMaterial._id}`, materialData);

      if (response.data) {
        setMaterials(prev =>
          prev.map(m => (m._id === selectedMaterial._id ? response.data : m))
        );
        setShowEditModal(false);
        setSelectedMaterial(null);
        resetForm();
        setUploadProgress(100);
        setUploadStatus('Update complete!');
        
        // Clear status after 2 seconds
        setTimeout(() => {
          setUploadStatus('');
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Update failed:', error);
      alert(`Failed to update material: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/emat/${id}`);
      setMaterials(prev => prev.filter(material => material._id !== id));
      setShowDeleteConfirm(false);
      setMaterialToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete material');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'ncert',
      type: 'Book',
      subject: '',
      thumbnail: '',
      downloadUrl: '',
      rating: 0,
      downloads: 0,
      description: '',
      fileSize: '',
      status: 'active'
    });
    setSelectedFiles({
      thumbnail: null,
      material: null
    });
    setUploadProgress(0);
    setUploadStatus('');
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEditModal = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      category: material.category,
      type: material.type,
      subject: material.subject,
      thumbnail: material.thumbnail,
      downloadUrl: material.downloadUrl,
      rating: material.rating,
      downloads: material.downloads,
      description: material.description,
      fileSize: material.fileSize,
      status: material.status
    });
    setShowEditModal(true);
  };

  // Filter and sort materials
  const filteredMaterials = materials
    .filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || material.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials Management</h1>
              <p className="text-gray-600">Manage your educational resources and study materials</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus /> Add New Material
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaDownload className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Materials</p>
                <p className="text-2xl font-bold text-green-600">
                  {materials.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaEye className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">
                  {materials.reduce((sum, m) => sum + m.downloads, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaDownload className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {materials.length > 0 ? (materials.reduce((sum, m) => sum + m.rating, 0) / materials.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaStar className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="downloads">Sort by Downloads</option>
                <option value="rating">Sort by Rating</option>
                <option value="title">Sort by Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaSort className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex-shrink-0 mr-4">
                          <img 
                            src={material.thumbnail || '/placeholder.jpg'} 
                            alt={material.title}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{material.title}</div>
                          <div className="text-sm text-gray-500">{material.type} • {material.fileSize}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {material.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FaStar className="text-yellow-400 mr-1" size={12} />
                          {material.rating}
                        </div>
                        <div className="flex items-center">
                          <FaDownload className="text-gray-400 mr-1" size={12} />
                          {material.downloads.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(material.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(material)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setMaterialToDelete(material._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showAddModal ? 'Add New Material' : 'Edit Material'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category || 'ncert'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type || 'Book'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {materialTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating || 0}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Downloads</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.downloads || 0}
                      onChange={(e) => setFormData({...formData, downloads: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'pending'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
                    <input
                      type="text"
                      value={formData.fileSize || ''}
                      onChange={(e) => setFormData({...formData, fileSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 15.5 MB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                    <input
                      type="url"
                      value={formData.thumbnail || ''}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Download URL</label>
                    <input
                      type="url"
                      value={formData.downloadUrl || ''}
                      onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/material.pdf"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">File Upload</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect('thumbnail', file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {selectedFiles.thumbnail && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {selectedFiles.thumbnail.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Material File</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect('material', file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {selectedFiles.material && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {selectedFiles.material.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {(isUploading || uploadProgress > 0) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{uploadStatus}</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showAddModal ? handleAddMaterial : handleEditMaterial}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        {showAddModal ? 'Adding...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {showAddModal ? 'Add Material' : 'Update Material'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <FaTrash className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Material
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this material? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setMaterialToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => materialToDelete && handleDeleteMaterial(materialToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaFile className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first study material.'}
            </p>
            {!searchQuery && filterStatus === 'all' && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <FaPlus /> Add First Material
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}