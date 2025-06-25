'use client';

import { useState, useEffect } from 'react';
import { 
  Settings,
  Eye,
  Save,
  RotateCcw,
  Palette,
  MessageSquare,
  Sparkles,
  Share2,
  CheckCircle,
  Edit3,
  Type,
  Image,
  Sliders,
  Users,
  Heart,
  Gift
} from 'lucide-react';

// Mock admin components (you can replace with your actual components)
const AdminCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const AdminButton = ({ children, variant = 'primary', className = '', onClick, disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
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

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const InputField = ({ label, type = 'text', value, onChange, placeholder, className = '' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  </div>
);

const TextareaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-12 h-10 rounded border border-gray-300"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

const SwitchField = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function ThankYouModalAdmin() {
  const [activeTab, setActiveTab] = useState('content');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modal Content Settings
  const [modalContent, setModalContent] = useState({
    title: 'Thank You{name ? `, ${name}` : \'\'}!',
    description: 'Your donation of <span className="font-bold">₹{amount.toLocaleString()}</span> will make a real difference in someone\'s life.',
    impactMessages: {
      high: 'Your generous donation will help build clean water facilities for communities in need.',
      medium: 'Your donation will support a child\'s education for a full month.',
      low: 'Your donation will provide meals for {Math.floor(amount / 50)} children.'
    },
    shareText: 'Share your contribution',
    closeButtonText: 'Close'
  });

  // Design Settings
  const [designSettings, setDesignSettings] = useState({
    primaryColor: '#8B5CF6',
    successColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    borderRadius: '16px',
    showConfetti: true,
    confettiColors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
    animationDuration: 1000,
    modalSize: 'medium' // small, medium, large
  });

  // Behavior Settings
  const [behaviorSettings, setBehaviorSettings] = useState({
    autoClose: false,
    autoCloseDelay: 5000,
    showShareButtons: true,
    enableSocialSharing: true,
    showImpactSection: true,
    enablePersonalization: true,
    trackingEnabled: true,
    showAnimation: true
  });

  // Social Media Settings
  const [socialSettings, setSocialSettings] = useState({
    facebook: {
      enabled: true,
      shareText: 'I just made a donation to support a great cause! 💙'
    },
    twitter: {
      enabled: true,
      shareText: 'Just donated to make a difference! Join me in supporting this cause. 🌟'
    },
    email: {
      enabled: true,
      subject: 'Join me in making a difference',
      body: 'I just made a donation to support an amazing cause. Would you consider joining me?'
    }
  });

  // Impact Thresholds
  const [impactThresholds, setImpactThresholds] = useState({
    high: 5000,
    medium: 1000,
    mealCost: 50
  });

  // Preview data
  const [previewData, setPreviewData] = useState({
    name: 'John Doe',
    amount: 2500
  });

  const handleContentChange = (field, value) => {
    setModalContent(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleDesignChange = (field, value) => {
    setDesignSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleBehaviorChange = (field, value) => {
    setBehaviorSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialChange = (platform, field, value) => {
    setSocialSettings(prev => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would save the settings to your backend
    console.log('Saving settings...', {
      modalContent,
      designSettings,
      behaviorSettings,
      socialSettings,
      impactThresholds
    });
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputField
          label="Modal Title"
          value={modalContent.title}
          onChange={(e) => handleContentChange('title', e.target.value)}
          placeholder="Thank You{name ? `, ${name}` : ''}!"
        />
        
        <TextareaField
          label="Description Template"
          value={modalContent.description}
          onChange={(e) => handleContentChange('description', e.target.value)}
          placeholder="Your donation of ₹{amount} will make a difference..."
          rows={3}
        />
      </div>

      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Impact Messages
        </h3>
        <div className="space-y-4">
          <TextareaField
            label={`High Impact (≥₹${impactThresholds.high.toLocaleString()})`}
            value={modalContent.impactMessages.high}
            onChange={(e) => handleContentChange('impactMessages', { ...modalContent.impactMessages, high: e.target.value })}
            rows={2}
          />
          <TextareaField
            label={`Medium Impact (≥₹${impactThresholds.medium.toLocaleString()})`}
            value={modalContent.impactMessages.medium}
            onChange={(e) => handleContentChange('impactMessages', { ...modalContent.impactMessages, medium: e.target.value })}
            rows={2}
          />
          <TextareaField
            label={`Low Impact (<₹${impactThresholds.medium.toLocaleString()})`}
            value={modalContent.impactMessages.low}
            onChange={(e) => handleContentChange('impactMessages', { ...modalContent.impactMessages, low: e.target.value })}
            rows={2}
          />
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InputField
          label="Share Section Text"
          value={modalContent.shareText}
          onChange={(e) => handleContentChange('shareText', e.target.value)}
          placeholder="Share your contribution"
        />
        
        <InputField
          label="Close Button Text"
          value={modalContent.closeButtonText}
          onChange={(e) => handleContentChange('closeButtonText', e.target.value)}
          placeholder="Close"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Impact Thresholds</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="High"
              value={impactThresholds.high}
              onChange={(e) => setImpactThresholds(prev => ({ ...prev, high: parseInt(e.target.value) || 0 }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Medium"
              value={impactThresholds.medium}
              onChange={(e) => setImpactThresholds(prev => ({ ...prev, medium: parseInt(e.target.value) || 0 }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Meal Cost"
              value={impactThresholds.mealCost}
              onChange={(e) => setImpactThresholds(prev => ({ ...prev, mealCost: parseInt(e.target.value) || 0 }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesignTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ColorPicker
          label="Primary Color"
          value={designSettings.primaryColor}
          onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
        />
        <ColorPicker
          label="Success Color"
          value={designSettings.successColor}
          onChange={(e) => handleDesignChange('successColor', e.target.value)}
        />
        <ColorPicker
          label="Background Color"
          value={designSettings.backgroundColor}
          onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Modal Size</label>
          <select
            value={designSettings.modalSize}
            onChange={(e) => handleDesignChange('modalSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <InputField
          label="Border Radius (px)"
          value={designSettings.borderRadius.replace('px', '')}
          onChange={(e) => handleDesignChange('borderRadius', e.target.value + 'px')}
          placeholder="16"
        />
      </div>

      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Confetti Settings
        </h3>
        <div className="space-y-4">
          <SwitchField
            label="Enable Confetti"
            checked={designSettings.showConfetti}
            onChange={(value) => handleDesignChange('showConfetti', value)}
            description="Show confetti animation when modal opens"
          />
          
          {designSettings.showConfetti && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confetti Colors</label>
                <div className="flex flex-wrap gap-2">
                  {designSettings.confettiColors.map((color, index) => (
                    <input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...designSettings.confettiColors];
                        newColors[index] = e.target.value;
                        handleDesignChange('confettiColors', newColors);
                      }}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                  ))}
                </div>
              </div>
              
              <InputField
                label="Animation Duration (ms)"
                type="number"
                value={designSettings.animationDuration}
                onChange={(e) => handleDesignChange('animationDuration', parseInt(e.target.value))}
                placeholder="1000"
              />
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto Close</h3>
          <div className="space-y-4">
            <SwitchField
              label="Auto Close Modal"
              checked={behaviorSettings.autoClose}
              onChange={(value) => handleBehaviorChange('autoClose', value)}
              description="Automatically close modal after specified time"
            />
            
            {behaviorSettings.autoClose && (
              <InputField
                label="Auto Close Delay (ms)"
                type="number"
                value={behaviorSettings.autoCloseDelay}
                onChange={(e) => handleBehaviorChange('autoCloseDelay', parseInt(e.target.value))}
                placeholder="5000"
              />
            )}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <div className="space-y-4">
            <SwitchField
              label="Show Share Buttons"
              checked={behaviorSettings.showShareButtons}
              onChange={(value) => handleBehaviorChange('showShareButtons', value)}
              description="Display social sharing buttons"
            />
            
            <SwitchField
              label="Show Impact Section"
              checked={behaviorSettings.showImpactSection}
              onChange={(value) => handleBehaviorChange('showImpactSection', value)}
              description="Display impact message based on donation amount"
            />
            
            <SwitchField
              label="Enable Personalization"
              checked={behaviorSettings.enablePersonalization}
              onChange={(value) => handleBehaviorChange('enablePersonalization', value)}
              description="Show donor name in thank you message"
            />
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Tracking</h3>
        <div className="space-y-4">
          <SwitchField
            label="Enable Tracking"
            checked={behaviorSettings.trackingEnabled}
            onChange={(value) => handleBehaviorChange('trackingEnabled', value)}
            description="Track modal interactions and conversions"
          />
          
          <SwitchField
            label="Show Animations"
            checked={behaviorSettings.showAnimation}
            onChange={(value) => handleBehaviorChange('showAnimation', value)}
            description="Enable modal entrance and exit animations"
          />
        </div>
      </AdminCard>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      {Object.entries(socialSettings).map(([platform, settings]) => (
        <AdminCard key={platform} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              {platform}
            </h3>
            <SwitchField
              label=""
              checked={settings.enabled}
              onChange={(value) => handleSocialChange(platform, 'enabled', value)}
            />
          </div>
          
          {settings.enabled && (
            <div className="space-y-4">
              {platform === 'email' ? (
                <>
                  <InputField
                    label="Email Subject"
                    value={settings.subject}
                    onChange={(e) => handleSocialChange(platform, 'subject', e.target.value)}
                    placeholder="Join me in making a difference"
                  />
                  <TextareaField
                    label="Email Body"
                    value={settings.body}
                    onChange={(e) => handleSocialChange(platform, 'body', e.target.value)}
                    placeholder="I just made a donation..."
                    rows={3}
                  />
                </>
              ) : (
                <TextareaField
                  label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Share Text`}
                  value={settings.shareText}
                  onChange={(e) => handleSocialChange(platform, 'shareText', e.target.value)}
                  placeholder="Share text for social media..."
                  rows={2}
                />
              )}
            </div>
          )}
        </AdminCard>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thank You Modal Settings</h1>
          <p className="text-gray-600 mt-2">Customize the donation thank you modal appearance and behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton 
            variant="outline" 
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="w-4 h-4" />
            Preview
          </AdminButton>
          <AdminButton 
            variant="secondary" 
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </AdminButton>
          <AdminButton 
            variant="success" 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </AdminButton>
        </div>
      </div>

      {/* Status Alert */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <AdminCard className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Content
          </TabButton>
          <TabButton
            active={activeTab === 'design'}
            onClick={() => setActiveTab('design')}
          >
            <Palette className="w-4 h-4 mr-2" />
            Design
          </TabButton>
          <TabButton
            active={activeTab === 'behavior'}
            onClick={() => setActiveTab('behavior')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Behavior
          </TabButton>
          <TabButton
            active={activeTab === 'social'}
            onClick={() => setActiveTab('social')}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Social Sharing
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'design' && renderDesignTab()}
          {activeTab === 'behavior' && renderBehaviorTab()}
          {activeTab === 'social' && renderSocialTab()}
        </div>
      </AdminCard>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-10 max-w-md w-full relative">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Thank You, {previewData.name}!
              </h2>

              <p className="text-gray-600 mb-6">
                Your donation of <span className="font-bold">₹{previewData.amount.toLocaleString()}</span> will make a real difference in someone's life.
              </p>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                <p className="text-purple-700 font-medium">Your Impact</p>
                <p className="text-sm text-gray-600 mt-1">
                  {previewData.amount >= impactThresholds.high
                    ? modalContent.impactMessages.high
                    : previewData.amount >= impactThresholds.medium
                    ? modalContent.impactMessages.medium
                    : `Your donation will provide meals for ${Math.floor(previewData.amount / impactThresholds.mealCost)} children.`}
                </p>
              </div>

              {behaviorSettings.showShareButtons && (
                <div className="space-y-3 mb-6">
                  <p className="text-gray-600 text-sm">{modalContent.shareText}</p>
                  <div className="flex justify-center space-x-4">
                    {socialSettings.facebook.enabled && (
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                        f
                      </div>
                    )}
                    {socialSettings.twitter.enabled && (
                      <div className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center">
                        t
                      </div>
                    )}
                    {socialSettings.email.enabled && (
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                        @
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-300 w-full"
                style={{ backgroundColor: designSettings.primaryColor }}
              >
                {modalContent.closeButtonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Controls */}
      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField
            label="Preview Name"
            value={previewData.name}
            onChange={(e) => setPreviewData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
          />
          <InputField
            label="Preview Amount"
            type="number"
            value={previewData.amount}
            onChange={(e) => setPreviewData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
            placeholder="2500"
          />
        </div>
      </AdminCard>
    </div>
  );
}