'use client'

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | { name?: string; city?: string; state?: string };
  category: string;
  imageUrl: string;
  maxAttendees: number;
  currentAttendees: number;
}

// Mock data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2025',
    description: 'Join industry leaders as we explore the latest trends in artificial intelligence, blockchain, and quantum computing. Network with professionals and discover breakthrough technologies.',
    date: '2025-07-15',
    location: 'San Francisco Convention Center, CA',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    maxAttendees: 500,
    currentAttendees: 387
  },
  {
    id: '2',
    title: 'Creative Design Workshop',
    description: 'A hands-on workshop focusing on modern UI/UX design principles, color theory, and user experience optimization for digital products.',
    date: '2025-07-22',
    location: { name: 'Design Studio Pro', city: 'New York', state: 'NY' },
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    maxAttendees: 50,
    currentAttendees: 35
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    description: 'Learn advanced digital marketing strategies including SEO, social media marketing, content creation, and analytics to grow your business online.',
    date: '2025-07-08',
    location: 'Marketing Hub, Austin, TX',
    category: 'Marketing',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    maxAttendees: 200,
    currentAttendees: 156
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Watch emerging startups pitch their innovative ideas to a panel of venture capitalists and angel investors. Great networking opportunity!',
    date: '2025-07-30',
    location: { city: 'Boston', state: 'MA' },
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    maxAttendees: 300,
    currentAttendees: 89
  },
  {
    id: '5',
    title: 'Photography Excellence Workshop',
    description: 'Master the art of professional photography with hands-on sessions covering lighting, composition, post-processing, and portfolio development.',
    date: '2025-07-12',
    location: 'Creative Arts Center, Los Angeles, CA',
    category: 'Arts',
    imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
    maxAttendees: 75,
    currentAttendees: 68
  },
  {
    id: '6',
    title: 'Health & Wellness Expo',
    description: 'Discover the latest in health technology, wellness practices, nutrition science, and fitness innovations. Includes free health screenings.',
    date: '2025-08-05',
    location: 'Wellness Center, Miami, FL',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    maxAttendees: 400,
    currentAttendees: 245
  },
  {
    id: '7',
    title: 'Cryptocurrency & Blockchain Conference',
    description: 'Deep dive into the world of digital currencies, DeFi protocols, NFTs, and blockchain technology with industry experts and developers.',
    date: '2025-07-18',
    location: { name: 'Crypto Convention Center', city: 'Las Vegas', state: 'NV' },
    category: 'Finance',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    maxAttendees: 600,
    currentAttendees: 423
  },
  {
    id: '8',
    title: 'Sustainable Living Workshop',
    description: 'Learn practical tips for eco-friendly living, sustainable practices, renewable energy solutions, and reducing your carbon footprint.',
    date: '2025-07-25',
    location: 'Green Community Center, Portland, OR',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    maxAttendees: 120,
    currentAttendees: 98
  },
  {
    id: '9',
    title: 'Gaming Industry Showcase',
    description: 'Experience the latest in game development, virtual reality, esports, and interactive entertainment. Try unreleased games and meet developers.',
    date: '2025-08-10',
    location: { city: 'Seattle', state: 'WA' },
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop',
    maxAttendees: 800,
    currentAttendees: 567
  },
  {
    id: '10',
    title: 'Culinary Arts Festival',
    description: 'A celebration of culinary excellence featuring renowned chefs, cooking demonstrations, wine tastings, and gourmet food experiences.',
    date: '2025-07-28',
    location: 'Culinary Institute, Napa Valley, CA',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    maxAttendees: 250,
    currentAttendees: 203
  }
];

interface EventCardProps {
  event: Event;
  viewMode?: 'grid' | 'list';
  onClick: () => void;
  delay?: number;
}

const EventCard = ({ event, viewMode = 'grid', onClick, delay = 0 }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Format location (handle both string and object locations)
  const formatLocation = (location: any) => {
    if (!location) return 'Location TBA';
    if (typeof location === 'string') return location;
    return location.name || `${location.city || ''}, ${location.state || ''}`.trim() || 'Location TBA';
  };
  
  // Calculate spots left
  const spotsLeft = event.maxAttendees - event.currentAttendees;
  const spotPercentage = (event.currentAttendees / event.maxAttendees) * 100;
  
  // Get days remaining
  const getDaysRemaining = () => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Check if the image URL is valid (not empty)
  const hasValidImage = event.imageUrl && event.imageUrl.trim() !== '';
  // Default placeholder image path
  const placeholderImage = '/images/event-placeholder.jpg';

  if (viewMode === 'list') {
    return (
      <motion.div 
        className="event-animate bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-64 h-48">
            {hasValidImage ? (
              <Image 
                src={event.imageUrl} 
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
              {event.category}
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-500 mb-3">{formatDate(event.date)} • {formatLocation(event.location)}</p>
              </div>
              
              <motion.div 
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Today'}
              </motion.div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex-1 pr-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Registration</span>
                  <span className="text-xs font-medium text-purple-600">{event.currentAttendees}/{event.maxAttendees}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${spotPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="event-animate bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-52">
        {hasValidImage ? (
          <Image 
            src={event.imageUrl} 
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
          {event.category}
        </div>
        
        <motion.div 
          className="absolute top-4 right-4 bg-white text-purple-800 px-3 py-1 rounded-full font-bold text-sm shadow-md"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Today'}
        </motion.div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-500 mb-3">{formatDate(event.date)} • {formatLocation(event.location)}</p>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">Registration</span>
          <span className="text-xs font-medium text-purple-600">{event.currentAttendees}/{event.maxAttendees}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-purple-600 h-2 rounded-full" 
            style={{ width: `${spotPercentage}%` }}
          ></div>
        </div>
        
        <motion.button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;