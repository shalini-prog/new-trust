'use client'

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TransparencySection() {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  
  const fundAllocation = [
    { category: 'Direct Aid Programs', percentage: 65, color: '#6366f1' },
    { category: 'Education Initiatives', percentage: 20, color: '#8b5cf6' },
    { category: 'Administrative Costs', percentage: 8, color: '#14b8a6' },
    { category: 'Fundraising', percentage: 7, color: '#f59e0b' },
  ];
  
  // Security features
  const securityFeatures = [
    {
      title: '256-bit SSL Encryption',
      description: 'All transactions are secured with bank-level encryption technology.',
      icon: '🔒'
    },
    {
      title: 'PCI DSS Compliant',
      description: 'We follow all Payment Card Industry Data Security Standards.',
      icon: '✓'
    },
    {
      title: 'Transparent Reporting',
      description: 'Quarterly financial reports available to all donors.',
      icon: '📊'
    },
    {
      title: 'Verified by Charity Navigator',
      description: 'Top-rated organization with 4-star rating for transparency.',
      icon: '⭐'
    }
  ];
  
  // Function to calculate pie chart paths with fixed precision
  const calculatePieChartPaths = () => {
    return fundAllocation.map((item, index) => {
      // Calculate the segment angles
      const previousSegments = fundAllocation.slice(0, index);
      const previousTotal = previousSegments.reduce((acc, curr) => acc + curr.percentage, 0);
      const startAngle = (previousTotal / 100) * 360;
      const endAngle = ((previousTotal + item.percentage) / 100) * 360;
      
      // Convert to radians for calculation
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate path coordinates with fixed precision
      const radius = 80;
      const cx = 112;
      const cy = 112;
      
      const x1 = parseFloat((cx + radius * Math.cos(startRad)).toFixed(5));
      const y1 = parseFloat((cy + radius * Math.sin(startRad)).toFixed(5));
      const x2 = parseFloat((cx + radius * Math.cos(endRad)).toFixed(5));
      const y2 = parseFloat((cy + radius * Math.sin(endRad)).toFixed(5));
      
      // Determine if the arc should be drawn as a large arc
      const largeArcFlag = item.percentage > 50 ? 1 : 0;
      
      // Create SVG path
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      return {
        category: item.category,
        color: item.color,
        pathData
      };
    });
  };

  useEffect(() => {
    // Set isClient to true to indicate client-side rendering
    setIsClient(true);
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate the pie chart segments
    if (pieChartRef.current) {
      const segments = pieChartRef.current.querySelectorAll('.pie-segment');
      
      gsap.set(segments, { opacity: 0, scale: 0.8 });
      
      ScrollTrigger.create({
        trigger: pieChartRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(segments, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out'
          });
        },
        once: true
      });
    }
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Pre-calculate paths for server-side rendering
  const pieChartPaths = calculatePieChartPaths();

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Transparency & Accountability</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We believe in complete transparency. Here's how your donations are making an impact and how we keep your information secure.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Where Your Money Goes */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Where Your Money Goes</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Pie Chart */}
            <div ref={pieChartRef} className="relative w-64 h-64 mb-8 md:mb-0">
              {/* Render pie chart only on client-side to avoid hydration mismatch */}
              {isClient && pieChartPaths.map((item) => (
                <svg 
                  key={item.category} 
                  className="absolute top-0 left-0 w-full h-full pie-segment"
                  viewBox="0 0 224 224"
                >
                  <path 
                    d={item.pathData}
                    fill={item.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              ))}
            </div>
            
            {/* Legend */}
            <div className="md:ml-8">
              {fundAllocation.map((item) => (
                <div key={item.category} className="flex items-center mb-4">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-gray-600 text-sm">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-4">
            <a 
              href="#" 
              className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 flex items-center"
            >
              Download our annual financial report
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </motion.div>
        
        {/* Security & Trust */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Secure & Trusted</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="flex"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 mr-4 text-2xl">
                  <span>{feature.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{feature.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 text-blue-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-blue-800 mb-1">100% Satisfaction Guarantee</h4>
                <p className="text-blue-700 text-sm">
                  If you have any concerns about your donation, please contact us and we'll address them immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Certifications */}
      <motion.div 
        className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap justify-center items-center gap-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center opacity-80 hover:opacity-100 transition-opacity duration-200">
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-sm text-gray-600 font-medium">Charity Excellence Award</p>
        </div>
        <div className="text-center opacity-80 hover:opacity-100 transition-opacity duration-200">
          <div className="text-5xl mb-2">🌐</div>
          <p className="text-sm text-gray-600 font-medium">ISO 9001 Certified</p>
        </div>
        <div className="text-center opacity-80 hover:opacity-100 transition-opacity duration-200">
          <div className="text-5xl mb-2">🔐</div>
          <p className="text-sm text-gray-600 font-medium">Privacy Shield Compliant</p>
        </div>
        <div className="text-center opacity-80 hover:opacity-100 transition-opacity duration-200">
          <div className="text-5xl mb-2">⭐</div>
          <p className="text-sm text-gray-600 font-medium">Five Star Transparency Rating</p>
        </div>
      </motion.div>
    </div>
  );
}