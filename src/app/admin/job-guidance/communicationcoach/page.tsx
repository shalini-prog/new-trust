'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mic, 
  MicOff, 
  Play, 
  Pause,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  FileText,
  Video,
  Award,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  Star,
  MessageCircle
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  lessons: number;
  rating: number;
  thumbnail: string;
  skills: string[];
  status: 'Published' | 'Draft' | 'Archived';
  enrollments: number;
  completionRate: number;
  lastUpdated: string;
}

interface Exercise {
  id: string;
  title: string;
  type: 'speaking' | 'listening' | 'writing' | 'reading';
  description: string;
  instructions: string;
  timeLimit?: number;
  difficulty: string;
  moduleId: string;
  status: 'Active' | 'Inactive';
  attempts: number;
  averageScore: number;
}

interface UserProgress {
  id: string;
  userName: string;
  email: string;
  totalModules: number;
  completedModules: number;
  practiceHours: number;
  lastActivity: string;
  averageScore: number;
  badges: string[];
}

export default function AdminCommunicationCoach() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'module' | 'exercise' | 'user' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'exercises', label: 'Exercises', icon: Mic },
    { id: 'users', label: 'User Progress', icon: Users },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const mockStats = {
    totalModules: 6,
    totalExercises: 25,
    activeUsers: 1250,
    completionRate: 68,
    averageRating: 4.7,
    practiceHours: 8500
  };

  const mockModules: Module[] = [
    {
      id: '1',
      title: 'Interview Communication Skills',
      category: 'Professional',
      duration: '2 hours',
      difficulty: 'Beginner',
      description: 'Master the art of communicating effectively during job interviews',
      lessons: 8,
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Body Language', 'Answering Questions', 'Confidence Building'],
      status: 'Published',
      enrollments: 450,
      completionRate: 75,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Public Speaking Fundamentals',
      category: 'Presentation',
      duration: '3 hours',
      difficulty: 'Intermediate',
      description: 'Overcome stage fright and deliver compelling presentations',
      lessons: 12,
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Stage Presence', 'Voice Modulation', 'Audience Engagement'],
      status: 'Published',
      enrollments: 320,
      completionRate: 62,
      lastUpdated: '2024-01-20'
    },
    {
      id: '3',
      title: 'Business Email Writing',
      category: 'Written Communication',
      duration: '1.5 hours',
      difficulty: 'Beginner',
      description: 'Write professional emails that get results',
      lessons: 6,
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Email Etiquette', 'Professional Tone', 'Clear Messaging'],
      status: 'Published',
      enrollments: 680,
      completionRate: 85,
      lastUpdated: '2024-01-10'
    }
  ];

  const mockExercises: Exercise[] = [
    {
      id: '1',
      title: 'Self Introduction Practice',
      type: 'speaking',
      description: 'Practice introducing yourself professionally',
      instructions: 'Record a 60-second self-introduction. Include your name, background, and career goals.',
      timeLimit: 60,
      difficulty: 'Beginner',
      moduleId: '1',
      status: 'Active',
      attempts: 1250,
      averageScore: 78
    },
    {
      id: '2',
      title: 'Common Interview Questions',
      type: 'speaking',
      description: 'Practice answering frequently asked interview questions',
      instructions: 'Answer the question: "Tell me about your strengths and weaknesses."',
      timeLimit: 120,
      difficulty: 'Intermediate',
      moduleId: '1',
      status: 'Active',
      attempts: 890,
      averageScore: 73
    }
  ];

  const mockUserProgress: UserProgress[] = [
    {
      id: '1',
      userName: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      totalModules: 6,
      completedModules: 4,
      practiceHours: 12.5,
      lastActivity: '2024-01-25',
      averageScore: 85,
      badges: ['First Steps', 'Practice Makes Perfect']
    },
    {
      id: '2',
      userName: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      totalModules: 6,
      completedModules: 2,
      practiceHours: 8.2,
      lastActivity: '2024-01-24',
      averageScore: 72,
      badges: ['First Steps']
    }
  ];

  const openModal = (type: 'module' | 'exercise' | 'user', item?: any) => {
    setModalType(type);
    if (type === 'module' && item) setSelectedModule(item);
    if (type === 'exercise' && item) setSelectedExercise(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedModule(null);
    setSelectedExercise(null);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communication Coach Management</h1>
            <p className="text-gray-600 mt-2">Manage training modules, exercises, and user progress</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => openModal('module')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Module
            </button>
            <button 
              onClick={() => openModal('exercise')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        {[
          { label: 'Total Modules', value: mockStats.totalModules, icon: BookOpen, color: 'text-blue-600' },
          { label: 'Total Exercises', value: mockStats.totalExercises, icon: Mic, color: 'text-green-600' },
          { label: 'Active Users', value: mockStats.activeUsers, icon: Users, color: 'text-purple-600' },
          { label: 'Completion Rate', value: `${mockStats.completionRate}%`, icon: TrendingUp, color: 'text-orange-600' },
          { label: 'Average Rating', value: mockStats.averageRating, icon: Star, color: 'text-yellow-600' },
          { label: 'Practice Hours', value: mockStats.practiceHours, icon: Clock, color: 'text-indigo-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex overflow-x-auto scrollbar-hide border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activities */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'New module published', details: 'Advanced Negotiation Skills', time: '2 hours ago', type: 'success' },
                        { action: 'Exercise completed', details: '25 users completed Phone Etiquette', time: '4 hours ago', type: 'info' },
                        { action: 'Module updated', details: 'Interview Skills module revised', time: '1 day ago', type: 'warning' },
                        { action: 'User milestone', details: '50 users earned Speaking Pro badge', time: '2 days ago', type: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Performing Modules */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Modules</h3>
                    <div className="space-y-3">
                      {mockModules.slice(0, 3).map((module, index) => (
                        <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{module.title}</p>
                              <p className="text-sm text-gray-600">{module.enrollments} enrollments</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">{module.completionRate}%</p>
                            <p className="text-xs text-gray-500">completion</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Charts and Analytics */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
                      <div className="text-sm text-gray-600">User Satisfaction</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
                      <div className="text-sm text-gray-600">Exercise Completion</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">4.8</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockModules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img 
                          src={module.thumbnail} 
                          alt={module.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            module.status === 'Published' ? 'bg-green-100 text-green-800' :
                            module.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {module.status}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => openModal('module', module)}
                            className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {module.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {module.difficulty}
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{module.enrollments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{module.rating}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-medium">{module.completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${module.completionRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('module', module)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercises Tab */}
            {activeTab === 'exercises' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Types</option>
                      <option value="speaking">Speaking</option>
                      <option value="writing">Writing</option>
                      <option value="listening">Listening</option>
                      <option value="reading">Reading</option>
                    </select>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-4">
                  {mockExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {exercise.type === 'speaking' && <Mic className="w-6 h-6 text-blue-600" />}
                            {exercise.type === 'writing' && <FileText className="w-6 h-6 text-blue-600" />}
                            {exercise.type === 'listening' && <MessageCircle className="w-6 h-6 text-blue-600" />}
                            {exercise.type === 'reading' && <BookOpen className="w-6 h-6 text-blue-600" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{exercise.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                exercise.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {exercise.status}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                {exercise.type}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{exercise.description}</p>
                            
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-gray-700">
                                <strong>Instructions:</strong> {exercise.instructions}
                              </p>
                              {exercise.timeLimit && (
                                <p className="text-sm text-blue-600 mt-2">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  Time limit: {exercise.timeLimit} seconds
                                </p>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-lg font-semibold text-gray-900">{exercise.attempts}</div>
                                <div className="text-gray-600">Attempts</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-gray-900">{exercise.averageScore}%</div>
                                <div className="text-gray-600">Avg Score</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-gray-900">{exercise.difficulty}</div>
                                <div className="text-gray-600">Difficulty</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openModal('exercise', exercise)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                               {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practice Hours</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockUserProgress.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.completedModules}/{user.totalModules} modules
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full" 
                                  style={{ width: `${(user.completedModules / user.totalModules) * 100}%` }}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.practiceHours} hours
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastActivity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => openModal('user', user)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                View
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                Message
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Learning Resources</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Resource
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Interview Guide',
                      type: 'PDF',
                      category: 'Professional',
                      downloads: 1250,
                      lastUpdated: '2024-01-15'
                    },
                    {
                      title: 'Public Speaking Tips',
                      type: 'Video',
                      category: 'Presentation',
                      downloads: 890,
                      lastUpdated: '2024-01-10'
                    },
                    {
                      title: 'Email Templates',
                      type: 'DOCX',
                      category: 'Written',
                      downloads: 2100,
                      lastUpdated: '2024-01-05'
                    }
                  ].map((resource, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {resource.type === 'PDF' && <FileText className="w-6 h-6 text-blue-600" />}
                            {resource.type === 'Video' && <Video className="w-6 h-6 text-blue-600" />}
                            {resource.type === 'DOCX' && <FileText className="w-6 h-6 text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{resource.type} • {resource.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600 mt-4">
                        <div>
                          <span className="font-medium">{resource.downloads.toLocaleString()}</span> downloads
                        </div>
                        <div>
                          Updated: {resource.lastUpdated}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Enable Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive email alerts for important activities</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Enable Dark Mode</h4>
                        <p className="text-sm text-gray-600">Switch to dark color scheme</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Language</h4>
                        <p className="text-sm text-gray-600">Interface language</p>
                      </div>
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 max-w-xs">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">System Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Version</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Current Version</span>
                          <span className="font-medium">v2.4.1</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium">2024-01-20</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Update Available</span>
                          <span className="font-medium text-green-600">No</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Storage</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Used</span>
                          <span className="font-medium">1.2 GB</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Available</span>
                          <span className="font-medium">8.8 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Module Modal */}
            {modalType === 'module' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedModule ? 'Edit Module' : 'Create New Module'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      defaultValue={selectedModule?.title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Module title"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={selectedModule?.category || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        <option value="Professional">Professional</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Written Communication">Written Communication</option>
                        <option value="Workplace">Workplace</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        defaultValue={selectedModule?.difficulty || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      defaultValue={selectedModule?.description || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Module description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        defaultValue={selectedModule?.duration || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 2 hours"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lessons</label>
                      <input
                        type="number"
                        defaultValue={selectedModule?.lessons || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Number of lessons"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        defaultValue={selectedModule?.status || 'Draft'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Covered</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedModule?.skills?.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {skill}
                          <button className="ml-1 text-gray-500 hover:text-gray-700">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a skill"
                      />
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                    <div className="flex items-center gap-4">
                      {selectedModule?.thumbnail && (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={selectedModule.thumbnail} 
                            alt="Module thumbnail" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {selectedModule ? 'Update Module' : 'Create Module'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Modal */}
            {modalType === 'exercise' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedExercise ? 'Edit Exercise' : 'Create New Exercise'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      defaultValue={selectedExercise?.title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Exercise title"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        defaultValue={selectedExercise?.type || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="speaking">Speaking</option>
                        <option value="writing">Writing</option>
                        <option value="listening">Listening</option>
                        <option value="reading">Reading</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        defaultValue={selectedExercise?.difficulty || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      defaultValue={selectedExercise?.description || ''}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Exercise description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      defaultValue={selectedExercise?.instructions || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed instructions for the exercise"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (seconds)</label>
                      <input
                        type="number"
                        defaultValue={selectedExercise?.timeLimit || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave empty for no time limit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        defaultValue={selectedExercise?.status || 'Active'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Associated Module</label>
                    <select
                      defaultValue={selectedExercise?.moduleId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select module</option>
                      {mockModules.map(module => (
                        <option key={module.id} value={module.id}>{module.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {selectedExercise ? 'Update Exercise' : 'Create Exercise'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User Modal */}
            {modalType === 'user' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">User Progress Details</h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Priya Sharma</h4>
                      <p className="text-gray-600">priya.sharma@email.com</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Modules Completed</p>
                      <p className="text-2xl font-bold text-gray-900">4/6</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Practice Hours</p>
                      <p className="text-2xl font-bold text-gray-900">12.5</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Last Activity</p>
                      <p className="text-2xl font-bold text-gray-900">2024-01-25</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Achievement Badges</h5>
                    <div className="flex flex-wrap gap-2">
                      {['First Steps', 'Practice Makes Perfect'].map((badge, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          <Award className="w-4 h-4 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Completed Modules</h5>
                    <div className="space-y-2">
                      {mockModules.slice(0, 3).map((module, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{module.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Completed on: 2024-01-20</span>
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}