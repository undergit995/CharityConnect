import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import AuthLoader from '../commonComponents/AuthLoader';



export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  redirectPath = '/auth/login',
}) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return <AuthLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      hasRole(role.toLowerCase()) || 
      (user?.role && user.role.toLowerCase() === role.toLowerCase())
    );
    
    if (!hasRequiredRole) {
      console.warn(`🛑 Access Denied: User role "${user?.role}" does not match required roles:`, requiredRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children || <Outlet />;
};


export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const CharityRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'charity']}>
    {children}
  </ProtectedRoute>
);

export const DonorRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'charity', 'donor']}>
    {children}
  </ProtectedRoute>
);