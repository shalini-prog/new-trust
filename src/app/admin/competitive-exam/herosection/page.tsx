'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus,
  Settings,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw
} from 'lucide-react';

// Types
interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  titleEmoji: string;
  subtitleEmoji: string;
}

interface FloatingShape {
  id: number;
  enabled: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

export default function HeroSectionAdmin() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Competitive Exams Hub',
    subtitle: 'Your Ultimate Guide to Success',
    description: 'A one-stop destination for aspirants preparing for UPSC, SSC, Banking, Railways, State PSC, and other government exams with comprehensive study materials and preparation strategies.',
    primaryButtonText: 'Start Learning',
    primaryButtonLink: '#study-plan',
    secondaryButtonText: 'Join Community',
    secondaryButtonLink: '#discuss',
    backgroundGradientFrom: 'from-blue-600',
    backgroundGradientTo: 'to-purple-600',
    titleEmoji: '📚',
    subtitleEmoji: '🎯'
  });

  const [floatingShapes, setFloatingShapes] = useState<FloatingShape>({
    id: 1,
    enabled: true,
    minWidth: 50,
    maxWidth: 150,
    minHeight: 50,
    maxHeight: 150,
    opacity: 20,
    color: 'white',
    shape: 'circle'
  });

  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const gradientOptions = [
    { label: 'Blue to Purple', from: 'from-blue-600', to: 'to-purple-600' },
    { label: 'Green to Blue', from: 'from-green-500', to: 'to-blue-600' },
    { label: 'Purple to Pink', from: 'from-purple-600', to: 'to-pink-600' },
    { label: 'Orange to Red', from: 'from-orange-500', to: 'to-red-600' },
    { label: 'Teal to Cyan', from: 'from-teal-500', to: 'to-cyan-600' },
    { label: 'Indigo to Blue', from: 'from-indigo-600', to: 'to-blue-500' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);
  };

  const handleContentChange = (field: keyof HeroContent, value: string) => {
    setHeroContent(prev => ({ ...prev, [field]: value }));
  };

  const handleShapeChange = (field: keyof FloatingShape, value: any) => {
    setFloatingShapes(prev => ({ ...prev, [field]: value }));
  };

  const previewModeClasses = {
    desktop: 'w-full',
    tablet: 'w-3/4 mx-auto',
    mobile: 'w-1/3 mx-auto'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hero Section Management</h1>
              <p className="text-gray-600">Customize your homepage hero section</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('animations')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'animations' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Effects
            </button>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={heroContent.titleEmoji}
                    onChange={(e) => handleContentChange('titleEmoji', e.target.value)}
                    className="w-12 px-3 py-2 border border-gray-300 rounded-md text-center"
                    placeholder="📚"
                  />
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={heroContent.subtitleEmoji}
                    onChange={(e) => handleContentChange('subtitleEmoji', e.target.value)}
                    className="w-12 px-3 py-2 border border-gray-300 rounded-md text-center"
                    placeholder="🎯"
                  />
                  <input
                    type="text"
                    value={heroContent.subtitle}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={heroContent.description}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button</label>
                  <input
                    type="text"
                    value={heroContent.primaryButtonText}
                    onChange={(e) => handleContentChange('primaryButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={heroContent.primaryButtonLink}
                    onChange={(e) => handleContentChange('primaryButtonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Button Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
                  <input
                    type="text"
                    value={heroContent.secondaryButtonText}
                    onChange={(e) => handleContentChange('secondaryButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={heroContent.secondaryButtonLink}
                    onChange={(e) => handleContentChange('secondaryButtonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Button Link"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Background Gradient</label>
                <div className="grid grid-cols-1 gap-2">
                  {gradientOptions.map((gradient, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleContentChange('backgroundGradientFrom', gradient.from);
                        handleContentChange('backgroundGradientTo', gradient.to);
                      }}
                      className={`w-full h-12 rounded-lg bg-gradient-to-r ${gradient.from} ${gradient.to} border-2 transition-all ${
                        heroContent.backgroundGradientFrom === gradient.from ? 'border-blue-500 scale-105' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-white font-medium text-sm">{gradient.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Background Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload background image</p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Animations Tab */}
          {activeTab === 'animations' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">Floating Shapes</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={floatingShapes.enabled}
                      onChange={(e) => handleShapeChange('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {floatingShapes.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Min Width</label>
                        <input
                          type="number"
                          value={floatingShapes.minWidth}
                          onChange={(e) => handleShapeChange('minWidth', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Max Width</label>
                        <input
                          type="number"
                          value={floatingShapes.maxWidth}
                          onChange={(e) => handleShapeChange('maxWidth', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Min Height</label>
                        <input
                          type="number"
                          value={floatingShapes.minHeight}
                          onChange={(e) => handleShapeChange('minHeight', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Max Height</label>
                        <input
                          type="number"
                          value={floatingShapes.maxHeight}
                          onChange={(e) => handleShapeChange('maxHeight', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Opacity ({floatingShapes.opacity}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={floatingShapes.opacity}
                        onChange={(e) => handleShapeChange('opacity', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Shape Type</label>
                      <select
                        value={floatingShapes.shape}
                        onChange={(e) => handleShapeChange('shape', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="triangle">Triangle</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6">
          <div className={`${previewModeClasses[previewMode]} transition-all duration-300`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Hero Preview */}
              <div className={`relative h-96 overflow-hidden bg-gradient-to-r ${heroContent.backgroundGradientFrom} ${heroContent.backgroundGradientTo}`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="1" height="1" fill="%23ffffff"/></svg>')] bg-repeat"></div>
                </div>
                
                {/* Floating shapes preview */}
                {floatingShapes.enabled && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[1, 2, 3].map((id) => (
                      <motion.div
                        key={id}
                        className={`absolute bg-white ${floatingShapes.shape === 'circle' ? 'rounded-full' : floatingShapes.shape === 'square' ? 'rounded-lg' : 'rounded-full'}`}
                        style={{
                          width: Math.random() * (floatingShapes.maxWidth - floatingShapes.minWidth) + floatingShapes.minWidth,
                          height: Math.random() * (floatingShapes.maxHeight - floatingShapes.minHeight) + floatingShapes.minHeight,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: floatingShapes.opacity / 100,
                        }}
                        animate={{
                          y: [0, Math.random() * 50 - 25],
                          x: [0, Math.random() * 50 - 25],
                        }}
                        transition={{
                          duration: Math.random() * 10 + 10,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      {heroContent.titleEmoji} {heroContent.title}
                    </h1>
                    <div className="bg-white/20 backdrop-blur-md py-1 px-3 rounded-full inline-block mb-4">
                      <h2 className="text-lg text-white">{heroContent.subtitle} {heroContent.subtitleEmoji}</h2>
                    </div>
                  </motion.div>
                  
                  <motion.p
                    className="text-sm text-white/90 max-w-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {heroContent.description}
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full text-sm hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                      {heroContent.primaryButtonText}
                    </button>
                    <button className="px-6 py-2 bg-transparent border-2 border-white text-white font-bold rounded-full text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      {heroContent.secondaryButtonText}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}