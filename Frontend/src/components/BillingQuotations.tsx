import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Send,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Loader2
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

export function BillingQuotations() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [billingData, setBillingData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cases, setCases] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);

  const API_BASE = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billingRes, casesRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/billing`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/cases`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setBillingData(Array.isArray(billingRes.data) ? billingRes.data : []);
        setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
        
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        setClients(allUsers.filter(u => u.role === 'client'));
      } catch (err) {
        console.error('Failed to load billing data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchData();
  }, [token]);

  const getStatusInfo = (status: string, type: string) => {
    switch (status) {
      case 'paid':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' };
      case 'sent':
        return { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Sent' };
      case 'overdue':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Overdue' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: type === 'quotation' ? 'Pending Approval' : 'Pending' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: status };
    }
  };

  const filteredItems = billingData.filter(item => {
    const clientName = item.client?.firstName && item.client?.lastName 
      ? `${item.client.firstName} ${item.client.lastName}`
      : item.client?.username || '';
    const caseTitle = item.case?.title || '';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    totalRevenue: billingData
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + (item.invoiceAmount || 0), 0),
    pendingAmount: billingData
      .filter(item => ['sent', 'unpaid'].includes(item.status))
      .reduce((sum, item) => sum + (item.invoiceAmount || 0), 0),
    quotationValue: billingData
      .filter(item => item.status === 'quotation')
      .reduce((sum, item) => sum + (item.quotationAmount || 0), 0),
    overdueCount: billingData.filter(item => item.status === 'unpaid').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Quotations</h1>
          <p className="text-gray-600">Manage invoices, quotations, and financial records</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create Quotation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Quotation</DialogTitle>
              </DialogHeader>
              <QuotationForm isInvoice={false} />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <QuotationForm isInvoice={true} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-blue-600">${stats.pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quotation Value</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.quotationValue.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
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
                  placeholder="Search invoices and quotations..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="invoice">Invoices</TabsTrigger>
          <TabsTrigger value="quotation">Quotations</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Items' : 
                 activeTab === 'invoice' ? 'Invoices' : 'Quotations'} 
                ({filteredItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Case</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          Loading billing data...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                        No billing records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => {
                      const statusInfo = getStatusInfo(item.status, item.status);
                      const StatusIcon = statusInfo.icon;
                      const clientName = item.client?.firstName && item.client?.lastName 
                        ? `${item.client.firstName} ${item.client.lastName}`
                        : item.client?.username || 'Unknown';
                      const amount = item.invoiceAmount || item.quotationAmount || 0;
                      
                      return (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">{item._id.substring(0, 8).toUpperCase()}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'quotation' ? 'secondary' : 'default'}>
                              {item.status === 'quotation' ? 'Quotation' : 'Invoice'}
                            </Badge>
                          </TableCell>
                          <TableCell>{clientName}</TableCell>
                          <TableCell className="text-blue-600">{item.case?.title || 'Unlinked'}</TableCell>
                          <TableCell className="font-medium">${amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedItem._id.substring(0, 8).toUpperCase()} - {selectedItem.client}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedItem.status === 'quotation' ? 'secondary' : 'default'}>
                    {selectedItem.status === 'quotation' ? 'Quotation' : 'Invoice'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                  <p className="font-medium">{selectedItem.client}</p>
                  <p className="text-sm text-gray-600">Case: {selectedItem.case?.title || 'Unlinked'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details:</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Issue Date:</span> {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                    {selectedItem.status === 'invoice' ? (
                      <>
                        <p><span className="font-medium">Due Date:</span> {new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                        {selectedItem.paidDate && (
                          <p><span className="font-medium">Paid Date:</span> {new Date(selectedItem.paidDate).toLocaleDateString()}</p>
                        )}
                      </>
                    ) : (
                      <p><span className="font-medium">Valid Until:</span> {new Date(selectedItem.validUntil).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Services Table */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Services:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItem.services.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>{service.hours || '-'}</TableCell>
                        <TableCell>${service.rate || '-'}</TableCell>
                        <TableCell>${service.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Total: ${selectedItem.invoiceAmount || selectedItem.quotationAmount || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {getStatusInfo(selectedItem.status, selectedItem.status).label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function QuotationForm({ isInvoice = false }: { isInvoice?: boolean }) {
  const [services, setServices] = React.useState([
    { description: '', hours: 0, rate: 0 }
  ]);
  
  const [billingData, setBillingData] = React.useState<any[]>([]);
  const [cases, setCases] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<any[]>([]);
  
  const API_BASE = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/cases`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
        
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        setClients(allUsers.filter(u => u.role === 'client'));
      } catch (err) {
        console.error('Failed to load form data:', err);
      }
    };
    
    if (token) fetchData();
  }, [token]);

  const addService = () => {
    setServices([...services, { description: '', hours: 0, rate: 0 }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const total = services.reduce((sum, service) => sum + (service.hours * service.rate), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client">Client</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.firstName} {client.lastName} (@{client.username})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="case">Case</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select case" />
            </SelectTrigger>
            <SelectContent>
              {cases.map((case_) => (
                <SelectItem key={case_._id} value={case_._id}>
                  {case_.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="issue-date">Issue Date</Label>
          <Input id="issue-date" type="date" />
        </div>
        <div>
          <Label htmlFor="due-date">{isInvoice ? 'Due Date' : 'Valid Until'}</Label>
          <Input id="due-date" type="date" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Services</Label>
          <Button type="button" variant="outline" size="sm" onClick={addService}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
        
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Input
                  placeholder="Service description"
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].description = e.target.value;
                    setServices(newServices);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Hours"
                  value={service.hours}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].hours = parseFloat(e.target.value) || 0;
                    setServices(newServices);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Rate"
                  value={service.rate}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].rate = parseFloat(e.target.value) || 0;
                    setServices(newServices);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={`$${(service.hours * service.rate).toLocaleString()}`}
                  disabled
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                  disabled={services.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-end">
            <p className="text-lg font-semibold">Total: ${total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Additional notes or terms" />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create {isInvoice ? 'Invoice' : 'Quotation'}
        </Button>
      </div>
    </div>
  );
}