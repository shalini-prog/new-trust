'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Calendar,
  MessageCircle,
  Star,
  Award,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Plus,
  Download,
  Upload,
  AlertCircle,
  BarChart3,
  Target,
  DollarSign
} from 'lucide-react';

interface Mentor {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  company: string;
  expertise: string[];
  experience: string;
  rating: number;
  totalMentees: number;
  activeMentees: number;
  completedSessions: number;
  responseTime: string;
  languages: string[];
  location: string;
  bio: string;
  achievements: string[];
  availability: 'Available' | 'Busy' | 'Limited';
  price: number;
  sessionTypes: string[];
  isVerified: boolean;
  isTopRated: boolean;
  joinedDate: string;
  status: 'Active' | 'Pending' | 'Suspended';
  earnings: number;
}

interface MentorshipRequest {
  id: number;
  menteeId: number;
  menteeName: string;
  menteeEmail: string;
  mentorId: number;
  mentorName: string;
  mentorshipType: string;
  goals: string[];
  experience: string;
  timeCommitment: string;
  preferredLanguage: string;
  specificNeeds: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  requestDate: string;
  responseDate?: string;
  sessionCount: number;
}

interface MentorshipSession {
  id: number;
  mentorId: number;
  mentorName: string;
  menteeId: number;
  menteeName: string;
  sessionType: string;
  scheduledDate: string;
  duration: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  rating?: number;
  feedback?: string;
  amount: number;
}

