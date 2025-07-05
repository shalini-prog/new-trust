'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  MessageCircle, 
  Shield, 
  FileText, 
  Home, 
  Users,
  BookOpen,
  Search,
  Download,
  Bot,
  AlertCircle,
  Settings,
  BarChart3,
  Edit,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';

interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
  totalEntries: number;
}

interface LegalStats {
  consultations: number;
  casesResolved: number;
  documents: number;
  activeUsers: number;
  emergencyRequests: number;
  lawyersOnline: number;
}

export default function AdminLegalPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'analytics'>('overview');
  const [sections, setSections] = useState<LegalSection[]>([
    {
      id: 'hero',
      title: 'Hero Section',
      icon: <Scale className="w-5 h-5" />,
      description: 'Main banner with portal introduction',
      status: 'active',
      lastUpdated: '2024-01-15',
      totalEntries: 1
    },
    {
      id: 'stats',
      title: 'Quick Stats',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Display portal usage statistics',
      status: 'active',
      lastUpdated: '2024-01-14',
      totalEntries: 4
    },
    {
      id: 'rights',
      title: 'Legal Rights & Schemes',
      icon: <Scale className="w-5 h-5" />,
      description: 'Government welfare schemes and rights',
      status: 'active',
      lastUpdated: '2024-01-13',
      totalEntries: 25
    },
    {
      id: 'consultation',
      title: 'Ask a Lawyer',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Free legal consultation service',
      status: 'active',
      lastUpdated: '2024-01-15',
      totalEntries: 156
    },
    {
      id: 'legal-aid',
      title: 'Legal Aid',
      icon: <Shield className="w-5 h-5" />,
      description: 'Support for vulnerable groups',
      status: 'active',
      lastUpdated: '2024-01-12',
      totalEntries: 89
    },
    {
      id: 'consumer',
      title: 'Consumer Rights & RTI',
      icon: <FileText className="w-5 h-5" />,
      description: 'Consumer protection and RTI filing',
      status: 'active',
      lastUpdated: '2024-01-11',
      totalEntries: 67
    },
    {
      id: 'property',
      title: 'Property Law',
      icon: <Home className="w-5 h-5" />,
      description: 'Land ownership and inheritance',
      status: 'active',
      lastUpdated: '2024-01-10',
      totalEntries: 43
    },
    {
      id: 'case-tracker',
      title: 'Case Tracker',
      icon: <Search className="w-5 h-5" />,
      description: 'Track legal case progress',
      status: 'active',
      lastUpdated: '2024-01-15',
      totalEntries: 234
    },
    {
      id: 'tickets',
      title: 'Query Portal',
      icon: <Users className="w-5 h-5" />,
      description: 'Submit and track legal queries',
      status: 'active',
      lastUpdated: '2024-01-15',
      totalEntries: 178
    },
    {
      id: 'documents',
      title: 'Document Generator',
      icon: <Download className="w-5 h-5" />,
      description: 'Generate legal documents',
      status: 'active',
      lastUpdated: '2024-01-14',
      totalEntries: 89
    },
    {
      id: 'law-finder',
      title: 'Law Finder',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Find applicable laws by keywords',
      status: 'active',
      lastUpdated: '2024-01-13',
      totalEntries: 2456
    },
    {
      id: 'emergency',
      title: 'Emergency Help',
      icon: <AlertCircle className="w-5 h-5" />,
      description: 'Emergency legal assistance banner',
      status: 'active',
      lastUpdated: '2024-01-15',
      totalEntries: 1
    }
  ]);

  const [stats, setStats] = useState<LegalStats>({
    consultations: 50247,
    casesResolved: 25123,
    documents: 1089,
    activeUsers: 2456,
    emergencyRequests: 12,
    lawyersOnline: 45
  });

  const toggleSectionStatus = (id: string) => {
    setSections(prev => prev.map(section => 
      section.id === id 
        ? { ...section, status: section.status === 'active' ? 'inactive' : 'active' }
        : section
    ));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Scale className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Portal Management</h1>
            <p className="text-gray-600">Manage legal services, consultations, and resources</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'sections', label: 'Sections', icon: <Settings className="w-4 h-4" /> },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.consultations.toLocaleString()}</div>
              <div className="text-gray-600">Total Consultations</div>
              <div className="text-sm text-green-600 mt-2">+12% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.casesResolved.toLocaleString()}</div>
              <div className="text-gray-600">Cases Resolved</div>
              <div className="text-sm text-green-600 mt-2">+8% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Generated</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.documents.toLocaleString()}</div>
              <div className="text-gray-600">Legal Documents</div>
              <div className="text-sm text-green-600 mt-2">+15% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-gray-600">Active Users</div>
              <div className="text-sm text-blue-600 mt-2">Real-time</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Urgent</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.emergencyRequests}</div>
              <div className="text-gray-600">Emergency Requests</div>
              <div className="text-sm text-red-600 mt-2">Requires attention</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Available</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.lawyersOnline}</div>
              <div className="text-gray-600">Lawyers Online</div>
              <div className="text-sm text-green-600 mt-2">24/7 Support</div>
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
                  { action: 'New consultation request', user: 'Rajesh Kumar', time: '2 minutes ago', type: 'consultation' },
                  { action: 'Document generated', user: 'Priya Sharma', time: '5 minutes ago', type: 'document' },
                  { action: 'Emergency request', user: 'Anonymous', time: '8 minutes ago', type: 'emergency' },
                  { action: 'Case status updated', user: 'Admin', time: '15 minutes ago', type: 'case' },
                  { action: 'New lawyer registered', user: 'Advocate Singh', time: '1 hour ago', type: 'lawyer' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'emergency' ? 'bg-red-100' :
                        activity.type === 'consultation' ? 'bg-blue-100' :
                        activity.type === 'document' ? 'bg-purple-100' :
                        activity.type === 'case' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'emergency' && <AlertCircle className="w-4 h-4 text-red-600" />}
                        {activity.type === 'consultation' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'document' && <Download className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'case' && <Search className="w-4 h-4 text-green-600" />}
                        {activity.type === 'lawyer' && <Users className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">by {activity.user}</div>
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

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Portal Sections</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(section.status)}`}>
                    {section.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entries:</span>
                    <span className="font-medium">{section.totalEntries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{section.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => toggleSectionStatus(section.id)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      section.status === 'active' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {section.status === 'active' ? 'Disable' : 'Enable'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Most Popular Services</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Ask a Lawyer', usage: 45, color: 'bg-blue-500' },
                    { name: 'Case Tracker', usage: 32, color: 'bg-green-500' },
                    { name: 'Document Generator', usage: 28, color: 'bg-purple-500' },
                    { name: 'Legal Aid', usage: 23, color: 'bg-orange-500' },
                    { name: 'Property Law', usage: 18, color: 'bg-red-500' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-600">{service.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${service.color} h-2 rounded-full`}
                          style={{ width: `${service.usage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">{service.usage}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Monthly Trends</h4>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Analytics chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}