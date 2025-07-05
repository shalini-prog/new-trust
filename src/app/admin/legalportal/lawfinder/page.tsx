'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface Law {
  id: string;
  title: string;
  act: string;
  sections: string[];
  keywords: string[];
  summary: string;
  fullText: string;
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
  const [stats, setStats] = useState({
    totalLaws: 0,
    totalSearches: 0,
    popularLaws: [] as {id: string, title: string, searches: number}[],
    recentEdits: [] as {lawId: string, title: string, editedAt: string}[]
  });

  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch from your API
    const initialLaws: Law[] = [
      {
        id: 'ipc-498a',
        title: 'Husband or relative of husband subjecting woman to cruelty',
        act: 'Indian Penal Code (IPC)',
        sections: ['Section 498A'],
        keywords: ['dowry', 'harassment', 'marital cruelty', 'domestic violence'],
        summary: 'This section deals with cruelty by husband or his relatives towards a married woman, including demands for dowry, mental or physical torture.',
        fullText: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine. Explanation.—For the purposes of this section, "cruelty" means— (a) any wilful conduct which is of such a nature as is likely to drive the woman to commit suicide or to cause grave injury or danger to life, limb or health (whether mental or physical) of the woman; or (b) harassment of the woman where such harassment is with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security or is on account of failure by her or any person related to her to meet such demand.'
      },
      {
        id: 'rte-act',
        title: 'Right of Children to Free and Compulsory Education',
        act: 'Right to Education Act (RTE)',
        sections: ['Section 3', 'Section 8', 'Section 12'],
        keywords: ['education', 'school', 'children', 'free education'],
        summary: 'The Act makes education a fundamental right of every child between the ages of 6 and 14 and specifies minimum norms in elementary schools.',
        fullText: 'Every child of the age of six to fourteen years shall have a right to free and compulsory education in a neighbourhood school till completion of elementary education. No child shall be liable to pay any kind of fee or charges or expenses which may prevent him or her from pursuing and completing elementary education. The appropriate Government and local authority shall establish, within such area or limits of neighbourhood, as may be prescribed, a school, where it is not so established, within a period of three years from the commencement of this Act.'
      }
    ];

    setLaws(initialLaws);
    setStats({
      totalLaws: initialLaws.length,
      totalSearches: 1245,
      popularLaws: [
        {id: 'ipc-498a', title: 'IPC Section 498A', searches: 342},
        {id: 'rte-act', title: 'Right to Education Act', searches: 278},
      ],
      recentEdits: [
        {lawId: 'ipc-498a', title: 'IPC Section 498A', editedAt: '2023-05-15'},
        {lawId: 'rte-act', title: 'Right to Education Act', editedAt: '2023-05-10'}
      ]
    });
  }, []);

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

  const handleSaveEdit = () => {
    if (!editLaw) return;

    setLaws(laws.map(law => law.id === editLaw.id ? editLaw : law));
    setIsEditing(false);
    setEditLaw(null);
    setSelectedLaw(editLaw);

    // Update stats
    setStats(prev => ({
      ...prev,
      recentEdits: [
        {lawId: editLaw.id, title: editLaw.title, editedAt: new Date().toISOString().split('T')[0]},
        ...prev.recentEdits.slice(0, 4)
      ]
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditLaw(null);
  };

  const handleAddNewLaw = () => {
    if (!newLaw.title || !newLaw.act || !newLaw.summary || !newLaw.fullText) return;

    const lawToAdd: Law = {
      id: `law-${Date.now()}`,
      title: newLaw.title || '',
      act: newLaw.act || '',
      sections: newLaw.sections || [],
      keywords: newLaw.keywords || [],
      summary: newLaw.summary || '',
      fullText: newLaw.fullText || ''
    };

    setLaws([...laws, lawToAdd]);
    setIsAddingNew(false);
    setNewLaw({
      title: '',
      act: '',
      sections: [],
      keywords: [],
      summary: '',
      fullText: ''
    });

    // Update stats
    setStats(prev => ({
      ...prev,
      totalLaws: prev.totalLaws + 1,
      recentEdits: [
        {lawId: lawToAdd.id, title: lawToAdd.title, editedAt: new Date().toISOString().split('T')[0]},
        ...prev.recentEdits.slice(0, 4)
      ]
    }));
  };

  const handleDeleteLaw = (id: string) => {
    setLaws(laws.filter(law => law.id !== id));
    if (selectedLaw?.id === id) {
      setSelectedLaw(null);
    }
    setStats(prev => ({
      ...prev,
      totalLaws: prev.totalLaws - 1
    }));
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
                    placeholder="Search laws..."
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
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        onClick={() => setIsAddingNew(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddNewLaw}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Law
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Search Results */}
              {searchQuery && searchResults.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No laws found</h3>
                  <p className="text-gray-500">
                    Try different keywords or add a new law
                  </p>
                </div>
              ) : null}

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                  </h3>
                  
                  <AnimatePresence>
                    {searchResults.map((law) => (
                      <motion.div
                        key={law.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                          selectedLaw?.id === law.id ? 'border-blue-500' : 'border-gray-200'
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
                                onClick={() => handleDeleteLaw(law.id)}
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
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            {/* Right Column - Law Details or Edit Form */}
            <div className="lg:col-span-1">
              {isEditing && editLaw ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 sticky top-4">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Edit Law</h3>
                      <button
                        onClick={handleCancelEdit}
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
                            placeholder="Add section (e.g. Section 498A)"
                          />
                          <button
                            onClick={addSection}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editLaw.sections.map((section, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                            >
                              {section}
                              <button 
                                onClick={() => removeSection(section)}
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
                            onClick={addKeyword}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
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

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedLaw ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 sticky top-4">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{selectedLaw.title}</h3>
                      <button
                        onClick={() => setSelectedLaw(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {selectedLaw.act}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Sections:</h4>
                      <ul className="space-y-2">
                        {selectedLaw.sections.map((section, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • {section}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLaw.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                      <p>{selectedLaw.summary}</p>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Full Text:</h4>
                      <p className="whitespace-pre-line">{selectedLaw.fullText}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleEdit(selectedLaw)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Law
                      </button>
                      <button 
                        onClick={() => handleDeleteLaw(selectedLaw.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 sticky top-4">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Scale className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{stats.totalLaws} Laws</div>
                          <div className="text-sm text-gray-600">In database</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Search className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{stats.totalSearches} Searches</div>
                          <div className="text-sm text-gray-600">Last 30 days</div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Popular Laws</h3>
                    <ul className="space-y-3">
                      {stats.popularLaws.map((law, index) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              const foundLaw = laws.find(l => l.id === law.id);
                              if (foundLaw) setSelectedLaw(foundLaw);
                            }}
                            className="text-left text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {law.title}
                          </button>
                          <p className="text-xs text-gray-500">{law.searches} searches</p>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Recent Edits</h3>
                    <ul className="space-y-3">
                      {stats.recentEdits.map((edit, index) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              const foundLaw = laws.find(l => l.id === edit.lawId);
                              if (foundLaw) setSelectedLaw(foundLaw);
                            }}
                            className="text-left text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {edit.title}
                          </button>
                          <p className="text-xs text-gray-500">{edit.editedAt}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalLaws}</div>
                <div className="text-gray-600">Laws in Database</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Last 30 days</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalSearches.toLocaleString()}</div>
                <div className="text-gray-600">Search Queries</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">1,245</div>
                <div className="text-gray-600">Monthly Users</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Search Analytics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Most Searched Laws</h4>
                    <div className="space-y-3">
                      {stats.popularLaws.map((law, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-40 text-sm text-gray-600 truncate">{law.title}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(law.searches / stats.totalSearches) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">{law.searches}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Search Trends</h4>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Search trends chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { action: 'New law added', user: 'Admin', time: '2 minutes ago', type: 'add' },
                    { action: 'Law updated', user: 'Admin', time: '15 minutes ago', type: 'edit' },
                    { action: 'Popular search', query: 'property rights', time: '30 minutes ago', type: 'search' },
                    { action: 'Law deleted', user: 'Admin', time: '1 hour ago', type: 'delete' },
                    { action: 'System backup', user: 'Automated', time: '2 hours ago', type: 'system' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'add' ? 'bg-green-100' :
                          activity.type === 'edit' ? 'bg-blue-100' :
                          activity.type === 'delete' ? 'bg-red-100' :
                          activity.type === 'search' ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          {activity.type === 'add' && <Plus className="w-4 h-4 text-green-600" />}
                          {activity.type === 'edit' && <Edit className="w-4 h-4 text-blue-600" />}
                          {activity.type === 'delete' && <Trash2 className="w-4 h-4 text-red-600" />}
                          {activity.type === 'search' && <Search className="w-4 h-4 text-purple-600" />}
                          {activity.type === 'system' && <Settings className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.action}</div>
                          {activity.query ? (
                            <div className="text-sm text-gray-600">"{activity.query}"</div>
                          ) : (
                            <div className="text-sm text-gray-600">by {activity.user}</div>
                          )}
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

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Search Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Fuzzy Search</div>
                        <p className="text-sm text-gray-600">Allow approximate matches in search results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Keyword Highlighting</div>
                        <p className="text-sm text-gray-600">Highlight matching keywords in search results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Search Suggestions</div>
                        <p className="text-sm text-gray-600">Show suggestions as user types</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Security Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Admin Approval for Edits</div>
                        <p className="text-sm text-gray-600">Require approval for law modifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Audit Log</div>
                        <p className="text-sm text-gray-600">Record all changes to laws</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Backup & Restore</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-5 h-5" />
                      Create Backup
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Save className="w-5 h-5" />
                      Restore Backup
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Last backup: 2023-05-14 14:30</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminLawFinder;