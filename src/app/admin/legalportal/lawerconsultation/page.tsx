'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Mail, 
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User,
  Upload,
  Image
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  rating: number;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  languages: string[];
  totalConsultations: number;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
}

interface Consultation {
  id: string;
  clientName: string;
  clientEmail: string;
  lawyerId: string;
  lawyerName: string;
  type: 'chat' | 'email' | 'video';
  category: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  duration?: number;
  rating?: number;
  feedback?: string;
}

interface AdminStats {
  totalLawyers: number;
  activeLawyers: number;
  totalConsultations: number;
  pendingConsultations: number;
  completedToday: number;
  averageRating: number;
  revenue: number;
  emergencyRequests: number;
}

export default function LawyerConsultationAdmin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'lawyers' | 'consultations' | 'appointments' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showAddLawyer, setShowAddLawyer] = useState(false);
  const [consultationFilter, setConsultationFilter] = useState('all');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // New Lawyer Form State
  const [newLawyerForm, setNewLawyerForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 0,
    specializations: [] as string[],
    languages: [] as string[],
    status: 'active' as 'active' | 'inactive',
    isVerified: true,
    avatar: '/api/placeholder/64/64'
  });

  const [stats, setStats] = useState<AdminStats>({
    totalLawyers: 45,
    activeLawyers: 38,
    totalConsultations: 1247,
    pendingConsultations: 23,
    completedToday: 67,
    averageRating: 4.7,
    revenue: 125000,
    emergencyRequests: 3
  });

  const [lawyers, setLawyers] = useState<Lawyer[]>([
    {
      id: '1',
      name: 'Adv. Priya Sharma',
      email: 'priya.sharma@legal.com',
      phone: '+91 98765 43210',
      specialization: ['Family Law', 'Divorce', 'Child Custody'],
      experience: 8,
      rating: 4.8,
      avatar: '/api/placeholder/64/64',
      isOnline: true,
      isVerified: true,
      languages: ['Hindi', 'English'],
      totalConsultations: 234,
      status: 'active',
      joinDate: '2023-06-15',
      lastActive: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Adv. Rajesh Kumar',
      email: 'rajesh.kumar@legal.com',
      phone: '+91 87654 32109',
      specialization: ['Property Law', 'Real Estate', 'Civil Disputes'],
      experience: 12,
      rating: 4.9,
      avatar: '/api/placeholder/64/64',
      isOnline: true,
      isVerified: true,
      languages: ['Hindi', 'English', 'Punjabi'],
      totalConsultations: 456,
      status: 'active',
      joinDate: '2023-04-20',
      lastActive: '2024-01-15 15:45'
    },
    {
      id: '3',
      name: 'Adv. Meera Patel',
      email: 'meera.patel@legal.com',
      phone: '+91 76543 21098',
      specialization: ['Consumer Rights', 'Corporate Law', 'Contract Disputes'],
      experience: 6,
      rating: 4.7,
      avatar: '/api/placeholder/64/64',
      isOnline: false,
      isVerified: true,
      languages: ['English', 'Gujarati'],
      totalConsultations: 189,
      status: 'active',
      joinDate: '2023-08-10',
      lastActive: '2024-01-14 18:20'
    },
    {
      id: '4',
      name: 'Adv. Amit Singh',
      email: 'amit.singh@legal.com',
      phone: '+91 65432 10987',
      specialization: ['Criminal Law', 'Cyber Crime'],
      experience: 10,
      rating: 4.6,
      avatar: '/api/placeholder/64/64',
      isOnline: false,
      isVerified: false,
      languages: ['Hindi', 'English'],
      totalConsultations: 78,
      status: 'inactive',
      joinDate: '2024-01-05',
      lastActive: '2024-01-13 12:15'
    }
  ]);

  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      clientName: 'Rahul Verma',
      clientEmail: 'rahul.verma@email.com',
      lawyerId: '1',
      lawyerName: 'Adv. Priya Sharma',
      type: 'video',
      category: 'Family Law',
      status: 'active',
      priority: 'normal',
      createdAt: '2024-01-15 14:00',
      scheduledAt: '2024-01-15 15:00',
      rating: 5,
      feedback: 'Very helpful consultation'
    },
    {
      id: '2',
      clientName: 'Sunita Devi',
      clientEmail: 'sunita.devi@email.com',
      lawyerId: '2',
      lawyerName: 'Adv. Rajesh Kumar',
      type: 'chat',
      category: 'Property Law',
      status: 'pending',
      priority: 'urgent',
      createdAt: '2024-01-15 13:30'
    },
    {
      id: '3',
      clientName: 'Anonymous',
      clientEmail: 'help@emergency.com',
      lawyerId: '1',
      lawyerName: 'Adv. Priya Sharma',
      type: 'chat',
      category: 'Domestic Violence',
      status: 'pending',
      priority: 'emergency',
      createdAt: '2024-01-15 13:00'
    }
  ]);

  const filteredConsultations = consultations.filter(consultation => {
    const matchesFilter = consultationFilter === 'all' || consultation.status === consultationFilter;
    const matchesSearch = consultation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || lawyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleLawyerStatus = (id: string) => {
    setLawyers(prev => prev.map(lawyer => 
      lawyer.id === id 
        ? { ...lawyer, status: lawyer.status === 'active' ? 'inactive' : 'active' }
        : lawyer
    ));
  };

  // Form handling functions
  const handleFormChange = (field: keyof typeof newLawyerForm, value: any) => {
    setNewLawyerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    setNewLawyerForm(prev => ({
      ...prev,
      specializations: checked 
        ? [...prev.specializations, spec]
        : prev.specializations.filter(s => s !== spec)
    }));
  };

  const handleLanguageChange = (lang: string, checked: boolean) => {
    setNewLawyerForm(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, lang]
        : prev.languages.filter(l => l !== lang)
    }));
  };

  const handleAddLawyer = () => {
    const newLawyer = {
      id: (lawyers.length + 1).toString(),
      name: newLawyerForm.name,
      email: newLawyerForm.email,
      phone: newLawyerForm.phone,
      specialization: newLawyerForm.specializations,
      experience: newLawyerForm.experience,
      rating: 0,
      avatar: newLawyerForm.avatar,
      isOnline: false,
      isVerified: newLawyerForm.isVerified,
      languages: newLawyerForm.languages,
      totalConsultations: 0,
      status: newLawyerForm.status,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString()
    };

    setLawyers(prev => [...prev, newLawyer]);
    setStats(prev => ({
      ...prev,
      totalLawyers: prev.totalLawyers + 1,
      activeLawyers: newLawyer.status === 'active' ? prev.activeLawyers + 1 : prev.activeLawyers
    }));
    
    // Reset form
    setNewLawyerForm({
      name: '',
      email: '',
      phone: '',
      experience: 0,
      specializations: [],
      languages: [],
      status: 'active',
      isVerified: true,
      avatar: '/api/placeholder/64/64'
    });
    
    setShowAddLawyer(false);
  };

  // Update consultation status function
  const updateConsultationStatus = (id: string, newStatus: string) => {
    setConsultations(prev => prev.map(consultation => 
      consultation.id === id 
        ? { ...consultation, status: newStatus as any }
        : consultation
    ));
  };

  // Delete consultation function
  const deleteConsultation = (id: string) => {
    setConsultations(prev => prev.filter(consultation => consultation.id !== id));
  };

  // Export data function
  const exportData = (type: 'consultations' | 'lawyers') => {
    const data = type === 'consultations' ? consultations : lawyers;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        if (editingLawyer) {
          setEditingLawyer({ ...editingLawyer, avatar: result });
        } else {
          setNewLawyerForm({ ...newLawyerForm, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Edit lawyer function
  const handleEditLawyer = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setPreviewImage(lawyer.avatar);
  };

  // Save edited lawyer
  const saveEditedLawyer = () => {
    if (editingLawyer) {
      setLawyers(prev => prev.map(l => 
        l.id === editingLawyer.id ? editingLawyer : l
      ));
      setEditingLawyer(null);
      setSelectedLawyer(null);
    }
  };

  // Edit consultation function
  const handleEditConsultation = (consultation: Consultation) => {
    setEditingConsultation(consultation);
  };

  // Save edited consultation
  const saveEditedConsultation = () => {
    if (editingConsultation) {
      setConsultations(prev => prev.map(c => 
        c.id === editingConsultation.id ? editingConsultation : c
      ));
      setEditingConsultation(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lawyer Consultation Management</h1>
            <p className="text-gray-600">Manage lawyers, consultations, and legal services</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'lawyers', label: 'Lawyers', icon: <Users className="w-4 h-4" /> },
            { id: 'consultations', label: 'Consultations', icon: <MessageCircle className="w-4 h-4" /> },
            { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalLawyers}</div>
              <div className="text-gray-600">Total Lawyers</div>
              <div className="text-sm text-green-600 mt-2">{stats.activeLawyers} active</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalConsultations}</div>
              <div className="text-gray-600">Total Consultations</div>
              <div className="text-sm text-blue-600 mt-2">{stats.completedToday} today</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingConsultations}</div>
              <div className="text-gray-600">Pending Requests</div>
              <div className="text-sm text-red-600 mt-2">{stats.emergencyRequests} emergency</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating}</div>
              <div className="text-gray-600">Average Rating</div>
              <div className="text-sm text-green-600 mt-2">+0.2 this month</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {consultations.slice(0, 5).map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          consultation.type === 'video' ? 'bg-green-100' :
                          consultation.type === 'chat' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {consultation.type === 'video' && <Video className="w-4 h-4 text-green-600" />}
                          {consultation.type === 'chat' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                          {consultation.type === 'email' && <Mail className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{consultation.clientName}</div>
                          <div className="text-sm text-gray-600">{consultation.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{consultation.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Lawyers</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {lawyers.slice(0, 5).map((lawyer) => (
                    <div key={lawyer.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={lawyer.avatar}
                            alt={lawyer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {lawyer.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{lawyer.name}</div>
                          <div className="text-sm text-gray-600">{lawyer.totalConsultations} consultations</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{lawyer.rating}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lawyer.status)}`}>
                          {lawyer.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lawyers Tab */}
      {activeTab === 'lawyers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddLawyer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Lawyer
            </button>
          </div>

          {/* Lawyers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={lawyer.avatar}
                        alt={lawyer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {lawyer.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lawyer.name}</h3>
                      <p className="text-sm text-gray-600">{lawyer.experience} years exp.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lawyer.isVerified && (
                      <UserCheck className="w-4 h-4 text-green-500" />
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {lawyer.specialization.slice(0, 2).map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                      {lawyer.specialization.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{lawyer.specialization.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{lawyer.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultations:</span>
                    <span className="font-medium">{lawyer.totalConsultations}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lawyer.status)}`}>
                      {lawyer.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLawyer(lawyer)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditLawyer(lawyer)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleLawyerStatus(lawyer.id)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      lawyer.status === 'active' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {lawyer.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Consultations Tab */}
      {activeTab === 'consultations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Active Consultations</h3>
                <div className="flex gap-2">
                  <select
                    value={consultationFilter}
                    onChange={(e) => setConsultationFilter(e.target.value)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm border-0"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => exportData('consultations')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lawyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{consultation.clientName}</div>
                          <div className="text-sm text-gray-500">{consultation.clientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.lawyerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {consultation.type === 'video' && <Video className="w-4 h-4 text-green-600" />}
                          {consultation.type === 'chat' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                          {consultation.type === 'email' && <Mail className="w-4 h-4 text-purple-600" />}
                          <span className="text-sm text-gray-900 capitalize">{consultation.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{consultation.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(consultation.priority)}`}>
                          {consultation.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={consultation.status}
                          onChange={(e) => updateConsultationStatus(consultation.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(consultation.status)}`}
                        >
                          <option value="pending">pending</option>
                          <option value="active">active</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{consultation.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditConsultation(consultation)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteConsultation(consultation.id)}
                            className="p-1 text-red-600 hover:text-red-800"
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
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredConsultations.length)}</span> of{' '}
                <span className="font-medium">{filteredConsultations.length}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Appointments</h3>
                <div className="flex gap-2">
                  <select
                    value={appointmentFilter}
                    onChange={(e) => setAppointmentFilter(e.target.value)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm border-0"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => exportData('consultations')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lawyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.filter(c => c.type === 'video' && c.scheduledAt).map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{consultation.clientName}</div>
                          <div className="text-sm text-gray-500">{consultation.clientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.lawyerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.scheduledAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{consultation.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditConsultation(consultation)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">24</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lawyer Performance</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lawyer Detail Modal */}
      <AnimatePresence>
        {selectedLawyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Lawyer Details</h3>
                  <button
                    onClick={() => setSelectedLawyer(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={selectedLawyer.avatar}
                        alt={selectedLawyer.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                      />
                      {selectedLawyer.isOnline ? (
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      ) : (
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold">{selectedLawyer.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedLawyer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedLawyer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{selectedLawyer.experience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedLawyer.status)}`}>
                          {selectedLawyer.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLawyer.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLawyer.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Consultations</p>
                        <p className="font-medium text-2xl">{selectedLawyer.totalConsultations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Active</p>
                        <p className="font-medium">{selectedLawyer.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleEditLawyer(selectedLawyer)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Lawyer Modal */}
      <AnimatePresence>
        {editingLawyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Edit Lawyer</h3>
                  <button
                    onClick={() => setEditingLawyer(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editingLawyer.name}
                        onChange={(e) => setEditingLawyer({...editingLawyer, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editingLawyer.email}
                        onChange={(e) => setEditingLawyer({...editingLawyer, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editingLawyer.phone}
                        onChange={(e) => setEditingLawyer({...editingLawyer, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                      <input
                        type="number"
                        value={editingLawyer.experience}
                        onChange={(e) => setEditingLawyer({...editingLawyer, experience: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter years of experience"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Family Law', 'Property Law', 'Criminal Law', 'Corporate Law', 'Consumer Rights'].map((spec) => (
                        <label key={spec} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={editingLawyer.specialization.includes(spec)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingLawyer({
                                  ...editingLawyer,
                                  specialization: [...editingLawyer.specialization, spec]
                                });
                              } else {
                                setEditingLawyer({
                                  ...editingLawyer,
                                  specialization: editingLawyer.specialization.filter(s => s !== spec)
                                });
                              }
                            }}
                            className="rounded text-blue-600" 
                          />
                          <span className="ml-2 text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Hindi', 'English', 'Punjabi', 'Gujarati', 'Bengali'].map((lang) => (
                        <label key={lang} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={editingLawyer.languages.includes(lang)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingLawyer({
                                  ...editingLawyer,
                                  languages: [...editingLawyer.languages, lang]
                                });
                              } else {
                                setEditingLawyer({
                                  ...editingLawyer,
                                  languages: editingLawyer.languages.filter(l => l !== lang)
                                });
                              }
                            }}
                            className="rounded text-blue-600" 
                          />
                          <span className="ml-2 text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={editingLawyer.status}
                        onChange={(e) => setEditingLawyer({...editingLawyer, status: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                      <select 
                        value={editingLawyer.isVerified.toString()}
                        onChange={(e) => setEditingLawyer({...editingLawyer, isVerified: e.target.value === 'true'})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={editingLawyer.avatar}
                          alt={editingLawyer.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setEditingLawyer(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEditedLawyer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Consultation Modal */}
      <AnimatePresence>
        {editingConsultation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Edit Consultation</h3>
                  <button
                    onClick={() => setEditingConsultation(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                      <input
                        type="text"
                        value={editingConsultation.clientName}
                        onChange={(e) => setEditingConsultation({...editingConsultation, clientName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                      <input
                        type="email"
                        value={editingConsultation.clientEmail}
                        onChange={(e) => setEditingConsultation({...editingConsultation, clientEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter client email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lawyer</label>
                      <select
                        value={editingConsultation.lawyerId}
                        onChange={(e) => {
                          const selectedLawyer = lawyers.find(l => l.id === e.target.value);
                          if (selectedLawyer) {
                            setEditingConsultation({
                              ...editingConsultation,
                              lawyerId: selectedLawyer.id,
                              lawyerName: selectedLawyer.name
                            });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {lawyers.map(lawyer => (
                          <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                      <select
                        value={editingConsultation.type}
                        onChange={(e) => setEditingConsultation({...editingConsultation, type: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="chat">Chat</option>
                        <option value="email">Email</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={editingConsultation.category}
                        onChange={(e) => setEditingConsultation({...editingConsultation, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter category"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={editingConsultation.priority}
                        onChange={(e) => setEditingConsultation({...editingConsultation, priority: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editingConsultation.status}
                        onChange={(e) => setEditingConsultation({...editingConsultation, status: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                      <input
                        type="datetime-local"
                        value={editingConsultation.createdAt}
                        onChange={(e) => setEditingConsultation({...editingConsultation, createdAt: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {editingConsultation.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled At</label>
                      <input
                        type="datetime-local"
                        value={editingConsultation.scheduledAt || ''}
                        onChange={(e) => setEditingConsultation({...editingConsultation, scheduledAt: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </form>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setEditingConsultation(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEditedConsultation}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Lawyer Modal */}
      <AnimatePresence>
        {showAddLawyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Add New Lawyer</h3>
                  <button
                    onClick={() => setShowAddLawyer(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={newLawyerForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={newLawyerForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={newLawyerForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lawyer's phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                      <input
                        type="number"
                        value={newLawyerForm.experience}
                        onChange={(e) => handleFormChange('experience', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter years of experience"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Family Law', 'Property Law', 'Criminal Law', 'Corporate Law', 'Consumer Rights'].map((spec) => (
                        <label key={spec} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={newLawyerForm.specializations.includes(spec)}
                            onChange={(e) => handleSpecializationChange(spec, e.target.checked)}
                            className="rounded text-blue-600" 
                          />
                          <span className="ml-2 text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Hindi', 'English', 'Punjabi', 'Gujarati', 'Bengali'].map((lang) => (
                        <label key={lang} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={newLawyerForm.languages.includes(lang)}
                            onChange={(e) => handleLanguageChange(lang, e.target.checked)}
                            className="rounded text-blue-600" 
                          />
                          <span className="ml-2 text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={newLawyerForm.status}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                      <select 
                        value={newLawyerForm.isVerified.toString()}
                        onChange={(e) => handleFormChange('isVerified', e.target.value === 'true')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={previewImage || newLawyerForm.avatar}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddLawyer(false);
                    setPreviewImage(null);
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddLawyer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Lawyer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}