import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

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
  const [documents, setDocuments] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const API_BASE = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    setCurrentRole(role);
    
    // Get userId from JWT if localStorage is empty
    if (userId && userId !== 'undefined') {
      setCurrentUserId(userId);
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          setCurrentUserId(payload.id);
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (currentRole) {
      fetchCases();
      fetchDocuments();
    }
  }, [currentRole]);

  const fetchCases = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_BASE}/cases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(response.data || []);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    }
  };

  const fetchDocuments = async () => {
    if (!token) {
      setError('No token. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let allDocuments: any[] = [];

      if (currentRole === 'admin') {
        // Admin: Get all documents in one call
        try {
          const response = await axios.get(`${API_BASE}/documents`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allDocuments = response.data;
        } catch (err) {
          console.error('Failed to fetch all documents:', err);
        }
      } else if (currentRole === 'lawyer') {
        // Lawyer: Get documents only from their assigned cases
        const lawyerCases = cases.filter(caseItem => 
          caseItem.lawyers?.some((lawyer: any) => lawyer._id === currentUserId)
        );
        
        for (const caseItem of lawyerCases) {
          try {
            const response = await axios.get(`${API_BASE}/documents/case/${caseItem._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            allDocuments = [...allDocuments, ...response.data];
          } catch (err) {
            console.error(`Failed to fetch documents for case ${caseItem._id}:`, err);
          }
        }
      } else if (currentRole === 'client') {
        // Client: Get documents only from their cases
        const clientCases = cases.filter(caseItem => 
          caseItem.client?._id === currentUserId
        );
        
        for (const caseItem of clientCases) {
          try {
            const response = await axios.get(`${API_BASE}/documents/case/${caseItem._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            allDocuments = [...allDocuments, ...response.data];
          } catch (err) {
            console.error(`Failed to fetch documents for case ${caseItem._id}:`, err);
          }
        }
      }

      setDocuments(allDocuments);
    } catch (err) {
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cases.length > 0) {
      fetchDocuments();
    }
  }, [cases]);

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
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

  const getFileTypeFromUrl = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const formatFileSize = (url: string) => {
    // This is a placeholder - in a real app, you'd get the file size from the API
    return 'Unknown size';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.case?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category?.toLowerCase().includes(searchTerm.toLowerCase());
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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };
  const handleBrowseClick = () => {
  fileInputRef.current?.click();
};

const handleDownload = async (documentId: string) => {
  try {
    const response = await axios.get(`${API_BASE}/documents/${documentId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob' // Important for file downloads
    });

    // Create blob with correct MIME type
    const mimeType = response.headers['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: mimeType });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from the document data or use a default
    const docData = documents.find(doc => doc._id === documentId);
    const filename = docData?.originalName || 'document';
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    console.error('Download failed:', err);
    alert(err.response?.data?.message || 'Failed to download document');
  }
};

const handleView = async (documentId: string) => {
  try {
    const response = await axios.get(`${API_BASE}/documents/${documentId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });

    // Create blob URL for viewing
    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Open in new window with proper content type
    const newWindow = window.open(url, '_blank');
    
    // Clean up after window opens
    if (newWindow) {
      newWindow.onload = () => {
        window.URL.revokeObjectURL(url);
      };
    } else {
      // Fallback for popup blockers
      window.URL.revokeObjectURL(url);
      alert('Please allow popups for this site to view documents');
    }
  } catch (err: any) {
    console.error('View failed:', err);
    alert(err.response?.data?.message || 'Failed to view document');
  }
};

const handleUpload = async () => {
  if (!selectedFile || !selectedCase) {
    alert('Please select a file and case');
    return;
  }

  setUploading(true);
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('caseId', selectedCase);
  formData.append('category', selectedCategory);

  try {
    const response = await axios.post(`${API_BASE}/documents`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Document uploaded successfully!');
    setSelectedFile(null);
    setSelectedCase('');
    setSelectedCategory('');
    fetchDocuments();
    
    // Close dialog
    const dialogTrigger = document.querySelector('[data-state="open"]') as HTMLElement;
    if (dialogTrigger) {
      dialogTrigger.click();
    }
  } catch (err: any) {
    console.error('Upload failed:', err);
    alert(err.response?.data?.message || 'Failed to upload document');
  } finally {
    setUploading(false);
  }
};

const handleDelete = async (documentId: string, caseId: string) => {
  if (!confirm('Are you sure you want to delete this document?')) {
    return;
  }

  try {
    await axios.delete(`${API_BASE}/documents/${documentId}/case/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Document deleted successfully!');
    fetchDocuments();
  } catch (err: any) {
    console.error('Delete failed:', err);
    alert(err.response?.data?.message || 'Failed to delete document');
  }
};

const documentStats = {
  total: documents.length,
  withAI: documents.filter(d => d.category === 'processed').length,
  recent: documents.filter(d => {
    const uploadDate = new Date(d.createdAt);
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
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="hidden"
          />
          
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
            <Button variant="outline" onClick={handleBrowseClick}>
              Browse Files
            </Button>
          </div>
            
            {/* Show selected file */}
            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Selected file:</p>
                <p className="text-sm text-blue-700">{selectedFile.name}</p>
                <p className="text-xs text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            
            <div className="grid gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link to Case *</label>
                <Select value={selectedCase} onValueChange={setSelectedCase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((caseItem: any) => (
                      <SelectItem key={caseItem._id} value={caseItem._id}>
                        {caseItem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFile(null);
                  setSelectedCase('');
                  setSelectedCategory('');
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !selectedCase}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload & Process'
                )}
              </Button>
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
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading documents...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== 'All Categories' 
                ? 'Try adjusting your filters' 
                : currentRole === 'lawyer' 
                  ? 'No documents found in your assigned cases'
                  : 'No documents available'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const fileType = getFileTypeFromUrl(document.fileUrl);
            const { icon: FileIcon, color } = getFileIcon(fileType);
            
            return (
              <Card key={document._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FileIcon className={`h-8 w-8 ${color}`} />
                    <div className="flex space-x-1">
                      {document.category && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {document.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 truncate" title={document.originalName}>
                    {document.originalName}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(document.fileUrl)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Case:</span>
                      <span className="text-blue-600 truncate">{document.case?.title || 'Unknown'}</span>
                    </div>
                    {document.category && (
                      <div className="flex items-center justify-between">
                        <span>Category:</span>
                        <span>{document.category}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{document.uploadedBy?.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleView(document._id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document._id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {(currentRole === 'admin' || document.uploadedBy?._id === currentUserId) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(document._id, document.case?._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}