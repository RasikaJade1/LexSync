import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Calendar as CalendarIcon, Plus, Clock, MapPin, 
  User, Video, Phone, Edit, Trash2, ExternalLink, RefreshCcw, X
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

const getAppointmentTypeInfo = (type: string) => {
  switch (type) {
    case 'consultation': return { color: 'bg-blue-100 text-blue-800', icon: User };
    case 'hearing': return { color: 'bg-red-100 text-red-800', icon: CalendarIcon };
    case 'deposition': return { color: 'bg-yellow-100 text-yellow-800', icon: Video };
    case 'mediation': return { color: 'bg-green-100 text-green-800', icon: Phone };
    case 'meeting': return { color: 'bg-purple-100 text-purple-800', icon: User };
    default: return { color: 'bg-gray-100 text-gray-800', icon: CalendarIcon };
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
  const [currentView, setCurrentView] = useState('week');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [casesList, setCasesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    type: 'consultation', 
    date: '', 
    time: '', 
    duration: '1 hour', 
    location: '', 
    caseId: 'none', 
    attendees: [] as string[], 
    description: '',
    status: 'scheduled' 
  });

  const weekDates = getCurrentWeekDates();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, caseRes, userRes] = await Promise.all([
        axios.get("http://localhost:8080/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/cases", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/users", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAppointments(Array.isArray(aptRes.data) ? aptRes.data : []);
      setCasesList(Array.isArray(caseRes.data) ? caseRes.data : []);
      setUsersList(Array.isArray(userRes.data) ? userRes.data : []);
    } catch (err) {
      console.error("Failed to fetch calendar data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateAppointment = async () => {
    try {
      if (!formData.title || !formData.date) {
        alert("Title and Date are required!");
        return;
      }

      const payload: any = {
        title: formData.title,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        duration: formData.duration,
        location: formData.location,
        description: formData.description,
        status: formData.status,
      };

      if (formData.caseId !== "none") {
        payload.caseId = formData.caseId;
      }
      
      if (formData.attendees.length > 0) {
        payload.attendees = formData.attendees; 
      }

      await axios.post("http://localhost:8080/api/appointments", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Appointment Scheduled!");
      fetchData();
      setIsDialogOpen(false);
      
      setFormData({ 
        title: '', type: 'consultation', date: '', time: '', 
        duration: '1 hour', location: '', caseId: 'none', 
        attendees: [], description: '', status: 'scheduled' 
      });
      
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to schedule appointment.");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const removeAttendee = (idToRemove: string) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter(id => id !== idToRemove)
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(apt => apt.date && apt.date.split('T')[0] === todayStr);
  const upcomingAppointments = appointments.filter(apt => apt.date && new Date(apt.date.split('T')[0]) > new Date(todayStr));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments & Calendar</h1>
          <p className="text-gray-600">Manage hearings, meetings, and important dates</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Title *</Label>
                  <Input className="col-span-3" placeholder="e.g. Initial Consultation" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
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
                  <Label className="text-right">Status</Label>
                  <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Link to Case</Label>
                  <Select value={formData.caseId} onValueChange={v => setFormData({...formData, caseId: v})}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a case" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Case Linked</SelectItem>
                      {casesList.map(c => <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Date *</Label>
                  <Input type="date" className="col-span-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Time & Duration</Label>
                  <div className="col-span-3 flex space-x-2">
                    <Input type="time" className="flex-1" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    <Select value={formData.duration} onValueChange={v => setFormData({...formData, duration: v})}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 mins">30 mins</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="4 hours">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <Input className="col-span-3" placeholder="Courtroom or Zoom link" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Attendees</Label>
                  <div className="col-span-3 space-y-3">
                    <Select 
                      value="" 
                      onValueChange={(val) => {
                        if (val && val !== "none" && !formData.attendees.includes(val)) {
                          setFormData({ ...formData, attendees: [...formData.attendees, val] });
                        }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Add an attendee..." /></SelectTrigger>
                      <SelectContent>
                        {usersList
                          .filter(u => !formData.attendees.includes(u._id))
                          .map(u => (
                            <SelectItem key={u._id} value={u._id}>
                              {u.firstName} {u.lastName} ({u.role})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {formData.attendees.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.attendees.map(id => {
                          const user = usersList.find(u => u._id === id);
                          if (!user) return null;
                          return (
                            <Badge key={id} variant="secondary" className="flex items-center gap-1 py-1 px-2 text-sm">
                              {user.firstName} {user.lastName}
                              <button 
                                type="button" 
                                onClick={() => removeAttendee(id)}
                                className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Description</Label>
                  <Textarea className="col-span-3" placeholder="Notes for the meeting..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateAppointment}>Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
          <TabsList>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{currentView === 'week' ? 'Weekly Schedule' : 'All Appointments'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <p className="text-center py-10 text-gray-500">Loading Calendar...</p> : currentView === 'week' ? (
                <div className="space-y-4">
                  {weekDates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayAppointments = appointments.filter(apt => apt.date && apt.date.split('T')[0] === dateStr);
                    const isToday = dateStr === todayStr;
                    
                    return (
                      <div key={index} className={`border rounded-lg p-4 ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            {isToday && <Badge variant="default">Today</Badge>}
                          </div>
                        </div>
                        
                        {dayAppointments.length > 0 ? (
                          <div className="space-y-2">
                            {dayAppointments.map((apt) => {
                              const typeInfo = getAppointmentTypeInfo(apt.type);
                              const TypeIcon = typeInfo.icon;

                              // NEW: Display all names comma-separated
                              const attendeeDisplay = apt.attendees && apt.attendees.length > 0 
                                ? apt.attendees.map((user: any) => `${user.firstName || ''} ${user.lastName || user.username}`.trim()).join(', ')
                                : "Unassigned";

                              return (
                                <div key={apt._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${typeInfo.color}`}><TypeIcon className="h-4 w-4" /></div>
                                    <div>
                                      <p className="font-medium text-gray-900">{apt.title}</p>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="flex items-center space-x-1"><Clock className="h-3 w-3" /><span>{apt.time || "TBD"}</span></span>
                                        <span className="flex items-center space-x-1"><User className="h-3 w-3" /><span className="truncate max-w-[250px]" title={attendeeDisplay}>{attendeeDisplay}</span></span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <Badge variant={getStatusColor(apt.status)}>{apt.status}</Badge>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(apt._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm py-2 italic">No appointments</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.length === 0 ? <p className="text-center py-4 text-gray-500">No appointments scheduled.</p> : appointments.map((apt) => {
                    const typeInfo = getAppointmentTypeInfo(apt.type);
                    const TypeIcon = typeInfo.icon;
                    
                    const caseTitle = apt.caseId?.title || "General Firm Appointment";
                    
                    // NEW: Display all names comma-separated
                    const attendeeDisplay = apt.attendees && apt.attendees.length > 0 
                      ? apt.attendees.map((user: any) => `${user.firstName || ''} ${user.lastName || user.username}`.trim()).join(', ')
                      : "Unassigned";

                    return (
                      <div key={apt._id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${typeInfo.color}`}><TypeIcon className="h-5 w-5" /></div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                              <p className="text-sm text-blue-600 mb-2">{caseTitle}</p>
                              <p className="text-gray-600 mb-3">{apt.description}</p>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1" />{apt.date ? new Date(apt.date).toLocaleDateString() : 'TBD'} at {apt.time}</span>
                                <span className="flex items-center"><User className="h-4 w-4 mr-1" /><span className="truncate max-w-[400px]" title={attendeeDisplay}>{attendeeDisplay}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(apt.status)}>{apt.status}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(apt._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Today's Schedule</CardTitle></CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todaysAppointments.map((apt) => {
                    const typeInfo = getAppointmentTypeInfo(apt.type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div key={apt._id} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <TypeIcon className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{apt.time || "TBD"}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{apt.title}</p>
                        <p className="text-xs text-gray-600">{apt.caseId?.title || "General Meeting"}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Free day today!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Upcoming</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.length === 0 ? <p className="text-gray-500 text-center py-2">No upcoming dates.</p> : upcomingAppointments.slice(0, 3).map((apt) => {
                  const typeInfo = getAppointmentTypeInfo(apt.type);
                  const TypeIcon = typeInfo.icon;
                  return (
                    <div key={apt._id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <TypeIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{apt.title}</p>
                      <p className="text-xs text-gray-600">{apt.time} • {apt.location || "Location TBD"}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}