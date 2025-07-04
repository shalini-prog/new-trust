'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  BarChart3, 
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Settings,
  Info
} from 'lucide-react';

// Mock admin components (you'll need to import these from your actual admin UI library)
const AdminCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const AdminButton = ({ children, variant = "primary", className = "", onClick, disabled = false }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface ImpactStat {
  _id: string;
  stat: number;
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  color: string;
  isActive: boolean;
}

interface MonthlyGoal {
  goal: number;
  currentRaised: number;
  currency: string;
  targetMonth: string;
}

export default function ImpactMeterAdminPage() {
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([
    { 
      id: '1',
      stat: 25000, 
      label: 'Children Helped', 
      icon: '👧', 
      prefix: '', 
      suffix: '+',
      color: 'from-blue-600 to-purple-600',
      isActive: true
    },
    { 
      id: '2',
      stat: 150, 
      label: 'Community Projects', 
      icon: '🏙️', 
      prefix: '', 
      suffix: '',
      color: 'from-purple-600 to-pink-500',
      isActive: true
    },
    { 
      id: '3',
      stat: 85, 
      label: 'Success Rate', 
      icon: '📈', 
      prefix: '', 
      suffix: '%',
      color: 'from-green-500 to-emerald-400',
      isActive: true
    },
    { 
      id: '4',
      stat: 10000000, 
      label: 'Funds Raised', 
      icon: '💰', 
      prefix: '₹', 
      suffix: '',
      color: 'from-yellow-500 to-orange-500',
      isActive: true
    },
  ]);

  const [monthlyGoal, setMonthlyGoal] = useState<MonthlyGoal>({
    goal: 15000000,
    currentRaised: 10050000,
    currency: '₹',
    targetMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });

  const [settings, setSettings] = useState({
    animationDuration: 2.5,
    enableScrollTrigger: true,
    displayFormat: 'auto', // auto, K, M, full
    showProgressBar: true,
    enableHoverEffects: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

 const getImpactMeter = async () => {
  const res = await axios.get(`${API_BASE}/api/dimpact`);
  return res.data;
};

  const saveImpactMeter = async (data: any) => {
  const res = await axios.post(`${API_BASE}/api/dimpact/save`, data);
  return res.data;
};

  const colorOptions = [
    'from-blue-600 to-purple-600',
    'from-purple-600 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-blue-500',
    'from-teal-500 to-cyan-500',
    'from-orange-500 to-red-500'
  ];

  
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getImpactMeter();
      if (data) {
        setImpactStats(data.impactStats || []);
        setMonthlyGoal(data.monthlyGoal || {
          goal: 0,
          currentRaised: 0,
          currency: '₹',
          targetMonth: new Date().toISOString().slice(0, 7)
        });
        setSettings(data.settings || {
          animationDuration: 2.5,
          enableScrollTrigger: true,
          displayFormat: 'auto',
          showProgressBar: true,
          enableHoverEffects: true
        });
      }
    } catch (err) {
      console.error('Error loading impact meter:', err);
    }
  };

  fetchData();
}, []);

  const iconOptions = ['👧', '🏙️', '📈', '💰', '❤️', '🌟', '🎯', '📊', '🏆', '🌍', '💡', '🔥'];

  const handleStatUpdate = (_id: string, field: keyof ImpactStat, value: any) => {
    setImpactStats(prev => prev.map(stat => 
      stat._id === _id ? { ...stat, [field]: value } : stat
    ));
  };

  const handleAddStat = () => {
    const newStat: ImpactStat = {
      _id: Date.now().toString(),
      stat: 0,
      label: 'New Metric',
      icon: '📊',
      prefix: '',
      suffix: '',
      color: 'from-blue-600 to-purple-600',
      isActive: true
    };
    setImpactStats(prev => [...prev, newStat]);
  };

  const handleRemoveStat = (_id: string) => {
    setImpactStats(prev => prev.filter(stat => stat._id !== _id));
  };

  const handleSave = async () => {
  setIsSaving(true);
  try {
    await saveImpactMeter({ impactStats, monthlyGoal, settings });
    setLastSaved(new Date());
  } catch (err) {
    console.error('Failed to save:', err);
  } finally {
    setIsSaving(false);
  }
};


  const calculateProgress = () => {
    return Math.min((monthlyGoal.currentRaised / monthlyGoal.goal) * 100, 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Impact Meter Management
          </h1>
          <p className="text-gray-600 mt-2">
            Configure impact statistics, monthly goals, and display settings
          </p>
          {lastSaved && (
            <p className="text-sm text-green-600 mt-1">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <AdminButton 
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </AdminButton>
          <AdminButton 
            variant="success"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </AdminButton>
        </div>
      </div>

      {!previewMode ? (
        <>
          {/* Impact Statistics Configuration */}
          <AdminCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Impact Statistics</h2>
              <AdminButton onClick={handleAddStat}>
                Add Statistic
              </AdminButton>
            </div>

            <div className="space-y-6">
              {impactStats.map((stat, index) => (
                <div key={stat._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900">Statistic {index + 1}</h3>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={stat.isActive}
                          onChange={(e) => handleStatUpdate(stat._id, 'isActive', e.target.checked)}
                          className="rounded"
                        />
                        Active
                      </label>
                      <AdminButton 
                        variant="danger" 
                        onClick={() => handleRemoveStat(stat._id)}
                        className="text-xs px-2 py-1"
                      >
                        Remove
                      </AdminButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="number"
                        value={stat.stat}
                        onChange={(e) => handleStatUpdate(stat._id, 'stat', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatUpdate(stat._id, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={stat.icon}
                        onChange={(e) => handleStatUpdate(stat._id, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Gradient
                      </label>
                      <select
                        value={stat.color}
                        onChange={(e) => handleStatUpdate(stat._id, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>
                            {color.replace('from-', '').replace(' to-', ' → ').replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prefix
                      </label>
                      <input
                        type="text"
                        value={stat.prefix}
                        onChange={(e) => handleStatUpdate(stat._id, 'prefix', e.target.value)}
                        placeholder="e.g., $, ₹"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => handleStatUpdate(stat._id, 'suffix', e.target.value)}
                        placeholder="e.g., +, %, K"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preview
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <span className="text-lg">{stat.icon}</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg">
                            {stat.prefix}{formatNumber(stat.stat)}{stat.suffix}
                          </div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Monthly Goal Configuration */}
          <AdminCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Goal Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Amount
                </label>
                <input
                  type="number"
                  value={monthlyGoal.goal}
                  onChange={(e) => setMonthlyGoal(prev => ({ ...prev, goal: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Raised
                </label>
                <input
                  type="number"
                  value={monthlyGoal.currentRaised}
                  onChange={(e) => setMonthlyGoal(prev => ({ ...prev, currentRaised: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={monthlyGoal.currency}
                  onChange={(e) => setMonthlyGoal(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="₹">₹ (Rupees)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (Euro)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Month
                </label>
                <input
                  type="month"
                  value={monthlyGoal.targetMonth}
                  onChange={(e) => setMonthlyGoal(prev => ({ ...prev, targetMonth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Progress Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Progress Preview</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span>{monthlyGoal.currency}{(monthlyGoal.currentRaised/1000000).toFixed(1)}M raised</span>
                <span>{calculateProgress().toFixed(1)}% of goal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          </AdminCard>

          {/* Display Settings */}
          <AdminCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Display Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animation Duration (seconds)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="5"
                  value={settings.animationDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, animationDuration: parseFloat(e.target.value) || 2.5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number Display Format
                </label>
                <select
                  value={settings.displayFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, displayFormat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">Auto (K/M formatting)</option>
                  <option value="full">Full numbers</option>
                  <option value="K">Thousands only</option>
                  <option value="M">Millions only</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.enableScrollTrigger}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableScrollTrigger: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable scroll trigger animations</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showProgressBar}
                    onChange={(e) => setSettings(prev => ({ ...prev, showProgressBar: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Show monthly goal progress bar</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.enableHoverEffects}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableHoverEffects: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable hover effects on cards</span>
                </label>
              </div>
            </div>
          </AdminCard>
        </>
      ) : (
        /* Preview Mode */
        <AdminCard className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your Impact Makes a Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we've accomplished incredible things. Every donation contributes to these amazing results.
            </p>
          </div>
          
          {/* Impact Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {impactStats.filter(stat => stat.isActive).map((item) => (
              <div 
                key={item._id}
                className="bg-white rounded-xl shadow-lg p-6 text-center border hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${item.color}`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {item.prefix}{formatNumber(item.stat)}{item.suffix}
                </h3>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
          
          {/* Monthly Goal Preview */}
          {settings.showProgressBar && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Monthly Fundraising Goal</h3>
                <div className="text-right">
                  <p className="text-lg text-gray-600">
                    <span className="font-bold text-purple-600">
                      {monthlyGoal.currency}{(monthlyGoal.currentRaised/1000000).toFixed(1)}M
                    </span> raised of {monthlyGoal.currency}{(monthlyGoal.goal/1000000).toFixed(1)}M goal
                  </p>
                </div>
              </div>
              
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </AdminCard>
      )}
    </div>
  );
}