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
import Link from 'next/link';

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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
  const fetchConfig = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gaudio');
      const data: AudioConfig = await res.json();

      setAudioTracks(data.audioTracks || []);
      setSettings({
        globalMuted: data.globalMuted,
        globalAutoPlay: data.globalAutoPlay,
        globalVolume: data.globalVolume,
        backgroundMusic: data.backgroundMusic,
        soundEffects: data.soundEffects,
        controlsVisibility: data.controlsVisibility
      });
    } catch (error) {
      console.error('Failed to load audio config', error);
    }
  };

  fetchConfig();
}, []);


  const handleSave = async () => {
  setIsSaving(true);

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
      throw new Error('Save failed');
    }

    // Optional: confirmation message or toast
  } catch (error) {
    console.error('Failed to save audio config:', error);
  } finally {
    setTimeout(() => setIsSaving(false), 1000);
  }
};


  const handlePlayTrack = (trackId: string) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (track && audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
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

 const [uploading, setUploading] = useState(false);

const handleFileUpload = async (file: File, type: 'background' | 'effect') => {
  setUploading(true);

  const formData = new FormData();
  formData.append('file', file); // ✅ field name matches backend
  formData.append('type', type); // optional type info

  try {
    const res = await fetch('http://localhost:5000/api/gaudio/upload-audio', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');

    const newTrack = await res.json();
    setAudioTracks(prev => [...prev, newTrack]); // add uploaded track to UI
  } catch (error) {
    console.error('Upload error:', error);
  } finally {
    setUploading(false);
  }
};




  const handleDeleteTrack = (trackId: string) => {
    setAudioTracks(prev => prev.filter(track => track.id !== trackId));
    if (currentTrack === trackId) {
      handleStopTrack();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                    </div>
                  </div>
                </div>
              )}

              {/* Controls Tab */}
              {activeTab === 'controls' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Control Visibility</h3>
                    
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
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Control Position</label>
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
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Audio Controls Preview</h2>
            
            {/* Mock Gallery Preview */}
            <div className="bg-gray-100 rounded-lg p-8 relative min-h-96">
              <div className="text-center text-gray-500 mb-8">
                <Music className="w-12 h-12 mx-auto mb-4" />
                <p>Gallery Preview Area</p>
                <p className="text-sm">Audio controls will appear here</p>
              </div>

              {/* Audio Controls Preview */}
              <div className={`absolute ${
                settings.controlsVisibility.position === 'top-left' ? 'top-4 left-4' :
                settings.controlsVisibility.position === 'top-right' ? 'top-4 right-4' :
                settings.controlsVisibility.position === 'bottom-left' ? 'bottom-4 left-4' :
                'bottom-4 right-4'
              }`}>
                <div className={`flex items-center space-x-4 ${!settings.controlsVisibility.showOnMobile ? 'hidden md:flex' : 'flex'}`}>
                  {settings.controlsVisibility.showPlayPause && (
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
                      {settings.globalAutoPlay && !settings.globalMuted ? 
                        <Pause size={20} /> : <Play size={20} />
                      }
                    </button>
                  )}
                  
                  {settings.controlsVisibility.showVolumeControl && (
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
                      {settings.globalMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                  
                  {settings.controlsVisibility.showAutoPlayToggle && (
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
                      <Film size={20} className={settings.globalAutoPlay ? "text-purple-600" : ""} />
                    </button>
                  )}
                  
                  <div className="text-sm text-gray-600 hidden md:block">
                    {settings.globalAutoPlay ? "Auto-play on" : "Auto-play off"}
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Settings Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Current Settings Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Global Volume:</span>
                  <span className="ml-2 font-medium">{Math.round(settings.globalVolume * 100)}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Auto-play:</span>
                  <span className="ml-2 font-medium">{settings.globalAutoPlay ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Background Music:</span>
                  <span className="ml-2 font-medium">{settings.backgroundMusic.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sound Effects:</span>
                  <span className="ml-2 font-medium">{settings.soundEffects.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for Preview */}
      <audio ref={audioRef} />
    </div>
  );
}