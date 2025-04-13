
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: Array<string>;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: location } });
    } else if (
      !isLoading && 
      isAuthenticated && 
      user && 
      allowedRoles.length > 0 && 
      !allowedRoles.includes(user.role)
    ) {
      // Redirect to dashboard if authenticated but not authorized
      navigate("/dashboard", { 
        state: { 
          from: location,
          unauthorizedMessage: "You don't have permission to access this page" 
        } 
      });
    }
  }, [isAuthenticated, user, isLoading, navigate, location, allowedRoles]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children
  if (!isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
