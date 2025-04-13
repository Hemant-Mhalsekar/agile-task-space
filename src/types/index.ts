
export type UserRole = 'admin' | 'member';

export type TeamMemberRole = 
  | 'software developer' 
  | 'frontend developer' 
  | 'backend developer' 
  | 'ui designer' 
  | 'ux designer' 
  | 'project manager' 
  | 'qa engineer' 
  | 'devops engineer' 
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamRole?: TeamMemberRole;
  avatar?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string | null; // User ID
  creator: string; // User ID
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
