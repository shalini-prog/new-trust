'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Download, 
  ChevronDown, 
  ChevronUp,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  FileText,
  Scale,
  BarChart2,
  Users,
  Settings,
  AlertCircle,
  Upload,
  CheckCircle,
  Tag,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Law {
  _id: string;
  title: string;
  act: string;
  sections: string[];
  keywords: string[];
  summary: string;
  fullText: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SettingsConfig {
  fuzzySearch: boolean;
  keywordHighlighting: boolean;
  searchSuggestions: boolean;
  adminApproval: boolean;
  auditLog: boolean;
}

interface AnalyticsData {
  totalLaws: number;
  totalKeywords: number;
  totalActs: number;
  averageKeywordsPerLaw: number;
  mostCommonKeywords: { keyword: string; count: number }[];
  actDistribution: { act: string; count: number }[];
  recentLaws: { id: string; title: string; createdAt: string }[];
  lawsWithMostSections: { id: string; title: string; sectionCount: number }[];
}

const AdminLawFinder = () => {
  const [laws, setLaws] = useState<Law[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Law[]>([]);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLaw, setEditLaw] = useState<Law | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLaw, setNewLaw] = useState<Partial<Law>>({
    title: '',
    act: '',
    sections: [],
    keywords: [],
    summary: '',
    fullText: ''
  });
  const [newSection, setNewSection] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'laws' | 'analytics' | 'settings'>('laws');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLaws: 0,
    totalKeywords: 0,
    totalActs: 0,
    averageKeywordsPerLaw: 0,
    mostCommonKeywords: [],
    actDistribution: [],
    recentLaws: [],
    lawsWithMostSections: []
  });

  // Settings state
  const [settings, setSettings] = useState<SettingsConfig>({
    fuzzySearch: true,
    keywordHighlighting: true,
    searchSuggestions: true,
    adminApproval: false,
    auditLog: true
  });

  const [originalSettings, setOriginalSettings] = useState<SettingsConfig>({
    fuzzySearch: true,
    keywordHighlighting: true,
    searchSuggestions: true,
    adminApproval: false,
    auditLog: true
  });

  const [lastBackupDate, setLastBackupDate] = useState('2023-05-14 14:30');
  const [showBackupStatus, setShowBackupStatus] = useState(false);
  const [showRestoreStatus, setShowRestoreStatus] = useState(false);
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);

  // Calculate analytics from laws data
  const calculateAnalytics = (lawsData: Law[]): AnalyticsData => {
    if (!lawsData.length) {
      return {
        totalLaws: 0,
        totalKeywords: 0,
        totalActs: 0,
        averageKeywordsPerLaw: 0,
        mostCommonKeywords: [],
        actDistribution: [],
        recentLaws: [],
        lawsWithMostSections: []
      };
    }

    // Total laws
    const totalLaws = lawsData.length;

    // All unique keywords
    const allKeywords = lawsData.flatMap(law => law.keywords);
    const uniqueKeywords = [...new Set(allKeywords)];
    const totalKeywords = uniqueKeywords.length;

    // All unique acts
    const allActs = lawsData.map(law => law.act);
    const uniqueActs = [...new Set(allActs)];
    const totalActs = uniqueActs.length;

    // Average keywords per law
    const averageKeywordsPerLaw = Math.round(
      (lawsData.reduce((sum, law) => sum + law.keywords.length, 0) / totalLaws) * 10
    ) / 10;

    // Most common keywords
    const keywordCount: { [key: string]: number } = {};
    allKeywords.forEach(keyword => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });
    const mostCommonKeywords = Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    // Act distribution
    const actCount: { [key: string]: number } = {};
    allActs.forEach(act => {
      actCount[act] = (actCount[act] || 0) + 1;
    });
    const actDistribution = Object.entries(actCount)
      .sort(([, a], [, b]) => b - a)
      .map(([act, count]) => ({ act, count }));

    // Recent laws (sort by createdAt or updatedAt, fallback to _id)
    const recentLaws = [...lawsData]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || '1970-01-01').getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || '1970-01-01').getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(law => ({
        id: law._id,
        title: law.title,
        createdAt: law.createdAt || law.updatedAt || 'Unknown'
      }));

    // Laws with most sections
    const lawsWithMostSections = [...lawsData]
      .sort((a, b) => b.sections.length - a.sections.length)
      .slice(0, 5)
      .map(law => ({
        id: law._id,
        title: law.title,
        sectionCount: law.sections.length
      }));

    return {
      totalLaws,
      totalKeywords,
      totalActs,
      averageKeywordsPerLaw,
      mostCommonKeywords,
      actDistribution,
      recentLaws,
      lawsWithMostSections
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...'); // Debug log
        
        // Fetch laws
        const lawRes = await axios.get('http://localhost:5000/api/find');
        console.log('Laws fetched:', lawRes.data); // Debug log
        
        // Fetch settings
        const settingsRes = await axios.get('http://localhost:5000/api/find/set');
        console.log('Settings fetched:', settingsRes.data); // Debug log

        setLaws(lawRes.data);
        setSettings(settingsRes.data);
        setOriginalSettings(settingsRes.data);

        // Calculate analytics from the fetched laws
        const analyticsData = calculateAnalytics(lawRes.data);
        setAnalytics(analyticsData);
        
        console.log('Data fetching completed successfully'); // Debug log
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // More detailed error logging
        if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        } else {
          console.error('Setup error:', error.message);
        }
      }
    };

    fetchData();
  }, []);

  // Recalculate analytics when laws change
  useEffect(() => {
    const analyticsData = calculateAnalytics(laws);
    setAnalytics(analyticsData);
  }, [laws]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = laws.filter(law => 
      law.title.toLowerCase().includes(query) ||
      law.act.toLowerCase().includes(query) ||
      law.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      law.summary.toLowerCase().includes(query)
    );

    setSearchResults(results);
  }, [searchQuery, laws]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLaw(null);
  };

  const handleEdit = (law: Law) => {
    setIsEditing(true);
    setEditLaw({...law});
    setSelectedLaw(law);
  };

  const handleSaveEdit = async () => {
    if (!editLaw) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/find/${editLaw._id}`, editLaw);
      setLaws(laws.map(l => l._id === editLaw._id ? res.data : l));
      setSelectedLaw(res.data);
      setEditLaw(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating law:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditLaw(null);
  };

  const handleAddNewLaw = async () => {
    if (!newLaw.title || !newLaw.act || !newLaw.summary || !newLaw.fullText) return;

    const lawToAdd = {
      title: newLaw.title || '',
      act: newLaw.act || '',
      sections: newLaw.sections || [],
      keywords: newLaw.keywords || [],
      summary: newLaw.summary || '',
      fullText: newLaw.fullText || ''
    };

    try {
      const res = await axios.post('http://localhost:5000/api/find', lawToAdd);
      setLaws([...laws, res.data]);
      setIsAddingNew(false);
      setNewLaw({ title: '', act: '', sections: [], keywords: [], summary: '', fullText: '' });
    } catch (error) {
      console.error('Error adding law:', error);
    }
  };

  const handleDeleteLaw = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/find/${id}`);
      setLaws(laws.filter(l => l._id !== id));
      setSelectedLaw(null);
    } catch (error) {
      console.error('Error deleting law:', error);
    }
  };

  // Settings functions
  const handleSettingChange = (setting: keyof SettingsConfig, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    try {
      console.log('Saving settings:', settings); // Debug log
      await axios.put('http://localhost:5000/api/find/set', settings); // Ensure this is PUT
      setOriginalSettings(settings);
      setShowSettingsSaved(true);
      setTimeout(() => setShowSettingsSaved(false), 3000);
      console.log('Settings saved successfully'); // Debug log
    } catch (error) {
      console.error('Error saving settings:', error);
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      }
    }
  };

  const hasSettingsChanged = () => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const createBackup = () => {
    // Create backup data
    const backupData = {
      laws,
      settings,
      analytics,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Convert to JSON and create downloadable file
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `lawfinder-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update last backup date
    const now = new Date().toLocaleString();
    setLastBackupDate(now);
    setShowBackupStatus(true);
    setTimeout(() => setShowBackupStatus(false), 3000);
  };

  const restoreBackup = () => {
    // Create file input for backup restore
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target?.result as string);
          
          // Validate backup data structure
          if (backupData.laws && backupData.settings) {
            setLaws(backupData.laws);
            setSettings(backupData.settings);
            setOriginalSettings(backupData.settings);
            
            setShowRestoreStatus(true);
            setTimeout(() => setShowRestoreStatus(false), 3000);
          } else {
            alert('Invalid backup file format');
          }
        } catch (error) {
          alert('Error reading backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const addSection = () => {
    if (!newSection.trim() || !editLaw) return;
    setEditLaw({
      ...editLaw,
      sections: [...editLaw.sections, newSection.trim()]
    });
    setNewSection('');
  };

  const removeSection = (section: string) => {
    if (!editLaw) return;
    setEditLaw({
      ...editLaw,
      sections: editLaw.sections.filter(s => s !== section)
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim() || !editLaw) return;
    setEditLaw({
      ...editLaw,
      keywords: [...editLaw.keywords, newKeyword.trim()]
    });
    setNewKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    if (!editLaw) return;
    setEditLaw({
      ...editLaw,
      keywords: editLaw.keywords.filter(k => k !== keyword)
    });
  };

  const addNewSection = () => {
    if (!newSection.trim() || !newLaw) return;
    setNewLaw({
      ...newLaw,
      sections: [...(newLaw.sections || []), newSection.trim()]
    });
    setNewSection('');
  };

  const removeNewSection = (section: string) => {
    if (!newLaw) return;
    setNewLaw({
      ...newLaw,
      sections: (newLaw.sections || []).filter(s => s !== section)
    });
  };

  const addNewKeyword = () => {
    if (!newKeyword.trim() || !newLaw) return;
    setNewLaw({
      ...newLaw,
      keywords: [...(newLaw.keywords || []), newKeyword.trim()]
    });
    setNewKeyword('');
  };

  const removeNewKeyword = (keyword: string) => {
    if (!newLaw) return;
    setNewLaw({
      ...newLaw,
      keywords: (newLaw.keywords || []).filter(k => k !== keyword)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status notifications */}
      <AnimatePresence>
        {showSettingsSaved && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully!
          </motion.div>
        )}
        {showBackupStatus && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Backup created successfully!
          </motion.div>
        )}
        {showRestoreStatus && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Backup restored successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">LawFinder Admin</h1>
            <p className="text-gray-600">Manage all laws and content in the LawFinder database</p>
          </div>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add New Law
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
          {[
            { id: 'laws', label: 'Laws', icon: <FileText className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
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

        {/* Laws Tab */}
        {activeTab === 'laws' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Search and Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Bar */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search laws by title, act, keywords, or summary..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* All Laws Display (when no search) */}
              {!searchQuery && laws.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">All Laws ({laws.length})</h3>
                  
                  {laws.map((law) => (
                    <motion.div
                      key={law._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                        selectedLaw?._id === law._id ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{law.title}</h3>
                            <p className="text-sm text-blue-600 font-medium mb-2">{law.act}</p>
                            <p className="text-gray-600 text-sm mb-3">{law.summary}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(law)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLaw(law._id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {law.keywords.map((keyword, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setSelectedLaw(law)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Full Text
                          </button>
                          <div className="text-xs text-gray-500">
                            {law.sections.length} {law.sections.length === 1 ? 'section' : 'sections'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add New Law Form */}
              {isAddingNew && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-blue-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Add New Law</h3>
                    <button 
                      onClick={() => setIsAddingNew(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newLaw.title}
                        onChange={(e) => setNewLaw({...newLaw, title: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Act</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newLaw.act}
                        onChange={(e) => setNewLaw({...newLaw, act: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sections</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={newSection}
                          onChange={(e) => setNewSection(e.target.value)}
                          placeholder="Add section (e.g. Section 498A)"
                        />
                        <button
                          onClick={addNewSection}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newLaw.sections?.map((section, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                          >
                            {section}
                            <button 
                              onClick={() => removeNewSection(section)}
                              className="ml-1 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add keyword"
                        />
                        <button
                          onClick={addNewKeyword}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newLaw.keywords?.map((keyword, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                          >
                            {keyword}
                            <button 
                              onClick={() => removeNewKeyword(keyword)}
                              className="ml-1 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newLaw.summary}
                        onChange={(e) => setNewLaw({...newLaw, summary: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Text</label>
                      <textarea
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={newLaw.fullText}
                        onChange={(e) => setNewLaw({...newLaw, fullText: e.target.value})}
                        placeholder="Enter the complete text of the law..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleAddNewLaw}
                        disabled={!newLaw.title || !newLaw.act || !newLaw.summary || !newLaw.fullText}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        Save Law
                      </button>
                      <button
                        onClick={() => setIsAddingNew(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Search Results */}
              {searchQuery && (
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    <>
                      <h3 className="text-xl font-bold text-gray-800">
                        Search Results ({searchResults.length})
                      </h3>
                      
                      {searchResults.map((law) => (
                        <motion.div
                          key={law._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                            selectedLaw?._id === law._id ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{law.title}</h3>
                                <p className="text-sm text-blue-600 font-medium mb-2">{law.act}</p>
                                <p className="text-gray-600 text-sm mb-3">{law.summary}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(law)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLaw(law._id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {law.keywords.map((keyword, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => setSelectedLaw(law)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                              >
                                View Full Text
                              </button>
                              <div className="text-xs text-gray-500">
                                {law.sections.length} {law.sections.length === 1 ? 'section' : 'sections'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No laws found</h3>
                      <p className="text-gray-500">
                        No laws match your search query "{searchQuery}". Try different keywords.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Law Details */}
            <div className="lg:col-span-1">
              {selectedLaw && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm border sticky top-4"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{selectedLaw.title}</h3>
                        <p className="text-sm text-blue-600 font-medium">{selectedLaw.act}</p>
                      </div>
                      <button
                        onClick={() => setSelectedLaw(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Edit Form */}
                    {isEditing && editLaw ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={editLaw.title}
                            onChange={(e) => setEditLaw({...editLaw, title: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Act</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={editLaw.act}
                            onChange={(e) => setEditLaw({...editLaw, act: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sections</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={newSection}
                              onChange={(e) => setNewSection(e.target.value)}
                              placeholder="Add section"
                            />
                            <button
                              onClick={addSection}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-1">
                            {editLaw.sections.map((section, idx) => (
                              <div 
                                key={idx} 
                                className="flex justify-between items-center px-2 py-1 bg-gray-50 rounded"
                              >
                                <span className="text-sm">{section}</span>
                                <button 
                                  onClick={() => removeSection(section)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              placeholder="Add keyword"
                            />
                            <button
                              onClick={addKeyword}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {editLaw.keywords.map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                              >
                                {keyword}
                                <button 
                                  onClick={() => removeKeyword(keyword)}
                                  className="ml-1 text-gray-500 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={editLaw.summary}
                            onChange={(e) => setEditLaw({...editLaw, summary: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Text</label>
                          <textarea
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={editLaw.fullText}
                            onChange={(e) => setEditLaw({...editLaw, fullText: e.target.value})}
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-gray-700 text-sm">{selectedLaw.summary}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sections ({selectedLaw.sections.length})</h4>
                          <div className="space-y-1">
                            {selectedLaw.sections.map((section, idx) => (
                              <div key={idx} className="px-3 py-2 bg-gray-50 rounded text-sm">
                                {section}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Keywords ({selectedLaw.keywords.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedLaw.keywords.map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Full Text</h4>
                          <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 rounded text-sm">
                            <pre className="whitespace-pre-wrap font-sans">{selectedLaw.fullText}</pre>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => handleEdit(selectedLaw)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLaw(selectedLaw._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Laws</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalLaws}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Keywords</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalKeywords}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Tag className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Acts</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalActs}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Keywords/Law</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.averageKeywordsPerLaw}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Common Keywords */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Most Common Keywords</h3>
                <div className="space-y-3">
                  {analytics.mostCommonKeywords.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-700">{item.keyword}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / Math.max(...analytics.mostCommonKeywords.map(k => k.count))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Act Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Act Distribution</h3>
                <div className="space-y-3">
                  {analytics.actDistribution.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-700 truncate flex-1">{item.act}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / Math.max(...analytics.actDistribution.map(a => a.count))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Laws */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Laws</h3>
                <div className="space-y-3">
                  {analytics.recentLaws.map((law, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{law.title}</h4>
                        <p className="text-xs text-gray-500">{law.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laws with Most Sections */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Laws with Most Sections</h3>
                <div className="space-y-3">
                  {analytics.lawsWithMostSections.map((law, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{law.title}</h4>
                        <p className="text-xs text-gray-500">{law.sectionCount} sections</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            
              

            {/* Data Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Database Backup</h4>
                    <p className="text-sm text-gray-600">Last backup: {lastBackupDate}</p>
                  </div>
                  <button
                    onClick={createBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Download className="h-4 w-4" />
                    Create Backup
                  </button>
                </div>
                

                

                
              </div>
            </div>

            
          </div>
        )}
      </div>

      

      
    </div>
  );
}


export default AdminLawFinder;