export default function MentorshipAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data
  const mockMentors: Mentor[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      avatar: '/api/placeholder/80/80',
      title: 'IAS Officer',
      company: 'Government of India',
      expertise: ['UPSC/Civil Services', 'Public Administration'],
      experience: '12+ years',
      rating: 4.9,
      totalMentees: 156,
      activeMentees: 12,
      completedSessions: 245,
      responseTime: '< 2 hours',
      languages: ['English', 'Hindi'],
      location: 'New Delhi',
      bio: 'AIR 25 in UPSC 2011. Currently serving as District Collector.',
      achievements: ['AIR 25 UPSC 2011', 'Young Administrator Award'],
      availability: 'Available',
      price: 0,
      sessionTypes: ['One-on-One', 'Group Sessions'],
      isVerified: true,
      isTopRated: true,
      joinedDate: '2023-01-15',
      status: 'Active',
      earnings: 0
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      avatar: '/api/placeholder/80/80',
      title: 'Senior Software Engineer',
      company: 'Google',
      expertise: ['Technology', 'Software Engineering'],
      experience: '8+ years',
      rating: 4.8,
      totalMentees: 89,
      activeMentees: 8,
      completedSessions: 178,
      responseTime: '< 4 hours',
      languages: ['English'],
      location: 'Bangalore',
      bio: 'Ex-Microsoft, currently at Google.',
      achievements: ['Google L6 Engineer', 'Ex-Microsoft'],
      availability: 'Limited',
      price: 2500,
      sessionTypes: ['Career Guidance', 'Technical Interviews'],
      isVerified: true,
      isTopRated: false,
      joinedDate: '2023-03-20',
      status: 'Active',
      earnings: 445000
    }
  ];

  const mockRequests: MentorshipRequest[] = [
    {
      id: 1,
      menteeId: 101,
      menteeName: 'Arjun Patel',
      menteeEmail: 'arjun.patel@email.com',
      mentorId: 1,
      mentorName: 'Dr. Rajesh Kumar',
      mentorshipType: 'Exam Preparation',
      goals: ['Clear UPSC', 'Interview preparation'],
      experience: 'Intermediate',
      timeCommitment: '6-10 hours',
      preferredLanguage: 'Hindi',
      specificNeeds: 'Need help with current affairs and mock interviews',
      status: 'Pending',
      requestDate: '2024-06-25',
      sessionCount: 0
    },
    {
      id: 2,
      menteeId: 102,
      menteeName: 'Sneha Reddy',
      menteeEmail: 'sneha.reddy@email.com',
      mentorId: 2,
      mentorName: 'Priya Sharma',
      mentorshipType: 'Career Transition',
      goals: ['Switch to tech', 'Interview skills'],
      experience: 'Beginner',
      timeCommitment: '3-5 hours',
      preferredLanguage: 'English',
      specificNeeds: 'Complete beginner looking to transition to software engineering',
      status: 'Approved',
      requestDate: '2024-06-20',
      responseDate: '2024-06-21',
      sessionCount: 3
    }
  ];

  const mockSessions: MentorshipSession[] = [
    {
      id: 1,
      mentorId: 1,
      mentorName: 'Dr. Rajesh Kumar',
      menteeId: 101,
      menteeName: 'Arjun Patel',
      sessionType: 'Mock Interview',
      scheduledDate: '2024-06-30T10:00:00',
      duration: 60,
      status: 'Scheduled',
      amount: 0
    },
    {
      id: 2,
      mentorId: 2,
      mentorName: 'Priya Sharma',
      menteeId: 102,
      menteeName: 'Sneha Reddy',
      sessionType: 'Career Guidance',
      scheduledDate: '2024-06-28T14:00:00',
      duration: 45,
      status: 'Completed',
      rating: 5,
      feedback: 'Excellent session, very helpful guidance',
      amount: 2500
    }
  ];

  const stats = [
    {
      label: 'Total Mentors',
      value: '156',
      change: '+12%',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Requests',
      value: '23',
      change: '+5%',
      icon: UserPlus,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Sessions This Month',
      value: '342',
      change: '+18%',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Revenue Generated',
      value: '₹5.2L',
      change: '+25%',
      icon: DollarSign,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'requests', label: 'Requests', icon: UserPlus },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Suspended':
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('mentors')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-800">View Mentors</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <UserPlus className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-800">Review Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-800">Manage Sessions</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-800">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {mockRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{request.menteeName}</p>
                  <p className="text-sm text-gray-600">wants {request.mentorshipType} mentorship</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {mockSessions.filter(s => s.status === 'Scheduled').map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{session.sessionType}</p>
                  <p className="text-sm text-gray-600">{session.mentorName} → {session.menteeName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(session.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">{session.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Mentors Management</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Mentor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Mentors Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expertise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-sm text-gray-500">{mentor.title}</p>
                        <p className="text-xs text-gray-400">{mentor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{mentor.activeMentees} active</p>
                      <p className="text-gray-500">{mentor.totalMentees} total</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{mentor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(mentor.status)}`}>
                      {mentor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">₹{mentor.earnings.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(mentor);
                          setShowModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
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

  const renderRequests = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Mentorship Requests</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Requests Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRequests.map((request) => (
          <motion.div
            key={request.id}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{request.menteeName}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Mentor:</strong> {request.mentorName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {request.mentorshipType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Experience:</strong> {request.experience}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time Commitment:</strong> {request.timeCommitment}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Goals:</p>
              <div className="flex flex-wrap gap-1">
                {request.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Specific Needs:</p>
              <p className="text-sm text-gray-600 line-clamp-2">{request.specificNeeds}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
              {request.responseDate && (
                <span>Responded: {new Date(request.responseDate).toLocaleDateString()}</span>
              )}
            </div>
            
            {request.status === 'Pending' && (
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
              </div>
            )}
            
            {request.status !== 'Pending' && (
              <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 inline mr-1" />
                View Details
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Mentorship Sessions</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Schedule Session
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{session.sessionType}</p>
                      {session.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{session.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{session.mentorName}</p>
                  </td>
                  <td className="px-6 py-4">
  <p className="font-medium text-gray-900">{session.menteeName}</p>
</td>
<td className="px-6 py-4">
  <p className="text-sm text-gray-900">
    {new Date(session.scheduledDate).toLocaleDateString()}
  </p>
  <p className="text-xs text-gray-500">
    {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </p>
</td>
<td className="px-6 py-4">
  <p className="text-sm text-gray-900">{session.duration} min</p>
</td>
<td className="px-6 py-4">
  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
    {session.status}
  </span>
</td>
<td className="px-6 py-4">
  <p className="font-medium text-gray-900">₹{session.amount}</p>
</td>
<td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <button
      onClick={() => {
        setSelectedItem(session);
        setShowModal(true);
      }}
      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button className="p-1 text-green-600 hover:bg-green-100 rounded">
      <Edit className="w-4 h-4" />
    </button>
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

const renderAnalytics = () => (
<div className="space-y-6">
<h2 className="text-2xl font-bold text-gray-800">Mentorship Analytics</h2>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Sessions Chart */}
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions Overview</h3>
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Sessions chart will be displayed here</p>
    </div>
  </div>

  {/* Revenue Chart */}
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Revenue chart will be displayed here</p>
    </div>
  </div>
</div>

{/* Mentor Performance */}
<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Mentors</h3>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {mockMentors
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5)
          .map((mentor) => (
            <tr key={mentor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.title}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-900">{mentor.completedSessions}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span>{mentor.rating}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-900">₹{mentor.earnings.toLocaleString()}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">95%</span>
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

return (
<div className="min-h-screen bg-gray-50">
{/* Sidebar and Main Content Layout */}
<div className="flex">
{/* Sidebar */}
<div className="hidden md:flex md:flex-shrink-0">
  <div className="w-64 bg-white border-r border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">Mentorship Admin</h1>
    </div>
    <nav className="p-4 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
</div>

{/* Main Content */}
<div className="flex-1 overflow-auto">
  <div className="p-6">
    {/* Mobile Tabs */}
    <div className="md:hidden mb-6">
      <div className="flex overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* Render Active Tab Content */}
    {activeTab === 'overview' && renderOverview()}
    {activeTab === 'mentors' && renderMentors()}
    {activeTab === 'requests' && renderRequests()}
    {activeTab === 'sessions' && renderSessions()}
    {activeTab === 'analytics' && renderAnalytics()}
  </div>
</div>
</div>

{/* Detail Modal */}
<AnimatePresence>
{showModal && selectedItem && (
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
      className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Details</h3>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Render different content based on selected item type */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={selectedItem.avatar}
              alt={selectedItem.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h4 className="text-xl font-bold text-gray-800">{selectedItem.name}</h4>
              <p className="text-gray-600">{selectedItem.title} at {selectedItem.company}</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedItem.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{selectedItem.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{selectedItem.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined Date</p>
              <p className="font-medium">{selectedItem.joinedDate}</p>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-800 mb-2">Expertise</h5>
            <div className="flex flex-wrap gap-2">
              {selectedItem.expertise.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-800 mb-2">Bio</h5>
            <p className="text-gray-600">{selectedItem.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Mentees</p>
              <p className="text-2xl font-bold">{selectedItem.totalMentees}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Mentees</p>
              <p className="text-2xl font-bold">{selectedItem.activeMentees}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                <span className="text-2xl font-bold">{selectedItem.rating}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Earnings</p>
              <p className="text-2xl font-bold">₹{selectedItem.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedItem.sessionType}</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </span>
              {selectedItem.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span>{selectedItem.rating}/5</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Mentor</p>
              <p className="font-medium">{selectedItem.mentorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mentee</p>
              <p className="font-medium">{selectedItem.menteeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(selectedItem.scheduledDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">
                {new Date(selectedItem.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{selectedItem.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">₹{selectedItem.amount}</p>
            </div>
          </div>

          {selectedItem.feedback && (
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Feedback</h5>
              <p className="text-gray-600 italic">"{selectedItem.feedback}"</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Take Action
        </button>
      </div>
    </motion.div>
  </motion.div>
)}
</AnimatePresence>
</div>
);
}