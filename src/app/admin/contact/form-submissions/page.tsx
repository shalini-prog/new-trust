import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical,
  X,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  readAt?: string;
  repliedAt?: string;
  tags: string[];
  isStarred: boolean;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  avgResponseTime: string;
  todayCount: number;
  weekCount: number;
}

export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
    avgResponseTime: '0h',
    todayCount: 0,
    weekCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<string>>(new Set());

  // Mock data
  useEffect(() => {
    const mockSubmissions: ContactSubmission[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        subject: 'Partnership Inquiry',
        message: 'Hi there! I represent a local nonprofit organization and we are interested in exploring potential partnership opportunities with your organization. We share similar values and believe we could create meaningful impact together. Could we schedule a call to discuss this further? I would love to share more details about our current initiatives and learn about yours. Looking forward to hearing from you soon.',
        status: 'new',
        priority: 'high',
        submittedAt: '2024-01-15T14:30:00Z',
        tags: ['partnership', 'nonprofit'],
        isStarred: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'mike.chen@company.com',
        phone: '+1 (555) 987-6543',
        subject: 'Volunteer Opportunity',
        message: 'I am interested in volunteering for your upcoming charity event. I have experience in event management and would love to contribute my skills to your cause.',
        status: 'read',
        priority: 'medium',
        submittedAt: '2024-01-14T09:15:00Z',
        readAt: '2024-01-14T10:20:00Z',
        tags: ['volunteer', 'event'],
        isStarred: false
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        subject: 'Donation Question',
        message: 'I would like to make a donation but have some questions about the tax implications and how the funds will be used.',
        status: 'replied',
        priority: 'medium',
        submittedAt: '2024-01-13T16:45:00Z',
        readAt: '2024-01-13T17:00:00Z',
        repliedAt: '2024-01-13T18:30:00Z',
        tags: ['donation', 'tax'],
        isStarred: false
      },
      {
        id: '4',
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '+1 (555) 456-7890',
        subject: 'Media Interview Request',
        message: 'I am a journalist with Local News Network and would like to schedule an interview about your recent community impact initiatives.',
        status: 'new',
        priority: 'urgent',
        submittedAt: '2024-01-15T11:20:00Z',
        tags: ['media', 'interview'],
        isStarred: true
      },
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.wang@business.com',
        subject: 'Sponsorship Proposal',
        message: 'Our company is interested in sponsoring your next event. Please send us more information about sponsorship packages.',
        status: 'archived',
        priority: 'low',
        submittedAt: '2024-01-10T13:00:00Z',
        readAt: '2024-01-10T14:15:00Z',
        repliedAt: '2024-01-10T16:30:00Z',
        tags: ['sponsorship', 'business'],
        isStarred: false
      }
    ];

    const mockStats: ContactStats = {
      total: 87,
      new: 12,
      read: 15,
      replied: 45,
      archived: 15,
      avgResponseTime: '2.4h',
      todayCount: 8,
      weekCount: 23
    };

    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      read: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: newStatus as any } : sub
    ));
  };

  const handleStarToggle = (id: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, isStarred: !sub.isStarred } : sub
    ));
  };

  const toggleExpanded = (id: string) => {
    setExpandedSubmissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleReply = () => {
    if (selectedSubmission && replyMessage.trim()) {
      handleStatusChange(selectedSubmission.id, 'replied');
      setShowReplyModal(false);
      setReplyMessage('');
      setSelectedSubmission(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Form Management</h1>
              <p className="text-gray-600 mt-1">Manage and respond to contact submissions</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                <Mail className="w-4 h-4" />
                Compose Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
              </div>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.todayCount}</p>
              </div>
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-pink-600">{stats.weekCount}</p>
              </div>
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Submissions ({filteredSubmissions.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  submission.status === 'new' ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => handleStarToggle(submission.id)}
                        className={`p-1 rounded-full transition-colors ${
                          submission.isStarred 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={submission.isStarred ? 'currentColor' : 'none'} />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{submission.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(submission.priority)}`}>
                          {submission.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </span>
                      {submission.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {submission.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{submission.subject}</h4>
                      <p className={`text-gray-600 text-sm ${
                        expandedSubmissions.has(submission.id) ? '' : 'line-clamp-2'
                      }`}>
                        {submission.message}
                      </p>
                      {submission.message.length > 100 && (
                        <button
                          onClick={() => toggleExpanded(submission.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm mt-1 flex items-center gap-1"
                        >
                          {expandedSubmissions.has(submission.id) ? (
                            <>Show less <ChevronDown className="w-3 h-3" /></>
                          ) : (
                            <>Show more <ChevronRight className="w-3 h-3" /></>
                          )}
                        </button>
                      )}
                    </div>

                    {submission.tags.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {submission.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowReplyModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Contact submissions will appear here when received.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reply to {selectedSubmission.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Original message:</div>
                  <div className="font-medium text-gray-900 mb-1">{selectedSubmission.subject}</div>
                  <div className="text-gray-700">{selectedSubmission.message}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply here..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}