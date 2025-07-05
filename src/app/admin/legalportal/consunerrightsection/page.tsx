give me the remaining part of admin page code not the full code 'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Play, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  DragAndDrop,
  Search,
  Filter
} from 'lucide-react';

interface ComplaintTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  useCase: string;
}

interface CaseStory {
  id: string;
  title: string;
  category: string;
  issue: string;
  resolution: string;
  timeframe: string;
  compensation: string;
  status: 'resolved' | 'ongoing' | 'dismissed';
}

export default function ConsumerRightsSection() {
  const [activeTab, setActiveTab] = useState<'consumer' | 'rti'>('consumer');
  const [selectedTemplate, setSelectedTemplate] = useState<ComplaintTemplate | null>(null);
  const [rtiForm, setRtiForm] = useState({
    department: '',
    information: '',
    reason: '',
    applicantName: '',
    address: '',
    phone: ''
  });

  const complaintTemplates: ComplaintTemplate[] = [
    {
      id: '1',
      title: 'Defective Product Complaint',
      category: 'Product Quality',
      description: 'For products that are faulty, damaged, or not working as expected',
      format: 'District Consumer Forum',
      useCase: 'Electronics, Appliances, Clothing, etc.'
    },
    {
      id: '2',
      title: 'Service Deficiency Complaint',
      category: 'Service Issues',
      description: 'For poor service quality, delayed service, or service not as promised',
      format: 'State Consumer Commission',
      useCase: 'Banking, Insurance, Telecom, Transport'
    },
    {
      id: '3',
      title: 'Online Shopping Complaint',
      category: 'E-commerce',
      description: 'For issues with online purchases, delivery problems, or return/refund issues',
      format: 'National Consumer Commission',
      useCase: 'Amazon, Flipkart, Myntra, etc.'
    },
    {
      id: '4',
      title: 'Medical Negligence Complaint',
      category: 'Healthcare',
      description: 'For medical malpractice, wrong treatment, or hospital negligence',
      format: 'Medical Consumer Forum',
      useCase: 'Hospitals, Clinics, Doctors'
    }
  ];

  const caseStories: CaseStory[] = [
    {
      id: '1',
      title: 'Faulty Refrigerator Replacement',
      category: 'Electronics',
      issue: 'Brand new refrigerator stopped working within 15 days',
      resolution: 'Consumer forum ordered replacement + compensation for spoiled food',
      timeframe: '3 months',
      compensation: '₹25,000 + new refrigerator',
      status: 'resolved'
    },
    {
      id: '2',
      title: 'Insurance Claim Rejection',
      category: 'Insurance',
      issue: 'Health insurance claim rejected without proper investigation',
      resolution: 'Forum ordered insurance company to settle claim with interest',
      timeframe: '8 months',
      compensation: '₹3,50,000 + 12% interest',
      status: 'resolved'
    },
    {
      id: '3',
      title: 'Flight Cancellation Compensation',
      category: 'Travel',
      issue: 'Flight cancelled without notice, no alternative arrangement',
      resolution: 'Airline ordered to pay compensation and provide alternative booking',
      timeframe: '4 months',
      compensation: '₹15,000 + rebooking',
      status: 'resolved'
    }
  ];

  const rtiSteps = [
    {
      step: 1,
      title: 'Identify Information',
      description: 'Clearly define what information you need from the government department',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Write Application',
      description: 'Write a simple application mentioning the specific information required',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Pay Fee',
      description: 'Pay ₹10 fee (₹2 for BPL card holders) via cash, DD, or online',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Submit to PIO',
      description: 'Submit application to Public Information Officer of concerned department',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 5,
      title: 'Get Response',
      description: 'Response should be provided within 30 days (48 hours for life/liberty issues)',
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const handleRTISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle RTI form submission
    console.log('RTI Form submitted:', rtiForm);
    alert('RTI application template generated! Check your downloads.');
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Consumer Rights & RTI Filing
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empower yourself with consumer protection laws and Right to Information filing guides
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('consumer')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'consumer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Consumer Rights
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rti')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'rti'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              RTI Filing
            </div>
          </button>
        </div>
      </div>

      {/* Consumer Rights Section */}
      {activeTab === 'consumer' && (
        <div className="space-y-8">
          {/* Consumer Court Process */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">Consumer Court Process Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { step: 1, title: 'Identify Issue', desc: 'Product defect or service deficiency' },
                { step: 2, title: 'Gather Evidence', desc: 'Bills, photos, communication records' },
                { step: 3, title: 'Write Complaint', desc: 'Use our templates or hire lawyer' },
                { step: 4, title: 'Pay Court Fee', desc: 'Nominal fee based on claim amount' },
                { step: 5, title: 'File & Follow', desc: 'Submit complaint and track progress' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3">Court Jurisdiction by Claim Amount:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">District Forum</h5>
                  <p className="text-blue-600 font-bold">Up to ₹1 Crore</p>
                  <p className="text-gray-600">Local district level</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">State Commission</h5>
                  <p className="text-green-600 font-bold">₹1 Crore - ₹10 Crore</p>
                  <p className="text-gray-600">State level appeals</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">National Commission</h5>
                  <p className="text-red-600 font-bold">Above ₹10 Crore</p>
                  <p className="text-gray-600">Supreme consumer court</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Templates */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">Sample Complaint Letters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaintTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">{template.title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Format: {template.format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Use for: {template.useCase}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Download Template
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Preview
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Case Outcome Visualizer */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">Success Stories & Case Outcomes</h3>
            </div>

            <div className="space-y-6">
              {caseStories.map((caseStory, index) => (
                <motion.div
                  key={caseStory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{caseStory.title}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {caseStory.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium capitalize">{caseStory.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">The Issue:</h5>
                      <p className="text-gray-700 mb-4">{caseStory.issue}</p>
                      
                      <h5 className="font-bold text-gray-800 mb-2">Resolution:</h5>
                      <p className="text-gray-700">{caseStory.resolution}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800">Time Taken:</span>
                        </div>
                        <p className="text-blue-600 font-bold">{caseStory.timeframe}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800">Compensation:</span>
                        </div>
                        <p className="text-green-600 font-bold">{caseStory.compensation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RTI Section */}
      {activeTab === 'rti' && (
        <div className="space-y-8">
          {/* RTI Process Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Filing Process</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {rtiSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-blue-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {step.step}
                  </div>
                  <div className="mb-3 text-blue-600">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">Important RTI Guidelines:</h4>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• Information should be available with the public authority</li>
                    <li>• Cannot ask for personal opinions or suggestions</li>
                    <li>• Questions should be specific and clear</li>
                    <li>• File number or reference should be mentioned if known</li>
                    <li>• Appeals can be filed if information is denied</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RTI Application Generator */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Application Generator</h3>
            </div>

            <form onSubmit={handleRTISubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government Department/Office
                  </label>
                  <select
                    value={rtiForm.department}
                    onChange={(e) => setRtiForm({...rtiForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="education">Education Department</option>
                    <option value="health">Health Department</option>
                    <option value="police">Police Department</option>
                    <option value="municipal">Municipal Corporation</option>
                    <option value="electricity">Electricity Board</option>
                    <option value="transport">Transport Department</option>
                    <option value="revenue">Revenue Department</option>
                    <option value="other">Other (Specify in application)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={rtiForm.applicantName}
                    onChange={(e) => setRtiForm({...rtiForm, applicantName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <textarea
                  value={rtiForm.address}
                  onChange={(e) => setRtiForm({...rtiForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your complete address with PIN code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={rtiForm.phone}
                  onChange={(e) => setRtiForm({...rtiForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Information Required (Be Specific)
                </label>
                <textarea
                  value={rtiForm.information}
                  onChange={(e) => setRtiForm({...rtiForm, information: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Clearly describe what information you need. Be specific with dates, file numbers, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Information (Optional)
                </label>
                <textarea
                  value={rtiForm.reason}
                  onChange={(e) => setRtiForm({...rtiForm, reason: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief reason why you need this information (optional but recommended)"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate RTI Application
                </button>
                <div className="text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Application will be generated as a downloadable PDF
                </div>
              </div>
            </form>
          </div>

          {/* RTI Fee Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Fee Structure</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-3">Application Fee</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>General Category:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BPL Card Holders:</span>
                    <span className="font-bold">₹2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SC/ST Applicants:</span>
                    <span className="font-bold">Free</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-3">Additional Charges</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Per A4 Page Copy:</span>
                    <span className="font-bold">₹2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection per Hour:</span>
                    <span className="font-bold">₹5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CD/DVD Copy:</span>
                    <span className="font-bold">₹50</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-green-800 mb-3">Appeal Fee</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>First Appeal:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Second Appeal:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BPL Card Holders:</span>
                    <span className="font-bold">Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RTI Sample Applications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">Sample RTI Applications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Property Records',
                  description: 'Land records, mutation details, ownership history',
                  category: 'Revenue',
                  downloads: '25K+'
                },
                {
                  title: 'Police Verification',
                  description: 'Status of police verification, background check',
                  category: 'Police',
                  downloads: '18K+'
                },
                {
                  title: 'Education Certificates',
                  description: 'School records, mark sheets, certificates status',
                  category: 'Education',
                  downloads: '30K+'
                },
                {
                  title: 'Government Job Status',
                  description: 'Application status, selection process details',
                  category: 'Employment',
                  downloads: '22K+'
                },
                {
                  title: 'Healthcare Facilities',
                  description: 'Hospital records, medical facility information',
                  category: 'Health',
                  downloads: '15K+'
                },
                {
                  title: 'Development Projects',
                  description: 'Road construction, public works progress',
                  category: 'Public Works',
                  downloads: '12K+'
                }
              ].map((sample, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-gray-800">{sample.title}</h4>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{sample.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{sample.downloads} downloads</span>
                    <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Video Tutorial */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Filing Tutorial</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="font-bold text-gray-800 mb-4">Watch Step-by-Step RTI Filing Process</h4>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    How to identify the right department
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Writing effective RTI applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Online and offline submission process
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    What to do if information is denied
                  </li>
                </ul>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Watch Tutorial
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">RTI Filing Demo Video</p>
                    <p className="text-sm text-gray-500">Duration: 15 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedTemplate.title}</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedTemplate.category}
                </span>
              </div>

              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Template Preview:</h4>
                <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded border">
                  <p>To,</p>
                  <p>The Registrar,</p>
                  <p>{selectedTemplate.format}</p>
                  <p>[Address]</p>
                  <br />
                  <p>Subject: Consumer Complaint regarding {selectedTemplate.category}</p>
                  <br />
                  <p>Sir/Madam,</p>
                  <br />
                  <p>I, [Your Name], am filing this complaint against [Company/Shop Name]...</p>
                  <p className="text-gray-500">[Template continues with proper legal format]</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                  Download Full Template
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Email Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Eye,
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Filter,
  Search,
  Calendar
} from 'lucide-react';

interface ComplaintTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  useCase: string;
  downloads: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface CaseStory {
  id: string;
  title: string;
  category: string;
  issue: string;
  resolution: string;
  timeframe: string;
  compensation: string;
  status: 'resolved' | 'ongoing' | 'dismissed';
  dateAdded: string;
  isPublic: boolean;
}

interface RTIApplication {
  id: string;
  applicantName: string;
  department: string;
  submissionDate: string;
  status: 'pending' | 'processed' | 'completed';
  informationType: string;
}

interface AdminStats {
  totalTemplates: number;
  activeTemplates: number;
  totalDownloads: number;
  caseStories: number;
  rtiApplications: number;
  monthlyUsers: number;
}

export default function ConsumerRightsAdmin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'cases' | 'rti' | 'analytics'>('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<ComplaintTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [stats, setStats] = useState<AdminStats>({
    totalTemplates: 12,
    activeTemplates: 10,
    totalDownloads: 45623,
    caseStories: 25,
    rtiApplications: 1248,
    monthlyUsers: 8934
  });

  const [templates, setTemplates] = useState<ComplaintTemplate[]>([
    {
      id: '1',
      title: 'Defective Product Complaint',
      category: 'Product Quality',
      description: 'For products that are faulty, damaged, or not working as expected',
      format: 'District Consumer Forum',
      useCase: 'Electronics, Appliances, Clothing, etc.',
      downloads: 15234,
      lastUpdated: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Service Deficiency Complaint',
      category: 'Service Issues',
      description: 'For poor service quality, delayed service, or service not as promised',
      format: 'State Consumer Commission',
      useCase: 'Banking, Insurance, Telecom, Transport',
      downloads: 12890,
      lastUpdated: '2024-01-14',
      status: 'active'
    },
    {
      id: '3',
      title: 'Online Shopping Complaint',
      category: 'E-commerce',
      description: 'For issues with online purchases, delivery problems, or return/refund issues',
      format: 'National Consumer Commission',
      useCase: 'Amazon, Flipkart, Myntra, etc.',
      downloads: 9876,
      lastUpdated: '2024-01-13',
      status: 'active'
    },
    {
      id: '4',
      title: 'Medical Negligence Complaint',
      category: 'Healthcare',
      description: 'For medical malpractice, wrong treatment, or hospital negligence',
      format: 'Medical Consumer Forum',
      useCase: 'Hospitals, Clinics, Doctors',
      downloads: 7623,
      lastUpdated: '2024-01-12',
      status: 'inactive'
    }
  ]);

  const [caseStories, setCaseStories] = useState<CaseStory[]>([
    {
      id: '1',
      title: 'Faulty Refrigerator Replacement',
      category: 'Electronics',
      issue: 'Brand new refrigerator stopped working within 15 days',
      resolution: 'Consumer forum ordered replacement + compensation for spoiled food',
      timeframe: '3 months',
      compensation: '₹25,000 + new refrigerator',
      status: 'resolved',
      dateAdded: '2024-01-10',
      isPublic: true
    },
    {
      id: '2',
      title: 'Insurance Claim Rejection',
      category: 'Insurance',
      issue: 'Health insurance claim rejected without proper investigation',
      resolution: 'Forum ordered insurance company to settle claim with interest',
      timeframe: '8 months',
      compensation: '₹3,50,000 + 12% interest',
      status: 'resolved',
      dateAdded: '2024-01-08',
      isPublic: true
    },
    {
      id: '3',
      title: 'Flight Cancellation Case',
      category: 'Travel',
      issue: 'Flight cancelled without notice, no alternative arrangement',
      resolution: 'Under review by aviation authority',
      timeframe: '2 months (ongoing)',
      compensation: 'Pending',
      status: 'ongoing',
      dateAdded: '2024-01-15',
      isPublic: false
    }
  ]);

  const [rtiApplications, setRtiApplications] = useState<RTIApplication[]>([
    {
      id: 'RTI001',
      applicantName: 'Rajesh Kumar',
      department: 'Education Department',
      submissionDate: '2024-01-15',
      status: 'pending',
      informationType: 'School Records'
    },
    {
      id: 'RTI002',
      applicantName: 'Priya Sharma',
      department: 'Police Department',
      submissionDate: '2024-01-14',
      status: 'processed',
      informationType: 'Police Verification'
    },
    {
      id: 'RTI003',
      applicantName: 'Amit Singh',
      department: 'Revenue Department',
      submissionDate: '2024-01-13',
      status: 'completed',
      informationType: 'Property Records'
    }
  ]);

  const toggleTemplateStatus = (id: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, status: template.status === 'active' ? 'inactive' : 'active' }
        : template
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-yellow-600 bg-yellow-100';
      case 'dismissed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (filterStatus === 'all') return true;
    return template.status === filterStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consumer Rights & RTI Admin</h1>
            <p className="text-gray-600">Manage complaint templates, case stories, and RTI applications</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'cases', label: 'Case Stories', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'rti', label: 'RTI Applications', icon: <Eye className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTemplates}</div>
              <div className="text-gray-600">Complaint Templates</div>
              <div className="text-sm text-green-600 mt-2">{stats.activeTemplates} active</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalDownloads.toLocaleString()}</div>
              <div className="text-gray-600">Template Downloads</div>
              <div className="text-sm text-green-600 mt-2">+15% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Published</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.caseStories}</div>
              <div className="text-gray-600">Success Stories</div>
              <div className="text-sm text-green-600 mt-2">3 added this week</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Submitted</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rtiApplications.toLocaleString()}</div>
              <div className="text-gray-600">RTI Applications</div>
              <div className="text-sm text-blue-600 mt-2">45 pending review</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.monthlyUsers.toLocaleString()}</div>
              <div className="text-gray-600">Monthly Users</div>
              <div className="text-sm text-green-600 mt-2">+22% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-500">Urgent</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
              <div className="text-gray-600">Pending Reviews</div>
              <div className="text-sm text-red-600 mt-2">Requires attention</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { action: 'New template downloaded', item: 'Defective Product Complaint', time: '5 minutes ago', type: 'download' },
                  { action: 'Case story published', item: 'Insurance Claim Success', time: '1 hour ago', type: 'case' },
                  { action: 'RTI application submitted', item: 'Property Records Request', time: '2 hours ago', type: 'rti' },
                  { action: 'Template updated', item: 'Service Deficiency Complaint', time: '3 hours ago', type: 'update' },
                  { action: 'New user registration', item: 'Consumer Portal', time: '4 hours ago', type: 'user' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'download' ? 'bg-blue-100' :
                        activity.type === 'case' ? 'bg-green-100' :
                        activity.type === 'rti' ? 'bg-orange-100' :
                        activity.type === 'update' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'download' && <Download className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'case' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {activity.type === 'rti' && <Eye className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'update' && <Edit className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'user' && <Users className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.item}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Complaint Templates</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingTemplate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteTemplate(template.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="font-medium">{template.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{template.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                    Preview
                  </button>
                  <button 
                    onClick={() => toggleTemplateStatus(template.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      template.status === 'active' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {template.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Case Stories Tab */}
      {activeTab === 'cases' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Success Stories</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4" />
              Add Story
            </button>
          </div>

          <div className="space-y-4">
            {caseStories.map((story) => (
              <div key={story.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {story.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${story.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {story.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Issue:</h4>
                    <p className="text-gray-600 text-sm mb-4">{story.issue}</p>
                    
                    <h4 className="font-medium text-gray-800 mb-2">Resolution:</h4>
                    <p className="text-gray-600 text-sm">{story.resolution}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800 text-sm">Duration:</span>
                      </div>
                      <p className="text-blue-600 font-bold text-sm">{story.timeframe}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800 text-sm">Outcome:</span>
                      </div>
                      <p className="text-green-600 font-bold text-sm">{story.compensation}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800 text-sm">Added:</span>
                      </div>
                      <p className="text-gray-600 font-bold text-sm">{story.dateAdded}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* RTI Tab */}
      {activeTab === 'rti' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">RTI Applications</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <Search className="w-4 h-4" />
                Search
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Application ID</th>
                    <th className="text-left p-4 font-medium text-gray-700">Applicant</th>
                    <th className="text-left p-4 font-medium text-gray-700">Department</th>
                    <th className="text-left p-4 font-medium text-gray-700">Information Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rtiApplications.map((application) => (
                    <tr key={application.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{application.id}</td>
                      <td className="p-4">{application.applicantName}</td>
                      <td className="p-4">{application.department}</td>
                      <td className="p-4">{application.informationType}</td>
                      <td className="p-4">{application.submissionDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600">
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
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
                    className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Template Downloads by Category</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Bar chart showing downloads by category
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Monthly Downloads Trend</h3>
                <div className="h-64 bg-white rounded-lg border p-4">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Line chart showing monthly downloads
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Most Popular Templates</h3>
                <div className="space-y-3">
                  {templates
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 3)
                    .map((template, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{template.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">{template.downloads.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">RTI Application Status</h3>
                <div className="space-y-3">
                  {[
                    { status: 'Pending', count: 45, color: 'bg-yellow-100 text-yellow-800' },
                    { status: 'Processed', count: 28, color: 'bg-blue-100 text-blue-800' },
                    { status: 'Completed', count: 75, color: 'bg-green-100 text-green-800' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">User Activity</h3>
                <div className="space-y-3">
                  {[
                    { metric: 'Daily Active Users', value: '1,234', change: '+12%' },
                    { metric: 'Avg. Session Duration', value: '8m 24s', change: '+5%' },
                    { metric: 'Pages per Session', value: '4.2', change: '+3%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.metric}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">{item.value}</span>
                        <span className="text-xs text-green-600 ml-2">{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Template Modal */}
      {isAddingTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsAddingTemplate(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Complaint Template</h3>
              <button
                onClick={() => setIsAddingTemplate(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Template title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Product Quality">Product Quality</option>
                    <option value="Service Issues">Service Issues</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Banking">Banking</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of when to use this template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Format</option>
                  <option value="District Consumer Forum">District Consumer Forum</option>
                  <option value="State Consumer Commission">State Consumer Commission</option>
                  <option value="National Consumer Commission">National Consumer Commission</option>
                  <option value="Medical Consumer Forum">Medical Consumer Forum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Use Cases</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example scenarios where this template applies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Content</label>
                <textarea
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste the template content here..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingTemplate(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedTemplate.title}</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTemplate.status)}`}>
                  {selectedTemplate.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedTemplate.category}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedTemplate.downloads.toLocaleString()} downloads
                </span>
              </div>

              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Format</h4>
                  <p className="text-gray-700">{selectedTemplate.format}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Use Cases</h4>
                  <p className="text-gray-700">{selectedTemplate.useCase}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Template Preview:</h4>
                <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded border">
                  <p>To,</p>
                  <p>The Registrar,</p>
                  <p>{selectedTemplate.format}</p>
                  <p>[Address]</p>
                  <br />
                  <p>Subject: Consumer Complaint regarding {selectedTemplate.category}</p>
                  <br />
                  <p>Sir/Madam,</p>
                  <br />
                  <p>I, [Your Name], am filing this complaint against [Company/Shop Name]...</p>
                  <p className="text-gray-500">[Template continues with proper legal format]</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                  Download Full Template
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}