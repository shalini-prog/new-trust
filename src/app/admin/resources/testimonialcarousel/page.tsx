'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Search,
  Filter,
  Save,
  X,
  Upload,
  ChevronDown,
  MoreVertical,
  Award,
  MapPin,
  Calendar,
  User,
  Quote
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  achievement: string;
  quote: string;
  category: string;
  rating: number;
  examYear?: string;
  currentRole?: string;
  featured: boolean;
  status: 'active' | 'pending' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'Ranjitha',
      location: 'Tamil Nadu',
      avatar: '/api/placeholder/80/80',
      achievement: 'Cleared Group 4 Exams',
      quote: 'Thanks to the free books and study materials, I was able to clear my Group 4 exams on the first attempt. The quality of content is excellent!',
      category: 'TNPSC',
      rating: 5,
      examYear: '2024',
      currentRole: 'Junior Assistant',
      featured: true,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Ajay',
      location: 'Chennai',
      avatar: '/api/placeholder/80/80',
      achievement: 'Cracked IBPS PO',
      quote: 'Found a mentor who guided me from zero to cracking IBPS! The mentorship program completely transformed my preparation strategy.',
      category: 'Banking',
      rating: 5,
      examYear: '2023',
      currentRole: 'Probationary Officer at SBI',
      featured: true,
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      name: 'Neha',
      location: 'Delhi',
      avatar: '/api/placeholder/80/80',
      achievement: 'Learned Python Programming',
      quote: 'I love the video section. Learning Python was never easier. The step-by-step tutorials helped me land my first tech job!',
      category: 'Programming',
      rating: 5,
      currentRole: 'Software Developer',
      featured: false,
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15'
    },
    {
      id: 4,
      name: 'Priyanka Sharma',
      location: 'Mumbai',
      avatar: '/api/placeholder/80/80',
      achievement: 'UPSC Mains Qualified',
      quote: 'The comprehensive study materials and community support helped me qualify for UPSC Mains. The current affairs section is particularly helpful.',
      category: 'UPSC',
      rating: 5,
      examYear: '2024',
      featured: false,
      status: 'pending',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedTestimonials, setSelectedTestimonials] = useState<number[]>([]);

  const categories = ['all', 'UPSC', 'SSC', 'RRB', 'Banking', 'TNPSC', 'Programming', 'Entrepreneurship', 'Tech Career'];
  const statuses = ['all', 'active', 'pending', 'draft'];

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    location: '',
    avatar: '/api/placeholder/80/80',
    achievement: '',
    quote: '',
    category: 'UPSC',
    rating: 5,
    examYear: '',
    currentRole: '',
    featured: false,
    status: 'draft'
  });

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || testimonial.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || testimonial.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      avatar: '/api/placeholder/80/80',
      achievement: '',
      quote: '',
      category: 'UPSC',
      rating: 5,
      examYear: '',
      currentRole: '',
      featured: false,
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    
    if (editingTestimonial) {
      // Update existing testimonial
      setTestimonials(prev => prev.map(t => 
        t.id === editingTestimonial.id 
          ? { ...formData, id: t.id, updatedAt: now } as Testimonial
          : t
      ));
    } else {
      // Add new testimonial
      const newTestimonial: Testimonial = {
        ...formData,
        id: Math.max(...testimonials.map(t => t.id)) + 1,
        createdAt: now,
        updatedAt: now
      } as Testimonial;
      setTestimonials(prev => [...prev, newTestimonial]);
    }
    
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedTestimonials.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedTestimonials.length} testimonials?`)) {
          setTestimonials(prev => prev.filter(t => !selectedTestimonials.includes(t.id)));
          setSelectedTestimonials([]);
        }
        break;
      case 'feature':
        setTestimonials(prev => prev.map(t => 
          selectedTestimonials.includes(t.id) ? { ...t, featured: true } : t
        ));
        setSelectedTestimonials([]);
        break;
      case 'activate':
        setTestimonials(prev => prev.map(t => 
          selectedTestimonials.includes(t.id) ? { ...t, status: 'active' as const } : t
        ));
        setSelectedTestimonials([]);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'TNPSC': 'bg-blue-100 text-blue-800',
      'Banking': 'bg-green-100 text-green-800',
      'Programming': 'bg-purple-100 text-purple-800',
      'UPSC': 'bg-orange-100 text-orange-800',
      'Tech Career': 'bg-indigo-100 text-indigo-800',
      'Entrepreneurship': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
              <p className="text-gray-600">Manage user testimonials and success stories</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Testimonial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {viewMode === 'grid' ? 'Table View' : 'Grid View'}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTestimonials.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedTestimonials.length} testimonial(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                >
                  Feature
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTestimonials(filteredTestimonials.map(t => t.id));
                          } else {
                            setSelectedTestimonials([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achievement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTestimonials.includes(testimonial.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTestimonials([...selectedTestimonials, testimonial.id]);
                            } else {
                              setSelectedTestimonials(selectedTestimonials.filter(id => id !== testimonial.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="w-10 h-10 rounded-full mr-3"
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {testimonial.name}
                              {testimonial.featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{testimonial.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{testimonial.achievement}</div>
                        {testimonial.currentRole && (
                          <div className="text-sm text-gray-500">{testimonial.currentRole}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(testimonial.category)}`}>
                          {testimonial.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">({testimonial.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(testimonial.status)}`}>
                          {testimonial.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(testimonial)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      className="w-12 h-12 rounded-full mr-3"
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(testimonial.category)}`}>
                      {testimonial.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(testimonial.status)}`}>
                      {testimonial.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800">{testimonial.achievement}</h4>
                </div>

                <blockquote className="text-sm text-gray-600 mb-3 line-clamp-3">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated {new Date(testimonial.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievement</label>
                  <input
                    type="text"
                    value={formData.achievement || ''}
                    onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter achievement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                  <textarea
                    value={formData.quote || ''}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter testimonial quote"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category || 'UPSC'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={formData.rating || 5}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'pending' | 'draft' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Year (Optional)</label>
                    <input
                      type="text"
                      value={formData.examYear || ''}
                      onChange={(e) => setFormData({ ...formData, examYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Role (Optional)</label>
                    <input
                      type="text"
                      value={formData.currentRole || ''}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current role"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                                   onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTestimonial ? 'Update' : 'Save'} Testimonial
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}