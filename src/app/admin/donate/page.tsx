'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Settings,
  BarChart3,
  Heart,
  Shield,
  MessageSquare,
  Megaphone,
  CreditCard,
  Plus,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';

// Admin Components
import AdminCard from '@/components/admin/ui/AdminCard';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminButton from '@/components/admin/ui/AdminButton';

interface DonationStats {
  totalDonations: number;
  monthlyDonations: number;
  averageDonation: number;
  activeCampaigns: number;
  totalDonors: number;
}

interface Campaign {
  id: string;
  title: string;
  goal: number;
  raised: number;
  donors: number;
  status: 'active' | 'completed' | 'paused';
  endDate: string;
}

export default function AdminDonatePage() {
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 125000,
    monthlyDonations: 28500,
    averageDonation: 75,
    activeCampaigns: 6,
    totalDonors: 1250
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Emergency Relief Fund',
      goal: 50000,
      raised: 35000,
      donors: 245,
      status: 'active',
      endDate: '2025-08-15'
    },
    {
      id: '2',
      title: 'Education for All',
      goal: 75000,
      raised: 45000,
      donors: 180,
      status: 'active',
      endDate: '2025-09-30'
    },
    {
      id: '3',
      title: 'Clean Water Initiative',
      goal: 100000,
      raised: 100000,
      donors: 520,
      status: 'completed',
      endDate: '2025-06-01'
    }
  ]);

  const donateManagementSections = [
    {
      title: 'Hero Banner',
      description: 'Manage donation page hero section',
      href: '/admin/donate/hero-banner',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Donation Form',
      description: 'Configure donation form settings',
      href: '/admin/donate/donation-form',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Impact Meter',
      description: 'Manage impact visualization',
      href: '/admin/donate/impact-meter',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Transparency',
      description: 'Manage transparency section',
      href: '/admin/donate/transparency',
      icon: Shield,
      color: 'bg-indigo-500'
    },
    {
      title: 'Testimonials',
      description: 'Manage donor testimonials',
      href: '/admin/donate/testimonials',
      icon: MessageSquare,
      color: 'bg-pink-500'
    },
    {
      title: 'Payment Settings',
      description: 'Configure payment gateways',
      href: '/admin/donate/payment-settings',
      icon: Settings,
      color: 'bg-gray-600'
    },
    {
      title: 'Campaigns',
      description: 'Manage donation campaigns',
      href: '/admin/donate/campaigns',
      icon: Megaphone,
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics',
      description: 'View donation analytics',
      href: '/admin/donate/analytics',
      icon: TrendingUp,
      color: 'bg-red-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-600 mt-2">Manage donations, campaigns, and payment settings</p>
        </div>
        <AdminButton 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={() => window.location.href = '/admin/donate/campaigns?new=true'}
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </AdminButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDonations)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyDonations)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Donation</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageDonation)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Management Sections Grid */}
      <AdminCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Donation Page Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {donateManagementSections.map((section) => (
            <Link 
              key={section.title}
              href={section.href}
              className="group p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </AdminCard>

      {/* Active Campaigns */}
      <AdminCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
          <Link href="/admin/donate/campaigns">
            <AdminButton variant="outline">View All</AdminButton>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Donors</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                      <p className="text-sm text-gray-500">Goal: {formatCurrency(campaign.goal)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{formatCurrency(campaign.raised)}</span>
                        <span>{getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{campaign.donors}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
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
    </div>
  );
}