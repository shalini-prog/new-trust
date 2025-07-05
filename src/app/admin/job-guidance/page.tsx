'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  FileText, 
  MessageCircle, 
  Globe, 
  GraduationCap,
  Target,
  Users,
  TrendingUp,
  Star,
  Award,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockStats = {
  totalJobs: 15000,
  activeCandidates: 50000,
  successfulPlacements: 45000,
  skillPrograms: 150,
  freelanceProjects: 8500,
  successStories: 2500
};

const mockRecentActivities = [
  { id: 1, type: 'job', action: 'New job posted', title: 'Software Developer at TechCorp', time: '2 hours ago' },
  { id: 2, type: 'user', action: 'User completed training', title: 'React.js Fundamentals', time: '4 hours ago' },
  { id: 3, type: 'success', action: 'Success story added', title: 'Priya Sharma - Software Developer', time: '1 day ago' },
  { id: 4, type: 'freelance', action: 'Freelance project posted', title: 'Mobile App Development', time: '2 days ago' }
];

export default function AdminJobGuidanceDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [recentActivities, setRecentActivities] = useState(mockRecentActivities);

  useEffect(() => {
    setMounted(true);
  }, []);

  const managementSections = [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Manage hero content, background, and CTA buttons',
      icon: Target,
      color: 'bg-blue-500',
      count: '1 Active'
    },
    {
      id: 'stats',
      title: 'Statistics',
      description: 'Update platform statistics and metrics',
      icon: BarChart3,
      color: 'bg-green-500',
      count: '6 Metrics'
    },
    {
      id: 'job-listings',
      title: 'Job Listings',
      description: 'Manage job postings and applications',
      icon: Briefcase,
      color: 'bg-purple-500',
      count: `${stats.totalJobs} Jobs`
    },
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      description: 'Configure resume templates and settings',
      icon: FileText,
      color: 'bg-orange-500',
      count: '12 Templates'
    },
    {
      id: 'skill-training',
      title: 'Skill Training',
      description: 'Manage training courses and certifications',
      icon: GraduationCap,
      color: 'bg-indigo-500',
      count: `${stats.skillPrograms} Programs`
    },
    {
      id: 'freelance-opportunities',
      title: 'Freelance Opportunities',
      description: 'Handle freelance projects and gigs',
      icon: Globe,
      color: 'bg-teal-500',
      count: `${stats.freelanceProjects} Projects`
    },
    {
      id: 'communication-coach',
      title: 'Communication Coach',
      description: 'Manage coaching modules and sessions',
      icon: MessageCircle,
      color: 'bg-pink-500',
      count: '25 Modules'
    },
    {
      id: 'success-stories',
      title: 'Success Stories',
      description: 'Handle testimonials and success cases',
      icon: Star,
      color: 'bg-yellow-500',
      count: `${stats.successStories} Stories`
    }
  ];

  const quickStats = [
    { label: 'Total Jobs', value: stats.totalJobs, change: '+12%', color: 'text-blue-600' },
    { label: 'Active Users', value: stats.activeCandidates, change: '+8%', color: 'text-green-600' },
    { label: 'Placements', value: stats.successfulPlacements, change: '+15%', color: 'text-purple-600' },
    { label: 'Success Rate', value: '85%', change: '+3%', color: 'text-orange-600' }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Guidance Management</h1>
            <p className="text-gray-600 mt-2">Manage all aspects of the job guidance platform</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Add
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
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
              <div className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Management Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {managementSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => {
                // Navigate to specific management page
                console.log(`Navigate to ${section.id} management`);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${section.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{section.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{section.count}</span>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'job' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'user' ? 'bg-green-100 text-green-600' :
                  activity.type === 'success' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'job' && <Briefcase className="w-4 h-4" />}
                  {activity.type === 'user' && <Users className="w-4 h-4" />}
                  {activity.type === 'success' && <Star className="w-4 h-4" />}
                  {activity.type === 'freelance' && <Globe className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { title: 'Add New Job Posting', description: 'Create a new job opportunity', icon: Plus, color: 'bg-blue-500' },
              { title: 'Create Success Story', description: 'Add a new testimonial', icon: Star, color: 'bg-yellow-500' },
              { title: 'Add Training Course', description: 'Create new skill program', icon: GraduationCap, color: 'bg-green-500' },
              { title: 'Update Statistics', description: 'Refresh platform metrics', icon: BarChart3, color: 'bg-purple-500' }
            ].map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  onClick={() => console.log(`Quick action: ${action.title}`)}
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <ActionIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}