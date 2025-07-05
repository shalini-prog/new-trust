'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  Search,
  Filter,
  BookOpen,
  Award,
  Clock,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types
interface Exam {
  id: number;
  title: string;
  description: string;
  icon: string;
  eligibility: string;
  pattern: string;
  opportunities: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExamFormData {
  title: string;
  description: string;
  icon: string;
  eligibility: string;
  pattern: string;
  opportunities: string;
  isActive: boolean;
}

const iconOptions = [
  { value: 'award', label: 'Award', component: Award },
  { value: 'clock', label: 'Clock', component: Clock },
  { value: 'users', label: 'Users', component: Users },
  { value: 'briefcase', label: 'Briefcase', component: Briefcase },
  { value: 'book', label: 'Book', component: BookOpen }
];

export default function ExamOverviewAdmin() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedCards, setExpandedCards] = useState<{[key: number]: boolean}>({});
  
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    icon: 'award',
    eligibility: '',
    pattern: '',
    opportunities: '',
    isActive: true
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setExams([
        {
          id: 1,
          title: 'UPSC Civil Services',
          description: 'The most prestigious examination for administrative services in India',
          icon: 'award',
          eligibility: 'Bachelor degree, Age: 21-32 years',
          pattern: 'Prelims (Objective) + Mains (Descriptive) + Interview',
          opportunities: 'IAS, IPS, IFS and other Group A services',
          isActive: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-06-20'
        },
        {
          id: 2,
          title: 'SSC CGL',
          description: 'Staff Selection Commission Combined Graduate Level Examination',
          icon: 'users',
          eligibility: 'Bachelor degree, Age: 18-27 years',
          pattern: 'Tier 1 (Objective) + Tier 2 (Objective) + Tier 3 (Descriptive)',
          opportunities: 'Assistant Section Officer, Inspector, Sub Inspector',
          isActive: true,
          createdAt: '2024-01-20',
          updatedAt: '2024-06-18'
        },
        {
          id: 3,
          title: 'IBPS PO',
          description: 'Institute of Banking Personnel Selection Probationary Officer',
          icon: 'briefcase',
          eligibility: 'Bachelor degree, Age: 20-30 years',
          pattern: 'Prelims + Mains + Interview',
          opportunities: 'Probationary Officer in Public Sector Banks',
          isActive: false,
          createdAt: '2024-02-10',
          updatedAt: '2024-05-15'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      // Update existing exam
      setExams(exams.map(exam => 
        exam.id === editingExam.id 
          ? { ...exam, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : exam
      ));
    } else {
      // Add new exam
      const newExam: Exam = {
        id: Math.max(...exams.map(e => e.id), 0) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setExams([...exams, newExam]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      icon: exam.icon,
      eligibility: exam.eligibility,
      pattern: exam.pattern,
      opportunities: exam.opportunities,
      isActive: exam.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'award',
      eligibility: '',
      pattern: '',
      opportunities: '',
      isActive: true
    });
    setEditingExam(null);
  };

  const getIcon = (iconName: string, className: string = "w-6 h-6") => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.component;
      return <IconComponent className={className} />;
    }
    return <Award className={className} />;
  };

  const toggleCardExpanded = (id: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && exam.isActive) ||
                         (filterStatus === 'inactive' && !exam.isActive);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Overview Management</h1>
          <p className="text-gray-600 mt-2">Manage competitive exam categories and details</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Exam
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.isActive).length}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => !e.isActive).length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getIcon(exam.icon, "w-8 h-8 text-blue-500")}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCardExpanded(exam.id)}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    {expandedCards[exam.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(exam)}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
              
              {expandedCards[exam.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-4 border-t border-gray-200"
                >
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm">Eligibility:</h4>
                    <p className="text-gray-700 text-sm">{exam.eligibility}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm">Pattern:</h4>
                    <p className="text-gray-700 text-sm">{exam.pattern}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm">Opportunities:</h4>
                    <p className="text-gray-700 text-sm">{exam.opportunities}</p>
                  </div>
                </motion.div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                <span>Created: {exam.createdAt}</span>
                <span>Updated: {exam.updatedAt}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingExam ? 'Edit Exam' : 'Add New Exam'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                <textarea
                  required
                  rows={2}
                  value={formData.eligibility}
                  onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Pattern</label>
                <textarea
                  required
                  rows={2}
                  value={formData.pattern}
                  onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Opportunities</label>
                <textarea
                  required
                  rows={2}
                  value={formData.opportunities}
                  onChange={(e) => setFormData({...formData, opportunities: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible on website)
                </label>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingExam ? 'Update' : 'Save'} Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}