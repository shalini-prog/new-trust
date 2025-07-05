'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Eye,
  Save,
  ArrowLeft,
  ImageIcon,
  VideoIcon,
  Settings,
  Type,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  X
} from 'lucide-react';
import Link from 'next/link';

interface HeroSettings {
  backgroundType: 'video' | 'image';
  videoUrl: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  overlayOpacity: number;
  overlayColor: string;
  titleColor: string;
  subtitleColor: string;
  titleSize: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  subtitleSize: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  animationDelay: {
    title: number;
    subtitle: number;
  };
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export default function AdminGalleryHero() {
  const [settings, setSettings] = useState<HeroSettings>({
    backgroundType: 'video',
    videoUrl: '/videos/gallery-hero.mp4',
    imageUrl: '/images/gallery-hero.jpg',
    title: 'Our Journey in Pictures',
    subtitle: 'Witness the impact of your contributions through our visual storytelling',
    overlayOpacity: 0.5,
    overlayColor: '#000000',
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    titleSize: {
      mobile: 'text-4xl',
      tablet: 'text-6xl',
      desktop: 'text-7xl'
    },
    subtitleSize: {
      mobile: 'text-xl',
      tablet: 'text-2xl',
      desktop: 'text-2xl'
    },
    animationDelay: {
      title: 0.5,
      subtitle: 0.8
    },
    autoplay: true,
    loop: true,
    muted: true
  });

  const [activeTab, setActiveTab] = useState('content');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/ghero');
        const data = await res.json();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/ghero/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      console.log('Saved:', data);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoControl = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = async (type: 'video' | 'image', file: File) => {
  if (!file) return;

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const formData = new FormData();
    formData.append(type, file); // Use 'image' or 'video' as field name

    // Set correct endpoint based on file type
    const endpoint =
      type === 'video'
        ? 'http://localhost:5000/api/ghero/upload-video'
        : 'http://localhost:5000/api/ghero/upload-image';

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (response.ok) {
      const data = await response.json();
      const uploadedUrl = data.url;

      if (type === 'video') {
        setSettings(prev => ({ ...prev, videoUrl: uploadedUrl }));
      } else {
        setSettings(prev => ({ ...prev, imageUrl: uploadedUrl }));
      }
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    // Fallback to local blob preview
    const url = URL.createObjectURL(file);
    if (type === 'video') {
      setSettings(prev => ({ ...prev, videoUrl: url }));
    } else {
      setSettings(prev => ({ ...prev, imageUrl: url }));
    }
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};


  const triggerFileInput = (type: 'video' | 'image') => {
    if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    } else if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'video' | 'image') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const isValidType = type === 'video' ? 
        file.type.startsWith('video/') : 
        file.type.startsWith('image/');
      
      if (isValidType) {
        handleFileUpload(type, file);
      } else {
        alert(`Please select a valid ${type} file`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPreviewClasses = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[500px]';
      default:
        return 'w-full h-[500px]';
    }
  };

  const getTitleClasses = () => {
    return `${settings.titleSize[previewDevice as keyof typeof settings.titleSize]} font-bold mb-6`;
  };

  const getSubtitleClasses = () => {
    return `${settings.subtitleSize[previewDevice as keyof typeof settings.subtitleSize]} max-w-3xl`;
  };

  const getCurrentMediaUrl = () => {
    return settings.backgroundType === 'video' ? settings.videoUrl : settings.imageUrl;
  };

  const clearMedia = (type: 'video' | 'image') => {
    if (type === 'video') {
      setSettings(prev => ({ ...prev, videoUrl: '' }));
    } else {
      setSettings(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/gallery"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
            <p className="text-gray-600">Customize your gallery hero section</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'content', label: 'Content', icon: Type },
                  { id: 'media', label: 'Media', icon: VideoIcon },
                  { id: 'style', label: 'Style', icon: Palette },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title
                    </label>
                    <textarea
                      value={settings.title}
                      onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <textarea
                      value={settings.subtitle}
                      onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Background Type
                    </label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, backgroundType: 'video' }))}
                        className={`flex items-center px-4 py-2 rounded-lg border ${
                          settings.backgroundType === 'video'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <VideoIcon className="w-4 h-4 mr-2" />
                        Video
                      </button>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, backgroundType: 'image' }))}
                        className={`flex items-center px-4 py-2 rounded-lg border ${
                          settings.backgroundType === 'image'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                      </button>
                    </div>
                  </div>

                  {settings.backgroundType === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Upload
                      </label>
                      
                      {/* Current Video Display */}
                      {settings.videoUrl && (
                        <div className="mb-4 relative">
                          <video
                            src={settings.videoUrl}
                            className="w-full h-32 object-cover rounded-lg border"
                            controls
                          />
                          <button
                            onClick={() => clearMedia('video')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onDrop={(e) => handleDrop(e, 'video')}
                        onDragOver={handleDragOver}
                        onClick={() => triggerFileInput('video')}
                      >
                        {isUploading ? (
                          <div className="space-y-2">
                            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
                            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <VideoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Drop video here or click to upload</p>
                            <p className="text-xs text-gray-500 mt-1">Supports MP4, WebM, AVI</p>
                          </>
                        )}
                      </div>
                      
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('video', file);
                        }}
                      />
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="autoplay"
                            checked={settings.autoplay}
                            onChange={(e) => setSettings(prev => ({ ...prev, autoplay: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="autoplay" className="ml-2 text-sm text-gray-700">
                            Autoplay
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="loop"
                            checked={settings.loop}
                            onChange={(e) => setSettings(prev => ({ ...prev, loop: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="loop" className="ml-2 text-sm text-gray-700">
                            Loop
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="muted"
                            checked={settings.muted}
                            onChange={(e) => setSettings(prev => ({ ...prev, muted: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="muted" className="ml-2 text-sm text-gray-700">
                            Muted
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Image
                      </label>
                      
                      {/* Current Image Display */}
                      {settings.imageUrl && (
                        <div className="mb-4 relative">
                          <img
                            src={settings.imageUrl}
                            alt="Background"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => clearMedia('image')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onDrop={(e) => handleDrop(e, 'image')}
                        onDragOver={handleDragOver}
                        onClick={() => triggerFileInput('image')}
                      >
                        {isUploading ? (
                          <div className="space-y-2">
                            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
                            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Drop image here or click to upload</p>
                            <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, GIF, WebP</p>
                          </>
                        )}
                      </div>
                      
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('image', file);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Style Tab */}
              {activeTab === 'style' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.overlayOpacity}
                      onChange={(e) => setSettings(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">{Math.round(settings.overlayOpacity * 100)}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Color
                    </label>
                    <input
                      type="color"
                      value={settings.overlayColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, overlayColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Color
                    </label>
                    <input
                      type="color"
                      value={settings.titleColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, titleColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle Color
                    </label>
                    <input
                      type="color"
                      value={settings.subtitleColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, subtitleColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Animation Delay (seconds)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.animationDelay.title}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        animationDelay: { ...prev.animationDelay, title: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle Animation Delay (seconds)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.animationDelay.subtitle}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        animationDelay: { ...prev.animationDelay, subtitle: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              
              <div className="flex items-center space-x-3">
                {/* Device Toggle */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { id: 'desktop', icon: Monitor },
                    { id: 'tablet', icon: Tablet },
                    { id: 'mobile', icon: Smartphone }
                  ].map(({ id, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPreviewDevice(id)}
                      className={`p-2 rounded ${
                        previewDevice === id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Video Controls */}
                {settings.backgroundType === 'video' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleVideoControl}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex justify-center">
              <div className={`${getPreviewClasses()} relative overflow-hidden rounded-lg border border-gray-200`}>
                {/* Background */}
                {settings.backgroundType === 'video' && settings.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={settings.videoUrl}
                    autoPlay={settings.autoplay}
                    loop={settings.loop}
                    muted={settings.muted}
                    className="absolute w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : settings.backgroundType === 'image' && settings.imageUrl ? (
                  <img
                    src={settings.imageUrl}
                    alt="Hero background"
                    className="absolute w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>No media selected</p>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    backgroundColor: settings.overlayColor,
                    opacity: settings.overlayOpacity
                  }}
                />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                  <h1
                    className={getTitleClasses()}
                    style={{ color: settings.titleColor }}
                  >
                    {settings.title}
                  </h1>
                  <p
                    className={getSubtitleClasses()}
                    style={{ color: settings.subtitleColor }}
                  >
                    {settings.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}