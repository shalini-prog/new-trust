'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  Flag,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pin,
  Lock,
  Unlock,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Star,
  AlertTriangle,
  UserCheck,
  MessageSquare,
  Settings,
  Download,
  BarChart3
} from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    badge: 'Top Helper' | 'Volunteer Mentor' | 'Newbie' | 'Expert';
    points: number;
    id: number;
  };
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  createdAt: string;
  isHelpful: boolean;
  isPinned: boolean;
  isLocked: boolean;
  isReported: boolean;
  status: 'active' | 'pending' | 'removed';
  reports: number;
}

interface ForumUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  badge: string;
  points: number;
  postsCount: number;
  repliesCount: number;
  joinedAt: string;
  status: 'active' | 'suspended' | 'banned';
  lastActive: string;
  warnings: number;
}

export default function AdminCommunityForums() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data
  const mockStats = [
    { 
      id: 1, 
      label: 'Total Posts', 
      value: '1,247', 
      change: '+12%', 
      trend: 'up',
      icon: MessageCircle, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 2, 
      label: 'Active Users', 
      value: '856', 
      change: '+8%', 
      trend: 'up',
      icon: Users, 
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      id: 3, 
      label: 'Pending Reports', 
      value: '23', 
      change: '-15%', 
      trend: 'down',
      icon: Flag, 
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    { 
      id: 4, 
      label: 'Daily Engagement', 
      value: '2,341', 
      change: '+25%', 
      trend: 'up',
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const mockPosts: ForumPost[] = [
    {
      id: 1,
      title: 'Best Strategy for UPSC Prelims 2024 - Need Guidance',
      content: 'I\'m preparing for UPSC 2024 and confused about the strategy...',
      author: {
        id: 1,
        name: 'Priya Sharma',
        avatar: '/api/placeholder/40/40',
        badge: 'Newbie',
        points: 125
      },
      category: 'UPSC',
      tags: ['UPSC', 'Prelims', 'Strategy'],
      replies: 23,
      views: 456,
      likes: 34,
      createdAt: '2 hours ago',
      isHelpful: true,
      isPinned: true,
      isLocked: false,
      isReported: false,
      status: 'active',
      reports: 0
    },
    {
      id: 2,
      title: 'Inappropriate content shared',
      content: 'This post contains spam content and should be reviewed...',
      author: {
        id: 2,
        name: 'Spam User',
        avatar: '/api/placeholder/40/40',
        badge: 'Newbie',
        points: 5
      },
      category: 'General',
      tags: ['spam'],
      replies: 2,
      views: 45,
      likes: 0,
      createdAt: '1 day ago',
      isHelpful: false,
      isPinned: false,
      isLocked: false,
      isReported: true,
      status: 'pending',
      reports: 5
    }
  ];

  const mockUsers: ForumUser[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: '/api/placeholder/40/40',
      badge: 'Top Helper',
      points: 2450,
      postsCount: 45,
      repliesCount: 156,
      joinedAt: '2023-01-15',
      status: 'active',
      lastActive: '2 hours ago',
      warnings: 0
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      avatar: '/api/placeholder/40/40',
      badge: 'Expert',
      points: 3200,
      postsCount: 67,
      repliesCount: 234,
      joinedAt: '2022-08-20',
      status: 'active',
      lastActive: '1 day ago',
      warnings: 1
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'upsc', name: 'UPSC' },
    { id: 'ssc', name: 'SSC' },
    { id: 'banking', name: 'Banking' },
    { id: 'railway', name: 'Railway' },
    { id: 'skills', name: 'Skills' },
    { id: 'mental-health', name: 'Mental Health' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: MessageCircle },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleAction = (action: string, item: any) => {
    setModalType(action);
    setSelectedItem(item);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat) => (
          <motion.div
            key={stat.id}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? '↗' : '↘'}
                <span className="ml-1">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {mockPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{post.title}</p>
                  <p className="text-sm text-gray-600">by {post.author.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{post.replies} replies</span>
                    <span>{post.views} views</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
                {post.isReported && (
                  <Flag className="w-4 h-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {mockUsers.slice(0, 3).map((user, index) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.points} points</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                  {user.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Review Reports', icon: Flag, color: 'text-red-500', action: () => setActiveTab('reports') },
            { label: 'Moderate Posts', icon: Shield, color: 'text-orange-500', action: () => setActiveTab('moderation') },
            { label: 'Manage Users', icon: Users, color: 'text-blue-500', action: () => setActiveTab('users') },
            { label: 'Forum Settings', icon: Settings, color: 'text-gray-500', action: () => setActiveTab('settings') }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Posts Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="removed">Removed</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        {post.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                        {post.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                        {post.isReported && <Flag className="w-4 h-4 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{post.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-sm text-gray-600">{post.author.badge}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div>{post.replies} replies</div>
                      <div>{post.views} views</div>
                      <div>{post.likes} likes</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      {post.reports > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {post.reports} reports
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAction('view', post)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Post"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('edit', post)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('pin', post)}
                        className={`p-1 hover:bg-yellow-100 rounded ${post.isPinned ? 'text-yellow-600' : 'text-gray-400'}`}
                        title={post.isPinned ? 'Unpin Post' : 'Pin Post'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('lock', post)}
                        className={`p-1 hover:bg-gray-100 rounded ${post.isLocked ? 'text-red-600' : 'text-gray-400'}`}
                        title={post.isLocked ? 'Unlock Post' : 'Lock Post'}
                      >
                        {post.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleAction('delete', post)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-2" />
            Export Users
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            {user.badge}
                          </span>
                          <span className="text-xs text-gray-500">{user.points} points</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div>{user.postsCount} posts</div>
                      <div>{user.repliesCount} replies</div>
                      <div>Last active: {user.lastActive}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      {user.warnings > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          {user.warnings} warnings
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAction('viewUser', user)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('editUser', user)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('warnUser', user)}
                        className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                        title="Warn User"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('suspendUser', user)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Suspend User"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Resolve All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
        <Flag className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">23 Reports Pending Review</h3>
        <p className="text-gray-600 mb-4">Review and moderate reported content to maintain community standards</p>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Review Reports
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'posts':
        return renderPosts();
      case 'users':
        return renderUsers();
      case 'reports':
        return renderReports();
      case 'moderation':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Moderation Tools</h3>
            <p className="text-gray-600">Advanced moderation features and automated content filtering</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Forum Settings</h3>
            <p className="text-gray-600">Configure forum categories, permissions, and moderation rules</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-blue-600">Admin</span> Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <UserCheck className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="relative">
              <button className="flex items-center gap-2">
                <img
                  src="/api/placeholder/32/32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-gray-700">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {modalType} {selectedItem?.title ? 'Post' : 'User'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {modalType === 'delete' && (
                  <>
                    <p className="text-gray-600">
                      Are you sure you want to delete this post? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Deleted post ${selectedItem.id}`);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete Post
                      </button>
                    </div>
                  </>
                )}

                {modalType === 'suspendUser' && (
                  <>
                    <p className="text-gray-600">
                      Suspend user {selectedItem.name}? They won't be able to post or comment.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Suspended user ${selectedItem.id}`);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Suspend User
                      </button>
                    </div>
                  </>
                )}

                {modalType === 'edit' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Post Title
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedItem.title}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        rows={4}
                        defaultValue={selectedItem.content}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          console.log(`Saved changes to post ${selectedItem.id}`);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}