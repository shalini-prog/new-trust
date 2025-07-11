'use client';

import { RefObject, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Users, Briefcase, Loader2 } from 'lucide-react';

interface Exam {
  _id: string;
  title: string;
  description: string;
  icon: string;
  eligibility: string;
  pattern: string;
  opportunities: string;
  isActive: boolean;
}

interface ExamOverviewProps {
  examOverviewRef: RefObject<HTMLDivElement>;
}

export default function ExamOverview({ examOverviewRef }: ExamOverviewProps) {
  const [examData, setExamData] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

  // Fetch exam data from API
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/eoverview');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter only active exams
        const activeExams = data.filter((exam: Exam) => exam.isActive);
        setExamData(activeExams);
        setError(null);
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setError('Failed to load exam data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

  const toggleCardDetails = (examId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-12 h-12 text-blue-600" />;
      case 'clock':
        return <Clock className="w-12 h-12 text-green-600" />;
      case 'users':
        return <Users className="w-12 h-12 text-purple-600" />;
      case 'briefcase':
        return <Briefcase className="w-12 h-12 text-orange-600" />;
      default:
        return <Award className="w-12 h-12 text-blue-600" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="exams" className="py-16 md:py-24 bg-white" ref={examOverviewRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-xl text-gray-600">Loading exam data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="exams" className="py-16 md:py-24 bg-white" ref={examOverviewRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (examData.length === 0) {
    return (
      <section id="exams" className="py-16 md:py-24 bg-white" ref={examOverviewRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Exams Available</h3>
              <p className="text-gray-600">No active exams found at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="exams" className="py-16 md:py-24 bg-white" ref={examOverviewRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            📍 Introduction to Competitive Exams 🏆
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A detailed overview of all major competitive exams in India, their eligibility, 
            exam pattern, syllabus, and job opportunities after selection.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examData.map((exam) => (
            <motion.div 
              key={exam._id}
              className="exam-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-4 flex justify-center">
                    {getIcon(exam.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">{exam.title}</h3>
                  <p className="text-gray-600 text-center flex-grow">{exam.description}</p>
                  
                  {/* Toggle Button */}
                  <div className="mt-6 flex justify-center">
                    <button 
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                      onClick={() => toggleCardDetails(exam._id)}
                    >
                      {expandedCards[exam._id] ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  
                  {/* Details Panel with transition */}
                  {expandedCards[exam._id] && (
                    <motion.div 
                      className="mt-6 pt-4 border-t border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-blue-600">Eligibility:</h4>
                          <p className="text-gray-700 text-sm">{exam.eligibility}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-600">Exam Pattern:</h4>
                          <p className="text-gray-700 text-sm">{exam.pattern}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-600">Job Opportunities:</h4>
                          <p className="text-gray-700 text-sm">{exam.opportunities}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}