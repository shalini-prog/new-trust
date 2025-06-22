'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Move,
  Copy
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  gif?: string;
  category: string;
  isActive: boolean;
  order: number;
  createdDate: string;
  lastModified: string;
  views: number;
}

interface FAQStats {
  totalFAQs: number;
  activeFAQs: number;
  inactiveFAQs: number;
  totalViews: number;
  categoriesCount: number;
  lastUpdated: string;
}

export default function AdminFAQPage() {
  const [stats, setStats] = useState<FAQStats>({
    totalFAQs: 12,
    activeFAQs: 10,
    inactiveFAQs: 2,
    totalViews: 1250,
    categoriesCount: 4,
    lastUpdated: '2024-01-15'
  });

  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How much time do I need to commit as a volunteer?',
      answer: 'We offer flexible volunteering opportunities! You can commit as little as 2 hours per week or join for specific events. Many of our volunteers contribute 4-8 hours monthly, but we appreciate any time you can give.',
      gif: '/images/gifs/time-commitment.gif',
      category: 'Time Commitment',
      isActive: true,
      order: 1,
      createdDate: '2024-01-10',
      lastModified: '2024-01-12',
      views: 245
    },
    {
      id: '2',
      question: 'Do I need any special skills or training to volunteer?',
      answer: 'No special skills are required for many volunteer positions! We provide all necessary training. We have roles suited for all skill levels, and if you have specific expertise, we\'ll match you accordingly.',
      gif: '/images/gifs/skills-training.gif',
      category: 'Requirements',
      isActive: true,
      order: 2,
      createdDate: '2024-01-10',
      lastModified: '2024-01-11',
      views: 198
    },
    {
      id: '3',
      question: 'Can I volunteer remotely or do I need to be in-person?',
      answer: 'We offer both remote and in-person volunteer opportunities! Remote options include virtual mentoring, digital content creation, translation services, and fundraising support.',
      gif: '/images/gifs/remote-volunteer.gif',
      category: 'Work Location',
      isActive: true,
      order: 3,
      createdDate: '2024-01-09',
      lastModified: '2024-01-13',
      views: 167
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    gif: '',
    category: '',
    isActive: true
  });

  const categories = ['Time Commitment', 'Requirements', 'Work Location', 'Benefits', 'Training', 'General'];

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setFormData({
      question: '',
      answer: '',
      gif: '',
      category: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditFAQ = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      gif: faq.gif || '',
      category: faq.category,
      isActive: faq.isActive
    });
    setIsModalOpen(true);
  };

  const handleSaveFAQ = () => {
    if (editingFAQ) {
      // Update existing FAQ
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFAQ.id 
          ? { 
              ...faq, 
              ...formData, 
              lastModified: new Date().toISOString().split('T')[0] 
            }
          : faq
      ));
    } else {
      // Add new FAQ
      const newFAQ: FAQItem = {
        id: Date.now().toString(),
        ...formData,
        order: faqs.length + 1,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        views: 0
      };
      setFaqs(prev => [...prev, newFAQ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && faq.isActive) ||
                         (filterStatus === 'inactive' && !faq.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ Management</h1>
        <p className="text-gray-600">Manage frequently asked questions and help documentation</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total FAQs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFAQs}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active FAQs</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeFAQs}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive FAQs</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactiveFAQs}</p>
            </div>
            <EyeOff className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.categoriesCount}</p>
            </div>
            <Filter className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-bold text-emerald-600">{new Date(stats.lastUpdated).toLocaleDateString()}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button 
          onClick={handleAddFAQ}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <Plus className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Add New FAQ</h3>
              <p className="text-sm text-gray-600">Create a new frequently asked question</p>
            </div>
          </div>
        </button>

        <Link href="/admin/faq/categories" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Filter className="h-10 w-10 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-600">Organize FAQ categories</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/faq/analytics" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Eye className="h-10 w-10 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">FAQ usage and engagement stats</p>
            </div>
          </div>
        </Link>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="flex items-center space-x-4">
            <Upload className="h-10 w-10 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Import/Export</h3>
              <p className="text-sm text-gray-600">Bulk FAQ management</p>
            </div>
          </div>
        </button>
      </div>

      {/* FAQ Management */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">FAQ List</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFAQs.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-md">
                      {faq.question}
                    </div>
                    {faq.gif && (
                      <div className="flex items-center mt-1">
                        <ImageIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Has GIF</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(faq.isActive)}`}>
                      {faq.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {faq.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(faq.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEditFAQ(faq)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(faq.id)}
                      className={faq.isActive ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"}
                    >
                      {faq.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Enter the frequently asked question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  placeholder="Enter the detailed answer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GIF URL (Optional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.gif}
                  onChange={(e) => setFormData({...formData, gif: e.target.value})}
                  placeholder="https://example.com/image.gif"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible to users)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFAQ}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                disabled={!formData.question || !formData.answer || !formData.category}
              >
                <Save className="h-4 w-4" />
                <span>{editingFAQ ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}