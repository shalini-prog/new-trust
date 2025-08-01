'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Image, 
  Plus, 
  Eye, 
  Star, 
  Folder, 
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Save,
  Camera,
  Globe,
  RotateCcw,
  Check,
  ImageIcon
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadDate: string;
  thumbnail: string;
  imageUrl: string;
  featured: boolean;
  rotatingGallery: boolean;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export default function GalleryAdminManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample data - replace with API calls
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      title: 'Community Food Drive Success',
      description: 'Our recent food drive collected over 500 meals for families in need.',
      category: 'Events',
      uploadDate: '2024-05-27',
      thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&h=200&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop',
      featured: true,
      rotatingGallery: true,
      tags: ['food', 'community', 'charity']
    },
    {
      id: '2',
      title: 'New Volunteer Training Session',
      description: 'Training our amazing volunteers for upcoming community projects.',
      category: 'Volunteers',
      uploadDate: '2024-05-26',
      thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      featured: false,
      rotatingGallery: false,
      tags: ['volunteers', 'training', 'community']
    },
    {
      id: '3',
      title: 'Children Education Program Launch',
      description: 'Launching our new education initiative for underprivileged children.',
      category: 'Impact',
      uploadDate: '2024-05-25',
      thumbnail: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=200&fit=crop',
      imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
      featured: true,
      rotatingGallery: true,
      tags: ['education', 'children', 'impact']
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Events', description: 'Community events and gatherings', itemCount: 0 },
    { id: '2', name: 'Volunteers', description: 'Our amazing volunteer community', itemCount: 0 },
    { id: '3', name: 'Impact', description: 'Stories of positive change', itemCount: 0 },
    { id: '4', name: 'Medical', description: 'Healthcare initiatives', itemCount: 0 },
    { id: '5', name: 'Environment', description: 'Environmental conservation efforts', itemCount: 0 }
  ]);

  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    imageUrl: '',
    featured: false,
    rotatingGallery: false,
    tags: []
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Stats calculation
  const stats = {
    totalItems: galleryItems.length,
    totalCategories: categories.length,
    featuredItems: galleryItems.filter(item => item.featured).length,
    rotatingItems: galleryItems.filter(item => item.rotatingGallery).length
  };

  const API_URL = 'http://localhost:5000/api/gpage';

  // Function to calculate item count for each category
  const calculateCategoryItemCounts = (items: GalleryItem[], cats: Category[]) => {
    return cats.map(cat => ({
      ...cat,
      itemCount: items.filter(item => item.category === cat.name).length
    }));
  };

  useEffect(() => {
    fetchGalleryItems();
    fetchCategories();
  }, []);

  // Update category counts whenever gallery items change
  useEffect(() => {
    setCategories(prevCategories => calculateCategoryItemCounts(galleryItems, prevCategories));
  }, [galleryItems]);

  // Enhanced fetch function with better error handling
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/items`);
      
      if (res.data && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => ({
          id: item._id || item.id,
          title: item.title || '',
          description: item.description || '',
          category: item.category?.name || item.category || '',
          uploadDate: item.uploadDate ? item.uploadDate.split('T')[0] : new Date().toISOString().split('T')[0],
          thumbnail: item.thumbnail || item.imageUrl || '/placeholder-image.jpg',
          imageUrl: item.imageUrl || item.thumbnail || '/placeholder-image.jpg',
          featured: Boolean(item.featured),
          rotatingGallery: Boolean(item.rotatingGallery),
          tags: Array.isArray(item.tags) ? item.tags : []
        }));
        setGalleryItems(mapped);
      } else {
        console.warn('Invalid data format received:', res.data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError('');
      const res = await axios.get(`${API_URL}/categories`);
      
      if (res.data && Array.isArray(res.data)) {
        const mapped = res.data.map((cat: any) => ({
          id: cat._id || cat.id,
          name: cat.name || '',
          description: cat.description || '',
          itemCount: 0 // Will be calculated dynamically
        }));
        setCategories(mapped);
      } else {
        console.warn('Invalid categories data format:', res.data);
        setError('Invalid categories data format');
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError('Failed to fetch categories');
    }
  };

  // Enhanced image upload function with better error handling
  const uploadImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Validate file size (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image file too large. Please select an image smaller than 5MB');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    if (response.data && response.data.url) {
      return response.data.url; // This matches your backend res.status(200).json({ url: req.file.path });
    } else {
      throw new Error('Invalid response from image upload');
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to upload image');
    }
  }
};


  // Handle image file selection for new item
  const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file too large. Please select an image smaller than 5MB');
        return;
      }

      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image file selection for edit item
  const handleEditImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file too large. Please select an image smaller than 5MB');
        return;
      }

      setError('');
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Enhanced add item function
  const handleAddItem = async () => {
    if (!newItem.title || !newItem.category || !imageFile) {
      setError('Please fill in all required fields and select an image');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Upload image first
      const imageUrl = await uploadImage(imageFile);
      
      // Find category object
      const categoryObj = categories.find(cat => cat.name === newItem.category);
      if (!categoryObj) {
        throw new Error('Selected category not found');
      }

      // Prepare item data
      const itemData = {
        title: newItem.title,
        description: newItem.description || '',
        category: categoryObj.id,
        imageUrl: imageUrl,
        thumbnail: imageUrl, // Use the same image for thumbnail
        featured: Boolean(newItem.featured),
        rotatingGallery: Boolean(newItem.rotatingGallery),
        tags: Array.isArray(newItem.tags) ? newItem.tags.filter(tag => tag.trim()) : [],
        uploadDate: new Date().toISOString()
      };

      const response = await axios.post(`${API_URL}/items`, itemData);
      
      if (response.data) {
        await fetchGalleryItems(); // Refresh the list
        
        // Reset form
        setNewItem({ 
          title: '', 
          description: '', 
          category: '', 
          thumbnail: '', 
          imageUrl: '', 
          featured: false, 
          rotatingGallery: false, 
          tags: [] 
        });
        setImageFile(null);
        setImagePreview('');
        setShowAddItemModal(false);
      }
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err.message || 'Failed to add item');
    } finally {
      setUploading(false);
    }
  };

  // Enhanced add category function
  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setError('Please enter a category name');
      return;
    }

    try {
      setError('');
      const response = await axios.post(`${API_URL}/categories`, {
        name: newCategory.name.trim(),
        description: newCategory.description?.trim() || ''
      });
      
      if (response.data) {
        await fetchCategories();
        setNewCategory({ name: '', description: '' });
        setShowAddCategoryModal(false);
      }
    } catch (err: any) {
      console.error("Failed to add category:", err);
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  // Edit item functions
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem({...item});
    setEditImageFile(null);
    setEditImagePreview('');
    setError('');
    setShowEditItemModal(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.title || !editingItem.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      let imageUrl = editingItem.imageUrl;
      
      // If a new image file is selected, upload it
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }
      
      // Find category object
      const categoryObj = categories.find(cat => cat.name === editingItem.category);
      if (!categoryObj) {
        throw new Error('Selected category not found');
      }

      // Prepare update data
      const updateData = {
        title: editingItem.title,
        description: editingItem.description || '',
        category: categoryObj.id,
        imageUrl: imageUrl,
        thumbnail: imageUrl, // Use the same image for thumbnail
        featured: Boolean(editingItem.featured),
        rotatingGallery: Boolean(editingItem.rotatingGallery),
        tags: Array.isArray(editingItem.tags) ? editingItem.tags.filter(tag => tag.trim()) : []
      };

      const response = await axios.put(`${API_URL}/items/${editingItem.id}`, updateData);
      
      if (response.data) {
        await fetchGalleryItems();
        setShowEditItemModal(false);
        setEditingItem(null);
        setEditImageFile(null);
        setEditImagePreview('');
      }
    } catch (err: any) {
      console.error("Failed to update item:", err);
      setError(err.message || 'Failed to update item');
    } finally {
      setUploading(false);
    }
  };

  // Edit category functions
  const handleEditCategory = (category: Category) => {
    setEditingCategory({...category});
    setError('');
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      setError('Please enter a category name');
      return;
    }

    try {
      setError('');
      const response = await axios.put(`${API_URL}/categories/${editingCategory.id}`, {
        name: editingCategory.name.trim(),
        description: editingCategory.description?.trim() || ''
      });
      
      if (response.data) {
        await fetchCategories();
        setShowEditCategoryModal(false);
        setEditingCategory(null);
      }
    } catch (err: any) {
      console.error("Failed to update category:", err);
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      setError('');
      const response = await axios.put(`${API_URL}/items/${id}/toggle-featured`);
      if (response.data) {
        await fetchGalleryItems();
      }
    } catch (err: any) {
      console.error("Failed to toggle featured:", err);
      setError('Failed to toggle featured status');
    }
  };

  const toggleRotatingGallery = async (id: string) => {
    try {
      setError('');
      const response = await axios.put(`${API_URL}/items/${id}/toggle-rotating`);
      if (response.data) {
        await fetchGalleryItems();
      }
    } catch (err: any) {
      console.error("Failed to toggle rotating gallery:", err);
      setError('Failed to toggle rotating gallery status');
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError('');
      const response = await axios.delete(`${API_URL}/items/${id}`);
      if (response.data) {
        await fetchGalleryItems();
      }
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      setError('Failed to delete item');
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setError('');
      const response = await axios.delete(`${API_URL}/categories/${id}`);
      if (response.data) {
        await fetchCategories();
      }
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError('Failed to delete category');
    }
  };

  // Image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-image.jpg'; // Fallback image
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any; title: string; value: string | number; change?: string; color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Error Alert Component
  const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <X className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={onClose}
            className="inline-flex text-red-400 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          {/* Error Alert */}
          {error && (
            <ErrorAlert message={error} onClose={() => setError('')} />
          )}
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Folder className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {['dashboard', 'items', 'categories', 'rotating'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'rotating' ? '3D Gallery' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Image} title="Total Items" value={stats.totalItems} change="+12 this month" color="bg-blue-500" />
              <StatCard icon={Folder} title="Categories" value={stats.totalCategories} change="+2 this month" color="bg-green-500" />
              <StatCard icon={Star} title="Featured Items" value={stats.featuredItems} color="bg-orange-500" />
              <StatCard icon={RotateCcw} title="3D Gallery Items" value={stats.rotatingItems} color="bg-red-500" />
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h2>
              <div className="space-y-4">
                {galleryItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                    <img 
                      src={item.thumbnail || '/placeholder-image.jpg'} 
                      alt={item.title} 
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={handleImageError}
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          {item.title}
                          {item.featured && <Star className="w-4 h-4 text-orange-500 ml-2 fill-current" />}
                          {item.rotatingGallery && <RotateCcw className="w-4 h-4 text-red-500 ml-2" />}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium mr-2">{item.category}</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Gallery Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {galleryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={item.thumbnail || '/placeholder-image.jpg'} 
                            alt={item.title} 
                            className="w-10 h-10 rounded object-cover"
                            onError={handleImageError}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {item.featured && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Featured</span>}
                          {item.rotatingGallery && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">3D Gallery</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`p-1 rounded ${item.featured ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleRotatingGallery(item.id)}
                          className={`p-1 rounded ${item.rotatingGallery ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Image className="w-4 h-4 mr-1" />
                    <span>{category.itemCount} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rotating' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">3D Gallery Items</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {galleryItems.filter(item => item.rotatingGallery).map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                  <img 
                    src={item.thumbnail || '/placeholder-image.jpg'} 
                    alt={item.title} 
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{item.category}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRotatingGallery(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Item</h2>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter item title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter item description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newItem.category || ''}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to select an image</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Select Image
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newItem.tags?.join(', ') || ''}
                    onChange={(e) => setNewItem({...newItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.featured || false}
                      onChange={(e) => setNewItem({...newItem, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.rotatingGallery || false}
                      onChange={(e) => setNewItem({...newItem, rotatingGallery: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">3D Gallery</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Item</h2>
                <button
                  onClick={() => setShowEditItemModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter item title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter item description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {editImagePreview ? (
                      <div className="relative">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setEditImageFile(null);
                            setEditImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : editingItem.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={editingItem.imageUrl} 
                          alt="Current" 
                          className="w-full h-32 object-cover rounded-lg"
                          onError={handleImageError}
                        />
                        <button
                          onClick={() => editFileInputRef.current?.click()}
                          className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to select an image</p>
                        <button
                          onClick={() => editFileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Select Image
                        </button>
                      </div>
                    )}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingItem.tags?.join(', ') || ''}
                    onChange={(e) => setEditingItem({...editingItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem.featured || false}
                      onChange={(e) => setEditingItem({...editingItem, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem.rotatingGallery || false}
                      onChange={(e) => setEditingItem({...editingItem, rotatingGallery: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">3D Gallery</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditItemModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateItem}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Category</h2>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter category description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Category</h2>
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter category description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}