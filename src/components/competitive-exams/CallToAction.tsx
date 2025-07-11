'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CallToAction = () => {
  const [ctaData, setCTAData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  // Fetch CTA content from database
  useEffect(() => {
    const fetchCTAData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ecta');
        if (!response.ok) {
          throw new Error('Failed to fetch CTA content');
        }
        const data = await response.json();
        setCTAData(data);
        
        // Initialize form data with default values
        const initialFormData = {};
        data.formFields?.forEach(field => {
          initialFormData[field.label.toLowerCase().replace(/\s+/g, '_')] = '';
        });
        setFormData(initialFormData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching CTA data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCTAData();
  }, []);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You can add API call to submit form data
  };

  // Loading state
  if (loading) {
    return (
      <motion.section
        id="call-to-action"
        className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white/80">Loading...</p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        id="call-to-action"
        className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-red-300">Error loading content: {error}</p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Don't render if data is not active
  if (!ctaData?.isActive) {
    return null;
  }

  return (
    <motion.section
      id="call-to-action"
      className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {ctaData.title || "Ready to Supercharge Your Exam Preparation?"}
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {ctaData.subtitle || "Join thousands of successful aspirants who have achieved their goals with our comprehensive preparation platform."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Why Choose Our Platform?</h3>
                <ul className="space-y-3">
                  {(ctaData.benefits || []).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 mr-2 mt-1 bg-green-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Success Rate</span>
                    <span className="font-bold">{ctaData.successRate || 94}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${ctaData.successRate || 94}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-white/80">
                    {ctaData.successRateText || `${ctaData.successRate || 94}% of our students clear their target exams in first attempt`}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-primary" 
                      style={{ 
                        backgroundImage: `url(/images/avatars/avatar-${i}.jpg)`,
                        backgroundSize: 'cover',
                        zIndex: 5 - i
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-bold">{ctaData.studentsEnrolled?.toLocaleString() || '10,000+'}+</span> students enrolled
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Start Your Journey Today</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {(ctaData.formFields || [])
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((field, index) => {
                    const fieldName = field.label.toLowerCase().replace(/\s+/g, '_');
                    
                    if (field.type === 'select' && field.label.toLowerCase().includes('exam')) {
                      return (
                        <div key={index}>
                          <label htmlFor={fieldName} className="text-sm font-medium block mb-1">
                            {field.label}
                          </label>
                          <select 
                            id={fieldName}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleInputChange(fieldName, e.target.value)}
                            required={field.required}
                          >
                            <option value="" className="bg-primary">
                              {field.placeholder || 'Select an option'}
                            </option>
                            {(ctaData.examOptions || [])
                              .filter(option => option.isActive)
                              .map((option, optIndex) => (
                                <option key={optIndex} value={option.value} className="bg-primary">
                                  {option.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index}>
                        <label htmlFor={fieldName} className="text-sm font-medium block mb-1">
                          {field.label}
                        </label>
                        <input 
                          type={field.type || 'text'}
                          id={fieldName}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/60 text-white"
                          placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                          value={formData[fieldName] || ''}
                          onChange={(e) => handleInputChange(fieldName, e.target.value)}
                          required={field.required}
                        />
                      </div>
                    );
                  })}
                
                <button 
                  type="submit" 
                  className="w-full mt-6 bg-white text-primary hover:bg-gray-100 font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
                >
                  Get Started Free
                </button>
                <p className="text-sm text-center text-white/80 mt-2">
                  Free 7-day trial, no credit card required
                </p>
              </form>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/80 text-sm mb-4">Trusted by top coaching institutes across India</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-80">
              {/* Generate partner logo placeholders based on database value */}
              {Array.from({ length: ctaData.partnerLogos || 5 }, (_, i) => (
                <div key={i} className="h-8 w-24 bg-white/20 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CallToAction;