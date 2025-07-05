'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaSave,
  FaTimes,
  FaUpload,
  FaLinkedin,
  FaTwitter,
  FaPlay
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopperStory {
  id: string;
  name: string;
  rank: number;
  exam: string;
  batch: string;
  quote: string;
  image: string;
  videoUrl?: string;
  highlights: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface FormData extends Omit<TopperStory, 'id'> {
  id?: string;
}

export default function TopperStoriesAdmin() {
  const [stories, setStories] = useState<TopperStory[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      rank: 1,
      exam: 'UPSC CSE',
      batch: '2023',
      quote: 'Consistency and smart study strategy were the keys to my success.',
      image: '/api/placeholder/100/100',
      videoUrl: 'https://youtube.com/watch?v=example1',
      highlights: [
        'Followed a strict daily routine',
        'Focused on current affairs',
        'Regular mock test practice',
        'Maintained detailed notes'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/rajeshkumar',
        twitter: 'https://twitter.com/rajeshkumar'
      }
    },
    {
      id: '2',
      name: 'Priya Sharma',
      rank: 3,
      exam: 'SSC CGL',
      batch: '2023',
      quote: 'Hard work and dedication always pay off in the end.',
      image: '/api/placeholder/100/100',
      highlights: [
        'Time management was crucial',
        'Solved previous year papers',
        'Joined study groups',
        'Regular revision schedule'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/priyasharma'
      }
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<TopperStory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    rank: 1,
    exam: '',
    batch: '',
    quote: '',
    image: '',
    videoUrl: '',
    highlights: [''],
    socialLinks: {
      linkedin: '',
      twitter: ''
    }
  });

  const filteredStories = stories.filter(story =>
    story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.batch.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      rank: 1,
      exam: '',
      batch: '',
      quote: '',
      image: '',
      videoUrl: '',
      highlights: [''],
      socialLinks: {
        linkedin: '',
        twitter: ''
      }
    });
    setEditingStory(null);
  };

  const openModal = (story?: TopperStory) => {
    if (story) {
      setFormData({ ...story });
      setEditingStory(story);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({
      ...prev,
      highlights: newHighlights
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      highlights: newHighlights
    }));
  };

  const handleSocialLinkChange = (platform: 'linkedin' | 'twitter', value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStory) {
      // Update existing story
      setStories(prev => prev.map(story => 
        story.id === editingStory.id 
          ? { ...formData, id: editingStory.id } as TopperStory
          : story
      ));
    } else {
      // Add new story
      const newStory: TopperStory = {
        ...formData,
        id: Date.now().toString(),
        highlights: formData.highlights.filter(h => h.trim() !== '')
      };
      setStories(prev => [...prev, newStory]);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setStories(prev => prev.filter(story => story.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Topper Stories Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage success stories and interviews of top rankers
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <Button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <FaPlus /> Add New Story
          </Button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={story.image} alt={story.name} />
                    <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{story.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {story.exam} Rank {story.rank} ({story.batch})
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  "{story.quote}"
                </p>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {story.highlights.length} highlights
                  </p>
                  {story.videoUrl && (
                    <div className="flex items-center text-xs text-blue-600">
                      <FaPlay className="mr-1" /> Video available
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {story.socialLinks?.linkedin && (
                      <FaLinkedin className="text-blue-600 text-sm" />
                    )}
                    {story.socialLinks?.twitter && (
                      <FaTwitter className="text-blue-400 text-sm" />
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal(story)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(story.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No stories found.</p>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingStory ? 'Edit Story' : 'Add New Story'}
                  </h2>
                  <Button variant="ghost" onClick={closeModal}>
                    <FaTimes />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rank *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formData.rank}
                            onChange={(e) => handleInputChange('rank', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.batch}
                            onChange={(e) => handleInputChange('batch', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Exam *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.exam}
                          onChange={(e) => handleInputChange('exam', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Video URL
                        </label>
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>

                    {/* Quote and Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quote *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.quote}
                          onChange={(e) => handleInputChange('quote', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter inspirational quote..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Social Links
                        </label>
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={formData.socialLinks?.linkedin || ''}
                            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="LinkedIn URL"
                          />
                          <input
                            type="url"
                            value={formData.socialLinks?.twitter || ''}
                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Twitter URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Success Strategy Highlights
                      </label>
                      <Button type="button" onClick={addHighlight} size="sm">
                        <FaPlus className="mr-1" /> Add Highlight
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={`Highlight ${index + 1}`}
                          />
                          {formData.highlights.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeHighlight(index)}
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <Button type="button" variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FaSave className="mr-2" />
                      {editingStory ? 'Update Story' : 'Add Story'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}