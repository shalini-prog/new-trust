'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaDownload, FaStar, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StudyMaterial {
  _id: string;
  title: string;
  category: string;
  type: string;
  subject: string;
  thumbnail: string;
  downloadUrl: string;
  rating: number;
  downloads: number;
  date?: string;
  description?: string;
  fileSize?: string;
  status: 'active' | 'inactive' | 'pending';
}

interface StudyMaterialsProps {
  studyMaterialsRef?: React.RefObject<HTMLDivElement>;
}

export default function StudyMaterials({ studyMaterialsRef }: StudyMaterialsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'recency'>('popularity');
  
  // Data states
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Fetch study materials from database
  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/emat');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter only active materials
        const activeMaterials = data.filter((material: StudyMaterial) => material.status === 'active');
        setStudyMaterials(activeMaterials);
        setError(null);
      } catch (err) {
        console.error('Error fetching study materials:', err);
        setError('Failed to load study materials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, []);

  // Extract unique subjects and types for filters
  const availableSubjects = Array.from(new Set(studyMaterials.map(material => material.subject)));
  const availableTypes = Array.from(new Set(studyMaterials.map(material => material.type)));

  const materialCategories = [
    { id: 'all', label: 'All Materials' },
    { id: 'ncert', label: 'NCERT Books' },
    { id: 'standard', label: 'Standard Books' },
    { id: 'notes', label: 'Topic-Wise Notes' },
    { id: 'handwritten', label: 'Handwritten Notes' },
    { id: 'videos', label: 'Video Lectures' },
    { id: 'current', label: 'Current Affairs' },
  ];

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedTypes([]);
  };

  // Apply filtering and searching
  const filteredMaterials = studyMaterials.filter(material => {
    // Category filter
    const categoryMatch = activeCategory === 'all' || material.category === activeCategory;
    
    // Search filter
    const searchMatch = 
      searchQuery === '' || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Subject filter
    const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(material.subject);
    
    // Type filter
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(material.type);
    
    return categoryMatch && searchMatch && subjectMatch && typeMatch;
  });

  // Apply sorting
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortBy === 'popularity') return b.downloads - a.downloads;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'recency' && a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  // Featured materials (top 5 by downloads)
  const featuredMaterials = [...studyMaterials]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  // Handle download click
  const handleDownload = async (material: StudyMaterial) => {
    try {
      // Increment download count
      await fetch(`/api/emat/${material._id}/download`, {
        method: 'POST',
      });
      
      // Update local state
      setStudyMaterials(prev => 
        prev.map(m => 
          m._id === material._id 
            ? { ...m, downloads: m.downloads + 1 }
            : m
        )
      );
      
      // Trigger download
      if (material.downloadUrl) {
        const link = document.createElement('a');
        link.href = material.downloadUrl;
        link.download = material.title;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading material:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="study-materials" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" ref={studyMaterialsRef || null}>
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading study materials...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="study-materials" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" ref={studyMaterialsRef || null}>
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
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
    <section id="study-materials" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" ref={studyMaterialsRef || null}>
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-slate-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Study Materials <span className="text-blue-600 dark:text-blue-400">📚</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A comprehensive library of free resources to help you ace your exams
          </motion.p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 mb-10 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FaSearch />
              </span>
              <Input 
                type="text" 
                placeholder="Search for books, notes, subjects..." 
                className="pl-10 py-6 rounded-full border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 py-6 px-6 rounded-full">
                  <FaFilter className="text-blue-600" />
                  <span>Filters</span>
                  {(selectedSubjects.length > 0 || selectedTypes.length > 0) && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedSubjects.length + selectedTypes.length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Study Materials</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <h4 className="mb-3 font-medium">Subjects</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSubjects.map((subject) => (
                        <div key={`subject-${subject}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`subject-${subject}`} 
                            checked={selectedSubjects.includes(subject)} 
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <Label htmlFor={`subject-${subject}`}>{subject}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 font-medium">Material Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTypes.map((type) => (
                        <div key={`type-${type}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={selectedTypes.includes(type)} 
                            onCheckedChange={() => toggleType(type)}
                          />
                          <Label htmlFor={`type-${type}`}>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button type="button" onClick={() => setFilterDialogOpen(false)}>
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 py-6 px-6 rounded-full">
                  <FaSortAmountDown className="text-blue-600" />
                  <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('recency')}>
                  Most Recent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Active filters display */}
          {(selectedSubjects.length > 0 || selectedTypes.length > 0) && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {selectedSubjects.map(subject => (
                <div key={`active-subject-${subject}`} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center">
                  {subject}
                  <button 
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    onClick={() => toggleSubject(subject)}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {selectedTypes.map(type => (
                <div key={`active-type-${type}`} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm flex items-center">
                  {type}
                  <button 
                    className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    onClick={() => toggleType(type)}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              <button 
                className="text-slate-600 dark:text-slate-400 underline text-sm"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        {/* Material Categories */}
        <Tabs 
          defaultValue="all" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <div className="overflow-x-auto pb-4">
            <TabsList className="flex justify-start md:justify-center space-x-2 pb-6 w-max min-w-full md:w-auto md:min-w-0 md:max-w-4xl mx-auto">
              {materialCategories.map((category) => (
                <TabsTrigger 
                  key={`category-${category.id}`} 
                  value={category.id}
                  className="px-4 py-2 rounded-full whitespace-nowrap"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Featured Materials Carousel */}
          <div className="mb-12" ref={carouselRef}>
            <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-white">Featured Materials</h3>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {featuredMaterials.length > 0 ? (
                featuredMaterials.map((material) => (
                  <Card key={`featured-${material._id}`} className="min-w-[300px] max-w-[300px] material-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative h-40 bg-slate-200 dark:bg-slate-700 rounded-t-lg overflow-hidden">
                        <img 
                          src={material.thumbnail || '/placeholder-image.jpg'} 
                          alt={material.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <FaStar className="mr-1" /> {material.rating}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white truncate">{material.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">{material.subject} | {material.type}</p>
                        {material.fileSize && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Size: {material.fileSize}</p>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => handleDownload(material)}
                        >
                          <FaDownload className="text-blue-600" />
                          <span>Download ({material.downloads})</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="w-full py-8 text-center text-slate-500 dark:text-slate-400">
                  No featured materials available
                </div>
              )}
            </div>
          </div>
          
          {/* All Materials Grid */}
          <TabsContent value="all" className="mt-0">
            {sortedMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedMaterials.map((material) => (
                  <Card key={`all-${material._id}`} className="material-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative h-40 bg-slate-200 dark:bg-slate-700 rounded-t-lg overflow-hidden">
                        <img 
                          src={material.thumbnail || '/placeholder-image.jpg'} 
                          alt={material.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <FaStar className="mr-1" /> {material.rating}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white truncate">{material.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">{material.subject} | {material.type}</p>
                        {material.fileSize && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Size: {material.fileSize}</p>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => handleDownload(material)}
                        >
                          <FaDownload className="text-blue-600" />
                          <span>Download ({material.downloads})</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  No study materials available matching your criteria
                </p>
                {(searchQuery || selectedSubjects.length > 0 || selectedTypes.length > 0) && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Category tabs */}
          {materialCategories.slice(1).map((category) => (
            <TabsContent key={`tab-${category.id}`} value={category.id}>
              {sortedMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedMaterials.map((material) => (
                    <Card key={`${category.id}-${material._id}`} className="material-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative h-40 bg-slate-200 dark:bg-slate-700 rounded-t-lg overflow-hidden">
                          <img 
                            src={material.thumbnail || '/placeholder-image.jpg'} 
                            alt={material.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                            <FaStar className="mr-1" /> {material.rating}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white truncate">{material.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">{material.subject} | {material.type}</p>
                          {material.fileSize && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Size: {material.fileSize}</p>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => handleDownload(material)}
                          >
                            <FaDownload className="text-blue-600" />
                            <span>Download ({material.downloads})</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-semibold mb-4">{category.label}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    No materials available in this category matching your criteria
                  </p>
                  {(searchQuery || selectedSubjects.length > 0 || selectedTypes.length > 0) && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        clearFilters();
                      }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* AI Recommendation */}
        <motion.div 
          className="mt-16 bg-blue-50 dark:bg-blue-900/30 p-8 rounded-2xl max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">AI-Recommended Study Material</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Get personalized study material recommendations based on your performance and weak areas.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Personalized Recommendations
          </Button>
        </motion.div>
      </div>
    </section>
  );
}