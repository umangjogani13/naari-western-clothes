import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, clearAuthError } from '../store/slices/authSlice';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield, FiArrowLeft,FiCheckCircle,FiAlertCircle } from 'react-icons/fi';

const ALLOWED_ADMIN_ROLES = ['Admin', 'Super Admin', 'Manager', 'Editor'];

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth || {});

  // If already authenticated with admin role, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user && ALLOWED_ADMIN_ROLES.includes(user.role)) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Clear errors on mount or input change
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    const result = await dispatch(adminLogin({ 
      email: email.trim(), 
      password 
    }));

    if (adminLogin.fulfilled.match(result)) {
      const targetUser = result.payload.user;
      if (targetUser && ALLOWED_ADMIN_ROLES.includes(targetUser.role)) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@naari.in');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between select-none font-sans text-left relative overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ECD9CB]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C6A482]/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Top Bar Header */}
      <header className="px-6 py-6 sm:px-12 flex justify-between items-center z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
        
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8C6239] bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EAE3DC] shadow-2xs">
          <FiShield className="w-3.5 h-3.5 text-[#8C6239]" />
          <span>Secure Admin Portal</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-white border border-gray-100/80 rounded-sm shadow-xl p-8 sm:p-10 relative">
          
          {/* Logo & Subtitle */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C6239] mx-auto mb-4 border border-[#ECD9CB]/60">
              <FiShield className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-[0.18em] text-gray-950 uppercase">
              NAARI ADMIN
            </h1>
            <p className="text-[11px] text-gray-400 font-light tracking-widest uppercase mt-1">
              Management & Control Center
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Helper */}
          <div 
            onClick={handleAutofillDemo}
            className="mb-6 p-3 bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] border border-[#ECD9CB]/50 rounded-sm cursor-pointer transition-colors group flex items-center justify-between"
            title="Click to autofill administrator credentials"
          >
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-[#8C6239]" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800 block">
                  Quick Admin Access
                </span>
                <span className="text-[9px] text-gray-500 font-mono">
                  admin@naari.in · Admin@123
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6239] group-hover:underline">
              Auto-fill →
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center gap-2.5 animate-fade-in">
              <FiAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-gray-700">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@naari.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-sm py-3.5 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiMail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="admin-password" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Password <span className="text-rose-600">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-sm py-3.5 pl-10 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiLock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Notice */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-black w-3.5 h-3.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 font-light">
                  Stay signed in for 7 days
                </span>
              </label>
              <span className="text-[10px] text-gray-400 font-light">
                Encrypted Session
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-rose-600 disabled:bg-gray-400 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm transition-all active:scale-[0.99] duration-300 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Footer Notice */}
      <footer className="py-6 text-center text-[10px] text-gray-400 font-light tracking-wider uppercase z-10">
        © {new Date().getFullYear()} Naari Western Clothes · Internal Administrative Portal
      </footer>

    </div>
  );
}

export default AdminLogin;
