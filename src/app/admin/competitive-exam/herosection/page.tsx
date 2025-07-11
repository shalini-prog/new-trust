'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  X
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
  backgroundImage?: string;
  useBackgroundImage?: boolean;
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
    subtitleEmoji: '🎯',
    backgroundImage: '',
    useBackgroundImage: false
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const gradientOptions = [
    { label: 'Blue to Purple', from: 'from-blue-600', to: 'to-purple-600' },
    { label: 'Green to Blue', from: 'from-green-500', to: 'to-blue-600' },
    { label: 'Purple to Pink', from: 'from-purple-600', to: 'to-pink-600' },
    { label: 'Orange to Red', from: 'from-orange-500', to: 'to-red-600' },
    { label: 'Teal to Cyan', from: 'from-teal-500', to: 'to-cyan-600' },
    { label: 'Indigo to Blue', from: 'from-indigo-600', to: 'to-blue-500' }
  ];

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/ehero');
        const data = await res.json();
        if (data) {
          setHeroContent({
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            primaryButtonText: data.primaryButtonText || '',
            primaryButtonLink: data.primaryButtonLink || '',
            secondaryButtonText: data.secondaryButtonText || '',
            secondaryButtonLink: data.secondaryButtonLink || '',
            backgroundGradientFrom: data.backgroundGradientFrom || '',
            backgroundGradientTo: data.backgroundGradientTo || '',
            titleEmoji: data.titleEmoji || '',
            subtitleEmoji: data.subtitleEmoji || '',
            backgroundImage: data.backgroundImage || '',
            useBackgroundImage: data.useBackgroundImage || false
          });

          if (data.floatingShape) {
            setFloatingShapes(data.floatingShape);
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero content:', err);
      }
    };

    fetchHero();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setHeroContent(prev => ({
          ...prev,
          backgroundImage: base64String,
          useBackgroundImage: true
        }));
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // In a real application, you would upload to your server here
       const formData = new FormData();
       formData.append('image', file);
       const response = await fetch('http://localhost:5000/api/ehero/upload-image', {
         method: 'POST',
         body: formData
       });
       const result = await response.json();

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveImage = () => {
    setHeroContent(prev => ({
      ...prev,
      backgroundImage: '',
      useBackgroundImage: false
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...heroContent,
        floatingShape: floatingShapes
      };

      const response = await fetch('http://localhost:5000/api/ehero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        alert('Failed to save: ' + result.message);
      }
    } catch (err) {
      console.error('Error saving hero content:', err);
      alert('Error saving content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (field: keyof HeroContent, value: string | boolean) => {
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
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Background Options</label>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backgroundType"
                      checked={!heroContent.useBackgroundImage}
                      onChange={() => handleContentChange('useBackgroundImage', false)}
                      className="mr-2"
                    />
                    Gradient
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backgroundType"
                      checked={heroContent.useBackgroundImage}
                      onChange={() => handleContentChange('useBackgroundImage', true)}
                      className="mr-2"
                    />
                    Image
                  </label>
                </div>
              </div>

              {!heroContent.useBackgroundImage && (
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
              )}

              {heroContent.useBackgroundImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  
                  {heroContent.backgroundImage ? (
                    <div className="relative">
                      <img
                        src={heroContent.backgroundImage}
                        alt="Background preview"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload background image</p>
                      <p className="text-xs text-gray-500 mb-4">Supports JPG, PNG, WebP (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="background-upload"
                      />
                      <label
                        htmlFor="background-upload"
                        className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              <div className={`relative h-96 overflow-hidden ${
                heroContent.useBackgroundImage && heroContent.backgroundImage
                  ? 'bg-cover bg-center'
                  : `bg-gradient-to-r ${heroContent.backgroundGradientFrom} ${heroContent.backgroundGradientTo}`
              }`}
              style={
                heroContent.useBackgroundImage && heroContent.backgroundImage
                  ? { backgroundImage: `url(${heroContent.backgroundImage})` }
                  : {}
              }>
                {/* Overlay for better text readability on images */}
                {heroContent.useBackgroundImage && heroContent.backgroundImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                )}
                
                {/* Background pattern for gradients */}
                {!heroContent.useBackgroundImage && (
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-5"></div>
                  </div>
                )}
                
                {/* Floating shapes preview */}
                {floatingShapes.enabled && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[1, 2, 3].map((id) => (
                      <div
                        key={id}
                        className={`absolute bg-white animate-pulse ${
                          floatingShapes.shape === 'circle' 
                            ? 'rounded-full' 
                            : floatingShapes.shape === 'square' 
                              ? 'rounded-lg' 
                              : 'rounded-full'
                        }`}
                        style={{
                          width: Math.random() * (floatingShapes.maxWidth - floatingShapes.minWidth) + floatingShapes.minWidth,
                          height: Math.random() * (floatingShapes.maxHeight - floatingShapes.minHeight) + floatingShapes.minHeight,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: floatingShapes.opacity / 100,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                  <div className="animate-fadeIn">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      {heroContent.titleEmoji} {heroContent.title}
                    </h1>
                    <div className="bg-white/20 backdrop-blur-md py-1 px-3 rounded-full inline-block mb-4">
                      <h2 className="text-lg text-white">{heroContent.subtitle} {heroContent.subtitleEmoji}</h2>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/90 max-w-lg mb-6 animate-fadeIn">
                    {heroContent.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeIn">
                    <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-full text-sm hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                      {heroContent.primaryButtonText}
                    </button>
                    <button className="px-6 py-2 bg-transparent border-2 border-white text-white font-bold rounded-full text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      {heroContent.secondaryButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}