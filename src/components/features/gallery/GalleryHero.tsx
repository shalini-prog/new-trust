'use client'
import { useEffect, useRef, useState } from 'react';

interface HeroSettings {
  backgroundType: 'video' | 'image';
  videoUrl?: string;
  imageUrl?: string;
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

export default function GalleryHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero settings from API
  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ghero');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching hero settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load hero settings');
        
        // Fallback to default settings if API fails
        const fallbackSettings: HeroSettings = {
          backgroundType: 'image',
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          title: 'Our Journey in Pictures',
          subtitle: 'Witness the impact of your contributions through our visual storytelling',
          overlayOpacity: 0.4,
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          titleColor: '#ffffff',
          subtitleColor: '#e5e7eb',
          titleSize: {
            mobile: '4xl',
            tablet: '6xl',
            desktop: '7xl'
          },
          subtitleSize: {
            mobile: 'xl',
            tablet: '2xl',
            desktop: '3xl'
          },
          animationDelay: {
            title: 0.3,
            subtitle: 0.6
          },
          autoplay: true,
          loop: true,
          muted: true
        };
        setSettings(fallbackSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSettings();
  }, []);

  // Animate elements when settings are loaded
  useEffect(() => {
    if (!settings) return;

    const animateElements = () => {
      // Animate overlay
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
        overlayRef.current.style.transition = 'opacity 1.5s ease-in-out';
        setTimeout(() => {
          if (overlayRef.current) {
            overlayRef.current.style.opacity = settings.overlayOpacity.toString();
          }
        }, 100);
      }

      // Animate title
      if (titleRef.current) {
        titleRef.current.style.opacity = '0';
        titleRef.current.style.transform = 'translateY(50px)';
        titleRef.current.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.style.opacity = '1';
            titleRef.current.style.transform = 'translateY(0)';
          }
        }, settings.animationDelay.title * 1000);
      }

      // Animate subtitle
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '0';
        subtitleRef.current.style.transform = 'translateY(30px)';
        subtitleRef.current.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
        setTimeout(() => {
          if (subtitleRef.current) {
            subtitleRef.current.style.opacity = '1';
            subtitleRef.current.style.transform = 'translateY(0)';
          }
        }, settings.animationDelay.subtitle * 1000);
      }
    };

    animateElements();
  }, [settings]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <div className="text-white text-xl">Loading hero content...</div>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <div className="text-gray-400 text-sm">Using fallback content</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Background Media */}
      {settings.backgroundType === 'video' && settings.videoUrl ? (
        <video
          ref={videoRef}
          autoPlay={settings.autoplay}
          muted={settings.muted}
          loop={settings.loop}
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={settings.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : settings.backgroundType === 'image' && settings.imageUrl ? (
        <img
          ref={imageRef}
          src={settings.imageUrl}
          alt="Hero background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: settings.overlayColor,
          opacity: 0
        }}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ color: settings.titleColor }}
        >
          {settings.title}
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-4xl leading-relaxed"
          style={{ color: settings.subtitleColor }}
        >
          {settings.subtitle}
        </p>
      </div>
    </div>
  );
}