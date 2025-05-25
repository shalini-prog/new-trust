'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Users,
  TrendingUp,
  Send,
  Settings,
  Eye,
  Save,
  Upload,
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminCard from '@/components/admin/ui/AdminCard';

interface NewsletterContent {
  title: string;
  subtitle: string;
  description: string;
  placeholderText: string;
  buttonText: string;
  successMessage: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  showSocialIcons: boolean;
  privacyText: string;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  tags: string[];
}

interface NewsletterCampaign {
  id: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: string;
  scheduledAt?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
}

export default function NewsletterManagement() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'subscribers' | 'campaigns' | 'analytics'>('content');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Newsletter content state
  const [newsletterContent, setNewsletterContent] = useState<NewsletterContent>({
    title: 'Stay Connected with Our Mission',
    subtitle: 'Join Our Newsletter',
    description: 'Get the latest updates on our projects, success stories, and upcoming events delivered straight to your inbox.',
    placeholderText: 'Enter your email address',
    buttonText: 'Subscribe Now',
    successMessage: 'Thank you for subscribing! Check your email to confirm.',
    backgroundImage: '/images/newsletter-bg.jpg',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    showSocialIcons: true,
    privacyText: 'We respect your privacy. Unsubscribe at any time.'
  });

  // Mock data for subscribers
  const [subscribers] = useState<Subscriber[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      subscribedAt: '2024-03-15T10:30:00Z',
      status: 'active',
      source: 'Homepage',
      tags: ['donor', 'volunteer']
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      subscribedAt: '2024-03-14T14:20:00Z',
      status: 'active',
      source: 'Event Registration',
      tags: ['volunteer']
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      subscribedAt: '2024-03-13T09:15:00Z',
      status: 'unsubscribed',
      source: 'Social Media',
      tags: ['donor']
    }
  ]);

  // Mock data for campaigns
  const [campaigns] = useState<NewsletterCampaign[]>([
    {
      id: '1',
      subject: 'March Impact Report - Your Support Changes Lives',
      status: 'sent',
      sentAt: '2024-03-20T10:00:00Z',
      recipients: 1250,
      openRate: 68.5,
      clickRate: 12.3
    },
    {
      id: '2',
      subject: 'Upcoming Charity Gala - Reserve Your Spot',
      status: 'scheduled',
      scheduledAt: '2024-03-25T09:00:00Z',
      recipients: 1180
    },
    {
      id: '3',
      subject: 'Weekly Update - Clean Water Initiative Progress',
      status: 'draft',
      recipients: 0
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setIsLoading(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleContentChange = (field: keyof NewsletterContent, value: string | boolean) => {
    setNewsletterContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!mounted) return null;

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    growthRate: 15.3,
    avgOpenRate: 65.2
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Newsletter Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage newsletter content, subscribers, and campaigns
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSubscribers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Subscribers</div>
            </div>
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeSubscribers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Subscribers</div>
            </div>
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                +{stats.growthRate}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</div>
            </div>
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgOpenRate}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Open Rate</div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'content', label: 'Content Settings', icon: Settings },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Content Settings */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Newsletter Section Content
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Main Title
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.subtitle}
                      onChange={(e) => handleContentChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={newsletterContent.description}
                      onChange={(e) => handleContentChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Placeholder Text
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.placeholderText}
                      onChange={(e) => handleContentChange('placeholderText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.buttonText}
                      onChange={(e) => handleContentChange('buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Success Message
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.successMessage}
                      onChange={(e) => handleContentChange('successMessage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Privacy Text
                    </label>
                    <input
                      type="text"
                      value={newsletterContent.privacyText}
                      onChange={(e) => handleContentChange('privacyText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Design Settings */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Design Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={newsletterContent.backgroundColor}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newsletterContent.backgroundColor}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={newsletterContent.textColor}
                        onChange={(e) => handleContentChange('textColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newsletterContent.textColor}
                        onChange={(e) => handleContentChange('textColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Image
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newsletterContent.backgroundImage}
                        onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newsletterContent.showSocialIcons}
                      onChange={(e) => handleContentChange('showSocialIcons', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show social media icons
                    </span>
                  </label>
                </div>
              </div>
            </AdminCard>
          </motion.div>
        )}

        {activeTab === 'subscribers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Subscribers Management */}
            <AdminCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Subscriber Management
                  </h3>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </button>
                  </div>
                </div>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search subscribers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Unsubscribed</option>
                    <option>Bounced</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                    <option>All Sources</option>
                    <option>Homepage</option>
                    <option>Event Registration</option>
                    <option>Social Media</option>
                  </select>
                </div>
                
                {/* Subscribers Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subscriber
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subscribed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {subscriber.name || subscriber.email}
                              </div>
                              {subscriber.name && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {subscriber.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              subscriber.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : subscriber.status === 'unsubscribed'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {subscriber.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {subscriber.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400">
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
            </AdminCard>
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Campaigns Management */}
            <AdminCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Email Campaigns
                  </h3>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </button>
                </div>
                
                {/* Campaigns List */}
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white">
                            {campaign.subject}
                          </h4>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'sent'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : campaign.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {campaign.status}
                            </span>
                            <span>{campaign.recipients.toLocaleString()} recipients</span>
                            {campaign.sentAt && (
                              <span>Sent {new Date(campaign.sentAt).toLocaleDateString()}</span>
                            )}
                            {campaign.scheduledAt && (
                              <span>Scheduled for {new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          {campaign.openRate && (
                            <div className="mt-2 flex items-center space-x-4 text-sm">
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <span className="font-medium">{campaign.openRate}%</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">open rate</span>
                              </div>
                              <div className="flex items-center text-blue-600 dark:text-blue-400">
                                <span className="font-medium">{campaign.clickRate}%</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">click rate</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {campaign.status === 'draft' && (
                            <button className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AdminCard>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AdminCard>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        12.5k
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Emails Sent</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-green-600 dark:text-green-400">+8.2% from last month</div>
                  </div>
                </div>
              </AdminCard>
              
              <AdminCard>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        68.5%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Open Rate</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-green-600 dark:text-green-400">+2.1% from last month</div>
                  </div>
                </div>
              </AdminCard>
              
              <AdminCard>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        12.3%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Click Rate</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-green-600 dark:text-green-400">+1.5% from last month</div>
                  </div>
                </div>
              </AdminCard>
              
              <AdminCard>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        2.1%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Unsubscribe Rate</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-red-600 dark:text-red-400">+0.3% from last month</div>
                  </div>
                </div>
              </AdminCard>
            </div>

            {/* Performance Chart */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Newsletter Performance Over Time
                </h3>
                <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Chart visualization would be implemented here
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Integration with charting library (Chart.js, Recharts, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Top Performing Campaigns */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Top Performing Campaigns
                </h3>
                <div className="space-y-4">
                  {campaigns
                    .filter(campaign => campaign.openRate)
                    .sort((a, b) => (b.openRate || 0) - (a.openRate || 0))
                    .map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {campaign.subject}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sent to {campaign.recipients.toLocaleString()} subscribers
                          </p>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                              {campaign.openRate}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                              {campaign.clickRate}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Click Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </AdminCard>

            {/* Subscriber Growth */}
            <AdminCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Subscriber Growth
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      New Subscribers This Month
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Homepage</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">156</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Events</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">89</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Social Media</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">67</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Engagement by Device
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Desktop</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '55%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">55%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Mobile</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-pink-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">35%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tablet</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>
          </motion.div>
        )}
      </div>

      {/* Save Status Toast */}
      {saveStatus === 'saved' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Changes saved successfully!
        </motion.div>
      )}
    </div>
  );
}