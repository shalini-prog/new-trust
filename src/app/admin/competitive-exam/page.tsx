'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Trophy, 
  Newspaper,
  Download,
  Settings,
  Megaphone,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';

// Types
interface CompetitiveExamStats {
  totalExams: number;
  activePlans: number;
  materials: number;
  activeUsers: number;
  forumPosts: number;
  papers: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function CompetitiveExamAdminPage() {
  const [stats, setStats] = useState<CompetitiveExamStats>({
    totalExams: 0,
    activePlans: 0,
    materials: 0,
    activeUsers: 0,
    forumPosts: 0,
    papers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch stats
    setTimeout(() => {
      setStats({
        totalExams: 12,
        activePlans: 45,
        materials: 234,
        activeUsers: 1567,
        forumPosts: 89,
        papers: 156
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Hero Section',
      description: 'Manage hero content, videos, and call-to-action',
      icon: <Megaphone className="h-6 w-6" />,
      href: '/admin/competitive-exam/hero',
      color: 'bg-blue-500'
    },
    {
      title: 'Exam Overview',
      description: 'Add and manage competitive exam categories',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/admin/competitive-exam/exam-overview',
      color: 'bg-green-500'
    },
    {
      title: 'Study Plans',
      description: 'Create and organize study plans and schedules',
      icon: <Calendar className="h-6 w-6" />,
      href: '/admin/competitive-exam/study-plan',
      color: 'bg-purple-500'
    },
    {
      title: 'Study Materials',
      description: 'Upload and manage study resources',
      icon: <FileText className="h-6 w-6" />,
      href: '/admin/competitive-exam/study-materials',
      color: 'bg-orange-500'
    },
    {
      title: 'Current Affairs',
      description: 'Manage daily current affairs content',
      icon: <Newspaper className="h-6 w-6" />,
      href: '/admin/competitive-exam/current-affairs',
      color: 'bg-red-500'
    },
    {
      title: 'Previous Papers',
      description: 'Upload and organize previous year question papers',
      icon: <Download className="h-6 w-6" />,
      href: '/admin/competitive-exam/previous-papers',
      color: 'bg-indigo-500'
    },
    {
      title: 'Topper Stories',
      description: 'Manage success stories and testimonials',
      icon: <Trophy className="h-6 w-6" />,
      href: '/admin/competitive-exam/topper-stories',
      color: 'bg-yellow-500'
    },
    {
      title: 'Discussion Forum',
      description: 'Moderate forum posts and discussions',
      icon: <MessageSquare className="h-6 w-6" />,
      href: '/admin/competitive-exam/discussion-forum',
      color: 'bg-pink-500'
    },
    {
      title: 'Additional Features',
      description: 'Configure additional features and settings',
      icon: <Settings className="h-6 w-6" />,
      href: '/admin/competitive-exam/additional-features',
      color: 'bg-teal-500'
    },
    {
      title: 'Call to Action',
      description: 'Manage CTA buttons and conversion elements',
      icon: <Users className="h-6 w-6" />,
      href: '/admin/competitive-exam/call-to-action',
      color: 'bg-cyan-500'
    }
  ];

  const statCards = [
    {
      title: 'Total Exams',
      value: stats.totalExams,
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Study Plans',
      value: stats.activePlans,
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Study Materials',
      value: stats.materials,
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      change: '+25%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <Users className="h-8 w-8 text-orange-500" />,
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Forum Posts',
      value: stats.forumPosts,
      icon: <MessageSquare className="h-8 w-8 text-pink-500" />,
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Previous Papers',
      value: stats.papers,
      icon: <Download className="h-8 w-8 text-indigo-500" />,
      change: '+18%',
      changeType: 'positive'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Competitive Exam Management</h1>
          <p className="text-gray-600 mt-2">Manage all competitive exam related content and features</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-xs mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={action.href}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'New study material uploaded', item: 'UPSC Prelims Mock Test 2024', time: '2 hours ago', type: 'upload' },
            { action: 'Current affairs updated', item: 'Daily Current Affairs - June 27', time: '4 hours ago', type: 'update' },
            { action: 'New topper story added', item: 'Success Story: Rank 1 UPSC 2024', time: '1 day ago', type: 'add' },
            { action: 'Previous paper uploaded', item: 'SSC CGL 2023 Question Paper', time: '2 days ago', type: 'upload' },
            { action: 'Forum post moderated', item: 'Discussion on UPSC Strategy', time: '3 days ago', type: 'moderate' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'upload' ? 'bg-green-500' :
                  activity.type === 'update' ? 'bg-blue-500' :
                  activity.type === 'add' ? 'bg-purple-500' :
                  activity.type === 'moderate' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}