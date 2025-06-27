'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Fallback Component
const FallbackComponent = () => <div>Loading...</div>;

// Dynamic Imports for Lazy Loading
const EventHeroBanner = dynamic(() => import('@/components/features/events/EventHeroBanner'), { loading: () => <FallbackComponent />, ssr: false });
const EventFilters = dynamic(() => import('@/components/features/events/EventFilters'), { loading: () => <FallbackComponent />, ssr: false });
const EventCard = dynamic(() => import('@/components/features/events/EventCard'), { loading: () => <FallbackComponent />, ssr: false });
const EventModal = dynamic(() => import('@/components/features/events/EventModal'), { loading: () => <FallbackComponent />, ssr: false });
const FloatingDonateButton = dynamic(() => import('@/components/ui/FloatingDonateButton'), { loading: () => <FallbackComponent />, ssr: false });
const ChatbotButton = dynamic(() => import('@/components/features/ChatbotButton'), { loading: () => <FallbackComponent />, ssr: false });

import { fetchEvents } from '@/lib/api/events';

// GSAP ScrollTrigger Setup (Only Runs on Client)
let ScrollTrigger;
if (typeof window !== 'undefined') {
  const gsapPlugins = require('gsap/ScrollTrigger');
  ScrollTrigger = gsapPlugins.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPastEventsVisible, setIsPastEventsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const eventsRef = useRef(null);

  // Fetch Events
  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEvents();
        
        // Validate Data to Prevent Errors
        const validatedData = data.map(event => ({
          ...event,
          imageUrl: event.imageUrl || '/placeholder.jpg',
          date: event.date ? new Date(event.date).toISOString() : null,
        }));

        setEvents(validatedData);
        setFilteredEvents(validatedData.filter(event => new Date(event.date) > new Date()));

        // Extract Unique Categories
        const uniqueCategories = Array.from(new Set(validatedData.map(event => event.category))).filter(Boolean);
        setCategories(['All', ...uniqueCategories]);

      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;

    if (ScrollTrigger && eventsRef.current) {
      gsap.fromTo(
        '.event-animate',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          scrollTrigger: {
            trigger: eventsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, [isLoading, filteredEvents]);

  // Filter Events
  const filterEvents = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredEvents(events.filter(event => new Date(event.date) > new Date()));
    } else {
      setFilteredEvents(events.filter(event => event.category === category && new Date(event.date) > new Date()));
    }
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Banner */}
      <EventHeroBanner />

      {/* Event Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <motion.button
                className={`px-6 py-3 rounded-full font-semibold text-lg ${!isPastEventsVisible ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPastEventsVisible(false)}
              >
                Upcoming Events
              </motion.button>
              
              <motion.button
                className={`px-6 py-3 rounded-full font-semibold text-lg ${isPastEventsVisible ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPastEventsVisible(true)}
              >
                Past Events
              </motion.button>
            </div>
          </div>

          {/* Event Filters */}
          <EventFilters categories={categories} activeCategory={activeCategory} filterEvents={filterEvents} />
        </div>
      </section>

      {/* Event Listing */}
      <section ref={eventsRef} className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="text-center py-10 text-gray-600">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-600">No events available.</div>
            )}
          </div>
        )}
      </section>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>

      {/* Floating Buttons */}
      <FloatingDonateButton />
      <ChatbotButton />
    </main>
  );
}