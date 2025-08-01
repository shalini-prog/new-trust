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
  image: string;
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface GalleryRotatorProps {
  autoPlay?: boolean;
  onItemClick?: (item: GalleryItem) => void;
  apiEndpoint?: string;
  showCategoryFilter?: boolean;
  showModal?: boolean;
}

// Custom hook for gallery data
const useGalleryData = (apiEndpoint: string = 'http://localhost:5000/api/gpage') => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch items and categories concurrently
      const [itemsResponse, categoriesResponse] = await Promise.all([
        fetch(`${apiEndpoint}/items`),
        fetch(`${apiEndpoint}/categories`)
      ]);

      if (!itemsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [itemsData, categoriesData] = await Promise.all([
        itemsResponse.json(),
        categoriesResponse.json()
      ]);

      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  return {
    items,
    categories,
    loading,
    error,
    refetch: fetchData
  };
};

// Gallery Rotator Component
const GalleryRotator = ({ 
  autoPlay = true, 
  onItemClick,
  apiEndpoint = 'http://localhost:5000/api/gpage',
  showCategoryFilter = true,
  showModal = true
}: GalleryRotatorProps) => {
  const { items, categories, loading, error, refetch } = useGalleryData(apiEndpoint);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const rotatorRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category._id === selectedCategory);
  
  // Auto-rotate timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && filteredItems.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, filteredItems.length]);
  
  // Set up 3D rotation effect
  useEffect(() => {
    if (filteredItems.length === 0) return;
    
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
  }, [filteredItems.length, currentIndex]);
  
  // Update card positions when current index changes
  useEffect(() => {
    if (rotatorRef.current && filteredItems.length > 0) {
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
  }, [currentIndex, filteredItems.length]);
  
  // Handle item click
  const handleItemClick = (item: GalleryItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
    if (showModal) {
      setSelectedItem(item);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);
  
  // Loading state
  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Gallery</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (items.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <div>No gallery items found</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Category Filter */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="mb-8 flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All ({items.length})
            </button>
            {categories.map(category => {
              const categoryCount = items.filter(item => item.category._id === category._id).length;
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category._id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name} ({categoryCount})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gallery Rotator */}
      {filteredItems.length > 0 ? (
        <div ref={rotatorRef} className="w-full h-[500px] relative perspective-1000">
          <div 
            ref={carouselRef} 
            className="w-full h-full absolute transform-style-3d cursor-grab active:cursor-grabbing"
          >
            {filteredItems.map((item, index) => (
              <div 
                key={`carousel-${item.id}`}
                className="carousel-item absolute w-64 h-80 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-200">{item.category.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
            {filteredItems.map((_, index) => (
              <button
                key={`nav-${index}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          {/* Item Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {filteredItems.length}
          </div>
        </div>
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <p>No items found in this category</p>
          </div>
        </div>
      )}

      {/* Modal for selected item */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="mb-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  Category: {selectedItem.category.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryRotator;