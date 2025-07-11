'use client';
import { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaSearch, 
  FaUpload, 
  FaFileAlt, 
  FaEye,
  FaFilter,
  FaSave,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaDownload
} from 'react-icons/fa';

interface PaperItem {
  _id: string; // MongoDB _id
  exam: string;
  year: number;
  subject: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uploadDate: string;
  fileSize: string;
  fileName?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  fileUrl?: string;
}

interface FormData {
  exam: string;
  year: number;
  subject: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Active' | 'Inactive' | 'Pending';
  file?: File;
  fileSize?: string;
  fileUrl?: string;
}

export default function PreviousYearPapersAdmin() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<PaperItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperItem | null>(null);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Load papers on component mount
  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/epre');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Ensure data is an array and has the expected structure
      const papersData = Array.isArray(data) ? data : [];
      
      // Validate and sanitize the data - ensure _id is used consistently
      const sanitizedPapers = papersData.map((paper: any) => ({
        _id: paper._id || paper.id || Math.random().toString(36).substr(2, 9),
        exam: paper.exam || 'Unknown',
        year: paper.year || new Date().getFullYear(),
        subject: paper.subject || 'Unknown',
        questions: paper.questions || 0,
        difficulty: paper.difficulty || 'Medium',
        uploadDate: paper.uploadDate || new Date().toISOString().split('T')[0],
        fileSize: paper.fileSize || '0 MB',
        fileName: paper.fileName || 'unknown_file.pdf',
        status: paper.status || 'Pending',
        fileUrl: paper.fileUrl || ''
      }));
      
      console.log('Sanitized Papers:', sanitizedPapers); // Debug log
      setPapers(sanitizedPapers);
    } catch (err) {
      console.error('Failed to load papers:', err);
      setError('Failed to load papers. Please try again.');
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter papers based on search and filters
  useEffect(() => {
    if (!papers || papers.length === 0) {
      setFilteredPapers([]);
      return;
    }

    let filtered = papers.filter(paper => {
      const matchesSearch = paper.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExam = filterExam === 'all' || paper.exam === filterExam;
      const matchesStatus = filterStatus === 'all' || paper.status === filterStatus;
      
      return matchesSearch && matchesExam && matchesStatus;
    });
    
    setFilteredPapers(filtered);
  }, [papers, searchTerm, filterExam, filterStatus]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/epre/upload-image', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();

      // Save file info to formData state
      setFormData({
        ...formData,
        file: file,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileUrl: data.url,
      });

      console.log('Uploaded file URL:', data.url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file');
    }
  };

  const getFileSize = (file: File): string => {
    const sizeInMB = file.size / (1024 * 1024);
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const handleAddPaper = async () => {
    if (!formData.fileUrl) {
      alert('Please upload a file first');
      return;
    }

    const payload = {
      exam: formData.exam,
      year: formData.year,
      subject: formData.subject,
      questions: formData.questions,
      difficulty: formData.difficulty,
      status: formData.status,
      fileSize: formData.fileSize,
      fileName: formData.file?.name,
      fileUrl: formData.fileUrl,
    };

    try {
      const res = await fetch('http://localhost:5000/api/epre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to add paper');
      }

      const savedPaper = await res.json(); // Will include _id from MongoDB
      console.log('Added paper:', savedPaper); // Debug log
      
      // Reload papers to get fresh data
      await loadPapers();
      
      setShowAddModal(false);
      resetForm();
      alert('Paper added successfully!');
    } catch (err) {
      console.error('Error adding paper:', err);
      alert('Failed to add paper');
    }
  };

  const handleEditPaper = async () => {
    if (!selectedPaper?._id) {
      alert('No paper selected for editing');
      return;
    }

    const body = {
      exam: formData.exam,
      year: formData.year,
      subject: formData.subject,
      questions: formData.questions,
      difficulty: formData.difficulty,
      status: formData.status,
      ...(formData.fileUrl && { fileUrl: formData.fileUrl }),
      ...(formData.fileSize && { fileSize: formData.fileSize }),
      ...(formData.file && { fileName: formData.file.name })
    };

    try {
      console.log('Updating paper with ID:', selectedPaper._id); // Debug log
      const res = await fetch(`http://localhost:5000/api/epre/${selectedPaper._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update paper: ${res.status}`);
      }

      const updated = await res.json();
      console.log('Updated paper:', updated); // Debug log
      
      // Update the papers array with the updated paper
      setPapers(papers.map(p => p._id === selectedPaper._id ? { ...p, ...updated } : p));
      
      setShowEditModal(false);
      resetForm();
      alert('Paper updated successfully!');
    } catch (err) {
      console.error('Failed to update paper:', err);
      alert('Failed to update paper');
    }
  };

  const handleDeletePaper = async () => {
    if (!selectedPaper?._id) {
      alert('No paper selected for deletion');
      return;
    }

    try {
      console.log('Deleting paper with ID:', selectedPaper._id); // Debug log
      const res = await fetch(`http://localhost:5000/api/epre/${selectedPaper._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete error response:', errorText);
        throw new Error(`Failed to delete paper: ${res.status}`);
      }

      // Remove the paper from the papers array
      setPapers(papers.filter(p => p._id !== selectedPaper._id));
      
      setShowDeleteModal(false);
      setSelectedPaper(null);
      alert('Paper deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete paper');
    }
  };

  const handleBulkAction = async () => {
    if (selectedPapers.length === 0) {
      alert('Please select papers to perform bulk action');
      return;
    }

    if (!bulkAction) {
      alert('Please select a bulk action');
      return;
    }

    try {
      console.log('Bulk action:', bulkAction, 'for papers:', selectedPapers); // Debug log
      const res = await fetch('http://localhost:5000/api/epre/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedPapers,
          action: bulkAction === 'delete' ? 'delete' : (bulkAction === 'activate' ? 'Active' : 'Inactive'),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Bulk action error:', errorText);
        throw new Error(`Bulk action failed: ${res.status}`);
      }

      const result = await res.json();
      console.log('Bulk action result:', result);

      // Refresh data after bulk action
      await loadPapers();
      setSelectedPapers([]);
      setBulkAction('');
      alert('Bulk action completed successfully!');
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Bulk action failed');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPapers(filteredPapers.map(paper => paper._id));
    } else {
      setSelectedPapers([]);
    }
  };

  const handleSelectPaper = (paperId: string, checked: boolean) => {
    if (checked) {
      setSelectedPapers([...selectedPapers, paperId]);
    } else {
      setSelectedPapers(selectedPapers.filter(id => id !== paperId));
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

  const openViewModal = (paper: PaperItem) => {
    setSelectedPaper(paper);
    setShowViewModal(true);
  };

  const handleDownload = (paper: PaperItem) => {
  if (paper.fileUrl) {
    const link = document.createElement('a');
    link.href = paper.fileUrl;

    // Suggest file name with correct extension
    link.download = paper.fileName || 'downloaded-paper.pdf';

    // Force download without opening
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Download link not available');
  }
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

  // Calculate total file size safely
  const calculateTotalFileSize = () => {
    if (!papers || papers.length === 0) return '0';
    
    return papers.reduce((total, paper) => {
      const sizeStr = paper.fileSize || '0 MB';
      const size = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));
      return total + (isNaN(size) ? 0 : size);
    }, 0).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading papers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadPapers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                Manage exam papers, upload new content, and track uploads
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
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total File Size</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculateTotalFileSize()} MB
                </p>
              </div>
              <FaUpload className="text-purple-600 text-2xl" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Bulk Actions</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
            
            <button 
              onClick={handleBulkAction}
              disabled={selectedPapers.length === 0 || !bulkAction}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaFilter /> Apply
            </button>
          </div>
        </div>

        {/* Papers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPapers.length === filteredPapers.length && filteredPapers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
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
                    File Info
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
                  <tr key={paper._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPapers.includes(paper._id)}
                        onChange={(e) => handleSelectPaper(paper._id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {paper.exam}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {paper.subject}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-400">
                          Uploaded: {paper.uploadDate}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {paper.fileSize}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {paper.fileName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(paper.status)}`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(paper)}
                          className="text-green-600 hover:text-green-900 p-1 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(paper)}
                          className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDownload(paper)}
                          className="text-purple-600 hover:text-purple-900 p-1 transition-colors"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => openDeleteModal(paper)}
                          className="text-red-600 hover:text-red-900 p-1 transition-colors"
                          title="Delete"
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
          
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto text-gray-400 text-6xl mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {papers.length === 0 ? 'No papers found' : 'No papers match your filters'}
              </p>
            </div>
          )}
        </div>

        {/* View Modal */}
        {showViewModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Paper Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.exam}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.year}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Questions
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.questions}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(selectedPaper.difficulty)}`}>
                    {selectedPaper.difficulty}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPaper.status)}`}>
                    {selectedPaper.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Size
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.fileSize}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Date
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.uploadDate}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedPaper.fileName}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleDownload(selectedPaper)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaDownload /> Download
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Paper</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddPaper(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam *
                    </label>
                    <select
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Exam</option>
                      {exams.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1990"
                      max="2030"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Questions *
                    </label>
                    <input
                      type="number"
                      value={formData.questions}
                      onChange={(e) => setFormData({ ...formData, questions: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload File *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  {formData.fileUrl && (
                    <p className="text-sm text-green-600 mt-1">
                      File uploaded successfully: {formData.fileSize}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaSave /> Add Paper
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Paper</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleEditPaper(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam *
                    </label>
                    <select
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Exam</option>
                      {exams.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1990"
                      max="2030"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Questions *
                    </label>
                    <input
                      type="number"
                      value={formData.questions}
                      onChange={(e) => setFormData({ ...formData, questions: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload New File (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {formData.fileUrl && (
                    <p className="text-sm text-green-600 mt-1">
                      New file uploaded: {formData.fileSize}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaSave /> Update Paper
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Paper</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                  <FaExclamationTriangle className="text-red-600 text-2xl" />
                </div>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete this paper?
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Exam:</strong> {selectedPaper.exam}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Subject:</strong> {selectedPaper.subject}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Year:</strong> {selectedPaper.year}
                  </p>
                </div>
                <p className="text-center text-sm text-red-600 dark:text-red-400 mt-2">
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePaper}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}