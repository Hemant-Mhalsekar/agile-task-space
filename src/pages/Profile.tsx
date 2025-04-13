
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ListTodo
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TaskStatus } from '@/types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  
  if (!user) return null;

  // Get user's tasks
  const userTasks = tasks.filter(task => task.assignee === user.id || task.creator === user.id);
  
  // Calculate task statistics
  const totalTasks = userTasks.length;
  const tasksCreated = userTasks.filter(task => task.creator === user.id).length;
  const tasksAssigned = userTasks.filter(task => task.assignee === user.id).length;
  
  // Group tasks by status
  const tasksByStatus = {
    todo: userTasks.filter(task => task.status === 'todo').length,
    inProgress: userTasks.filter(task => task.status === 'in-progress').length,
    review: userTasks.filter(task => task.status === 'review').length,
    completed: userTasks.filter(task => task.status === 'completed').length,
  };
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((tasksByStatus.completed / totalTasks) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View your profile information and task statistics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xl">
                {user.name.charAt(0)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.name}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Role</div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
            <CardDescription>
              Summary of your task activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-2xl font-bold">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-2xl font-bold">{tasksCreated}</div>
                <div className="text-sm text-muted-foreground">Tasks Created</div>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-2xl font-bold">{tasksAssigned}</div>
                <div className="text-sm text-muted-foreground">Tasks Assigned</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">
                  Completion Rate
                </div>
                <div className="text-sm font-medium">
                  {completionRate}%
                </div>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <Separator />
            
            <div>
              <div className="text-sm font-medium mb-4">Task Status Breakdown</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <ListTodo className="h-4 w-4 mr-2 text-slate-600" />
                      <span className="text-sm">To Do</span>
                    </div>
                    <div className="text-sm">{tasksByStatus.todo}</div>
                  </div>
                  <Progress value={(tasksByStatus.todo / totalTasks) * 100 || 0} className="h-2 bg-slate-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="text-sm">{tasksByStatus.inProgress}</div>
                  </div>
                  <Progress value={(tasksByStatus.inProgress / totalTasks) * 100 || 0} className="h-2 bg-blue-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                      <span className="text-sm">Review</span>
                    </div>
                    <div className="text-sm">{tasksByStatus.review}</div>
                  </div>
                  <Progress value={(tasksByStatus.review / totalTasks) * 100 || 0} className="h-2 bg-amber-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-sm">{tasksByStatus.completed}</div>
                  </div>
                  <Progress value={(tasksByStatus.completed / totalTasks) * 100 || 0} className="h-2 bg-green-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
