'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Users, 
  Phone, 
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Volume2,
  Languages,
  Eye,
  Accessibility,
  Download,
  Play
} from 'lucide-react';

interface HelplineService {
  _id: string;
  name: string;
  category: string;
  phone: string;
  hours: string;
  languages: string[];
  services: string[];
  isEmergency: boolean;
  isActive: boolean;
  totalCalls?: number;
}

interface LegalAidCenter {
  _id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  services: string[];
  timings: string;
  isActive: boolean;
  capacity?: number;
  currentCases?: number;
}

interface SupportResource {
  _id: string;
  title: string;
  type: string;
  size: string;
  downloads: string;
  category: string;
  isActive: boolean;
  lastUpdated: string;
  fileUrl?: string;
  videoUrl?: string;
}

interface ApiData {
  helplines: HelplineService[];
  centers: LegalAidCenter[];
  resources: SupportResource[];
}

export default function LegalAidSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('women');
  const [selectedHelpline, setSelectedHelpline] = useState<HelplineService | null>(null);
  const [data, setData] = useState<ApiData>({ helplines: [], centers: [], resources: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingResources, setDownloadingResources] = useState<Set<string>>(new Set());

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/aid/all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { id: 'women', name: 'Women Support', icon: <Heart className="w-5 h-5" />, color: 'pink' },
    { id: 'seniors', name: 'Senior Citizens', icon: <Users className="w-5 h-5" />, color: 'blue' },
    { id: 'sc-st', name: 'SC/ST Support', icon: <Shield className="w-5 h-5" />, color: 'green' },
    { id: 'disabled', name: 'Disabled Rights', icon: <Accessibility className="w-5 h-5" />, color: 'purple' },
    { id: 'child', name: 'Child Protection', icon: <Heart className="w-5 h-5" />, color: 'orange' }
  ];

  // Filter active helplines by category
  const filteredHelplines = data.helplines.filter(
    helpline => helpline.category === selectedCategory && helpline.isActive
  );

  // Filter active centers
  const activeCenters = data.centers.filter(center => center.isActive);

  // Filter active resources
  const activeResources = data.resources.filter(resource => resource.isActive);

  const emergencySteps = [
    {
      step: 1,
      title: 'Immediate Safety',
      description: 'If in immediate danger, call 100 (Police) or 108 (Emergency)',
      icon: <Phone className="w-6 h-6" />,
      color: 'red'
    },
    {
      step: 2,
      title: 'Document Evidence',
      description: 'Take photos, keep records, and preserve any evidence',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue'
    },
    {
      step: 3,
      title: 'Contact Helpline',
      description: 'Call the relevant helpline for specialized support',
      icon: <Phone className="w-6 h-6" />,
      color: 'green'
    },
    {
      step: 4,
      title: 'Legal Assistance',
      description: 'Visit nearest Legal Aid Center for free legal help',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple'
    }
  ];

  const handleResourceDownload = async (resource: SupportResource) => {
    const resourceId = resource._id;
    
    // Prevent multiple simultaneous downloads of the same resource
    if (downloadingResources.has(resourceId)) {
      return;
    }

    try {
      setDownloadingResources(prev => new Set(prev).add(resourceId));

      if (resource.type.toLowerCase() === 'video' && resource.videoUrl) {
        // For videos, open in new tab (can't directly download streaming videos)
        window.open(resource.videoUrl, '_blank');
        return;
      }

      if (!resource.fileUrl) {
        alert('Download URL not available for this resource.');
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      
      // Extract filename from URL or use resource title
      const urlParts = resource.fileUrl.split('/');
      const filename = urlParts[urlParts.length - 1] || `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      
      link.download = filename;
      link.target = '_blank';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: Update download count (if you want to track this)
      // You could make an API call here to increment the download counter
      console.log(`Downloaded: ${resource.title}`);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the resource. Please try again.');
    } finally {
      // Remove from downloading set after a short delay
      setTimeout(() => {
        setDownloadingResources(prev => {
          const newSet = new Set(prev);
          newSet.delete(resourceId);
          return newSet;
        });
      }, 1000);
    }
  };

  const handleResourceAccess = (resource: SupportResource) => {
    if (resource.type.toLowerCase() === 'video' && resource.videoUrl) {
      window.open(resource.videoUrl, '_blank');
    } else if (resource.fileUrl) {
      handleResourceDownload(resource);
    } else {
      alert('Resource not available.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Legal Aid for Vulnerable Groups
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Specialized legal services and support for women, seniors, and underprivileged communities
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Helplines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-medium">Police:</span>
                <a href="tel:100" className="text-red-700 font-bold">100</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-medium">Women Helpline:</span>
                <a href="tel:181" className="text-red-700 font-bold">181</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-medium">Child Helpline:</span>
                <a href="tel:1098" className="text-red-700 font-bold">1098</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Support Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? `bg-${category.color}-100 border-2 border-${category.color}-500 text-${category.color}-800`
                  : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {category.icon}
                <span className="text-sm">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helplines for Selected Category */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            {categories.find(c => c.id === selectedCategory)?.name} Helplines
          </h3>
        </div>

        {filteredHelplines.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No helplines available for this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHelplines.map((helpline, index) => (
              <motion.div
                key={helpline._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedHelpline(helpline)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{helpline.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <a 
                        href={`tel:${helpline.phone}`}
                        className="text-2xl font-bold text-green-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {helpline.phone}
                      </a>
                    </div>
                  </div>
                  {helpline.isEmergency && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Emergency
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{helpline.hours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm">{helpline.languages.join(', ')}</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Services Available:</p>
                    <div className="flex flex-wrap gap-1">
                      {helpline.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {helpline.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{helpline.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {helpline.totalCalls && (
                    <div className="text-sm text-gray-500">
                      Total calls handled: {helpline.totalCalls.toLocaleString()}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <a
                      href={`tel:${helpline.phone}`}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-center font-medium rounded-lg hover:bg-green-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Call Now
                    </a>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      More Info
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Process Steps */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h3 className="text-2xl font-bold text-gray-800">Emergency Response Steps</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencySteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 bg-${step.color}-100 rounded-full text-${step.color}-600`}>
                  {step.icon}
                </div>
                <div className={`w-8 h-8 bg-${step.color}-600 text-white rounded-full flex items-center justify-center font-bold`}>
                  {step.step}
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rights in Simple Language */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800">Rights in Simple Language</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Women\'s Rights',
              rights: [
                'Right to live without violence',
                'Equal pay for equal work',
                'Protection from sexual harassment',
                'Right to property and inheritance'
              ],
              color: 'pink'
            },
            {
              title: 'Senior Citizens Rights',
              rights: [
                'Right to maintenance from children',
                'Protection from abuse and neglect',
                'Right to pension and healthcare',
                'Priority in government services'
              ],
              color: 'blue'
            },
            {
              title: 'SC/ST Rights',
              rights: [
                'Protection from atrocities',
                'Reservation in education and jobs',
                'Special courts for quick justice',
                'Free legal aid and support'
              ],
              color: 'green'
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-${category.color}-50 border border-${category.color}-200 rounded-lg p-6`}
            >
              <h4 className={`text-lg font-bold text-${category.color}-800 mb-4`}>{category.title}</h4>
              <ul className="space-y-2">
                {category.rights.map((right, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-${category.color}-700`}>
                    <div className={`w-2 h-2 bg-${category.color}-500 rounded-full mt-2`}></div>
                    <span className="text-sm">{right}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legal Aid Centers */}
      {activeCenters.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-800">Nearby Legal Aid Centers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCenters.map((center, index) => (
              <motion.div
                key={center._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{center.name}</h4>
                    <p className="text-gray-600 mt-1">{center.district}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${center.phone}`} className="font-medium hover:underline">
                        {center.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600">{center.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{center.timings}</p>
                  </div>

                  {center.capacity && center.currentCases && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Capacity: <span className="font-medium">{center.capacity}</span>
                      </span>
                      <span className="text-gray-600">
                        Current Cases: <span className="font-medium">{center.currentCases}</span>
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Get Directions
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      <div className="bg-purple-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Accessibility className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800">Accessibility Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-gray-800">Voice Support</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Use voice commands to navigate and get audio descriptions of legal processes.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Enable Voice
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-gray-800">Screen Reader</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Optimized for screen readers with clear headings and alt text for all images.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Optimize Display
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Languages className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-gray-800">Multi-Language</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Available in Hindi, English, and regional languages with easy translation.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Change Language
            </button>
          </div>
        </div>
      </div>

      {/* Helpline Detail Modal */}
      {selectedHelpline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedHelpline(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedHelpline.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <a 
                    href={`tel:${selectedHelpline.phone}`}
                    className="text-2xl font-bold text-green-600 hover:underline"
                  >
                    {selectedHelpline.phone}
                  </a>
                  {selectedHelpline.isEmergency && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full ml-2">
                      Emergency
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedHelpline(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Available: {selectedHelpline.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Languages className="w-5 h-5" />
                  <span>Languages: {selectedHelpline.languages.join(', ')}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3">Services Available:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedHelpline.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedHelpline.totalCalls && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This helpline has handled <span className="font-bold text-gray-800">{selectedHelpline.totalCalls.toLocaleString()}</span> calls successfully.
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3">What to Expect:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Trained counselors available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Confidential and free support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Multilingual assistance available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Referrals to local support services</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href={`tel:${selectedHelpline.phone}`}
                  className="flex-1 px-6 py-3 bg-green-600 text-white text-center font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Call Now
                </a>
                <button 
                  onClick={() => setSelectedHelpline(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Support Resources */}
      {activeResources.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-800">Support Resources</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeResources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.type.toLowerCase() === 'video' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {resource.type}
                      </span>
                      <span>•</span>
                      <span>{resource.size}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Category: <span className="font-medium">{resource.category}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleResourceAccess(resource)}
                      disabled={downloadingResources.has(resource._id)}
                      className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        downloadingResources.has(resource._id)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : resource.type.toLowerCase() === 'video'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {downloadingResources.has(resource._id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : resource.type.toLowerCase() === 'video' ? (
                        <>
                          <Play className="w-4 h-4" />
                          Watch Video
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Immediate Help?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you're in immediate danger or need urgent legal assistance, don't hesitate to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Emergency Call</h4>
            <p className="text-sm text-gray-600 mb-4">
              For immediate danger or emergency situations
            </p>
            <a
              href="tel:100"
              className="inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Call 100
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Support Helpline</h4>
            <p className="text-sm text-gray-600 mb-4">
              24/7 counseling and emotional support
            </p>
            <a
              href="tel:181"
              className="inline-block px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Call 181
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Legal Aid Center</h4>
            <p className="text-sm text-gray-600 mb-4">
              Free legal consultation and representation
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Find Center
            </button>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center py-8">
        <p className="text-gray-600">
          Remember: Legal aid is your right. Don't hesitate to seek help when you need it.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          All services listed are confidential and free of charge.
        </p>
      </div>
    </div>
  );
}