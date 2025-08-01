'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Users, 
  TreePine,
  Scale,
  Download,
  Eye,
  Search,
  Map,
  Calendar,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Building,
  Landmark,
  Loader2
} from 'lucide-react';

interface LegalTerm {
  _id?: string;
  id?: string;
  term: string;
  definition: string;
  example?: string;
  category?: string;
  status?: string;
}

interface InheritanceRule {
  _id?: string;
  id?: string;
  religion: string;
  maleHeir: string[];
  femaleHeir: string[];
  spouse: string;
  specialNotes: string[];
  status?: string;
}

interface Document {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  useCase: string;
  format: string;
  requirements: string[];
  templateUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  downloadCount?: number;
  status?: string;
}

interface FarmerRight {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  details: string[];
  category?: string;
  status?: string;
}

interface APIData {
  terms: LegalTerm[];
  inheritance: InheritanceRule[];
  documents: Document[];
  farmers: FarmerRight[];
}

export default function PropertyLawSection() {
  const [activeSection, setActiveSection] = useState<'terms' | 'inheritance' | 'documents' | 'farmers'>('terms');
  const [selectedInheritance, setSelectedInheritance] = useState<InheritanceRule | null>(null);
  
  // State for API data
  const [data, setData] = useState<APIData>({
    terms: [],
    inheritance: [],
    documents: [],
    farmers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data from your API endpoint
        const response = await fetch('http://localhost:5000/api/property-law/all-data');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const apiData = await response.json();
        
        // Filter only active records
        const filteredData = {
          terms: apiData.terms?.filter((term: LegalTerm) => term.status !== 'inactive') || [],
          inheritance: apiData.inheritance?.filter((rule: InheritanceRule) => rule.status !== 'inactive') || [],
          documents: apiData.documents?.filter((doc: Document) => doc.status !== 'inactive') || [],
          farmers: apiData.farmers?.filter((farmer: FarmerRight) => farmer.status !== 'inactive') || []
        };
        
        setData(filteredData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        // Fallback to static data if API fails
        setData({
          terms: [
            {
              term: 'Mutation',
              definition: 'The process of changing ownership records in government revenue records when property is transferred',
              example: 'After buying a house, you need to apply for mutation to get the property registered in your name'
            },
            {
              term: 'Encumbrance Certificate',
              definition: 'A legal document showing the transaction history of a property for a specific period',
              example: 'Banks require encumbrance certificate to verify if the property has any legal disputes before approving loans'
            }
          ],
          inheritance: [
            {
              religion: 'Hindu',
              maleHeir: ['Sons', 'Grandsons', 'Father', 'Brothers'],
              femaleHeir: ['Daughters', 'Mother', 'Wife', 'Sisters'],
              spouse: 'Wife gets equal share with sons',
              specialNotes: [
                'Hindu Succession Act 2005 gives equal rights to daughters',
                'Coparcenary rights from birth for sons and daughters'
              ]
            }
          ],
          documents: [
            {
              name: 'Sale Agreement',
              description: 'Contract between buyer and seller for property purchase',
              useCase: 'Property buying/selling',
              format: 'Stamp paper with registration',
              requirements: ['Property details', 'Payment terms', 'Possession date', 'Both parties signatures']
            }
          ],
          farmers: [
            {
              title: 'Land Acquisition Rights',
              description: 'Fair compensation when government acquires agricultural land',
              details: [
                'Compensation at 4 times the market value for rural areas',
                'Compensation at 2 times for urban areas'
              ]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle document download
  const handleDocumentDownload = async (doc: Document) => {
    try {
      if (doc.templateUrl) {
        // If template URL exists, download from there
        window.open(doc.templateUrl, '_blank');
      } else {
        // Create a sample document for download
        const content = `${doc.name}\n\n${doc.description}\n\nUse Case: ${doc.useCase}\nFormat: ${doc.format}\n\nRequirements:\n${doc.requirements.map(req => `- ${req}`).join('\n')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 space-y-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property law data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Land & Property Law Guide
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guide to property ownership, inheritance laws, and farmer rights in India
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'terms', label: 'Legal Terms', icon: <Scale className="w-5 h-5" />, count: data.terms.length },
          { id: 'inheritance', label: 'Inheritance Rights', icon: <Users className="w-5 h-5" />, count: data.inheritance.length },
          { id: 'documents', label: 'Legal Documents', icon: <FileText className="w-5 h-5" />, count: data.documents.length },
          { id: 'farmers', label: 'Farmer Rights', icon: <TreePine className="w-5 h-5" />, count: data.farmers.length }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeSection === section.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.icon}
            {section.label}
            <span className="ml-1 px-2 py-1 bg-white/20 rounded-full text-xs">
              {section.count}
            </span>
          </button>
        ))}
      </div>

      {/* Legal Terms Glossary */}
      {activeSection === 'terms' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              Legal Terms Glossary ({data.terms.length} terms)
            </h3>
          </div>

          {data.terms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No legal terms available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.terms.map((term, index) => (
                <motion.div
                  key={term._id || term.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-bold text-blue-600">{term.term}</h4>
                    {term.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {term.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{term.definition}</p>
                  {term.example && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Example:</strong> {term.example}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inheritance Rights */}
      {activeSection === 'inheritance' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                Inheritance Rights by Religion ({data.inheritance.length} laws)
              </h3>
            </div>

            {data.inheritance.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No inheritance rules available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.inheritance.map((rule, index) => (
                  <motion.div
                    key={rule._id || rule.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedInheritance(rule)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Landmark className="w-8 h-8 text-purple-600" />
                      <h4 className="text-xl font-bold text-gray-800">{rule.religion} Law</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Male Heirs:</h5>
                        <div className="flex flex-wrap gap-1">
                          {rule.maleHeir.slice(0, 2).map((heir, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {heir}
                            </span>
                          ))}
                          {rule.maleHeir.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{rule.maleHeir.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Female Heirs:</h5>
                        <div className="flex flex-wrap gap-1">
                          {rule.femaleHeir.slice(0, 2).map((heir, idx) => (
                            <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                              {heir}
                            </span>
                          ))}
                          {rule.femaleHeir.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{rule.femaleHeir.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <h5 className="font-medium text-gray-700 mb-1">Spouse Rights:</h5>
                        <p className="text-sm text-gray-600">{rule.spouse}</p>
                      </div>

                      <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legal Documents */}
      {activeSection === 'documents' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-red-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              Essential Legal Documents ({data.documents.length} documents)
            </h3>
          </div>

          {data.documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No legal documents available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.documents.map((doc, index) => (
                <motion.div
                  key={doc._id || doc.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800">{doc.name}</h4>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{doc.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Use Case:</h5>
                      <p className="text-sm text-gray-600">{doc.useCase}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Format:</h5>
                      <p className="text-sm text-gray-600">{doc.format}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Requirements:</h5>
                      <ul className="space-y-1">
                        {doc.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <button 
                        onClick={() => handleDocumentDownload(doc)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        Download
                        {doc.downloadCount && doc.downloadCount > 0 && (
                          <span className="ml-1 text-xs opacity-75">({doc.downloadCount})</span>
                        )}
                      </button>
                    </div>

                    {doc.fileSize && (
                      <div className="text-xs text-gray-500 text-center">
                        Size: {(doc.fileSize / 1024).toFixed(1)} KB
                        {doc.fileType && ` • Type: ${doc.fileType}`}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Farmer Rights */}
      {activeSection === 'farmers' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TreePine className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                Farmer Land Rights ({data.farmers.length} rights)
              </h3>
            </div>

            {data.farmers.length === 0 ? (
              <div className="text-center py-12">
                <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No farmer rights information available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {data.farmers.map((right, index) => (
                  <motion.div
                    key={right._id || right.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">{right.title}</h4>
                      {right.category && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {right.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{right.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {right.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inheritance Detail Modal */}
      {selectedInheritance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInheritance(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedInheritance.religion} Inheritance Law</h3>
              <button
                onClick={() => setSelectedInheritance(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Male Heirs (Order of Priority):</h4>
                  <ul className="space-y-2">
                    {selectedInheritance.maleHeir.map((heir, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-gray-700">{heir}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Female Heirs (Order of Priority):</h4>
                  <ul className="space-y-2">
                    {selectedInheritance.femaleHeir.map((heir, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-pink-100 text-pink-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-gray-700">{heir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">Spouse Rights:</h4>
                <p className="text-purple-700">{selectedInheritance.spouse}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3">Special Notes:</h4>
                <ul className="space-y-2">
                  {selectedInheritance.specialNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-gray-700 text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Data Statistics */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-indigo-600" />
          <h3 className="text-2xl font-bold text-gray-800">Database Statistics</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Legal Terms', count: data.terms.length, color: 'blue' },
            { label: 'Inheritance Laws', count: data.inheritance.length, color: 'purple' },
            { label: 'Documents', count: data.documents.length, color: 'red' },
            { label: 'Farmer Rights', count: data.farmers.length, color: 'green' }
          ].map((stat, index) => (
            <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4 text-center`}>
              <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                {stat.count}
              </div>
              <div className={`text-sm text-${stat.color}-700`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}