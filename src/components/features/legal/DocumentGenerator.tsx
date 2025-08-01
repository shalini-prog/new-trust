'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronRight, Check, X, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  usageCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
  fields: number;
}

interface AppSettings {
  pdfQuality: string;
  pageSize: string;
  includeWatermark: boolean;
  requireLogin: boolean;
  enablePreview: boolean;
  maxDocumentsPerDay: number;
}

const DocumentGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const docPreviewRef = useRef<HTMLDivElement>(null);

  // API endpoints - adjust these to match your backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/docu';

  // Fetch templates and settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch templates
        const templatesResponse = await fetch(`${API_BASE_URL}/templates`);
        if (!templatesResponse.ok) throw new Error('Failed to fetch templates');
        const templates = await templatesResponse.json();
        
        // Filter only active templates
        const activeTemplates = templates.filter((t: DocumentTemplate) => t.status === 'active');
        setDocumentTemplates(activeTemplates);

        // Fetch settings
        const settingsResponse = await fetch(`${API_BASE_URL}/settings`);
        if (!settingsResponse.ok) throw new Error('Failed to fetch settings');
        const settings = await settingsResponse.json();
        setAppSettings(settings);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Fallback to static data if API fails
        setDocumentTemplates([
          {
            id: 'rent-agreement',
            title: 'Rent Agreement',
            description: 'Create a legally binding rental contract between landlord and tenant',
            usageCount: 0,
            lastUpdated: '2024-01-15',
            status: 'active',
            fields: 8
          },
          {
            id: 'affidavit',
            title: 'Affidavit',
            description: 'Generate self-declaration, name change or income affidavits',
            usageCount: 0,
            lastUpdated: '2024-01-15',
            status: 'active',
            fields: 6
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get icon and color for template based on ID
  const getTemplateStyle = (templateId: string) => {
    const styles: Record<string, { icon: JSX.Element; color: string }> = {
      'rent-agreement': {
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-blue-100 text-blue-600'
      },
      'affidavit': {
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-purple-100 text-purple-600'
      },
      'power-of-attorney': {
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-green-100 text-green-600'
      },
      'will': {
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-amber-100 text-amber-600'
      },
      'sale-deed': {
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-teal-100 text-teal-600'
      }
    };
    
    return styles[templateId] || {
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-gray-100 text-gray-600'
    };
  };

  // Update template usage count in database
  const updateTemplateUsage = async (templateId: string) => {
    try {
      await fetch(`${API_BASE_URL}/templates/${templateId}/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      console.error('Failed to update template usage:', err);
    }
  };

  const rentAgreementFields = [
    { id: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true },
    { id: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
    { id: 'rentAmount', label: 'Monthly Rent (₹)', type: 'number', required: true },
    { id: 'depositAmount', label: 'Security Deposit (₹)', type: 'number', required: true },
    { id: 'duration', label: 'Agreement Duration (months)', type: 'number', required: true },
    { id: 'startDate', label: 'Start Date', type: 'date', required: true },
    { id: 'terms', label: 'Additional Terms', type: 'textarea', required: false },
  ];

  const affidavitFields = [
    { id: 'personName', label: 'Your Full Name', type: 'text', required: true },
    { id: 'fatherName', label: "Father's/Husband's Name", type: 'text', required: true },
    { id: 'address', label: 'Address', type: 'textarea', required: true },
    { id: 'purpose', label: 'Purpose of Affidavit', type: 'select', options: ['Name Change', 'Income Proof', 'Address Proof', 'Other'], required: true },
    { id: 'declaration', label: 'Declaration Content', type: 'textarea', required: true },
    { id: 'date', label: 'Date', type: 'date', required: true },
  ];

  const getTemplateFields = () => {
    switch (selectedTemplate) {
      case 'rent-agreement':
        return rentAgreementFields;
      case 'affidavit':
        return affidavitFields;
      // Add other template fields here
      default:
        return [];
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
  };

  const generateDocument = async () => {
    setIsGenerating(true);
    
    // Update template usage count
    if (selectedTemplate) {
      await updateTemplateUsage(selectedTemplate);
    }
    
    // Simulate document generation
    setTimeout(() => {
      setGeneratedDoc('generated');
      setCurrentStep(2);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadAsPDF = async () => {
    if (!docPreviewRef.current) return;
    
    const canvas = await html2canvas(docPreviewRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: appSettings?.pageSize || 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Add watermark if enabled
    if (appSettings?.includeWatermark) {
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(50);
      pdf.text('DRAFT', pdfWidth / 2, pdfHeight / 2, { 
        angle: 45, 
        align: 'center' 
      });
    }
    
    pdf.save(`${selectedTemplate}-document.pdf`);
  };

  const resetGenerator = () => {
    setSelectedTemplate(null);
    setCurrentStep(0);
    setFormData({});
    setGeneratedDoc(null);
  };

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg">Loading templates...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTemplates.map((template) => {
                const style = getTemplateStyle(template.id);
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-xl shadow-md cursor-pointer transition-all ${style.color}`}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setCurrentStep(1);
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${style.color.replace('text', 'bg').replace('600', '500/20')}`}>
                        {style.icon}
                      </div>
                      <h3 className="text-xl font-bold">{template.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Used {template.usageCount} times</span>
                      <span>Updated: {template.lastUpdated}</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Select</span>
                      <ChevronRight className="ml-1 w-5 h-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
        
      case 1:
        const selectedTemplateData = documentTemplates.find(t => t.id === selectedTemplate);
        return (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">
              {selectedTemplateData?.title} Details
            </h3>
            
            <div className="space-y-6">
              {getTemplateFields().map((field) => (
                <div key={field.id}>
                  <label className="block text-gray-700 font-medium mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={generateDocument}
                disabled={isGenerating || !getTemplateFields().every(field => !field.required || formData[field.id])}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate Document'}
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Your Document is Ready!</h3>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div ref={docPreviewRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedTemplate === 'rent-agreement' ? 'RENTAL AGREEMENT' : 
                       selectedTemplate === 'affidavit' ? 'AFFIDAVIT' : 'LEGAL DOCUMENT'}
                    </h2>
                    <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
                  </div>
                  
                  {selectedTemplate === 'rent-agreement' && (
                    <div className="space-y-6">
                      <p className="text-justify">
                        This Rental Agreement is made on this {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : '___'} day of ______, 20__ between <strong>{formData.landlordName || '_________'}</strong> (hereinafter referred to as the "Landlord") and <strong>{formData.tenantName || '_________'}</strong> (hereinafter referred to as the "Tenant").
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold">1. PROPERTY DETAILS:</h4>
                        <p>The Landlord agrees to rent out the property located at: <strong>{formData.propertyAddress || '_________'}</strong>.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold">2. TERM:</h4>
                        <p>The tenancy shall be for a period of <strong>{formData.duration || '___'}</strong> months commencing from <strong>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : '_________'}</strong>.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold">3. RENT:</h4>
                        <p>The monthly rent shall be <strong>₹{formData.rentAmount || '___'}</strong> payable in advance on or before the 5th day of each calendar month.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold">4. SECURITY DEPOSIT:</h4>
                        <p>The Tenant has paid a security deposit of <strong>₹{formData.depositAmount || '___'}</strong> which shall be refundable at the termination of this agreement, subject to deductions for any damages beyond normal wear and tear.</p>
                      </div>
                      
                      {formData.terms && (
                        <div className="space-y-2">
                          <h4 className="font-bold">5. ADDITIONAL TERMS:</h4>
                          <p>{formData.terms}</p>
                        </div>
                      )}
                      
                      <div className="mt-8 flex justify-between">
                        <div>
                          <p className="font-bold">LANDLORD</p>
                          <p className="mt-4">Signature: _________________</p>
                          <p>Name: {formData.landlordName || '_________'}</p>
                        </div>
                        <div>
                          <p className="font-bold">TENANT</p>
                          <p className="mt-4">Signature: _________________</p>
                          <p>Name: {formData.tenantName || '_________'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedTemplate === 'affidavit' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="font-bold">AFFIDAVIT</p>
                      </div>
                      
                      <p className="text-justify">
                        I, <strong>{formData.personName || '_________'}</strong> son/daughter/wife of <strong>{formData.fatherName || '_________'}</strong>, residing at <strong>{formData.address || '_________'}</strong>, do hereby solemnly affirm and declare as under:
                      </p>
                      
                      <p className="text-justify">
                        {formData.declaration || '_________'}
                      </p>
                      
                      <p className="text-justify">
                        That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therein.
                      </p>
                      
                      <div className="mt-12 flex justify-between">
                        <div>
                          <p>Date: {formData.date ? new Date(formData.date).toLocaleDateString() : '_________'}</p>
                          <p>Place: _______________</p>
                        </div>
                        <div className="text-right">
                          <p>DEPONENT</p>
                          <p className="mt-4">Signature: _________________</p>
                          <p>Name: {formData.personName || '_________'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/3 space-y-4">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-lg mb-4">Document Actions</h4>
                  <button
                    onClick={downloadAsPDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  >
                    <Download className="w-5 h-5" />
                    Download as PDF
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Send to Email
                  </button>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-bold text-lg mb-2">Need Legal Review?</h4>
                  <p className="text-gray-700 mb-4">Get this document reviewed by our legal experts for accuracy.</p>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Request Legal Review
                  </button>
                </div>
                
                <button
                  onClick={resetGenerator}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mt-4"
                >
                  Create Another Document
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Legal Document Generator</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional legal documents in minutes with our easy-to-use templates
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep + 1 >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep + 1 > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep + 1 > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-md mx-auto">
            <span className={currentStep >= 0 ? 'text-blue-600 font-medium' : ''}>Select Template</span>
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Enter Details</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Download</span>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default DocumentGenerator;