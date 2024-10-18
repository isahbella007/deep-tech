// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, RootStateOrAny } from 'react-redux';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state: RootStateOrAny) => state.auth);

  const location = useLocation();
  // console.log('Are you authenticated', isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;