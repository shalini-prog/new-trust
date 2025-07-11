'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [floatingShapes, setFloatingShapes] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hero content from database
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ehero');
        if (!response.ok) {
          throw new Error('Failed to fetch hero content');
        }
        const data = await response.json();
        setHeroContent(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching hero content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  useEffect(() => {
    // Generate floating shapes based on database configuration
    if (heroContent && heroContent.floatingShape && heroContent.floatingShape.enabled) {
      const shapes = Array.from({ length: 5 }).map((_, index) => {
        const width = Math.random() * (heroContent.floatingShape.maxWidth - heroContent.floatingShape.minWidth) + heroContent.floatingShape.minWidth;
        const height = Math.random() * (heroContent.floatingShape.maxHeight - heroContent.floatingShape.minHeight) + heroContent.floatingShape.minHeight;
        
        return {
          id: index + 1,
          width,
          height,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          yMove: Math.random() * 100 - 50,
          xMove: Math.random() * 100 - 50,
          duration: Math.random() * 10 + 10,
          opacity: heroContent.floatingShape.opacity || 0.2,
          color: heroContent.floatingShape.color || 'white',
          shape: heroContent.floatingShape.shape || 'circle'
        };
      });
      
      setFloatingShapes(shapes);
    }
    setIsMounted(true);
  }, [heroContent]);

  // Helper function to get shape styles
  const getShapeStyles = (shape) => {
    const baseStyles = {
      width: shape.width,
      height: shape.height,
      top: shape.top,
      left: shape.left,
      opacity: shape.opacity,
      backgroundColor: shape.color,
    };

    switch (shape.shape) {
      case 'circle':
        return { ...baseStyles, borderRadius: '50%' };
      case 'square':
        return { ...baseStyles, borderRadius: '0' };
      case 'triangle':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          width: 0,
          height: 0,
          borderLeft: `${shape.width / 2}px solid transparent`,
          borderRight: `${shape.width / 2}px solid transparent`,
          borderBottom: `${shape.height}px solid ${shape.color}`,
        };
      default:
        return { ...baseStyles, borderRadius: '50%' };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
        <div className="text-white text-2xl">Error: {error}</div>
      </div>
    );
  }

  // Default fallback values if no content from database
  const defaultContent = {
    title: "📚 Competitive Exams Hub",
    subtitle: "Your Ultimate Guide to Success 🎯",
    description: "A one-stop destination for aspirants preparing for UPSC, SSC, Banking, Railways, State PSC, and other government exams with comprehensive study materials and preparation strategies.",
    primaryButtonText: "Start Learning",
    primaryButtonLink: "#study-plan",
    secondaryButtonText: "Join Community",
    secondaryButtonLink: "#discuss",
    backgroundGradientFrom: "from-blue-600",
    backgroundGradientTo: "to-purple-600",
    titleEmoji: "📚",
    subtitleEmoji: "🎯",
    useBackgroundImage: false,
    backgroundImage: ""
  };

  const content = heroContent || defaultContent;

  // Construct gradient classes
  const gradientClass = `bg-gradient-to-r ${content.backgroundGradientFrom} ${content.backgroundGradientTo}`;

  return (
    <div className={`relative h-screen overflow-hidden ${gradientClass}`}>
      {/* Background image if enabled */}
      {content.useBackgroundImage && content.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-grid.svg')] bg-repeat"></div>
      </div>
      
      {/* Floating shapes animation - only rendered after client-side mounting */}
      <div className="absolute inset-0 overflow-hidden">
        {isMounted && heroContent?.floatingShape?.enabled && floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute"
            style={getShapeStyles(shape)}
            animate={{
              y: [0, shape.yMove],
              x: [0, shape.xMove],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {content.titleEmoji} {content.title}
          </h1>
          <div className="bg-white/20 backdrop-blur-md py-2 px-4 rounded-full inline-block mb-6">
            <h2 className="text-xl md:text-2xl text-white">
              {content.subtitle} {content.subtitleEmoji}
            </h2>
          </div>
        </motion.div>
        
        <motion.p
          className="text-xl text-white/90 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {content.description}
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link 
            href={content.primaryButtonLink}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {content.primaryButtonText}
          </Link>
          <Link 
            href={content.secondaryButtonLink}
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            {content.secondaryButtonText}
          </Link>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    </div>
  );
}