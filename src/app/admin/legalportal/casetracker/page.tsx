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
  X,
  AlertCircle,
  Save,
  Eye,
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Case {
  _id: string;
  caseNumber: string;
  title: string;
  court: string;
  status: 'pending' | 'active' | 'closed' | 'archived';
  petitioner: string;
  respondent: string;
  judge: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  nextHearing?: string;
  documents?: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'clerk' | 'user';
  lastActive: string;
  casesAssigned: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

interface ActivityLog {
  _id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  details?: string;
}

interface Settings {
  autoAssign: boolean;
  notifications: boolean;
  userRegistration: boolean;
  selfService: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function CaseTrackerAdmin() {
  const [activeTab, setActiveTab] = useState<'cases' | 'users' | 'settings' | 'analytics'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<Case | User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'case' | 'user' | 'bulk', ids: string[] }>({ type: 'case', ids: [] });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);


  // Settings state
  const [settings, setSettings] = useState<Settings>({
    autoAssign: false,
    notifications: true,
    userRegistration: true,
    selfService: false,
    backupFrequency: 'daily'
  });

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    phone: '',
    address: '',
    password: ''
  });

  const [caseForm, setCaseForm] = useState({
    caseNumber: '',
    title: '',
    court: '',
    petitioner: '',
    respondent: '',
    judge: '',
    status: 'pending' as const,
    description: '',
    nextHearing: ''
  });

  // Mock data with more comprehensive information
  const [cases, setCases] = useState<Case[]>([
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
      updatedAt: '2024-02-15',
      description: 'Property ownership dispute regarding inherited land',
      nextHearing: '2024-03-01',
      documents: ['petition.pdf', 'property_deed.pdf']
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
      updatedAt: '2024-01-18',
      description: 'Complaint against defective electronic product',
      nextHearing: '2024-02-28',
      documents: ['complaint.pdf', 'receipt.pdf']
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
      updatedAt: '2024-01-25',
      description: 'Child custody dispute in divorce proceedings',
      documents: ['marriage_certificate.pdf', 'custody_agreement.pdf']
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
      updatedAt: '2024-02-10',
      description: 'PIL against industrial pollution in residential areas',
      nextHearing: '2024-03-15',
      documents: ['pil_petition.pdf', 'environmental_report.pdf']
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
      updatedAt: '2024-01-30',
      description: 'Arbitration for breach of supply contract',
      documents: ['contract.pdf', 'arbitration_award.pdf']
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@legalservice.gov',
      role: 'admin',
      lastActive: '2024-02-15 14:30',
      casesAssigned: 0,
      phone: '+91-9876543210',
      address: 'Delhi, India',
      isActive: true
    },
    {
      id: '2',
      name: 'Advocate Sharma',
      email: 'sharma@lawfirm.com',
      role: 'lawyer',
      lastActive: '2024-02-15 12:45',
      casesAssigned: 3,
      phone: '+91-9876543211',
      address: 'Mumbai, India',
      isActive: true
    },
    {
      id: '3',
      name: 'Legal Clerk',
      email: 'clerk@legalservice.gov',
      role: 'clerk',
      lastActive: '2024-02-14 16:20',
      casesAssigned: 12,
      phone: '+91-9876543212',
      address: 'Bangalore, India',
      isActive: true
    },
    {
      id: '4',
      name: 'Citizen User',
      email: 'user@example.com',
      role: 'user',
      lastActive: '2024-02-13 10:15',
      casesAssigned: 1,
      phone: '+91-9876543213',
      address: 'Chennai, India',
      isActive: false
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Admin User',
      action: 'Created new case',
      timestamp: '2024-02-15 14:30',
      ipAddress: '192.168.1.1',
      details: 'Case CC/123/2024 created'
    },
    {
      id: '2',
      user: 'Advocate Sharma',
      action: 'Updated case documents',
      timestamp: '2024-02-15 12:45',
      ipAddress: '203.145.67.89',
      details: 'Documents uploaded for CRL/456/2024'
    },
    {
      id: '3',
      user: 'Legal Clerk',
      action: 'Assigned case to lawyer',
      timestamp: '2024-02-14 16:20',
      ipAddress: '192.168.1.2',
      details: 'Case FAM/789/2024 assigned to Advocate Sharma'
    },
    {
      id: '4',
      user: 'Citizen User',
      action: 'Viewed case status',
      timestamp: '2024-02-13 10:15',
      ipAddress: '117.240.45.67',
      details: 'Status checked for case FAM/789/2024'
    },
    {
      id: '5',
      user: 'Admin User',
      action: 'Updated system settings',
      timestamp: '2024-02-12 09:30',
      ipAddress: '192.168.1.1',
      details: 'Changed notification preferences'
    },
    {
      id: '6',
      user: 'Advocate Sharma',
      action: 'Filed motion',
      timestamp: '2024-02-11 15:45',
      ipAddress: '203.145.67.89',
      details: 'Filed motion to dismiss in case CC/123/2024'
    }
  ]);

  const API = 'http://localhost:5000/api/lcase';


  // Notification system
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Reset forms
  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'user',
      phone: '',
      address: '',
      password: ''
    });
  };

  const resetCaseForm = () => {
    setCaseForm({
      caseNumber: '',
      title: '',
      court: '',
      petitioner: '',
      respondent: '',
      judge: '',
      status: 'pending',
      description: '',
      nextHearing: ''
    });
    setUploadedFiles([]);
  };

  // Load edit data into forms
  useEffect(() => {
  if (currentEditItem) {
    if ('email' in currentEditItem) {
      // It's a user
      const user = currentEditItem as User;
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        password: ''
      });
    } else {
      // It's a case
      const caseItem = currentEditItem as Case;
      setCaseForm({
        caseNumber: caseItem.caseNumber,
        title: caseItem.title,
        court: caseItem.court,
        petitioner: caseItem.petitioner,
        respondent: caseItem.respondent,
        judge: caseItem.judge,
        status: caseItem.status,
        description: caseItem.description || '',
        nextHearing: caseItem.nextHearing || ''
      });
      
      // Initialize uploadedFiles with existing documents
      if (caseItem.documents && caseItem.documents.length > 0) {
        setUploadedFiles(caseItem.documents.map(doc => ({
          name: doc.split('/').pop() || 'Document',
          url: doc
        })));
      } else {
        setUploadedFiles([]);
      }
    }
  }
}, [currentEditItem]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [casesRes, usersRes, settingsRes, logsRes] = await Promise.all([
          fetch(`${API}/cases`).then(res => res.json()),
          fetch(`${API}/users`).then(res => res.json()),
          fetch(`${API}/settings`).then(res => res.json()),
          fetch(`${API}/logs`).then(res => res.json()),
        ]);
        setCases(casesRes);
        setUsers(usersRes);
        if (settingsRes && typeof settingsRes === 'object') {
          setSettings(settingsRes);
        } else {
          showNotification('error', 'Received invalid settings data from server');
        }

        setActivityLogs(logsRes);
      } catch (err) {
        showNotification('error', 'Failed to fetch data from server');
      }
    };

    fetchInitialData();
  }, []);


  // Filter functions
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.petitioner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.respondent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Selection handlers
  const handleSelectCase = (caseId: string) => {
    setSelectedCases(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleSelectAllCases = () => {
    setSelectedCases(prev =>
      prev.length === filteredCases.length
        ? []
        : filteredCases.map(caseItem => caseItem._id)
    );
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(prev =>
      prev.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user._id)
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await handleUploadFile(file);
    }
  }
};

