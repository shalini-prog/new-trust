'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Bell, 
  Bookmark, 
  Clock, 
  Zap,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Target,
  Brain,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const AdditionalFeaturesAdmin = () => {
  // State for managing different sections
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sample data states
  const [progressData, setProgressData] = useState([
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 59 },
    { name: 'Week 3', score: 80 },
    { name: 'Week 4', score: 71 },
    { name: 'Week 5', score: 76 },
    { name: 'Week 6', score: 85 },
    { name: 'Week 7', score: 90 },
  ]);

  const [subjectData, setSubjectData] = useState([
    { name: 'History', value: 78 },
    { name: 'Geography', value: 65 },
    { name: 'Polity', value: 82 },
    { name: 'Economy', value: 71 },
    { name: 'Science', value: 85 },
  ]);

  const [features, setFeatures] = useState([
    {
      id: 1,
      icon: 'TrendingUp',
      title: "Personalized Dashboard",
      description: "AI-powered dashboard that tracks your progress and suggests topics based on your performance.",
      color: 'blue'
    },
    {
      id: 2,
      icon: 'Award',
      title: "Gamification",
      description: "Earn points, badges, and rewards as you complete topics, tests, and daily goals.",
      color: 'purple'
    },
    {
      id: 3,
      icon: 'Bookmark',
      title: "Smart Bookmarks",
      description: "Save important notes and concepts for quick revision before exams.",
      color: 'green'
    },
    {
      id: 4,
      icon: 'Bell',
      title: "Exam Alerts",
      description: "Get timely notifications about upcoming exams, registration dates, and result announcements.",
      color: 'red'
    }
  ]);

  const [dailyTargets, setDailyTargets] = useState([
    { id: 1, task: 'Complete Indian History Quiz (45 min)', completed: true },
    { id: 2, task: 'Read Current Affairs (30 min)', completed: true },
    { id: 3, task: 'Geography Practice Set (60 min)', completed: false },
    { id: 4, task: 'Mock Test for Economy (90 min)', completed: false },
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      type: 'focus',
      message: 'Based on your performance, you should focus more on Geography - Physical Features of India',
      priority: 'high'
    },
    {
      id: 2,
      type: 'improvement',
      message: 'Your recall ability in Economic Terms & Concepts needs improvement',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'praise',
      message: "You're doing great in Modern History and Science & Technology!",
      priority: 'low'
    }
  ]);

  const [upcomingExams, setUpcomingExams] = useState([
    { id: 1, name: 'UPSC Prelims 2025', date: '2025-06-15', daysLeft: 86, status: 'upcoming' },
    { id: 2, name: 'SBI PO Prelims', date: '2025-04-12', daysLeft: 22, status: 'upcoming' },
    { id: 3, name: 'SSC CGL Tier 1', date: '2025-03-10', daysLeft: 0, status: 'completed' },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Form states
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    icon: 'TrendingUp',
    color: 'blue'
  });

  const [newTarget, setNewTarget] = useState({
    task: '',
    completed: false
  });

  const [newRecommendation, setNewRecommendation] = useState({
    type: 'focus',
    message: '',
    priority: 'medium'
  });

  const [newExam, setNewExam] = useState({
    name: '',
    date: '',
    status: 'upcoming'
  });

  // Store initial data for comparison
  const [initialData, setInitialData] = useState({});

  // Initialize data snapshot on component mount
  useEffect(() => {
    const snapshot = {
      progressData: [...progressData],
      subjectData: [...subjectData],
      features: [...features],
      dailyTargets: [...dailyTargets],
      recommendations: [...recommendations],
      upcomingExams: [...upcomingExams]
    };
    setInitialData(snapshot);
  }, []); // Empty dependency array to run only once

  // Check for unsaved changes
  useEffect(() => {
    // Only check for changes if we have initial data
    if (Object.keys(initialData).length === 0) return;
    
    const currentData = {
      progressData,
      subjectData,
      features,
      dailyTargets,
      recommendations,
      upcomingExams
    };
    
    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);
  }, [progressData, subjectData, features, dailyTargets, recommendations, upcomingExams, initialData]);

  // Simulate API data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call - in real app, this would be your actual API endpoint
         const res = await fetch('http://localhost:5000/api/eadd');
         const data = await res.json();

        // For demo purposes, we'll use the initial state data
        

        setProgressData(data.progressData || []);
        setSubjectData(data.subjectData || []);
        setFeatures(data.features || []);
        setDailyTargets(data.dailyTargets || []);
        setRecommendations(data.recommendations || []);
        setUpcomingExams(data.upcomingExams || []);
        
        // Set initial data snapshot after fetching
        setInitialData(data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle Save Function
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare data for saving
      const dataToSave = {
        progressData,
        subjectData,
        features,
        dailyTargets,
        recommendations,
        upcomingExams,
        timestamp: new Date().toISOString()
      };
      
      // In a real application, this would be an API call
      console.log('Saving data:', dataToSave);
      
      // Simulate API call
       await fetch('http://localhost:5000/api/eadd/save', {
         method: 'POST',
        headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(dataToSave)
       });
      
      // Update initial data snapshot
      setInitialData({
        progressData: [...progressData],
        subjectData: [...subjectData],
        features: [...features],
        dailyTargets: [...dailyTargets],
        recommendations: [...recommendations],
        upcomingExams: [...upcomingExams]
      });
      
      setSaveStatus('success');
      setHasUnsavedChanges(false);
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save function (optional)
  const handleAutoSave = async () => {
    if (hasUnsavedChanges && saveStatus === 'idle') {
      await handleSave();
    }
  };

  // Reset all data to initial state
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This will discard all unsaved changes.')) {
      if (initialData.progressData) {
        setProgressData([...initialData.progressData]);
        setSubjectData([...initialData.subjectData]);
        setFeatures([...initialData.features]);
        setDailyTargets([...initialData.dailyTargets]);
        setRecommendations([...initialData.recommendations]);
        setUpcomingExams([...initialData.upcomingExams]);
        setHasUnsavedChanges(false);
      }
    }
  };

  // Helper functions
  const calculateDaysLeft = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getIconComponent = (iconName) => {
    const icons = {
      TrendingUp: <TrendingUp className="h-6 w-6" />,
      Award: <Award className="h-6 w-6" />,
      Bookmark: <Bookmark className="h-6 w-6" />,
      Bell: <Bell className="h-6 w-6" />,
      Users: <Users className="h-6 w-6" />,
      BarChart3: <BarChart3 className="h-6 w-6" />,
      Brain: <Brain className="h-6 w-6" />,
      Target: <Target className="h-6 w-6" />
    };
    return icons[iconName] || <TrendingUp className="h-6 w-6" />;
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600'
    };
    return colors[color] || 'text-blue-600';
  };

  // Add/Edit/Delete functions - FIXED VERSIONS
  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      const feature = {
        id: Date.now(), // Using timestamp as unique ID
        ...newFeature
      };
      setFeatures(prevFeatures => [...prevFeatures, feature]);
      setNewFeature({ title: '', description: '', icon: 'TrendingUp', color: 'blue' });
    }
  };

  // FIXED: This is the main fix for the delete issue
  const deleteFeature = (idToDelete) => {
    console.log('Deleting feature with ID:', idToDelete);
    console.log('Current features:', features);
    
    setFeatures(prevFeatures => {
      const filteredFeatures = prevFeatures.filter(f => f.id !== idToDelete);
      console.log('Filtered features:', filteredFeatures);
      return filteredFeatures;
    });
  };

  const addTarget = () => {
    if (newTarget.task) {
      const target = {
        id: Date.now(),
        ...newTarget
      };
      setDailyTargets(prevTargets => [...prevTargets, target]);
      setNewTarget({ task: '', completed: false });
    }
  };

  const toggleTarget = (id) => {
    setDailyTargets(prevTargets => 
      prevTargets.map(target => 
        target.id === id ? { ...target, completed: !target.completed } : target
      )
    );
  };

  const deleteTarget = (id) => {
    setDailyTargets(prevTargets => prevTargets.filter(t => t.id !== id));
  };

  const addRecommendation = () => {
    if (newRecommendation.message) {
      const recommendation = {
        id: Date.now(),
        ...newRecommendation
      };
      setRecommendations(prevRecs => [...prevRecs, recommendation]);
      setNewRecommendation({ type: 'focus', message: '', priority: 'medium' });
    }
  };

  const deleteRecommendation = (id) => {
    setRecommendations(prevRecs => prevRecs.filter(r => r.id !== id));
  };

  const addExam = () => {
    if (newExam.name && newExam.date) {
      const exam = {
        id: Date.now(),
        ...newExam,
        daysLeft: calculateDaysLeft(newExam.date)
      };
      setUpcomingExams(prevExams => [...prevExams, exam]);
      setNewExam({ name: '', date: '', status: 'upcoming' });
    }
  };

  const deleteExam = (id) => {
    setUpcomingExams(prevExams => prevExams.filter(e => e.id !== id));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Data', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'features', label: 'Features', icon: <Settings className="h-4 w-4" /> },
    { id: 'targets', label: 'Daily Targets', icon: <Target className="h-4 w-4" /> },
    { id: 'recommendations', label: 'AI Recommendations', icon: <Brain className="h-4 w-4" /> },
    { id: 'exams', label: 'Upcoming Exams', icon: <Calendar className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Save Status */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Additional Features Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage dashboard data, features, and user experience elements
              </p>
            </div>
            
            {/* Save Status Indicator */}
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">All changes saved</span>
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Error saving changes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Dashboard Data Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Progress Data Management</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Progress Chart */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Weekly Progress</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Subject Performance */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Subject Performance</h3>
                    <div className="space-y-2">
                      {subjectData.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{subject.name}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={subject.value}
                              onChange={(e) => {
                                const newData = [...subjectData];
                                newData[index].value = parseInt(e.target.value);
                                setSubjectData(newData);
                              }}
                              className="w-20"
                            />
                            <span className="text-sm font-medium w-12">{subject.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subjectData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {subjectData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Manage Features</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Feature
                  </button>
                </div>

                {/* Add Feature Form */}
                {isEditing && (
                  <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Add New Feature</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Feature Title"
                        value={newFeature.title}
                        onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <select
                        value={newFeature.icon}
                        onChange={(e) => setNewFeature({...newFeature, icon: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="TrendingUp">Trending Up</option>
                        <option value="Award">Award</option>
                        <option value="Bookmark">Bookmark</option>
                        <option value="Bell">Bell</option>
                        <option value="Users">Users</option>
                        <option value="Brain">Brain</option>
                      </select>
                      <textarea
                        placeholder="Feature Description"
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white md:col-span-2"
                        rows="3"
                      />
                      <select
                        value={newFeature.color}
                        onChange={(e) => setNewFeature({...newFeature, color: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="yellow">Yellow</option>
                        <option value="indigo">Indigo</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addFeature}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 inline mr-2" />
                        Save Feature
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X className="h-4 w-4 inline mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Features List */}
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${getColorClass(feature.color)}`}>
                          {getIconComponent(feature.icon)}
                        </div>
                        <button
                          onClick={() => deleteFeature(feature.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete feature"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feature.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">ID: {feature.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Daily Targets Tab */}
          {activeTab === 'targets' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Daily Targets Management</h2></div>

                {/* Add Target Form */}
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Add New Daily Target</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Target task description"
                      value={newTarget.task}
                      onChange={(e) => setNewTarget({...newTarget, task: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addTarget}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Target
                    </button>
                  </div>
                </div>

                {/* Targets List */}
                <div className="space-y-3">
                  {dailyTargets.map((target) => (
                    <div key={target.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={target.completed}
                          onChange={() => toggleTarget(target.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className={`${target.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {target.task}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTarget(target.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete target"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">AI Recommendations Management</h2>
                </div>

                {/* Add Recommendation Form */}
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Add New Recommendation</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <select
                      value={newRecommendation.type}
                      onChange={(e) => setNewRecommendation({...newRecommendation, type: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="focus">Focus</option>
                      <option value="improvement">Improvement</option>
                      <option value="praise">Praise</option>
                    </select>
                    <select
                      value={newRecommendation.priority}
                      onChange={(e) => setNewRecommendation({...newRecommendation, priority: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <button
                      onClick={addRecommendation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add
                    </button>
                  </div>
                  <textarea
                    placeholder="Recommendation message"
                    value={newRecommendation.message}
                    onChange={(e) => setNewRecommendation({...newRecommendation, message: e.target.value})}
                    className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                  />
                </div>

                {/* Recommendations List */}
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.type === 'focus' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            rec.type === 'improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {rec.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            rec.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteRecommendation(rec.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete recommendation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-900 dark:text-white">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Exams Tab */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Exams Management</h2>
                </div>

                {/* Add Exam Form */}
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Add New Exam</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Exam name"
                      value={newExam.name}
                      onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={newExam.date}
                      onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                      value={newExam.status}
                      onChange={(e) => setNewExam({...newExam, status: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={addExam}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Exam
                    </button>
                  </div>
                </div>

                {/* Exams List */}
                <div className="space-y-3">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{exam.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Date: {exam.date}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exam.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {exam.status}
                            </span>
                            {exam.status === 'upcoming' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                exam.daysLeft <= 7 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                exam.daysLeft <= 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              }`}>
                                {exam.daysLeft > 0 ? `${exam.daysLeft} days left` : 'Today'}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete exam"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Action Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg flex items-center gap-2"
            title="Reset all changes"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
              isSaving || !hasUnsavedChanges
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFeaturesAdmin;