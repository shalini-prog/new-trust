'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  FaSearch,
  FaUpload,
  FaImage
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
      image: null,
      source: 'Ministry of Finance'
    },
    {
      id: '2',
      title: 'New Education Policy Implementation',
      category: 'Education',
      date: '2024-06-26',
      summary: 'Latest updates on the implementation of National Education Policy 2020 across different states.',
      image: null,
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
  const fileInputRef = useRef(null);

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: '',
    date: '',
    summary: '',
    image: null,
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

  const BASE_URL = 'http://localhost:5000/api/ecurr';

  const fetchItems = async (type) => {
    try {
      const res = await axios.get(`${BASE_URL}?type=${type}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  const createItem = async (data) => {
    const res = await axios.post(BASE_URL, data);
    return res.data;
  };

  const updateItem = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
  };

  const deleteItem = async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    
    if (item) {
      if (activeTab === 'news') {
        setNewsForm({
          ...item,
          // Fix: Handle image property correctly
          image: item.image || item.imageUrl ? {
            url: item.image?.url || item.imageUrl,
            name: item.image?.name || 'Existing image'
          } : null
        });
      } else if (activeTab === 'quiz') {
        setQuizForm(item);
      } else if (activeTab === 'exams') {
        setExamForm(item);
      }
    } else {
      // Reset forms
      setNewsForm({ title: '', category: '', date: '', summary: '', image: null, source: '' });
      setQuizForm({ title: '', questions: '', duration: '', difficulty: 'Easy', participants: '' });
      setExamForm({ name: '', date: '', daysLeft: '' });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const news = await fetchItems('news');
        const quizzes = await fetchItems('quiz');
        const exams = await fetchItems('exam');
        setData({
          news,
          quizzes,
          upcomingExams: exams
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // Keep using mock data if API fails
      }
    };
    loadData();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/ecurr/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.url) {
        setNewsForm(prev => ({
          ...prev,
          image: {
            file,
            url: data.url,
            name: file.name
          }
        }));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Error uploading image');
    }
  };

  const removeImage = () => {
    setNewsForm(prev => ({
      ...prev,
      image: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      let savedItem;

      if (activeTab === 'news') {
        const payload = {
          ...newsForm,
          type: 'news',
          imageUrl: newsForm.image?.url || '',
        };

        if (modalType === 'add') {
          savedItem = await createItem(payload);
          setData(prev => ({ ...prev, news: [...prev.news, savedItem] }));
        } else {
          savedItem = await updateItem(editingItem._id, payload);
          setData(prev => ({
            ...prev,
            news: prev.news.map(n => n._id === savedItem._id ? savedItem : n)
          }));
        }

      } else if (activeTab === 'quiz') {
        const payload = {
          ...quizForm,
          type: 'quiz',
        };

        if (modalType === 'add') {
          savedItem = await createItem(payload);
          setData(prev => ({ ...prev, quizzes: [...prev.quizzes, savedItem] }));
        } else {
          savedItem = await updateItem(editingItem._id, payload);
          setData(prev => ({
            ...prev,
            quizzes: prev.quizzes.map(q => q._id === savedItem._id ? savedItem : q)
          }));
        }

      } else if (activeTab === 'exams') {
        const payload = {
          ...examForm,
          type: 'exam',
        };

        if (modalType === 'add') {
          savedItem = await createItem(payload);
          setData(prev => ({ ...prev, upcomingExams: [...prev.upcomingExams, savedItem] }));
        } else {
          savedItem = await updateItem(editingItem._id, payload);
          setData(prev => ({
            ...prev,
            upcomingExams: prev.upcomingExams.map(e => e._id === savedItem._id ? savedItem : e)
          }));
        }
      }

      closeModal();
    } catch (err) {
      alert('Error saving item');
      console.error(err);
    }
  };

  // Fix: Corrected handleDelete function
  const handleDelete = async (itemId) => {
    if (!itemId) {
      console.error('No item ID provided for deletion');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteItem(itemId);

      if (activeTab === 'news') {
        setData(prev => ({ ...prev, news: prev.news.filter(n => n._id !== itemId) }));
      } else if (activeTab === 'quiz') {
        setData(prev => ({ ...prev, quizzes: prev.quizzes.filter(q => q._id !== itemId) }));
      } else if (activeTab === 'exams') {
        setData(prev => ({ ...prev, upcomingExams: prev.upcomingExams.filter(e => e._id !== itemId) }));
      }

    } catch (err) {
      alert('Failed to delete item');
      console.error(err);
    }
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image</label>
                  <div className="space-y-3">
                    {newsForm.image ? (
                      <div className="relative">
                        <img 
                          src={newsForm.image.url} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTimes size={12} />
                        </button>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {newsForm.image.name}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                        <FaImage className="mx-auto text-slate-400 mb-2" size={24} />
                        <p className="text-slate-500 dark:text-slate-400 mb-2">Upload an image</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
                        >
                          <FaUpload /> Choose Image
                        </button>
                        <p className="text-xs text-slate-400 mt-2">Max size: 5MB</p>
                      </div>
                    )}
                  </div>
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
                  <div key={item._id || item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Fix: Check both image and imageUrl properties */}
                        {(item.image?.url || item.imageUrl) && (
                          <img 
                            src={item.image?.url || item.imageUrl} 
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
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
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id || item.id)}
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
                  <div key={item._id || item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
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
                              item.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              item.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id || item.id)}
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
                {filteredData().map((item) => (
                  <div key={item._id || item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{item.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Date:</span>
                            <span className="ml-2 font-medium text-slate-800 dark:text-white">{item.date}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Days Left:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                              item.daysLeft <= 7 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              item.daysLeft <= 30 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            }`}>
                              {item.daysLeft} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id || item.id)}
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

          {/* Empty State */}
          {filteredData().length === 0 && (
            <div className="p-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                {activeTab === 'news' && <FaNewspaper size={48} className="mx-auto mb-4" />}
                {activeTab === 'quiz' && <FaQuestionCircle size={48} className="mx-auto mb-4" />}
                {activeTab === 'exams' && <FaCalendarAlt size={48} className="mx-auto mb-4" />}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {searchTerm ? `No ${activeTab} found matching "${searchTerm}"` : `No ${activeTab} added yet`}
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {searchTerm ? 'Try adjusting your search term' : `Click "Add ${activeTab === 'news' ? 'News' : activeTab === 'quiz' ? 'Quiz' : 'Exam'}" to get started`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
}