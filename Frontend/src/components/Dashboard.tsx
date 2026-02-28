import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function Dashboard() {
  // 1. State for Real Data
  const [cases, setCases] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [casesRes, aptsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/cases", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/api/appointments", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
        setAppointments(Array.isArray(aptsRes.data) ? aptsRes.data : []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 3. Dynamic Data Calculations
  // Stats
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

  // Recent Cases (Top 4 newest)
  const recentCases = [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Upcoming Hearings (From Appointments collection where type = 'hearing')
  const upcomingHearings = appointments
    .filter(apt => apt.type === 'hearing' && new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Global Rojnama (Flatten all rojnama arrays, sort by date, take top 4)
  const allRojnamaUpdates = cases.flatMap(c => 
    (c.rojnama || []).map((r: any) => ({
      caseId: c._id.substring(0, 8),
      update: r.update,
      date: new Date(r.date)
    }))
  ).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  // Task Deadlines (Temporary Static Data until Task Model is built)
  const taskDeadlines = [
    { task: 'File motion for CASE-001', deadline: 'Today', priority: 'High' },
    { task: 'Review contracts for CASE-004', deadline: 'Tomorrow', priority: 'Medium' },
    { task: 'Client interview preparation', deadline: 'Jan 16', priority: 'Medium' },
    { task: 'Discovery response due', deadline: 'Jan 18', priority: 'High' },
  ];

  if (loading) return <div className="p-10 text-center text-gray-500">Syncing Dashboard Data...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
        {/* Case Summary */}
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
                      <span className="text-sm font-medium text-gray-500 truncate max-w-[80px]" title={case_._id}>{case_._id}</span>
                      <Badge 
                        variant={case_.priority === 'High' ? 'destructive' : case_.priority === 'Medium' ? 'default' : 'secondary'}
                      >
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

        {/* Rojnama Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rojnama (Daily Updates)</CardTitle>
            <Button variant="outline" size="sm">Add Update</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allRojnamaUpdates.length === 0 ? <p className="text-sm text-gray-500">No rojnama updates recorded yet.</p> : allRojnamaUpdates.map((update, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">{update.caseId}...</span>
                      <span className="text-xs text-gray-500">{update.date.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{update.update}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Hearings */}
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
              {upcomingHearings.length === 0 ? <p className="text-sm text-gray-500">No upcoming hearings scheduled.</p> : upcomingHearings.map((hearing) => (
                <div key={hearing._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-gray-900 truncate">{hearing.title}</p>
                    <p className="text-sm text-gray-500 truncate">{hearing.caseId?.title || 'Unlinked Appointment'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-900">{new Date(hearing.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{hearing.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Deadlines */}
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
              {taskDeadlines.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={task.priority === 'High' ? 'destructive' : 'default'}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      task.deadline === 'Today' ? 'text-red-600' : 
                      task.deadline === 'Tomorrow' ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {task.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}