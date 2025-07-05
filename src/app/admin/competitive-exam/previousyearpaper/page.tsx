'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaSearch, 
  FaDownload, 
  FaFileAlt, 
  FaEye,
  FaFilter,
  FaSave,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

interface PaperItem {
  id: string;
  exam: string;
  year: number;
  subject: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  downloadCount: number;
  uploadDate: string;
  fileSize: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface FormData {
  exam: string;
  year: number;
  subject: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Active' | 'Inactive' | 'Pending';
}

export default function PreviousYearPapersAdmin() {
  const [papers, setPapers] = useState<PaperItem[]>([
    {
      id: '1',
      exam: 'JEE Main',
      year: 2024,
      subject: 'Physics',
      questions: 90,
      difficulty: 'Hard',
      downloadCount: 1250,
      uploadDate: '2024-03-15',
      fileSize: '2.4 MB',
      status: 'Active'
    },
    {
      id: '2',
      exam: 'NEET',
      year: 2024,
      subject: 'Biology',
      questions: 90,
      difficulty: 'Medium',
      downloadCount: 980,
      uploadDate: '2024-03-10',
      fileSize: '1.8 MB',
      status: 'Active'
    },
    {
      id: '3',
      exam: 'UPSC',
      year: 2023,
      subject: 'General Studies',
      questions: 100,
      difficulty: 'Hard',
      downloadCount: 750,
      uploadDate: '2024-02-20',
      fileSize: '3.2 MB',
      status: 'Inactive'
    }
  ]);

  const [filteredPapers, setFilteredPapers] = useState<PaperItem[]>(papers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    exam: '',
    year: new Date().getFullYear(),
    subject: '',
    questions: 0,
    difficulty: 'Medium',
    status: 'Active'
  });

  const exams = ['JEE Main', 'NEET', 'UPSC', 'GATE', 'CAT', 'CLAT'];
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General Studies', 'English'];

  // Filter papers based on search and filters
  useEffect(() => {
    let filtered = papers.filter(paper => {
      const matchesSearch = paper.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExam = filterExam === 'all' || paper.exam === filterExam;
      const matchesStatus = filterStatus === 'all' || paper.status === filterStatus;
      
      return matchesSearch && matchesExam && matchesStatus;
    });
    
    setFilteredPapers(filtered);
  }, [papers, searchTerm, filterExam, filterStatus]);

  const handleAddPaper = () => {
    const newPaper: PaperItem = {
      id: Date.now().toString(),
      ...formData,
      downloadCount: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '0 MB'
    };
    
    setPapers([...papers, newPaper]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditPaper = () => {
    if (selectedPaper) {
      setPapers(papers.map(paper => 
        paper.id === selectedPaper.id 
          ? { ...paper, ...formData }
          : paper
      ));
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleDeletePaper = () => {
    if (selectedPaper) {
      setPapers(papers.filter(paper => paper.id !== selectedPaper.id));
      setShowDeleteModal(false);
      setSelectedPaper(null);
    }
  };

  const resetForm = () => {
    setFormData({
      exam: '',
      year: new Date().getFullYear(),
      subject: '',
      questions: 0,
      difficulty: 'Medium',
      status: 'Active'
    });
    setSelectedPaper(null);
  };

  const openEditModal = (paper: PaperItem) => {
    setSelectedPaper(paper);
    setFormData({
      exam: paper.exam,
      year: paper.year,
      subject: paper.subject,
      questions: paper.questions,
      difficulty: paper.difficulty,
      status: paper.status
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (paper: PaperItem) => {
    setSelectedPaper(paper);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Previous Year Papers Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage exam papers, upload new content, and track downloads
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus /> Add New Paper
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Papers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{papers.length}</p>
              </div>
              <FaFileAlt className="text-blue-600 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Active Papers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {papers.filter(p => p.status === 'Active').length}
                </p>
              </div>
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {papers.reduce((sum, paper) => sum + paper.downloadCount, 0)}
                </p>
              </div>
              <FaDownload className="text-purple-600 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {papers.filter(p => p.status === 'Pending').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        {/* Papers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paper Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPapers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {paper.exam}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {paper.subject}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-400">
                          {paper.fileSize} • {paper.uploadDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {paper.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {paper.questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(paper.difficulty)}`}>
                        {paper.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {paper.downloadCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(paper.status)}`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(paper)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <FaEdit />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openDeleteModal(paper)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Paper</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam
                  </label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({...formData, exam: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Exam</option>
                    {exams.map(exam => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    value={formData.questions}
                    onChange={(e) => setFormData({...formData, questions: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddPaper}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> Add Paper
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Paper</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam
                  </label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({...formData, exam: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {exams.map(exam => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    value={formData.questions}
                    onChange={(e) => setFormData({...formData, questions: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditPaper}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Paper</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete the paper "{selectedPaper.exam} - {selectedPaper.subject} ({selectedPaper.year})"? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePaper}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaTrashAlt /> Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Actions</h3>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Select Action</option>
                <option>Activate Selected</option>
                <option>Deactivate Selected</option>
                <option>Delete Selected</option>
                <option>Export Selected</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Apply
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredPapers.length} of {papers.length} papers
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  New paper uploaded: NEET Biology 2024
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  JEE Main Physics 2024 downloaded 50 times
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  UPSC General Studies 2023 marked for review
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  CAT Quantitative Aptitude 2023 deleted
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>