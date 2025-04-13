
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex h-16 items-center px-4 border-b">
            <SidebarTrigger />
            <div className="ml-4 font-semibold">Zidio Task Space</div>
            <div className="ml-auto flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
