'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Users,
  BarChart3,
  Settings,
  Image,
  RefreshCw
} from 'lucide-react';

// Types
interface CTAContent {
  id: string;
  title: string;
  subtitle: string;
  benefits: string[];
  successRate: number;
  successRateText: string;
  studentsEnrolled: number;
  formFields: FormField[];
  examOptions: ExamOption[];
  partnerLogos: number;
  isActive: boolean;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  order: number;
}

interface ExamOption {
  value: string;
  label: string;
  isActive: boolean;
}

export default function CTAAdminPage() {
  const [ctaContent, setCTAContent] = useState<CTAContent>({
    id: '1',
    title: 'Ready to Supercharge Your Exam Preparation?',
    subtitle: 'Join thousands of successful aspirants who have achieved their goals with our comprehensive preparation platform.',
    benefits: [
      'Access to all study materials and mock tests',
      'Personalized AI-driven study plans',
      'Live doubt clearing sessions with experts',
      'Performance analytics and progress tracking'
    ],
    successRate: 94,
    successRateText: '94% of our students clear their target exams in first attempt',
    studentsEnrolled: 10000,
    formFields: [
      { id: '1', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true, order: 1 },
      { id: '2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true, order: 2 },
      { id: '3', label: 'Target Exam', type: 'select', placeholder: 'Select your target exam', required: true, order: 3 }
    ],
    examOptions: [
      { value: 'upsc', label: 'UPSC Civil Services', isActive: true },
      { value: 'banking', label: 'Banking Exams', isActive: true },
      { value: 'ssc', label: 'SSC Exams', isActive: true },
      { value: 'railways', label: 'Railway Exams', isActive: true },
      { value: 'state-psc', label: 'State PSC Exams', isActive: true }
    ],
    partnerLogos: 5,
    isActive: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('CTA content saved successfully!');
    }, 1500);
  };

  const addBenefit = () => {
    setCTAContent(prev => ({
      ...prev,
      benefits: [...prev.benefits, 'New benefit']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setCTAContent(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index: number) => {
    setCTAContent(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addExamOption = () => {
    setCTAContent(prev => ({
      ...prev,
      examOptions: [...prev.examOptions, { value: '', label: '', isActive: true }]
    }));
  };

  const updateExamOption = (index: number, field: keyof ExamOption, value: string | boolean) => {
    setCTAContent(prev => ({
      ...prev,
      examOptions: prev.examOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const removeExamOption = (index: number) => {
    setCTAContent(prev => ({
      ...prev,
      examOptions: prev.examOptions.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: <Edit className="h-4 w-4" /> },
    { id: 'form', label: 'Form Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'branding', label: 'Branding', icon: <Image className="h-4 w-4" /> }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call to Action Management</h1>
            <p className="text-gray-600 mt-1">Manage CTA content, form settings, and conversion elements</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showPreview ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          ctaContent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {ctaContent.isActive ? 'Active' : 'Inactive'}
        </div>
        <button 
          onClick={() => setCTAContent(prev => ({ ...prev, isActive: !prev.isActive }))}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {ctaContent.isActive ? 'Deactivate' : 'Activate'} CTA Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Content Settings</h3>
                
                {/* Title & Subtitle */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                    <input
                      type="text"
                      value={ctaContent.title}
                      onChange={(e) => setCTAContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <textarea
                      value={ctaContent.subtitle}
                      onChange={(e) => setCTAContent(prev => ({ ...prev, subtitle: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Benefits List</label>
                    <button
                      onClick={addBenefit}
                      className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Benefit
                    </button>
                  </div>
                  <div className="space-y-3">
                    {ctaContent.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeBenefit(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'form' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Form Settings</h3>
                
                {/* Exam Options */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Exam Options</label>
                    <button
                      onClick={addExamOption}
                      className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </button>
                  </div>
                  <div className="space-y-3">
                    {ctaContent.examOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="text"
                          placeholder="Value (e.g., upsc)"
                          value={option.value}
                          onChange={(e) => updateExamOption(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Display Label"
                          value={option.label}
                          onChange={(e) => updateExamOption(index, 'label', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={option.isActive}
                            onChange={(e) => updateExamOption(index, 'isActive', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Active</span>
                        </label>
                        <button
                          onClick={() => removeExamOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Statistics Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={ctaContent.successRate}
                      onChange={(e) => setCTAContent(prev => ({ ...prev, successRate: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Students Enrolled</label>
                    <input
                      type="number"
                      value={ctaContent.studentsEnrolled}
                      onChange={(e) => setCTAContent(prev => ({ ...prev, studentsEnrolled: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate Description</label>
                  <textarea
                    value={ctaContent.successRateText}
                    onChange={(e) => setCTAContent(prev => ({ ...prev, successRateText: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Branding Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Partner Logos</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={ctaContent.partnerLogos}
                    onChange={(e) => setCTAContent(prev => ({ ...prev, partnerLogos: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">This controls how many placeholder partner logos are displayed</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Partner Logos Preview</h4>
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: ctaContent.partnerLogos }, (_, i) => (
                      <div key={i} className="h-8 w-24 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-400">Logo {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h3>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">{ctaContent.title}</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">{ctaContent.subtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Why Choose Our Platform?</h3>
                  <ul className="space-y-3">
                    {ctaContent.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 mr-2 mt-1 bg-green-500 rounded-full p-1">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Success Rate</span>
                      <span className="font-bold">{ctaContent.successRate}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${ctaContent.successRate}%` }}></div>
                    </div>
                    <p className="mt-2 text-sm text-white/80">{ctaContent.successRateText}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center space-x-4">
                    <p className="text-sm">
                      <span className="font-bold">{ctaContent.studentsEnrolled.toLocaleString()}+</span> students enrolled
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Start Your Journey Today</h3>
                <div className="space-y-4">
                  {ctaContent.formFields.map((field) => (
                    <div key={field.id}>
                      <label className="text-sm font-medium block mb-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white">
                          <option value="">{field.placeholder}</option>
                          {ctaContent.examOptions.filter(opt => opt.isActive).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60"
                        />
                      )}
                    </div>
                  ))}
                  <button className="w-full mt-6 bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-4 rounded-lg transition-colors">
                    Get Started Free
                  </button>
                  <p className="text-sm text-center text-white/80 mt-2">
                    Free 7-day trial, no credit card required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}