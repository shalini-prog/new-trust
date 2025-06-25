'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, 
  Upload, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag, 
  FileText,
  Plus,
  Trash2,
  Save,
  Eye
} from 'lucide-react';

const AdminEventModal = ({ event, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    },
    imageUrl: '',
    price: 0,
    priceDetails: '',
    maxAttendees: 50,
    currentAttendees: 0,
    schedule: [],
    organizer: {
      name: '',
      role: '',
      avatar: ''
    },
    tags: [],
    isPublished: false
  });

  const [scheduleItem, setScheduleItem] = useState({ time: '', activity: '' });
  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined categories
  const categories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Networking',
    'Social',
    'Training',
    'Webinar',
    'Meeting',
    'Other'
  ];

  // Initialize form data
  useEffect(() => {
    if (event && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        date: event.date ? event.date.split('T')[0] : '',
        time: event.time || '',
        location: typeof event.location === 'string' 
          ? { name: event.location, address: '', city: '', state: '', zip: '' }
          : event.location || { name: '', address: '', city: '', state: '', zip: '' },
        imageUrl: event.imageUrl || '',
        price: event.price || 0,
        priceDetails: event.priceDetails || '',
        maxAttendees: event.maxAttendees || 50,
        currentAttendees: event.currentAttendees || 0,
        schedule: event.schedule || [],
        organizer: event.organizer || { name: '', role: '', avatar: '' },
        tags: event.tags || [],
        isPublished: event.isPublished || false
      });
      setImagePreview(event.imageUrl || '');
    }
  }, [event, mode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload/URL change
  const handleImageChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: value }));
    setImagePreview(value);
  };

  // Add schedule item
  const addScheduleItem = () => {
    if (scheduleItem.time && scheduleItem.activity) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, { ...scheduleItem }]
      }));
      setScheduleItem({ time: '', activity: '' });
    }
  };

  // Remove schedule item
  const removeScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.name.trim()) newErrors['location.name'] = 'Location name is required';
    if (formData.maxAttendees < 1) newErrors.maxAttendees = 'Max attendees must be at least 1';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Format the data for submission
      const eventData = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        updatedAt: new Date().toISOString(),
        ...(mode === 'create' && { 
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        })
      };

      await onSave(eventData);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format location for display
  const formatLocationDisplay = () => {
    const { name, address, city, state } = formData.location;
    const parts = [name, address, city, state].filter(Boolean);
    return parts.join(', ') || 'No location specified';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' && 'Create New Event'}
                {mode === 'edit' && 'Edit Event'}
                {mode === 'view' && 'Event Details'}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === 'create' && 'Fill in the details to create a new event'}
                {mode === 'edit' && 'Update the event information'}
                {mode === 'view' && 'View event information'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="Enter event title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="Describe your event"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.category ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.date ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time *
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.time ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                        />
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Name *
                        </label>
                        <input
                          type="text"
                          name="location.name"
                          value={formData.location.name}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors['location.name'] ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="Venue name"
                        />
                        {errors['location.name'] && <p className="text-red-500 text-sm mt-1">{errors['location.name']}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="location.address"
                          value={formData.location.address}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300 ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300 ${mode === 'view' ? 'bg-gray-50' : ''}`}
                            placeholder="City"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300 ${mode === 'view' ? 'bg-gray-50' : ''}`}
                            placeholder="State"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Event Image */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Image</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleImageChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300 ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                          <Image
                            src={imagePreview}
                            alt="Event preview"
                            fill
                            className="object-cover"
                            onError={() => setImagePreview('')}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Capacity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Capacity</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.price ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          />
                          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Attendees *
                          </label>
                          <input
                            type="number"
                            name="maxAttendees"
                            value={formData.maxAttendees}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.maxAttendees ? 'border-red-300' : 'border-gray-300'} ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          />
                          {errors.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Details
                        </label>
                        <input
                          type="text"
                          name="priceDetails"
                          value={formData.priceDetails}
                          onChange={handleInputChange}
                          disabled={mode === 'view'}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-300 ${mode === 'view' ? 'bg-gray-50' : ''}`}
                          placeholder="e.g., Includes lunch and materials"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Schedule */}
                  {mode !== 'view' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Schedule</h3>
                      
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={scheduleItem.time}
                            onChange={(e) => setScheduleItem(prev => ({ ...prev, time: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Time"
                          />
                          <input
                            type="text"
                            value={scheduleItem.activity}
                            onChange={(e) => setScheduleItem(prev => ({ ...prev, activity: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Activity description"
                          />
                          <button
                            type="button"
                            onClick={addScheduleItem}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {formData.schedule.length > 0 && (
                          <div className="space-y-2">
                            {formData.schedule.map((item, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div>
                                  <span className="font-medium text-sm">{item.time}</span>
                                  <span className="ml-3 text-gray-600">{item.activity}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeScheduleItem(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {mode === 'view' && formData.schedule.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Schedule</h3>
                      <div className="space-y-2">
                        {formData.schedule.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-sm">{item.time}</span>
                            <span className="ml-3 text-gray-600">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publishing Status */}
                  {mode !== 'view' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Publish this event (make it visible to users)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                
                {mode !== 'view' && (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{mode === 'create' ? 'Create Event' : 'Update Event'}</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminEventModal;