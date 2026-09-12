import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../store/slices/notificationSlice';
import { 
  FiMenu, 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiCheck, 
  FiTrash2, 
  FiShoppingBag, 
  FiArchive, 
  FiUsers, 
  FiStar, 
  FiAlertCircle, 
  FiInfo,
  FiExternalLink
} from 'react-icons/fi';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const { items: notifications = [], unreadCount = 0 } = useSelector(
    (state) => state.notifications || {}
  );

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  const adminName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin' : 'Admin';
  const adminEmail = user?.email || 'admin@naari.in';
  const adminRole = user?.role || 'Admin';
  const adminAvatar = user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100';

  const handleSignOut = () => {
    setShowProfileDropdown(false);
    dispatch(logoutUser());
    navigate('/admin/login');
  };

  const handleNavigate = (path) => {
    setShowProfileDropdown(false);
    setShowNotifications(false);
    navigate(path);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markAsRead(notif._id || notif.id));
    }
    if (notif.link) {
      setShowNotifications(false);
      navigate(notif.link);
    }
  };

  const handleMarkAsRead = (e, notifId) => {
    e.stopPropagation();
    dispatch(markAsRead(notifId));
  };

  const handleDeleteNotification = (e, notifId) => {
    e.stopPropagation();
    dispatch(deleteNotification(notifId));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  // Helper for type icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'inventory':
        return <FiArchive className="w-4 h-4 text-amber-600" />;
      case 'customer':
        return <FiUsers className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <FiStar className="w-4 h-4 text-purple-600" />;
      case 'system':
        return <FiAlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <FiInfo className="w-4 h-4 text-[#8C6239]" />;
    }
  };

  // Format relative timestamp
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 backdrop-blur-md transition-all duration-200 bg-white/70 border-b border-[#EAE3DC]/60">
      
      {/* Search Bar & Hamburger */}
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Sidebar Button (Mobile/Tablet) */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-600 rounded-xl lg:hidden hover:bg-gray-100 transition-colors"
          aria-label="Open Sidebar"
        >
          <FiMenu size={22} />
        </button>

        {/* Search Input Box */}
        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <FiSearch size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search products, orders, customers..." 
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F0EEEA]/60 hover:bg-[#F3ECE7]/75 focus:bg-white text-[#1A1A1A] placeholder-gray-400 border border-transparent focus:border-[#EAE3DC] rounded-xl focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-600 rounded-xl hover:bg-[#FDFBF9] hover:text-[#8C6239] transition-all duration-200"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#C18F6B] text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown (Interactive Popover) */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-84 sm:w-96 z-20 origin-top-right rounded-2xl bg-white p-4 shadow-2xl border border-[#EAE3DC] animate-slide-down text-left">
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#1A1A1A]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-medium text-[#8C6239] hover:text-[#704d2c] transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Popover Items List */}
                <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <FiBell className="w-8 h-8 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notif) => {
                      const notifId = notif._id || notif.id;
                      return (
                        <div 
                          key={notifId} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 relative group ${
                            !notif.isRead ? 'bg-[#FDF8F4]/80 hover:bg-[#FDF8F4]' : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Unread Indicator Bar */}
                          {!notif.isRead && (
                            <span className="absolute left-1 top-3.5 w-1.5 h-1.5 rounded-full bg-[#C18F6B]" />
                          )}

                          {/* Category Icon */}
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {getNotificationIcon(notif.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs truncate ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {formatTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                          </div>

                          {/* Actions on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!notif.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, notifId)}
                                className="p-1 text-gray-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                                title="Mark as read"
                              >
                                <FiCheck size={13} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(e, notifId)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Delete notification"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Popover Footer */}
                <div className="border-t border-[#F5ECE5] pt-3 mt-3">
                  <button
                    onClick={() => handleNavigate('/admin/notifications')}
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-[#8C6239] hover:bg-[#FDF8F4] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View All Notifications</span>
                    <FiExternalLink size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#FDFBF9] transition-all duration-200"
          >
            <img 
              src={adminAvatar} 
              alt={adminName} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F5ECE5] border border-gray-100"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[#1A1A1A] leading-tight truncate max-w-[120px]">{adminName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none uppercase tracking-wider">{adminRole}</p>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 mt-3 w-56 z-20 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-[#EAE3DC] animate-slide-down text-left">
                <div className="px-3 py-2.5 border-b border-[#F5ECE5] mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Signed in as</p>
                  <p className="text-xs font-bold text-[#1A1A1A] truncate mt-0.5">{adminEmail}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#F4E9E2] text-[#8C6239]">
                    {adminRole}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleNavigate('/admin/profile')}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-[#FDF8F4] hover:text-[#8C6239] rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiUser className="w-3.5 h-3.5 text-gray-400" />
                  <span>Admin Profile</span>
                </button>

                <button 
                  onClick={() => handleNavigate('/admin/notifications')}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-[#FDF8F4] hover:text-[#8C6239] rounded-lg transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FiBell className="w-3.5 h-3.5 text-gray-400" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => handleNavigate('/admin/settings')}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-[#FDF8F4] hover:text-[#8C6239] rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Store Settings</span>
                </button>

                <div className="border-t border-[#F5ECE5] mt-1 pt-1">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;