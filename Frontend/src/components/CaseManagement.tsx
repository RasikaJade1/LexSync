import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, Search, Filter, Download, Eye, Edit, Trash2,
  Calendar, User, AlertCircle, FileText, Upload, RefreshCcw
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

  const [updateText, setUpdateText] = useState('');
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

  // Updated Form State to include Lawyer assignment
  const [formData, setFormData] = useState({
    title: '',
    client: '', 
    lawyers: '', // Added for lawyer assignment
    priority: 'Medium',
    description: ''
  });

  const API_URL = "http://localhost:8080/api/cases"; // Set to 8080 based on your backend
  const token = localStorage.getItem("token");

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching cases:", err);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async () => {
    try {
      // Send lawyers as an array to match the backend schema
      const submissionData = {
        ...formData,
        lawyers: formData.lawyers ? [formData.lawyers] : []
      };

      await axios.post(API_URL, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Case created successfully!");
      fetchCases();
      setFormData({ title: '', client: '', lawyers: '', priority: 'Medium', description: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create case. Check IDs.");
    }
  };

  const handleAddUpdate = async () => {
    if (!updateText.trim()) return;
    try {
      const res = await axios.patch(`${API_URL}/${selectedCase._id}/rojnama`, 
        { updateText }, // Note: Backend uses req.user for addedBy now
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedCase(res.data);
      setUpdateText('');
      setIsAddingUpdate(false);
      fetchCases();
    } catch (err) {
      alert("Failed to add update.");
    }
  };

  const filteredCases = Array.isArray(cases) ? cases.filter(case_ => {
    const title = case_.title || "";
    const id = case_._id || "";
    const client = case_.client?.username || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Button variant="outline" onClick={fetchCases} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Create Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register New Legal Case</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Title</Label>
                  <Input 
                    className="col-span-3" 
                    placeholder="e.g., State vs. John Doe" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Client ID</Label>
                  <Input 
                    className="col-span-3" 
                    placeholder="Paste MongoDB Client ID" 
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Lawyer ID</Label>
                  <Input 
                    className="col-span-3" 
                    placeholder="Paste Lead Lawyer ID" 
                    value={formData.lawyers}
                    onChange={(e) => setFormData({...formData, lawyers: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">Priority</Label>
                  <Select onValueChange={(val) => setFormData({...formData, priority: val})} defaultValue="Medium">
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
                  <Label className="text-right font-semibold">Brief Description</Label>
                  <Textarea 
                    className="col-span-3" 
                    placeholder="Case background and objectives..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCase}>Save Case</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Cases Table */}
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
                 <TableRow><TableCell colSpan={6} className="text-center py-10">Syncing with LexSync Cloud...</TableCell></TableRow>
              ) : filteredCases.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-500 font-medium">No records found matching your criteria.</TableCell></TableRow>
              ) : filteredCases.map((case_) => (
                <TableRow key={case_._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <p className="font-bold text-slate-900">{case_.title}</p>
                    <p className="text-xs text-slate-500 font-mono">{case_._id?.substring(0, 12)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(case_.status)}>{case_.status || "Active"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{case_.lawyers?.[0]?.username || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {case_.nextHearing ? new Date(case_.nextHearing).toLocaleDateString() : 'Pending Date'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCase(case_)}>
                      <Eye className="h-4 w-4 text-slate-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed View Modal */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => { setSelectedCase(null); setIsAddingUpdate(false); }}>
          <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
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
                  <TabsTrigger value="evidence" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">Evidence</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="overview" className="m-0 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Client Information</Label>
                      <p className="font-semibold text-slate-800">{selectedCase.client?.username || "Not Linked"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-500 uppercase text-[10px] font-bold">Assigned Lawyer</Label>
                      <p className="font-semibold text-slate-800">{selectedCase.lawyers?.[0]?.username || "Pending Assignment"}</p>
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
                        placeholder="Log legal progress, court updates, or filing statuses..." 
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

                <TabsContent value="evidence" className="m-0">
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl border-slate-200 bg-slate-50">
                    <Upload className="h-8 w-8 text-slate-400 mb-3" />
                    <p className="text-sm font-medium text-slate-600">Secure Evidence Vault</p>
                    <p className="text-xs text-slate-400 mt-1">Files are encrypted and stored in Cloudinary.</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}