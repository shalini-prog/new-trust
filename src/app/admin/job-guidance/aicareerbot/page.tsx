'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Zap,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  Shield,
  Database,
  Cpu,
  Brain
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  model: string;
  apiKey: string;
  endpoint: string;
  maxTokens: number;
  temperature: number;
  isDefault: boolean;
}

interface BotResponse {
  id: string;
  trigger: string;
  response: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationLog {
  id: string;
  userId: string;
  message: string;
  botResponse: string;
  provider: string;
  timestamp: Date;
  responseTime: number;
  satisfaction?: number;
}

export default function AICareerBotAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Mock data - replace with actual API calls
  const [aiProviders, setAiProviders] = useState<AIProvider[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      status: 'active',
      model: 'gpt-4-turbo',
      apiKey: 'sk-proj-xxx...xxx',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      maxTokens: 4000,
      temperature: 0.7,
      isDefault: true
    },
    {
      id: '2',
      name: 'Anthropic Claude',
      status: 'active',
      model: 'claude-3-sonnet',
      apiKey: 'sk-ant-xxx...xxx',
      endpoint: 'https://api.anthropic.com/v1/messages',
      maxTokens: 4000,
      temperature: 0.6,
      isDefault: false
    },
    {
      id: '3',
      name: 'Google Gemini',
      status: 'inactive',
      model: 'gemini-pro',
      apiKey: '',
      endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      maxTokens: 4000,
      temperature: 0.8,
      isDefault: false
    }
  ]);

  const [botResponses, setBotResponses] = useState<BotResponse[]>([
    {
      id: '1',
      trigger: 'job search',
      response: 'I can help you find jobs based on your skills and location. What type of job are you looking for?',
      category: 'Job Search',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      trigger: 'resume help',
      response: 'Let me help you create or improve your resume. Would you like tips for a specific section?',
      category: 'Resume',
      isActive: true,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-21')
    }
  ]);

  const [conversationLogs] = useState<ConversationLog[]>([
    {
      id: '1',
      userId: 'user_123',
      message: 'Help me find software developer jobs',
      botResponse: 'I can help you find software developer positions...',
      provider: 'OpenAI GPT-4',
      timestamp: new Date('2024-01-25T10:30:00'),
      responseTime: 1200,
      satisfaction: 5
    },
    {
      id: '2',
      userId: 'user_456',
      message: 'Review my resume',
      botResponse: 'I\'d be happy to review your resume...',
      provider: 'Anthropic Claude',
      timestamp: new Date('2024-01-25T11:15:00'),
      responseTime: 800,
      satisfaction: 4
    }
  ]);

  const stats = {
    totalConversations: 1247,
    activeUsers: 89,
    avgResponseTime: 950,
    satisfactionRate: 4.2,
    apiCalls: 15420,
    costThisMonth: 234.50
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const saveProvider = async (provider: AIProvider) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAiProviders(prev => 
        prev.map(p => p.id === provider.id ? provider : p)
      );
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const testProvider = async (providerId: string) => {
    const provider = aiProviders.find(p => p.id === providerId);
    if (!provider) return;

    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAiProviders(prev =>
        prev.map(p => 
          p.id === providerId 
            ? { ...p, status: 'active' as const }
            : p
        )
      );
    } catch (error) {
      setAiProviders(prev =>
        prev.map(p => 
          p.id === providerId 
            ? { ...p, status: 'error' as const }
            : p
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Conversations', value: stats.totalConversations, icon: MessageSquare, color: 'bg-blue-500' },
          { label: 'Active Users (24h)', value: stats.activeUsers, icon: Users, color: 'bg-green-500' },
          { label: 'Avg Response Time', value: `${stats.avgResponseTime}ms`, icon: Clock, color: 'bg-orange-500' },
          { label: 'Satisfaction Rate', value: `${stats.satisfactionRate}/5`, icon: TrendingUp, color: 'bg-purple-500' },
          { label: 'API Calls (Month)', value: stats.apiCalls, icon: Activity, color: 'bg-indigo-500' },
          { label: 'Cost This Month', value: `$${stats.costThisMonth}`, icon: BarChart3, color: 'bg-red-500' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
        <div className="space-y-4">
          {conversationLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">User: {log.userId}</p>
                  <span className="text-sm text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Provider: {log.provider}</span>
                  <span>Response: {log.responseTime}ms</span>
                  {log.satisfaction && (
                    <span>Rating: {log.satisfaction}/5 ⭐</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIProviders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">AI Provider Configuration</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      <div className="grid gap-6">
        {aiProviders.map((provider) => (
          <motion.div
            key={provider.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  provider.name.includes('OpenAI') ? 'bg-green-100 text-green-600' :
                  provider.name.includes('Claude') ? 'bg-purple-100 text-purple-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-600">Model: {provider.model}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {provider.isDefault && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Default</span>
                )}
                <div className={`w-3 h-3 rounded-full ${
                  provider.status === 'active' ? 'bg-green-500' :
                  provider.status === 'error' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-600 capitalize">{provider.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey[provider.id] ? 'text' : 'password'}
                    value={provider.apiKey}
                    onChange={(e) => {
                      const updatedProvider = { ...provider, apiKey: e.target.value };
                      setAiProviders(prev => 
                        prev.map(p => p.id === provider.id ? updatedProvider : p)
                      );
                    }}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter API key..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleApiKeyVisibility(provider.id)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                <input
                  type="url"
                  value={provider.endpoint}
                  onChange={(e) => {
                    const updatedProvider = { ...provider, endpoint: e.target.value };
                    setAiProviders(prev => 
                      prev.map(p => p.id === provider.id ? updatedProvider : p)
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                <input
                  type="number"
                  value={provider.maxTokens}
                  onChange={(e) => {
                    const updatedProvider = { ...provider, maxTokens: parseInt(e.target.value) };
                    setAiProviders(prev => 
                      prev.map(p => p.id === provider.id ? updatedProvider : p)
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={provider.temperature}
                  onChange={(e) => {
                    const updatedProvider = { ...provider, temperature: parseFloat(e.target.value) };
                    setAiProviders(prev => 
                      prev.map(p => p.id === provider.id ? updatedProvider : p)
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`default-${provider.id}`}
                  checked={provider.isDefault}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAiProviders(prev => 
                        prev.map(p => ({ ...p, isDefault: p.id === provider.id }))
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`default-${provider.id}`} className="text-sm text-gray-700">
                  Set as default provider
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => testProvider(provider.id)}
                  disabled={isLoading || !provider.apiKey}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-sm transition-colors"
                >
                  Test Connection
                </button>
                <button
                  onClick={() => saveProvider(provider)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex items-center gap-2">
              {saveStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>
                {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderBotResponses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bot Response Management</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Response
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search responses..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="Job Search">Job Search</option>
              <option value="Resume">Resume</option>
              <option value="Interview">Interview</option>
              <option value="Skills">Skills</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {botResponses.map((response) => (
            <div key={response.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {response.category}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      response.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                    <span className="text-sm text-gray-500">
                      {response.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">
                    Trigger: "{response.trigger}"
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {response.response}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Created: {response.createdAt.toLocaleDateString()}</span>
                    <span>Updated: {response.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Volume */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Volume</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        {/* Response Times */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Response time chart would go here</p>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Satisfaction</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Satisfaction chart would go here</p>
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Discussion Topics</h3>
          <div className="space-y-3">
            {[
              { topic: 'Job Search', count: 342, percentage: 45 },
              { topic: 'Resume Help', count: 256, percentage: 33 },
              { topic: 'Interview Prep', count: 128, percentage: 17 },
              { topic: 'Salary Info', count: 89, percentage: 12 },
              { topic: 'Skills Training', count: 67, percentage: 9 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-900">{item.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{item.count}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'providers', label: 'AI Providers', icon: Brain },
    { id: 'responses', label: 'Bot Responses', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Career Bot Admin</h1>
            <p className="text-gray-600 mt-2">Manage your AI-powered career guidance system</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Bot Online</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'providers' && renderAIProviders()}
        {activeTab === 'responses' && renderBotResponses()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            <p className="text-gray-600">Settings panel would go here...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}