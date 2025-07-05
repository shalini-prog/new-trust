'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Upload,
  Settings,
  Save,
  RefreshCw,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockTemplates = [
  {
    id: '1',
    name: 'Modern Professional',
    category: 'Professional',
    status: 'active',
    downloads: 2543,
    rating: 4.8,
    createdAt: '2024-01-15',
    thumbnail: '/api/placeholder/200/280',
    description: 'Clean and modern design perfect for corporate roles'
  },
  {
    id: '2',
    name: 'Creative Design',
    category: 'Creative',
    status: 'active',
    downloads: 1876,
    rating: 4.6,
    createdAt: '2024-01-10',
    thumbnail: '/api/placeholder/200/280',
    description: 'Eye-catching design for creative professionals'
  },
  {
    id: '3',
    name: 'Corporate Standard',
    category: 'Corporate',
    status: 'draft',
    downloads: 987,
    rating: 4.4,
    createdAt: '2024-01-05',
    thumbnail: '/api/placeholder/200/280',
    description: 'Traditional corporate resume format'
  },
  {
    id: '4',
    name: 'Minimal Clean',
    category: 'Minimal',
    status: 'active',
    downloads: 3210,
    rating: 4.9,
    createdAt: '2024-01-01',
    thumbnail: '/api/placeholder/200/280',
    description: 'Simple and elegant minimalist design'
  }
];

const mockStats = {
  totalResumes: 12580,
  activeTemplates: 12,
  monthlyDownloads: 8945,
  averageRating: 4.7,
  completionRate: 78,
  premiumUsers: 2340
};

const mockRecentActivity = [
  { id: 1, user: 'Rahul Sharma', action: 'Downloaded', template: 'Modern Professional', time: '2 hours ago' },
  { id: 2, user: 'Priya Patel', action: 'Created Resume', template: 'Creative Design', time: '3 hours ago' },
  { id: 3, user: 'Admin', action: 'Updated Template', template: 'Corporate Standard', time: '5 hours ago' },
  { id: 4, user: 'Amit Kumar', action: 'Completed Resume', template: 'Minimal Clean', time: '1 day ago' }
];

export default function AdminResumeBuilder() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [templates, setTemplates] = useState(mockTemplates);
  const [stats, setStats] = useState(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const categories = ['all', 'Professional', 'Creative', 'Corporate', 'Minimal'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateAction = (templateId, action) => {
    switch (action) {
      case 'edit':
        setSelectedTemplate(templates.find(t => t.id === templateId));
        setShowTemplateModal(true);
        break;
      case 'delete':
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        break;
      case 'toggle-status':
        setTemplates(prev => prev.map(t => 
          t.id === templateId 
            ? { ...t, status: t.status === 'active' ? 'draft' : 'active' }
            : t
        ));
        break;
      default:
        break;
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder Management</h1>
            <p className="text-gray-600 mt-2">Manage templates, monitor usage, and configure settings</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {[
                { label: 'Total Resumes', value: stats.totalResumes, change: '+12%', color: 'text-blue-600', icon: FileText },
                { label: 'Active Templates', value: stats.activeTemplates, change: '+2', color: 'text-green-600', icon: CheckCircle },
                { label: 'Monthly Downloads', value: stats.monthlyDownloads, change: '+18%', color: 'text-purple-600', icon: Download },
                { label: 'Average Rating', value: stats.averageRating, change: '+0.2', color: 'text-yellow-600', icon: Star },
                { label: 'Completion Rate', value: `${stats.completionRate}%`, change: '+5%', color: 'text-indigo-600', icon: TrendingUp },
                { label: 'Premium Users', value: stats.premiumUsers, change: '+25%', color: 'text-pink-600', icon: Award }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user} {activity.action.toLowerCase()} {activity.template}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Templates */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Most Popular Templates</h3>
                </div>
                
                <div className="space-y-4">
                  {templates
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 4)
                    .map((template, index) => (
                      <div key={template.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-lg font-bold text-gray-400 min-w-[24px]">
                          #{index + 1}
                        </div>
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-12 h-16 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-sm text-gray-600">{template.downloads.toLocaleString()} downloads</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{template.rating}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {template.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{template.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {template.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTemplateAction(template.id, 'edit')}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleTemplateAction(template.id, 'toggle-status')}
                        className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                          template.status === 'active'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {template.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleTemplateAction(template.id, 'delete')}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No templates found matching your criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Usage Chart Placeholder */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Usage Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
              </div>

              {/* Download Statistics */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Statistics</h3>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name}
                          className="w-8 h-10 object-cover rounded"
                        />
                        <span className="font-medium text-gray-900">{template.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{template.downloads.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">downloads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Engagement */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Avg. Time Spent', value: '24 min', change: '+8%' },
                  { label: 'Completion Rate', value: '78%', change: '+5%' },
                  { label: 'Return Users', value: '45%', change: '+12%' },
                  { label: 'Template Switches', value: '2.3', change: '-3%' }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                    <div className={`text-xs mt-2 ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change} from last month
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* General Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      defaultValue="PDF, DOC, DOCX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Enable AI suggestions for resume content</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Allow users to save draft resumes</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Require email verification for downloads</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Template Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Template Categories</h3>
              <div className="space-y-4">
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {templates.filter(t => t.category === category).length} templates
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Category
                </button>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedTemplate ? 'Edit Template' : 'Add New Template'}
                </h3>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedTemplate?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    defaultValue={selectedTemplate?.category || 'Professional'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={selectedTemplate?.description || ''}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the template..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Drag and drop template file or 
                    <button className="text-blue-600 hover:text-blue-700 ml-1">browse</button>
                  </p>
                                    <p className="text-xs text-gray-500 mt-2">
                    Supported formats: .pdf, .docx (max 10MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue={selectedTemplate?.status || 'draft'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Drag and drop preview image or 
                      <button className="text-blue-600 hover:text-blue-700 ml-1">browse</button>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 800x1120px
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would handle the save logic
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {selectedTemplate ? 'Update Template' : 'Add Template'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}