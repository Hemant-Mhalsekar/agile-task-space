
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (task: Omit<Task, 'id' | 'creator' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getUserTasks: (userId: string) => Task[];
}

// Mock initial tasks
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Create project plan',
    description: 'Draft the initial project plan with milestones and deliverables',
    assignee: '2',
    creator: '1',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-06-30',
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2023-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Design user interface',
    description: 'Create mockups for the main dashboard',
    assignee: '2',
    creator: '1',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-06-20',
    createdAt: '2023-06-02T09:00:00Z',
    updatedAt: '2023-06-05T14:30:00Z',
  },
  {
    id: '3',
    title: 'Set up development environment',
    description: 'Install and configure necessary tools and dependencies',
    assignee: '1',
    creator: '1',
    status: 'completed',
    priority: 'low',
    dueDate: '2023-06-05',
    createdAt: '2023-06-02T11:00:00Z',
    updatedAt: '2023-06-04T16:45:00Z',
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage or use mock data
    const storedTasks = localStorage.getItem('taskManagerTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(MOCK_TASKS);
      localStorage.setItem('taskManagerTasks', JSON.stringify(MOCK_TASKS));
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const createTask = (taskData: Omit<Task, 'id' | 'creator' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create tasks",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      creator: user.id,
      createdAt: now,
      updatedAt: now,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      )
    );

    toast({
      title: "Task updated",
      description: "Task has been updated successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully",
    });
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.assignee === userId || task.creator === userId);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      getUserTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
