'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Scale,
  Users,
  TreePine,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Building,
  Landmark,
  Paperclip,
  File,
  User,
  AlertCircle
} from 'lucide-react';

interface LegalTerm {
  _id: string;
  term: string;
  definition: string;
  example?: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface InheritanceRule {
  _id: string;
  religion: string;
  maleHeir: string[];
  femaleHeir: string[];
  spouse: string;
  specialNotes: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Document {
  _id: string;
  name: string;
  description: string;
  useCase: string;
  format: string;
  requirements: string[];
  templateUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  downloadCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface FarmerRight {
  _id: string;
  title: string;
  description: string;
  details: string[];
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function PropertyLawAdminPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'inheritance' | 'documents' | 'farmers' | 'analytics'>('terms');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Sample data - in real app this would come from API
  const [legalTerms, setLegalTerms] = useState<LegalTerm[]>([
    {
      _id: '1',
      term: 'Mutation',
      definition: 'The process of changing ownership records in government revenue records when property is transferred',
      example: 'After buying a house, you need to apply for mutation to get the property registered in your name',
      category: 'Property Transfer',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      _id: '2',
      term: 'Encumbrance Certificate',
      definition: 'A legal document showing the transaction history of a property for a specific period',
      example: 'Banks require encumbrance certificate to verify if the property has any legal disputes before approving loans',
      category: 'Documentation',
      status: 'active',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12'
    },
    {
      _id: '3',
      term: 'Freehold',
      definition: 'Complete ownership of property and the land it stands on, with no time limit',
      example: 'Most residential houses are freehold properties where you own both the building and land',
      category: 'Ownership Types',
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10'
    }
  ]);

  const [inheritanceRules, setInheritanceRules] = useState<InheritanceRule[]>([
    {
      _id: '1',
      religion: 'Hindu',
      maleHeir: ['Sons', 'Grandsons', 'Father', 'Brothers'],
      femaleHeir: ['Daughters', 'Mother', 'Wife', 'Sisters'],
      spouse: 'Wife gets equal share with sons',
      specialNotes: [
        'Hindu Succession Act 2005 gives equal rights to daughters',
        'Coparcenary rights from birth for sons and daughters'
      ],
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      _id: '2',
      religion: 'Muslim',
      maleHeir: ['Sons (2 shares)', 'Father', 'Husband', 'Brothers'],
      femaleHeir: ['Daughters (1 share)', 'Mother', 'Wife', 'Sisters'],
      spouse: 'Wife gets 1/8th if children exist, 1/4th if no children',
      specialNotes: [
        'Male heirs get double share compared to female heirs',
        'Maximum 1/3rd can be given as gift/will to non-heirs'
      ],
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12'
    }
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      _id: '1',
      name: 'Sale Agreement',
      description: 'Contract between buyer and seller for property purchase',
      useCase: 'Property buying/selling',
      format: 'Stamp paper with registration',
      requirements: ['Property details', 'Payment terms', 'Possession date', 'Both parties signatures'],
      fileName: 'sale_agreement_template.pdf',
      fileSize: 245000,
      fileType: 'application/pdf',
      downloadCount: 1250,
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Rent Agreement',
      description: 'Contract between landlord and tenant for property rental',
      useCase: 'Renting residential/commercial property',
      format: 'Stamp paper (₹100-500 depending on rent)',
      requirements: ['Monthly rent', 'Security deposit', 'Duration', 'Maintenance terms'],
      fileName: 'rent_agreement_template.docx',
      fileSize: 89000,
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      downloadCount: 890,
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    }
  ]);

  const [farmerRights, setFarmerRights] = useState<FarmerRight[]>([
    {
      _id: '1',
      title: 'Land Acquisition Rights',
      description: 'Fair compensation when government acquires agricultural land',
      details: [
        'Compensation at 4 times the market value for rural areas',
        'Compensation at 2 times for urban areas',
        'Rehabilitation and resettlement benefits'
      ],
      category: 'Compensation',
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ]);

  const BASE_URL = 'http://localhost:5000/api/property-law';

  useEffect(() => {
  fetch(`${BASE_URL}/all-data`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.terms)) setLegalTerms(data.terms);
      if (Array.isArray(data.inheritance)) setInheritanceRules(data.inheritance);
      if (Array.isArray(data.documents)) setDocuments(data.documents);
      if (Array.isArray(data.farmers)) setFarmerRights(data.farmers);
    })
    .catch(err => console.error(err));
}, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/property-law/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('File upload failed');

      const data = await response.json();

      // Save the uploaded file info to state
      setUploadedFile(file);
      handleInputChange('fileName', file.name);
      handleInputChange('fileSize', file.size);
      handleInputChange('fileType', file.type);
      handleInputChange('templateUrl', data.secure_url || data.url);

    } catch (error) {
      console.error('Upload error:', error);
      alert('File upload failed. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊';
    return '📁';
  };

  const handleSave = async () => {
  try {
    if (activeTab === 'terms') {
      if (editingItem) {
        await fetch(`${BASE_URL}/terms/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${BASE_URL}/terms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const res = await fetch(`${BASE_URL}/terms`);
      const data = await res.json();
      setLegalTerms(data);
    }

    else if (activeTab === 'inheritance') {
      if (editingItem) {
        await fetch(`${BASE_URL}/inheritance/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${BASE_URL}/inheritance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const res = await fetch(`${BASE_URL}/inheritance`);
      const data = await res.json();
      setInheritanceRules(data);
    }

    else if (activeTab === 'documents') {
      // Handle file upload if a new file is selected
      let fileData = {};

      if (uploadedFile) {
        const docFormData = new FormData();
        docFormData.append('file', uploadedFile);

        try {
          const fileUploadRes = await fetch(`${BASE_URL}/upload-file`, {
            method: 'POST',
            body: docFormData,
          });

          if (!fileUploadRes.ok) throw new Error('File upload failed');

          const uploadData = await fileUploadRes.json();
          fileData = {
            templateUrl: uploadData.secure_url || uploadData.url,
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size,
            fileType: uploadedFile.type,
          };
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          alert('File upload failed. Please try again.');
          return;
        }
      }

      // Final data to save - preserve existing file data if no new file uploaded
      const saveData = {
        ...formData,
        ...(uploadedFile ? fileData : {}), // Only update file data if new file uploaded
      };

      // Remove file data if it was explicitly removed
      if (!formData.fileName && !uploadedFile) {
        saveData.templateUrl = null;
        saveData.fileName = null;
        saveData.fileSize = null;
        saveData.fileType = null;
      }

      if (editingItem) {
        await fetch(`${BASE_URL}/documents/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
      } else {
        await fetch(`${BASE_URL}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
      }

      const res = await fetch(`${BASE_URL}/documents`);
      const data = await res.json();
      setDocuments(data);
    }

    else if (activeTab === 'farmers') {
      if (editingItem) {
        await fetch(`${BASE_URL}/farmers/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${BASE_URL}/farmers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const res = await fetch(`${BASE_URL}/farmers`);
      const data = await res.json();
      setFarmerRights(data);
    }

    closeModal();
  } catch (err) {
    console.error('Error saving data:', err);
  }
};

  const handleDelete = async (_id: string, type: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    let endpoint = '';
    if (type === 'term') endpoint = 'terms';
    else if (type === 'inheritance') endpoint = 'inheritance';
    else if (type === 'document') endpoint = 'documents';
    else if (type === 'farmer') endpoint = 'farmers';

    try {
      await axios.delete(`${BASE_URL}/${endpoint}/${_id}`);
      // Refresh the list
      const res = await axios.get(`${BASE_URL}/${endpoint}`);
      if (type === 'term') setLegalTerms(res.data);
      else if (type === 'inheritance') setInheritanceRules(res.data);
      else if (type === 'document') setDocuments(res.data);
      else if (type === 'farmer') setFarmerRights(res.data);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleStatus = async (id: string, type: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    let endpoint = '';

    if (type === 'term') endpoint = 'terms';
    else if (type === 'inheritance') endpoint = 'inheritance';
    else if (type === 'document') endpoint = 'documents';
    else if (type === 'farmer') endpoint = 'farmers';

    try {
      await axios.put(`${BASE_URL}/${endpoint}/${id}/status`, { status: newStatus });

      const res = await axios.get(`${BASE_URL}/${endpoint}`);
      if (type === 'term') setLegalTerms(res.data);
      else if (type === 'inheritance') setInheritanceRules(res.data);
      else if (type === 'document') setDocuments(res.data);
      else if (type === 'farmer') setFarmerRights(res.data);
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };

  const openPreview = (item: any) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewItem(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openModal = (type: string, item?: any) => {
    setEditingItem(item || null);
    setUploadedFile(null);
    if (item) {
      setFormData({...item});
    } else {
      setFormData({ status: 'active', requirements: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setUploadedFile(null);
  };

  const filteredTerms = legalTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Law Section Admin</h1>
              <p className="text-gray-600">Manage legal terms, inheritance laws, documents, and farmer rights</p>
            </div>
          </div>
          <div className="flex gap-3">
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{legalTerms.length}</div>
                <div className="text-gray-600">Legal Terms</div>
              </div>
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{inheritanceRules.length}</div>
                <div className="text-gray-600">Inheritance Rules</div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
                <div className="text-gray-600">Document Templates</div>
              </div>
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{farmerRights.length}</div>
                <div className="text-gray-600">Farmer Rights</div>
              </div>
              <TreePine className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'terms', label: 'Legal Terms', icon: <Scale className="w-4 h-4" /> },
            { id: 'inheritance', label: 'Inheritance', icon: <Users className="w-4 h-4" /> },
            { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
            { id: 'farmers', label: 'Farmer Rights', icon: <TreePine className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legal Terms Tab */}
      {activeTab === 'terms' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Legal Terms Management</h3>
                <button
                  onClick={() => openModal('term')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Term
                </button>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Definition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTerms.map((term) => (
                    <tr key={term._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{term.term}</div>
                        <div className="text-sm text-gray-500">Updated: {term.updatedAt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{term.definition}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {term.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${term.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {term.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal('term', term)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPreview(term)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(term._id, 'term')}
                            className="p-1 text-gray-400 hover:text-red-600"
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
        </motion.div>
      )}

      {/* Inheritance Rules Tab */}
      {activeTab === 'inheritance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Inheritance Rules Management</h3>
                <button
                  onClick={() => openModal('inheritance')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inheritanceRules.map((rule) => (
                  <div key={rule._id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Landmark className="w-6 h-6 text-purple-600" />
                        <h4 className="text-lg font-semibold text-gray-900">{rule.religion} Law</h4>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${rule.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {rule.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Male Heirs:</h5>
                        <div className="text-sm text-gray-600">{rule.maleHeir.join(', ')}</div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Female Heirs:</h5>
                        <div className="text-sm text-gray-600">{rule.femaleHeir.join(', ')}</div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Spouse Rights:</h5>
                        <div className="text-sm text-gray-600">{rule.spouse}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('inheritance', rule)}
                        className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openPreview(rule)}
                        className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDelete(rule._id, 'inheritance')}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Templates Management</h3>
                <button onClick={() => openModal('document')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Document
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <div key={doc._id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getFileIcon(doc.fileType || '')}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {doc.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div><strong>Use Case:</strong> {doc.useCase}</div>
                      <div><strong>Format:</strong> {doc.format}</div>
                      {doc.fileName && (
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span>{doc.fileName}</span>
                          {doc.fileSize && <span>({formatFileSize(doc.fileSize)})</span>}
                        </div>
                      )}
                      <div><strong>Downloads:</strong> {doc.downloadCount}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('document', doc)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openPreview(doc)}
                        className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm"
                      >
                        Preview
                      </button>
                      {doc.templateUrl && (
                        <button
                          onClick={() => window.open(doc.templateUrl, '_blank')}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                        >
                          Download
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(doc._id, 'document')}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Farmer Rights Tab */}
      {activeTab === 'farmers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Farmer Rights Management</h3>
                <button
                  onClick={() => openModal('farmer')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Right
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {farmerRights.map((right) => (
                  <div key={right._id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <TreePine className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{right.title}</h4>
                          <p className="text-gray-600">{right.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${right.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {right.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Details:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {right.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('farmer', right)}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openPreview(right)}
                        className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm"
                      >
                        Preview
                      </button>
                      
                      <button
                        onClick={() => handleDelete(right._id, 'farmer')}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Overview</h3>
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Legal Terms</span>
                  <span className="font-semibold">{legalTerms.filter(t => t.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inheritance Rules</span>
                  <span className="font-semibold">{inheritanceRules.filter(r => r.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Document Templates</span>
                  <span className="font-semibold">{documents.filter(d => d.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Farmer Rights</span>
                  <span className="font-semibold">{farmerRights.filter(f => f.status === 'active').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Document Downloads</h3>
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-4">
                {documents
                  .sort((a, b) => b.downloadCount - a.downloadCount)
                  .slice(0, 5)
                  .map((doc) => (
                    <div key={doc._id} className="flex justify-between items-center">
                      <span className="text-gray-600 truncate">{doc.name}</span>
                      <span className="font-semibold">{doc.downloadCount}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Legal Terms Form */}
                {activeTab === 'terms' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                      <input
                        type="text"
                        value={formData.term || ''}
                        onChange={(e) => handleInputChange('term', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter legal term"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Definition</label>
                      <textarea
                        value={formData.definition || ''}
                        onChange={(e) => handleInputChange('definition', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter definition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Example (Optional)</label>
                      <textarea
                        value={formData.example || ''}
                        onChange={(e) => handleInputChange('example', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter example"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="Property Transfer">Property Transfer</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Ownership Types">Ownership Types</option>
                        <option value="Legal Procedures">Legal Procedures</option>
                        <option value="Rights & Obligations">Rights & Obligations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Inheritance Rules Form */}
                {activeTab === 'inheritance' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                      <input
                        type="text"
                        value={formData.religion || ''}
                        onChange={(e) => handleInputChange('religion', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter religion"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Male Heirs (comma-separated)</label>
                      <textarea
                        value={Array.isArray(formData.maleHeir) ? formData.maleHeir.join(', ') : formData.maleHeir || ''}
                        onChange={(e) => handleInputChange('maleHeir', e.target.value.split(', ').filter(item => item.trim()))}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Sons, Father, Brothers"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Female Heirs (comma-separated)</label>
                      <textarea
                        value={Array.isArray(formData.femaleHeir) ? formData.femaleHeir.join(', ') : formData.femaleHeir || ''}
                        onChange={(e) => handleInputChange('femaleHeir', e.target.value.split(', ').filter(item => item.trim()))}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Daughters, Mother, Wife"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Rights</label>
                      <textarea
                        value={formData.spouse || ''}
                        onChange={(e) => handleInputChange('spouse', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Describe spouse inheritance rights"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (comma-separated)</label>
                      <textarea
                        value={Array.isArray(formData.specialNotes) ? formData.specialNotes.join(', ') : formData.specialNotes || ''}
                        onChange={(e) => handleInputChange('specialNotes', e.target.value.split(', ').filter(item => item.trim()))}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Special considerations, recent law changes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Documents Form */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter document name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
                      <input
                        type="text"
                        value={formData.useCase || ''}
                        onChange={(e) => handleInputChange('useCase', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="When to use this document"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <input
                        type="text"
                        value={formData.format || ''}
                        onChange={(e) => handleInputChange('format', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Legal format requirements"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (comma-separated)</label>
                      <textarea
                        value={Array.isArray(formData.requirements) ? formData.requirements.join(', ') : formData.requirements || ''}
                        onChange={(e) => handleInputChange('requirements', e.target.value.split(', ').filter(item => item.trim()))}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Required information, documents needed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Template File</label>
                      <div className="space-y-3">
                        {formData.fileName && !uploadedFile && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getFileIcon(formData.fileType)}</span>
                              <div>
                                <div className="text-sm font-medium">{formData.fileName}</div>
                                {formData.fileSize && (
                                  <div className="text-xs text-gray-500">{formatFileSize(formData.fileSize)}</div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                handleInputChange('fileName', '');
                                handleInputChange('fileSize', null);
                                handleInputChange('fileType', '');
                                handleInputChange('templateUrl', '');
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {uploadedFile && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getFileIcon(uploadedFile.type)}</span>
                              <div>
                                <div className="text-sm font-medium">{uploadedFile.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Farmer Rights Form */}
                {activeTab === 'farmers' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter right title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Details (comma-separated)</label>
                      <textarea
                        value={Array.isArray(formData.details) ? formData.details.join(', ') : formData.details || ''}
                        onChange={(e) => handleInputChange('details', e.target.value.split(', ').filter(item => item.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Detailed explanation of rights"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="Compensation">Compensation</option>
                        <option value="Land Rights">Land Rights</option>
                        <option value="Water Rights">Water Rights</option>
                        <option value="Subsidies">Subsidies</option>
                        <option value="Legal Protection">Legal Protection</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Legal Terms Preview */}
                {activeTab === 'terms' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{previewItem.term}</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {previewItem.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          previewItem.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {previewItem.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Definition:</h5>
                      <p className="text-gray-600 leading-relaxed">{previewItem.definition}</p>
                    </div>
                    
                    {previewItem.example && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Example:</h5>
                        <p className="text-gray-600 leading-relaxed italic bg-gray-50 p-3 rounded-lg">
                          {previewItem.example}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500 pt-4 border-t">
                      <div>Created: {new Date(previewItem.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(previewItem.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                {/* Inheritance Rules Preview */}
                {activeTab === 'inheritance' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Landmark className="w-6 h-6 text-purple-600" />
                        <h4 className="text-lg font-semibold text-gray-900">{previewItem.religion} Inheritance Law</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          previewItem.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {previewItem.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Male Heirs:
                        </h5>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {previewItem.maleHeir.map((heir, index) => (
                            <li key={index}>{heir}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Female Heirs:
                        </h5>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {previewItem.femaleHeir.map((heir, index) => (
                            <li key={index}>{heir}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Spouse Rights:</h5>
                      <p className="text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg">
                        {previewItem.spouse}
                      </p>
                    </div>
                    
                    {previewItem.specialNotes && previewItem.specialNotes.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Special Notes:
                        </h5>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 bg-yellow-50 p-3 rounded-lg">
                          {previewItem.specialNotes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500 pt-4 border-t">
                      <div>Created: {new Date(previewItem.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(previewItem.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                {/* Documents Preview */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{getFileIcon(previewItem.fileType || '')}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{previewItem.name}</h4>
                          <p className="text-gray-600">{previewItem.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          previewItem.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {previewItem.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Use Case:</h5>
                        <p className="text-gray-600">{previewItem.useCase}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Format:</h5>
                        <p className="text-gray-600">{previewItem.format}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Requirements:</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {previewItem.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {previewItem.fileName && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Template File:</h5>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="text-sm font-medium">{previewItem.fileName}</div>
                              {previewItem.fileSize && (
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(previewItem.fileSize)}
                                </div>
                              )}
                            </div>
                          </div>
                          {previewItem.templateUrl && (
                            <button
                              onClick={() => window.open(previewItem.templateUrl, '_blank')}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        <div>Downloads: {previewItem.downloadCount}</div>
                        <div>Created: {new Date(previewItem.createdAt).toLocaleDateString()}</div>
                        <div>Updated: {new Date(previewItem.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Farmer Rights Preview */}
                {activeTab === 'farmers' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <TreePine className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{previewItem.title}</h4>
                          <p className="text-gray-600">{previewItem.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          previewItem.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {previewItem.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Category:</h5>
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        {previewItem.category}
                      </span>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Details:</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-2 bg-green-50 p-4 rounded-lg">
                        {previewItem.details.map((detail, index) => (
                          <li key={index} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-sm text-gray-500 pt-4 border-t">
                      <div>Created: {new Date(previewItem.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(previewItem.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}