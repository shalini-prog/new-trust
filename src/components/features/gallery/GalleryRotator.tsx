// FILE: /components/features/gallery/GalleryRotator.tsx
'use client'

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Image from 'next/image';

// Types
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  uploadDate: string;
  tags: string[];
}

interface GalleryRotatorProps {
  autoPlay?: boolean;
  limit?: number;
  onItemClick?: (item: GalleryItem) => void;
}

export default function GalleryRotator({ 
  autoPlay = true, 
  limit = 10, 
  onItemClick 
}: GalleryRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL =  'http://localhost:5000';

  // Fetch rotating gallery items from database
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/gpage/rotating-gallery?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setItems(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch gallery items');
        }
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [limit, API_BASE_URL]);

  // Auto-rotate timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && items.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, items.length]);
  
  // Set up 3D rotation effect
  useEffect(() => {
    if (items.length === 0) return;
    
    gsap.registerPlugin(Draggable);
    
    if (rotatorRef.current && carouselRef.current) {
      // Create a 3D carousel effect
      const radius = 300;
      const cards = gsap.utils.toArray('.carousel-item');
      const angleStep = 360 / cards.length;
      
      // Position cards in a circle
      gsap.set(cards, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      
      // Initial layout
      positionCards(currentIndex);
      
      // Make the carousel draggable
      Draggable.create(carouselRef.current, {
        type: 'rotation',
        inertia: true,
        onDrag: updateRotation,
        onThrowUpdate: updateRotation,
      });
      
      function positionCards(centerIndex: number) {
        cards.forEach((card: any, index: number) => {
          const angle = (index - centerIndex) * angleStep;
          const angleRad = angle * Math.PI / 180;
          
          gsap.to(card, {
            x: Math.sin(angleRad) * radius,
            z: Math.cos(angleRad) * radius,
            rotationY: angle,
            scale: index === centerIndex ? 1.2 : 0.8,
            opacity: index === centerIndex ? 1 : 0.6,
            duration: 0.8,
            ease: 'power2.out',
          });
        });
      }
      
      function updateRotation() {
        const rotation = this.rotation % 360;
        const normalizedRotation = rotation < 0 ? rotation + 360 : rotation;
        const newIndex = Math.round(normalizedRotation / angleStep) % cards.length;
        
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    }
  }, [items.length, currentIndex]);
  
  // Update card positions when current index changes
  useEffect(() => {
    if (items.length === 0) return;
    
    if (rotatorRef.current) {
      const cards = gsap.utils.toArray('.carousel-item');
      const angleStep = 360 / cards.length;
      
      cards.forEach((card: any, index: number) => {
        const angle = (index - currentIndex) * angleStep;
        const angleRad = angle * Math.PI / 180;
        const radius = 300;
        
        gsap.to(card, {
          x: Math.sin(angleRad) * radius,
          z: Math.cos(angleRad) * radius,
          rotationY: angle,
          scale: index === currentIndex ? 1.2 : 0.8,
          opacity: index === currentIndex ? 1 : 0.6,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    }
  }, [currentIndex, items.length]);

  // Handle item click
  const handleItemClick = (item: GalleryItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Error Loading Gallery</h3>
          <p className="text-sm text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">No Gallery Items</h3>
          <p className="text-sm text-gray-300">No items found for the rotating gallery.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={rotatorRef} className="w-full h-[500px] relative perspective-1000">
      <div 
        ref={carouselRef} 
        className="w-full h-full absolute transform-style-3d cursor-grab active:cursor-grabbing"
      >
        {items.map((item, index) => (
          <div 
            key={`carousel-${item.id}`}
            className="carousel-item absolute w-64 h-80 rounded-lg overflow-hidden shadow-xl"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.category}</p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-white/20 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {items.map((_, index) => (
          <button
            key={`nav-${index}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}