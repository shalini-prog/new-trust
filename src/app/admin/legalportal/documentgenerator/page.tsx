'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit, Eye, Plus, Trash2, Check, X, BarChart3 } from 'lucide-react';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  usageCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
  fields: number;
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

  const toggleTemplateStatus = (id: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, status: template.status === 'active' ? 'inactive' : 'active' }
        : template
    ));
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
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
  };

  const handleSaveTemplate = () => {
    if (!currentTemplate) return;
    
    if (isAddingNew) {
      setTemplates([...templates, {
        ...currentTemplate,
        id: currentTemplate.title.toLowerCase().replace(/\s+/g, '-')
      }]);
    } else {
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? currentTemplate : t
      ));
    }
    
    setIsEditing(false);
    setIsAddingNew(false);
    setCurrentTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
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
            { id: 'settings', label: 'Settings', icon: <Edit className="w-4 h-4" /> }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {isEditing || isAddingNew ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isAddingNew ? 'Add New Template' : 'Edit Template'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={currentTemplate?.title || ''}
                    onChange={(e) => setCurrentTemplate({
                      ...currentTemplate!,
                      title: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    value={currentTemplate?.description || ''}
                    onChange={(e) => setCurrentTemplate({
                      ...currentTemplate!,
                      description: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={currentTemplate?.status || 'active'}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate!,
                        status: e.target.value as 'active' | 'inactive'
                      })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Fields Count</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={currentTemplate?.fields || 0}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate!,
                        fields: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsAddingNew(false);
                    setCurrentTemplate(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Document Templates</h2>
                <button 
                  onClick={handleAddTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  <div className="col-span-2">Last Updated</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {templates.map((template) => (
                  <div key={template.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
                    <div className="col-span-4">
                      <div className="font-medium text-gray-900">{template.title}</div>
                      <div className="text-sm text-gray-600">{template.description}</div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="font-medium">{template.usageCount}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="font-medium">{template.fields}</span>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-600">
                      {template.lastUpdated}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTemplateStatus(template.id)}
                        className={`p-2 rounded-lg ${
                          template.status === 'active' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={template.status === 'active' ? 'Disable' : 'Enable'}
                      >
                        {template.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Usage Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
                </div>
                <div className="text-gray-700">Total Documents Generated</div>
                <div className="text-sm text-blue-600 mt-2">+15% from last month</div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {templates.filter(t => t.status === 'active').length}
                </div>
                <div className="text-gray-700">Active Templates</div>
                <div className="text-sm text-green-600 mt-2">Available for users</div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {Math.round(templates.reduce((sum, t) => sum + t.usageCount, 0) / templates.length)}
                </div>
                <div className="text-gray-700">Average Usage per Template</div>
                <div className="text-sm text-purple-600 mt-2">Most used: Rent Agreement</div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-700 mb-3">Template Usage Distribution</h4>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center gap-3">
                  <div className="w-48 text-sm text-gray-600">{template.title}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${(template.usageCount / templates.reduce((sum, t) => sum + t.usageCount, 0)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-700">
                    {Math.round((template.usageCount / templates.reduce((sum, t) => sum + t.usageCount, 0)) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Generator Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">PDF Generation Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Default PDF Quality</label>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg w-48">
                      <option>High (300dpi)</option>
                      <option>Medium (150dpi)</option>
                      <option>Low (72dpi)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Default Page Size</label>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg w-48">
                      <option>A4</option>
                      <option>Letter</option>
                      <option>Legal</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Include Watermark</label>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Template Management</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Require Login for Download</label>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Enable Document Preview</label>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Max Documents per User (daily)</label>
                    <input type="number" className="px-4 py-2 border border-gray-300 rounded-lg w-24" defaultValue="5" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}