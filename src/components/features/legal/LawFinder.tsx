'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Bookmark, Download, ChevronDown, ChevronUp, X, Loader2, Share2, FileText, Copy, Check } from 'lucide-react';

interface Law {
  _id: string;
  title: string;
  act: string;
  sections: string[];
  keywords: string[];
  summary: string;
  fullText: string;
}

interface Settings {
  fuzzySearch: boolean;
  keywordHighlighting: boolean;
  searchSuggestions: boolean;
  adminApproval: boolean;
  auditLog: boolean;
}

const LawFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Law[]>([]);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [bookmarkedLaws, setBookmarkedLaws] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allLaws, setAllLaws] = useState<Law[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch laws and settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all laws
        const lawsResponse = await fetch('http://localhost:5000/api/find');
        if (!lawsResponse.ok) {
          throw new Error(`Failed to fetch laws: ${lawsResponse.status}`);
        }
        const laws = await lawsResponse.json();
        setAllLaws(laws);

        // Fetch settings
        const settingsResponse = await fetch('http://localhost:5000/api/find/set');
        if (!settingsResponse.ok) {
          throw new Error(`Failed to fetch settings: ${settingsResponse.status}`);
        }
        const appSettings = await settingsResponse.json();
        setSettings(appSettings);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Load bookmarked laws from memory (since we can't use localStorage)
    const savedBookmarks = [];
    setBookmarkedLaws(savedBookmarks);

    // Load recent searches from memory
    const savedSearches = [];
    setRecentSearches(savedSearches);
  }, []);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        const target = event.target as Element;
        if (!target.closest('.share-menu-container')) {
          setShowShareMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allLaws.filter(law =>
      law.title.toLowerCase().includes(query) ||
      law.act.toLowerCase().includes(query) ||
      law.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      law.summary.toLowerCase().includes(query)
    );

    setSearchResults(results);
  }, [searchQuery, allLaws]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '' && !recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
    }
  };

  const toggleBookmark = (lawId: string) => {
    let updatedBookmarks;
    if (bookmarkedLaws.includes(lawId)) {
      updatedBookmarks = bookmarkedLaws.filter(id => id !== lawId);
    } else {
      updatedBookmarks = [...bookmarkedLaws, lawId];
    }
    setBookmarkedLaws(updatedBookmarks);
  };

  const toggleSection = (lawId: string) => {
    setExpandedSections({
      ...expandedSections,
      [lawId]: !expandedSections[lawId]
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLaw(null);
  };

  const fetchLawById = async (lawId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/find/${lawId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch law: ${response.status}`);
      }
      const law = await response.json();
      setSelectedLaw(law);
    } catch (err) {
      console.error('Error fetching law by ID:', err);
      setError(err instanceof Error ? err.message : 'Failed to load law details');
    }
  };

  // Download law as PDF functionality
  const downloadAsPDF = (law: Law) => {
    const content = `
${law.title}
${law.act}
${'='.repeat(60)}

SUMMARY:
${law.summary}

KEYWORDS:
${law.keywords.join(', ')}

RELEVANT SECTIONS:
${law.sections.map(section => `• ${section}`).join('\n')}

FULL TEXT:
${law.fullText}

${'='.repeat(60)}
Document generated from Indian Law Finder
Generated on: ${new Date().toLocaleString()}
    `.trim();

    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link and click it to download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${law.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async (law: Law) => {
    const shareText = `${law.title}\n\nAct: ${law.act}\n\nSummary: ${law.summary}\n\nKeywords: ${law.keywords.join(', ')}\n\nGenerated from Indian Law Finder`;

    // Check if Web Share API is available
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: law.title,
          text: shareText,
        });
        return;
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }

    // Fallback: toggle share menu
    setShowShareMenu(!showShareMenu);
  };

  // Share via different platforms
  const shareViaEmail = (law: Law) => {
    const subject = encodeURIComponent(`Indian Law: ${law.title}`);
    const body = encodeURIComponent(`${law.title}\n\nAct: ${law.act}\n\nSummary: ${law.summary}\n\nKeywords: ${law.keywords.join(', ')}\n\nFull Text:\n${law.fullText}\n\nShared from Indian Law Finder`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareMenu(false);
  };

  const shareViaWhatsApp = (law: Law) => {
    const text = encodeURIComponent(`*${law.title}*\n\nAct: ${law.act}\n\nSummary: ${law.summary}\n\nKeywords: ${law.keywords.join(', ')}\n\nShared from Indian Law Finder`);
    window.open(`https://wa.me/?text=${text}`);
    setShowShareMenu(false);
  };

  const shareViaTelegram = (law: Law) => {
    const text = encodeURIComponent(`${law.title}\n\nAct: ${law.act}\n\nSummary: ${law.summary}\n\nKeywords: ${law.keywords.join(', ')}\n\nShared from Indian Law Finder`);
    window.open(`https://t.me/share/url?text=${text}`);
    setShowShareMenu(false);
  };

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const copyLawDetails = (law: Law) => {
    const shareText = `${law.title}\n\nAct: ${law.act}\n\nSummary: ${law.summary}\n\nKeywords: ${law.keywords.join(', ')}\n\nFull Text:\n${law.fullText}\n\nGenerated from Indian Law Finder`;
    copyToClipboard(shareText);
  };

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading legal database...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 mb-4">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Database</h3>
              <p className="text-red-500">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Indian Law Finder</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search and understand Indian laws using simple keywords or common issues
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Database contains {allLaws.length} laws and regulations
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="Search by keyword (e.g. harassment, divorce, property)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {settings?.searchSuggestions && recentSearches.length > 0 && searchQuery === '' && (
            <div className="max-w-2xl mx-auto mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {searchQuery && searchResults.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No laws found</h3>
                <p className="text-gray-500">
                  Try different keywords like "property", "divorce", "consumer rights" etc.
                </p>
              </div>
            ) : null}

            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                </h3>

                {searchResults.map((law) => (
                  <div
                    key={law._id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border transition-all duration-300 ${selectedLaw?._id === law._id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{law.title}</h3>
                          <p className="text-sm text-blue-600 font-medium mb-2">{law.act}</p>
                          <p className="text-gray-600 text-sm mb-3">{law.summary}</p>
                        </div>
                        <button
                          onClick={() => toggleBookmark(law._id)}
                          className={`p-2 rounded-full transition-colors ${bookmarkedLaws.includes(law._id)
                              ? 'text-yellow-500 bg-yellow-50'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                            }`}
                        >
                          <Bookmark className="h-5 w-5" fill={bookmarkedLaws.includes(law._id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {law.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${settings?.keywordHighlighting && searchQuery.toLowerCase().includes(keyword.toLowerCase())
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => fetchLawById(law._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          View Full Text
                        </button>
                        <button
                          onClick={() => toggleSection(law._id)}
                          className="flex items-center text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                          {expandedSections[law._id] ? (
                            <>
                              Hide Sections <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show Sections <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {expandedSections[law._id] && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="font-medium text-gray-700 mb-2">Relevant Sections:</h4>
                          <ul className="space-y-2">
                            {law.sections.map((section, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                • {section}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedLaw ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 sticky top-4">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{selectedLaw.title}</h3>
                    <button
                      onClick={() => setSelectedLaw(null)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {selectedLaw.act}
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none text-gray-700 mb-6 max-h-96 overflow-y-auto">
                    <p className="whitespace-pre-line">{selectedLaw.fullText}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 relative">
                    <button
                      onClick={() => downloadAsPDF(selectedLaw)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download as Text
                    </button>

                    <div className="relative share-menu-container">
                      <button
                        onClick={() => handleShare(selectedLaw)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>

                      {showShareMenu && (
                        <div className=" top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                          <div className="p-2">
                            <button
                              onClick={() => copyLawDetails(selectedLaw)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                              Copy to Clipboard
                            </button>
                            <button
                              onClick={() => shareViaEmail(selectedLaw)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <span className="text-base">📧</span> Share via Email
                            </button>
                            <button
                              onClick={() => shareViaWhatsApp(selectedLaw)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <span className="text-base">💬</span> Share via WhatsApp
                            </button>
                            <button
                              onClick={() => shareViaTelegram(selectedLaw)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <span className="text-base">✈️</span> Share via Telegram
                            </button>
                            <hr className="my-2" />
                            <button
                              onClick={() => setShowShareMenu(false)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => copyLawDetails(selectedLaw)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${copySuccess
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                      {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copySuccess ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>

                  {copySuccess && (
                    <div className="mt-2 text-sm text-green-600 animate-in fade-in duration-200">
                      Law details copied to clipboard!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 sticky top-4">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Laws</h3>
                  <ul className="space-y-3">
                    {allLaws.slice(0, 5).map((law) => (
                      <li key={law._id}>
                        <button
                          onClick={() => {
                            fetchLawById(law._id);
                            handleSearch(law.title.split(' ')[0]);
                          }}
                          className="text-left text-blue-600 hover:text-blue-800 text-sm transition-colors"
                        >
                          {law.title}
                        </button>
                        <p className="text-xs text-gray-500">{law.act}</p>
                      </li>
                    ))}
                  </ul>

                  {bookmarkedLaws.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Your Bookmarks</h3>
                      <ul className="space-y-3">
                        {allLaws
                          .filter(law => bookmarkedLaws.includes(law._id))
                          .map((law) => (
                            <li key={law._id}>
                              <button
                                onClick={() => {
                                  fetchLawById(law._id);
                                  handleSearch(law.title.split(' ')[0]);
                                }}
                                className="text-left text-blue-600 hover:text-blue-800 text-sm flex items-start gap-2 transition-colors"
                              >
                                <Bookmark className="h-4 w-4 flex-shrink-0 text-yellow-500" fill="currentColor" />
                                <span>{law.title}</span>
                              </button>
                              <p className="text-xs text-gray-500 ml-6">{law.act}</p>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}

                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawFinder;