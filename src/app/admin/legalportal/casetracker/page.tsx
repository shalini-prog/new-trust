'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Search,
  Shield,
  Settings,
  BarChart2,
  Bell,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  status: 'pending' | 'active' | 'closed' | 'archived';
  petitioner: string;
  respondent: string;
  judge: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'clerk' | 'user';
  lastActive: string;
  casesAssigned: number;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export default function CaseTrackerAdmin() {
  const [activeTab, setActiveTab] = useState<'cases' | 'users' | 'settings' | 'analytics'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<Case | User | null>(null);

  // Mock data
  const mockCases: Case[] = [
    {
      id: '1',
      caseNumber: 'CC/123/2024',
      title: 'Property Dispute - ABC vs XYZ',
      court: 'District Court, Delhi',
      status: 'active',
      petitioner: 'ABC Kumar',
      respondent: 'XYZ Singh',
      judge: 'Hon\'ble Justice Sharma',
      createdAt: '2024-01-10',
      updatedAt: '2024-02-15'
    },
    {
      id: '2',
      caseNumber: 'CRL/456/2024',
      title: 'Consumer Complaint - Defective Product',
      court: 'Consumer Forum, Mumbai',
      status: 'pending',
      petitioner: 'Priya Patel',
      respondent: 'TechCorp Ltd',
      judge: 'Hon\'ble Member Gupta',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      caseNumber: 'FAM/789/2024',
      title: 'Matrimonial Dispute - Custody Rights',
      court: 'Family Court, Bangalore',
      status: 'closed',
      petitioner: 'Raj Mehta',
      respondent: 'Sita Mehta',
      judge: 'Hon\'ble Justice Reddy',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-25'
    },
    {
      id: '4',
      caseNumber: 'WP/101/2024',
      title: 'Public Interest Litigation - Environmental',
      court: 'High Court, Delhi',
      status: 'active',
      petitioner: 'Green Earth Foundation',
      respondent: 'State Pollution Board',
      judge: 'Hon\'ble Justice Verma',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-10'
    },
    {
      id: '5',
      caseNumber: 'ARB/202/2024',
      title: 'Commercial Arbitration - Contract Dispute',
      court: 'Arbitration Tribunal, Mumbai',
      status: 'archived',
      petitioner: 'BuildCorp Pvt Ltd',
      respondent: 'Steel Suppliers Inc',
      judge: 'Arbitrator Kapoor',
      createdAt: '2023-12-15',
      updatedAt: '2024-01-30'
    }
  ];

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@legalservice.gov',
      role: 'admin',
      lastActive: '2024-02-15 14:30',
      casesAssigned: 0
    },
    {
      id: '2',
      name: 'Advocate Sharma',
      email: 'sharma@lawfirm.com',
      role: 'lawyer',
      lastActive: '2024-02-15 12:45',
      casesAssigned: 3
    },
    {
      id: '3',
      name: 'Legal Clerk',
      email: 'clerk@legalservice.gov',
      role: 'clerk',
      lastActive: '2024-02-14 16:20',
      casesAssigned: 12
    },
    {
      id: '4',
      name: 'Citizen User',
      email: 'user@example.com',
      role: 'user',
      lastActive: '2024-02-13 10:15',
      casesAssigned: 1
    }
  ];

  const mockActivityLogs: ActivityLog[] = [
    {
      id: '1',
      user: 'Admin User',
      action: 'Created new case CC/123/2024',
      timestamp: '2024-02-15 14:30',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      user: 'Advocate Sharma',
      action: 'Updated case documents for CRL/456/2024',
      timestamp: '2024-02-15 12:45',
      ipAddress: '203.145.67.89'
    },
    {
      id: '3',
      user: 'Legal Clerk',
      action: 'Assigned new case to Advocate Sharma',
      timestamp: '2024-02-14 16:20',
      ipAddress: '192.168.1.2'
    },
    {
      id: '4',
      user: 'Citizen User',
      action: 'Viewed case status for FAM/789/2024',
      timestamp: '2024-02-13 10:15',
      ipAddress: '117.240.45.67'
    }
  ];

  const filteredCases = mockCases.filter(caseItem => {
    const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.petitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.respondent.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = mockUsers.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectCase = (caseId: string) => {
    if (selectedCases.includes(caseId)) {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    } else {
      setSelectedCases([...selectedCases, caseId]);
    }
  };

  const handleSelectAllCases = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(caseItem => caseItem.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'closed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'lawyer':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'clerk':
        return `${baseClasses} bg-teal-100 text-teal-800`;
      case 'user':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">CaseTracker Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-1 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">A</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('cases')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Cases
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {showFilters ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentEditItem(null);
                      setShowCaseModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Case
                  </button>
                </div>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Court</label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled
                      >
                        <option>All Courts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled
                      >
                        <option>All Time</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                      onChange={handleSelectAllCases}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {selectedCases.length > 0 ? `${selectedCases.length} selected` : `${filteredCases.length} cases`}
                    </span>
                  </div>
                  {selectedCases.length > 0 && (
                    <div className="flex space-x-3">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Download className="mr-1 h-3 w-3" />
                        Export
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Court
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCases.length > 0 ? (
                        filteredCases.map((caseItem) => (
                          <tr key={caseItem.id} className={selectedCases.includes(caseItem.id) ? 'bg-indigo-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  checked={selectedCases.includes(caseItem.id)}
                                  onChange={() => handleSelectCase(caseItem.id)}
                                />
                                <span className="ml-2 font-medium text-gray-900">{caseItem.caseNumber}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{caseItem.title}</div>
                              <div className="text-sm text-gray-500">
                                {caseItem.petitioner} vs {caseItem.respondent}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {caseItem.court}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(caseItem.status)}>
                                {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {caseItem.updatedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  setCurrentEditItem(caseItem);
                                  setShowCaseModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                            No cases found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setCurrentEditItem(null);
                    setShowUserModal(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cases
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getRoleBadge(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.casesAssigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setCurrentEditItem(user);
                              setShowUserModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Case Status Distribution</h3>
                  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Pie Chart Placeholder</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">New Cases Over Time</h3>
                  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Line Chart Placeholder</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
                  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Bar Chart Placeholder</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    {mockActivityLogs.map((log) => (
                      <div key={log.id} className="border-l-4 border-indigo-200 pl-4 py-2">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{log.user}</p>
                          <p className="text-sm text-gray-500">{log.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600">{log.action}</p>
                        <p className="text-xs text-gray-400 mt-1">IP: {log.ipAddress}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">System Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Configure CaseTracker system preferences
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Case Management</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="auto-assign"
                              name="auto-assign"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="auto-assign" className="font-medium text-gray-700">
                              Auto-assign new cases
                            </label>
                            <p className="text-gray-500">
                              Automatically assign new cases to available lawyers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notifications"
                              name="notifications"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-gray-700">
                              Email notifications
                            </label>
                            <p className="text-gray-500">
                              Send email notifications for case updates
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">User Permissions</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="user-registration"
                              name="user-registration"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="user-registration" className="font-medium text-gray-700">
                              Allow user registration
                            </label>
                            <p className="text-gray-500">
                              Let citizens create their own accounts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="self-service"
                              name="self-service"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="self-service" className="font-medium text-gray-700">
                              Self-service case creation
                            </label>
                            <p className="text-gray-500">
                              Allow users to create their own cases
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Data Management</h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                            Backup Frequency
                          </label>
                          <select
                            id="backup-frequency"
                            name="backup-frequency"
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                        <div className="flex gap-4">
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 text-right">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentEditItem ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={currentEditItem ? (currentEditItem as User).name : ''}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={currentEditItem ? (currentEditItem as User).email : ''}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={currentEditItem ? (currentEditItem as User).role : 'user'}
                  >
                    <option value="admin">Administrator</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="clerk">Clerk</option>
                    <option value="user">User</option>
                  </select>
                </div>
                {!currentEditItem && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Generate or set password"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentEditItem ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Case Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentEditItem ? 'Edit Case' : 'Add New Case'}
                </h3>
                <button
                  onClick={() => setShowCaseModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Case Number
                    </label>
                    <input
                      type="text"
                      id="caseNumber"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).caseNumber : ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-1">
                      Court
                    </label>
                    <input
                      type="text"
                      id="court"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).court : ''}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Case Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={currentEditItem ? (currentEditItem as Case).title : ''}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="petitioner" className="block text-sm font-medium text-gray-700 mb-1">
                      Petitioner
                    </label>
                    <input
                      type="text"
                      id="petitioner"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).petitioner : ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="respondent" className="block text-sm font-medium text-gray-700 mb-1">
                      Respondent
                    </label>
                    <input
                      type="text"
                      id="respondent"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).respondent : ''}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="judge" className="block text-sm font-medium text-gray-700 mb-1">
                      Judge/Magistrate
                    </label>
                    <input
                      type="text"
                      id="judge"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).judge : ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentEditItem ? (currentEditItem as Case).status : 'pending'}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Case Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue=""
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Documents
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowCaseModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCaseModal(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentEditItem ? 'Update Case' : 'Create Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}