import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow STAFF, DEPARTMENT_HEAD, and legacy ADMIN to access admin routes
  const allowedRoles = ['STAFF', 'DEPARTMENT_HEAD', 'ADMIN'];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or show an 'Unauthorized' page
  }

  return <Outlet />;
};

export default AdminRoute;
