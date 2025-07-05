'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Flag, 
  Shield, 
  BarChart3, 
  Settings, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  UserCheck,
  MessageCircle,
  Activity
} from 'lucide-react';

const DiscussionForumAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const adminTabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="mr-2" size={18} /> },
    { id: 'posts', name: 'Manage Posts', icon: <MessageSquare className="mr-2" size={18} /> },
    { id: 'users', name: 'User Management', icon: <Users className="mr-2" size={18} /> },
    { id: 'reports', name: 'Reports & Flags', icon: <Flag className="mr-2" size={18} /> },
    { id: 'moderation', name: 'Moderation', icon: <Shield className="mr-2" size={18} /> },
    { id: 'settings', name: 'Forum Settings', icon: <Settings className="mr-2" size={18} /> }
  ];

  // Mock data for demonstration
  const overviewStats = [
    { title: 'Total Posts', value: '2,847', change: '+12%', icon: <MessageSquare className="text-blue-600" size={24} /> },
    { title: 'Active Users', value: '1,234', change: '+8%', icon: <Users className="text-green-600" size={24} /> },
    { title: 'Pending Reports', value: '23', change: '+3', icon: <Flag className="text-red-600" size={24} /> },
    { title: 'Engagement Rate', value: '78%', change: '+5%', icon: <TrendingUp className="text-purple-600" size={24} /> }
  ];

  const recentPosts = [
    { 
      id: 1, 
      user: 'Priya Singh', 
      title: 'UPSC Prelims 2025 Pattern Changes', 
      content: 'Can someone explain the new pattern for UPSC Prelims 2025? I heard there are some significant changes...', 
      time: '2 hours ago', 
      status: 'approved',
      replies: 15,
      likes: 45,
      category: 'General Discussion'
    },
    { 
      id: 2, 
      user: 'Rahul Verma', 
      title: 'Banking Exam Study Group Delhi NCR', 
      content: 'Looking for serious study partners for Banking exams in Delhi NCR region. Must be dedicated and consistent...', 
      time: '5 hours ago', 
      status: 'pending',
      replies: 8,
      likes: 12,
      category: 'Study Groups'
    },
    { 
      id: 3, 
      user: 'Anjali Gupta', 
      title: 'Amazing Indian History Resource', 
      content: 'I found this amazing resource for Indian History. It covers all major topics with detailed explanations...', 
      time: '1 day ago', 
      status: 'flagged',
      replies: 32,
      likes: 89,
      category: 'Expert Advice'
    }
  ];

  const reportedPosts = [
    { id: 1, postId: 156, reason: 'Spam content', reporter: 'Anonymous', time: '1 hour ago', status: 'pending' },
    { id: 2, postId: 234, reason: 'Inappropriate language', reporter: 'ModUser123', time: '3 hours ago', status: 'reviewing' },
    { id: 3, postId: 189, reason: 'Off-topic discussion', reporter: 'StudyBuddy', time: '6 hours ago', status: 'resolved' }
  ];

  const activeUsers = [
    { id: 1, name: 'Priya Singh', email: 'priya@email.com', posts: 45, joinDate: '2024-01-15', status: 'active', role: 'member' },
    { id: 2, name: 'Rahul Verma', email: 'rahul@email.com', posts: 23, joinDate: '2024-02-10', status: 'active', role: 'member' },
    { id: 3, name: 'Dr. Sharma', email: 'sharma@email.com', posts: 78, joinDate: '2023-11-20', status: 'active', role: 'expert' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{stat.change}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-blue-600" size={20} />
            Recent Forum Activity
          </h3>
          <div className="space-y-3">
            {recentPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                  {post.user.charAt(0)}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{post.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-green-600" size={20} />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition">
              <div className="flex items-center">
                <MessageCircle className="mr-3 text-blue-600" size={16} />
                <span className="text-sm font-medium">Review Pending Posts (5)</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition">
              <div className="flex items-center">
                <Flag className="mr-3 text-red-600" size={16} />
                <span className="text-sm font-medium">Handle Reports (3)</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition">
              <div className="flex items-center">
                <UserCheck className="mr-3 text-green-600" size={16} />
                <span className="text-sm font-medium">Moderate Users (2)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Posts</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{post.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{post.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{post.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex gap-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {post.replies} replies
                      </span>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                        {post.likes} likes
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'approved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      post.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                        <CheckCircle size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={16} />
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
      {/* User Management Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
          Export Users
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {activeUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'expert' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.posts}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={16} />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                        <Ban size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={16} />
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
      <h3 className="text-lg font-semibold">Reports & Flags</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Post ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reportedPosts.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{report.postId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{report.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{report.reporter}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{report.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'resolved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      report.status === 'reviewing' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                        <CheckCircle size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <AlertTriangle size={16} />
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
          <div className="text-center py-12">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Moderation Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced moderation features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Forum Settings</h3>
            <p className="text-gray-600 dark:text-gray-400">Configuration options coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discussion Forum Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your forum community, posts, and user interactions</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default DiscussionForumAdmin;