const handleUploadFile = async (file: File) => {
  if (!file || file.size === 0) {
    showNotification('error', 'Empty or invalid file');
    return;
  }

  // 📄 Only allow PDF
  if (file.type !== 'application/pdf') {
    showNotification('error', 'Only PDF files are allowed');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API}/upload-file`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.url) {
      showNotification('success', `Uploaded: ${file.name}`);
      setUploadedFiles(prev => [
        ...prev,
        { name: file.name, url: data.url }
      ]);
    } else {
      throw new Error(data?.message || 'Upload failed');
    }
  } catch (err) {
    console.error('Upload error:', err);
    showNotification('error', 'File upload failed');
  }
};




  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // CRUD Operations
  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      const method = currentEditItem ? 'PUT' : 'POST';
      const url = currentEditItem ? `${API}/users/${currentEditItem._id}` : `${API}/users`;

      // Build payload
      const userPayload = {
        ...userForm,
        lastActive: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ...(currentEditItem ? {} : { casesAssigned: 0, isActive: true })
      };

      // Send to backend
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (!response.ok) throw new Error('Failed to save user to server');

      const savedUser: User = await response.json();

      // Update frontend state
      if (currentEditItem) {
        setUsers(prev => prev.map(user =>
          user._id === currentEditItem._id ? savedUser : user
        ));

        const newActivity: ActivityLog = {
          _id: Date.now().toString(),
          user: 'Admin User',
          action: 'Updated user profile',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ipAddress: '192.168.1.1',
          details: `Updated profile for ${userForm.name}`
        };
        setActivityLogs(prev => [newActivity, ...prev]);

        showNotification('success', 'User updated successfully');
      } else {
        setUsers(prev => [...prev, savedUser]);

        const newActivity: ActivityLog = {
          _id: Date.now().toString(),
          user: 'Admin User',
          action: 'Created new user',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ipAddress: '192.168.1.1',
          details: `Created user account for ${userForm.name}`
        };
        setActivityLogs(prev => [newActivity, ...prev]);

        showNotification('success', 'User created successfully');
      }

      setShowUserModal(false);
      setCurrentEditItem(null);
      resetUserForm();
    } catch (error) {
      showNotification('error', 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveCase = async () => {
  setIsLoading(true);
  try {
    const method = currentEditItem ? 'PUT' : 'POST';
    const url = currentEditItem ? `${API}/cases/${currentEditItem._id}` : `${API}/cases`;

    // Build payload - include both existing and new documents
    const casePayload = {
      ...caseForm,
      documents: uploadedFiles.map(f => f.url),
      updatedAt: new Date().toISOString().slice(0, 10),
      ...(currentEditItem ? {} : { createdAt: new Date().toISOString().slice(0, 10) })
    };

    // Send to backend
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(casePayload)
    });

    if (!response.ok) throw new Error('Failed to save case to server');

    const savedCase: Case = await response.json();

    // Update frontend state
    if (currentEditItem) {
      setCases(prev => prev.map(c => c._id === currentEditItem._id ? savedCase : c));
      showNotification('success', 'Case updated successfully');
    } else {
      setCases(prev => [...prev, savedCase]);
      showNotification('success', 'Case created successfully');
    }

    setShowCaseModal(false);
    setCurrentEditItem(null);
    resetCaseForm();
  } catch (error) {
    showNotification('error', 'Failed to save case');
  } finally {
    setIsLoading(false);
  }
};


  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (deleteTarget.type === 'case') {
        // Call backend to delete cases
        const response = await fetch(`${API}/cases/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: deleteTarget.ids })
        });
        if (!response.ok) throw new Error('Failed to delete cases on server');

        // Update frontend state
        setCases(prev => prev.filter(caseItem => !deleteTarget.ids.includes(caseItem._id)));
        setSelectedCases([]);

        // Add to activity log
        const newActivity: ActivityLog = {
        _id: Date.now().toString(),
          user: 'Admin User',
          action: 'Deleted case(s)',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ipAddress: '192.168.1.1',
          details: `Deleted ${deleteTarget.ids.length} case(s)`
        };
        setActivityLogs(prev => [newActivity, ...prev]);

        showNotification('success', `${deleteTarget.ids.length} case(s) deleted successfully`);

      } else if (deleteTarget.type === 'user') {
        // Call backend to delete users
        const response = await fetch(`${API}/users/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: deleteTarget.ids })
        });
        if (!response.ok) throw new Error('Failed to delete users on server');

        // Update frontend state
        setUsers(prev => prev.filter(user => !deleteTarget.ids.includes(user.id)));
        setSelectedUsers([]);

        // Add to activity log
        const newActivity: ActivityLog = {
          _id: Date.now().toString(),
          user: 'Admin User',
          action: 'Deleted user(s)',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ipAddress: '192.168.1.1',
          details: `Deleted ${deleteTarget.ids.length} user(s)`
        };
        setActivityLogs(prev => [newActivity, ...prev]);

        showNotification('success', `${deleteTarget.ids.length} user(s) deleted successfully`);
      }

      setShowDeleteConfirm(false);
      setDeleteTarget({ type: 'case', ids: [] });

    } catch (error) {
      showNotification('error', 'Failed to delete items');
    } finally {
      setIsLoading(false);
    }
  };


  // Export functions
  const handleExportCases = () => {
    const dataToExport = selectedCases.length > 0
      ? cases.filter(caseItem => selectedCases.includes(caseItem._id))
      : filteredCases;

    const csvContent = [
      ['Case Number', 'Title', 'Court', 'Status', 'Petitioner', 'Respondent', 'Judge', 'Created', 'Updated'],
      ...dataToExport.map(caseItem => [
        caseItem.caseNumber,
        caseItem.title,
        caseItem.court,
        caseItem.status,
        caseItem.petitioner,
        caseItem.respondent,
        caseItem.judge,
        caseItem.createdAt,
        caseItem.updatedAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cases_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('success', `${dataToExport.length} cases exported successfully`);
  };

  const handleExportUsers = () => {
    const dataToExport = selectedUsers.length > 0
      ? users.filter(user => selectedUsers.includes(user.id))
      : filteredUsers;

    const csvContent = [
      ['Name', 'Email', 'Role', 'Phone', 'Address', 'Cases Assigned', 'Last Active', 'Status'],
      ...dataToExport.map(user => [
        user.name,
        user.email,
        user.role,
        user.phone || '',
        user.address || '',
        user.casesAssigned.toString(),
        user.lastActive,
        user.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('success', `${dataToExport.length} users exported successfully`);
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/lcase/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      // Optional: Fetch latest settings again
      // const updated = await res.json();
      // setSettings(updated);

      // Create log (optional if backend does it)
      await fetch('http://localhost:5000/api/lcase/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'Admin User',
          action: 'Updated system settings',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ipAddress: '192.168.1.1',
          details: 'Updated: ' + Object.entries(settings).map(([k, v]) => `${k}=${v}`).join(', ')
        })
      });

      showNotification('success', 'Settings saved successfully');
    } catch (error) {
      showNotification('error', 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };


  const handleBackupData = async () => {
    setIsLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const backupData = {
        cases,
        users,
        settings,
        activityLogs,
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `casetracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Add to activity log
      const newActivity: ActivityLog = {
        _id: Date.now().toString(),
        user: 'Admin User',
        action: 'Created data backup',
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ipAddress: '192.168.1.1',
        details: 'Full system backup created'
      };
      setActivityLogs(prev => [newActivity, ...prev]);

      showNotification('success', 'Data backup created successfully');
    } catch (error) {
      showNotification('error', 'Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Analytics data
  const getAnalyticsData = () => {
    const statusCounts = cases.reduce((acc, caseItem) => {
      acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentCases = cases.filter(caseItem => {
      const caseDate = new Date(caseItem.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return caseDate >= weekAgo;
    }).length;

    return {
      totalCases: cases.length,
      activeCases: statusCounts.active || 0,
      pendingCases: statusCounts.pending || 0,
      closedCases: statusCounts.closed || 0,
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      recentCases,
      statusCounts,
      roleCounts
    };
  };

  const analytics = getAnalyticsData();

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
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cases'
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
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
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
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
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
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
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
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Bulk Actions */}
              {selectedCases.length > 0 && (
                <div className="bg-indigo-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-700">
                      {selectedCases.length} case{selectedCases.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportCases}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Export
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'case', ids: selectedCases });
                          setShowDeleteConfirm(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cases Table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                              onChange={handleSelectAllCases}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Case Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parties
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Next Hearing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCases.map((caseItem) => (
                          <tr key={caseItem._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={selectedCases.includes(caseItem._id)}
                                onChange={() => handleSelectCase(caseItem._id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{caseItem.caseNumber}</div>
                                  <div className="text-sm text-gray-500">{caseItem.title}</div>
                                  <div className="text-xs text-gray-400">{caseItem.court}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="font-medium">P: {caseItem.petitioner}</div>
                                <div>R: {caseItem.respondent}</div>
                                <div className="text-xs text-gray-500">Judge: {caseItem.judge}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(caseItem.status)}
                                <span className={`ml-2 ${getStatusBadge(caseItem.status)}`}>
                                  {caseItem.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {caseItem.nextHearing ? (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  {new Date(caseItem.nextHearing).toLocaleDateString()}
                                </div>
                              ) : (
                                <span className="text-gray-400">No hearing scheduled</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setCurrentEditItem(caseItem);
                                    setShowCaseModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({ type: 'case', ids: [caseItem._id] });
                                    setShowDeleteConfirm(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredCases.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating a new case.'}
                      </p>
                    </div>
                  )}
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
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportUsers}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      setCurrentEditItem(null);
                      setShowUserModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="bg-indigo-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-700">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportUsers}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Export
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'user', ids: selectedUsers });
                          setShowDeleteConfirm(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              onChange={handleSelectAllUsers}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleSelectUser(user._id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  {user.phone && (
                                    <div className="text-xs text-gray-400 flex items-center">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {user.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getRoleBadge(user.role)}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                {user.lastActive}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setCurrentEditItem(user);
                                    setShowUserModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({ type: 'user', ids: [user._id] });
                                    setShowDeleteConfirm(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try adjusting your search.' : 'Get started by creating a new user.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Cases</dt>
                          <dd className="text-lg font-medium text-gray-900">{analytics.totalCases}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                          <dd className="text-lg font-medium text-gray-900">{analytics.activeCases}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd className="text-lg font-medium text-gray-900">{analytics.totalUsers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Recent Cases</dt>
                          <dd className="text-lg font-medium text-gray-900">{analytics.recentCases}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Case Status Distribution</h3>
                    <div className="mt-4">
                      <div className="space-y-3">
                        {Object.entries(analytics.statusCounts).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{status}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full"
                                  style={{ width: `${(count / analytics.totalCases) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">User Role Distribution</h3>
                    <div className="mt-4">
                      <div className="space-y-3">
                        {Object.entries(analytics.roleCounts).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900 capitalize">{role}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(count / analytics.totalUsers) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                  <div className="mt-4">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {activityLogs.slice(0, 10).map((log, index) => (
                          <li key={log._id}>
                            <div className="relative pb-8">
                              {index !== activityLogs.slice(0, 10).length - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                    <User className="h-5 w-5 text-white" />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      <span className="font-medium text-gray-900">{log.user}</span> {log.action}
                                    </p>
                                    {log.details && (
                                      <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                                    )}
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time>{log.timestamp}</time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">System Settings</h3>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Auto-assign Cases</label>
                        <p className="text-sm text-gray-500">Automatically assign new cases to available lawyers</p>
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          className={`${settings.autoAssign ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          onClick={() => setSettings({ ...settings, autoAssign: !settings.autoAssign })}
                        >
                          <span
                            aria-hidden="true"
                            className={`${settings.autoAssign ? 'translate-x-5' : 'translate-x-0'
                              } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
                        <p className="text-sm text-gray-500">Send email and in-app notifications for case updates</p>
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          className={`${settings.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                        >
                          <span
                            aria-hidden="true"
                            className={`${settings.notifications ? 'translate-x-5' : 'translate-x-0'
                              } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">User Registration</label>
                        <p className="text-sm text-gray-500">Allow new users to register accounts</p>
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          className={`${settings.userRegistration ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          onClick={() => setSettings({ ...settings, userRegistration: !settings.userRegistration })}
                        >
                          <span
                            aria-hidden="true"
                            className={`${settings.userRegistration ? 'translate-x-5' : 'translate-x-0'
                              } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Self-Service Portal</label>
                        <p className="text-sm text-gray-500">Allow users to manage their own cases</p>
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          className={`${settings.selfService ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          onClick={() => setSettings({ ...settings, selfService: !settings.selfService })}
                        >
                          <span
                            aria-hidden="true"
                            className={`${settings.selfService ? 'translate-x-5' : 'translate-x-0'
                              } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Backup Frequency</label>
                        <p className="text-sm text-gray-500">How often to create system backups</p>
                      </div>
                      <div className="ml-4">
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={settings.backupFrequency}
                          onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value as any })}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      onClick={handleBackupData}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Create Backup Now
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {/* User Modal */}
      {showUserModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowUserModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentEditItem ? 'Edit User' : 'Add New User'}
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                      >
                        <option value="admin">Admin</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="clerk">Clerk</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={userForm.address}
                        onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                      />
                    </div>
                    {!currentEditItem && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          type="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSaveUser}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setCurrentEditItem(null);
                    resetUserForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Modal */}
      {showCaseModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCaseModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentEditItem ? 'Edit Case' : 'Add New Case'}
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Case Number</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.caseNumber}
                        onChange={(e) => setCaseForm({ ...caseForm, caseNumber: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.title}
                        onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Court</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.court}
                        onChange={(e) => setCaseForm({ ...caseForm, court: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.status}
                        onChange={(e) => setCaseForm({ ...caseForm, status: e.target.value as any })}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Petitioner</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.petitioner}
                        onChange={(e) => setCaseForm({ ...caseForm, petitioner: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Respondent</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.respondent}
                        onChange={(e) => setCaseForm({ ...caseForm, respondent: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Judge</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.judge}
                        onChange={(e) => setCaseForm({ ...caseForm, judge: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Next Hearing</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.nextHearing}
                        onChange={(e) => setCaseForm({ ...caseForm, nextHearing: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={caseForm.description}
                        onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Documents</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload files</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleFileUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                              </div>
                              <button
                                onClick={() => removeUploadedFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSaveCase}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCaseModal(false);
                    setCurrentEditItem(null);
                    resetCaseForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowDeleteConfirm(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete {deleteTarget.ids.length} {deleteTarget.type}{deleteTarget.ids.length > 1 ? 's' : ''}?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete these {deleteTarget.type}{deleteTarget.ids.length > 1 ? 's' : ''}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 rounded-md shadow-lg overflow-hidden max-w-sm w-full ${notification.type === 'success' ? 'bg-green-50' : notification.type === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : notification.type === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setNotification(null)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
