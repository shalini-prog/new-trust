'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  User,
  Settings,
  Check
} from 'lucide-react';

// Admin Components (assuming these exist based on your structure)
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminButton from '@/components/admin/ui/AdminButton';

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
  isActive: boolean;
  rating: number;
  dateAdded: string;
  order: number;
}

interface TestimonialFormData {
  quote: string;
  name: string;
  role: string;
  image: string;
  isActive: boolean;
  rating: number;
  order: number;
}

interface SectionSettings {
  isEnabled: boolean;
  title: string;
  subtitle: string;
  autoScroll: boolean;
  scrollSpeed: number;
  showRatings: boolean;
  maxVisible: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      _id: '1',
      quote: "Donating to this organization was one of the most fulfilling experiences. I could actually see where my money went through their transparent reporting.",
      name: "Priya Sharma",
      role: "Monthly Donor",
      image: "/images/testimonials/donor1.jpg",
      isActive: true,
      rating: 5,
      dateAdded: "2025-01-15",
      order: 1
    },
    {
      _id: '2',
      quote: "As a corporate partner, we've seen firsthand the impact this organization makes. Their dedication to their mission is unparalleled.",
      name: "Rajesh Gupta",
      role: "Corporate Sponsor",
      image: "/images/testimonials/donor2.jpg",
      isActive: true,
      rating: 5,
      dateAdded: "2025-01-10",
      order: 2
    },
    {
      _id: '3',
      quote: "The donation process was smooth and easy. I appreciate how they send regular updates about the projects I've contributed to.",
      name: "Ananya Patel",
      role: "First-time Donor",
      image: "/images/testimonials/donor3.jpg",
      isActive: true,
      rating: 5,
      dateAdded: "2025-01-08",
      order: 3
    },
    {
      _id: '4',
      quote: "I've been donating monthly for two years now. The impact reports they share make me proud to be a part of this journey.",
      name: "Vikram Malhotra",
      role: "Long-term Supporter",
      image: "/images/testimonials/donor4.jpg",
      isActive: false,
      rating: 5,
      dateAdded: "2025-01-05",
      order: 4
    },
    {
      _id: '5',
      quote: "Their emergency response fund helped my community after the floods last year. Now I donate to help others in similar situations.",
      name: "Meena Reddy",
      role: "Community Member",
      image: "/images/testimonials/donor5.jpg",
      isActive: true,
      rating: 5,
      dateAdded: "2025-01-01",
      order: 5
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    quote: '',
    name: '',
    role: '',
    image: '',
    isActive: true,
    rating: 5,
    order: 1
  });

  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    isEnabled: true,
    title: "Donor Stories",
    subtitle: "Read what our donors have to say about their giving experience and the impact they've helped create.",
    autoScroll: true,
    scrollSpeed: 100,
    showRatings: true,
    maxVisible: 10
  });

  const [savedSettings, setSavedSettings] = useState<SectionSettings>({
    isEnabled: true,
    title: "Donor Stories",
    subtitle: "Read what our donors have to say about their giving experience and the impact they've helped create.",
    autoScroll: true,
    scrollSpeed: 100,
    showRatings: true,
    maxVisible: 10
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check if settings have changed
  const hasSettingsChanged = JSON.stringify(sectionSettings) !== JSON.stringify(savedSettings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, settingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/dtest'),
          fetch('http://localhost:5000/api/dtest/settings')
        ]);
        const testimonialsData = await testimonialsRes.json();
        const settingsData = await settingsRes.json();

        setTestimonials(testimonialsData);
        if (settingsData) {
          setSectionSettings(settingsData);
          setSavedSettings(settingsData);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setFormData({
      quote: '',
      name: '',
      role: '',
      image: '',
      isActive: true,
      rating: 5,
      order: testimonials.length + 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      quote: testimonial.quote,
      name: testimonial.name,
      role: testimonial.role,
      image: testimonial.image,
      isActive: testimonial.isActive,
      rating: testimonial.rating,
      order: testimonial.order
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dtest/toggle/${_id}`, { method: 'PATCH' });
      const updated = await res.json();
      setTestimonials(testimonials.map(t => t._id === updated._id ? updated : t));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isEdit = !!editingTestimonial;

  const payload: any = {
    ...formData,
    dateAdded: isEdit
      ? editingTestimonial!.dateAdded
      : new Date().toISOString().split('T')[0]
  };

  // Include `id` only if updating
  if (isEdit) {
    payload.id = editingTestimonial!._id; // send as `id`, not `_id`
  }

  try {
    const res = await fetch('http://localhost:5000/api/dtest/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const saved = await res.json();

    if (isEdit) {
      setTestimonials(testimonials.map(t => (t._id === saved._id ? saved : t)));
    } else {
      setTestimonials([...testimonials, saved]);
    }

    setIsModalOpen(false);
  } catch (error) {
    console.error('Failed to save testimonial:', error);
    alert('Failed to save testimonial. Please try again.');
  }
};


  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/dtest/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionSettings)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const saved = await res.json();
      setSavedSettings(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/dtest/${_id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setTestimonials(testimonials.filter(t => t._id !== _id));
    } catch (err) {
      console.error('Failed to delete testimonial', err);
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/dtest/upload-image', {
        method: 'POST',
        body: uploadFormData
      });

      if (!res.ok) throw new Error('Image upload failed');

      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Image upload failed. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const activeTestimonials = testimonials.filter(t => t.isActive);
  const inactiveTestimonials = testimonials.filter(t => !t.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage donor testimonials and reviews</p>
        </div>
        <AdminButton 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={handleAddNew}
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </AdminButton>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeTestimonials.length}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{inactiveTestimonials.length}</p>
            </div>
            <EyeOff className="w-8 h-8 text-gray-500" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {testimonials.length > 0 
                  ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </AdminCard>
      </div>

      {/* Section Settings */}
      <AdminCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Section Settings
          </h2>
          
          {/* Save Button and Status */}
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                Settings saved successfully!
              </div>
            )}
            <AdminButton
              onClick={handleSaveSettings}
              disabled={!hasSettingsChanged || isSaving}
              variant={hasSettingsChanged ? "primary" : "outline"}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </AdminButton>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={sectionSettings.title}
              onChange={(e) => setSectionSettings({...sectionSettings, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Visible Testimonials
            </label>
            <input
              type="number"
              value={sectionSettings.maxVisible}
              onChange={(e) => setSectionSettings({...sectionSettings, maxVisible: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={sectionSettings.subtitle}
              onChange={(e) => setSectionSettings({...sectionSettings, subtitle: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.isEnabled}
                onChange={(e) => setSectionSettings({...sectionSettings, isEnabled: e.target.checked})}
                className="mr-2"
              />
              Enable Section
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.autoScroll}
                onChange={(e) => setSectionSettings({...sectionSettings, autoScroll: e.target.checked})}
                className="mr-2"
              />
              Auto Scroll
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sectionSettings.showRatings}
                onChange={(e) => setSectionSettings({...sectionSettings, showRatings: e.target.checked})}
                className="mr-2"
              />
              Show Ratings
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scroll Speed (pixels per second)
            </label>
            <input
              type="number"
              value={sectionSettings.scrollSpeed}
              onChange={(e) => setSectionSettings({...sectionSettings, scrollSpeed: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="50"
              max="200"
            />
          </div>
        </div>
      </AdminCard>

      {/* Testimonials List */}
      <AdminCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Testimonials</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Donor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quote</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date Added</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.sort((a, b) => a.order - b.order).map((testimonial) => (
                <tr key={testimonial._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="text-sm text-gray-900 truncate">
                      "{testimonial.quote?.substring(0, 100) || 'No quote'}..."
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleStatus(testimonial._id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        testimonial.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{testimonial.order}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">
                      {new Date(testimonial.dateAdded).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(testimonial)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(testimonial._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter donor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role/Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Monthly Donor, Corporate Sponsor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Quote *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.quote}
                    onChange={(e) => setFormData({...formData, quote: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the testimonial quote..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </label>
                    {formData.image && (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <AdminButton
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </AdminButton>
                  <AdminButton
                    type="submit"
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingTestimonial ? 'Update' : 'Save'} Testimonial
                  </AdminButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}