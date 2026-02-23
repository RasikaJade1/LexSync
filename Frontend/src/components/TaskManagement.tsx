import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  FileText,
  Edit,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // ← added
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

export function TaskManagement() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Create task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    caseId: '',
    priority: 'medium',
    deadline: '',
  });

  // Edit task state
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({
    title: '',
    description: '',
    assignedTo: '',
    caseId: '',
    priority: 'medium',
    deadline: '',
    status: 'pending',
  });

  const [creating, setCreating] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Current user
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const API_BASE = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    console.log('[TaskManagement] Mounted - localStorage:', { role, username, userId });

    setCurrentRole(role);
    setCurrentUsername(username);
    if (userId) setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (currentRole) fetchData();
  }, [currentRole]);

  const fetchData = async () => {
    if (!token) {
      setError('No token. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [tasksRes, casesRes] = await Promise.all([
        axios.get(`${API_BASE}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/cases`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setTasks(tasksRes.data || []);
      setCases(casesRes.data || []);

      if (currentRole === 'admin') {
        console.log('[TaskManagement] Admin → fetching lawyers');
        try {
          const usersRes = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const filtered = usersRes.data.filter((u: any) => u.role?.toLowerCase() === 'lawyer');
          setLawyers(filtered);
          console.log(`[TaskManagement] Loaded ${filtered.length} lawyers`);
        } catch (err) {
          console.error('[TaskManagement] Lawyers fetch failed:', err);
        }
      }
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (task: any) => {
    console.log('[TaskManagement] Opening edit for task:', task._id);
    setSelectedTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      caseId: task.case?._id || '',
      priority: task.priority || 'medium',
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      status: task.status || 'pending',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!selectedTask) return;
    if (!editForm.title.trim()) return alert('Title is required.');

    setSavingEdit(true);

    try {
      const payload: any = {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        priority: editForm.priority,
        status: editForm.status,
      };

      if (editForm.caseId && editForm.caseId !== 'none') payload.case = editForm.caseId;
      if (editForm.deadline) payload.deadline = editForm.deadline;

      // Only admin can change assignee
      if (currentRole === 'admin' && editForm.assignedTo) {
        payload.assignedTo = editForm.assignedTo;
      }

      console.log('[TaskManagement] Saving edit payload:', payload);

      await axios.patch(`${API_BASE}/tasks/${selectedTask._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditOpen(false);
      setSelectedTask(null);
      fetchData();
      alert('Task updated!');
    } catch (err: any) {
      console.error('[TaskManagement] Save edit failed:', err);
      alert(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Create task (placeholder - your existing code)
  const handleCreate = async () => {
    // ... your create logic ...
    fetchData();
    setCreateOpen(false);
  };

  // Filtering & stats (unchanged)
  const filteredTasks = tasks.filter((task: any) => {
    const q = searchTerm.toLowerCase();
    const matches =
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.assignedTo?.username?.toLowerCase().includes(q) ||
      task.case?.title?.toLowerCase().includes(q);

    return (
      matches &&
      (statusFilter === 'all' || task.status === statusFilter) &&
      (priorityFilter === 'all' || task.priority === priorityFilter) &&
      (activeTab === 'all' || task.status === activeTab)
    );
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t: any) => t.status === 'pending').length,
    inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
    done: tasks.filter((t: any) => t.status === 'done').length,
    overdue: tasks.filter((t: any) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length,
  };

  const isOverdue = (d?: string) => d && new Date(d) < new Date() && !['done'].includes(d.toLowerCase());

  const daysLeftText = (d?: string) => {
    if (!d) return '';
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''}`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  const getStatusStyle = (s?: string) => {
    const st = s?.toLowerCase();
    if (st === 'pending') return { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock };
    if (st === 'in-progress') return { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertTriangle };
    if (st === 'done') return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 };
    return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
  };

  const getPriorityVariant = (p?: string) => {
    const pv = p?.toLowerCase();
    if (pv === 'high') return 'destructive';
    if (pv === 'medium') return 'default';
    if (pv === 'low') return 'secondary';
    return 'outline';
  };

  return (
    <div className="container mx-auto space-y-8 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1.5">
            Manage your legal tasks, assignments and deadlines
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              New Task
            </Button>
          </DialogTrigger>
          {/* Your existing create dialog - omitted for brevity */}
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 lg:gap-6">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} color="text-amber-600" />
        <Stat label="In Progress" value={stats.inProgress} color="text-blue-600" />
        <Stat label="Completed" value={stats.done} color="text-emerald-600" />
        <Stat label="Overdue" value={stats.overdue} color="text-red-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs + Tasks */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="space-y-5">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/30">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No tasks found</h3>
              <p className="text-muted-foreground mt-3 max-w-md">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting filters'
                  : 'No tasks visible for your role'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredTasks.map((task: any) => {
                const style = getStatusStyle(task.status);
                const overdue = isOverdue(task.deadline);

                return (
                  <Card
                    key={task._id}
                    className={`overflow-hidden transition-all hover:shadow-md ${
                      overdue ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-transparent'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <h3 className="font-semibold text-lg leading-tight">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(task)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Task
                                </DropdownMenuItem>
                                {task.status !== 'in-progress' && (
                                  <DropdownMenuItem onClick={() => changeStatus(task._id, 'in-progress')}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Start
                                  </DropdownMenuItem>
                                )}
                                {task.status !== 'done' && (
                                  <DropdownMenuItem onClick={() => changeStatus(task._id, 'done')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Complete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User size={14} />
                              <span>{task.assignedTo?.username || 'Unassigned'}</span>
                            </div>

                            {task.case?.title && (
                              <div className="flex items-center gap-1.5">
                                <FileText size={14} />
                                <span className="text-primary font-medium">{task.case.title}</span>
                              </div>
                            )}

                            {task.deadline && (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span className={overdue ? 'text-red-600 font-medium' : ''}>
                                  {new Date(task.deadline).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}{' '}
                                  • {daysLeftText(task.deadline)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 self-start mt-1 lg:mt-0">
                          <Badge variant={getPriorityVariant(task.priority)} className="px-3 py-1 capitalize">
                            {task.priority}
                          </Badge>

                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                          >
                            {React.createElement(style.icon, { size: 14 })}
                            {style.label}
                          </div>

                          {overdue && (
                            <Badge variant="outline" className="border-red-500 text-red-700 px-3 py-1">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Edit size={18} />
              Edit Task
            </DialogTitle>
            <DialogDescription>
              Update the details of this task.
            </DialogDescription>
          </DialogHeader>

          {selectedTask ? (
            <div className="grid gap-6 py-5">
              <div className="grid gap-2">
                <Label>Title <span className="text-red-500 text-xs">*</span></Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Assigned To</Label>
                {currentRole === 'admin' ? (
                  <Select
                    value={editForm.assignedTo}
                    onValueChange={(v) => setEditForm({ ...editForm, assignedTo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lawyer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyers.map((u: any) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 border rounded bg-muted text-sm">
                    {selectedTask?.assignedTo?.username || '—'} (cannot change as lawyer)
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Related Case</Label>
                <Select
                  value={editForm.caseId || 'none'}
                  onValueChange={(v) => setEditForm({ ...editForm, caseId: v === 'none' ? '' : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {cases.map((c: any) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(v) => setEditForm({ ...editForm, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No task selected.
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={savingEdit || !editForm.title.trim()}>
              {savingEdit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Stat component (unchanged)
function Stat({ label, value, color = 'text-foreground' }: { label: string; value: number; color?: string }) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50/60 shadow-sm">
      <CardContent className="p-5 text-center">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-sm text-muted-foreground mt-1.5 font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}