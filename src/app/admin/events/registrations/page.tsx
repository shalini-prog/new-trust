'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

// Icons
import { 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  MapPin,
  Clock,
  X,
  Download,
  Mail,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Utensils,
  Accessibility
} from 'lucide-react';

// Types
interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  specialNeeds?: string;
  dietaryRestrictions?: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus?: 'paid' | 'pending' | 'free';
  amount?: number;
}

// Mock API functions - replace with actual API calls
const fetchRegistrations = async (): Promise<Registration[]> => {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          eventId: 'evt1',
          eventTitle: 'Summer Music Festival 2025',
          eventDate: '2025-07-15T18:00:00Z',
          eventLocation: 'Central Park, New York',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          participants: 2,
          specialNeeds: 'Wheelchair accessible seating',
          dietaryRestrictions: 'Vegetarian',
          registrationDate: '2025-06-01T10:30:00Z',
          status: 'confirmed',
          paymentStatus: 'paid',
          amount: 50.00
        },
        {
          id: '2',
          eventId: 'evt2',
          eventTitle: 'Tech Conference 2025',
          eventDate: '2025-08-20T09:00:00Z',
          eventLocation: 'Convention Center, San Francisco',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1-555-0456',
          participants: 1,
          specialNeeds: '',
          dietaryRestrictions: 'Gluten-free',
          registrationDate: '2025-05-28T14:15:00Z',
          status: 'confirmed',
          paymentStatus: 'free'
        },
        {
          id: '3',
          eventId: 'evt3',
          eventTitle: 'Cooking Workshop',
          eventDate: '2025-07-05T14:00:00Z',
          eventLocation: 'Culinary Institute, Chicago',
          name: 'Mike Johnson',
          email: 'mike.j@email.com',
          phone: '+1-555-0789',
          participants: 1,
          specialNeeds: '',
          dietaryRestrictions: 'No allergies',
          registrationDate: '2025-06-10T09:45:00Z',
          status: 'pending',
          paymentStatus: 'pending',
          amount: 75.00
        },
        {
          id: '4',
          eventId: 'evt1',
          eventTitle: 'Summer Music Festival 2025',
          eventDate: '2025-07-15T18:00:00Z',
          eventLocation: 'Central Park, New York',
          name: 'Sarah Wilson',
          email: 'sarah.w@email.com',
          phone: '+1-555-0321',
          participants: 3,
          specialNeeds: 'None',
          dietaryRestrictions: 'Vegan',
          registrationDate: '2025-06-05T16:20:00Z',
          status: 'confirmed',
          paymentStatus: 'paid',
          amount: 75.00
        },
        {
          id: '5',
          eventId: 'evt4',
          eventTitle: 'Art Gallery Opening',
          eventDate: '2025-06-30T19:00:00Z',
          eventLocation: 'Modern Art Museum, Los Angeles',
          name: 'David Brown',
          email: 'david.brown@email.com',
          phone: '+1-555-0654',
          participants: 2,
          specialNeeds: '',
          dietaryRestrictions: '',
          registrationDate: '2025-06-15T11:30:00Z',
          status: 'cancelled',
          paymentStatus: 'free'
        }
      ]);
    }, 1000);
  });
};

