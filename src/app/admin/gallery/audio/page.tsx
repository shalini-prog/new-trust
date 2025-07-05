'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film,
  Save,
  ArrowLeft,
  Music,
  Settings,
  Volume,
  RotateCcw,
  FileAudio,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: string;
  type: 'background' | 'effect';
  isDefault: boolean;
}

interface AudioSettings {
  globalMuted: boolean;
  globalAutoPlay: boolean;
  globalVolume: number;
  backgroundMusic: {
    enabled: boolean;
    track: string;
    volume: number;
    fadeIn: boolean;
    fadeOut: boolean;
    loop: boolean;
  };
  soundEffects: {
    enabled: boolean;
    volume: number;
    hoverSound: string;
    clickSound: string;
    transitionSound: string;
  };
  controlsVisibility: {
    showPlayPause: boolean;
    showVolumeControl: boolean;
    showAutoPlayToggle: boolean;
    showOnMobile: boolean;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
}

interface AudioConfig {
  audioTracks: AudioTrack[];
  globalMuted: boolean;
  globalAutoPlay: boolean;
  globalVolume: number;
  backgroundMusic: AudioSettings['backgroundMusic'];
  soundEffects: AudioSettings['soundEffects'];
  controlsVisibility: AudioSettings['controlsVisibility'];
}

export default function AdminGalleryAudio() {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    {
      id: '1',
      name: 'Gallery Background Music',
      url: '/audio/gallery-bg.mp3',
      duration: 180,
      size: '3.2 MB',
      type: 'background',
      isDefault: true
    },
    {
      id: '2',
      name: 'Hover Effect Sound',
      url: '/audio/hover-effect.mp3',
      duration: 1,
      size: '24 KB',
      type: 'effect',
      isDefault: false
    },
    {
      id: '3',
      name: 'Click Sound',
      url: '/audio/click-sound.mp3',
      duration: 0.5,
      size: '18 KB',
      type: 'effect',
      isDefault: false
    }
  ]);

  const [settings, setSettings] = useState<AudioSettings>({
    globalMuted: false,
    globalAutoPlay: true,
    globalVolume: 0.7,
    backgroundMusic: {
      enabled: true,
      track: '1',
      volume: 0.5,
      fadeIn: true,
      fadeOut: true,
      loop: true
    },
    soundEffects: {
      enabled: true,
      volume: 0.8,
      hoverSound: '2',
      clickSound: '3',
      transitionSound: ''
    },
    controlsVisibility: {
      showPlayPause: true,
      showVolumeControl: true,
      showAutoPlayToggle: true,
      showOnMobile: false,
      position: 'bottom-right'
    }
  });

  const [activeTab, setActiveTab] = useState('tracks');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMuted, setPreviewMuted] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio refs
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTrack('');
      });
    }
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.addEventListener('ended', () => {
        setPreviewPlaying(false);
      });
    }
  }, []);

  // Fetch configuration from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('http://localhost:5000/api/gaudio', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data: AudioConfig = await res.json();
        console.log('Fetched audio config:', data);

        // Update state with fetched data
        if (data.audioTracks && data.audioTracks.length > 0) {
          setAudioTracks(data.audioTracks);
        }
        
        setSettings({
          globalMuted: data.globalMuted ?? false,
          globalAutoPlay: data.globalAutoPlay ?? true,
          globalVolume: data.globalVolume ?? 0.7,
          backgroundMusic: {
            enabled: data.backgroundMusic?.enabled ?? true,
            track: data.backgroundMusic?.track ?? '1',
            volume: data.backgroundMusic?.volume ?? 0.5,
            fadeIn: data.backgroundMusic?.fadeIn ?? true,
            fadeOut: data.backgroundMusic?.fadeOut ?? true,
            loop: data.backgroundMusic?.loop ?? true
          },
          soundEffects: {
            enabled: data.soundEffects?.enabled ?? true,
            volume: data.soundEffects?.volume ?? 0.8,
            hoverSound: data.soundEffects?.hoverSound ?? '2',
            clickSound: data.soundEffects?.clickSound ?? '3',
            transitionSound: data.soundEffects?.transitionSound ?? ''
          },
          controlsVisibility: {
            showPlayPause: data.controlsVisibility?.showPlayPause ?? true,
            showVolumeControl: data.controlsVisibility?.showVolumeControl ?? true,
            showAutoPlayToggle: data.controlsVisibility?.showAutoPlayToggle ?? true,
            showOnMobile: data.controlsVisibility?.showOnMobile ?? false,
            position: data.controlsVisibility?.position ?? 'bottom-right'
          }
        });
        
        // Set preview muted state based on global setting
        setPreviewMuted(data.globalMuted ?? false);
        
      } catch (error) {
        console.error('Failed to load audio config:', error);
        setError(error instanceof Error ? error.message : 'Failed to load audio configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Auto-play background music in preview if enabled
  useEffect(() => {
    if (settings.backgroundMusic.enabled && settings.globalAutoPlay && !settings.globalMuted) {
      const selectedTrack = audioTracks.find(track => track.id === settings.backgroundMusic.track);
      if (selectedTrack && backgroundAudioRef.current) {
        backgroundAudioRef.current.src = selectedTrack.url;
        backgroundAudioRef.current.volume = settings.backgroundMusic.volume * settings.globalVolume;
        backgroundAudioRef.current.loop = settings.backgroundMusic.loop;
        backgroundAudioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
        setPreviewPlaying(true);
      }
    }
  }, [settings.backgroundMusic.enabled, settings.backgroundMusic.track, settings.globalAutoPlay, settings.globalMuted, audioTracks]);

  // Update background audio volume when settings change
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = settings.backgroundMusic.volume * settings.globalVolume;
      backgroundAudioRef.current.muted = settings.globalMuted || previewMuted;
    }
  }, [settings.backgroundMusic.volume, settings.globalVolume, settings.globalMuted, previewMuted]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const payload: AudioConfig = {
      audioTracks,
      globalMuted: settings.globalMuted,
      globalAutoPlay: settings.globalAutoPlay,
      globalVolume: settings.globalVolume,
      backgroundMusic: settings.backgroundMusic,
      soundEffects: settings.soundEffects,
      controlsVisibility: settings.controlsVisibility
    };

    try {
      const res = await fetch('http://localhost:5000/api/gaudio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log('Settings saved successfully:', result);
      
    } catch (error) {
      console.error('Failed to save audio config:', error);
      setError(error instanceof Error ? error.message : 'Failed to save audio configuration');
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handlePlayTrack = (trackId: string) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (track && audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.volume = settings.globalVolume;
      audioRef.current.play().catch(e => console.error('Play failed:', e));
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const handleStopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack('');
    }
  };

  const handleFileUpload = async (file: File, type: 'background' | 'effect') => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('http://localhost:5000/api/gaudio/upload-audio', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const newTrack = await res.json();
      setAudioTracks(prev => [...prev, newTrack]);
      console.log('Audio uploaded successfully:', newTrack);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload audio file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/gaudio/track/${trackId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status: ${res.status}`);
      }

      setAudioTracks(prev => prev.filter(track => track.id !== trackId));
      
      if (currentTrack === trackId) {
        handleStopTrack();
      }
      
      // Stop background audio if it's the deleted track
      if (settings.backgroundMusic.track === trackId && backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        setPreviewPlaying(false);
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete audio track');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Preview control handlers
  const handlePreviewPlayPause = () => {
    if (backgroundAudioRef.current) {
      if (previewPlaying) {
        backgroundAudioRef.current.pause();
        setPreviewPlaying(false);
      } else {
        const selectedTrack = audioTracks.find(track => track.id === settings.backgroundMusic.track);
        if (selectedTrack) {
          backgroundAudioRef.current.src = selectedTrack.url;
          backgroundAudioRef.current.volume = settings.backgroundMusic.volume * settings.globalVolume;
          backgroundAudioRef.current.loop = settings.backgroundMusic.loop;
          backgroundAudioRef.current.play().catch(e => console.error('Play failed:', e));
          setPreviewPlaying(true);
        }
      }
    }
  };

  const handlePreviewMute = () => {
    const newMutedState = !previewMuted;
    setPreviewMuted(newMutedState);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = newMutedState || settings.globalMuted;
    }
  };

  const handlePreviewAutoPlay = () => {
    setSettings(prev => ({ ...prev, globalAutoPlay: !prev.globalAutoPlay }));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading audio configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audio Controls Management</h1>
            <p className="text-gray-600">Manage background music and sound effects</p>
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

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'tracks', label: 'Audio Files', icon: FileAudio },
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'controls', label: 'Controls', icon: Volume }
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

            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Audio Files Tab */}
              {activeTab === 'tracks' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Background Music</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'background');
                          }}
                        />
                        <Plus className="w-4 h-4" />
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      {audioTracks.filter(track => track.type === 'background').map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center flex-1">
                            <button
                              onClick={() => currentTrack === track.id && isPlaying ? handleStopTrack() : handlePlayTrack(track.id)}
                              className="p-1 rounded hover:bg-gray-100 mr-3"
                            >
                              {currentTrack === track.id && isPlaying ? (
                                <Pause className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Play className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{track.name}</p>
                              <p className="text-xs text-gray-500">{track.size} • {formatDuration(track.duration)}</p>
                            </div>
                          </div>
                          {!track.isDefault && (
                            <button
                              onClick={() => handleDeleteTrack(track.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Sound Effects</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'effect');
                          }}
                        />
                        <Plus className="w-4 h-4" />
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      {audioTracks.filter(track => track.type === 'effect').map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center flex-1">
                            <button
                              onClick={() => currentTrack === track.id && isPlaying ? handleStopTrack() : handlePlayTrack(track.id)}
                              className="p-1 rounded hover:bg-gray-100 mr-3"
                            >
                              {currentTrack === track.id && isPlaying ? (
                                <Pause className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Play className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{track.name}</p>
                              <p className="text-xs text-gray-500">{track.size} • {formatDuration(track.duration)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTrack(track.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Global Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Global Volume</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.globalVolume}
                            onChange={(e) => setSettings(prev => ({ ...prev, globalVolume: parseFloat(e.target.value) }))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500 w-8">{Math.round(settings.globalVolume * 100)}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Auto-play on Load</label>
                        <input
                          type="checkbox"
                          checked={settings.globalAutoPlay}
                          onChange={(e) => setSettings(prev => ({ ...prev, globalAutoPlay: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Muted by Default</label>
                        <input
                          type="checkbox"
                          checked={settings.globalMuted}
                          onChange={(e) => setSettings(prev => ({ ...prev, globalMuted: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Background Music</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Enable Background Music</label>
                        <input
                          type="checkbox"
                          checked={settings.backgroundMusic.enabled}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            backgroundMusic: { ...prev.backgroundMusic, enabled: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Track</label>
                        <select
                          value={settings.backgroundMusic.track}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            backgroundMusic: { ...prev.backgroundMusic, track: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          {audioTracks.filter(track => track.type === 'background').map((track) => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Volume</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.backgroundMusic.volume}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              backgroundMusic: { ...prev.backgroundMusic, volume: parseFloat(e.target.value) }
                            }))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500 w-8">{Math.round(settings.backgroundMusic.volume * 100)}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Loop</label>
                        <input
                          type="checkbox"
                          checked={settings.backgroundMusic.loop}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            backgroundMusic: { ...prev.backgroundMusic, loop: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Fade In</label>
                        <input
                          type="checkbox"
                          checked={settings.backgroundMusic.fadeIn}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            backgroundMusic: { ...prev.backgroundMusic, fadeIn: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Fade Out</label>
                        <input
                          type="checkbox"
                          checked={settings.backgroundMusic.fadeOut}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            backgroundMusic: { ...prev.backgroundMusic, fadeOut: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sound Effects</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Enable Sound Effects</label>
                        <input
                          type="checkbox"
                          checked={settings.soundEffects.enabled}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            soundEffects: { ...prev.soundEffects, enabled: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Volume</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.soundEffects.volume}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              soundEffects: { ...prev.soundEffects, volume: parseFloat(e.target.value) }
                            }))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500 w-8">{Math.round(settings.soundEffects.volume * 100)}%</span>
                        </div>
                      </div>
                    </div><div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hover Sound</label>
                      <select
                        value={settings.soundEffects.hoverSound}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          soundEffects: { ...prev.soundEffects, hoverSound: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">None</option>
                        {audioTracks.filter(track => track.type === 'effect').map((track) => (
                          <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Click Sound</label>
                      <select
                        value={settings.soundEffects.clickSound}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          soundEffects: { ...prev.soundEffects, clickSound: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">None</option>
                        {audioTracks.filter(track => track.type === 'effect').map((track) => (
                          <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transition Sound</label>
                      <select
                        value={settings.soundEffects.transitionSound}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          soundEffects: { ...prev.soundEffects, transitionSound: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">None</option>
                        {audioTracks.filter(track => track.type === 'effect').map((track) => (
                          <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls Tab */}
              {activeTab === 'controls' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Controls Visibility</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Show Play/Pause Button</label>
                        <input
                          type="checkbox"
                          checked={settings.controlsVisibility.showPlayPause}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            controlsVisibility: { ...prev.controlsVisibility, showPlayPause: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Show Volume Control</label>
                        <input
                          type="checkbox"
                          checked={settings.controlsVisibility.showVolumeControl}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            controlsVisibility: { ...prev.controlsVisibility, showVolumeControl: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Show Auto-play Toggle</label>
                        <input
                          type="checkbox"
                          checked={settings.controlsVisibility.showAutoPlayToggle}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            controlsVisibility: { ...prev.controlsVisibility, showAutoPlayToggle: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Show on Mobile</label>
                        <input
                          type="checkbox"
                          checked={settings.controlsVisibility.showOnMobile}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            controlsVisibility: { ...prev.controlsVisibility, showOnMobile: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Controls Position</label>
                        <select
                          value={settings.controlsVisibility.position}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            controlsVisibility: { ...prev.controlsVisibility, position: e.target.value as any }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
              <p className="text-sm text-gray-600">Preview how audio controls will appear in the gallery</p>
            </div>
            
            <div className="p-6">
              <div className="relative bg-gray-50 rounded-lg p-8 min-h-96">
                {/* Sample Gallery Content */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Film className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-gray-500 text-sm mb-4">
                  Gallery preview with audio controls
                </div>

                {/* Audio Controls Preview */}
                {(settings.controlsVisibility.showPlayPause || settings.controlsVisibility.showVolumeControl || settings.controlsVisibility.showAutoPlayToggle) && (
                  <div className={`absolute flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg ${
                    settings.controlsVisibility.position === 'top-left' ? 'top-4 left-4' :
                    settings.controlsVisibility.position === 'top-right' ? 'top-4 right-4' :
                    settings.controlsVisibility.position === 'bottom-left' ? 'bottom-4 left-4' :
                    'bottom-4 right-4'
                  }`}>
                    
                    {settings.controlsVisibility.showPlayPause && (
                      <button
                        onClick={handlePreviewPlayPause}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={previewPlaying ? 'Pause' : 'Play'}
                      >
                        {previewPlaying ? (
                          <Pause className="w-5 h-5 text-gray-700" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    )}
                    
                    {settings.controlsVisibility.showVolumeControl && (
                      <button
                        onClick={handlePreviewMute}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={previewMuted ? 'Unmute' : 'Mute'}
                      >
                        {previewMuted ? (
                          <VolumeX className="w-5 h-5 text-gray-700" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    )}
                    
                    {settings.controlsVisibility.showAutoPlayToggle && (
                      <button
                        onClick={handlePreviewAutoPlay}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={settings.globalAutoPlay ? 'Disable Auto-play' : 'Enable Auto-play'}
                      >
                        {settings.globalAutoPlay ? (
                          <Eye className="w-5 h-5 text-blue-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      settings.backgroundMusic.enabled && previewPlaying ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-gray-600">
                      {settings.backgroundMusic.enabled ? 
                        (previewPlaying ? 'Playing' : 'Paused') : 
                        'Disabled'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Elements */}
      <audio ref={audioRef} />
      <audio ref={backgroundAudioRef} />
      
      {/* Upload Progress */}
      {uploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium">Uploading Audio</p>
                <p className="text-sm text-gray-500">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}