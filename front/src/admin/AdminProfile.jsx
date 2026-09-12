import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiShield, FiLock, FiCheck, FiAlertCircle, FiImage, FiCalendar, FiKey, FiLogOut,FiRefreshCw } from 'react-icons/fi';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
];

function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error: authError, successMsg } = useSelector((state) => state.auth || {});

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security' | 'session'

  // Profile Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('');

  // Password Update States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // UI States
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync profile data when Redux user updates
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      setGender(user.gender || 'Female');
      setDob(user.dob || '');
    }
  }, [user]);

  // Load fresh profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLocalSuccess('');
    setLocalError('');
    setSaving(true);

    try {
      const resultAction = await dispatch(updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
        gender,
        dob
      }));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        setLocalSuccess('Admin personal details updated successfully.');
        setTimeout(() => setLocalSuccess(''), 4000);
      } else {
        setLocalError(resultAction.payload || 'Failed to update personal details.');
      }
    } catch (err) {
      setLocalError(err.message || 'Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setLocalSuccess('');
    setLocalError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      const resultAction = await dispatch(updateUserProfile({
        currentPassword,
        newPassword
      }));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        setLocalSuccess('Admin password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setLocalSuccess(''), 4000);
      } else {
        setPasswordError(resultAction.payload || 'Failed to change password. Ensure current password is correct.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Error updating password.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/admin/login');
  };

  const activeMessage = localSuccess || successMsg;
  const activeErrorMessage = localError || authError;

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 font-serif uppercase">
            Admin Profile & Account
          </h1>
          <p className="text-[11px] text-gray-400 font-light mt-0.5">
            Manage your administrative credentials, personal info, and security preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => dispatch(fetchUserProfile())}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-black rounded-lg transition-colors font-medium text-xs"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors font-medium text-xs border border-rose-200/60"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {activeMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 font-medium flex items-center gap-2.5 animate-fade-in shadow-2xs">
          <FiCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{activeMessage}</span>
        </div>
      )}

      {activeErrorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 font-medium flex items-center gap-2.5 animate-fade-in shadow-2xs">
          <FiAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{activeErrorMessage}</span>
        </div>
      )}

      {/* Profile Overview Card Header */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'} 
              alt="Admin Profile Avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#FAF6F0] border border-[#ECD9CB]/80 shadow-sm" 
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-950 font-serif">
                {firstName} {lastName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#F4E9E2] text-[#8C6239] border border-[#ECD9CB]">
                {user?.role || 'Admin'}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-light mt-1 flex items-center gap-2">
              <FiMail className="w-3.5 h-3.5 text-gray-400" />
              <span>{email || 'admin@naari.in'}</span>
            </p>
            <p className="text-[11px] text-gray-400 font-light mt-1 flex items-center gap-2">
              <FiShield className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Privileged Administrator Access · Status: <strong className="text-emerald-700">{user?.status || 'Active'}</strong></span>
            </p>
          </div>
        </div>

        {/* Quick Stats / Account Status */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 text-center md:text-left">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">Member Since</span>
            <span className="text-xs font-bold text-gray-800 mt-0.5 block">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">Security Level</span>
            <span className="text-xs font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <FiCheck className="w-3.5 h-3.5" /> High (256-Bit)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-2 select-none">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'details'
              ? 'border-[#8C6239] text-[#8C6239]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FiUser className="w-4 h-4" />
          <span>Personal Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-[#8C6239] text-[#8C6239]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FiLock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('session')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'session'
              ? 'border-[#8C6239] text-[#8C6239]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FiShield className="w-4 h-4" />
          <span>Roles & Permissions</span>
        </button>
      </div>

      {/* TAB 1: Personal Details */}
      {activeTab === 'details' && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-serif uppercase tracking-wider">
              Edit Administrator Details
            </h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">
              Update your public name, contact email, and profile avatar
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  First Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Last Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                  />
                  <FiMail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                  />
                  <FiPhone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Avatar URL & Presets */}
            <div className="space-y-2">
              <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px] block">
                Avatar Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiImage className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Preset Avatars Selector */}
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block mb-2 font-light">Or pick a preset avatar:</span>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        avatar === url ? 'border-[#8C6239] ring-2 ring-[#ECD9CB] scale-105' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender and DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                  />
                  <FiCalendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-black hover:bg-rose-600 disabled:bg-gray-400 text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-lg transition-all active:scale-[0.99] duration-300 shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-serif uppercase tracking-wider">
              Change Administrator Password
            </h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">
              Keep your administrator account protected by updating your credentials periodically
            </p>
          </div>

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
              <FiAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                Current Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiKey className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                New Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiLock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                Confirm New Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fbfbfb] border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
                <FiLock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-black hover:bg-rose-600 disabled:bg-gray-400 text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-lg transition-all active:scale-[0.99] duration-300 shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Roles & Permissions */}
      {activeTab === 'session' && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-serif uppercase tracking-wider">
              Assigned Permissions & Role Privileges
            </h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">
              Your administrative tier and access level across the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF6F0]/40 rounded-lg border border-[#ECD9CB]/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Assigned Role</span>
              <span className="text-base font-bold text-gray-900 mt-1 block">{user?.role || 'Admin'}</span>
              <span className="text-[10px] text-gray-500 font-light mt-1 block">Full access to orders, products, customers & store settings</span>
            </div>

            <div className="p-4 bg-[#FAF6F0]/40 rounded-lg border border-[#ECD9CB]/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Session Token Status</span>
              <span className="text-base font-bold text-emerald-700 mt-1 block flex items-center gap-1">
                <FiCheck className="w-4 h-4" /> Valid & Authenticated
              </span>
              <span className="text-[10px] text-gray-500 font-light mt-1 block">JWT token signed with HMAC SHA-256 algorithm</span>
            </div>

            <div className="p-4 bg-[#FAF6F0]/40 rounded-lg border border-[#ECD9CB]/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Account Status</span>
              <span className="text-base font-bold text-gray-900 mt-1 block">{user?.status || 'Active'}</span>
              <span className="text-[10px] text-gray-500 font-light mt-1 block">Account verified and unrestricted</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
              Included Administrator Capabilities:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Catalog CRUD (Products, Categories, Inventory)</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Order Management (Status changes, Invoicing)</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer CRM (Directory, Lifetime value, Notes)</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Promotions & Coupons Management</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Storefront CMS (Hero Sliders, Banners, Why Shop)</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Platform Reports, Revenue Analytics & Settings</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProfile;
