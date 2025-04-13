
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Settings as SettingsIcon,
  AlertCircle
} from 'lucide-react';

type ActivityType = 'login' | 'logout' | 'user_added' | 'settings_changed' | 'security_alert';

interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  timestamp: string;
  details?: string;
}

// Mock activity data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'login',
    user: 'Admin User',
    timestamp: '2023-09-15T08:30:00Z',
    details: 'Logged in from Chrome on Windows'
  },
  {
    id: '2',
    type: 'user_added',
    user: 'Admin User',
    timestamp: '2023-09-14T15:45:00Z',
    details: 'Added new team member: John Doe'
  },
  {
    id: '3',
    type: 'settings_changed',
    user: 'Admin User',
    timestamp: '2023-09-13T11:20:00Z',
    details: 'Updated workspace name'
  },
  {
    id: '4',
    type: 'security_alert',
    user: 'System',
    timestamp: '2023-09-12T19:15:00Z',
    details: 'Failed login attempt for admin@example.com'
  },
  {
    id: '5',
    type: 'logout',
    user: 'Team Member',
    timestamp: '2023-09-12T17:30:00Z'
  }
];

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'login':
      return <LogIn className="h-4 w-4 text-green-500" />;
    case 'logout':
      return <LogOut className="h-4 w-4 text-gray-500" />;
    case 'user_added':
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    case 'settings_changed':
      return <SettingsIcon className="h-4 w-4 text-orange-500" />;
    case 'security_alert':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityBadgeClass = (type: ActivityType) => {
  switch (type) {
    case 'login':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'logout':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'user_added':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'settings_changed':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'security_alert':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const ActivityLogCard: React.FC = () => {
  const [activities] = React.useState<Activity[]>(MOCK_ACTIVITIES);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          System and user activity log
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-md bg-accent/20">
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{activity.user}</p>
                  <Badge variant="outline" className={getActivityBadgeClass(activity.type)}>
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
                {activity.details && (
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
