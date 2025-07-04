'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

export default function HeroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dhero');
        if (!response.ok) {
          throw new Error('Failed to fetch hero banner settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching hero banner settings:', err);
        // Set default settings as fallback
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
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!settings) return;

    gsap.registerPlugin(TextPlugin);
    
    // Animate the text with typewriter effect if enabled
    if (settings.enableTypewriter && textRef.current) {
      gsap.to(textRef.current, {
        duration: settings.typewriterSpeed || 3,
        text: settings.subtitle,
        ease: "none",
        delay: 0.5
      });
    }
    
    // Subtle zoom animation for the video background
    if (bannerRef.current) {
      gsap.to(bannerRef.current, {
        scale: 1.05,
        duration: 10,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      });
    }
    
    return () => {
      // Clean up
      gsap.killTweensOf(textRef.current);
      gsap.killTweensOf(bannerRef.current);
    };
  }, [settings]);

  // Handle button click based on action type
  const handleButtonClick = () => {
    if (!settings) return;
    
    switch (settings.buttonAction) {
      case 'scroll':
        document.querySelector('.donate-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
        break;
      case 'link':
        if (settings.buttonLink) {
          window.open(settings.buttonLink, '_blank');
        }
        break;
      case 'popup':
        // You can implement popup logic here
        console.log('Popup action triggered');
        break;
      default:
        break;
    }
  };

  // Render video based on type
  const renderVideo = () => {
    if (!settings) return null;

    switch (settings.videoType) {
      case 'youtube':
        return (
          <iframe
            className="w-full h-full object-cover"
            src={`${settings.videoUrl}${settings.autoplay ? '?autoplay=1&mute=1' : ''}${settings.loop ? '&loop=1' : ''}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      case 'vimeo':
        return (
          <iframe
            className="w-full h-full object-cover"
            src={`${settings.videoUrl}${settings.autoplay ? '?autoplay=1&muted=1' : ''}${settings.loop ? '&loop=1' : ''}`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      case 'local':
      default:
        return (
          <video 
            className="w-full h-full object-cover"
            autoPlay={settings.autoplay}
            muted={settings.muted}
            loop={settings.loop}
            controls={settings.enableVideoControls}
            playsInline
          >
            <source src={settings.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen max-h-[800px] overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  if (error && !settings) {
    return (
      <section className="relative h-screen max-h-[800px] overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Error loading hero banner</div>
      </section>
    );
  }

  return (
    <section 
      className="relative overflow-hidden"
      style={{ 
        height: '100vh',
        maxHeight: `${settings.maxHeight}px` 
      }}
    >
      {/* Video Background */}
      <div ref={bannerRef} className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: settings.overlayOpacity / 100 }}
        ></div>
        {renderVideo()}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          style={{ color: settings.titleColor }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {settings.title}
        </motion.h1>
        
        <div 
          ref={textRef} 
          className="text-xl md:text-2xl lg:text-3xl font-light mb-10 h-16"
          style={{ color: settings.subtitleColor }}
        >
          {!settings.enableTypewriter && settings.subtitle}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button 
            className="px-8 py-4 font-bold rounded-full text-xl transition-all duration-300 shadow-lg"
            style={{ 
              backgroundColor: settings.buttonColor,
              color: settings.buttonTextColor
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" 
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                "0 5px 15px rgba(0, 0, 0, 0.1)", 
                "0 15px 25px rgba(0, 0, 0, 0.2)", 
                "0 5px 15px rgba(0, 0, 0, 0.1)"
              ],
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity } 
            }}
            onClick={handleButtonClick}
          >
            {settings.buttonText}
          </motion.button>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      {settings.enableScrollIndicator && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg 
            className="w-10 h-10" 
            style={{ color: settings.titleColor }}
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      )}
    </section>
  );
}