'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Image, 
  Plus, 
  Star, 
  Folder, 
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
  Globe,
  RotateCcw,
  Check
} from 'lucide-react';

interface GalleryItem {
  _id: string;
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
  _id: string;
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
  
  // Sample data - replace with API calls
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      _id: '1',
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
      _id: '2',
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
      _id: '3',
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
    { _id: '1', name: 'Events', description: 'Community events and gatherings', itemCount: 0 },
    { _id: '2', name: 'Volunteers', description: 'Our amazing volunteer community', itemCount: 0 },
    { _id: '3', name: 'Impact', description: 'Stories of positive change', itemCount: 0 },
    { _id: '4', name: 'Medical', description: 'Healthcare initiatives', itemCount: 0 },
    { _id: '5', name: 'Environment', description: 'Environmental conservation efforts', itemCount: 0 }
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

  // Function to calculate category item counts
  const calculateCategoryItemCounts = (items: GalleryItem[]) => {
    const counts: { [key: string]: number } = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  };

  // Function to update category counts
  const updateCategoryItemCounts = (items: GalleryItem[]) => {
    const counts = calculateCategoryItemCounts(items);
    setCategories(prev => prev.map(category => ({
      ...category,
      itemCount: counts[category.name] || 0
    })));
  };

  // Stats calculation
  const stats = {
    totalItems: galleryItems.length,
    totalCategories: categories.length,
    featuredItems: galleryItems.filter(item => item.featured).length,
    rotatingItems: galleryItems.filter(item => item.rotatingGallery).length
  };

  const API = axios.create({
    baseURL: 'http://localhost:5000/api/gpage',
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Update category counts whenever gallery items change
  const fetchData = async () => {
  try {
    const [itemsRes, categoriesRes] = await Promise.all([
      API.get('/items'),
      API.get('/categories')
    ]);

    setGalleryItems(itemsRes.data.data);     // ✅ Extract array from `data`
    setCategories(categoriesRes.data.data);  // ✅ Extract array from `data`
  } catch (err) {
    console.error('Error loading gallery data:', err);
  }
};



  // Add new item
  const handleAddItem = async () => {
    if (newItem.title && newItem.category && newItem.imageUrl) {
      try {
        const res = await API.post('/items', {
          ...newItem,
          thumbnail: newItem.thumbnail || newItem.imageUrl,
          uploadDate: new Date().toISOString().split('T')[0]
        });
        setGalleryItems(prev => [res.data, ...prev]);
        setNewItem({ title: '', description: '', category: '', thumbnail: '', imageUrl: '', featured: false, rotatingGallery: false, tags: [] });
        setShowAddItemModal(false);
      } catch (err) {
        console.error('Add item failed:', err);
      }
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        const res = await API.post('/categories', {
          name: newCategory.name,
          description: newCategory.description
        });
        setCategories(prev => [...prev, { ...res.data, itemCount: 0 }]);
        setNewCategory({ name: '', description: '' });
        setShowAddCategoryModal(false);
      } catch (err) {
        console.error('Add category failed:', err);
      }
    }
  };

  // Edit item functions
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem({...item});
    setShowEditItemModal(true);
  };

  const handleUpdateItem = async () => {
    if (editingItem && editingItem.title && editingItem.category && editingItem.imageUrl) {
      try {
        const res = await API.put(`/items/${editingItem._id}`, editingItem);
        setGalleryItems(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
        setEditingItem(null);
        setShowEditItemModal(false);
      } catch (err) {
        console.error('Update item failed:', err);
      }
    }
  };

  // Edit category functions
  const handleEditCategory = (category: Category) => {
    setEditingCategory({...category});
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name) {
      try {
        const res = await API.put(`/categories/${editingCategory._id}`, editingCategory);
        setCategories(prev => prev.map(cat => cat._id === editingCategory._id ? res.data : cat));
        setEditingCategory(null);
        setShowEditCategoryModal(false);
      } catch (err) {
        console.error('Update category failed:', err);
      }
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    const target = galleryItems.find(item => item._id === id);
    if (!target) return;

    try {
      const updated = { ...target, featured: !target.featured };
      await API.put(`/items/${id}`, updated);
      setGalleryItems(prev => prev.map(item => item._id === id ? updated : item));
    } catch (err) {
      console.error('Toggle featured failed:', err);
    }
  };

  // Toggle rotating gallery status
  const toggleRotatingGallery = async (id: string) => {
    const target = galleryItems.find(item => item._id === id);
    if (!target) return;

    try {
      const updated = { ...target, rotatingGallery: !target.rotatingGallery };
      await API.put(`/items/${id}`, updated);
      setGalleryItems(prev => prev.map(item => item._id === id ? updated : item));
    } catch (err) {
      console.error('Toggle rotating failed:', err);
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      await API.delete(`/items/${id}`);
      setGalleryItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete item failed:', err);
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      await API.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      console.error('Delete category failed:', err);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
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
                  <div key={item._id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {galleryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={item.thumbnail} alt={item.title} className="w-10 h-10 rounded object-cover" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(item.uploadDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {item.featured && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Featured</span>}
                          {item.rotatingGallery && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">3D Gallery</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleFeatured(item._id)}
                          className={`p-1 rounded ${item.featured ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}
                          title="Toggle Featured"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleRotatingGallery(item._id)}
                          className={`p-1 rounded ${item.rotatingGallery ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`}
                          title="Toggle 3D Gallery"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteItem(item._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Item"
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
                <div key={category._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCategory(category._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-sm text-gray-500">{category.itemCount} items</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rotating' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">3D Rotating Gallery Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage items that appear in the 3D rotating gallery section</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.filter(item => item.rotatingGallery).map((item) => (
                  <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{item.category}</span>
                        <button
                          onClick={() => toggleRotatingGallery(item._id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                        >
                          Remove from 3D
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {galleryItems.filter(item => item.rotatingGallery).length === 0 && (
                <div className="text-center py-12">
                  <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items in 3D gallery</h3>
                  <p className="text-gray-600">Add items to the 3D rotating gallery from the items tab.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Gallery Item</h2>
              <button onClick={() => setShowAddItemModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newItem.title || ''}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newItem.imageUrl || ''}
                  onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value, thumbnail: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {newItem.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={newItem.imageUrl} 
                      alt="Preview" 
                      className="w-full max-w-sm h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.featured || false}
                    onChange={(e) => setNewItem({...newItem, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <Star className="w-4 h-4 mr-1" />
                  Featured Item
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.rotatingGallery || false}
                    onChange={(e) => setNewItem({...newItem, rotatingGallery: e.target.checked})}
                    className="mr-2"
                  />
                  <RotateCcw className="w-4 h-4 mr-1" />
                  3D Gallery
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newItem.tags?.join(', ') || ''}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                  placeholder="community, volunteer, charity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Category</h2>
              <button onClick={() => setShowAddCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Gallery Item</h2>
              <button onClick={() => setShowEditItemModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value, thumbnail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {editingItem.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={editingItem.imageUrl} 
                      alt="Preview" 
                      className="w-full max-w-sm h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({...editingItem, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <Star className="w-4 h-4 mr-1" />
                  Featured Item
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingItem.rotatingGallery}
                    onChange={(e) => setEditingItem({...editingItem, rotatingGallery: e.target.checked})}
                    className="mr-2"
                  />
                  <RotateCcw className="w-4 h-4 mr-1" />
                  3D Gallery
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingItem.tags?.join(', ') || ''}
                  onChange={(e) => setEditingItem({...editingItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                  placeholder="community, volunteer, charity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditItemModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Category</h2>
              <button onClick={() => setShowEditCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditCategoryModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}