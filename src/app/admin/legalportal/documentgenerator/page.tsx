'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import { FileText, Download, Edit, Eye, Plus, Trash2, Check, X, BarChart3, Settings } from 'lucide-react';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  usageCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
  fields: number;
}

interface AppSettings {
  pdfQuality: string;
  pageSize: string;
  includeWatermark: boolean;
  requireLogin: boolean;
  enablePreview: boolean;
  maxDocumentsPerDay: number;
}

export default function DocumentGeneratorAdmin() {
  const [activeTab, setActiveTab] = useState<'templates' | 'analytics' | 'settings'>('templates');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: 'rent-agreement',
      title: 'Rent Agreement',
      description: 'Create a legally binding rental contract between landlord and tenant',
      usageCount: 342,
      lastUpdated: '2024-01-15',
      status: 'active',
      fields: 8
    },
    {
      id: 'affidavit',
      title: 'Affidavit',
      description: 'Generate self-declaration, name change or income affidavits',
      usageCount: 278,
      lastUpdated: '2024-01-14',
      status: 'active',
      fields: 6
    },
    {
      id: 'power-of-attorney',
      title: 'Power of Attorney',
      description: 'Create authorization documents for property or legal matters',
      usageCount: 156,
      lastUpdated: '2024-01-12',
      status: 'active',
      fields: 7
    },
    {
      id: 'will',
      title: 'Will Format',
      description: 'Draft a basic will document for property inheritance',
      usageCount: 89,
      lastUpdated: '2024-01-10',
      status: 'inactive',
      fields: 5
    },
    {
      id: 'sale-deed',
      title: 'Property Sale Deed',
      description: 'Generate basic property sale agreement documents',
      usageCount: 67,
      lastUpdated: '2024-01-08',
      status: 'active',
      fields: 9
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  


  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    pdfQuality: 'High (300dpi)',
    pageSize: 'A4',
    includeWatermark: false,
    requireLogin: true,
    enablePreview: true,
    maxDocumentsPerDay: 5
  });

  const [settingsChanged, setSettingsChanged] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [templatesRes, settingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/docu/templates'),
        axios.get('http://localhost:5000/api/docu/settings')
      ]);
      setTemplates(templatesRes.data);
      if (settingsRes.data) {
        setSettings(settingsRes.data);
      } else {
        console.warn("Received null settings data. Keeping defaults.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load templates or settings.');
    }
  };

  fetchData();
}, []);


  // Template functions
  const toggleTemplateStatus = async (id: string) => {
  try {
    const res = await axios.patch(`http://localhost:5000/api/docu/templates/${id}/toggle-status`);
    const { status } = res.data;

    setTemplates(prev =>
      prev.map(template =>
        template.id === id
          ? {
              ...template,
              status,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : template
      )
    );
  } catch (err) {
    console.error('Toggle error:', err);
    alert('Error toggling status.');
  }
};


  const handleEditTemplate = (template: DocumentTemplate) => {
    setCurrentTemplate({ ...template });
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleAddTemplate = () => {
    setCurrentTemplate({
      id: '',
      title: '',
      description: '',
      usageCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'active',
      fields: 0
    });
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleSaveTemplate = async () => {
  if (!currentTemplate || !currentTemplate.title.trim()) {
    alert('Please fill in all required fields');
    return;
  }

  const updatedTemplate = {
    ...currentTemplate,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const newId = currentTemplate.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const payload = isAddingNew ? { ...updatedTemplate, id: newId } : updatedTemplate;

  try {
    await axios.post('http://localhost:5000/api/docu/templates', payload);
    const res = await axios.get('http://localhost:5000/api/docu/templates');
    setTemplates(res.data);
    handleCancelEdit();
  } catch (error) {
    console.error('Save template error:', error);
    alert('Failed to save template.');
  }
};


  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setCurrentTemplate(null);
  };

  const handleDeleteTemplate = async (id: string) => {
  if (deleteConfirmId === id) {
    try {
      await axios.delete(`http://localhost:5000/api/docu/templates/${id}`);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete template.');
    }
    setDeleteConfirmId(null);
  } else {
    setDeleteConfirmId(id);
    setTimeout(() => setDeleteConfirmId(null), 3000);
  }
};


  const updateTemplateField = (field: keyof DocumentTemplate, value: any) => {
    if (!currentTemplate) return;
    setCurrentTemplate({ ...currentTemplate, [field]: value });
  };

  // Settings functions
  const updateSetting = (field: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSettingsChanged(true);
  };

  const saveSettings = async () => {
  try {
    await axios.put('http://localhost:5000/api/docu/settings', settings);
    setSettingsChanged(false);
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Save settings error:', error);
    alert('Failed to save settings.');
  }
};


  // Analytics calculations
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const activeTemplatesCount = templates.filter(t => t.status === 'active').length;
  const averageUsage = templates.length > 0 ? Math.round(totalUsage / templates.length) : 0;
  const mostUsedTemplate = templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0] || { usageCount: 0, title: 'None' });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Generator Admin</h1>
            <p className="text-gray-600">Manage document templates and track usage</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
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

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {isEditing ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isAddingNew ? 'Add New Template' : 'Edit Template'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={currentTemplate?.title || ''}
                    onChange={(e) => updateTemplateField('title', e.target.value)}
                    placeholder="Enter template title"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    value={currentTemplate?.description || ''}
                    onChange={(e) => updateTemplateField('description', e.target.value)}
                    placeholder="Enter template description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentTemplate?.status || 'active'}
                      onChange={(e) => updateTemplateField('status', e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Fields Count</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentTemplate?.fields || 0}
                      onChange={(e) => updateTemplateField('fields', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!currentTemplate?.title.trim()}
                >
                  {isAddingNew ? 'Add Template' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Document Templates ({templates.length})
                </h2>
                <button 
                  onClick={handleAddTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Template
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium text-gray-700">
                  <div className="col-span-4">Template</div>
                  <div className="col-span-2">Usage</div>
                  <div className="col-span-2">Fields</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {templates.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No templates found. Add your first template to get started.
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 transition-colors">
                      <div className="col-span-4">
                        <div className="font-medium text-gray-900">{template.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Updated: {template.lastUpdated}</div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium text-blue-600">{template.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium">{template.fields}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {template.status}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit template"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleTemplateStatus(template.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            template.status === 'active' 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={template.status === 'active' ? 'Disable template' : 'Enable template'}
                        >
                          {template.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            deleteConfirmId === template.id 
                              ? 'text-white bg-red-600 hover:bg-red-700' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteConfirmId === template.id ? 'Click again to confirm deletion' : 'Delete template'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Usage Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {totalUsage.toLocaleString()}
                </div>
                <div className="text-gray-700">Total Documents Generated</div>
                <div className="text-sm text-blue-600 mt-2">+15% from last month</div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {activeTemplatesCount}
                </div>
                <div className="text-gray-700">Active Templates</div>
                <div className="text-sm text-green-600 mt-2">Available for users</div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {averageUsage}
                </div>
                <div className="text-gray-700">Average Usage per Template</div>
                <div className="text-sm text-purple-600 mt-2">Most used: {mostUsedTemplate.title}</div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-700 mb-3">Template Usage Distribution</h4>
            {templates.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No templates available for analysis</div>
            ) : (
              <div className="space-y-3">
                {templates
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .map((template) => {
                    const percentage = totalUsage > 0 ? (template.usageCount / totalUsage) * 100 : 0;
                    return (
                      <div key={template.id} className="flex items-center gap-3">
                        <div className="w-48 text-sm text-gray-600 truncate" title={template.title}>
                          {template.title}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-gray-700 text-right">
                          {template.usageCount}
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-500 text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Generator Settings</h3>
              {settingsChanged && (
                <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">PDF Generation Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Default PDF Quality</label>
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.pdfQuality}
                      onChange={(e) => updateSetting('pdfQuality', e.target.value)}
                    >
                      <option>High (300dpi)</option>
                      <option>Medium (150dpi)</option>
                      <option>Low (72dpi)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Default Page Size</label>
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.pageSize}
                      onChange={(e) => updateSetting('pageSize', e.target.value)}
                    >
                      <option>A4</option>
                      <option>Letter</option>
                      <option>Legal</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Include Watermark</label>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={settings.includeWatermark}
                      onChange={(e) => updateSetting('includeWatermark', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Template Management</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Require Login for Download</label>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={settings.requireLogin}
                      onChange={(e) => updateSetting('requireLogin', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Enable Document Preview</label>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={settings.enablePreview}
                      onChange={(e) => updateSetting('enablePreview', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Max Documents per User (daily)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      className="px-4 py-2 border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.maxDocumentsPerDay}
                      onChange={(e) => updateSetting('maxDocumentsPerDay', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button 
                  onClick={saveSettings}
                  disabled={!settingsChanged}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settingsChanged 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {settingsChanged ? 'Save Settings' : 'Settings Saved'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}