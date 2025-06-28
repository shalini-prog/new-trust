'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  BookOpen, 
  Award, 
  MessageSquare, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react';

interface VolunteerStats {
  totalVolunteers: number;
  activeVolunteers: number;
  pendingApplications: number;
  totalHours: number;
  newThisMonth: number;
  retentionRate: number;
}

interface VolunteerApplication {
  _id: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  experience?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  appliedDate?: string;
}

export default function AdminVolunteerPage() {
  const [stats, setStats] = useState<VolunteerStats>({
    totalVolunteers: 245,
    activeVolunteers: 198,
    pendingApplications: 12,
    totalHours: 8750,
    newThisMonth: 15,
    retentionRate: 87
  });

  const [applications, setApplications] = useState<VolunteerApplication[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/vvolun/pending')
      .then(res => {
        console.log('API Response:', res.data); // Debug log
        console.log('First item structure:', res.data[0]); // Debug first item
        setApplications(res.data);
      })
      .catch(err => console.error('Error fetching pending applications:', err));
  }, []);

  const handleApproveApplication = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/vvolun/${id}/approve`);
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'approved' } : app));
    } catch (error) {
      console.error('Approval failed', error);
    }
  };

  const handleRejectApplication = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/vvolun/${id}/reject`);
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
    } catch (error) {
      console.error('Rejection failed', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get display name from various possible fields
  const getDisplayName = (application: VolunteerApplication) => {
    if (application.name) return application.name;
    if (application.firstName && application.lastName) {
      return `${application.firstName} ${application.lastName}`;
    }
    if (application.firstName) return application.firstName;
    if (application.email) {
      // Extract name from email and format it nicely
      const emailName = application.email.split('@')[0];
      return emailName.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Unknown';
  };

  // Get the best available date
  const getApplicationDate = (application: VolunteerApplication) => {
    return application.appliedDate || application.createdAt || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Management</h1>
        <p className="text-gray-600">Manage volunteers, applications, and volunteer programs</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeVolunteers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-yellow-600">{applications.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalHours.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.newThisMonth}</p>
            </div>
            <UserPlus className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.retentionRate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/volunteer/applications" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <UserPlus className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Applications</h3>
              <p className="text-sm text-gray-600">Review new volunteer applications</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/volunteer/schedules" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Calendar className="h-10 w-10 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Schedules</h3>
              <p className="text-sm text-gray-600">Manage volunteer schedules</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/volunteer/training" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Training</h3>
              <p className="text-sm text-gray-600">Manage training programs</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/volunteer/reports" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-10 w-10 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Reports & Analytics</h3>
              <p className="text-sm text-gray-600">View volunteer engagement metrics</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Pending Applications */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Applications ({applications.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No pending applications found
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName(application)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.email}</div>
                      <div className="text-sm text-gray-500">{application.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(getApplicationDate(application))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveApplication(application._id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectApplication(application._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Reject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/volunteer/rewards" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Award className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Rewards & Recognition</h3>
              <p className="text-sm text-gray-600">Manage volunteer rewards program</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/volunteer/communications" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Communications</h3>
              <p className="text-sm text-gray-600">Send messages to volunteers</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/volunteer/management" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Volunteer Management</h3>
              <p className="text-sm text-gray-600">Manage existing volunteers</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}