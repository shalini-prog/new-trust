'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  User,
  Search,
  Plus,
  X,
  Loader,
  ArrowUp,
  BarChart2,
  Shield,
  Download,
  Settings,
  Tag,
  Filter,
  List,
  Grid,
  MoreVertical,
  Star,
  Archive,
  Lock,
  Paperclip,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'resolved' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  userId: string;
  userName: string;
  userEmail: string;
  assignedTo?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  sentAt: Date;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface AdminStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  urgentTickets: number;
  avgResponseTime: string;
  satisfactionRate: number;
}

const TicketAdminPortal = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'pending' | 'resolved' | 'urgent'>('all');
  const [activeTab, setActiveTab] = useState<'tickets' | 'analytics' | 'settings'>('tickets');
  const [stats, setStats] = useState<AdminStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    urgentTickets: 0,
    avgResponseTime: '2h 15m',
    satisfactionRate: 92
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: '',
    category: '',
    dateRange: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        subject: 'Property dispute with neighbor',
        category: 'property',
        status: 'open',
        priority: 'high',
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 3600000 * 5),
        userId: 'user1',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@example.com',
        assignedTo: 'Admin 1',
        messages: [
          {
            id: '1-1',
            text: 'Hello, I have a property dispute with my neighbor regarding boundary walls.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 2),
          },
          {
            id: '1-2',
            text: 'Thank you for reaching out. Property boundary disputes are common under Section 38 of the Specific Relief Act.',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 1),
          },
        ],
      },
      {
        id: '2',
        subject: 'Consumer complaint against appliance company',
        category: 'consumer',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 3600000 * 2),
        userId: 'user2',
        userName: 'Priya Patel',
        userEmail: 'priya@example.com',
        assignedTo: 'Admin 2',
        messages: [
          {
            id: '2-1',
            text: 'I purchased a refrigerator that stopped working after 2 months.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 5),
          },
          {
            id: '2-2',
            text: 'Under the Consumer Protection Act 2019, you can file a complaint within 2 years.',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 3),
          },
        ],
      },
      {
        id: '3',
        subject: 'Domestic violence case assistance',
        category: 'family',
        status: 'urgent',
        priority: 'high',
        createdAt: new Date(Date.now() - 86400000 * 1),
        updatedAt: new Date(Date.now() - 3600000 * 1),
        userId: 'user3',
        userName: 'Anonymous',
        userEmail: 'anonymous@example.com',
        assignedTo: 'Admin 1',
        messages: [
          {
            id: '3-1',
            text: 'I need immediate help regarding domestic violence.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 1),
          },
          {
            id: '3-2',
            text: 'We take this very seriously. Under the Protection of Women from Domestic Violence Act 2005, you can file for immediate protection.',
            sender: 'support',
            sentAt: new Date(Date.now() - 3600000 * 1),
          },
        ],
      },
      {
        id: '4',
        subject: 'RTI application guidance',
        category: 'general',
        status: 'resolved',
        priority: 'low',
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        userId: 'user4',
        userName: 'Amit Kumar',
        userEmail: 'amit@example.com',
        assignedTo: 'Admin 3',
        messages: [
          {
            id: '4-1',
            text: 'I need help drafting an RTI application.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 10),
          },
          {
            id: '4-2',
            text: 'Here is a sample RTI format you can use.',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 8),
          },
        ],
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setStats({
        totalTickets: mockTickets.length,
        openTickets: mockTickets.filter(t => t.status === 'open').length,
        resolvedTickets: mockTickets.filter(t => t.status === 'resolved').length,
        urgentTickets: mockTickets.filter(t => t.status === 'urgent').length,
        avgResponseTime: '2h 15m',
        satisfactionRate: 92
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    // Apply status filter
    if (activeFilter !== 'all' && ticket.status !== activeFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && 
        !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply priority filter
    if (filters.priority && ticket.priority !== filters.priority) {
      return false;
    }
    
    // Apply category filter
    if (filters.category && ticket.category !== filters.category) {
      return false;
    }
    
    return true;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMessage: Message = {
        id: `${selectedTicket.id}-${selectedTicket.messages.length + 1}`,
        text: newMessage,
        sender: 'support',
        sentAt: new Date(),
      };

      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [...ticket.messages, updatedMessage],
              updatedAt: new Date(),
              status: ticket.status === 'urgent' ? 'pending' : ticket.status
            }
          : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, updatedMessage],
        updatedAt: new Date(),
      });
      setNewMessage('');
      setIsSubmitting(false);
    }, 800);
  };

  const updateTicketStatus = (id: string, status: 'open' | 'pending' | 'resolved' | 'urgent') => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id
        ? { ...ticket, status, updatedAt: new Date() }
        : ticket
    );
    
    setTickets(updatedTickets);
    
    if (selectedTicket?.id === id) {
      setSelectedTicket({
        ...selectedTicket,
        status,
        updatedAt: new Date()
      });
    }
  };

  const assignTicket = (id: string, assignee: string) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id
        ? { ...ticket, assignedTo: assignee }
        : ticket
    );
    
    setTickets(updatedTickets);
    
    if (selectedTicket?.id === id) {
      setSelectedTicket({
        ...selectedTicket,
        assignedTo: assignee
      });
    }
  };

  const createNewTicket = (ticketData: any) => {
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [{
        id: '1',
        text: ticketData.initialMessage || 'Ticket created',
        sender: 'user',
        sentAt: new Date()
      }],
      userId: 'user' + Date.now(),
      assignedTo: ''
    };
    
    setTickets(prev => [newTicket as Ticket, ...prev]);
    setShowCreateModal(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      openTickets: prev.openTickets + 1
    }));
  };

  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }
    setShowDeleteModal(null);
    
    // Update stats
    const deletedTicket = tickets.find(t => t.id === ticketId);
    if (deletedTicket) {
      setStats(prev => ({
        ...prev,
        totalTickets: prev.totalTickets - 1,
        [`${deletedTicket.status}Tickets` as keyof AdminStats]: prev[`${deletedTicket.status}Tickets` as keyof AdminStats] - 1
      }));
    }
  };

  const updateTicket = (ticketId: string, updatedData: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, ...updatedData, updatedAt: new Date() }
        : ticket
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev!, ...updatedData, updatedAt: new Date() }));
    }
    
    setEditingTicket(null);
  };

  const exportTickets = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Subject,Category,Status,Priority,User,Created,Updated\n" +
      filteredTickets.map(ticket => 
        `${ticket.id},"${ticket.subject}",${ticket.category},${ticket.status},${ticket.priority},"${ticket.userName}",${ticket.createdAt.toISOString()},${ticket.updatedAt.toISOString()}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tickets_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAnalyticsData = () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      ticketsByStatus: {
        open: tickets.filter(t => t.status === 'open').length,
        pending: tickets.filter(t => t.status === 'pending').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        urgent: tickets.filter(t => t.status === 'urgent').length
      },
      ticketsByCategory: {
        property: tickets.filter(t => t.category === 'property').length,
        consumer: tickets.filter(t => t.category === 'consumer').length,
        family: tickets.filter(t => t.category === 'family').length,
        general: tickets.filter(t => t.category === 'general').length
      },
      weeklyTrend: tickets.filter(t => new Date(t.createdAt) >= lastWeek).length,
      monthlyTrend: tickets.filter(t => new Date(t.createdAt) >= lastMonth).length,
      avgResolutionTime: '1.5 days',
      topCategories: ['Property', 'Consumer', 'Family'],
      peakHours: ['10:00 AM', '2:00 PM', '4:00 PM']
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
      
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
      
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
      
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
      
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
      
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
      
    return 'just now';
  };

  const CreateTicketModal = ({ isOpen, onClose, onCreate }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onCreate: (data: any) => void 
  }) => {
    const [formData, setFormData] = useState({
      subject: '',
      category: 'general',
      priority: 'medium',
      status: 'open',
      userName: '',
      userEmail: '',
      initialMessage: ''
    });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Ticket</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="general">General</option>
              <option value="property">Property</option>
              <option value="consumer">Consumer</option>
              <option value="family">Family</option>
            </select>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              placeholder="User Name"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
            />
            <input
              type="email"
              placeholder="User Email"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.userEmail}
              onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
            />
            <textarea
              placeholder="Initial Message"
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.initialMessage}
              onChange={(e) => setFormData({...formData, initialMessage: e.target.value})}
            />
          </div>
          <div className="p-6 border-t flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onCreate(formData)}
              disabled={!formData.subject || !formData.userName}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ ticket, onClose, onDelete }: { 
    ticket: Ticket | null, 
    onClose: () => void, 
    onDelete: (id: string) => void 
  }) => {
    if (!ticket) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Delete Ticket</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete ticket "{ticket.subject}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(ticket.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsModal = ({ isOpen, onClose }: { 
    isOpen: boolean, 
    onClose: () => void 
  }) => {
    if (!isOpen) return null;
    
    const analytics = getAnalyticsData();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Detailed Analytics</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{analytics.weeklyTrend}</div>
                <div className="text-sm text-blue-600">This Week</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{analytics.monthlyTrend}</div>
                <div className="text-sm text-green-600">This Month</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-900">{analytics.avgResolutionTime}</div>
                <div className="text-sm text-yellow-600">Avg Resolution</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">94%</div>
                <div className="text-sm text-purple-600">Satisfaction</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Status Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.ticketsByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.ticketsByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(count / tickets.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Peak Hours</h3>
              <div className="flex gap-2">
                {analytics.peakHours.map((hour, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {hour}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Legal Support Admin Portal</h1>
            <p className="text-gray-600">Manage and resolve legal support tickets</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            {[
              { id: 'tickets', label: 'Tickets', icon: <Mail className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'tickets' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Stats Cards */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium mb-1">Total</div>
                    <div className="text-xl font-bold">{stats.totalTickets}</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600 font-medium mb-1">Urgent</div>
                    <div className="text-xl font-bold">{stats.urgentTickets}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium mb-1">Pending</div>
                    <div className="text-xl font-bold">{tickets.filter(t => t.status === 'pending').length}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium mb-1">Resolved</div>
                    <div className="text-xl font-bold">{stats.resolvedTickets}</div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={filters.priority}
                            onChange={(e) => setFilters({...filters, priority: e.target.value})}
                          >
                            <option value="">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                          >
                            <option value="">All Categories</option>
                            <option value="property">Property</option>
                            <option value="consumer">Consumer</option>
                            <option value="family">Family</option>
                            <option value="general">General</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                          >
                            <option value="">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={() => setFilters({ priority: '', category: '', dateRange: '' })}
                          className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Filter */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-medium text-gray-800 mb-3">Status</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Tickets', count: tickets.length },
                    { id: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
                    { id: 'pending', label: 'Pending', count: tickets.filter(t => t.status === 'pending').length },
                    { id: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
                    { id: 'urgent', label: 'Urgent', count: tickets.filter(t => t.status === 'urgent').length }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id as any)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
                        activeFilter === filter.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                  <div className="relative w-full md:w-auto md:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                      {viewMode === 'list' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={exportTickets}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      New Ticket
                    </button>
                    <button 
                      onClick={() => setShowAnalyticsModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Analytics
                    </button>
                  </div>
                </div>
              </div>

              {/* Tickets List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                  <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? 'No tickets match your search' : 'No tickets found'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? 'Try different search terms'
                      : activeFilter === 'all'
                        ? 'There are no tickets yet'
                        : `There are no ${activeFilter} tickets`}
                  </p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Create New Ticket
                  </button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 bg-white rounded-xl shadow-sm border cursor-pointer hover:border-blue-500 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {ticket.messages[0].text}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {ticket.category}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <User className="w-3 h-3" />
                              {ticket.userName}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(ticket.updatedAt)}
                            </span>
                            {ticket.assignedTo && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Shield className="w-3 h-3" />
                                {ticket.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)} mb-2`}>
                            {ticket.status}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewTicket(ticket);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTicket(ticket);
                              }}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(ticket);
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 bg-white rounded-xl shadow-sm border cursor-pointer hover:border-blue-500 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{ticket.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {ticket.messages[0].text}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{ticket.userName}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(ticket.updatedAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Ticket Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-blue-800">Response Time</h3>
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{stats.avgResponseTime}</div>
                <div className="text-sm text-blue-700">Average response time</div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-green-800">Satisfaction Rate</h3>
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-900 mb-2">{stats.satisfactionRate}%</div>
                <div className="text-sm text-green-700">Positive feedback</div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-purple-800">Resolutions</h3>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-2">{stats.resolvedTickets}</div>
                <div className="text-sm text-purple-700">Tickets resolved this month</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-medium text-gray-800 mb-4">Tickets by Status</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart2 className="w-12 h-12 opacity-50" />
                  <span className="ml-2">Chart would display here</span>
                </div>
              </div>
              
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-medium text-gray-800 mb-4">Tickets by Category</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart2 className="w-12 h-12 opacity-50" />
                  <span className="ml-2">Chart would display here</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Portal Settings</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-medium text-gray-800 mb-4">Support Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Admin 1', 'Admin 2', 'Admin 3'].map((admin) => (
                    <div key={admin} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{admin}</div>
                          <div className="text-sm text-gray-500">Support Admin</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-b pb-6">
                <h3 className="font-medium text-gray-800 mb-4">Automation Rules</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Auto-assign urgent tickets</div>
                        <div className="text-sm text-gray-500">Assigns urgent tickets to senior admins</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Auto-close inactive tickets</div>
                        <div className="text-sm text-gray-500">Closes tickets after 14 days of inactivity</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg text-red-600 hover:bg-red-100">
                    <div className="flex items-center gap-3">
                      <Archive className="w-5 h-5" />
                      <span>Archive all resolved tickets</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg text-red-600 hover:bg-red-100">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5" />
                      <span>Disable ticket submission</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTicket(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 30 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900 truncate">{selectedTicket.subject}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className="text-gray-500">
                        Created: {formatDate(selectedTicket.createdAt)}
                      </span>
                      <span className="text-gray-500">
                        Updated: {formatTimeAgo(selectedTicket.updatedAt)}
                      </span>
                      <span className="text-gray-500">
                        Category: {selectedTicket.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600 ml-4"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedTicket.userName}</div>
                        <div className="text-sm text-gray-500">{selectedTicket.userEmail}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={selectedTicket.assignedTo || ''}
                        onChange={(e) => assignTicket(selectedTicket.id, e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        <option value="Admin 1">Admin 1</option>
                        <option value="Admin 2">Admin 2</option>
                        <option value="Admin 3">Admin 3</option>
                      </select>
                      
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg p-4 ${
                          message.sender === 'user'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Shield className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === 'user' ? selectedTicket.userName : 'Support Team'} • {formatTimeAgo(message.sentAt)}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{message.text}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded border border-gray-200 text-sm"
                              >
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate"
                                >
                                  {attachment.name}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                      rows={3}
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-1">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSubmitting}
                        className={`p-2 rounded-full ${
                          !newMessage.trim()
                            ? 'text-gray-400'
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {isSubmitting ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <ArrowUp className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Press Enter to send, Shift+Enter for a new line
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                      >
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'urgent')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                      >
                        Mark as Urgent
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Ticket Modal */}
        <CreateTicketModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createNewTicket}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal 
          ticket={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onDelete={deleteTicket}
        />

        {/* Analytics Modal */}
        <AnalyticsModal 
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
        />

        {/* Preview Ticket Modal */}
        {previewTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Ticket Preview</h2>
                <button onClick={() => setPreviewTicket(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Subject</h3>
                  <p>{previewTicket.subject}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">User</h3>
                  <p>{previewTicket.userName} ({previewTicket.userEmail})</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Status</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(previewTicket.status)}`}>
                      {previewTicket.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Priority</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(previewTicket.priority)}`}>
                      {previewTicket.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Initial Message</h3>
                  <p className="bg-gray-50 p-3 rounded-lg">{previewTicket.messages[0].text}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Created: {formatDate(previewTicket.createdAt)}</div>
                    <div>Updated: {formatTimeAgo(previewTicket.updatedAt)}</div>
                    <div>Category: {previewTicket.category}</div>
                    <div>Assigned: {previewTicket.assignedTo || 'Unassigned'}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedTicket(previewTicket);
                    setPreviewTicket(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Ticket Modal */}
        {editingTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Ticket</h2>
                <button onClick={() => setEditingTicket(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    value={editingTicket.subject}
                    onChange={(e) => setEditingTicket({...editingTicket, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={editingTicket.status}
                      onChange={(e) => setEditingTicket({...editingTicket, status: e.target.value as any})}
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={editingTicket.priority}
                      onChange={(e) => setEditingTicket({...editingTicket, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={editingTicket.category}
                    onChange={(e) => setEditingTicket({...editingTicket, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="property">Property</option>
                    <option value="consumer">Consumer</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={editingTicket.assignedTo || ''}
                    onChange={(e) => setEditingTicket({...editingTicket, assignedTo: e.target.value || undefined})}
                  >
                    <option value="">Unassigned</option>
                    <option value="Admin 1">Admin 1</option>
                    <option value="Admin 2">Admin 2</option>
                    <option value="Admin 3">Admin 3</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t flex gap-2">
                <button
                  onClick={() => setEditingTicket(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateTicket(editingTicket.id, {
                      subject: editingTicket.subject,
                      status: editingTicket.status,
                      priority: editingTicket.priority,
                      category: editingTicket.category,
                      assignedTo: editingTicket.assignedTo
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketAdminPortal;