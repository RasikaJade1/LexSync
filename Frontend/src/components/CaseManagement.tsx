import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Calendar, User, AlertCircle, FileText, Upload, RefreshCcw, Pencil,
  Loader2, Image, File
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function CaseManagement() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // --- NEW: Edit Case States ---
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  // --- NEW: Document States ---
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lists for dropdowns
  const [clientList, setClientList] = useState<any[]>([]);
  const [lawyerList, setLawyerList] = useState<any[]>([]);

  const [updateText, setUpdateText] = useState('');
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Updated Form State to perfectly match Mongoose Model
  const [formData, setFormData] = useState({
    title: '',
    client: '', 
    lawyers: '', 
    priority: 'Medium',
    status: 'Active',
    nextHearing: '',
    description: ''
  });

  const API_URL = "http://localhost:8080/api/cases"; 
  const USERS_API_URL = "http://localhost:8080/api/users"; // Ensure you have this route
  const DOCS_API_URL = "http://localhost:8080/api/documents"; // New Document API Route
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch cases
      const casesRes = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(Array.isArray(casesRes.data) ? casesRes.data : []);

      // Fetch users for dropdowns
      const usersRes = await axios.get(USERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      setClientList(allUsers.filter(u => u.role === 'client'));
      setLawyerList(allUsers.filter(u => u.role === 'lawyer'));

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- NEW: Fetch Documents when a case is selected ---
  useEffect(() => {
    if (selectedCase) {
      fetchCaseDocuments(selectedCase._id);
    } else {
      setCaseDocuments([]);
    }
  }, [selectedCase]);

  const fetchCaseDocuments = async (caseId: string) => {
    try {
      const res = await axios.get(`${DOCS_API_URL}/case/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaseDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  // --- NEW: Document Handlers ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedCase) return;

    setIsUploadingDoc(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', file);
        formDataToUpload.append('caseId', selectedCase._id);
        formDataToUpload.append('category', 'Evidence');

        return axios.post(DOCS_API_URL, formDataToUpload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      });

      await Promise.all(uploadPromises);
      alert('Documents uploaded successfully!');
      fetchCaseDocuments(selectedCase._id); // Refresh the list
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Failed to upload documents');
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadDoc = async (documentId: string, originalName: string) => {
    try {
      const response = await axios.get(`${DOCS_API_URL}/${documentId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
      });
      const mimeType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName || 'document');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to download document');
    }
  };

  const handleViewDoc = async (documentId: string) => {
    try {
      // THE FIX: Added ?action=view to the URL
      const response = await axios.get(`${DOCS_API_URL}/${documentId}/download?action=view`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        newWindow.onload = () => window.URL.revokeObjectURL(url);
      } else {
        alert('Please allow popups for this site to view documents');
      }
    } catch (err: any) {
      alert('Failed to view document');
    }
  };

  const getDocFileIcon = (url: string) => {
    const ext = url?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <Image className="h-6 w-6 text-purple-600" />;
    if (['pdf'].includes(ext || '')) return <FileText className="h-6 w-6 text-red-600" />;
    return <File className="h-6 w-6 text-blue-600" />;
  };

  // --- NEW: Edit Initialization ---
  const handleEditInit = (caseToEdit: any) => {
    setEditFormData({
      ...caseToEdit,
      // Safely convert ISO date to YYYY-MM-DD for the date input
      nextHearing: caseToEdit.nextHearing ? new Date(caseToEdit.nextHearing).toISOString().split('T')[0] : ''
    });
    setIsEditDialogOpen(true);
  };

  // --- NEW: Submit the Edit to Backend ---
  const handleUpdateCase = async () => {
    try {
      const submissionData = {
        status: editFormData.status,
        priority: editFormData.priority,
        nextHearing: editFormData.nextHearing ? new Date(editFormData.nextHearing).toISOString() : null
      };

      await axios.patch(`${API_URL}/${editFormData._id}`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Case updated successfully!");
      fetchData(); // Refresh table
      setIsEditDialogOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update case.");
    }
  };

  const handleCreateCase = async () => {
    try {
      if (!formData.title || !formData.client) {
        alert("Title and Client are required!");
        return;
      }

      const submissionData = {
        title: formData.title,
        description: formData.description,
        client: formData.client,
        lawyers: formData.lawyers ? [formData.lawyers] : [],
        priority: formData.priority,
        status: formData.status,
        ...(formData.nextHearing && { nextHearing: new Date(formData.nextHearing).toISOString() })
      };

      await axios.post(API_URL, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Case created successfully!");
      fetchData();
      setFormData({ title: '', client: '', lawyers: '', priority: 'Medium', status: 'Active', nextHearing: '', description: '' });
      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create case.");
    }
  };

  const handleAddUpdate = async () => {
    if (!updateText.trim()) return;
    try {
      const res = await axios.patch(`${API_URL}/${selectedCase._id}/rojnama`, 
        { updateText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedCase(res.data);
      setUpdateText('');
      setIsAddingUpdate(false);
      fetchData();
    } catch (err) {
      alert("Failed to add update.");
    }
  };

  const filteredCases = Array.isArray(cases) ? cases.filter(case_ => {
    const title = (case_.title || "").toLowerCase();
    const id = (case_._id || "").toLowerCase();
    
    const clientUser = case_.client?.username || "";
    const clientFirst = case_.client?.firstName || "";
    const clientLast = case_.client?.lastName || "";
    const clientSearchStr = `${clientUser} ${clientFirst} ${clientLast}`.toLowerCase();

    const search = searchTerm.toLowerCase();
    const matchesSearch = title.includes(search) || id.includes(search) || clientSearchStr.includes(search);
    const matchesStatus = statusFilter === 'all' || (case_.status || "").toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string = "Active") => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'review': return 'secondary';
      case 'pending': return 'outline';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
          <p className="text-gray-600">Track and manage legal proceedings</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Create Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New Legal Case</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Title *</Label>
                  <Input 
                    className="col-span-3" 
                    placeholder="e.g., State vs. John Doe" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Client *</Label>
                  <Select onValueChange={(val) => setFormData({...formData, client: val})} value={formData.client}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientList.length === 0 ? (
                         <SelectItem value="none" disabled>No clients found</SelectItem>
                      ) : (
                        clientList.map(client => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.firstName} {client.lastName} (@{client.username})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Lead Lawyer</Label>
                  <Select onValueChange={(val) => setFormData({...formData, lawyers: val})} value={formData.lawyers}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Assign a Lawyer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyerList.length === 0 ? (
                         <SelectItem value="none" disabled>No lawyers found</SelectItem>
                      ) : (
                        lawyerList.map(lawyer => (
                          <SelectItem key={lawyer._id} value={lawyer._id}>
                            {lawyer.firstName} {lawyer.lastName} (@{lawyer.username})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Status</Label>
                  <Select onValueChange={(val) => setFormData({...formData, status: val})} value={formData.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Priority</Label>
                  <Select onValueChange={(val) => setFormData({...formData, priority: val})} value={formData.priority}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Next Hearing</Label>
                  <Input 
                    type="date"
                    className="col-span-3" 
                    value={formData.nextHearing}
                    onChange={(e) => setFormData({...formData, nextHearing: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4 pt-2">
                  <Label className="text-left font-semibold mt-2">Brief Description</Label>
                  <Textarea 
                    className="col-span-3 min-h-[100px]" 
                    placeholder="Case background and objectives..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCase}>Save Case</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Title, ID, or Client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Case Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Legal Team</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={6} className="text-center py-10 text-blue-600 font-medium">Syncing with LexSync Cloud...</TableCell></TableRow>
              ) : filteredCases.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-500 font-medium">No records found matching your criteria.</TableCell></TableRow>
              ) : filteredCases.map((case_) => (
                <TableRow key={case_._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <p className="font-bold text-slate-900">{case_.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(case_.status)}>{case_.status || "Active"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{case_.lawyers?.[0]?.firstName || case_.lawyers?.[0]?.username || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {case_.nextHearing ? new Date(case_.nextHearing).toLocaleDateString() : 'Pending Date'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCase(case_)}>
                        <Eye className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditInit(case_)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- EDIT CASE DIALOG --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Case</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={(val) => setEditFormData({...editFormData, status: val})} value={editFormData.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select onValueChange={(val) => setEditFormData({...editFormData, priority: val})} value={editFormData.priority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Next Hearing</Label>
                <Input 
                  type="date"
                  value={editFormData.nextHearing}
                  onChange={(e) => setEditFormData({...editFormData, nextHearing: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateCase}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- ORIGINAL: VIEW CASE DIALOG WITH WIDER WIDTH --- */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => { setSelectedCase(null); setIsAddingUpdate(false); }}>
          <DialogContent className="max-w-6xl w-[90vw] h-[85vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <DialogTitle className="text-2xl font-bold">{selectedCase.title}</DialogTitle>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(selectedCase.status)}>{selectedCase.status}</Badge>
                  <Badge variant={getPriorityColor(selectedCase.priority)}>{selectedCase.priority}</Badge>
                </div>
              </div>
              <p className="text-slate-600 text-sm line-clamp-2">{selectedCase.description}</p>
            </div>
            
            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
              <div className="px-6 pt-2">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b h-12">
                  <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">Overview</TabsTrigger>
                  <TabsTrigger value="rojnama" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">Rojnama (Daily Log)</TabsTrigger>
                  <TabsTrigger value="evidence" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">Evidence & Files</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="overview" className="m-0 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Client Information</Label>
                      <p className="font-semibold text-slate-800">{selectedCase.client?.firstName} {selectedCase.client?.lastName} ({selectedCase.client?.username})</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Assigned Lawyer</Label>
                      <p className="font-semibold text-slate-800">{selectedCase.lawyers?.[0]?.firstName || selectedCase.lawyers?.[0]?.username || "Pending"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Opened On</Label>
                      <p className="font-semibold text-slate-800">{new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Next Hearing</Label>
                      <p className="font-semibold text-blue-600">{selectedCase.nextHearing ? new Date(selectedCase.nextHearing).toLocaleDateString() : "Schedule TBD"}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rojnama" className="m-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Historical Timeline</h3>
                    <Button size="sm" onClick={() => setIsAddingUpdate(true)}>+ New Entry</Button>
                  </div>

                  {isAddingUpdate && (
                    <div className="border-2 border-blue-100 p-4 rounded-xl bg-blue-50/30 space-y-3">
                      <Textarea 
                        placeholder="Log legal progress..." 
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        className="bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsAddingUpdate(false)}>Dismiss</Button>
                        <Button size="sm" className="bg-blue-600" onClick={handleAddUpdate}>Commit Update</Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {selectedCase.rojnama?.length > 0 ? (
                      [...selectedCase.rojnama].reverse().map((entry: any, i: number) => (
                        <div key={i} className="relative pl-6 border-l-2 border-slate-200 pb-4 last:pb-0">
                          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                          <div className="bg-white border rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between text-[11px] mb-2">
                              <span className="font-bold text-slate-500">{new Date(entry.date).toLocaleString()}</span>
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase font-bold">By {entry.addedBy}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{entry.update}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400">No logs found for this case.</div>
                    )}
                  </div>
                </TabsContent>

                {/* --- FULLY FUNCTIONAL EVIDENCE TAB --- */}
                <TabsContent value="evidence" className="m-0 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Case Documents & Evidence</h3>
                    
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                    />
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white" 
                      disabled={isUploadingDoc} 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploadingDoc ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {isUploadingDoc ? 'Uploading...' : 'Upload File'}
                    </Button>
                  </div>

                  {caseDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {caseDocuments.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg bg-white shadow-sm gap-3 transition hover:border-blue-300">
                          <div className="p-2 bg-slate-50 rounded shrink-0">
                            {getDocFileIcon(doc.fileUrl)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-slate-800 truncate" title={doc.originalName}>{doc.originalName}</p>
                            <p className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-8 p-0 text-blue-600" onClick={() => handleViewDoc(doc._id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-8 p-0 text-slate-600" onClick={() => handleDownloadDoc(doc._id, doc.originalName)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-slate-400 mb-3" />
                      <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG or PNG (max. 10MB)</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}