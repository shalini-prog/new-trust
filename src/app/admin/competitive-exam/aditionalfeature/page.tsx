'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';

const AdditionalFeaturesAdmin = () => {
  // State for managing different sections
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  // Add/Edit/Delete functions
  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      const feature = {
        id: Date.now(),
        ...newFeature
      };
      setFeatures([...features, feature]);
      setNewFeature({ title: '', description: '', icon: 'TrendingUp', color: 'blue' });
    }
  };

  const deleteFeature = (id) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const addTarget = () => {
    if (newTarget.task) {
      const target = {
        id: Date.now(),
        ...newTarget
      };
      setDailyTargets([...dailyTargets, target]);
      setNewTarget({ task: '', completed: false });
    }
  };

  const toggleTarget = (id) => {
    setDailyTargets(dailyTargets.map(target => 
      target.id === id ? { ...target, completed: !target.completed } : target
    ));
  };

  const deleteTarget = (id) => {
    setDailyTargets(dailyTargets.filter(t => t.id !== id));
  };

  const addRecommendation = () => {
    if (newRecommendation.message) {
      const recommendation = {
        id: Date.now(),
        ...newRecommendation
      };
      setRecommendations([...recommendations, recommendation]);
      setNewRecommendation({ type: 'focus', message: '', priority: 'medium' });
    }
  };

  const deleteRecommendation = (id) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  const addExam = () => {
    if (newExam.name && newExam.date) {
      const exam = {
        id: Date.now(),
        ...newExam,
        daysLeft: calculateDaysLeft(newExam.date)
      };
      setUpcomingExams([...upcomingExams, exam]);
      setNewExam({ name: '', date: '', status: 'upcoming' });
    }
  };

  const deleteExam = (id) => {
    setUpcomingExams(upcomingExams.filter(e => e.id !== id));
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Additional Features Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage dashboard data, features, and user experience elements
          </p>
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
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feature.description}</p>
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
                  <h2 className="text-xl font-semibold">Daily Targets Management</h2>
                </div>

                {/* Add Target Form */}
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Add New Target</h3>
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
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Targets List */}
                <div className="space-y-3">
                  {dailyTargets.map((target) => (
                    <div key={target.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTarget(target.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            target.completed 
                              ? 'border-green-500 bg-green-100 dark:bg-green-900/20' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {target.completed && (
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span className={`${target.completed ? 'line-through opacity-70' : ''} text-gray-900 dark:text-white`}>
                          {target.task}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTarget(target.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {dailyTargets.filter(t => t.completed).length}/{dailyTargets.length} completed
                    </span>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${(dailyTargets.filter(t => t.completed).length / dailyTargets.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <select
                        value={newRecommendation.type}
                        onChange={(e) => setNewRecommendation({...newRecommendation, type: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="focus">Focus Area</option>
                        <option value="improvement">Needs Improvement</option>
                        <option value="praise">Doing Great</option>
                      </select>
                      <select
                        value={newRecommendation.priority}
                        onChange={(e) => setNewRecommendation({...newRecommendation, priority: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Recommendation message"
                      value={newRecommendation.message}
                      onChange={(e) => setNewRecommendation({...newRecommendation, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                    />
                    <button
                      onClick={addRecommendation}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Recommendation
                    </button>
                  </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rec.type === 'focus' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            rec.type === 'improvement' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          }`}>
                            {rec.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <button
                          onClick={() => deleteRecommendation(rec.id)}
                          className="text-red-500 hover:text-red-700"
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
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Exam Name"
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
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button
                    onClick={addExam}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add Exam
                  </button>
                </div>

                {/* Exams List */}
                <div className="space-y-3">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{exam.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(exam.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          exam.status === 'upcoming' && exam.daysLeft <= 30 
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                            : exam.status === 'upcoming' 
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
                            : exam.status === 'completed'
                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {exam.status === 'completed' 
                            ? 'Completed' 
                            : exam.status === 'cancelled'
                            ? 'Cancelled'
                            : `${exam.daysLeft} days left`}
                        </span>
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exam Statistics */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Total Exams</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{upcomingExams.length}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-orange-900 dark:text-orange-300">Upcoming</h4>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {upcomingExams.filter(e => e.status === 'upcoming').length}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900 dark:text-green-300">Completed</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {upcomingExams.filter(e => e.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Changes are applied in real-time
              </div>
            </div>

            {/* Mini Preview of Dashboard */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Study Dashboard Preview
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Mini Charts */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Weekly Performance</h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData.slice(-4)}>
                        <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                    <h4 className="font-medium text-sm mb-1">Today's Progress</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {dailyTargets.filter(t => t.completed).length}/{dailyTargets.length} completed
                      </span>
                      <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(dailyTargets.filter(t => t.completed).length / dailyTargets.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3">
                    <h4 className="font-medium text-sm mb-1">AI Recommendations</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {recommendations.length} active recommendations
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                    <h4 className="font-medium text-sm mb-1">Upcoming Exams</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {upcomingExams.filter(e => e.status === 'upcoming').length} exams scheduled
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Active Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {features.slice(0, 4).map((feature) => (
                    <div key={feature.id} className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className={`mx-auto mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit ${getColorClass(feature.color)}`}>
                        {getIconComponent(feature.icon)}
                      </div>
                      <h5 className="text-xs font-medium text-gray-900 dark:text-white">{feature.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="h-5 w-5 inline mr-2" />
            Save All Changes
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFeaturesAdmin;