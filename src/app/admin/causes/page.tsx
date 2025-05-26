'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3,
  Plus,
  Edit,
  Eye,
  Trash2,
  Image as ImageIcon,
  FileText,
  Settings
} from 'lucide-react';

interface CauseStats {
  totalCauses: number;
  totalDonors: number;
  totalRaised: number;
  activeCampaigns: number;
}

interface Cause {
  id: number;
  title: string;
  category: string;
  raised: number;
  goal: number;
  donors: number;
  status: 'active' | 'paused' | 'completed';
  image: string;
  lastUpdated: string;
}

export default function CausesManagement() {
  const [stats, setStats] = useState<CauseStats>({
    totalCauses: 5,
    totalDonors: 10170,
    totalRaised: 5350000,
    activeCampaigns: 5
  });

  const [causes, setCauses] = useState<Cause[]>([
    {
      id: 1,
      title: "Feeding the Hungry",
      category: "Food",
      raised: 1250000,
      goal: 2000000,
      donors: 3245,
      status: 'active',
      image: '/images/causes/hunger.jpg',
      lastUpdated: '2024-12-15'
    },
    {
      id: 2,
      title: "Educating Underprivileged Children",
      category: "Education",
      raised: 1500000,
      goal: 3000000,
      donors: 2156,
      status: 'active',
      image: '/images/causes/education.jpg',
      lastUpdated: '2024-12-14'
    },
    {
      id: 3,
      title: "Healthcare for All",
      category: "Healthcare",
      raised: 980000,
      goal: 1500000,
      donors: 1879,
      status: 'active',
      image: '/images/causes/healthcare.jpg',
      lastUpdated: '2024-12-13'
    },
    {
      id: 4,
      title: "Women Empowerment",
      category: "Empowerment",
      raised: 870000,
      goal: 1200000,
      donors: 1456,
      status: 'active',
      image: '/images/causes/women.jpg',
      lastUpdated: '2024-12-12'
    },
    {
      id: 5,
      title: "Environmental Sustainability",
      category: "Environment",
      raised: 750000,
      goal: 1000000,
      donors: 1234,
      status: 'active',
      image: '/images/causes/environment.jpg',
      lastUpdated: '2024-12-11'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const managementSections = [
    {
      title: 'Hero Banner',
      description: 'Manage the causes page hero section with video background',
      href: '/admin/causes/hero',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Introduction',
      description: 'Edit the introduction section content',
      href: '/admin/causes/introduction',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Impact Stats',
      description: 'Update impact statistics and achievements',
      href: '/admin/causes/stats',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Causes List',
      description: 'Manage individual causes and campaigns',
      href: '/admin/causes/causes-list',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Testimonials',
      description: 'Manage testimonials and success stories',
      href: '/admin/causes/testimonials',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      title: 'Before & After',
      description: 'Manage before/after transformation slider',
      href: '/admin/causes/before-after',
      icon: ImageIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Call to Action',
      description: 'Edit the CTA section with parallax effects',
      href: '/admin/causes/cta',
      icon: Settings,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Causes Management</h1>
          <p className="text-gray-600 mt-2">Manage your causes page content and campaigns</p>
        </div>
        <Link
          href="/admin/causes/causes-list"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Cause
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Causes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCauses}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRaised)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Page Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={section.href}
                className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`${section.color} p-3 rounded-lg`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Causes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Causes</h2>
          <Link
            href="/admin/causes/causes-list"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {causes.slice(0, 5).map((cause) => (
                <tr key={cause.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={cause.image}
                        alt={cause.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                        <div className="text-sm text-gray-500">Updated {cause.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{cause.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(cause.raised)} / {formatCurrency(cause.goal)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((cause.raised / cause.goal) * 100)}% completed
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cause.donors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cause.status)}`}>
                      {cause.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}