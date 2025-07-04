'use client'

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    isEnabled: true,
    title: 'Donor Stories',
    subtitle: 'Read what our donors have to say about their giving experience and the impact they\'ve helped create.',
    autoScroll: true,
    scrollSpeed: 100,
    showRatings: true,
    maxVisible: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials and settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch testimonials and settings in parallel
        const [testimonialsResponse, settingsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/dtest'),
          fetch('http://localhost:5000/api/dtest/settings')
        ]);

        if (!testimonialsResponse.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const testimonialsData = await testimonialsResponse.json();
        
        // Filter active testimonials and limit by maxVisible setting
        const activeTestimonials = testimonialsData
          .filter(testimonial => testimonial.isActive)
          .slice(0, settings.maxVisible);
        
        setTestimonials(activeTestimonials);

        // Handle settings response (it might not exist initially)
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...settingsData
            }));
          }
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // GSAP Auto-scrolling animation
  useEffect(() => {
    if (!settings.autoScroll || testimonials.length === 0 || loading) return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Auto-scrolling for testimonials
    if (scrollRef.current) {
      const testimonialCards = scrollRef.current.querySelectorAll('.testimonial-card');
      if (testimonialCards.length === 0) return;

      const totalWidth = Array.from(testimonialCards).reduce((width, card) => width + card.clientWidth + 24, 0);
      const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      
      if (scrollWidth <= 0) return; // No need to scroll if content fits
      
      // Create the scrolling animation
      const scrollAnimation = gsap.to(scrollRef.current, {
        scrollLeft: scrollWidth,
        duration: totalWidth / settings.scrollSpeed,
        ease: "none",
        repeat: -1,
        yoyo: true,
        repeatDelay: 1
      });
      
      // Pause animation on hover
      const handleMouseEnter = () => {
        scrollAnimation.pause();
      };
      
      // Resume animation on mouse leave
      const handleMouseLeave = () => {
        scrollAnimation.resume();
      };

      const scrollElement = scrollRef.current;
      scrollElement.addEventListener('mouseenter', handleMouseEnter);
      scrollElement.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        // Clean up animations and event listeners
        scrollAnimation.kill();
        if (scrollElement) {
          scrollElement.removeEventListener('mouseenter', handleMouseEnter);
          scrollElement.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [testimonials, settings.autoScroll, settings.scrollSpeed, loading]);

  // Don't render if section is disabled
  if (!settings.isEnabled) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-white bg-opacity-20 rounded mb-4 max-w-md mx-auto"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded mb-8 max-w-2xl mx-auto"></div>
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 md:w-96 h-64 bg-white bg-opacity-10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Error Loading Testimonials</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="bg-white bg-opacity-10 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">No Testimonials Available</h3>
          <p className="text-sm opacity-80">Check back later for donor stories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.title}</h2>
        {settings.subtitle && (
          <p className="text-xl opacity-80 max-w-3xl mx-auto">
            {settings.subtitle}
          </p>
        )}
      </motion.div>
      
      {/* Auto-scrolling testimonial container */}
      <div 
        ref={scrollRef}
        className="flex space-x-6 overflow-x-scroll pb-8 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id || index}
            className="testimonial-card flex-shrink-0 bg-white bg-opacity-10 rounded-xl shadow-xl p-6 md:p-8 w-80 md:w-96"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                {testimonial.image && testimonial.image !== '' ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initial letter if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center bg-purple-200 text-purple-700 text-xl font-bold"
                  style={{ display: testimonial.image && testimonial.image !== '' ? 'none' : 'flex' }}
                >
                  {testimonial.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p className="opacity-80 text-sm">{testimonial.role}</p>
                {testimonial.dateAdded && (
                  <p className="opacity-60 text-xs mt-1">
                    {new Date(testimonial.dateAdded).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <svg className="w-8 h-8 text-purple-300 mb-2 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-2.8 0-5 2.2-5 5s2.2 5 5 5c0.8 0 1.5-0.2 2.1-0.5-0.6 2.6-2.6 4.2-5.1 4.5v2c4.9-0.3 8-4.4 8-9.5 0-3.6-2.2-6.5-5-6.5zM22 8c-2.8 0-5 2.2-5 5s2.2 5 5 5c0.8 0 1.5-0.2 2.1-0.5-0.6 2.6-2.6 4.2-5.1 4.5v2c4.9-0.3 8-4.4 8-9.5 0-3.6-2.2-6.5-5-6.5z"></path>
              </svg>
              <p className="italic">{testimonial.quote}</p>
            </div>
            
            {settings.showRatings && (
              <div className="flex items-center mt-auto">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'text-yellow-300' : 'text-gray-400'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Call to Action */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg mb-6">Join our community of donors and make a difference today.</p>
        <motion.button
          className="px-8 py-3 bg-white text-purple-700 font-bold rounded-full hover:bg-opacity-90 transition-all duration-300"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.querySelector('.donate-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          Become a Donor
        </motion.button>
      </motion.div>
      
      {/* Custom style for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}