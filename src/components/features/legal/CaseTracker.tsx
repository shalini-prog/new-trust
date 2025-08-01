'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Bell,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  Filter,
  Loader2,
  CheckSquare
} from 'lucide-react';

interface CaseStatus {
  _id: string;
  caseNumber: string;
  title: string;
  court: string;
  status: 'pending' | 'active' | 'closed' | 'archived';
  nextHearing: string;
  createdAt: string;
  updatedAt: string;
  petitioner: string;
  respondent: string;
  judge: string;
  description: string;
  documents: string[];
}

interface CaseEvent {
  date: string;
  event: string;
  description: string;
  documents?: string[];
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export default function CaseTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'cnr' | 'case' | 'party'>('cnr');
  const [selectedCase, setSelectedCase] = useState<CaseStatus | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cases, setCases] = useState<CaseStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CaseStatus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/lcase';

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cases`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const casesData = await response.json();
      setCases(Array.isArray(casesData) ? casesData : []);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('Failed to fetch cases from database');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (documentUrl: string, documentName: string) => {
    try {
      setDocumentLoading(true);

      // Check if URL is from Cloudinary
      const isCloudinary = documentUrl.includes('cloudinary.com');

      // For Cloudinary URLs, don't include credentials
      const fetchOptions = isCloudinary ? {
        mode: 'cors',
        credentials: 'omit'  // Don't send credentials for Cloudinary
      } : {
        credentials: 'include'  // Include credentials for your own API
      };

      const response = await fetch(documentUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from URL if not provided
      const filename = documentName || documentUrl.split('/').pop() || 'document';
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download document. Please try again.');
    } finally {
      setDocumentLoading(false);
    }
  };

  const searchCases = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      switch (searchType) {
        case 'cnr':
          searchParams.append('cnr', searchQuery);
          break;
        case 'case':
          searchParams.append('caseNumber', searchQuery);
          break;
        case 'party':
          searchParams.append('party', searchQuery);
          break;
      }

      const response = await fetch(`${API_BASE_URL}/cases/search?${searchParams}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const results = await response.json();
      setSearchResults(Array.isArray(results) ? results : []);

    } catch (err) {
      console.error('Error searching cases:', err);
      const localResults = cases.filter(caseItem => {
        const query = searchQuery.toLowerCase();
        switch (searchType) {
          case 'case':
            return caseItem.caseNumber.toLowerCase().includes(query);
          case 'party':
            return caseItem.petitioner.toLowerCase().includes(query) ||
              caseItem.respondent.toLowerCase().includes(query);
          default:
            return caseItem.caseNumber.toLowerCase().includes(query);
        }
      });
      setSearchResults(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    searchCases();
  };

  const handleEmailNotifications = () => {
  setEmailNotifications(!emailNotifications);
  // Simulate API call
  setTimeout(() => {
    alert(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'} successfully!`);
  }, 500);
};

const handleSmsNotifications = () => {
  setSmsNotifications(!smsNotifications);
  // Simulate API call
  setTimeout(() => {
    alert(`SMS notifications ${!smsNotifications ? 'enabled' : 'disabled'} successfully!`);
  }, 500);
};


const handleDownloadCaseSummary = (caseItem) => {
  // Create a simple text summary
  const summary = `
CASE SUMMARY
============

Case Number: ${caseItem.caseNumber}
Title: ${caseItem.title}
Court: ${caseItem.court}
Status: ${caseItem.status.toUpperCase()}
Petitioner: ${caseItem.petitioner}
Respondent: ${caseItem.respondent}
Judge: ${caseItem.judge || 'Not assigned'}
Next Hearing: ${formatDate(caseItem.nextHearing)}
Created: ${formatDate(caseItem.createdAt)}
Last Updated: ${formatDate(caseItem.updatedAt)}

Description:
${caseItem.description || 'No description available'}

Generated on: ${new Date().toLocaleString()}
  `;

  const blob = new Blob([summary], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `case-summary-${caseItem.caseNumber.replace(/[/\\?%*:|"<>]/g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleSetReminder = () => {
  if (!reminderDate) {
    alert('Please select a reminder date');
    return;
  }

  // Simulate setting reminder
  const reminderData = {
    caseId: selectedCase._id,
    date: reminderDate,
    note: reminderNote || 'Case reminder'
  };

  console.log('Setting reminder:', reminderData);
  alert(`Reminder set for ${formatDate(reminderDate)}!`);
  setShowReminderModal(false);
  setReminderDate('');
  setReminderNote('');
};

const handleShareCase = () => {
  if (!selectedCase) return;

  const shareData = {
    title: `Case: ${selectedCase.title}`,
    text: `Case Number: ${selectedCase.caseNumber}\nCourt: ${selectedCase.court}\nStatus: ${selectedCase.status}`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Case details copied to clipboard!');
    });
  }

  setShowShareModal(false);
};


const handleLearnMore = (type) => {
  const content = {
    cnr: "CNR (Case Number Record) is a unique 16-digit alphanumeric code assigned to every case filed in Indian courts. Format: SSDDYYNNNNNNN where SS=State Code, DD=District Code, YY=Year, NNNNNNN=Sequential Number.",
    terminology: "Common legal terms:\n• Disposed: Case resolved/closed\n• Adjourned: Hearing postponed\n• Reserved: Judgment pending\n• Ex-parte: Proceeding without one party",
    support: "For technical support:\n📞 Phone: +91-11-2338-7540\n📧 Email: support@ecourts.gov.in\n🕒 Hours: 9 AM - 6 PM (Mon-Fri)"
  };

  alert(content[type] || 'Information not available');
};

const handleContactSupport = (method) => {
  if (method === 'phone') {
    window.open('tel:+91-11-2338-7540');
  } else if (method === 'email') {
    window.open('mailto:support@ecourts.gov.in?subject=Case Tracker Support Request');
  }
};


const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'closed': return 'bg-green-100 text-green-800';
    case 'archived': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'active': return <Eye className="w-4 h-4" />;
    case 'closed': return <CheckCircle className="w-4 h-4" />;
    case 'archived': return <FileText className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString('en-IN');
  } catch {
    return dateString;
  }
};

const calculateProgress = (status: string, createdAt: string) => {
  switch (status) {
    case 'pending': return 25;
    case 'active': return 60;
    case 'closed': return 100;
    case 'archived': return 100;
    default: return 0;
  }
};

const caseEvents: CaseEvent[] = [
  {
    date: new Date().toISOString().split('T')[0],
    event: 'Case Updated',
    description: 'Latest case information retrieved from database.',
    documents: []
  }
];

const displayCases = searchResults.length > 0 ? searchResults : cases;

return (
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Case Status Tracker
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Track your legal case progress through courts using CNR Number, Case ID, or Party Name
      </p>
    </div>

    {/* Search Section */}
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-8 h-8 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">Search Your Case</h3>
      </div>

      <div className="space-y-4">
        {/* Search Type Selection */}
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'cnr', label: 'CNR Number', example: 'DLCT01-123456-2024' },
            { id: 'case', label: 'Case Number', example: 'CC/123/2024' },
            { id: 'party', label: 'Party Name', example: 'John Doe' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setSearchType(type.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === type.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={`Enter ${searchType === 'cnr' ? 'CNR Number' : searchType === 'case' ? 'Case Number' : 'Party Name'}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Example: {searchType === 'cnr' ? 'DLCT01-123456-2024' : searchType === 'case' ? 'CC/123/2024' : 'John Doe'}
            </p>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Clear Search */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span className="text-blue-700">
              Found {searchResults.length} result(s) for "{searchQuery}"
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Integration Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Database Integration</h4>
            <p className="text-blue-700 text-sm">
              This service is connected to your case management database for real-time case status updates.
              All case information is fetched directly from your database records.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Error Display */}
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h4 className="font-bold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchCases}
            className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )}

    {/* Cases List */}
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            {searchResults.length > 0 ? 'Search Results' : 'Your Cases'}
          </h3>
          {loading && <Loader2 className="w-6 h-6 animate-spin text-blue-600" />}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {displayCases.length}
            </span>
          </button>
          <button
            onClick={fetchCases}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading cases...</span>
        </div>
      ) : displayCases.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-gray-600 mb-2">
            {searchResults.length === 0 && searchQuery ? 'No cases found' : 'No cases available'}
          </h4>
          <p className="text-gray-500">
            {searchResults.length === 0 && searchQuery
              ? `No cases match "${searchQuery}". Try a different search term.`
              : 'No cases found in the database.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayCases.map((caseItem, index) => (
            <motion.div
              key={caseItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedCase(caseItem)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{caseItem.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {caseItem.caseNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {caseItem.court}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseItem.status)}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(caseItem.status)}
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Next Hearing:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(caseItem.nextHearing)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Last Update:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formatDate(caseItem.updatedAt)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Judge:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {caseItem.judge || 'Not assigned'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Case Progress</span>
                    <span className="text-sm text-gray-600">{calculateProgress(caseItem.status, caseItem.createdAt)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(caseItem.status, caseItem.createdAt)}%` }}
                    ></div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>

    {/* Notifications Panel */}
    {showNotifications && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">Recent Notifications</h3>
          </div>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {displayCases.slice(0, 3).map((caseItem, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Case Updated</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    {caseItem.title} - Status: {caseItem.status}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Updated: {formatDate(caseItem.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSmsNotifications}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${smsNotifications
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
          >
            <span className="flex items-center gap-2">
              {smsNotifications ? <CheckSquare className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              {smsNotifications ? 'SMS Alerts Enabled' : 'Enable SMS Alerts'}
            </span>
          </button>
          <button
            onClick={handleEmailNotifications}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${emailNotifications
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <span className="flex items-center gap-2">
              {emailNotifications ? <CheckSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              {emailNotifications ? 'Email Notifications On' : 'Email Notifications'}
            </span>
          </button>
        </div>
      </motion.div>
    )}

    {/* Case Detail Modal */}
    {selectedCase && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedCase(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedCase.title}</h3>
              <p className="text-gray-600">{selectedCase.caseNumber} • {selectedCase.court}</p>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Details */}
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-4">Case Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Petitioner:</p>
                      <p className="text-gray-600">{selectedCase.petitioner}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Respondent:</p>
                      <p className="text-gray-600">{selectedCase.respondent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next Hearing:</p>
                      <p className="text-gray-600">{formatDate(selectedCase.nextHearing)}</p>
                    </div>
                  </div>
                  {selectedCase.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Description:</p>
                        <p className="text-gray-600">{selectedCase.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-4">Current Status</h4>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCase.status)}`}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(selectedCase.status)}
                      {selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1)}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress(selectedCase.status, selectedCase.createdAt)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{calculateProgress(selectedCase.status, selectedCase.createdAt)}% Complete</p>
              </div>
            </div>

            {/* Case Timeline */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Case Timeline</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800">Case Created</h5>
                      <span className="text-sm text-gray-500">{formatDate(selectedCase.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Case filed and registered in the system.</p>
                  </div>
                </div>

                {selectedCase.documents && selectedCase.documents.length > 0 && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">Documents Available</h5>
                        <span className="text-sm text-gray-500">{formatDate(selectedCase.updatedAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Case documents available for download:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.documents.map((docUrl, idx) => {
                          const displayName = docUrl.split('/').pop() || `Document ${idx + 1}`;
                          return (
                            <button
                              key={idx}
                              onClick={() => downloadDocument(docUrl, displayName)}
                              disabled={documentLoading}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 text-sm rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                              {documentLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <FileText className="w-4 h-4" />
                                  <span className="truncate max-w-xs">{displayName}</span>
                                  <Download className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {caseEvents.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      {index < caseEvents.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">{event.event}</h5>
                        <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => {
                selectedCase.documents.forEach((docUrl, idx) => {
                  const displayName = docUrl.split('/').pop() || `Document ${idx + 1}`;
                  downloadDocument(docUrl, displayName);
                });
              }}
              disabled={documentLoading || selectedCase.documents.length === 0}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {documentLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Download All Documents'
              )}
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Set Reminder
            </button>
            <button className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
              Share Case
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}

    {/* Help Section */}
    <div className="bg-blue-50 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">Need Help?</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3">Finding CNR Number</h4>
          <p className="text-gray-600 text-sm mb-4">
            CNR (Case Number Record) is a unique 16-digit number assigned to every case filed in Indian courts.
          </p>
          <button
            onClick={() => handleLearnMore('cnr')}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Learn More →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3">Court Terminology</h4>
          <p className="text-gray-600 text-sm mb-4">
            Understand common legal terms like "Disposed", "Adjourned", "Reserved for Orders", etc.
          </p>
          <button
            onClick={() => handleLearnMore('terminology')}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            View Glossary →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3">Technical Support</h4>
          <p className="text-gray-600 text-sm mb-4">
            Having trouble finding your case? Contact our support team for assistance.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleContactSupport('phone')}
              className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:underline"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button
              onClick={() => handleContactSupport('email')}
              className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:underline"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Important Notice</h4>
            <p className="text-blue-700 text-sm">
              This case tracking system is integrated with your database for real-time updates.
              Case information is synchronized automatically. For official court documents and
              certified copies, please contact the respective court registry.
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* Reminder Modal */}
    {showReminderModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Set Reminder</h3>
            <button
              onClick={() => setShowReminderModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Date
              </label>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                placeholder="Add a note for this reminder..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSetReminder}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Set Reminder
            </button>
            <button
              onClick={() => setShowReminderModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Share Modal */}
    {showShareModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Share Case</h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">Share case details:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <strong>{selectedCase?.title}</strong><br />
              Case: {selectedCase?.caseNumber}<br />
              Court: {selectedCase?.court}<br />
              Status: {selectedCase?.status}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleShareCase}
              className="flex-1 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share/Copy
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}



