'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaNewspaper, 
  FaQuestionCircle, 
  FaCalendarAlt,
  FaSave,
  FaTimes,
  FaEye,
  FaSearch
} from 'react-icons/fa';

// Mock initial data
const mockCurrentAffairsData = {
  news: [
    {
      id: '1',
      title: 'Economic Survey 2024 Highlights',
      category: 'Economy',
      date: '2024-06-27',
      summary: 'Key highlights from the Economic Survey 2024 including GDP growth projections and policy recommendations.',
      imageUrl: '/api/placeholder/400/300',
      source: 'Ministry of Finance'
    },
    {
      id: '2',
      title: 'New Education Policy Implementation',
      category: 'Education',
      date: '2024-06-26',
      summary: 'Latest updates on the implementation of National Education Policy 2020 across different states.',
      imageUrl: '/api/placeholder/400/300',
      source: 'Ministry of Education'
    }
  ],
  quizzes: [
    {
      id: '1',
      title: 'Current Affairs - June 2024',
      questions: 25,
      duration: 30,
      difficulty: 'Medium',
      participants: 1250
    },
    {
      id: '2',
      title: 'Economy & Budget Quiz',
      questions: 20,
      duration: 25,
      difficulty: 'Hard',
      participants: 850
    }
  ],
  upcomingExams: [
    {
      name: 'UPSC Prelims 2024',
      date: '2024-08-15',
      daysLeft: 49
    },
    {
      name: 'SSC CGL 2024',
      date: '2024-09-20',
      daysLeft: 85
    }
  ]
};

export default function CurrentAffairsAdmin() {
  const [activeTab, setActiveTab] = useState('news');
  const [data, setData] = useState(mockCurrentAffairsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: '',
    date: '',
    summary: '',
    imageUrl: '',
    source: ''
  });

  const [quizForm, setQuizForm] = useState({
    title: '',
    questions: '',
    duration: '',
    difficulty: 'Easy',
    participants: ''
  });

  const [examForm, setExamForm] = useState({
    name: '',
    date: '',
    daysLeft: ''
  });

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    
    if (item) {
      if (activeTab === 'news') {
        setNewsForm(item);
      } else if (activeTab === 'quiz') {
        setQuizForm(item);
      } else if (activeTab === 'exams') {
        setExamForm(item);
      }
    } else {
      // Reset forms
      setNewsForm({ title: '', category: '', date: '', summary: '', imageUrl: '', source: '' });
      setQuizForm({ title: '', questions: '', duration: '', difficulty: 'Easy', participants: '' });
      setExamForm({ name: '', date: '', daysLeft: '' });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType('');
  };

  const handleSave = () => {
    const newData = { ...data };
    
    if (activeTab === 'news') {
      if (modalType === 'add') {
        const newId = (Math.max(...data.news.map(n => parseInt(n.id))) + 1).toString();
        newData.news.push({ ...newsForm, id: newId });
      } else {
        const index = newData.news.findIndex(n => n.id === editingItem.id);
        newData.news[index] = { ...newsForm, id: editingItem.id };
      }
    } else if (activeTab === 'quiz') {
      if (modalType === 'add') {
        const newId = (Math.max(...data.quizzes.map(q => parseInt(q.id))) + 1).toString();
        newData.quizzes.push({ ...quizForm, id: newId });
      } else {
        const index = newData.quizzes.findIndex(q => q.id === editingItem.id);
        newData.quizzes[index] = { ...quizForm, id: editingItem.id };
      }
    } else if (activeTab === 'exams') {
      if (modalType === 'add') {
        newData.upcomingExams.push(examForm);
      } else {
        const index = newData.upcomingExams.findIndex(e => e.name === editingItem.name);
        newData.upcomingExams[index] = examForm;
      }
    }
    
    setData(newData);
    closeModal();
  };

  const handleDelete = (id) => {
    const newData = { ...data };
    
    if (activeTab === 'news') {
      newData.news = newData.news.filter(n => n.id !== id);
    } else if (activeTab === 'quiz') {
      newData.quizzes = newData.quizzes.filter(q => q.id !== id);
    } else if (activeTab === 'exams') {
      newData.upcomingExams = newData.upcomingExams.filter(e => e.name !== id);
    }
    
    setData(newData);
  };

  const filteredData = () => {
    if (activeTab === 'news') {
      return data.news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'quiz') {
      return data.quizzes.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'exams') {
      return data.upcomingExams.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {modalType === 'add' ? 'Add' : 'Edit'} {activeTab === 'news' ? 'News Article' : activeTab === 'quiz' ? 'Quiz' : 'Exam'}
            </h3>
            <button onClick={closeModal}>
              <FaTimes className="text-slate-500 hover:text-slate-700" />
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'news' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Economy">Economy</option>
                    <option value="Politics">Politics</option>
                    <option value="Education">Education</option>
                    <option value="Science">Science</option>
                    <option value="Environment">Environment</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Summary</label>
                  <textarea
                    value={newsForm.summary}
                    onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newsForm.imageUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source</label>
                  <input
                    type="text"
                    value={newsForm.source}
                    onChange={(e) => setNewsForm({ ...newsForm, source: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </>
            )}

            {activeTab === 'quiz' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Questions</label>
                  <input
                    type="number"
                    value={quizForm.questions}
                    onChange={(e) => setQuizForm({ ...quizForm, questions: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.duration}
                    onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Participants</label>
                  <input
                    type="number"
                    value={quizForm.participants}
                    onChange={(e) => setQuizForm({ ...quizForm, participants: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </>
            )}

            {activeTab === 'exams' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Name</label>
                  <input
                    type="text"
                    value={examForm.name}
                    onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Days Left</label>
                  <input
                    type="number"
                    value={examForm.daysLeft}
                    onChange={(e) => setExamForm({ ...examForm, daysLeft: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Current Affairs Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage news articles, quizzes, and upcoming exams
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${
                activeTab === 'news'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FaNewspaper /> News Articles ({data.news.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FaQuestionCircle /> Quizzes ({data.quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${
                activeTab === 'exams'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FaCalendarAlt /> Upcoming Exams ({data.upcomingExams.length})
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={() => openModal('add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add {activeTab === 'news' ? 'News' : activeTab === 'quiz' ? 'Quiz' : 'Exam'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          {activeTab === 'news' && (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredData().map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                            {item.category}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-2">{item.summary}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Source: {item.source}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredData().map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Questions:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.questions}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.duration} mins</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Difficulty:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              item.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {item.difficulty}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Participants:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.participants}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredData().map((item, index) => (
                  <div key={`exam-${item.name}-${index}`} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{item.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Exam Date:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.date}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Days Left:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.daysLeft}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.name)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaNewspaper className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.news.length}</h3>
                <p className="text-slate-600 dark:text-slate-300">News Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaQuestionCircle className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.quizzes.length}</h3>
                <p className="text-slate-600 dark:text-slate-300">Active Quizzes</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{data.upcomingExams.length}</h3>
                <p className="text-slate-600 dark:text-slate-300">Upcoming Exams</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
}