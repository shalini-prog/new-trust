'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaPlay, FaLinkedin } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { gsap } from 'gsap';

interface TopperStory {
  _id: string;
  name: string;
  rank: number;
  exam: string;
  batch: string;
  quote: string;
  image: string;
  videoUrl?: string;
  highlights: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface TopperStoriesProps {
  apiEndpoint?: string; // Optional prop to override default endpoint
}

export default function TopperStories({ apiEndpoint = 'http://localhost:5000/api/etop' }: TopperStoriesProps) {
  const storiesRef = useRef<HTMLDivElement>(null);
  const gsapTimeline = useRef<gsap.core.Timeline | null>(null);
  const [toppers, setToppers] = useState<TopperStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch topper stories from database
  useEffect(() => {
    const fetchTopperStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setToppers(data);
        } else {
          console.error('Expected array but got:', typeof data);
          setToppers([]);
        }
      } catch (err) {
        console.error('Error fetching topper stories:', err);
        setError('Failed to load success stories. Please try again later.');
        setToppers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopperStories();
  }, [apiEndpoint]);
  
  // GSAP animation effect
  useEffect(() => {
    // Only set up GSAP animation if we have stories and the DOM element exists
    if (storiesRef.current && toppers.length > 1) {
      // Kill previous timeline if it exists
      if (gsapTimeline.current) {
        gsapTimeline.current.kill();
      }
      
      // Create new timeline
      gsapTimeline.current = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power1.inOut" }
      });
      
      // Set up the animation
      gsapTimeline.current.to(".story-cards", {
        xPercent: -100 * (toppers.length - 1),
        duration: toppers.length * 5,
        ease: "none"
      });
      
      // Cleanup function
      return () => {
        if (gsapTimeline.current) {
          gsapTimeline.current.kill();
        }
      };
    }
  }, [toppers]);
  
  // Loading state
  if (loading) {
    return (
      <section id="topper-stories" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Topper's Interviews & Success Stories <span className="text-blue-600 dark:text-blue-400">🏅</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get inspired by the journey and strategies of top rankers
            </p>
          </div>
          
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg max-w-4xl mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading success stories...</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (error) {
    return (
      <section id="topper-stories" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Topper's Interviews & Success Stories <span className="text-blue-600 dark:text-blue-400">🏅</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get inspired by the journey and strategies of top rankers
            </p>
          </div>
          
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg max-w-4xl mx-auto">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  // Empty state
  if (toppers.length === 0) {
    return (
      <section id="topper-stories" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
              Topper's Interviews & Success Stories <span className="text-blue-600 dark:text-blue-400">🏅</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get inspired by the journey and strategies of top rankers
            </p>
          </div>
          
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg max-w-4xl mx-auto">
            <p className="text-slate-600 dark:text-slate-300">No success stories available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="topper-stories" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-slate-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Topper's Interviews & Success Stories <span className="text-blue-600 dark:text-blue-400">🏅</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Get inspired by the journey and strategies of top rankers
          </motion.p>
        </div>
        
        {/* Auto-Scrolling Stories */}
        {toppers.length > 0 && (
          <div className="relative overflow-hidden mb-16" ref={storiesRef}>
            <div className="story-cards flex gap-6">
              {toppers.map((topper) => (
                <Card key={topper._id} className="min-w-full md:min-w-[500px] lg:min-w-[800px] shadow-lg border-0">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="bg-blue-600 text-white p-8 flex flex-col justify-center">
                        <div className="mb-6">
                          <FaQuoteLeft className="text-3xl text-blue-200 mb-4" />
                          <p className="text-lg italic mb-4">{topper.quote}</p>
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                              <AvatarImage src={topper.image} alt={topper.name} />
                              <AvatarFallback>{topper.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold">{topper.name}</h4>
                              <p className="text-sm text-blue-200">
                                {topper.exam} Rank {topper.rank} ({topper.batch})
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {topper.socialLinks && topper.socialLinks.linkedin && (
                          <div className="mt-auto">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:text-blue-200"
                              onClick={() => window.open(topper.socialLinks.linkedin, '_blank')}
                            >
                              <FaLinkedin className="mr-2" /> Connect on LinkedIn
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-8 bg-white dark:bg-slate-800">
                        <h4 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Success Strategy Highlights</h4>
                        {Array.isArray(topper.highlights) && topper.highlights.length > 0 ? (
                          <ul className="space-y-3 mb-6">
                            {topper.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 font-bold mr-2">•</span>
                                <span className="text-slate-600 dark:text-slate-300">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-300 mb-6">No highlights available.</p>
                        )}
                        
                        {topper.videoUrl && (
                          <Button 
                            className="flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => window.open(topper.videoUrl, '_blank')}
                          >
                            <FaPlay />
                            <span>Watch Full Interview</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {toppers.slice(0, Math.min(3, toppers.length)).map((topper) => (
            <motion.div 
              key={topper._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-blue-100">
                      <AvatarImage src={topper.image} alt={topper.name} />
                      <AvatarFallback>{topper.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{topper.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {topper.exam} Rank {topper.rank} ({topper.batch})
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-slate-600 dark:text-slate-300 italic">
                      <FaQuoteLeft className="text-blue-600 inline mr-2" />
                      {topper.quote}
                    </p>
                  </div>
                  
                  <Button variant="link" className="px-0 text-blue-600">Read Full Interview</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {toppers.length > 3 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="px-6">View All Success Stories</Button>
          </div>
        )}
      </div>
    </section>
  );
}