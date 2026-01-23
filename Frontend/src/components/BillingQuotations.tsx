import React from 'react';
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
  Trash2
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

const invoicesQuotations = [
  {
    id: 'INV-001',
    type: 'invoice',
    client: 'Michael Smith',
    caseId: 'CASE-001',
    amount: 5500.00,
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    paidDate: '2024-01-15',
    services: [
      { description: 'Legal consultation', hours: 8, rate: 300, amount: 2400 },
      { description: 'Document preparation', hours: 6, rate: 200, amount: 1200 },
      { description: 'Court representation', hours: 12, rate: 350, amount: 4200 },
      { description: 'Filing fees', hours: 0, rate: 0, amount: 150 }
    ]
  },
  {
    id: 'QUO-001',
    type: 'quotation',
    client: 'Tech Solutions Ltd',
    caseId: 'CASE-002',
    amount: 12500.00,
    status: 'pending',
    issueDate: '2024-01-10',
    validUntil: '2024-02-10',
    services: [
      { description: 'Contract review and analysis', hours: 20, rate: 350, amount: 7000 },
      { description: 'Legal research', hours: 15, rate: 250, amount: 3750 },
      { description: 'Negotiations support', hours: 10, rate: 400, amount: 4000 },
      { description: 'Document drafting', hours: 8, rate: 300, amount: 2400 }
    ]
  },
  {
    id: 'INV-002',
    type: 'invoice',
    client: 'Jennifer Adams',
    caseId: 'CASE-003',
    amount: 7800.00,
    status: 'sent',
    issueDate: '2024-01-05',
    dueDate: '2024-02-05',
    services: [
      { description: 'Employment law consultation', hours: 12, rate: 300, amount: 3600 },
      { description: 'Case preparation', hours: 18, rate: 250, amount: 4500 },
      { description: 'Administrative costs', hours: 0, rate: 0, amount: 200 }
    ]
  },
  {
    id: 'INV-003',
    type: 'invoice',
    client: 'ABC Corporation',
    caseId: 'CASE-004',
    amount: 15000.00,
    status: 'overdue',
    issueDate: '2023-12-15',
    dueDate: '2024-01-15',
    services: [
      { description: 'Corporate merger consultation', hours: 25, rate: 400, amount: 10000 },
      { description: 'Due diligence review', hours: 20, rate: 350, amount: 7000 },
      { description: 'Regulatory compliance', hours: 15, rate: 300, amount: 4500 }
    ]
  }
];

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

export function BillingQuotations() {
  const [activeTab, setActiveTab] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedItem, setSelectedItem] = React.useState<typeof invoicesQuotations[0] | null>(null);

  const filteredItems = invoicesQuotations.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    totalRevenue: invoicesQuotations
      .filter(item => item.type === 'invoice' && item.status === 'paid')
      .reduce((sum, item) => sum + item.amount, 0),
    pendingAmount: invoicesQuotations
      .filter(item => item.type === 'invoice' && ['sent', 'overdue'].includes(item.status))
      .reduce((sum, item) => sum + item.amount, 0),
    quotationValue: invoicesQuotations
      .filter(item => item.type === 'quotation' && item.status === 'pending')
      .reduce((sum, item) => sum + item.amount, 0),
    overdueCount: invoicesQuotations.filter(item => item.status === 'overdue').length
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
              <QuotationForm />
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
                  {filteredItems.map((item) => {
                    const statusInfo = getStatusInfo(item.status, item.type);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'invoice' ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.client}</TableCell>
                        <TableCell className="text-blue-600">{item.caseId}</TableCell>
                        <TableCell className="font-medium">${item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </div>
                        </TableCell>
                        <TableCell>{item.issueDate}</TableCell>
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
                  })}
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
                <span>{selectedItem.id} - {selectedItem.client}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedItem.type === 'invoice' ? 'default' : 'secondary'}>
                    {selectedItem.type}
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
                  <p className="text-sm text-gray-600">Case: {selectedItem.caseId}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details:</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Issue Date:</span> {selectedItem.issueDate}</p>
                    {selectedItem.type === 'invoice' ? (
                      <>
                        <p><span className="font-medium">Due Date:</span> {selectedItem.dueDate}</p>
                        {selectedItem.paidDate && (
                          <p><span className="font-medium">Paid Date:</span> {selectedItem.paidDate}</p>
                        )}
                      </>
                    ) : (
                      <p><span className="font-medium">Valid Until:</span> {selectedItem.validUntil}</p>
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
                      Total: ${selectedItem.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {getStatusInfo(selectedItem.status, selectedItem.type).label}
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
          <Input id="client" placeholder="Client name" />
        </div>
        <div>
          <Label htmlFor="case">Case</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select case" />
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