import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Upload
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

const cases = [
  {
    id: 'CASE-001',
    title: 'Personal Injury Claim - Smith vs. ABC Corp',
    status: 'Active',
    assignedLawyer: 'John Mitchell',
    priority: 'High',
    nextHearing: '2024-01-15',
    client: 'Michael Smith',
    createdDate: '2023-10-15'
  },
  {
    id: 'CASE-002',
    title: 'Contract Dispute - Tech Solutions Ltd',
    status: 'Review',
    assignedLawyer: 'Sarah Johnson',
    priority: 'Medium',
    nextHearing: '2024-01-18',
    client: 'Tech Solutions Ltd',
    createdDate: '2023-11-02'
  },
  {
    id: 'CASE-003',
    title: 'Employment Law - Wrongful Termination',
    status: 'Active',
    assignedLawyer: 'David Chen',
    priority: 'Low',
    nextHearing: '2024-01-22',
    client: 'Jennifer Adams',
    createdDate: '2023-11-20'
  },
  {
    id: 'CASE-004',
    title: 'Corporate Merger - ABC & XYZ Corp',
    status: 'Pending',
    assignedLawyer: 'Emily Rodriguez',
    priority: 'High',
    nextHearing: '2024-01-20',
    client: 'ABC Corporation',
    createdDate: '2023-12-01'
  },
];

const rojnamaUpdates = [
  { date: '2024-01-10', update: 'Filed motion for summary judgment', author: 'John Mitchell' },
  { date: '2024-01-08', update: 'Client meeting completed - discussed settlement options', author: 'John Mitchell' },
  { date: '2024-01-05', update: 'Received medical records from hospital', author: 'Paralegal - Amy' },
  { date: '2024-01-03', update: 'Deposition scheduled for opposing party', author: 'John Mitchell' },
];

export function CaseManagement() {
  const [selectedCase, setSelectedCase] = React.useState<typeof cases[0] | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Review': return 'secondary';
      case 'Pending': return 'outline';
      case 'Closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
          <p className="text-gray-600">Manage and track all legal cases</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="case-title" className="text-right">Title</Label>
                <Input id="case-title" className="col-span-3" placeholder="Enter case title" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-name" className="text-right">Client</Label>
                <Input id="client-name" className="col-span-3" placeholder="Client name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assigned-lawyer" className="text-right">Assign To</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select lawyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Mitchell</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="david">David Chen</SelectItem>
                    <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" className="col-span-3" placeholder="Case description" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Create Case</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Lawyer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((case_) => (
                <TableRow key={case_.id}>
                  <TableCell className="font-medium">{case_.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{case_.title}</p>
                      <p className="text-sm text-gray-500">{case_.client}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(case_.status)}>{case_.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{case_.assignedLawyer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{case_.nextHearing}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCase(case_)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Case Details Modal */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedCase.title}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(selectedCase.status)}>{selectedCase.status}</Badge>
                  <Badge variant={getPriorityColor(selectedCase.priority)}>{selectedCase.priority}</Badge>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Fetch eCourts Data
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="rojnama">Rojnama</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Case ID</Label>
                    <p className="text-sm font-medium">{selectedCase.id}</p>
                  </div>
                  <div>
                    <Label>Client</Label>
                    <p className="text-sm font-medium">{selectedCase.client}</p>
                  </div>
                  <div>
                    <Label>Assigned Lawyer</Label>
                    <p className="text-sm font-medium">{selectedCase.assignedLawyer}</p>
                  </div>
                  <div>
                    <Label>Next Hearing</Label>
                    <p className="text-sm font-medium">{selectedCase.nextHearing}</p>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p className="text-sm font-medium">{selectedCase.createdDate}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className="text-sm font-medium">{selectedCase.status}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="evidence" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop evidence files here or click to browse</p>
                  <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Evidence
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Medical_Report_Smith.pdf</p>
                        <p className="text-sm text-gray-500">Uploaded on 2024-01-05</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Witness_Statement_01.pdf</p>
                        <p className="text-sm text-gray-500">Uploaded on 2024-01-03</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rojnama" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Daily Case Updates</h3>
                  <Button size="sm">Add Update</Button>
                </div>
                <div className="space-y-4">
                  {rojnamaUpdates.map((update, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600">{update.date}</span>
                        <span className="text-sm text-gray-500">{update.author}</span>
                      </div>
                      <p className="text-gray-900">{update.update}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Case Documents</h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Case_Brief.docx</p>
                        <p className="text-sm text-gray-500">245 KB • Word Document</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-medium">Contract_Agreement.pdf</p>
                        <p className="text-sm text-gray-500">1.2 MB • PDF Document</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}