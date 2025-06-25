'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3,
  DollarSign,
  CreditCard,
  Smartphone,
  Wallet,
  Building,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Mock Admin Components (you can replace these with your actual components)
const AdminCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const AdminButton = ({ children, variant = "primary", className = "", onClick, disabled }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border border-gray-300 hover:border-gray-400 text-gray-700 bg-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function AdminDonationFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('amounts');

  // Donation Form Configuration State
  const [formConfig, setFormConfig] = useState({
    donationOptions: [
      { 
        amount: 500, 
        impact: "Provides meals for 10 children", 
        icon: "🍲",
        enabled: true 
      },
      { 
        amount: 1000, 
        impact: "Supports a child's education", 
        icon: "📚",
        enabled: true 
      },
      { 
        amount: 5000, 
        impact: "Builds clean water facilities", 
        icon: "🚰",
        enabled: true 
      },
      { 
        amount: 10000, 
        impact: "Funds medical treatment for 20 children", 
        icon: "🏥",
        enabled: true 
      },
    ],
    customAmountEnabled: true,
    monthlyDonationEnabled: true,
    anonymousDonationEnabled: true,
    messageFieldEnabled: true,
    requiredFields: {
      name: true,
      email: true,
      phone: false
    },
    paymentMethods: {
      card: {
        enabled: true,
        name: "Credit/Debit Card",
        description: "Secure payment with Visa, MasterCard, etc."
      },
      upi: {
        enabled: true,
        name: "UPI",
        description: "Pay using UPI apps like GPay, PhonePe"
      },
      netbanking: {
        enabled: true,
        name: "Net Banking",
        description: "Direct bank transfer"
      },
      wallet: {
        enabled: false,
        name: "Digital Wallet",
        description: "Paytm, Amazon Pay, etc."
      }
    },
    formSettings: {
      minAmount: 100,
      maxAmount: 100000,
      defaultAmount: 1000,
      currency: "INR",
      currencySymbol: "₹"
    }
  });

  const [newDonationOption, setNewDonationOption] = useState({
    amount: '',
    impact: '',
    icon: '',
    enabled: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  const addDonationOption = () => {
    if (newDonationOption.amount && newDonationOption.impact && newDonationOption.icon) {
      setFormConfig(prev => ({
        ...prev,
        donationOptions: [...prev.donationOptions, {
          ...newDonationOption,
          amount: parseInt(newDonationOption.amount)
        }]
      }));
      setNewDonationOption({ amount: '', impact: '', icon: '', enabled: true });
    }
  };

  const removeDonationOption = (index) => {
    setFormConfig(prev => ({
      ...prev,
      donationOptions: prev.donationOptions.filter((_, i) => i !== index)
    }));
  };

  const updateDonationOption = (index, field, value) => {
    setFormConfig(prev => ({
      ...prev,
      donationOptions: prev.donationOptions.map((option, i) => 
        i === index ? { ...option, [field]: field === 'amount' ? parseInt(value) || 0 : value } : option
      )
    }));
  };

  const updatePaymentMethod = (method, field, value) => {
    setFormConfig(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: {
          ...prev.paymentMethods[method],
          [field]: value
        }
      }
    }));
  };

  const updateFormSetting = (field, value) => {
    setFormConfig(prev => ({
      ...prev,
      formSettings: {
        ...prev.formSettings,
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'amounts', label: 'Donation Amounts', icon: DollarSign },
    { id: 'fields', label: 'Form Fields', icon: Edit3 },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'General Settings', icon: Settings }
  ];

  const paymentMethodIcons = {
    card: CreditCard,
    upi: Smartphone,
    netbanking: Building,
    wallet: Wallet
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Form Configuration</h1>
          <p className="text-gray-600 mt-2">Customize the donation form settings and options</p>
        </div>
        <div className="flex gap-3">
          <AdminButton variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Form
          </AdminButton>
          <AdminButton 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
          </AdminButton>
        </div>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Donation form configuration saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'amounts' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Donation Amount Options</h3>
          
          {/* Existing Options */}
          <div className="space-y-4 mb-8">
            {formConfig.donationOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={(e) => updateDonationOption(index, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={option.amount}
                      onChange={(e) => updateDonationOption(index, 'amount', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Impact Description</label>
                    <input
                      type="text"
                      value={option.impact}
                      onChange={(e) => updateDonationOption(index, 'impact', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="text"
                        value={option.icon}
                        onChange={(e) => updateDonationOption(index, 'icon', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => removeDonationOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Option */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Add New Donation Option</h4>
            <div className="flex items-end gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newDonationOption.amount}
                    onChange={(e) => setNewDonationOption(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. 2500"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact Description</label>
                  <input
                    type="text"
                    value={newDonationOption.impact}
                    onChange={(e) => setNewDonationOption(prev => ({ ...prev, impact: e.target.value }))}
                    placeholder="e.g. Provides school supplies for 5 children"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <input
                    type="text"
                    value={newDonationOption.icon}
                    onChange={(e) => setNewDonationOption(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="e.g. 📝"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <AdminButton onClick={addDonationOption} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Option
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      {activeTab === 'fields' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Form Field Configuration</h3>
          
          <div className="space-y-6">
            {/* General Field Options */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Field Options</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.customAmountEnabled}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, customAmountEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Enable custom amount input</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.monthlyDonationEnabled}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, monthlyDonationEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Enable monthly donation option</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.anonymousDonationEnabled}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, anonymousDonationEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Allow anonymous donations</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.messageFieldEnabled}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, messageFieldEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Enable message/note field</span>
                </label>
              </div>
            </div>

            {/* Required Fields */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Required Fields</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.requiredFields.name}
                    onChange={(e) => setFormConfig(prev => ({ 
                      ...prev, 
                      requiredFields: { ...prev.requiredFields, name: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Full Name (required)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.requiredFields.email}
                    onChange={(e) => setFormConfig(prev => ({ 
                      ...prev, 
                      requiredFields: { ...prev.requiredFields, email: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Email Address (required)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formConfig.requiredFields.phone}
                    onChange={(e) => setFormConfig(prev => ({ 
                      ...prev, 
                      requiredFields: { ...prev.requiredFields, phone: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Phone Number (required)</span>
                </label>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {activeTab === 'payments' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method Configuration</h3>
          
          <div className="space-y-4">
            {Object.entries(formConfig.paymentMethods).map(([key, method]) => {
              const IconComponent = paymentMethodIcons[key];
              return (
                <div key={key} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => updatePaymentMethod(key, 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={method.name}
                        onChange={(e) => updatePaymentMethod(key, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={method.description}
                        onChange={(e) => updatePaymentMethod(key, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      )}

      {activeTab === 'settings' && (
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Donation Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{formConfig.formSettings.currencySymbol}</span>
                <input
                  type="number"
                  value={formConfig.formSettings.minAmount}
                  onChange={(e) => updateFormSetting('minAmount', parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Donation Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{formConfig.formSettings.currencySymbol}</span>
                <input
                  type="number"
                  value={formConfig.formSettings.maxAmount}
                  onChange={(e) => updateFormSetting('maxAmount', parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Amount (for custom input)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{formConfig.formSettings.currencySymbol}</span>
                <input
                  type="number"
                  value={formConfig.formSettings.defaultAmount}
                  onChange={(e) => updateFormSetting('defaultAmount', parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formConfig.formSettings.currency}
                onChange={(e) => {
                  updateFormSetting('currency', e.target.value);
                  updateFormSetting('currencySymbol', e.target.value === 'INR' ? '₹' : '$');
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Note</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Changes to payment methods and currency settings may require additional configuration in your payment gateway settings. Please ensure your payment processors support the selected options.
                </p>
              </div>
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}