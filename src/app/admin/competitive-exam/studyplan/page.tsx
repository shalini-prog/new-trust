'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  BookOpen,
  ClipboardCheck,
  Clock,
  Brain,
  HeartHandshake,
  UserCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Types
interface StudyStep {
  _id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const availableIcons = [
  { value: 'calendar-check', label: 'Calendar Check', icon: Calendar },
  { value: 'book-open', label: 'Book Open', icon: BookOpen },
  { value: 'clipboard-check', label: 'Clipboard Check', icon: ClipboardCheck },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'brain', label: 'Brain', icon: Brain },
  { value: 'heart-handshake', label: 'Heart Handshake', icon: HeartHandshake },
  { value: 'user-check', label: 'User Check', icon: UserCheck }
];

export default function StudyPlanAdmin() {
  const [studySteps, setStudySteps] = useState<StudyStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState<StudyStep | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'book-open'
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Simulate API calls
  useEffect(() => {
  const fetchSteps = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/eplan');
      setStudySteps(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      showNotification('error', 'Failed to fetch study steps');
    } finally {
      setIsLoading(false);
    }
  };

  fetchSteps();
}, []);


  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddNew = () => {
    setEditingStep(null);
    setFormData({ title: '', description: '', icon: 'book-open' });
    setShowModal(true);
  };

  const handleEdit = (step: StudyStep) => {
    setEditingStep(step);
    setFormData({
      title: step.title,
      description: step.description,
      icon: step.icon
    });
    setShowModal(true);
  };

  const handleSave = async () => {
  if (!formData.title.trim() || !formData.description.trim()) {
    showNotification('error', 'Please fill in all required fields');
    return;
  }

  try {
    if (editingStep) {
      // Update existing step
      await axios.put(`http://localhost:5000/api/eplan/${editingStep._id}`, formData);
      setStudySteps(steps =>
        steps.map(step =>
          step._id === editingStep._id ? { ...step, ...formData } : step
        )
      );
      showNotification('success', 'Study step updated successfully');
    } else {
      // Create new step
      const res = await axios.post('http://localhost:5000/api/eplan', formData);
      setStudySteps(steps => [...steps, res.data]);
      showNotification('success', 'New study step added successfully');
    }
  } catch (err) {
    console.error('Save Error:', err);
    showNotification('error', 'Failed to save study step');
  }

  setShowModal(false);
  setFormData({ title: '', description: '', icon: 'book-open' });
};


  const handleDelete = async (_id: number) => {
  if (!window.confirm('Are you sure you want to delete this study step?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/eplan/${_id}`);
    setStudySteps(steps => steps.filter(step => step._id !== _id));
    showNotification('success', 'Study step deleted successfully');
  } catch (err) {
    console.error('Delete Error:', err);
    showNotification('error', 'Failed to delete step');
  }
};


  const handleToggleActive = async (_id: number) => {
  try {
    const updatedStep = studySteps.find(step => step._id === _id);
    if (!updatedStep) return;

    await axios.put(`http://localhost:5000/api/eplan/${_id}`, {
      ...updatedStep,
      isActive: !updatedStep.isActive
    });

    setStudySteps(steps =>
      steps.map(step =>
        step._id === _id ? { ...step, isActive: !step.isActive } : step
      )
    );
  } catch (err) {
    console.error('Toggle Error:', err);
    showNotification('error', 'Failed to toggle step');
  }
};


  const moveStep = async (_id: number, direction: 'up' | 'down') => {
  const currentIndex = studySteps.findIndex(step => step._id === _id);
  if (
    (direction === 'up' && currentIndex === 0) ||
    (direction === 'down' && currentIndex === studySteps.length - 1)
  ) return;

  const newSteps = [...studySteps];
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  [newSteps[currentIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[currentIndex]];

  newSteps.forEach((step, index) => step.order = index + 1);
  setStudySteps(newSteps);

  try {
    await axios.post('http://localhost:5000/api/eplan/reorder', { steps: newSteps.map(({ _id, order }) => ({ _id, order })) });
    showNotification('success', 'Steps reordered successfully');
  } catch (err) {
    console.error('Reorder Error:', err);
    showNotification('error', 'Failed to reorder steps');
  }
};


  const getIconComponent = (iconName: string) => {
    const iconObj = availableIcons.find(icon => icon.value === iconName);
    if (iconObj) {
      const IconComponent = iconObj.icon;
      return <IconComponent className="w-6 h-6" />;
    }
    return <BookOpen className="w-6 h-6" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Plan Management</h1>
          <p className="text-gray-600 mt-2">Manage study plan steps and preparation guidelines</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Study Step
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-6 p-4 rounded-lg flex items-center ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {notification.message}
        </motion.div>
      )}

      {/* Study Steps List */}
      <div className="space-y-4">
        {studySteps.map((step, index) => (
          <motion.div
            key={step._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg border shadow-sm p-6 ${
              !step.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {getIconComponent(step.icon)}
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Step {step.order}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {step.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Move buttons */}
                <button
                  onClick={() => moveStep(step._id, 'up')}
                  disabled={index === 0}
                  className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveStep(step._id, 'down')}
                  disabled={index === studySteps.length - 1}
                  className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                
                {/* Action buttons */}
                <button
                  onClick={() => handleToggleActive(step._id)}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    step.isActive ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(step)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(step._id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingStep ? 'Edit Study Step' : 'Add New Study Step'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter step title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter step description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {availableIcons.map((iconOption) => {
                      const IconComponent = iconOption.icon;
                      return (
                        <button
                          key={iconOption.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconOption.value })}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-1 hover:bg-gray-50 ${
                            formData.icon === iconOption.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300'
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                          <span className="text-xs">{iconOption.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingStep ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {studySteps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study steps found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first study step.</p>
          <button
            onClick={handleAddNew}
            className="flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Study Step
          </button>
        </div>
      )}
    </div>
  );
}