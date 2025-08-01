'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Eye,
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Filter,
  Search,
  Calendar,
  X
} from 'lucide-react';

interface ComplaintTemplate {
  _id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  useCase: string;
  content: string;
  downloads: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface CaseStory {
  _id: string;
  title: string;
  category: string;
  issue: string;
  resolution: string;
  timeframe: string;
  compensation: string;
  status: 'resolved' | 'ongoing' | 'dismissed';
  dateAdded: string;
  isPublic: boolean;
}

interface RTIApplication {
  _id: string;
  applicantName: string;
  department: string;
  submissionDate: string;
  status: 'pending' | 'processed' | 'completed';
  informationType: string;
}

interface AdminStats {
  totalTemplates: number;
  activeTemplates: number;
  totalDownloads: number;
  caseStories: number;
  rtiApplications: number;
  monthlyUsers: number;
}

export default function ConsumerRightsAdmin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'cases' | 'rti' | 'analytics'>('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<ComplaintTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState({
    templates: false,
    cases: false,
    rti: false
  });
  const [error, setError] = useState({
    templates: '',
    cases: '',
    rti: ''
  });

  // Template state
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: '',
    description: '',
    format: '',
    useCase: '',
    content: ''
  });

  // Case story state
  const [newCase, setNewCase] = useState({
    title: '',
    category: '',
    issue: '',
    resolution: '',
    timeframe: '',
    compensation: '',
    status: 'resolved' as 'resolved' | 'ongoing' | 'dismissed',
    isPublic: true
  });

  // Analytics data
  const [analyticsData] = useState({
    downloadsByCategory: [
      { category: 'Product Quality', downloads: 25000 },
      { category: 'Service Issues', downloads: 18000 },
      { category: 'E-commerce', downloads: 15000 },
      { category: 'Healthcare', downloads: 10000 },
      { category: 'Banking', downloads: 8000 }
    ],
    monthlyDownloads: [
      { month: 'Jan', downloads: 12000 },
      { month: 'Feb', downloads: 15000 },
      { month: 'Mar', downloads: 18000 },
      { month: 'Apr', downloads: 16000 },
      { month: 'May', downloads: 20000 },
      { month: 'Jun', downloads: 22000 }
    ]
  });

  const [stats] = useState<AdminStats>({
    totalTemplates: 12,
    activeTemplates: 10,
    totalDownloads: 45623,
    caseStories: 25,
    rtiApplications: 1248,
    monthlyUsers: 8934
  });

  const [templates, setTemplates] = useState<ComplaintTemplate[]>([]);
  const [caseStories, setCaseStories] = useState<CaseStory[]>([]);
  const [rtiApplications, setRtiApplications] = useState<RTIApplication[]>([]);

  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(prev => ({...prev, templates: true}));
      setError(prev => ({...prev, templates: ''}));
      try {
        const res = await fetch('http://localhost:5000/api/right/templates');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError(prev => ({...prev, templates: 'Failed to load templates'}));
      } finally {
        setIsLoading(prev => ({...prev, templates: false}));
      }
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    async function fetchCases() {
      setIsLoading(prev => ({...prev, cases: true}));
      setError(prev => ({...prev, cases: ''}));
      try {
        const res = await fetch('http://localhost:5000/api/right/cases');
        if (!res.ok) throw new Error('Failed to fetch cases');
        const data = await res.json();
        setCaseStories(data);
      } catch (err) {
        console.error('Error loading case stories:', err);
        setError(prev => ({...prev, cases: 'Failed to load case stories'}));
      } finally {
        setIsLoading(prev => ({...prev, cases: false}));
      }
    }
    fetchCases();
  }, []);

  useEffect(() => {
    async function fetchRTIs() {
      setIsLoading(prev => ({...prev, rti: true}));
      setError(prev => ({...prev, rti: ''}));
      try {
        const res = await fetch('http://localhost:5000/api/right/rtis');
        if (!res.ok) throw new Error('Failed to fetch RTIs');
        const data = await res.json();
        setRtiApplications(data);
      } catch (err) {
        console.error('Error loading RTIs:', err);
        setError(prev => ({...prev, rti: 'Failed to load RTI applications'}));
      } finally {
        setIsLoading(prev => ({...prev, rti: false}));
      }
    }
    fetchRTIs();
  }, []);

  // Template functions
  const toggleTemplateStatus = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/right/templates/${id}/toggle`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle template status');
      }
      
      setTemplates(prev => prev.map(t => 
        t._id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
      ));
    } catch (err) {
      console.error('Toggle status failed:', err);
      alert('Failed to update template status');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/right/templates/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      
      setTemplates(prev => prev.filter(template => template._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete template');
    }
  };

  const handleEditTemplate = (template: ComplaintTemplate) => {
    setNewTemplate({
      title: template.title,
      category: template.category,
      description: template.description,
      format: template.format,
      useCase: template.useCase,
      content: template.content
    });
    setEditingTemplate(template._id);
    setIsAddingTemplate(true);
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingTemplate ? 'PUT' : 'POST';
    const url = editingTemplate 
      ? `http://localhost:5000/api/right/templates/${editingTemplate}`
      : 'http://localhost:5000/api/right/templates';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      });

      if (!response.ok) {
        throw new Error(editingTemplate ? 'Failed to update template' : 'Failed to create template');
      }

      const updatedTemplate = await response.json();
      
      if (editingTemplate) {
        setTemplates(prev => prev.map(t => 
          t._id === editingTemplate ? updatedTemplate : t
        ));
      } else {
        setTemplates(prev => [...prev, updatedTemplate]);
      }

      setNewTemplate({
        title: '',
        category: '',
        description: '',
        format: '',
        useCase: '',
        content: ''
      });
      setEditingTemplate(null);
      setIsAddingTemplate(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert(editingTemplate ? 'Failed to update template' : 'Failed to create template');
    }
  };

  const handlePreviewTemplate = (template: ComplaintTemplate) => {
    setSelectedTemplate(template);
  };

  const handleDownloadTemplate = (template: ComplaintTemplate) => {
    const content = `
To,
The Registrar,
${template.format}
[Address]

Subject: Consumer Complaint regarding ${template.category}

Sir/Madam,

I, [Your Name], am filing this complaint against [Company/Shop Name] regarding the following issue:

${template.description}

Use Case: ${template.useCase}

[Detailed complaint content would go here]

Yours faithfully,
[Your Name]
[Contact Details]
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Optimistic update
    setTemplates(prev => prev.map(t => 
      t._id === template._id ? { ...t, downloads: t.downloads + 1 } : t
    ));
  };

  // Case story functions
  const toggleCaseVisibility = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/right/cases/${id}/toggle`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle case visibility');
      }
      
      setCaseStories(prev =>
        prev.map(c =>
          c._id === id ? { ...c, isPublic: !c.isPublic } : c
        )
      );
    } catch (err) {
      console.error('Visibility toggle failed:', err);
      alert('Failed to update case visibility');
    }
  };

  const deleteCaseStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case story?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/right/cases/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete case');
      }
      
      setCaseStories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete case story');
    }
  };

  const handleAddCase = () => {
    setNewCase({
      title: '',
      category: '',
      issue: '',
      resolution: '',
      timeframe: '',
      compensation: '',
      status: 'resolved',
      isPublic: true
    });
    setIsAddingCase(true);
  };

  const handleEditCase = (caseStory: CaseStory) => {
    setNewCase({
      title: caseStory.title,
      category: caseStory.category,
      issue: caseStory.issue,
      resolution: caseStory.resolution,
      timeframe: caseStory.timeframe,
      compensation: caseStory.compensation,
      status: caseStory.status,
      isPublic: caseStory.isPublic
    });
    setEditingCase(caseStory._id);
    setIsAddingCase(true);
  };

  const handleSaveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCase 
      ? `http://localhost:5000/api/right/cases/${editingCase}`
      : 'http://localhost:5000/api/right/cases';
    
    try {
      const response = await fetch(url, {
        method: editingCase ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase)
      });

      if (!response.ok) {
        throw new Error(editingCase ? 'Failed to update case' : 'Failed to create case');
      }

      const updatedCase = await response.json();
      
      if (editingCase) {
        setCaseStories(prev => prev.map(c => 
          c._id === editingCase ? updatedCase : c
        ));
      } else {
        setCaseStories(prev => [...prev, updatedCase]);
      }

      setNewCase({
        title: '',
        category: '',
        issue: '',
        resolution: '',
        timeframe: '',
        compensation: '',
        status: 'resolved',
        isPublic: true
      });
      setEditingCase(null);
      setIsAddingCase(false);
    } catch (error) {
      console.error('Error saving case:', error);
      alert(editingCase ? 'Failed to update case' : 'Failed to create case');
    }
  };

  // RTI functions
  const deleteRTIApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RTI application?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/right/rtis/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete RTI application');
      }
      
      setRtiApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error('Delete RTI failed:', err);
      alert('Failed to delete RTI application');
    }
  };

  const updateRTIStatus = async (id: string, newStatus: 'pending' | 'processed' | 'completed') => {
    try {
      const response = await fetch(`http://localhost:5000/api/right/rtis/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update RTI status');
      }

      setRtiApplications(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Update RTI failed:', err);
      alert('Failed to update RTI status');
    }
  };

  const handleSearchRTI = () => {
    if (!searchQuery.trim()) return rtiApplications;
    
    return rtiApplications.filter(app => 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.informationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleExportRTI = () => {
    const csvContent = [
      ['Application ID', 'Applicant Name', 'Department', 'Information Type', 'Submission Date', 'Status'],
      ...rtiApplications.map(app => [
        app._id,
        app.applicantName,
        app.department,
        app.informationType,
        app.submissionDate,
        app.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RTI_Applications_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleViewRTI = (application: RTIApplication) => {
    alert(`RTI Application Details:
    
ID: ${application._id}
Applicant: ${application.applicantName}
Department: ${application.department}
Information Type: ${application.informationType}
Submission Date: ${application.submissionDate}
Status: ${application.status}
    
[In a real application, this would open a detailed view modal]`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-yellow-600 bg-yellow-100';
      case 'dismissed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (filterStatus === 'all') return true;
    return template.status === filterStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consumer Rights & RTI Admin</h1>
            <p className="text-gray-600">Manage complaint templates, case stories, and RTI applications</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'cases', label: 'Case Stories', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'rti', label: 'RTI Applications', icon: <Eye className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
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

      {/* Error Messages */}
      {error.templates && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error.templates}</p>
        </div>
      )}
      {error.cases && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error.cases}</p>
        </div>
      )}
      {error.rti && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error.rti}</p>
        </div>
      )}

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
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTemplates}</div>
              <div className="text-gray-600">Complaint Templates</div>
              <div className="text-sm text-green-600 mt-2">{stats.activeTemplates} active</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalDownloads.toLocaleString()}</div>
              <div className="text-gray-600">Template Downloads</div>
              <div className="text-sm text-green-600 mt-2">+15% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Published</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.caseStories}</div>
              <div className="text-gray-600">Success Stories</div>
              <div className="text-sm text-green-600 mt-2">3 added this week</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Submitted</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rtiApplications.toLocaleString()}</div>
              <div className="text-gray-600">RTI Applications</div>
              <div className="text-sm text-blue-600 mt-2">45 pending review</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.monthlyUsers.toLocaleString()}</div>
              <div className="text-gray-600">Monthly Users</div>
              <div className="text-sm text-green-600 mt-2">+22% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-500">Urgent</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
              <div className="text-gray-600">Pending Reviews</div>
              <div className="text-sm text-red-600 mt-2">Requires attention</div>
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
                  { action: 'New template downloaded', item: 'Defective Product Complaint', time: '5 minutes ago', type: 'download' },
                  { action: 'Case story published', item: 'Insurance Claim Success', time: '1 hour ago', type: 'case' },
                  { action: 'RTI application submitted', item: 'Property Records Request', time: '2 hours ago', type: 'rti' },
                  { action: 'Template updated', item: 'Service Deficiency Complaint', time: '3 hours ago', type: 'update' },
                  { action: 'New user registration', item: 'Consumer Portal', time: '4 hours ago', type: 'user' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'download' ? 'bg-blue-100' :
                        activity.type === 'case' ? 'bg-green-100' :
                        activity.type === 'rti' ? 'bg-orange-100' :
                        activity.type === 'update' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'download' && <Download className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'case' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {activity.type === 'rti' && <Eye className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'update' && <Edit className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'user' && <Users className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.item}</div>
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

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Complaint Templates</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => {
                setNewTemplate({
                  title: '',
                  category: '',
                  description: '',
                  format: '',
                  useCase: '',
                  content: ''
                });
                setEditingTemplate(null);
                setIsAddingTemplate(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>

          {isLoading.templates ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteTemplate(template._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{template.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium">{template.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{template.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => toggleTemplateStatus(template._id)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        template.status === 'active' 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {template.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Case Stories Tab */}
      {activeTab === 'cases' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Success Stories</h2>
            <button 
              onClick={handleAddCase}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Story
            </button>
          </div>

          {isLoading.cases ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {caseStories.map((story) => (
                <div key={story._id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {story.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(story.status)}`}>
                          {story.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${story.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {story.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCase(story)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCaseStory(story._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Issue:</h4>
                      <p className="text-gray-600 text-sm mb-4">{story.issue}</p>
                      
                      <h4 className="font-medium text-gray-800 mb-2">Resolution:</h4>
                      <p className="text-gray-600 text-sm">{story.resolution}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800 text-sm">Duration:</span>
                        </div>
                        <p className="text-blue-600 font-bold text-sm">{story.timeframe}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800 text-sm">Outcome:</span>
                        </div>
                        <p className="text-green-600 font-bold text-sm">{story.compensation}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-800 text-sm">Added:</span>
                        </div>
                        <p className="text-gray-600 font-bold text-sm">{story.dateAdded}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* RTI Tab */}
      {activeTab === 'rti' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">RTI Applications</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setSearchQuery(prev => prev ? '' : 'search')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button 
                onClick={handleExportRTI}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Search input */}
          {searchQuery !== '' && (
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search applications..."
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {isLoading.rti ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Application ID</th>
                      <th className="text-left p-4 font-medium text-gray-700">Applicant</th>
                      <th className="text-left p-4 font-medium text-gray-700">Department</th>
                      <th className="text-left p-4 font-medium text-gray-700">Information Type</th>
                      <th className="text-left p-4 font-medium text-gray-700">Date</th>
                      <th className="text-left p-4 font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {handleSearchRTI().map((application) => (
                      <tr key={application._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm">{application._id}</td>
                        <td className="p-4">{application.applicantName}</td>
                        <td className="p-4">{application.department}</td>
                        <td className="p-4">{application.informationType}</td>
                        <td className="p-4">{application.submissionDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewRTI(application)}
                              className="p-1 text-gray-500 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateRTIStatus(application._id, application.status === 'pending' ? 'processed' : application.status === 'processed' ? 'completed' : 'pending')}
                              className="p-1 text-gray-500 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteRTIApplication(application._id)}
                              className="p-1 text-gray-500 hover:text-red-600"
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
          )}
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Template Downloads by Category</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  <div className="space-y-3">
                    {analyticsData.downloadsByCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: `hsl(${index * 60}, 70%, 50%)`}}></div>
                          <span className="text-sm">{item.category}</span>
                        </div>
                        <span className="text-sm font-medium">{item.downloads.toLocaleString()}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{width: `${(item.downloads / 25000) * 100}%`, backgroundColor: `hsl(${index * 60}, 70%, 50%)`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Monthly Downloads Trend</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  <div className="flex items-end justify-between h-full">
                    {analyticsData.monthlyDownloads.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className="bg-blue-500 w-8 rounded-t"
                          style={{height: `${(item.downloads / 22000) * 200}px`}}
                        ></div>
                        <span className="text-xs text-gray-600">{item.month}</span>
                        <span className="text-xs font-medium">{item.downloads.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Most Popular Templates</h3>
                <div className="space-y-3">
                  {templates
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 3)
                    .map((template, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{template.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">{template.downloads.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">RTI Application Status</h3>
                <div className="space-y-3">
                  {[
                    { status: 'Pending', count: 45, color: 'bg-yellow-100 text-yellow-800' },
                    { status: 'Processed', count: 28, color: 'bg-blue-100 text-blue-800' },
                    { status: 'Completed', count: 75, color: 'bg-green-100 text-green-800' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">User Activity</h3>
                <div className="space-y-3">
                  {[
                    { metric: 'Daily Active Users', value: '1,234', change: '+12%' },
                    { metric: 'Avg. Session Duration', value: '8m 24s', change: '+5%' },
                    { metric: 'Pages per Session', value: '4.2', change: '+3%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.metric}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">{item.value}</span>
                        <span className="text-xs text-green-600 ml-2">{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Template Modal */}
      {isAddingTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsAddingTemplate(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Add New Complaint Template'}
              </h3>
              <button
                onClick={() => setIsAddingTemplate(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleUpdateTemplate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Template title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Product Quality">Product Quality</option>
                    <option value="Service Issues">Service Issues</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Banking">Banking</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({...prev, description: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of when to use this template"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                    value={newTemplate.format}
                    onChange={(e) => setNewTemplate(prev => ({...prev, format: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="District Consumer Forum">District Consumer Forum</option>
                    <option value="State Consumer Commission">State Consumer Commission</option>
                    <option value="National Consumer Commission">National Consumer Commission</option>
                    <option value="Medical Consumer Forum">Medical Consumer Forum</option>
                  </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Use Cases</label>
                <textarea
                  rows={2}
                  value={newTemplate.useCase}
                  onChange={(e) => setNewTemplate(prev => ({...prev, useCase: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example scenarios where this template applies"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Content</label>
                <textarea
                  rows={8}
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({...prev, content: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste the template content here..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingTemplate(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTemplate ? 'Update Template' : 'Save Template'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Case Story Modal */}
      {isAddingCase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsAddingCase(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCase ? 'Edit Case Story' : 'Add New Case Story'}
              </h3>
              <button
                onClick={() => setIsAddingCase(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSaveCase}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Travel">Travel</option>
                    <option value="Banking">Banking</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
                <textarea
                  rows={3}
                  value={newCase.issue}
                  onChange={(e) => setNewCase(prev => ({...prev, issue: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <textarea
                  rows={3}
                  value={newCase.resolution}
                  onChange={(e) => setNewCase(prev => ({...prev, resolution: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                  <input
                    type="text"
                    value={newCase.timeframe}
                    onChange={(e) => setNewCase(prev => ({...prev, timeframe: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3 months"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compensation</label>
                  <input
                    type="text"
                    value={newCase.compensation}
                    onChange={(e) => setNewCase(prev => ({...prev, compensation: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ₹25,000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCase.status}
                    onChange={(e) => setNewCase(prev => ({...prev, status: e.target.value as 'resolved' | 'ongoing' | 'dismissed'}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="resolved">Resolved</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newCase.isPublic}
                    onChange={(e) => setNewCase(prev => ({...prev, isPublic: e.target.checked}))}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    Make this story public
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingCase(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingCase ? 'Update Story' : 'Save Story'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedTemplate.title}</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTemplate.status)}`}>
                  {selectedTemplate.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedTemplate.category}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedTemplate.downloads.toLocaleString()} downloads
                </span>
              </div>

              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Format</h4>
                  <p className="text-gray-700">{selectedTemplate.format}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Use Cases</h4>
                  <p className="text-gray-700">{selectedTemplate.useCase}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Template Preview:</h4>
                <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded border">
                  <p>To,</p>
                  <p>The Registrar,</p>
                  <p>{selectedTemplate.format}</p>
                  <p>[Address]</p>
                  <br />
                  <p>Subject: Consumer Complaint regarding {selectedTemplate.category}</p>
                  <br />
                  <p>Sir/Madam,</p>
                  <br />
                  <p>I, [Your Name], am filing this complaint against [Company/Shop Name]...</p>
                  <p className="text-gray-500">[Template continues with proper legal format]</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleDownloadTemplate(selectedTemplate)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Full Template
                </button>
                <button 
                  onClick={() => {
                    handleEditTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}