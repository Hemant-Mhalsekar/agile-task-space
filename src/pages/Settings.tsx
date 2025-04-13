
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Shield, 
  Briefcase, 
  Bell, 
  Lock, 
  Pencil,
  Upload,
  Palette
} from 'lucide-react';
import { RequireAuth } from '@/components/RequireAuth';
import { AddUserDialog } from '@/components/AddUserDialog';
import { ActivityLogCard } from '@/components/ActivityLogCard';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { TeamMemberRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    teamRole: 'project manager',
    status: 'active'
  },
  {
    id: '2',
    name: 'Team Member',
    email: 'member@example.com',
    role: 'member',
    teamRole: 'frontend developer',
    status: 'active'
  }
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const { toast } = useToast();
  
  if (!user) return null;

  const handleUserAdded = () => {
    console.log('User added, refreshing user list');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTeamRole = (role: string) => {
    return role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    });
  };

  return (
    <RequireAuth allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your Zidio Task Space settings
          </p>
        </div>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Team</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your team members and their access
                    </CardDescription>
                  </div>
                  <AddUserDialog onUserAdded={handleUserAdded} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Team Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>{formatTeamRole(user.teamRole)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workspace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>
                  Customize your Zidio Task Space preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input id="workspace-name" defaultValue="Zidio Task Space" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workspace-description">Workspace Description</Label>
                  <Input id="workspace-description" defaultValue="Team task management workspace" />
                </div>
                
                <div className="border rounded p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Workspace Logo</h3>
                      <p className="text-sm text-muted-foreground">Upload your team or company logo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Workspace Theme</h3>
                      <p className="text-sm text-muted-foreground">Customize the appearance of your workspace</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Workspace</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow users to join without invitation
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Task Creation by Members</Label>
                    <div className="text-sm text-muted-foreground">
                      Let team members create new tasks
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded p-4 mb-4">
                  <h3 className="text-sm font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Digest</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive a summary of activities at the end of the day
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Task Assignment</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified when tasks are assigned to you
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Task Status Changes</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified when task status changes
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Comments and Mentions</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified when someone comments or mentions you
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded p-4">
                  <h3 className="text-sm font-medium mb-2">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Task Reminders</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive reminders for upcoming tasks
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified about system updates and maintenance
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Team Member Updates</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified when team members join or leave
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password Settings</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button>Update Password</Button>
                </CardContent>
              </Card>
              
              <TwoFactorSetup />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Current Session</div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Chrome on Windows • Last active now
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-md border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Mobile App</div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      iPhone • Last active 2 hours ago
                    </div>
                    <Button size="sm" variant="destructive">Revoke</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6">
            <ActivityLogCard />
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
};

export default Settings;
