import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state) => state.auth || {});
  const hasToken = isAuthenticated || Boolean(token || localStorage.getItem('token'));

  if (!hasToken) {
    // Redirect to /login, saving current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
