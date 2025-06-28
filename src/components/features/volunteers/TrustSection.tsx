'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Award, 
  Building2, 
  CheckCircle, 
  Download,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const TrustSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState([]);
  const [trustMetrics, setTrustMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for different partner types
  const getPartnerIcon = (partnerType) => {
    const iconMap = {
      'healthcare': Heart,
      'education': Users,
      'environment': Globe,
      'security': Shield,
      'charity': Award,
      'default': Building2
    };
    return iconMap[partnerType] || iconMap.default;
  };

  // Fetch partners and trust metrics from database
  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/vtrust');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPartners(data.partners || []);
        setTrustMetrics(data.trustMetrics || {});
      } catch (err) {
        console.error('Error fetching trust data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate the partner logos only after data is loaded
    if (sectionRef.current && !loading && partners.length > 0) {
      gsap.from('.partner-logo', {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, partners]);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading trust data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-600">Failed to load trust data: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter only active partners
  const activePartners = partners.filter(partner => partner.status === 'active');

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trust & Transparency</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in complete transparency about how we utilize donations to maximize our impact.
          </p>
          
          {/* Trust Metrics Display */}
          {trustMetrics && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{trustMetrics.verified_partners || 0}</p>
                <p className="text-sm text-gray-600">Verified Partners</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{trustMetrics.transparency_score || 0}%</p>
                <p className="text-sm text-gray-600">Transparency Score</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{trustMetrics.impact_reports_published || 0}</p>
                <p className="text-sm text-gray-600">Impact Reports</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{trustMetrics.certification_level || 'N/A'}</p>
                <p className="text-sm text-gray-600">Certification</p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-center">
          {/* Verified Non-Profit Partners */}
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Verified Non-Profit Partners
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({activePartners.length} active partners)
              </span>
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              We collaborate with reputable organizations worldwide to amplify our impact and ensure accountability.
            </p>

            {activePartners.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {activePartners.map((partner, index) => {
                  const IconComponent = getPartnerIcon(partner.type);
                  return (
                    <div 
                      key={partner._id || index} 
                      className="partner-logo bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-24 hover:shadow-md transition-shadow duration-300 group"
                      title={`${partner.name} - Partner since ${new Date(partner.partnership_since).getFullYear()}`}
                    >
                      <IconComponent className="h-8 w-8 text-gray-600 group-hover:text-purple-600 transition-colors duration-300 mb-1" />
                      <span className="text-xs text-gray-500 text-center truncate w-full px-1">
                        {partner.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No active partners found.</p>
              </div>
            )}

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/impact-report"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 mr-4"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                View Impact Report
              </Link>
              
              <Link 
                href="/volunteer-handbook"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Handbook
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;