import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, SkipBack, SkipForward } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: string;
  type: 'background' | 'effect';
  isDefault: boolean;
}

interface AudioConfig {
  audioTracks: AudioTrack[];
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

interface GalleryAudioControlsProps {
  isPlaying?: boolean;
  isMuted?: boolean;
  isAutoPlay?: boolean;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onToggleAutoPlay?: () => void;
}

export default function GalleryAudioControls({
  isPlaying: propIsPlaying,
  isMuted: propIsMuted,
  isAutoPlay: propIsAutoPlay,
  onTogglePlay: propOnTogglePlay,
  onToggleMute: propOnToggleMute,
  onToggleAutoPlay: propOnToggleAutoPlay
}: GalleryAudioControlsProps) {
  const [audioConfig, setAudioConfig] = useState<AudioConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(propIsPlaying || false);
  const [isMuted, setIsMuted] = useState(propIsMuted || false);
  const [isAutoPlay, setIsAutoPlay] = useState(propIsAutoPlay || true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio configuration on component mount
  useEffect(() => {
    fetchAudioConfig();
  }, []);

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const fetchAudioConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/gaudio');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const config = await response.json();
      setAudioConfig(config);
      
      // Set initial states from config
      setIsMuted(config.globalMuted);
      setIsAutoPlay(config.globalAutoPlay);
      setVolume(config.globalVolume);
      
      // Initialize audio with the first available track
      if (config.audioTracks && config.audioTracks.length > 0) {
        const defaultTrack = config.audioTracks.find(track => track.isDefault) || config.audioTracks[0];
        if (defaultTrack) {
          await initializeAudio(defaultTrack.url);
        }
      } else if (config.backgroundMusic.enabled && config.backgroundMusic.track) {
        await initializeAudio(config.backgroundMusic.track);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audio configuration';
      setError(errorMessage);
      console.error('Error fetching audio config:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeAudio = async (trackUrl: string) => {
    if (!audioRef.current) return;
    
    try {
      setError(null);
      
      // Validate URL
      if (!trackUrl || trackUrl.trim() === '') {
        throw new Error('Invalid audio track URL');
      }
      
      // Set audio source and properties
      audioRef.current.src = trackUrl;
      audioRef.current.volume = volume;
      audioRef.current.loop = audioConfig?.backgroundMusic.loop || true;
      audioRef.current.muted = isMuted;
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const audio = audioRef.current!;
        
        const onCanPlay = () => {
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = () => {
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };
        
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);
        
        // Load the audio
        audio.load();
        
        // Timeout after 10 seconds
        setTimeout(() => {
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          reject(new Error('Audio loading timeout'));
        }, 10000);
      });
      
      console.log('Audio initialized successfully:', trackUrl);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Audio initialization failed';
      setError(`Error initializing audio: ${errorMessage}`);
      console.error('Error initializing audio:', err);
    }
  };

  const handleTogglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Check if audio source exists
        if (!audioRef.current.src) {
          throw new Error('No audio source available');
        }
        
        await audioRef.current.play();
      }
      
      setError(null);
    } catch (err) {
      let errorMessage = 'Audio playback failed';
      
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotSupportedError':
            errorMessage = 'Audio format not supported by browser';
            break;
          case 'NotAllowedError':
            errorMessage = 'Audio playback blocked. Please interact with the page first.';
            break;
          case 'AbortError':
            errorMessage = 'Audio playback was aborted';
            break;
          default:
            errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error playing audio:', err);
    }
    
    // Call prop callback if provided
    if (propOnTogglePlay) {
      propOnTogglePlay();
    }
  };

  const handleToggleMute = () => {
    const newIsMuted = !isMuted;
    setIsMuted(newIsMuted);
    
    if (audioRef.current) {
      audioRef.current.muted = newIsMuted;
    }
    
    if (propOnToggleMute) {
      propOnToggleMute();
    }
  };

  const handleToggleAutoPlay = () => {
    const newIsAutoPlay = !isAutoPlay;
    setIsAutoPlay(newIsAutoPlay);
    
    if (propOnToggleAutoPlay) {
      propOnToggleAutoPlay();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (seekTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleNextTrack = () => {
    if (!audioConfig?.audioTracks || audioConfig.audioTracks.length === 0) return;
    
    const nextIndex = (currentTrackIndex + 1) % audioConfig.audioTracks.length;
    setCurrentTrackIndex(nextIndex);
    initializeAudio(audioConfig.audioTracks[nextIndex].url);
  };

  const handlePrevTrack = () => {
    if (!audioConfig?.audioTracks || audioConfig.audioTracks.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 ? audioConfig.audioTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    initializeAudio(audioConfig.audioTracks[prevIndex].url);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTrack = () => {
    if (!audioConfig?.audioTracks || audioConfig.audioTracks.length === 0) return null;
    return audioConfig.audioTracks[currentTrackIndex];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading audio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-2 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
        <div className="text-red-600 text-sm font-medium">Audio Error</div>
        <div className="text-red-500 text-xs text-center">{error}</div>
        <div className="flex space-x-2">
          <button
            onClick={fetchAudioConfig}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => setError(null)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const currentTrack = getCurrentTrack();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (isAutoPlay && audioConfig?.audioTracks && audioConfig.audioTracks.length > 1) {
            handleNextTrack();
          }
        }}
        onError={(e) => {
          const audio = e.target as HTMLAudioElement;
          let errorMessage = 'Audio playback error';
          
          if (audio.error) {
            switch (audio.error.code) {
              case audio.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Audio playback was aborted';
                break;
              case audio.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error while loading audio';
                break;
              case audio.error.MEDIA_ERR_DECODE:
                errorMessage = 'Audio decoding error';
                break;
              case audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Audio format not supported';
                break;
              default:
                errorMessage = 'Unknown audio error';
            }
          }
          
          setError(errorMessage);
          setIsPlaying(false);
        }}
        preload="metadata"
      />
      
      {/* Track Info */}
      {currentTrack && (
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-800 truncate">
            {currentTrack.name}
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full h-2 bg-transparent cursor-pointer appearance-none slider-thumb"
          style={{ marginTop: '-8px' }}
        />
      </div>
      
      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {audioConfig?.audioTracks && audioConfig.audioTracks.length > 1 && (
          <button
            onClick={handlePrevTrack}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            <SkipBack size={20} />
          </button>
        )}
        
        <button
          onClick={handleTogglePlay}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        {audioConfig?.audioTracks && audioConfig.audioTracks.length > 1 && (
          <button
            onClick={handleNextTrack}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        )}
      </div>
      
      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <button
          onClick={handleToggleAutoPlay}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
        >
          <Film size={18} className={isAutoPlay ? "text-purple-600" : ""} />
        </button>
      </div>
      
      {/* Status */}
      <div className="text-center mt-2">
        <div className="text-xs text-gray-500">
          {isAutoPlay ? "Auto-play enabled" : "Auto-play disabled"}
          {audioConfig?.audioTracks && audioConfig.audioTracks.length > 1 && (
            <span className="ml-2">
              Track {currentTrackIndex + 1} of {audioConfig.audioTracks.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}