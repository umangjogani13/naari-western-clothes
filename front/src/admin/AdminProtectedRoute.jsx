import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/slices/authSlice';

const ALLOWED_ADMIN_ROLES = ['Admin', 'Super Admin', 'Manager', 'Editor'];

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth || {});

  const storedToken = localStorage.getItem('token');

  // Fetch profile if token exists but user object is not yet loaded in Redux
  useEffect(() => {
    if (storedToken && !user && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, storedToken, user, loading]);

  // If no token exists at all, redirect to admin login
  if (!storedToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If token exists and we are actively fetching user profile
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#C6A482] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-gray-700">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // If user object is loaded, check role permissions
  if (user && !ALLOWED_ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-sm shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="font-serif text-xl font-normal text-gray-900 uppercase tracking-wider mb-2">
            Access Restricted
          </h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
            Your current account does not have administrative privileges to access this area.
          </p>
          <div className="flex flex-col gap-2">
            <Navigate to="/admin/login" replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
