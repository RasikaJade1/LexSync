import React from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File,
  Brain,
  Trash2,
  FolderOpen,
  Calendar,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

const documents = [
  {
    id: 'DOC-001',
    name: 'Medical_Report_Smith.pdf',
    type: 'pdf',
    size: '2.4 MB',
    caseId: 'CASE-001',
    uploadedBy: 'John Mitchell',
    uploadDate: '2024-01-10',
    category: 'Medical Records',
    tags: ['Evidence', 'Medical', 'Personal Injury'],
    hasAISummary: true
  },
  {
    id: 'DOC-002',
    name: 'Contract_Agreement.pdf',
    type: 'pdf',
    size: '1.2 MB',
    caseId: 'CASE-002',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2024-01-08',
    category: 'Contracts',
    tags: ['Contract', 'Legal Document'],
    hasAISummary: true
  },
  {
    id: 'DOC-003',
    name: 'Witness_Statement.docx',
    type: 'docx',
    size: '456 KB',
    caseId: 'CASE-001',
    uploadedBy: 'David Chen',
    uploadDate: '2024-01-05',
    category: 'Statements',
    tags: ['Witness', 'Statement', 'Evidence'],
    hasAISummary: false
  },
  {
    id: 'DOC-004',
    name: 'Financial_Records.xlsx',
    type: 'xlsx',
    size: '3.1 MB',
    caseId: 'CASE-004',
    uploadedBy: 'Emily Rodriguez',
    uploadDate: '2024-01-12',
    category: 'Financial',
    tags: ['Financial', 'Records', 'Corporate'],
    hasAISummary: false
  },
  {
    id: 'DOC-005',
    name: 'Evidence_Photo_01.jpg',
    type: 'jpg',
    size: '8.2 MB',
    caseId: 'CASE-001',
    uploadedBy: 'John Mitchell',
    uploadDate: '2024-01-09',
    category: 'Evidence',
    tags: ['Photo', 'Evidence', 'Scene'],
    hasAISummary: true
  }
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-600' };
    case 'docx':
    case 'doc':
      return { icon: FileText, color: 'text-blue-600' };
    case 'xlsx':
    case 'xls':
      return { icon: FileText, color: 'text-green-600' };
    case 'jpg':
    case 'jpeg':
    case 'png':
      return { icon: Image, color: 'text-purple-600' };
    default:
      return { icon: File, color: 'text-gray-600' };
  }
};

const categories = [
  'All Categories',
  'Medical Records',
  'Contracts',
  'Statements',
  'Financial',
  'Evidence',
  'Legal Documents',
  'Correspondence'
];

export function DocumentManagement() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All Categories');
  const [selectedDocument, setSelectedDocument] = React.useState<typeof documents[0] | null>(null);
  const [dragActive, setDragActive] = React.useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All Categories' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload here
  };

  const documentStats = {
    total: documents.length,
    withAI: documents.filter(d => d.hasAISummary).length,
    recent: documents.filter(d => {
      const uploadDate = new Date(d.uploadDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Upload, organize, and analyze legal documents</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supports PDF, DOC, DOCX, XLS, XLSX, JPG, PNG up to 10MB
              </p>
              <Button variant="outline">
                Browse Files
              </Button>
            </div>
            <div className="grid gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link to Case</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="case-001">CASE-001 - Personal Injury Claim</SelectItem>
                    <SelectItem value="case-002">CASE-002 - Contract Dispute</SelectItem>
                    <SelectItem value="case-003">CASE-003 - Employment Law</SelectItem>
                    <SelectItem value="case-004">CASE-004 - Corporate Merger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Upload & Process</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documentStats.total}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Processed</p>
                <p className="text-2xl font-bold text-gray-900">{documentStats.withAI}</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-bold text-gray-900">{documentStats.recent}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => {
          const { icon: FileIcon, color } = getFileIcon(document.type);
          
          return (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <FileIcon className={`h-8 w-8 ${color}`} />
                  <div className="flex space-x-1">
                    {document.hasAISummary && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 truncate" title={document.name}>
                  {document.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span>{document.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Case:</span>
                    <span className="text-blue-600">{document.caseId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span>{document.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span className="truncate">{document.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{document.uploadDate}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {document.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      +{document.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {document.hasAISummary ? (
                    <Button size="sm" variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                      <Brain className="mr-1 h-3 w-3" />
                      View Summary
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Brain className="mr-1 h-3 w-3" />
                      Summarize
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">Try adjusting your search or upload new documents.</p>
          </CardContent>
        </Card>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedDocument.name}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-8 bg-gray-50 text-center">
                  <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600">Document preview would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedDocument.name} • {selectedDocument.size}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File Name</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File Size</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Case ID</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.caseId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Uploaded By</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.uploadedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Date</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.uploadDate}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-summary" className="space-y-4">
                {selectedDocument.hasAISummary ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Key Points</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                        <li>Medical examination shows significant injury to lower back</li>
                        <li>Treatment recommendations include physical therapy</li>
                        <li>Work restrictions: no lifting over 20 pounds</li>
                        <li>Follow-up required in 6 weeks</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Full Summary</h4>
                      <ScrollArea className="h-40 w-full border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-gray-700">
                          This medical report details the examination of Michael Smith following his workplace injury. 
                          The examination reveals significant trauma to the lumbar spine, specifically at the L4-L5 level. 
                          X-rays show no fractures, but MRI indicates disc herniation. The patient reports chronic pain 
                          rated 7/10 and difficulty with mobility. Treatment plan includes conservative management with 
                          physical therapy, pain medication, and activity restrictions. Prognosis is good with proper 
                          treatment compliance.
                        </p>
                      </ScrollArea>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Summary
                      </Button>
                      <Button variant="outline">
                        Copy Text
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No AI Summary Available</h4>
                    <p className="text-gray-600 mb-4">This document hasn't been processed by AI yet.</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Summary
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}