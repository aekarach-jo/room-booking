import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'STAFF') {
    return <Navigate to="/" replace />; // Or show an 'Unauthorized' page
  }

  return <Outlet />;
};

export default StaffRoute;
