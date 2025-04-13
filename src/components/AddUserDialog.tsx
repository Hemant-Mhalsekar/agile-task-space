
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TeamMemberRole } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  role: z.enum(['admin', 'member']),
  teamRole: z.enum([
    'software developer',
    'frontend developer',
    'backend developer',
    'ui designer',
    'ux designer',
    'project manager',
    'qa engineer',
    'devops engineer',
    'other',
  ]),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  permissions: z.object({
    createTasks: z.boolean().default(true),
    assignTasks: z.boolean().default(true),
    viewAllTasks: z.boolean().default(true),
    editWorkspace: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
  }),
  sendInvitation: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const teamRoles: TeamMemberRole[] = [
  'software developer',
  'frontend developer',
  'backend developer',
  'ui designer',
  'ux designer',
  'project manager',
  'qa engineer',
  'devops engineer',
  'other',
];

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ onUserAdded }) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'member',
      teamRole: 'software developer',
      password: '',
      permissions: {
        createTasks: true,
        assignTasks: true,
        viewAllTasks: true,
        editWorkspace: false,
        manageUsers: false,
      },
      sendInvitation: true,
    },
  });

  React.useEffect(() => {
    // Update permissions based on role
    const role = form.watch('role');
    if (role === 'admin') {
      form.setValue('permissions.editWorkspace', true);
      form.setValue('permissions.manageUsers', true);
    }
  }, [form.watch('role')]);

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real app, this would call an API endpoint to create the user
      console.log('Creating user:', data);
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "User added successfully",
        description: `${data.name} has been added as a ${data.teamRole}.`,
      });
      
      form.reset();
      setOpen(false);
      onUserAdded();
    } catch (error) {
      toast({
        title: "Failed to add user",
        description: "There was an error adding the user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team. They will receive an email with login instructions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Permissions</h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="permissions.createTasks"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="cursor-pointer">Create Tasks</FormLabel>
                        <FormDescription>Can create new tasks</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.assignTasks"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="cursor-pointer">Assign Tasks</FormLabel>
                        <FormDescription>Can assign tasks to team members</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.viewAllTasks"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="cursor-pointer">View All Tasks</FormLabel>
                        <FormDescription>Can view tasks from all team members</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.editWorkspace"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.watch('role') === 'admin'}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="cursor-pointer">Edit Workspace</FormLabel>
                        <FormDescription>Can modify workspace settings</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.manageUsers"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.watch('role') === 'admin'}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="cursor-pointer">Manage Users</FormLabel>
                        <FormDescription>Can add, edit, and remove users</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="sendInvitation"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="cursor-pointer">Send invitation email</FormLabel>
                    <FormDescription>The user will receive login instructions</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Add Team Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
