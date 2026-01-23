import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Video,
  Phone,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const appointments = [
  {
    id: 'APT-001',
    title: 'Client Consultation - Michael Smith',
    caseId: 'CASE-001',
    type: 'consultation',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: '1 hour',
    location: 'Conference Room A',
    attendees: ['John Mitchell', 'Michael Smith'],
    description: 'Initial consultation for personal injury claim',
    status: 'scheduled'
  },
  {
    id: 'APT-002',
    title: 'Court Hearing - Contract Dispute',
    caseId: 'CASE-002',
    type: 'hearing',
    date: '2024-01-18',
    time: '2:00 PM',
    duration: '2 hours',
    location: 'Superior Court Room 3',
    attendees: ['Sarah Johnson', 'Tech Solutions Ltd'],
    description: 'Motion hearing for preliminary injunction',
    status: 'scheduled'
  },
  {
    id: 'APT-003',
    title: 'Deposition - Jane Doe',
    caseId: 'CASE-003',
    type: 'deposition',
    date: '2024-01-20',
    time: '9:30 AM',
    duration: '3 hours',
    location: 'Virtual Meeting',
    attendees: ['David Chen', 'Jane Doe', 'Court Reporter'],
    description: 'Witness deposition for employment case',
    status: 'confirmed'
  },
  {
    id: 'APT-004',
    title: 'Mediation Session',
    caseId: 'CASE-004',
    type: 'mediation',
    date: '2024-01-22',
    time: '1:00 PM',
    duration: '4 hours',
    location: 'Mediation Center',
    attendees: ['Emily Rodriguez', 'ABC Corp', 'XYZ Corp', 'Mediator'],
    description: 'Corporate merger dispute mediation',
    status: 'pending'
  }
];

const getAppointmentTypeInfo = (type: string) => {
  switch (type) {
    case 'consultation':
      return { color: 'bg-blue-100 text-blue-800', icon: User };
    case 'hearing':
      return { color: 'bg-red-100 text-red-800', icon: CalendarIcon };
    case 'deposition':
      return { color: 'bg-yellow-100 text-yellow-800', icon: Video };
    case 'mediation':
      return { color: 'bg-green-100 text-green-800', icon: Phone };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: CalendarIcon };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'default';
    case 'confirmed': return 'secondary';
    case 'pending': return 'outline';
    case 'completed': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getCurrentWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

export function AppointmentsCalendar() {
  const [currentView, setCurrentView] = React.useState('week');
  const weekDates = getCurrentWeekDates();
  
  const todaysAppointments = appointments.filter(apt => apt.date === '2024-01-15');
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) > new Date('2024-01-15'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments & Calendar</h1>
          <p className="text-gray-600">Manage hearings, meetings, and important dates</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Sync with Google Calendar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apt-title" className="text-right">Title</Label>
                  <Input id="apt-title" className="col-span-3" placeholder="Appointment title" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apt-type" className="text-right">Type</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Client Consultation</SelectItem>
                      <SelectItem value="hearing">Court Hearing</SelectItem>
                      <SelectItem value="deposition">Deposition</SelectItem>
                      <SelectItem value="mediation">Mediation</SelectItem>
                      <SelectItem value="meeting">Internal Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="case-link" className="text-right">Link to Case</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apt-date" className="text-right">Date</Label>
                  <Input id="apt-date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apt-time" className="text-right">Time</Label>
                  <div className="col-span-3 flex space-x-2">
                    <Input id="apt-time" type="time" className="flex-1" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hour">1 hour</SelectItem>
                        <SelectItem value="2hours">2 hours</SelectItem>
                        <SelectItem value="3hours">3 hours</SelectItem>
                        <SelectItem value="4hours">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input id="location" className="col-span-3" placeholder="Meeting location" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attendees" className="text-right">Attendees</Label>
                  <Input id="attendees" className="col-span-3" placeholder="Comma-separated list of attendees" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea id="description" className="col-span-3" placeholder="Appointment description" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Schedule Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
          <TabsList>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="month">Month View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-sm text-gray-600">
          January 2024
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar/Schedule View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentView === 'week' && (
                <div className="space-y-4">
                  {weekDates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayAppointments = appointments.filter(apt => apt.date === dateStr);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={index} className={`border rounded-lg p-4 ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            {isToday && <Badge variant="default">Today</Badge>}
                          </div>
                          <span className="text-sm text-gray-500">
                            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {dayAppointments.length > 0 ? (
                          <div className="space-y-2">
                            {dayAppointments.map((apt) => {
                              const typeInfo = getAppointmentTypeInfo(apt.type);
                              const TypeIcon = typeInfo.icon;
                              
                              return (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${typeInfo.color}`}>
                                      <TypeIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{apt.title}</p>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="flex items-center space-x-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{apt.time}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                          <MapPin className="h-3 w-3" />
                                          <span>{apt.location}</span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant={getStatusColor(apt.status)}>
                                    {apt.status}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {currentView === 'list' && (
                <div className="space-y-4">
                  {appointments.map((apt) => {
                    const typeInfo = getAppointmentTypeInfo(apt.type);
                    const TypeIcon = typeInfo.icon;
                    
                    return (
                      <div key={apt.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${typeInfo.color}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                              <p className="text-sm text-blue-600 mb-2">{apt.caseId}</p>
                              <p className="text-gray-600 mb-3">{apt.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{apt.date} at {apt.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{apt.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{apt.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{apt.attendees.length} attendees</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(apt.status)}>
                              {apt.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Today's Schedule & Upcoming */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todaysAppointments.map((apt) => {
                    const typeInfo = getAppointmentTypeInfo(apt.type);
                    const TypeIcon = typeInfo.icon;
                    
                    return (
                      <div key={apt.id} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <TypeIcon className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{apt.time}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{apt.title}</p>
                        <p className="text-xs text-gray-600">{apt.location}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments today</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((apt) => {
                  const typeInfo = getAppointmentTypeInfo(apt.type);
                  const TypeIcon = typeInfo.icon;
                  
                  return (
                    <div key={apt.id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <TypeIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{apt.date}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{apt.title}</p>
                      <p className="text-xs text-gray-600">{apt.time} • {apt.location}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Book Court Date
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Export Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}