'use client'
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

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
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero settings from API
  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ghero');
        if (!response.ok) {
          throw new Error('Failed to fetch hero settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSettings();
  }, []);

  // Animate elements when settings are loaded
  useEffect(() => {
    if (!settings) return;

    const timeline = gsap.timeline();

    // Animate overlay
    timeline.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: settings.overlayOpacity, duration: 1.5 }
    );

    // Animate title
    timeline.fromTo(
      '.hero-content h1',
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        delay: settings.animationDelay.title 
      },
      '-=1.2'
    );

    // Animate subtitle
    timeline.fromTo(
      '.hero-content p',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        delay: settings.animationDelay.subtitle 
      },
      '-=1.0'
    );
  }, [settings]);

  // Generate responsive text size classes
  const getTitleSizeClasses = () => {
    if (!settings) return 'text-4xl md:text-6xl lg:text-7xl';
    return `text-${settings.titleSize.mobile} md:text-${settings.titleSize.tablet} lg:text-${settings.titleSize.desktop}`;
  };

  const getSubtitleSizeClasses = () => {
    if (!settings) return 'text-xl md:text-2xl';
    return `text-${settings.subtitleSize.mobile} md:text-${settings.subtitleSize.tablet} lg:text-${settings.subtitleSize.desktop}`;
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <>
      {/* Background Media */}
      {settings.backgroundType === 'video' && settings.videoUrl ? (
        <video
          ref={videoRef}
          autoPlay={settings.autoplay}
          muted={settings.muted}
          loop={settings.loop}
          className="absolute w-full h-full object-cover"
        >
          <source src={settings.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : settings.backgroundType === 'image' && settings.imageUrl ? (
        <img
          ref={imageRef}
          src={settings.imageUrl}
          alt="Hero background"
          className="absolute w-full h-full object-cover"
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
      <div className="hero-content relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <motion.h1
          className={`${getTitleSizeClasses()} font-bold mb-6`}
          style={{ color: settings.titleColor }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: settings.animationDelay.title }}
        >
          {settings.title}
        </motion.h1>
        <motion.p
          className={`${getSubtitleSizeClasses()} max-w-3xl`}
          style={{ color: settings.subtitleColor }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: settings.animationDelay.subtitle }}
        >
          {settings.subtitle}
        </motion.p>
      </div>
    </>
  );
}