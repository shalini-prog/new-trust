'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaDownload, FaPlay, FaTrophy } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface CurrentAffairsItem {
  _id: string;
  type: string;
  title: string;
  category?: string;
  date?: string;
  summary?: string;
  imageUrl?: string;
  source?: string;
  questions?: number;
  duration?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  participants?: number;
  name?: string;
  daysLeft?: number;
}

interface CurrentAffairsProps {
  apiBaseUrl?: string; // Optional prop to configure API base URL
}

export default function CurrentAffairs({ apiBaseUrl = 'http://localhost:5000/api/ecurr' }: CurrentAffairsProps) {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState<CurrentAffairsItem[]>([]);
  const [quizzes, setQuizzes] = useState<CurrentAffairsItem[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<CurrentAffairsItem[]>([]);
  const [loading, setLoading] = useState({
    news: false,
    quiz: false,
    exam: false
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch data function
  const fetchData = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}?type=${type}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      switch (type) {
        case 'news':
          setNews(data);
          break;
        case 'quiz':
          setQuizzes(data);
          break;
        case 'exam':
          setUpcomingExams(data);
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
      setError(`Failed to load ${type} data. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData('news');
    fetchData('quiz');
    fetchData('exam');
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'news':
        if (news.length === 0) fetchData('news');
        break;
      case 'quiz':
        if (quizzes.length === 0) fetchData('quiz');
        break;
      case 'mocks':
        if (upcomingExams.length === 0) fetchData('exam');
        break;
    }
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="text-center py-8">
      <p className="text-red-500 dark:text-red-400 mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline">
        Retry
      </Button>
    </div>
  );

  return (
    <section id="current-affairs" className="py-20 bg-slate-100 dark:bg-slate-800/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-slate-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Daily Current Affairs & Mock Tests <span className="text-blue-600 dark:text-blue-400">📅</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Stay updated with daily news analysis, quizzes, and mock tests
          </motion.p>
        </div>
        
        {/* Upcoming Exams Timer */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-white text-center">Upcoming Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading.exam ? (
              <LoadingSpinner />
            ) : error && activeTab === 'exam' ? (
              <ErrorMessage 
                message={error} 
                onRetry={() => fetchData('exam')} 
              />
            ) : upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <Card key={exam._id} className="overflow-hidden border-0 shadow-md bg-white dark:bg-slate-700">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{exam.name || exam.title}</h4>
                      <p className="text-slate-500 dark:text-slate-300 mb-4">Exam Date: {exam.date}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-600" />
                          <span className="text-slate-700 dark:text-slate-200">{exam.daysLeft} days left</span>
                        </div>
                        <Button variant="outline" size="sm">Set Reminder</Button>
                      </div>
                    </div>
                    <div className="h-2 bg-blue-600" style={{ width: `${100 - ((exam.daysLeft || 0) / 100) * 100}%` }}></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No upcoming exams available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs for News, Quiz, and Mock Tests */}
        <Tabs defaultValue="news" onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center space-x-2 pb-6 overflow-x-auto max-w-xl mx-auto">
            <TabsTrigger value="news" className="px-4 py-2 rounded-full">Daily News Analysis</TabsTrigger>
            <TabsTrigger value="quiz" className="px-4 py-2 rounded-full">Daily Quiz</TabsTrigger>
            <TabsTrigger value="mocks" className="px-4 py-2 rounded-full">Mock Tests</TabsTrigger>
          </TabsList>
          
          {/* News Tab */}
          <TabsContent value="news">
            {loading.news ? (
              <LoadingSpinner />
            ) : error && activeTab === 'news' ? (
              <ErrorMessage 
                message={error} 
                onRetry={() => fetchData('news')} 
              />
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === 'news' ? 'visible' : 'hidden'}
              >
                {news.length > 0 ? (
                  news.map((item) => (
                    <motion.div key={item._id} variants={itemVariants}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <img 
                              src={item.imageUrl || '/api/placeholder/400/200'} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/400/200';
                              }}
                            />
                            <Badge className="absolute top-2 right-2 bg-blue-600">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="p-5">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{item.date}</p>
                            <h4 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">{item.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">{item.summary}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400">Source: {item.source}</span>
                              <Button variant="link" className="text-blue-600 p-0">Read More</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No news articles available</p>
                  </div>
                )}
              </motion.div>
            )}
            <div className="mt-8 text-center">
              <Button variant="outline" className="px-6">
                <FaDownload className="mr-2" /> Download Weekly Compilation
              </Button>
            </div>
          </TabsContent>
          
          {/* Quiz Tab */}
          <TabsContent value="quiz">
            {loading.quiz ? (
              <LoadingSpinner />
            ) : error && activeTab === 'quiz' ? (
              <ErrorMessage 
                message={error} 
                onRetry={() => fetchData('quiz')} 
              />
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === 'quiz' ? 'visible' : 'hidden'}
              >
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <motion.div key={quiz._id} variants={itemVariants}>
                      <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                          <CardTitle>{quiz.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">Questions:</span>
                              <span className="font-semibold text-slate-800 dark:text-white">{quiz.questions}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">Duration:</span>
                              <span className="font-semibold text-slate-800 dark:text-white">{quiz.duration} mins</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">Difficulty:</span>
                              <Badge className={`
                                ${quiz.difficulty === 'Easy' ? 'bg-green-500' : ''}
                                ${quiz.difficulty === 'Medium' ? 'bg-yellow-500' : ''}
                                ${quiz.difficulty === 'Hard' ? 'bg-red-500' : ''}
                              `}>
                                {quiz.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">Participants:</span>
                              <div className="flex items-center">
                                <FaTrophy className="text-yellow-500 mr-1" />
                                <span className="font-semibold text-slate-800 dark:text-white">{quiz.participants}</span>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                            <FaPlay className="mr-2" /> Start Quiz
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No quizzes available</p>
                  </div>
                )}
              </motion.div>
            )}
            <div className="mt-10 bg-blue-50 dark:bg-blue-900/30 p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">AI-Powered Quiz Generator</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Generate custom quizzes based on your performance. The questions adapt to your strengths and weaknesses.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Generate Personalized Quiz
              </Button>
            </div>
          </TabsContent>
          
          {/* Mock Tests Tab */}
          <TabsContent value="mocks">
            <motion.div 
              className="text-center py-8"
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'mocks' ? 'visible' : 'hidden'}
            >
              <motion.h3 
                className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white"
                variants={itemVariants}
              >
                Full-Length Mock Tests
              </motion.h3>
              <motion.p 
                className="text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Practice with full-length mock tests simulating the actual exam environment. Get detailed performance analysis and identify your strengths and weaknesses.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
                variants={containerVariants}
              >
                {['UPSC', 'SSC', 'Banking', 'Railways'].map((exam, index) => (
                  <motion.div key={`mock-exam-${exam}-${index}`} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{exam} Mock Test Series</h4>
                        <ul className="text-left space-y-2 mb-6">
                          {[
                            'Exam pattern aligned',
                            'Detailed solutions',
                            'Performance analytics',
                            'Topic-wise feedback'
                          ].map((feature, i) => (
                            <li key={`${exam}-feature-${i}`} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Start {exam} Mock Test
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}