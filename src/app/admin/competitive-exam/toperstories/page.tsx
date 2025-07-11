'use client';

import { useState, useEffect, useRef } from 'react';
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
  FaPlay,
  FaImage,
  FaVideo
} from 'react-icons/fa';

interface TopperStory {
  _id: string;
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
    setImagePreview('');
    setVideoPreview('');
    setUploadingImage(false);
    setUploadingVideo(false);
  };

  // GET all stories
useEffect(() => {
  const fetchStories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/etop');
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };
  fetchStories();
}, []);


  const openModal = (story?: TopperStory) => {
    if (story) {
      setFormData({ ...story });
      setEditingStory(story);
      setImagePreview(story.image);
      setVideoPreview(story.videoUrl || '');
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

  const handleImageUpload = async (file: File) => {
  if (!file) return alert("No file selected!");

  const form = new FormData();
  form.append('image', file);

  try {
    const res = await fetch('http://localhost:5000/api/etop/upload-image', {
      method: 'POST',
      body: form
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');

    setFormData(prev => ({ ...prev, image: data.url }));
    setImagePreview(data.url);
  } catch (error: any) {
    console.error('Image upload error:', error);
    alert(error.message || 'Upload error');
  }
};

const handleVideoUpload = async (file: File) => {
  if (!file) return alert("No video file selected!");

  const form = new FormData();
  form.append('video', file); // ✅ field name must match backend: upload.single('video')

  try {
    const res = await fetch('http://localhost:5000/api/etop/upload-video', {
      method: 'POST',
      body: form
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Video upload failed');

    setFormData(prev => ({ ...prev, videoUrl: data.url }));
    setVideoPreview(data.url);
  } catch (error: any) {
    console.error('Video upload error:', error);
    alert(error.message || 'Video upload failed');
  }
};


  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideoPreview('');
    setFormData(prev => ({
      ...prev,
      videoUrl: ''
    }));
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
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

  const handleSubmit = async () => {
  if (!formData.name || !formData.exam || !formData.batch || !formData.quote) {
    alert('Please fill in all required fields');
    return;
  }

  const apiUrl = editingStory
    ? `http://localhost:5000/api/etop/${editingStory._id}`
    : 'http://localhost:5000/api/etop';

  const method = editingStory ? 'put' : 'post';

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (editingStory) {
      setStories(prev => prev.map(s => (s._id === editingStory._id ? data : s)));
    } else {
      setStories(prev => [...prev, data]);
    }
    closeModal();
  } catch (err) {
    console.error('Error saving story', err);
  }
};

  const handleDelete = async (_id: string) => {
  if (window.confirm('Are you sure you want to delete this story?')) {
    try {
      await fetch(`http://localhost:5000/api/etop/${_id}`, {
        method: 'DELETE'
      });
      setStories(prev => prev.filter(story => story._id !== _id));
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  }
};


  const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled = false }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'outline' | 'destructive' | 'ghost';
    size?: 'sm' | 'md';
    className?: string;
    disabled?: boolean;
  }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );

  const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );

  const Avatar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
  );

  const AvatarImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  );

  const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium">
      {children}
    </div>
  );

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
          
          <Button onClick={() => openModal()}>
            <FaPlus className="mr-2" /> Add New Story
          </Button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story._id} className="hover:shadow-lg transition-shadow">
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
                    <Button size="sm" variant="outline" onClick={() => openModal(story)}>
                      <FaEdit />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(story._id)}>
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

                <div className="space-y-6">
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

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Image
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              ref={imageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  }}
                              className="hidden"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => imageInputRef.current?.click()}
                              disabled={uploadingImage}
                            >
                              <FaImage className="mr-2" />
                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            </Button>
                            {imagePreview && (
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={removeImage}
                              >
                                <FaTimes />
                              </Button>
                            )}
                          </div>
                          {imagePreview && (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Success Story Video
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              ref={videoInputRef}
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleVideoUpload(file);
  }}
                              className="hidden"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => videoInputRef.current?.click()}
                              disabled={uploadingVideo}
                            >
                              <FaVideo className="mr-2" />
                              {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                            </Button>
                            {videoPreview && (
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={removeVideo}
                              >
                                <FaTimes />
                              </Button>
                            )}
                          </div>
                          {videoPreview && (
                            <div className="relative">
                              <video
                                src={videoPreview}
                                className="w-full max-w-xs h-32 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                                controls
                              />
                            </div>
                          )}
                        </div>
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
                    <Button type="submit" onClick={handleSubmit}>
                      <FaSave className="mr-2" />
                      {editingStory ? 'Update Story' : 'Add Story'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}