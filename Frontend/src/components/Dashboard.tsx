import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, 
  Calendar, Users, TrendingUp, Activity, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Helper to format task deadlines safely
const formatDeadline = (dateString?: string) => {
  if (!dateString) return { text: 'No Deadline', color: 'text-gray-500' };

  const taskDate = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  taskDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (taskDate.getTime() === today.getTime()) return { text: 'Today', color: 'text-red-600 font-bold' };
  if (taskDate.getTime() === tomorrow.getTime()) return { text: 'Tomorrow', color: 'text-yellow-600 font-bold' };
  if (taskDate.getTime() < today.getTime()) return { text: 'Overdue', color: 'text-red-800 font-bold' };
  
  return { text: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-gray-900' };
};

export function Dashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // Modal State for Rojnama
  const [isRojnamaModalOpen, setIsRojnamaModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [rojnamaUpdateText, setRojnamaUpdateText] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [casesRes, aptsRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:8080/api/cases", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/tasks", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
      setAppointments(Array.isArray(aptsRes.data) ? aptsRes.data : []);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickAddRojnama = async () => {
    if (!selectedCaseId || !rojnamaUpdateText.trim()) {
      alert("Please select a case and enter an update.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:8080/api/cases/${selectedCaseId}/rojnama`, 
        { updateText: rojnamaUpdateText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rojnama successfully logged!");
      setRojnamaUpdateText('');
      setSelectedCaseId('');
      setIsRojnamaModalOpen(false);
      fetchDashboardData(); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add update.");
    }
  };

  const activeCount = cases.filter(c => c.status === 'Active').length;
  const closedCount = cases.filter(c => c.status === 'Closed').length;
  const pendingCount = cases.filter(c => c.status === 'Pending').length;
  const highPriorityCount = cases.filter(c => c.priority === 'High').length;

  const dynamicStats = [
    { label: 'Active Cases', value: activeCount, icon: FileText, color: 'bg-blue-500' },
    { label: 'Completed Cases', value: closedCount, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Urgent Cases', value: highPriorityCount, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const recentCases = [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingHearings = appointments
    .filter(apt => apt.type === 'hearing' && new Date(apt.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const allRojnamaUpdates = cases.flatMap(c => 
    (c.rojnama || []).map((r: any) => ({
      caseId: c._id.substring(0, 8),
      caseTitle: c.title,
      update: r.update,
      date: new Date(r.date),
      addedBy: r.addedBy
    }))
  ).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  // Syncing with your precise schema: t.status !== "done"
  const pendingTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  if (loading) return <div className="p-10 text-center text-gray-500">Syncing Dashboard Data...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Cases</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.length === 0 ? <p className="text-sm text-gray-500">No active cases found.</p> : recentCases.map((case_) => (
                <div key={case_._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 truncate max-w-[80px]" title={case_._id}>{case_._id.substring(0,8)}</span>
                      <Badge variant={case_.priority === 'High' ? 'destructive' : case_.priority === 'Medium' ? 'default' : 'secondary'}>
                        {case_.priority}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{case_.title}</p>
                    <p className="text-sm text-gray-500">Next hearing: {case_.nextHearing ? new Date(case_.nextHearing).toLocaleDateString() : 'TBD'}</p>
                  </div>
                  <Badge variant="outline">{case_.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rojnama (Daily Updates)</CardTitle>
            <Dialog open={isRojnamaModalOpen} onOpenChange={setIsRojnamaModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1"/> Add Update</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Log: Rojnama</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Case</Label>
                    <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                      <SelectTrigger><SelectValue placeholder="Which case is this for?" /></SelectTrigger>
                      <SelectContent>
                        {cases.map(c => (
                          <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Court Proceeding Details</Label>
                    <Textarea 
                      placeholder="e.g. Defendant failed to appear..."
                      value={rojnamaUpdateText}
                      onChange={e => setRojnamaUpdateText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRojnamaModalOpen(false)}>Cancel</Button>
                  <Button className="bg-blue-600" onClick={handleQuickAddRojnama}>Save Log</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allRojnamaUpdates.length === 0 ? <p className="text-sm text-gray-500">No rojnama updates recorded yet.</p> : allRojnamaUpdates.map((update, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600" title={update.caseTitle}>{update.caseId}...</span>
                      <span className="text-xs text-gray-500">{update.date.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{update.update}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Logged by: {update.addedBy || "Admin"}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Hearings</span>
            </CardTitle>
            <Button variant="outline" size="sm">View Calendar</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingHearings.length === 0 ? <p className="text-sm text-gray-500 py-4 text-center">No upcoming hearings scheduled.</p> : upcomingHearings.map((hearing) => (
                <div key={hearing._id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50/30 border-red-100">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-gray-900 truncate">{hearing.title}</p>
                    <p className="text-sm text-blue-600 truncate">{hearing.caseId?.title || 'Unlinked Case'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-red-600">{new Date(hearing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs text-gray-500">{hearing.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Task Deadlines</span>
            </CardTitle>
            <Button variant="outline" size="sm">View Tasks</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.length === 0 ? <p className="text-sm text-gray-500 py-4 text-center">No pending tasks.</p> : pendingTasks.map((task) => {
                const dlInfo = formatDeadline(task.deadline);
                return (
                  <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-500 border px-2 py-0.5 rounded uppercase">{task.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${dlInfo.color}`}>
                        {dlInfo.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}