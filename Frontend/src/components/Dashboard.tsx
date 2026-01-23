import React from 'react';
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

const caseStats = [
  { label: 'Active Cases', value: 24, icon: FileText, color: 'bg-blue-500' },
  { label: 'Completed Cases', value: 156, icon: CheckCircle, color: 'bg-green-500' },
  { label: 'Pending Review', value: 8, icon: Clock, color: 'bg-yellow-500' },
  { label: 'Urgent Cases', value: 3, icon: AlertTriangle, color: 'bg-red-500' },
];

const recentCases = [
  { id: 'CASE-001', title: 'Personal Injury Claim', status: 'Active', priority: 'High', nextHearing: '2024-01-15' },
  { id: 'CASE-002', title: 'Contract Dispute', status: 'Review', priority: 'Medium', nextHearing: '2024-01-18' },
  { id: 'CASE-003', title: 'Employment Law', status: 'Active', priority: 'Low', nextHearing: '2024-01-22' },
  { id: 'CASE-004', title: 'Corporate Merger', status: 'Pending', priority: 'High', nextHearing: '2024-01-20' },
];

const rojnamaUpdates = [
  { case: 'CASE-001', update: 'Filed motion for summary judgment', time: '2 hours ago' },
  { case: 'CASE-003', update: 'Client meeting scheduled for Monday', time: '4 hours ago' },
  { case: 'CASE-002', update: 'Received opposing counsel response', time: '1 day ago' },
  { case: 'CASE-004', update: 'Document review completed', time: '2 days ago' },
];

const upcomingHearings = [
  { case: 'CASE-001', title: 'Personal Injury Claim', date: 'Jan 15, 2024', time: '10:00 AM' },
  { case: 'CASE-002', title: 'Contract Dispute', date: 'Jan 18, 2024', time: '2:00 PM' },
  { case: 'CASE-004', title: 'Corporate Merger', date: 'Jan 20, 2024', time: '9:30 AM' },
];

const taskDeadlines = [
  { task: 'File motion for CASE-001', deadline: 'Today', priority: 'High' },
  { task: 'Review contracts for CASE-004', deadline: 'Tomorrow', priority: 'Medium' },
  { task: 'Client interview preparation', deadline: 'Jan 16', priority: 'Medium' },
  { task: 'Discovery response due', deadline: 'Jan 18', priority: 'High' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {caseStats.map((stat, index) => {
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
              {recentCases.map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">{case_.id}</span>
                      <Badge 
                        variant={case_.priority === 'High' ? 'destructive' : case_.priority === 'Medium' ? 'default' : 'secondary'}
                      >
                        {case_.priority}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900">{case_.title}</p>
                    <p className="text-sm text-gray-500">Next hearing: {case_.nextHearing}</p>
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
              {rojnamaUpdates.map((update, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">{update.case}</span>
                      <span className="text-xs text-gray-500">{update.time}</span>
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
              {upcomingHearings.map((hearing, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{hearing.title}</p>
                    <p className="text-sm text-gray-500">{hearing.case}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{hearing.date}</p>
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