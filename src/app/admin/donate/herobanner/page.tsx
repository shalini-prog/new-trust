'use client';

import { useState, useEffect } from 'react';
import { 
  Save,
  Eye,
  Upload,
  Film,
  Type,
  Palette,
  Settings,
  RefreshCw,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';

// Admin Components
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';

interface HeroBannerSettings {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: 'scroll' | 'link' | 'popup';
  buttonLink: string;
  videoUrl: string;
  videoType: 'local' | 'youtube' | 'vimeo';
  overlayOpacity: number;
  titleColor: string;
  subtitleColor: string;
  buttonColor: string;
  buttonTextColor: string;
  enableTypewriter: boolean;
  typewriterSpeed: number;
  enableScrollIndicator: boolean;
  maxHeight: number;
  enableVideoControls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export default function AdminHeroBannerPage() {
  const [settings, setSettings] = useState<HeroBannerSettings>({
    title: 'Make an Impact',
    subtitle: 'Every donation brings hope to someone in need.',
    buttonText: 'Donate Now',
    buttonAction: 'scroll',
    buttonLink: '',
    videoUrl: '/videos/donation-impact.mp4',
    videoType: 'local',
    overlayOpacity: 40,
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#7c3aed',
    enableTypewriter: true,
    typewriterSpeed: 3,
    enableScrollIndicator: true,
    maxHeight: 800,
    enableVideoControls: false,
    autoplay: true,
    loop: true,
    muted: true
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [videoPreview, setVideoPreview] = useState(false);

  const handleInputChange = (field: keyof HeroBannerSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call to save settings
      // await fetch('/api/admin/hero-banner', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle video upload logic
      const videoUrl = URL.createObjectURL(file);
      handleInputChange('videoUrl', videoUrl);
      handleInputChange('videoType', 'local');
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSettings({
        title: 'Make an Impact',
        subtitle: 'Every donation brings hope to someone in need.',
        buttonText: 'Donate Now',
        buttonAction: 'scroll',
        buttonLink: '',
        videoUrl: '/videos/donation-impact.mp4',
        videoType: 'local',
        overlayOpacity: 40,
        titleColor: '#ffffff',
        subtitleColor: '#ffffff',
        buttonColor: '#ffffff',
        buttonTextColor: '#7c3aed',
        enableTypewriter: true,
        typewriterSpeed: 3,
        enableScrollIndicator: true,
        maxHeight: 800,
        enableVideoControls: false,
        autoplay: true,
        loop: true,
        muted: true
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/donate">
            <AdminButton variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </AdminButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Banner Management</h1>
            <p className="text-gray-600 mt-2">Configure the main hero banner on the donation page</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <AdminButton 
            variant="outline" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </AdminButton>
          <AdminButton 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </AdminButton>
        </div>
      </div>

      {isPreviewMode ? (
        /* Preview Mode */
        <AdminCard className="p-0 overflow-hidden">
          <div 
            className="relative overflow-hidden"
            style={{ height: `${settings.maxHeight}px` }}
          >
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
              <div 
                className="absolute inset-0 bg-black z-10"
                style={{ opacity: settings.overlayOpacity / 100 }}
              ></div>
              {settings.videoUrl && (
                <video 
                  className="w-full h-full object-cover"
                  autoPlay={settings.autoplay}
                  muted={settings.muted}
                  loop={settings.loop}
                  controls={settings.enableVideoControls}
                >
                  <source src={settings.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: settings.titleColor }}
              >
                {settings.title}
              </h1>
              
              <div 
                className="text-xl md:text-2xl font-light mb-10"
                style={{ color: settings.subtitleColor }}
              >
                {settings.subtitle}
              </div>
              
              <button 
                className="px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 shadow-lg"
                style={{ 
                  backgroundColor: settings.buttonColor,
                  color: settings.buttonTextColor 
                }}
              >
                {settings.buttonText}
              </button>
            </div>
            
            {/* Scroll Indicator */}
            {settings.enableScrollIndicator && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            )}
          </div>
        </AdminCard>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Settings */}
          <AdminCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Type className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Content Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter main title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={settings.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subtitle text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter button text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Action
                </label>
                <select
                  value={settings.buttonAction}
                  onChange={(e) => handleInputChange('buttonAction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="scroll">Scroll to donation form</option>
                  <option value="link">Open link</option>
                  <option value="popup">Open popup</option>
                </select>
              </div>
              
              {settings.buttonAction === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <input
                    type="url"
                    value={settings.buttonLink}
                    onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              )}
            </div>
          </AdminCard>

          {/* Video Settings */}
          <AdminCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Video Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Type
                </label>
                <select
                  value={settings.videoType}
                  onChange={(e) => handleInputChange('videoType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="local">Local Video</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL/Path
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={settings.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/videos/your-video.mp4"
                  />
                  {settings.videoType === 'local' && (
                    <label className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={settings.autoplay}
                    onChange={(e) => handleInputChange('autoplay', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">
                    Autoplay
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="loop"
                    checked={settings.loop}
                    onChange={(e) => handleInputChange('loop', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="loop" className="text-sm font-medium text-gray-700">
                    Loop
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="muted"
                    checked={settings.muted}
                    onChange={(e) => handleInputChange('muted', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="muted" className="text-sm font-medium text-gray-700">
                    Muted
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="videoControls"
                    checked={settings.enableVideoControls}
                    onChange={(e) => handleInputChange('enableVideoControls', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="videoControls" className="text-sm font-medium text-gray-700">
                    Show Controls
                  </label>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Design Settings */}
          <AdminCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold text-gray-900">Design Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overlay Opacity ({settings.overlayOpacity}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={settings.overlayOpacity}
                  onChange={(e) => handleInputChange('overlayOpacity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Color
                  </label>
                  <input
                    type="color"
                    value={settings.titleColor}
                    onChange={(e) => handleInputChange('titleColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle Color
                  </label>
                  <input
                    type="color"
                    value={settings.subtitleColor}
                    onChange={(e) => handleInputChange('subtitleColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Background
                  </label>
                  <input
                    type="color"
                    value={settings.buttonColor}
                    onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.buttonTextColor}
                    onChange={(e) => handleInputChange('buttonTextColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Height (px)
                </label>
                <input
                  type="number"
                  min="400"
                  max="1200"
                  value={settings.maxHeight}
                  onChange={(e) => handleInputChange('maxHeight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </AdminCard>

          {/* Animation Settings */}
          <AdminCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Animation Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTypewriter"
                  checked={settings.enableTypewriter}
                  onChange={(e) => handleInputChange('enableTypewriter', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="enableTypewriter" className="text-sm font-medium text-gray-700">
                  Enable Typewriter Effect
                </label>
              </div>
              
              {settings.enableTypewriter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typewriter Speed (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={settings.typewriterSpeed}
                    onChange={(e) => handleInputChange('typewriterSpeed', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableScrollIndicator"
                  checked={settings.enableScrollIndicator}
                  onChange={(e) => handleInputChange('enableScrollIndicator', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="enableScrollIndicator" className="text-sm font-medium text-gray-700">
                  Show Scroll Indicator
                </label>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <AdminButton 
          variant="outline" 
          onClick={resetToDefaults}
          className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </AdminButton>
        
        <div className="flex space-x-3">
          <AdminButton variant="outline">
            Cancel
          </AdminButton>
          <AdminButton 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save & Publish'}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}