'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Briefcase,
  ExternalLink,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Government' | 'Private' | 'Internship' | 'Remote';
  experience: string;
  salary: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  logo: string;
  status: 'Active' | 'Paused' | 'Expired' | 'Draft';
  applications: number;
  views: number;
  isUrgent: boolean;
  isNew: boolean;
}

export default function AdminJobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock job data with admin-specific fields
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Junior Software Developer',
      company: 'TCS',
      location: 'Bangalore',
      type: 'Private',
      experience: '0-2 years',
      salary: '₹3-5 LPA',
      postedDate: '2 hours ago',
      deadline: '15 days left',
      description: 'Looking for fresh graduates with programming skills in Java, Python, or JavaScript.',
      requirements: ['BE/BTech in CSE/IT', 'Good programming skills', 'Problem-solving abilities'],
      logo: '/api/placeholder/60/60',
      status: 'Active',
      applications: 245,
      views: 1200,
      isUrgent: true,
      isNew: true
    },
    {
      id: '2',
      title: 'SSC Constable',
      company: 'Delhi Police',
      location: 'Delhi',
      type: 'Government',
      experience: '0-1 years',
      salary: '₹2-3 LPA',
      postedDate: '1 day ago',
      deadline: '30 days left',
      description: 'Recruitment for Constable positions in Delhi Police. Physical fitness required.',
      requirements: ['12th Pass', 'Age 18-25 years', 'Physical fitness standards'],
      logo: '/api/placeholder/60/60',
      status: 'Active',
      applications: 892,
      views: 3450,
      isUrgent: false,
      isNew: true
    },
    {
      id: '3',
      title: 'Content Writer Intern',
      company: 'Digital Marketing Agency',
      location: 'Mumbai',
      type: 'Internship',
      experience: 'Fresher',
      salary: '₹15,000/month',
      postedDate: '3 days ago',
      deadline: '10 days left',
      description: 'Internship opportunity for content writing and digital marketing.',
      requirements: ['Graduate in any field', 'Good English writing skills', 'Creativity'],
      logo: '/api/placeholder/60/60',
      status: 'Paused',
      applications: 67,
      views: 234,
      isUrgent: false,
      isNew: false
    },
    {
      id: '4',
      title: 'Customer Support Executive',
      company: 'Amazon',
      location: 'Remote',
      type: 'Remote',
      experience: '0-1 years',
      salary: '₹2.5-4 LPA',
      postedDate: '5 days ago',
      deadline: '20 days left',
      description: 'Work from home opportunity for customer support role.',
      requirements: ['Graduate', 'Good communication skills', 'Computer literacy'],
      logo: '/api/placeholder/60/60',
      status: 'Active',
      applications: 156,
      views: 789,
      isUrgent: false,
      isNew: false
    },
    {
      id: '5',
      title: 'Bank Clerk',
      company: 'SBI',
      location: 'Chennai',
      type: 'Government',
      experience: 'Fresher',
      salary: '₹3-4 LPA',
      postedDate: '1 week ago',
      deadline: '25 days left',
      description: 'Clerk positions available in State Bank of India branches.',
      requirements: ['Graduate', 'Basic computer knowledge', 'Age 20-28 years'],
      logo: '/api/placeholder/60/60',
      status: 'Draft',
      applications: 0,
      views: 45,
      isUrgent: false,
      isNew: false
    },
    {
      id: '6',
      title: 'Sales Executive',
      company: 'Reliance Retail',
      location: 'Hyderabad',
      type: 'Private',
      experience: '0-2 years',
      salary: '₹2-3 LPA',
      postedDate: '2 weeks ago',
      deadline: '5 days left',
      description: 'Sales opportunities in retail sector with growth potential.',
      requirements: ['Any Graduate', 'Sales aptitude', 'Communication skills'],
      logo: '/api/placeholder/60/60',
      status: 'Expired',
      applications: 89,
      views: 456,
      isUrgent: true,
      isNew: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedType, selectedStatus, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    setFilteredJobs(filtered);
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAllJobs = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job.id));
    }
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const bulkUpdateStatus = (newStatus: Job['status']) => {
    setJobs(prev => prev.map(job => 
      selectedJobs.includes(job.id) ? { ...job, status: newStatus } : job
    ));
    setSelectedJobs([]);
  };

  const bulkDelete = () => {
    setJobs(prev => prev.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Paused': return <AlertCircle className="w-4 h-4" />;
      case 'Expired': return <XCircle className="w-4 h-4" />;
      case 'Draft': return <Edit className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const jobTypes = ['All', 'Government', 'Private', 'Internship', 'Remote'];
  const statusOptions = ['All', 'Active', 'Paused', 'Expired', 'Draft'];

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'Active').length,
    draft: jobs.filter(j => j.status === 'Draft').length,
    expired: jobs.filter(j => j.status === 'Expired').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Listings Management</h1>
          <p className="text-gray-600 mt-1">Manage job postings and track applications</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={() => setShowJobForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Jobs', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Jobs', value: stats.active, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Draft Jobs', value: stats.draft, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Expired Jobs', value: stats.expired, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.bg} p-6 rounded-xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* More Filters */}
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <motion.div
            className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm font-medium text-blue-700">
              {selectedJobs.length} job(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkUpdateStatus('Active')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => bulkUpdateStatus('Paused')}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Pause
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedJobs.length === filteredJobs.length}
              onChange={selectAllJobs}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            // Loading skeletons
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job.id)}
                    onChange={() => toggleJobSelection(job.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* Job Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={job.logo} 
                      alt={job.company}
                      className="w-12 h-12 rounded-lg border border-gray-200"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {job.title}
                        </h3>
                        {job.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Urgent
                          </span>
                        )}
                        {job.isNew && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{job.applications}</div>
                      <div>Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{job.views}</div>
                      <div>Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{job.deadline}</div>
                      <div>Deadline</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => console.log('View job', job.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Job"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingJob(job)}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      {/* Status Change Dropdown */}
                      <div className="relative group">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => updateJobStatus(job.id, 'Active')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Set Active
                            </button>
                            <button
                              onClick={() => updateJobStatus(job.id, 'Paused')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              Pause
                            </button>
                            <button
                              onClick={() => updateJobStatus(job.id, 'Draft')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                              Move to Draft
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first job posting'
              }
            </p>
            {!searchTerm && selectedType === 'All' && selectedStatus === 'All' && (
              <button 
                onClick={() => setShowJobForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1 to {filteredJobs.length} of {jobs.length} jobs
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}