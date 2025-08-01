'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  Eye,
  Users,
  Heart,
  Shield,
  Home,
  Briefcase,
  GraduationCap,
  Globe,
  Loader2
} from 'lucide-react';

interface Right {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  details: string[];
  status: 'active' | 'inactive';
  lastUpdated: string;
  views: number;
}

interface Scheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  category: string;
  applyLink: string;
  status: 'active' | 'closed' | 'upcoming';
  lastUpdated: string;
  applications: number;
}

interface Resource {
  _id: string;
  title: string;
  language: string;
  size: string;
  format: string;
  downloads: number;
  uploadDate: string;
  status: 'active' | 'inactive';
  fileUrl: string;
}

export default function LegalRightsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [eligibilityFilters, setEligibilityFilters] = useState({
    age: '',
    gender: '',
    category: '',
    income: ''
  });

  // State for API data
  const [rights, setRights] = useState<Right[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Rights', icon: <Globe className="w-4 h-4" /> },
    { id: 'fundamental', name: 'Fundamental Rights', icon: <Shield className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'employment', name: 'Employment', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'social', name: 'Social Rights', icon: <Users className="w-4 h-4" /> },
    { id: 'property', name: 'Property Rights', icon: <Home className="w-4 h-4" /> }
  ];

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'shield': <Shield className="w-6 h-6" />,
      'graduation-cap': <GraduationCap className="w-6 h-6" />,
      'eye': <Eye className="w-6 h-6" />,
      'briefcase': <Briefcase className="w-6 h-6" />,
      'users': <Users className="w-6 h-6" />,
      'home': <Home className="w-6 h-6" />,
      'heart': <Heart className="w-6 h-6" />,
      'book-open': <BookOpen className="w-6 h-6" />
    };
    return iconMap[iconName] || <Shield className="w-6 h-6" />;
  };

  // API functions
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rightsRes, schemesRes, resourcesRes] = await Promise.all([
        fetch('http://localhost:5000/api/legalsec/rights'),
        fetch('http://localhost:5000/api/legalsec/schemes'),
        fetch('http://localhost:5000/api/legalsec/resources')
      ]);

      if (!rightsRes.ok || !schemesRes.ok || !resourcesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [rightsData, schemesData, resourcesData] = await Promise.all([
        rightsRes.json(),
        schemesRes.json(),
        resourcesRes.json()
      ]);

      // Filter only active rights
      setRights(rightsData.filter((right: Right) => right.status === 'active'));
      setSchemes(schemesData);
      setResources(resourcesData.filter((resource: Resource) => resource.status === 'active'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update view count for a right
  const updateRightViews = async (rightId: string) => {
    try {
      const right = rights.find(r => r._id === rightId);
      if (right) {
        await fetch(`http://localhost:5000/api/legalsec/rights/${rightId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...right, views: right.views + 1 })
        });
        
        // Update local state
        setRights(prev => prev.map(r => 
          r._id === rightId ? { ...r, views: r.views + 1 } : r
        ));
      }
    } catch (err) {
      console.error('Error updating views:', err);
    }
  };

  // Download resource handler
  const handleDownload = async (resourceId: string) => {
    try {
      const resource = resources.find(r => r._id === resourceId);
      if (resource) {
        // Update download count
        await fetch(`http://localhost:5000/api/legalsec/resources/${resourceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...resource, downloads: resource.downloads + 1 })
        });

        // Update local state
        setResources(prev => prev.map(r => 
          r._id === resourceId ? { ...r, downloads: r.downloads + 1 } : r
        ));

        // Trigger download (you might want to implement actual file download)
        if (resource.fileUrl) {
          window.open(resource.fileUrl, '_blank');
        }
      }
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRights = rights.filter(right => 
    selectedCategory === 'all' || right.category === selectedCategory
  );

  const activeSchemes = schemes.filter(scheme => scheme.status === 'active');

  const checkEligibility = () => {
    // Enhanced eligibility checker logic based on filters
    const eligibleSchemes = schemes.filter(scheme => {
      if (scheme.status !== 'active') return false;
      
      // Add more sophisticated filtering logic here based on eligibilityFilters
      // This is a simplified version
      return true;
    });
    
    // You could show eligible schemes in a modal or separate section
    console.log('Eligible schemes:', eligibleSchemes);
    return eligibleSchemes;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading legal rights and schemes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Error loading data: {error}</p>
        <button 
          onClick={fetchData}
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
          Legal Rights & Government Schemes
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Understand your fundamental rights and discover government welfare schemes available for different categories
        </p>
      </div>

      {/* Rights Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Know Your Rights</h3>
          <span className="text-sm text-gray-500">({filteredRights.length} rights)</span>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Rights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRights.map((right, index) => (
            <motion.div
              key={right._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => updateRightViews(right._id)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {getIconComponent(right.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{right.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      {right.views}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{right.description}</p>
                  <div className="space-y-2">
                    {right.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                  {right.lastUpdated && (
                    <p className="text-xs text-gray-400 mt-3">
                      Last updated: {new Date(right.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRights.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No rights found for the selected category.
          </div>
        )}
      </div>

      {/* Scheme Eligibility Checker */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-8 h-8 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-800">Scheme Eligibility Checker</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <select 
              value={eligibilityFilters.age}
              onChange={(e) => setEligibilityFilters({...eligibilityFilters, age: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Age</option>
              <option value="0-18">0-18 years</option>
              <option value="18-35">18-35 years</option>
              <option value="35-60">35-60 years</option>
              <option value="60+">60+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select 
              value={eligibilityFilters.gender}
              onChange={(e) => setEligibilityFilters({...eligibilityFilters, gender: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              value={eligibilityFilters.category}
              onChange={(e) => setEligibilityFilters({...eligibilityFilters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="obc">OBC</option>
              <option value="minority">Minority</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
            <select 
              value={eligibilityFilters.income}
              onChange={(e) => setEligibilityFilters({...eligibilityFilters, income: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Income</option>
              <option value="0-2">Below ₹2 lakh</option>
              <option value="2-5">₹2-5 lakh</option>
              <option value="5-10">₹5-10 lakh</option>
              <option value="10+">Above ₹10 lakh</option>
            </select>
          </div>
        </div>

        <button
          onClick={checkEligibility}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          Check Eligible Schemes
        </button>
      </div>

      {/* Government Schemes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            <h3 className="text-2xl font-bold text-gray-800">Welfare Schemes</h3>
          </div>
          <div className="text-sm text-gray-600">
            Showing {activeSchemes.length} active schemes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeSchemes.map((scheme, index) => (
            <motion.div
              key={scheme._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-6 hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedScheme(scheme)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {scheme.name}
                  </h4>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    scheme.status === 'active' ? 'bg-green-100 text-green-800' :
                    scheme.status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {scheme.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {scheme.applications} applications
                  </div>
                  <motion.div
                    animate={{ rotate: selectedScheme?._id === scheme._id ? 45 : 0 }}
                    className="text-blue-600 mt-1"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{scheme.description}</p>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Key Benefits:</h5>
                  <div className="text-sm text-gray-600">
                    {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedScheme(scheme);
                    }}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {activeSchemes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active schemes available at the moment.
          </div>
        )}
      </div>

      {/* Downloadable Resources */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800">Downloadable Resources</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDownload(resource._id)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{resource.title}</h4>
                  <p className="text-sm text-gray-600">
                    {resource.format} • {resource.size} • {resource.language}
                  </p>
                  <p className="text-xs text-gray-400">
                    {resource.downloads} downloads
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No resources available for download.
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedScheme(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedScheme.name}</h3>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-6">{selectedScheme.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Eligibility Criteria:</h4>
                <ul className="space-y-1">
                  {selectedScheme.eligibility.map((criteria, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Benefits:</h4>
                <ul className="space-y-1">
                  {selectedScheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href={selectedScheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Online
                </a>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  Download Form
                </button>
              </div>

              {selectedScheme.lastUpdated && (
                <p className="text-xs text-gray-400 pt-4 border-t">
                  Last updated: {new Date(selectedScheme.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}