const exportRegistrations = async (registrations: Registration[]) => {
  // Create CSV content
  const csvContent = [
    // Header
    'ID,Event,Name,Email,Phone,Participants,Registration Date,Status,Payment Status,Amount,Special Needs,Dietary Restrictions',
    // Data rows
    ...registrations.map(reg => [
      reg.id,
      `"${reg.eventTitle}"`,
      `"${reg.name}"`,
      reg.email,
      reg.phone,
      reg.participants,
      new Date(reg.registrationDate).toLocaleDateString(),
      reg.status,
      reg.paymentStatus || 'N/A',
      reg.amount ? `$${reg.amount.toFixed(2)}` : 'Free',
      `"${reg.specialNeeds || 'None'}"`,
      `"${reg.dietaryRestrictions || 'None'}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Registration Detail Modal Component
const RegistrationDetailModal = ({ registration, onClose }: { 
  registration: Registration; 
  onClose: () => void; 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'free': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Event Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="mr-2 text-purple-600" size={20} />
              Event Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-medium text-gray-700">Event:</span>
                <span className="ml-2 text-gray-900">{registration.eventTitle}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 text-gray-500" size={16} />
                <span className="font-medium text-gray-700">Date:</span>
                <span className="ml-2 text-gray-900">{formatDate(registration.eventDate)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 text-gray-500" size={16} />
                <span className="font-medium text-gray-700">Location:</span>
                <span className="ml-2 text-gray-900">{registration.eventLocation}</span>
              </div>
            </div>
          </div>

          {/* Registrant Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Registrant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <User className="mr-2 text-gray-500" size={16} />
                    <span className="text-gray-900">{registration.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    <span className="text-gray-900">{registration.email}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    <span className="text-gray-900">{registration.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <Users className="mr-2 text-gray-500" size={16} />
                    <span className="text-gray-900">{registration.participants}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(registration.specialNeeds || registration.dietaryRestrictions) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="mr-2 text-green-600" size={20} />
                Additional Information
              </h3>
              <div className="space-y-3">
                {registration.specialNeeds && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Accessibility className="mr-1" size={16} />
                      Special Needs
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-900">{registration.specialNeeds}</span>
                    </div>
                  </div>
                )}
                {registration.dietaryRestrictions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Utensils className="mr-1" size={16} />
                      Dietary Restrictions
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-900">{registration.dietaryRestrictions}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Registration Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CheckCircle className="mr-2 text-purple-600" size={20} />
              Registration Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(registration.paymentStatus || 'free')}`}>
                  {registration.paymentStatus === 'free' ? 'Free Event' : 
                   registration.paymentStatus === 'paid' ? 'Paid' : 
                   registration.paymentStatus === 'pending' ? 'Payment Pending' : 'N/A'}
                </span>
              </div>
            </div>
            {registration.amount && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="text-2xl font-bold text-green-600">
                  ${registration.amount.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Registration Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Clock className="mr-2 text-orange-600" size={20} />
              Registration Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Registration Date:</span>
                <span className="text-gray-900">{formatDate(registration.registrationDate)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-700">Registration ID:</span>
                <span className="text-gray-900 font-mono text-sm">{registration.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                const mailtoLink = `mailto:${registration.email}?subject=Regarding your registration for ${registration.eventTitle}`;
                window.open(mailtoLink);
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Mail size={16} />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Admin Registrations Page
export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState<string | null>(null);

  const tableRef = useRef(null);

  // Fetch Registrations
  useEffect(() => {
    const getRegistrations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRegistrations();
        setRegistrations(data);
        setFilteredRegistrations(data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        setError('Failed to load registrations. Please try again.');
        setRegistrations([]);
        setFilteredRegistrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    getRegistrations();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll('.registration-row-animate');
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.4,
              ease: 'power2.out'
            }
          );
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, filteredRegistrations]);

  // Filter and Search Registrations
  useEffect(() => {
    let filtered = [...registrations];

    // Status Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    // Event Filter
    if (eventFilter !== 'all') {
      filtered = filtered.filter(reg => reg.eventId === eventFilter);
    }

    // Search Filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.eventTitle.toLowerCase().includes(searchLower) ||
        reg.phone.includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'eventTitle':
          aVal = a.eventTitle.toLowerCase();
          bVal = b.eventTitle.toLowerCase();
          break;
        case 'registrationDate':
          aVal = new Date(a.registrationDate);
          bVal = new Date(b.registrationDate);
          break;
        case 'eventDate':
          aVal = new Date(a.eventDate);
          bVal = new Date(b.eventDate);
          break;
        case 'participants':
          aVal = a.participants;
          bVal = b.participants;
          break;
        default:
          aVal = a[sortBy] || '';
          bVal = b[sortBy] || '';
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRegistrations(filtered);
  }, [registrations, statusFilter, eventFilter, searchTerm, sortBy, sortOrder]);

  // Event Handlers
  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    exportRegistrations(filteredRegistrations);
  };

  // Helper Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueEvents = () => {
    const events = [...new Set(registrations.map(reg => ({ id: reg.eventId, title: reg.eventTitle })))];
    return events.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
  };

  const getStats = () => {
    const total = registrations.length;
    const confirmed = registrations.filter(r => r.status === 'confirmed').length;
    const pending = registrations.filter(r => r.status === 'pending').length;
    const totalParticipants = registrations.reduce((sum, r) => sum + r.participants, 0);
    
    return { total, confirmed, pending, totalParticipants };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
              <p className="text-gray-600 mt-1">View and manage event registrations</p>
            </div>
            <motion.button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={filteredRegistrations.length === 0}
            >
              <Download size={20} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="text-purple-600" size={32} />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Participants</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalParticipants}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, event..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center space-x-4">
              {/* Status Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Event Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                {getUniqueEvents().map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="registrationDate">Registration Date</option>
                <option value="name">Name</option>
                <option value="eventTitle">Event</option>
                <option value="eventDate">Event Date</option>
                <option value="participants">Participants</option>
              </select>

                            <button
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No registrations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <motion.tr 
                      key={registration.id}
                      className="registration-row-animate hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{registration.eventTitle}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {registration.eventLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(registration.eventDate)}</div>
                        <div className="text-sm text-gray-500">{formatDate(registration.registrationDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users size={16} className="mr-1 text-gray-400" />
                          {registration.participants}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.paymentStatus === 'paid' ? (
                          <span className="text-green-600 font-medium">Paid ${registration.amount?.toFixed(2)}</span>
                        ) : registration.paymentStatus === 'pending' ? (
                          <span className="text-yellow-600 font-medium">Pending</span>
                        ) : (
                          <span className="text-blue-600 font-medium">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewRegistration(registration)}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registration Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedRegistration && (
          <RegistrationDetailModal
            registration={selectedRegistration}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}