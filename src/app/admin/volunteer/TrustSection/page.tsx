  'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Users, 
  BarChart3, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  Upload, 
  Download,
  AlertCircle,
  CheckCircle,
  Building2,
  TrendingUp,
  Calendar,
  Globe,
  Award,
  Target,
  X
} from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  logo: string;
  website: string;
  status: 'active' | 'inactive';
  partnership_since: string;
  description: string;
  contact_email: string;
}

interface TrustMetrics {
  total_partners: number;
  verified_partners: number;
  transparency_score: number;
  impact_reports_published: number;
  certification_level: string;
}

export default function TrustSectionAdmin() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'United Way',
      logo: '/images/partners/united-way.svg',
      website: 'https://unitedway.org',
      status: 'active',
      partnership_since: '2022-01-15',
      description: 'Global movement focused on education, income and health',
      contact_email: 'partnerships@unitedway.org'
    },
    {
      id: '2',
      name: 'Red Cross',
      logo: '/images/partners/red-cross.svg',
      website: 'https://redcross.org',
      status: 'active',
      partnership_since: '2021-08-20',
      description: 'Humanitarian organization providing emergency assistance',
      contact_email: 'volunteer@redcross.org'
    },
    {
      id: '3',
      name: 'Habitat for Humanity',
      logo: '/images/partners/habitat.svg',
      website: 'https://habitat.org',
      status: 'active',
      partnership_since: '2023-03-10',
      description: 'Building homes, communities and hope',
      contact_email: 'info@habitat.org'
    }
  ]);

  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics>({
    total_partners: 3,
    verified_partners: 3,
    transparency_score: 94,
    impact_reports_published: 4,
    certification_level: 'Gold'
  });

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'partner_verified',
      message: 'New partner verified: Habitat for Humanity',
      timestamp: new Date().toISOString(),
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'report_published',
      message: 'Q4 Impact Report published',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'score_increase',
      message: 'Transparency score increased to 94%',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showViewPartnerModal, setShowViewPartnerModal] = useState(false);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '',
    website: '',
    description: '',
    contact_email: '',
    status: 'active',
    partnership_since: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update trust metrics when partners change
  const updateTrustMetrics = (partnersList: Partner[]) => {
    const activePartners = partnersList.filter(p => p.status === 'active');
    setTrustMetrics(prev => ({
      ...prev,
      total_partners: partnersList.length,
      verified_partners: activePartners.length
    }));
  };

  // Add activity to recent activities
  const addRecentActivity = (type: string, message: string, iconComponent: any, color: string) => {
    const newActivity = {
      _id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      icon: iconComponent,
      color
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep only 5 most recent
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/vtrust');
        const data = res.data;

        // Handle API response with fallback to defaults
        if (data.partners && Array.isArray(data.partners)) {
          setPartners(data.partners);

          
        }

        if (data.trustMetrics) {
          setTrustMetrics(data.trustMetrics);
        }
      } catch (err) {
        console.error('Failed to load trust section:', err);
        setError('Failed to load data from server, using local data');
        // Use default data when API fails
        updateTrustMetrics(partners);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle viewing partner details (Eye icon functionality)
  const handleViewPartner = (partnerId: string) => {
    // Use local data directly since individual partner endpoints aren't working
    const partner = partners.find(p => p._id === partnerId);
    if (partner) {
      setViewingPartner(partner);
      setShowViewPartnerModal(true);
    } else {
      setError('Partner not found');
    }
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleDownloadReport = (reportName: string, reportType: string) => {
    const reportData = generateReportData(reportType);
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addRecentActivity('report_generated', `${reportName} generated and downloaded`, FileText, 'text-blue-500');
  };

  const handleViewReport = (reportName: string, reportType: string) => {
    const reportData = generateReportData(reportType);
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>${reportName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; }
              .metric { background: #f9fafb; padding: 10px; margin: 10px 0; border-left: 4px solid #3b82f6; }
              .partners { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
              .partner-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background: #f3f4f6; }
            </style>
          </head>
          <body>
            ${generateReportHTML(reportName, reportData)}
          </body>
        </html>
      `);
    }
  };

  const generateReportData = (type: string) => {
    const baseData = {
      generatedAt: new Date().toISOString(),
      trustMetrics,
      partners: partners.filter(p => p.status === 'active')
    };

    switch (type) {
      case 'impact':
        return {
          ...baseData,
          type: 'Annual Impact Report',
          partnershipGrowth: Math.round(((trustMetrics.total_partners - 1) / Math.max(1, trustMetrics.total_partners)) * 100)
        };
      case 'partnership':
        return {
          ...baseData,
          type: 'Partnership Analysis Report',
          partnerAnalysis: partners.map(partner => ({
            name: partner.name,
            status: partner.status,
            duration: Math.floor((new Date().getTime() - new Date(partner.partnership_since).getTime()) / (1000 * 3600 * 24 * 365)),
            description: partner.description
          }))
        };
      case 'transparency':
        return {
          ...baseData,
          type: 'Transparency Audit Report',
          auditScore: trustMetrics.transparency_score,
          verificationRate: Math.round((trustMetrics.verified_partners / Math.max(1, trustMetrics.total_partners)) * 100),
          complianceMetrics: {
            dataAccuracy: 98,
            reportingTimeliness: 95,
            stakeholderCommunication: 92,
            financialTransparency: 96
          },
          recommendations: [
            'Continue quarterly transparency audits',
            'Enhance partner verification processes',
            'Implement real-time reporting dashboard',
            'Expand stakeholder feedback mechanisms'
          ]
        };
      default:
        return baseData;
    }
  };

  const generateReportHTML = (title: string, data: any) => {
    switch (data.type) {
      case 'Annual Impact Report':
        return `
          <h1>${title}</h1>
          <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
          
          <h2>Executive Summary</h2>
          <div class="metric">
            <strong>Active Partnerships:</strong> ${data.partners.length}
          </div>
          <div class="metric">
            <strong>Partnership Growth:</strong> ${data.partnershipGrowth}%
          </div>
          <div class="metric">
            <strong>Transparency Score:</strong> ${data.trustMetrics.transparency_score}%
          </div>

          <h2>Partner Organizations</h2>
          <div class="partners">
            ${data.partners.map((partner: Partner) => `
              <div class="partner-card">
                <h3>${partner.name}</h3>
                <p><strong>Partnership Since:</strong> ${new Date(partner.partnership_since).toLocaleDateString()}</p>
                <p><strong>Contact:</strong> ${partner.contact_email}</p>
                <p>${partner.description}</p>
              </div>
            `).join('')}
          </div>
        `;
      
      case 'Partnership Analysis Report':
        return `
          <h1>${title}</h1>
          <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
          
          <h2>Partnership Overview</h2>
          <table>
            <tr><th>Organization</th><th>Status</th><th>Years Active</th><th>Focus Area</th></tr>
            ${data.partnerAnalysis.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.status}</td>
                <td>${item.duration}</td>
                <td>${item.description}</td>
              </tr>
            `).join('')}
          </table>
        `;
      
      case 'Transparency Audit Report':
        return `
          <h1>${title}</h1>
          <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
          
          <h2>Overall Scores</h2>
          <div class="metric">
            <strong>Transparency Score:</strong> ${data.auditScore}%
          </div>
          <div class="metric">
            <strong>Partner Verification Rate:</strong> ${data.verificationRate}%
          </div>

          <h2>Compliance Metrics</h2>
          <table>
            <tr><th>Metric</th><th>Score</th></tr>
            ${Object.entries(data.complianceMetrics).map(([key, value]) => `
              <tr>
                <td>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                <td>${value}%</td>
              </tr>
            `).join('')}
          </table>

          <h2>Recommendations</h2>
          <ul>
            ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
          </ul>
        `;
      
      default:
        return `<h1>${title}</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  };

  const confirmGenerateReport = () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      const reportName = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
      handleDownloadReport(reportName, reportType);
      setIsGeneratingReport(false);
      setShowReportModal(false);
      setReportType('');
    }, 2000);
  };

  const handleAddPartner = () => {
    setShowAddPartnerModal(true);
  };

  const handleSaveNewPartner = async () => {
    if (!newPartner.name || !newPartner.contact_email || !newPartner.website) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const partnerToAdd = {
  ...newPartner,
  logo: '/images/partners/default.svg'
} as Omit<Partner, '_id'>; // Let backend generate _id


      // Try API call first, but don't fail if it doesn't work
      try {
        const response = await axios.post('http://localhost:5000/api/vtrust/partner', {
          partner: partnerToAdd
        });
        
        if (response.data && response.data.partners) {
          setPartners(response.data.partners);
          updateTrustMetrics(response.data.partners);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.warn('API call failed, updating locally:', apiError);
        // Fallback: update local state
        const updatedPartners = [...partners, partnerToAdd];
        setPartners(updatedPartners);
        updateTrustMetrics(updatedPartners);
      }
      
      // Add to recent activities
      addRecentActivity('partner_added', `New partner added: ${partnerToAdd.name}`, Plus, 'text-green-500');
      
      // Reset form and close modal
      setNewPartner({
        name: '',
        website: '',
        description: '',
        contact_email: '',
        status: 'active',
        partnership_since: new Date().toISOString().split('T')[0]
      });
      setShowAddPartnerModal(false);
      setError('');
      
    } catch (err) {
      console.error('Failed to add partner:', err);
      setError('Failed to add partner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setIsEditing(true);
  };

  const handleSavePartner = async () => {
    if (!editingPartner) return;

    setLoading(true);
    try {
      // Try API call first, but fallback to local update if it fails
      try {
        const response = await axios.put(`http://localhost:5000/api/vtrust/partner/${editingPartner._id}`, {
          partner: editingPartner
        });

        if (response.data && response.data.partners) {
          setPartners(response.data.partners);
          updateTrustMetrics(response.data.partners);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.warn('API call failed, updating locally:', apiError);
        // Fallback: update local state
        const updatedPartners = partners.map(p => 
          p._id === editingPartner._id ? editingPartner : p
        );
        setPartners(updatedPartners);
        updateTrustMetrics(updatedPartners);
      }
      
      // Add to recent activities
      addRecentActivity('partner_updated', `Partner updated: ${editingPartner.name}`, Edit, 'text-blue-500');
      
      setEditingPartner(null);
      setIsEditing(false);
      setError('');
      
    } catch (err) {
      console.error('Failed to save partner:', err);
      setError('Failed to save partner changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePartner = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    setLoading(true);
    try {
      const partnerToDelete = partners.find(p => p._id === _id);
      
      // Try API call first, but fallback to local update if it fails
      try {
        const response = await axios.delete(`http://localhost:5000/api/vtrust/partner/${_id}`);
        
        if (response.data && response.data.partners) {
          setPartners(response.data.partners);
          updateTrustMetrics(response.data.partners);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.warn('API call failed, updating locally:', apiError);
        // Fallback: update local state
        const updatedPartners = partners.filter(p => p._id !== _id);
        setPartners(updatedPartners);
        updateTrustMetrics(updatedPartners);
      }
      
      // Add to recent activities
      if (partnerToDelete) {
        addRecentActivity('partner_deleted', `Partner removed: ${partnerToDelete.name}`, Trash2, 'text-red-500');
      }
      
      setError('');
      
    } catch (err) {
      console.error('Failed to delete partner:', err);
      setError('Failed to delete partner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const clearError = () => {
    setError('');
  };

  if (loading && partners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trust section data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Trust & Transparency Management</h1>
        </div>
        <p className="text-gray-600">Manage partnerships and transparency metrics</p>
        
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Trust Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Partners</p>
              <p className="text-2xl font-bold text-gray-900">{trustMetrics.total_partners}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Partners</p>
              <p className="text-2xl font-bold text-green-600">{trustMetrics.verified_partners}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transparency Score</p>
              <p className="text-2xl font-bold text-purple-600">{trustMetrics.transparency_score}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impact Reports</p>
              <p className="text-2xl font-bold text-emerald-600">{trustMetrics.impact_reports_published}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certification</p>
              <p className="text-lg font-bold text-yellow-600">{trustMetrics.certification_level}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'partners', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Partner Status Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Status Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Inactive Partnerships</span>
                      <span className="font-semibold text-gray-600">
                        {partners.filter(p => p.status === 'inactive').length}
                      </span>
                    </div>
                    <div className="mt-4 bg-white rounded-lg p-4">
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                          style={{ 
                            width: `${(partners.filter(p => p.status === 'active').length / Math.max(1, partners.length)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {Math.round((partners.filter(p => p.status === 'active').length / Math.max(1, partners.length)) * 100)}% Active Rate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <IconComponent className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleAddPartner}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Plus className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-gray-900">Add New Partner</span>
                  </button>
                  
                  <button
                    onClick={handleGenerateReport}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <FileText className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Generate Report</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('partners')}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Users className="h-6 w-6 text-purple-600" />
                    <span className="font-medium text-gray-900">Manage Partners</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Partner Organizations</h3>
                <button
                  onClick={handleAddPartner}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Partner</span>
                </button>
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <div key={partner._id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(partner.status)}`}>
                            {partner.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewPartner(partner._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPartner(partner)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Partner"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-3">{partner.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Since {new Date(partner.partnership_since).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={partner.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors truncate"
                        >
                          {partner.website}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {partners.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No partners yet</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first partner organization.</p>
                  <button
                    onClick={handleAddPartner}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Partner
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
              </div>

              {/* Available Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Impact Report</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive overview of partnership impact and growth metrics.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport('Annual Impact Report', 'impact')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="h-4 w-4 inline mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadReport('Annual Impact Report', 'impact')}
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Partnership Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Detailed analysis of all partnership relationships and their effectiveness.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport('Partnership Analysis Report', 'partnership')}
                      className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                    >
                      <Eye className="h-4 w-4 inline mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadReport('Partnership Analysis Report', 'partnership')}
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Transparency Audit</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Transparency metrics, compliance scores, and audit recommendations.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport('Transparency Audit Report', 'transparency')}
                      className="flex-1 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    >
                      <Eye className="h-4 w-4 inline mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadReport('Transparency Audit Report', 'transparency')}
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Report History */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Report Activity</h4>
                <div className="space-y-3">
                  {recentActivities
                    .filter(activity => activity.type.includes('report'))
                    .slice(0, 5)
                    .map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <IconComponent className={`h-5 w-5 ${activity.color}`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  
                  {recentActivities.filter(activity => activity.type.includes('report')).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent report activity</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Partner Modal */}
      {isEditing && editingPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Partner</h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPartner(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={editingPartner.name}
                    onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website *
                  </label>
                  <input
                    type="url"
                    value={editingPartner.website}
                    onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={editingPartner.contact_email}
                    onChange={(e) => setEditingPartner({ ...editingPartner, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partnership Since
                  </label>
                  <input
                    type="date"
                    value={editingPartner.partnership_since}
                    onChange={(e) => setEditingPartner({ ...editingPartner, partnership_since: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPartner.status}
                    onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingPartner.description}
                    onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the organization and partnership"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSavePartner}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPartner(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Partner</h3>
                <button
                  onClick={() => {
                    setShowAddPartnerModal(false);
                    setNewPartner({
                      name: '',
                      website: '',
                      description: '',
                      contact_email: '',
                      status: 'active',
                      partnership_since: new Date().toISOString().split('T')[0]
                    });
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={newPartner.name || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website *
                  </label>
                  <input
                    type="url"
                    value={newPartner.website || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={newPartner.contact_email || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partnership Since
                  </label>
                  <input
                    type="date"
                    value={newPartner.partnership_since || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, partnership_since: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newPartner.status || 'active'}
                    onChange={(e) => setNewPartner({ ...newPartner, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newPartner.description || ''}
                    onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the organization and partnership"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveNewPartner}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Partner
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddPartnerModal(false);
                    setNewPartner({
                      name: '',
                      website: '',
                      description: '',
                      contact_email: '',
                      status: 'active',
                      partnership_since: new Date().toISOString().split('T')[0]
                    });
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Partner Details Modal */}
      {showViewPartnerModal && viewingPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Partner Details</h3>
                <button
                  onClick={() => {
                    setShowViewPartnerModal(false);
                    setViewingPartner(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Partner Header */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">{viewingPartner.name}</h4>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(viewingPartner.status)}`}>
                      {viewingPartner.status}
                    </span>
                  </div>
                </div>

                {/* Partner Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                      <a 
                        href={viewingPartner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="break-all">{viewingPartner.website}</span>
                      </a>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Contact Email</label>
                      <a 
                        href={`mailto:${viewingPartner.contact_email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                      >
                        {viewingPartner.contact_email}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Partnership Since</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-900">
                          {new Date(viewingPartner.partnership_since).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Partnership Duration</label>
                      <span className="text-gray-900">
                        {Math.floor((new Date().getTime() - new Date(viewingPartner.partnership_since).getTime()) / (1000 * 3600 * 24 * 365))} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                  <p className="text-gray-900 leading-relaxed">{viewingPartner.description}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowViewPartnerModal(false);
                      setViewingPartner(null);
                      handleEditPartner(viewingPartner);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Partner</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(viewingPartner.website, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visit Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportType('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Report Type
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value="impact"
                        checked={reportType === 'impact'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Impact Report</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Comprehensive overview of partnership impact and growth metrics
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value="partnership"
                        checked={reportType === 'partnership'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Partnership Analysis</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Detailed analysis of all partnership relationships
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reportType"
                        value="transparency"
                        checked={reportType === 'transparency'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Transparency Audit</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Transparency metrics and compliance scores
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={confirmGenerateReport}
                  disabled={!reportType || isGeneratingReport}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate & Download
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportType('');
                  }}
                  disabled={isGeneratingReport}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
