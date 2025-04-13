
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  ListChecks, 
  Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { TaskStatus, TaskPriority } from '@/types';

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  // Filter tasks based on user role and assignment
  const userTasks = user.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.assignee === user.id || task.creator === user.id);

  // Calculate task statistics
  const taskStats = {
    total: userTasks.length,
    todo: userTasks.filter(task => task.status === 'todo').length,
    inProgress: userTasks.filter(task => task.status === 'in-progress').length,
    review: userTasks.filter(task => task.status === 'review').length,
    completed: userTasks.filter(task => task.status === 'completed').length,
    highPriority: userTasks.filter(task => task.priority === 'high').length,
  };

  // Find tasks due soon (in the next 7 days)
  const currentDate = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const tasksDueSoon = userTasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= currentDate && dueDate <= nextWeek && task.status !== 'completed';
  });

  // Find recent tasks (created in the last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const recentTasks = userTasks
    .filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate >= lastWeek;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's an overview of your tasks.
          </p>
        </div>
        <Button onClick={() => navigate('/tasks/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Task Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.review} in review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((taskStats.completed / taskStats.total) * 100) || 0}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.todo} tasks to do
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tasks Due Soon & Recent Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tasks Due Soon</CardTitle>
            <CardDescription>
              Tasks that need your attention in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksDueSoon.length > 0 ? (
              <div className="space-y-4">
                {tasksDueSoon.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(task.dueDate!).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No tasks due in the next 7 days
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Tasks that were recently created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No tasks created in the last 7 days
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
