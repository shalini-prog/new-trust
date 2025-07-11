'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaChevronDown, FaChevronUp, FaClock, FaFileAlt } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaperItem {
  _id: string;
  exam: string;
  year: number;
  subject: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uploadDate: string;
  fileSize: string;
  fileName: string;
  fileUrl: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export default function PreviousYearPapers() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Fetch papers from API
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/epre');
        
        if (!response.ok) {
          throw new Error('Failed to fetch papers');
        }
        
        const data = await response.json();
        // Filter only active papers
        const activePapers = data.filter((paper: PaperItem) => paper.status === 'Active');
        setPapers(activePapers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPapers();
  }, []);
  
  // Generate filter options from papers data
  const exams = [...new Set(papers.map(paper => paper.exam))].sort();
  const years = [...new Set(papers.map(paper => paper.year))].sort((a, b) => b - a);
  const subjects = [...new Set(papers.map(paper => paper.subject))].sort();
  
  // Filter papers based on selected criteria
  const filteredPapers = papers.filter(paper => {
    const examMatch = selectedExam === 'all' || paper.exam === selectedExam;
    const yearMatch = selectedYear === 'all' || paper.year === parseInt(selectedYear);
    const subjectMatch = selectedSubject === 'all' || paper.subject === selectedSubject;
    return examMatch && yearMatch && subjectMatch;
  });
  
  // Group papers by exam
  const examGroups = filteredPapers.reduce((groups, paper) => {
    const exam = paper.exam;
    if (!groups[exam]) {
      groups[exam] = [];
    }
    groups[exam].push(paper);
    return groups;
  }, {} as Record<string, PaperItem[]>);
  
  // Handle download
  const handleDownload = (paper: PaperItem) => {
  if (paper.fileUrl) {
    const link = document.createElement('a');
    link.href = paper.fileUrl;

    // Suggest file name with correct extension
    link.download = paper.fileName || 'downloaded-paper.pdf';

    // Force download without opening
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Download link not available');
  }
};

  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <section id="previous-papers" className="py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading papers...</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="previous-papers" className="py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="previous-papers" className="py-20 bg-white dark:bg-slate-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-slate-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Previous Year Question Papers <span className="text-blue-600 dark:text-blue-400">📑</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Practice with past papers and detailed solutions to boost your preparation
          </motion.p>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Exam</label>
            <Select 
              value={selectedExam} 
              onValueChange={(value) => setSelectedExam(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((exam, index) => (
                  <SelectItem key={`exam-${index}-${exam}`} value={exam}>{exam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Year</label>
            <Select 
              value={selectedYear}
              onValueChange={(value) => setSelectedYear(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year, index) => (
                  <SelectItem key={`year-${index}-${year}`} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Subject</label>
            <Select 
              value={selectedSubject} 
              onValueChange={(value) => setSelectedSubject(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject, index) => (
                  <SelectItem key={`subject-${index}-${subject}`} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Papers Accordion */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {Object.keys(examGroups).length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {Object.keys(examGroups).map((exam, index) => (
                <AccordionItem key={`exam-group-${index}-${exam}`} value={exam} className="border border-slate-200 dark:border-slate-700 rounded-lg mb-4">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{exam}</h3>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        {examGroups[exam].length} papers
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      {examGroups[exam].map((paper) => (
                        <Card key={paper._id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div>
                                <h4 className="font-semibold text-slate-800 dark:text-white">
                                  {paper.subject} ({paper.year})
                                </h4>
                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1 space-x-4">
                                  <span className="flex items-center">
                                    <FaFileAlt className="mr-1" /> {paper.questions} questions
                                  </span>
                                  <span className="flex items-center">
                                    <FaClock className="mr-1" /> {paper.difficulty}
                                  </span>
                                  <span className="flex items-center">
                                    📅 {formatDate(paper.uploadDate)}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  File: {paper.fileName} • Size: {paper.fileSize}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-2"
                                  onClick={() => handleDownload(paper)}
                                >
                                  <FaDownload className="text-blue-600" />
                                  <span>Download</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-slate-600 dark:text-slate-300">No papers available with the selected filters.</p>
            </div>
          )}
        </motion.div>
        
        {/* Real-Time Exam Simulator */}
        <motion.div 
          className="mt-16 bg-blue-50 dark:bg-blue-900/30 p-8 rounded-2xl max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">Real-Time Exam Simulator</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Practice in exam-like conditions with our real-time simulator. Track your time, analyze your performance, and identify your strengths and weaknesses.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Exam Simulator
          </Button>
        </motion.div>
      </div>
    </section>
  );
}