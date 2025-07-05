'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Eye, 
  User, 
  Filter, 
  Search, 
  Star,
  BookOpen,
  Code,
  Brain,
  Globe,
  PlayCircle,
  Bookmark,
  Share2,
  Radio
} from 'lucide-react';
import Image from 'next/image';

interface VideoLecture {
  id: number;
  title: string;
  instructor: string;
  category: string;
  description: string;
  duration: string;
  views: number;
  rating: number;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  uploadDate: string;
  isNew?: boolean;
}

interface LiveLecture {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  startTime: string;
  attendees: number;
  category: string;
  isLive: boolean;
}

export default function VideoLectureGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [filteredVideos, setFilteredVideos] = useState<VideoLecture[]>([]);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [liveLectures, setLiveLectures] = useState<LiveLecture[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'upsc', name: 'UPSC', icon: BookOpen },
    { id: 'ssc', name: 'SSC', icon: BookOpen },
    { id: 'banking', name: 'Banking', icon: Star },
    { id: 'coding', name: 'Programming', icon: Code },
    { id: 'skills', name: 'Life Skills', icon: Brain }
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const mockVideos: VideoLecture[] = [
    // ... (keep existing mockVideos array)
  ];

  const mockLiveLectures: LiveLecture[] = [
    {
      id: 101,
      title: 'UPSC Current Affairs Live Discussion',
      instructor: 'Dr. Priya Singh',
      thumbnail: '/api/placeholder/400/300',
      startTime: '2024-01-20T14:30:00',
      attendees: 1250,
      category: 'upsc',
      isLive: true
    },
    {
      id: 102,
      title: 'SSC Math Problem Solving Session',
      instructor: 'Prof. Rajesh Kumar',
      thumbnail: '/api/placeholder/400/300',
      startTime: '2024-01-20T16:00:00',
      attendees: 890,
      category: 'ssc',
      isLive: true
    },
    {
      id: 103,
      title: 'Banking Regulations Update',
      instructor: 'CA Anita Sharma',
      thumbnail: '/api/placeholder/400/300',
      startTime: '2024-01-21T11:00:00',
      attendees: 670,
      category: 'banking',
      isLive: false
    }
  ];

  useEffect(() => {
    // Filter videos
    let filtered = mockVideos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(video => video.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
    
    // Filter live lectures
    const filteredLive = selectedCategory === 'all' 
      ? mockLiveLectures 
      : mockLiveLectures.filter(lecture => lecture.category === selectedCategory);
    
    setLiveLectures(filteredLive.filter(lecture => lecture.isLive));
  }, [searchTerm, selectedCategory, selectedLevel]);

  // ... (keep existing helper functions: playVideo, bookmarkVideo, shareVideo, formatViews, getLevelColor)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          🎥 Free Video Lectures & Tutorials
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access expert-curated video lectures covering competitive exams, programming, and life skills
        </p>
      </motion.div>

      {/* Live Lectures Section */}
      {liveLectures.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500" />
            Live Lectures Happening Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {liveLectures.map((lecture) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-500 hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={lecture.thumbnail}
                    alt={lecture.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{lecture.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {lecture.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(lecture.attendees)} watching
                    </span>
                  </div>
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Join Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search videos, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Levels' : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Video Thumbnail */}
              <div className="relative overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Play Button Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: hoveredVideo === video.id ? 1 : 0.7, 
                    scale: hoveredVideo === video.id ? 1.2 : 1 
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <button
                    onClick={() => playVideo(video)}
                    className="p-4 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                  >
                    <PlayCircle className="w-12 h-12 text-blue-600" />
                  </button>
                </motion.div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                  {video.duration}
                </div>
                
                {/* New Badge */}
                {video.isNew && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    NEW
                  </div>
                )}
                
                {/* Level Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(video.level)}`}>
                  {video.level}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{video.instructor}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {video.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {video.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(video.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{video.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{video.uploadDate}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => playVideo(video)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-full font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Watch Now
                  </button>
                  
                  <button
                    onClick={() => bookmarkVideo(video)}
                    className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => shareVideo(video)}
                    className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No videos found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Featured Playlists */}
      <section className="mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">📺 Featured Playlists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'UPSC Complete Course', videos: 45, duration: '120+ hours' },
            { name: 'Python Mastery', videos: 32, duration: '80+ hours' },
            { name: 'Banking Exam Prep', videos: 28, duration: '65+ hours' }
          ].map((playlist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h4 className="text-xl font-bold mb-2">{playlist.name}</h4>
              <p className="text-purple-100 mb-4">{playlist.videos} videos • {playlist.duration}</p>
              <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                View Playlist
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}