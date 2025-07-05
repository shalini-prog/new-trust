'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  BarChart3,
  UserPlus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  PlayCircle,
  Pause,
  MoreVertical,
  Mail,
  Bell,
  FileText,
  Award
} from 'lucide-react';

// Mock data for workshops
const mockWorkshops = [
  {
    id: 1,
    title: 'UPSC Strategy Bootcamp 2024',
    instructor: 'Dr. Rajesh Sharma',
    type: 'upcoming',
    status: 'published',
    date: '2024-02-15',
    time: '10:00 AM',
    duration: '3 hours',
    participants: 245,
    maxParticipants: 500,
    price: 0,
    category: 'exam-strategy',
    level: 'Intermediate',
    registrations: 245,
    completions: 0,
    rating: 0,
    revenue: 0
  },
  {
    id: 2,
    title: 'Communication Skills Masterclass',
    instructor: 'Priya Patel',
    type: 'live',
    status: 'live',
    date: '2024-02-10',
    time: '2:00 PM',
    duration: '2.5 hours',
    participants: 156,
    maxParticipants: 300,
    price: 299,
    category: 'soft-skills',
    level: 'Beginner',
    registrations: 156,
    completions: 89,
    rating: 4.8,
    revenue: 46644
  },
  {
    id: 3,
    title: 'AI & Machine Learning Workshop',
    instructor: 'Vikash Kumar',
    type: 'recorded',
    status: 'published',
    date: '2024-02-08',
    time: 'Available Now',
    duration: '4 hours',
    participants: 890,
    maxParticipants: 1000,
    price: 599,
    category: 'tech-talks',
    level: 'Advanced',
    registrations: 890,
    completions: 678,
    rating: 4.9,
    revenue: 533110
  }
];

const mockInstructors = [
  { id: 1, name: 'Dr. Rajesh Sharma', expertise: 'UPSC Expert', workshops: 12, rating: 4.9, status: 'active' },
  { id: 2, name: 'Priya Patel', expertise: 'Soft Skills Coach', workshops: 8, rating: 4.8, status: 'active' },
  { id: 3, name: 'Vikash Kumar', expertise: 'Tech Expert', workshops: 15, rating: 4.9, status: 'active' }
];

const mockStats = [
  { label: 'Total Workshops', value: '156', change: '+12%', icon: Video, color: 'text-blue-500' },
  { label: 'Active Participants', value: '3,450', change: '+8%', icon: Users, color: 'text-green-500' },
  { label: 'This Month Revenue', value: '₹2.4L', change: '+15%', icon: TrendingUp, color: 'text-purple-500' },
  { label: 'Completion Rate', value: '87%', change: '+3%', icon: Award, color: 'text-orange-500' }
];

export default function AdminWorkshopsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workshops', label: 'Workshops', icon: Video },
    { id: 'instructors', label: 'Instructors', icon: UserPlus },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const categories = ['all', 'exam-strategy', 'soft-skills', 'tech-talks', 'life-coaching'];
  const statuses = ['all', 'draft', 'published', 'live', 'completed', 'cancelled'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-600">New Workshop</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <UserPlus className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-600">Add Instructor</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-600">Schedule Session</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-600">View Reports</span>
          </button>
        </div>
      </div>

      {/* Live Workshops */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Live Workshops</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {mockWorkshops.filter(w => w.status === 'live').map((workshop) => (
            <div key={workshop.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-gray-800">{workshop.title}</p>
                  <p className="text-sm text-gray-600">{workshop.participants} participants</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                  Monitor
                </button>
                <button className="p-1 text-gray-600 hover:text-gray-800">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Workshops */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming This Week</h3>
        <div className="space-y-3">
          {mockWorkshops.filter(w => w.type === 'upcoming').map((workshop) => (
            <div key={workshop.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{workshop.title}</p>
                <p className="text-sm text-gray-600">{workshop.date} at {workshop.time}</p>
              </div>
              <span className="text-sm text-blue-600 font-medium">{workshop.registrations} registered</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkshops = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Workshops Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Workshop
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops..."
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
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'all' ? 'All Status' : status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workshops Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workshop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockWorkshops.map((workshop) => (
                <tr key={workshop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{workshop.title}</div>
                      <div className="text-sm text-gray-500">{workshop.category} • {workshop.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{workshop.instructor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{workshop.date}</div>
                    <div className="text-sm text-gray-500">{workshop.time} • {workshop.duration}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{workshop.participants}/{workshop.maxParticipants}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(workshop.participants / workshop.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workshop.status)}`}>
                      {workshop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">₹{workshop.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      {workshop.status === 'live' ? (
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
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

  const renderInstructors = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Instructors Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Instructor
        </button>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInstructors.map((instructor) => (
          <motion.div
            key={instructor.id}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {instructor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{instructor.name}</h3>
                <p className="text-sm text-gray-600">{instructor.expertise}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Workshops:</span>
                <span className="text-sm font-medium">{instructor.workshops}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{instructor.rating}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${instructor.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {instructor.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                View Profile
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
      
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Revenue Chart Would Go Here</p>
        </div>
      </div>

      {/* Participant Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Participant Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-medium">4.7/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat Attendees</span>
              <span className="font-medium">64%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Categories</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exam Strategy</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tech Talks</span>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Soft Skills</span>
              <span className="font-medium">27%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'workshops':
        return renderWorkshops();
      case 'instructors':
        return renderInstructors();
      case 'participants':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Participants Management</h3>
            <p className="text-gray-600">Manage workshop participants, registrations, and communications</p>
          </div>
        );
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Workshop Settings</h3>
            <p className="text-gray-600">Configure workshop settings, notifications, and integrations</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workshops Management</h1>
              <p className="text-gray-600">Manage workshops, instructors, and participant engagement</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Export Data
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bell className="w-4 h-4 mr-2 inline" />
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}