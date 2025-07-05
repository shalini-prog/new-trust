'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Users, 
  Phone, 
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Volume2,
  Languages,
  Eye,
  Accessibility,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  BarChart3,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

interface HelplineService {
  id: string;
  name: string;
  category: string;
  phone: string;
  hours: string;
  languages: string[];
  services: string[];
  isEmergency: boolean;
  isActive: boolean;
  lastUpdated: string;
  totalCalls: number;
}

interface LegalAidCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  services: string[];
  timings: string;
  isActive: boolean;
  capacity: number;
  currentCases: number;
}

interface SupportResource {
  id: string;
  title: string;
  type: string;
  size: string;
  downloads: string;
  category: string;
  isActive: boolean;
  lastUpdated: string;
}

export default function LegalAidAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'helplines' | 'centers' | 'resources' | 'analytics'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'helpline' | 'center' | 'resource'>('helpline');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample data
  const [helplines, setHelplines] = useState<HelplineService[]>([
    {
      id: '1',
      name: 'Women Helpline',
      category: 'women',
      phone: '181',
      hours: '24/7',
      languages: ['Hindi', 'English'],
      services: ['Domestic Violence', 'Sexual Harassment', 'Dowry Issues', 'Workplace Discrimination'],
      isEmergency: true,
      isActive: true,
      lastUpdated: '2024-01-15',
      totalCalls: 1250
    },
    {
      id: '2',
      name: 'Elder Helpline',
      category: 'seniors',
      phone: '14567',
      hours: '8 AM - 8 PM',
      languages: ['Hindi', 'English'],
      services: ['Elder Abuse', 'Property Disputes', 'Pension Issues', 'Healthcare Rights'],
      isEmergency: false,
      isActive: true,
      lastUpdated: '2024-01-14',
      totalCalls: 890
    },
    {
      id: '3',
      name: 'SC/ST Helpline',
      category: 'sc-st',
      phone: '14566',
      hours: '24/7',
      languages: ['Hindi', 'English', 'Regional Languages'],
      services: ['Atrocity Cases', 'Reservation Issues', 'Legal Aid', 'Fast Track Courts'],
      isEmergency: true,
      isActive: true,
      lastUpdated: '2024-01-13',
      totalCalls: 670
    }
  ]);

  const [centers, setCenters] = useState<LegalAidCenter[]>([
    {
      id: '1',
      name: 'District Legal Services Authority',
      address: 'Court Complex, Civil Lines',
      district: 'Delhi',
      phone: '011-2338-7379',
      services: ['Free Legal Aid', 'Lok Adalat', 'Mediation', 'Legal Awareness'],
      timings: '10 AM - 5 PM (Mon-Fri)',
      isActive: true,
      capacity: 100,
      currentCases: 78
    },
    {
      id: '2',
      name: 'State Legal Services Authority',
      address: 'High Court Building',
      district: 'Mumbai',
      phone: '022-2672-8901',
      services: ['Free Legal Aid', 'Legal Literacy', 'Alternative Dispute Resolution'],
      timings: '10 AM - 5 PM (Mon-Fri)',
      isActive: true,
      capacity: 150,
      currentCases: 120
    }
  ]);

  const [resources, setResources] = useState<SupportResource[]>([
    {
      id: '1',
      title: 'Women Safety Guide',
      type: 'PDF',
      size: '2.1 MB',
      downloads: '15K+',
      category: 'women',
      isActive: true,
      lastUpdated: '2024-01-10'
    },
    {
      id: '2',
      title: 'Senior Rights Handbook',
      type: 'PDF',
      size: '1.8 MB',
      downloads: '8K+',
      category: 'seniors',
      isActive: true,
      lastUpdated: '2024-01-08'
    }
  ]);

  const categories = [
    { id: 'women', name: 'Women Support', color: 'pink' },
    { id: 'seniors', name: 'Senior Citizens', color: 'blue' },
    { id: 'sc-st', name: 'SC/ST Support', color: 'green' },
    { id: 'disabled', name: 'Disabled Rights', color: 'purple' },
    { id: 'child', name: 'Child Protection', color: 'orange' }
  ];

  const openModal = (type: 'helpline' | 'center' | 'resource', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const toggleItemStatus = (type: 'helpline' | 'center' | 'resource', id: string) => {
    if (type === 'helpline') {
      setHelplines(prev => prev.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    } else if (type === 'center') {
      setCenters(prev => prev.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    } else if (type === 'resource') {
      setResources(prev => prev.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ));
    }
  };

  const deleteItem = (type: 'helpline' | 'center' | 'resource', id: string) => {
    if (type === 'helpline') {
      setHelplines(prev => prev.filter(item => item.id !== id));
    } else if (type === 'center') {
      setCenters(prev => prev.filter(item => item.id !== id));
    } else if (type === 'resource') {
      setResources(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredHelplines = helplines.filter(helpline => 
    (filterCategory === 'all' || helpline.category === filterCategory) &&
    (helpline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     helpline.phone.includes(searchTerm))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Aid Management</h1>
              <p className="text-gray-600">Manage helplines, centers, and support resources</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Upload className="w-4 h-4" />
              Bulk Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'helplines', label: 'Helplines', icon: <Phone className="w-4 h-4" /> },
            { id: 'centers', label: 'Centers', icon: <MapPin className="w-4 h-4" /> },
            { id: 'resources', label: 'Resources', icon: <FileText className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <Eye className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{helplines.filter(h => h.isActive).length}</div>
              <div className="text-gray-600">Helplines</div>
              <div className="text-sm text-green-600 mt-2">
                {helplines.filter(h => h.isEmergency).length} Emergency
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Operating</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{centers.filter(c => c.isActive).length}</div>
              <div className="text-gray-600">Legal Centers</div>
              <div className="text-sm text-blue-600 mt-2">
                {centers.reduce((sum, c) => sum + c.currentCases, 0)} Active Cases
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Available</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{resources.filter(r => r.isActive).length}</div>
              <div className="text-gray-600">Resources</div>
              <div className="text-sm text-green-600 mt-2">
                {resources.reduce((sum, r) => sum + parseInt(r.downloads.replace(/[^\d]/g, '')), 0)}K+ Downloads
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
              <div className="text-gray-600">Emergency Calls</div>
              <div className="text-sm text-red-600 mt-2">+3 from yesterday</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { action: 'New helpline added', details: 'Disability Rights Helpline', time: '10 minutes ago', type: 'add' },
                  { action: 'Resource updated', details: 'Women Safety Guide v2.0', time: '1 hour ago', type: 'update' },
                  { action: 'Emergency call handled', details: 'Domestic violence case', time: '2 hours ago', type: 'emergency' },
                  { action: 'Legal center capacity increased', details: 'Delhi DLSA +20 cases', time: '3 hours ago', type: 'update' },
                  { action: 'Helpline temporarily disabled', details: 'Technical maintenance', time: '4 hours ago', type: 'disable' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'emergency' ? 'bg-red-100' :
                        activity.type === 'add' ? 'bg-green-100' :
                        activity.type === 'update' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'emergency' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                        {activity.type === 'add' && <Plus className="w-4 h-4 text-green-600" />}
                        {activity.type === 'update' && <Edit className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'disable' && <X className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.details}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Helplines Tab */}
      {activeTab === 'helplines' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search helplines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => openModal('helpline')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Helpline
              </button>
            </div>
          </div>

          {/* Helplines List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHelplines.map((helpline) => (
              <div key={helpline.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{helpline.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">{helpline.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {helpline.isEmergency && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Emergency
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      helpline.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {helpline.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{helpline.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Languages className="w-4 h-4" />
                    <span>{helpline.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>{helpline.totalCalls} total calls</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {helpline.services.slice(0, 2).map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                    {helpline.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{helpline.services.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('helpline', helpline)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleItemStatus('helpline', helpline.id)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      helpline.isActive 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {helpline.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteItem('helpline', helpline.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Centers Tab */}
      {activeTab === 'centers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Legal Aid Centers</h2>
            <button
              onClick={() => openModal('center')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Center
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centers.map((center) => (
              <div key={center.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{center.name}</h3>
                    <p className="text-gray-600 mt-1">{center.district}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    center.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {center.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600">{center.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{center.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{center.timings}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Case Load:</span>
                    <span className="font-medium">{center.currentCases}/{center.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (center.currentCases / center.capacity) > 0.8 ? 'bg-red-500' : 
                        (center.currentCases / center.capacity) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(center.currentCases / center.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('center', center)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleItemStatus('center', center.id)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      center.isActive 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {center.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteItem('center', center.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
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
            <h2 className="text-xl font-semibold text-gray-900">Support Resources</h2>
            <button
              onClick={() => openModal('resource')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{resource.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{resource.type} • {resource.size}</span>
                      </div>
                    </div>
                  </div>                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    resource.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {resource.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Category:</span>
                    <span>{categories.find(c => c.id === resource.category)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Downloads:</span>
                    <span>{resource.downloads}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Last Updated:</span>
                    <span>{resource.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('resource', resource)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleItemStatus('resource', resource.id)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      resource.isActive 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {resource.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteItem('resource', resource.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Helpline Calls by Category</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Bar chart showing calls by category
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Monthly Trend</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Line chart showing monthly usage
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Top Resources</h3>
                <div className="space-y-3">
                  {resources
                    .sort((a, b) => parseInt(b.downloads) - parseInt(a.downloads))
                    .slice(0, 3)
                    .map((resource, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{resource.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">{resource.downloads}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Busiest Centers</h3>
                <div className="space-y-3">
                  {centers
                    .sort((a, b) => b.currentCases - a.currentCases)
                    .slice(0, 3)
                    .map((center, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate max-w-[120px]">{center.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{center.currentCases}/{center.capacity}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Emergency Calls</h3>
                <div className="space-y-3">
                  {helplines
                    .filter(h => h.isEmergency)
                    .sort((a, b) => b.totalCalls - a.totalCalls)
                    .slice(0, 3)
                    .map((helpline, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{helpline.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{helpline.totalCalls}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add New'} {modalType === 'helpline' ? 'Helpline' : modalType === 'center' ? 'Center' : 'Resource'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6">
              {modalType === 'helpline' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Helpline name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={editingItem?.category || 'women'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.phone || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.hours || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. 24/7 or 9 AM - 5 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                    <input
                      type="text"
                      defaultValue={editingItem?.languages?.join(', ') || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Comma separated languages"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                    <textarea
                      defaultValue={editingItem?.services?.join('\n') || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      placeholder="One service per line"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isEmergency"
                        defaultChecked={editingItem?.isEmergency || false}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isEmergency" className="ml-2 text-sm font-medium text-gray-700">
                        Emergency Service
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        defaultChecked={editingItem?.isActive !== false}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'center' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Center name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.district || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="District"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      defaultValue={editingItem?.address || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.phone || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timings</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.timings || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. 9 AM - 5 PM (Mon-Fri)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                    <textarea
                      defaultValue={editingItem?.services?.join('\n') || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      placeholder="One service per line"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        defaultValue={editingItem?.capacity || 50}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Cases</label>
                      <input
                        type="number"
                        defaultValue={editingItem?.currentCases || 0}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      defaultChecked={editingItem?.isActive !== false}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </>
              )}

              {modalType === 'resource' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.title || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Resource title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={editingItem?.category || 'women'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        defaultValue={editingItem?.type || 'PDF'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="PDF">PDF</option>
                        <option value="Video">Video</option>
                        <option value="Webpage">Webpage</option>
                        <option value="Infographic">Infographic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <input
                        type="text"
                        defaultValue={editingItem?.size || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. 2.1 MB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {editingItem && (
                        <span className="text-sm text-gray-500">Current: {editingItem.title}.{editingItem.type.toLowerCase()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      defaultChecked={editingItem?.isActive !== false}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {editingItem ? 'Save Changes' : 'Add'}
                  </div>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}