'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Award, 
  Heart,
  TrendingUp,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  Target,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface ImpactStats {
  volunteersThisMonth: number;
  totalHours: number;
  projects: number;
  livesImpacted: number;
}

interface TopVolunteer {
  id: string;
  name: string;
  hours: number;
  badge: string;
  image: string;
  status: 'active' | 'inactive';
  joinDate: string;
  email: string;
}

// Add interface for analytics data
interface AnalyticsData {
  engagementRate: number;
  avgHoursPerVolunteer: number;
  previousEngagementRate?: number;
  previousAvgHours?: number;
}

export default function AdminImpactTrackerPage() {
  const [impactStats, setImpactStats] = useState<ImpactStats>({
    volunteersThisMonth: 230,
    totalHours: 10645,
    projects: 52,
    livesImpacted: 5280
  });

  const [editingStats, setEditingStats] = useState(false);
  const [tempStats, setTempStats] = useState<ImpactStats>(impactStats);

  const [topVolunteers, setTopVolunteers] = useState<TopVolunteer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      hours: 143,
      badge: 'Community Hero',
      image: '/avatars/volunteer-1.jpg',
      status: 'active',
      joinDate: '2023-06-15',
      email: 'sarah.j@email.com'
    },
    {
      id: '2',
      name: 'Michael Chen',
      hours: 126,
      badge: 'Teacher',
      image: '/avatars/volunteer-2.jpg',
      status: 'active',
      joinDate: '2023-07-20',
      email: 'michael.c@email.com'
    },
    {
      id: '3',
      name: 'Aisha Patel',
      hours: 118,
      badge: 'Environmental Champion',
      image: '/avatars/volunteer-3.jpg',
      status: 'inactive',
      joinDate: '2023-08-10',
      email: 'aisha.p@email.com'
    },
    {
      id: '4',
      name: 'David Wilson',
      hours: 107,
      badge: 'Mentor',
      image: '/avatars/volunteer-4.jpg',
      status: 'active',
      joinDate: '2023-09-05',
      email: 'david.w@email.com'
    }
  ]);

  const [editingVolunteer, setEditingVolunteer] = useState<string | null>(null);
  const [editingVolunteerData, setEditingVolunteerData] = useState<Partial<TopVolunteer>>({});
  const [newVolunteer, setNewVolunteer] = useState<Partial<TopVolunteer>>({
    status: 'active' // Default status for new volunteers
  });
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);

  // Add state for analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    engagementRate: 0,
    avgHoursPerVolunteer: 0
  });

  // Function to calculate dynamic analytics
  const calculateAnalytics = (stats: ImpactStats, volunteers: TopVolunteer[]): AnalyticsData => {
    // Calculate average hours per volunteer
    const totalVolunteers = volunteers.length;
    const avgHoursPerVolunteer = totalVolunteers > 0 ? stats.totalHours / stats.volunteersThisMonth : 0;

    // Calculate engagement rate (active volunteers / total volunteers)
    const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
    const engagementRate = totalVolunteers > 0 ? (activeVolunteers / totalVolunteers) * 100 : 0;

    return {
      engagementRate: Math.round(engagementRate * 10) / 10,
      avgHoursPerVolunteer: Math.round(avgHoursPerVolunteer * 10) / 10
    };
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vimpact');
        const data = await res.json();

        // Update state with fetched values
        const updatedStats = data.stats;
        const updatedVolunteers = data.topVolunteers.map((v: any) => ({
          ...v,
          id: v._id,
          joinDate: v.joinDate.split('T')[0]
        }));

        setImpactStats(updatedStats);
        setTempStats(updatedStats);
        setTopVolunteers(updatedVolunteers);

        // Calculate and set analytics data
        const analytics = calculateAnalytics(updatedStats, updatedVolunteers);
        setAnalyticsData(analytics);

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // Calculate analytics with current data if fetch fails
        const analytics = calculateAnalytics(impactStats, topVolunteers);
        setAnalyticsData(analytics);
      }
    };

    fetchDashboard();
  }, []);

  // Update analytics whenever stats or volunteers change
  useEffect(() => {
    const analytics = calculateAnalytics(impactStats, topVolunteers);
    setAnalyticsData(prevAnalytics => ({
      ...analytics,
      previousEngagementRate: prevAnalytics.engagementRate,
      previousAvgHours: prevAnalytics.avgHoursPerVolunteer
    }));
  }, [impactStats, topVolunteers]);

  const handleStatsUpdate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vimpact/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempStats)
      });

      const updatedStats = await res.json();
      setImpactStats(updatedStats);
      setEditingStats(false);
      
      // Recalculate analytics with updated stats
      const analytics = calculateAnalytics(updatedStats, topVolunteers);
      setAnalyticsData(prev => ({
        ...analytics,
        previousEngagementRate: prev.engagementRate,
        previousAvgHours: prev.avgHoursPerVolunteer
      }));
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  const handleStatsCancelEdit = () => {
    setTempStats(impactStats);
    setEditingStats(false);
  };

  const handleVolunteerEdit = (volunteer: TopVolunteer) => {
    setEditingVolunteer(volunteer.id);
    setEditingVolunteerData({
      name: volunteer.name,
      hours: volunteer.hours,
      badge: volunteer.badge,
      status: volunteer.status,
      email: volunteer.email
    });
  };

  const handleVolunteerUpdate = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vimpact/volunteers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVolunteerData)
      });

      const updated = await res.json();
      const newVolunteers = topVolunteers.map(vol => 
        vol.id === id ? { ...vol, ...editingVolunteerData, id: updated._id || vol.id } : vol
      );
      setTopVolunteers(newVolunteers);
      setEditingVolunteer(null);
      setEditingVolunteerData({});
      
      // Analytics will be automatically recalculated due to useEffect dependency
    } catch (err) {
      console.error('Error updating volunteer:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingVolunteer(null);
    setEditingVolunteerData({});
  };

  const handleAddVolunteer = async () => {
    if (newVolunteer.name && newVolunteer.hours && newVolunteer.badge && newVolunteer.email && newVolunteer.status) {
      try {
        const volunteerToAdd = {
          ...newVolunteer,
          joinDate: new Date().toISOString().split('T')[0]
        };

        const res = await fetch('http://localhost:5000/api/vimpact/volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(volunteerToAdd)
        });

        const addedVolunteer = await res.json();
        const newVolunteers = [...topVolunteers, {
          ...addedVolunteer,
          id: addedVolunteer._id || Date.now().toString(),
          joinDate: addedVolunteer.joinDate ? addedVolunteer.joinDate.split('T')[0] : volunteerToAdd.joinDate
        }];
        setTopVolunteers(newVolunteers);

        setNewVolunteer({ status: 'active' }); // Reset with default status
        setShowAddVolunteer(false);
        
        // Analytics will be automatically recalculated due to useEffect dependency
      } catch (err) {
        console.error('Error adding volunteer:', err);
      }
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/vimpact/volunteers/${id}`, {
        method: 'DELETE'
      });

      const newVolunteers = topVolunteers.filter(vol => vol.id !== id);
      setTopVolunteers(newVolunteers);
      
      // Analytics will be automatically recalculated due to useEffect dependency
    } catch (err) {
      console.error('Error deleting volunteer:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to refresh all data
  const handleRefreshData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vimpact');
      const data = await res.json();

      const updatedStats = data.stats;
      const updatedVolunteers = data.topVolunteers.map((v: any) => ({
        ...v,
        id: v._id,
        joinDate: v.joinDate.split('T')[0]
      }));

      setImpactStats(updatedStats);
      setTempStats(updatedStats);
      setTopVolunteers(updatedVolunteers);

      const analytics = calculateAnalytics(updatedStats, updatedVolunteers);
      setAnalyticsData(prev => ({
        ...analytics,
        previousEngagementRate: prev.engagementRate,
        previousAvgHours: prev.avgHoursPerVolunteer
      }));
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Tracker Management</h1>
            <p className="text-gray-600">Manage and monitor community impact metrics</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleRefreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Impact Stats Management */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Live Impact Statistics</h2>
          {!editingStats ? (
            <button 
              onClick={() => setEditingStats(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Stats</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleStatsUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button 
                onClick={handleStatsCancelEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-700">New Volunteers</h3>
            </div>
            {editingStats ? (
              <input
                type="number"
                value={tempStats.volunteersThisMonth}
                onChange={(e) => setTempStats({...tempStats, volunteersThisMonth: parseInt(e.target.value) || 0})}
                className="text-3xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <p className="text-4xl font-bold text-blue-600">{impactStats.volunteersThisMonth}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-3">
              <Clock className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-700">Hours Logged</h3>
            </div>
            {editingStats ? (
              <input
                type="number"
                value={tempStats.totalHours}
                onChange={(e) => setTempStats({...tempStats, totalHours: parseInt(e.target.value) || 0})}
                className="text-3xl font-bold text-purple-600 bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500 w-full"
              />
            ) : (
              <p className="text-4xl font-bold text-purple-600">{impactStats.totalHours.toLocaleString()}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Total hours</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-3">
              <Target className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-700">Active Projects</h3>
            </div>
            {editingStats ? (
              <input
                type="number"
                value={tempStats.projects}
                onChange={(e) => setTempStats({...tempStats, projects: parseInt(e.target.value) || 0})}
                className="text-3xl font-bold text-green-600 bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-green-500 w-full"
              />
            ) : (
              <p className="text-4xl font-bold text-green-600">{impactStats.projects}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Ongoing initiatives</p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
            <div className="flex items-center mb-3">
              <Heart className="h-6 w-6 text-amber-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-700">Lives Impacted</h3>
            </div>
            {editingStats ? (
              <input
                type="number"
                value={tempStats.livesImpacted}
                onChange={(e) => setTempStats({...tempStats, livesImpacted: parseInt(e.target.value) || 0})}
                className="text-3xl font-bold text-amber-600 bg-transparent border-b-2 border-amber-300 focus:outline-none focus:border-amber-500 w-full"
              />
            ) : (
              <p className="text-4xl font-bold text-amber-600">{impactStats.livesImpacted.toLocaleString()}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">People helped</p>
          </div>
        </div>
      </div>

      {/* Top Volunteers Management */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Top Volunteers Management</h2>
          <button 
            onClick={() => setShowAddVolunteer(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Volunteer</span>
          </button>
        </div>

        {/* Add New Volunteer Form */}
        {showAddVolunteer && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Add New Top Volunteer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newVolunteer.name || ''}
                onChange={(e) => setNewVolunteer({...newVolunteer, name: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newVolunteer.email || ''}
                onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Hours"
                value={newVolunteer.hours || ''}
                onChange={(e) => setNewVolunteer({...newVolunteer, hours: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Badge"
                value={newVolunteer.badge || ''}
                onChange={(e) => setNewVolunteer({...newVolunteer, badge: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newVolunteer.status || 'active'}
                onChange={(e) => setNewVolunteer({...newVolunteer, status: e.target.value as 'active' | 'inactive'})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={handleAddVolunteer}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Volunteer
              </button>
              <button 
                onClick={() => {setShowAddVolunteer(false); setNewVolunteer({ status: 'active' });}}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topVolunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        {editingVolunteer === volunteer.id ? (
                          <input
                            type="text"
                            value={editingVolunteerData.name || ''}
                            onChange={(e) => setEditingVolunteerData({...editingVolunteerData, name: e.target.value})}
                            className="text-sm font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVolunteer === volunteer.id ? (
                      <input
                        type="email"
                        value={editingVolunteerData.email || ''}
                        onChange={(e) => setEditingVolunteerData({...editingVolunteerData, email: e.target.value})}
                        className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{volunteer.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVolunteer === volunteer.id ? (
                      <input
                        type="number"
                        value={editingVolunteerData.hours || ''}
                        onChange={(e) => setEditingVolunteerData({...editingVolunteerData, hours: parseInt(e.target.value) || 0})}
                        className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-20"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{volunteer.hours}h</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVolunteer === volunteer.id ? (
                      <input
                        type="text"
                        value={editingVolunteerData.badge || ''}
                        onChange={(e) => setEditingVolunteerData({...editingVolunteerData, badge: e.target.value})}
                        className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {volunteer.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVolunteer === volunteer.id ? (
                      <select
                        value={editingVolunteerData.status || ''}
                        onChange={(e) => setEditingVolunteerData({...editingVolunteerData, status: e.target.value as 'active' | 'inactive'})}
                        className="text-sm bg-transparent border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(volunteer.status)}`}>
                        {volunteer.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(volunteer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {editingVolunteer === volunteer.id ? (
                        <>
                          <button 
                            onClick={() => handleVolunteerUpdate(volunteer.id)}
                            className="text-green-600 hover:text-green-900">
                            <Save className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleVolunteerEdit(volunteer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteVolunteer(volunteer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Engagement Rate</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {analyticsData.engagementRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analyticsData.previousEngagementRate && 
                      analyticsData.engagementRate > analyticsData.previousEngagementRate ? 
                      `↗ +${(analyticsData.engagementRate - analyticsData.previousEngagementRate).toFixed(1)}%` : 
                      analyticsData.previousEngagementRate && 
                      analyticsData.engagementRate < analyticsData.previousEngagementRate ? 
                      `↘ -${(analyticsData.previousEngagementRate - analyticsData.engagementRate).toFixed(1)}%` : 
                      'No change'
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Avg Hours/Volunteer</h3>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {analyticsData.avgHoursPerVolunteer}h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analyticsData.previousAvgHours && 
                      analyticsData.avgHoursPerVolunteer > analyticsData.previousAvgHours ? 
                      `↗ +${(analyticsData.avgHoursPerVolunteer - analyticsData.previousAvgHours).toFixed(1)}h` : 
                      analyticsData.previousAvgHours && 
                      analyticsData.avgHoursPerVolunteer < analyticsData.previousAvgHours ? 
                      `↘ -${(analyticsData.previousAvgHours - analyticsData.avgHoursPerVolunteer).toFixed(1)}h` : 
                      'No change'
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Active volunteers: {topVolunteers.filter(v => v.status === 'active').length}/{topVolunteers.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Total tracked hours: {impactStats.totalHours.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Impact ratio: {(impactStats.livesImpacted / impactStats.volunteersThisMonth).toFixed(1)} lives/volunteer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}