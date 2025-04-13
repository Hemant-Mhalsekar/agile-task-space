
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <TaskProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/tasks"
                  element={
                    <RequireAuth>
                      <Layout>
                        <TaskList />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/tasks/create"
                  element={
                    <RequireAuth>
                      <Layout>
                        <CreateTask />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/tasks/:id"
                  element={
                    <RequireAuth>
                      <Layout>
                        <TaskDetail />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Layout>
                        <Profile />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/settings"
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <Layout>
                        <Settings />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TaskProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
