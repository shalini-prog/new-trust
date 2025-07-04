'use client'

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ImpactMeter() {
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  
  // State for database data
  const [impactData, setImpactData] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from database
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dimpact');
        if (!response.ok) {
          throw new Error('Failed to fetch impact data');
        }
        const data = await response.json();
        
        // Filter only active impact stats
        const activeStats = data.impactStats.filter(stat => stat.isActive);
        setImpactData(activeStats);
        setMonthlyGoal(data.monthlyGoal);
        setSettings(data.settings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // Fallback to default data if fetch fails
        setImpactData([
          { 
            stat: 25000, 
            label: 'Children Helped', 
            icon: '👧', 
            prefix: '', 
            suffix: '+',
            color: 'from-blue-600 to-purple-600' 
          },
          { 
            stat: 150, 
            label: 'Community Projects', 
            icon: '🏙️', 
            prefix: '', 
            suffix: '',
            color: 'from-purple-600 to-pink-500' 
          },
          { 
            stat: 85, 
            label: 'Success Rate', 
            icon: '📈', 
            prefix: '', 
            suffix: '%',
            color: 'from-green-500 to-emerald-400' 
          },
          { 
            stat: 10000000, 
            label: 'Funds Raised', 
            icon: '💰', 
            prefix: '₹', 
            suffix: '',
            color: 'from-yellow-500 to-orange-500' 
          },
        ]);
        setMonthlyGoal({
          goal: 15000000,
          currentRaised: 10050000,
          currency: '₹',
          targetMonth: 'This Month'
        });
        setSettings({
          animationDuration: 2.5,
          enableScrollTrigger: true,
          displayFormat: 'compact',
          showProgressBar: true,
          enableHoverEffects: true
        });
      }
    };

    fetchImpactData();
  }, []);

  // Calculate goal progress
  const goalProgress = monthlyGoal ? Math.round((monthlyGoal.currentRaised / monthlyGoal.goal) * 100) : 0;

  useEffect(() => {
    if (!settings?.enableScrollTrigger || loading || impactData.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Animate the impact numbers counter
    counterRefs.current.forEach((ref, index) => {
      if (ref && impactData[index]) {
        const data = impactData[index];
        let startValue = 0;
        const endValue = data.stat;
        const duration = settings.animationDuration || 2.5;
        
        // Create the counter animation
        ScrollTrigger.create({
          trigger: ref,
          start: 'top 80%',
          onEnter: () => {
            const counter = { value: startValue };
            gsap.to(counter, {
              value: endValue,
              duration: duration,
              ease: 'power2.out',
              onUpdate: function() {
                if (ref) {
                  let displayValue = Math.floor(counter.value);
                  if (displayValue >= 1000000) {
                    // Format in millions
                    displayValue = +(displayValue / 1000000).toFixed(1);
                    ref.textContent = `${data.prefix}${displayValue}M${data.suffix}`;
                  } else if (displayValue >= 1000) {
                    // Format in thousands
                    displayValue = +(displayValue / 1000).toFixed(1);
                    ref.textContent = `${data.prefix}${displayValue}K${data.suffix}`;
                  } else {
                    ref.textContent = `${data.prefix}${displayValue}${data.suffix}`;
                  }
                }
              }
            });
          },
          once: true
        });
      }
    });
    
    // Animate the progress bar
    if (barRef.current && settings.showProgressBar) {
      ScrollTrigger.create({
        trigger: barRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(barRef.current, {
            width: `${goalProgress}%`,
            duration: 1.5,
            ease: 'power2.out'
          });
        },
        once: true
      });
    }
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [impactData, settings, loading, goalProgress]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading impact data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && impactData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">Failed to load impact data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your Impact Makes a Difference</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Together, we've accomplished incredible things. Every donation contributes to these amazing results.
        </p>
      </motion.div>
      
      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {impactData.map((item, index) => (
          <motion.div 
            key={item.label}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={settings?.enableHoverEffects ? { y: -5, transition: { duration: 0.2 } } : {}}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${item.color}`}>
              <span className="text-3xl">{item.icon}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              <span ref={el => (counterRefs.current[index] = el)}>0</span>
            </h3>
            <p className="text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Monthly Goal Progress */}
      {monthlyGoal && settings?.showProgressBar && (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
              {monthlyGoal.targetMonth} Fundraising Goal
            </h3>
            <div className="text-right">
              <p className="text-lg text-gray-600">
                <span className="font-bold text-purple-600">
                  {monthlyGoal.currency}{(monthlyGoal.currentRaised/1000000).toFixed(1)}M
                </span> raised of {monthlyGoal.currency}{(monthlyGoal.goal/1000000).toFixed(1)}M goal
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              ref={barRef}
              className="h-full w-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          
          {/* Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 mb-4">Help us reach our goal by making a donation today!</p>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300"
              whileHover={settings?.enableHoverEffects ? { scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" } : {}}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.querySelector('.donate-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Error notification (if data loaded with fallback) */}
      {error && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Using cached data - some information may not be current.
          </p>
        </div>
      )}
    </div>
  );
}