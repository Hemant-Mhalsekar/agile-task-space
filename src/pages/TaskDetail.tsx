
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  Clock, 
  Edit, 
  Save, 
  Trash2, 
  User, 
  Check, 
  Ban, 
  AlertCircle 
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskPriority, TaskStatus } from '@/types';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  
  const task = tasks.find(t => t.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState<TaskStatus>('todo');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('medium');
  const [editedAssignee, setEditedAssignee] = useState<string | null>(null);
  
  if (!user) return null;
  
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The task you are looking for does not exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/tasks')}>
          Go to Task List
        </Button>
      </div>
    );
  }
  
  const handleStartEditing = () => {
    setEditedDescription(task.description);
    setEditedStatus(task.status);
    setEditedPriority(task.priority);
    setEditedAssignee(task.assignee);
    setIsEditing(true);
  };
  
  const handleSaveChanges = () => {
    updateTask(task.id, {
      description: editedDescription,
      status: editedStatus,
      priority: editedPriority,
      assignee: editedAssignee
    });
    setIsEditing(false);
  };
  
  const handleDeleteTask = () => {
    deleteTask(task.id);
    navigate('/tasks');
  };
  
  const canEdit = user.role === 'admin' || task.creator === user.id || task.assignee === user.id;
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'bg-slate-200 text-slate-800';
      case 'in-progress': return 'bg-blue-200 text-blue-800';
      case 'review': return 'bg-amber-200 text-amber-800';
      case 'completed': return 'bg-green-200 text-green-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low': return 'bg-task-low text-white';
      case 'medium': return 'bg-task-medium text-white';
      case 'high': return 'bg-task-high text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };
  
  const getAssigneeName = (id: string | null) => {
    if (!id) return 'Unassigned';
    if (id === '1') return 'Admin User';
    if (id === '2') return 'Team Member';
    if (id === user.id) return `${user.name} (Me)`;
    return 'Unknown User';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && !isEditing && (
            <Button variant="outline" onClick={handleStartEditing}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {isEditing && (
            <Button variant="default" onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <Ban className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          {canEdit && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTask}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={8}
                />
              ) : (
                <p className="whitespace-pre-line">{task.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                {isEditing ? (
                  <Select
                    value={editedStatus}
                    onValueChange={(value) => setEditedStatus(value as TaskStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center">
                    {task.status === 'todo' && <Check className="h-4 w-4 mr-2" />}
                    {task.status === 'in-progress' && <Clock className="h-4 w-4 mr-2" />}
                    {task.status === 'review' && <AlertCircle className="h-4 w-4 mr-2" />}
                    {task.status === 'completed' && <Check className="h-4 w-4 mr-2" />}
                    <span className="capitalize">{task.status.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Priority</div>
                {isEditing ? (
                  <Select
                    value={editedPriority}
                    onValueChange={(value) => setEditedPriority(value as TaskPriority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="capitalize">{task.priority}</span>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Assignee</div>
                {isEditing ? (
                  <Select
                    value={editedAssignee || undefined}
                    onValueChange={(value) => setEditedAssignee(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={user.id}>
                        {user.name} (Me)
                      </SelectItem>
                      {user.role === 'admin' && (
                        <>
                          <SelectItem value="1">Admin User</SelectItem>
                          <SelectItem value="2">Team Member</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{getAssigneeName(task.assignee)}</span>
                  </div>
                )}
              </div>
              
              {task.dueDate && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Due Date</div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Created by</div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{task.creator === user.id ? `${user.name} (Me)` : (task.creator === '1' ? 'Admin User' : 'Team Member')}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Created at</div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{new Date(task.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
