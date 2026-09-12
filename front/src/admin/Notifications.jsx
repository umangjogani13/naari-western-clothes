import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markAsRead,
  toggleReadStatus,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  setSelectedNotification,
  clearSelectedNotification
} from '../store/slices/notificationSlice';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiShoppingBag,
  FiArchive,
  FiUsers,
  FiStar,
  FiAlertCircle,
  FiInfo,
  FiExternalLink,
  FiEye,
  FiX
} from 'react-icons/fi';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: notifications = [],
    unreadCount = 0,
    loading = false,
    selectedNotification
  } = useSelector((state) => state.notifications || {});

  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, order, inventory, customer, system
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClearModal, setConfirmClearModal] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleToggleStatus = (e, notif) => {
    e.stopPropagation();
    dispatch(toggleReadStatus({ id: notif._id || notif.id, isRead: !notif.isRead }));
  };

  const handleDelete = (e, notifId) => {
    e.stopPropagation();
    dispatch(deleteNotification(notifId));
  };

  const handleClearAll = (filterType) => {
    dispatch(clearAllNotifications(filterType));
    setConfirmClearModal(false);
  };

  const handleOpenDetails = (notif) => {
    if (!notif.isRead) {
      dispatch(markAsRead(notif._id || notif.id));
    }
    dispatch(setSelectedNotification(notif));
  };

  const handleNavigateLink = (link) => {
    if (link) {
      dispatch(clearSelectedNotification());
      navigate(link);
    }
  };

  // Filter and search notifications
  const filteredNotifications = notifications.filter((notif) => {
    // Filter tab
    if (activeFilter === 'unread' && notif.isRead) return false;
    if (['order', 'inventory', 'customer', 'system', 'review'].includes(activeFilter)) {
      if (notif.type !== activeFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title?.toLowerCase().includes(q);
      const matchMsg = notif.message?.toLowerCase().includes(q);
      const matchMeta = JSON.stringify(notif.metadata || {}).toLowerCase().includes(q);
      return matchTitle || matchMsg || matchMeta;
    }

    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'inventory':
        return <FiArchive className="w-5 h-5 text-amber-600" />;
      case 'customer':
        return <FiUsers className="w-5 h-5 text-emerald-600" />;
      case 'review':
        return <FiStar className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <FiAlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <FiInfo className="w-5 h-5 text-[#8C6239]" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-rose-100 text-rose-700">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-100 text-amber-800">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-blue-100 text-blue-700">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-gray-100 text-gray-600">Standard</span>;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const readCount = notifications.filter((n) => n.isRead).length;

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3DC]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Notifications Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#C18F6B] text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Real-time administrative alerts, automated orders, inventory levels, and system updates.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EAE3DC] text-gray-700 hover:bg-[#FDFBF9] hover:text-[#8C6239] transition-all duration-200 shadow-2xs cursor-pointer font-medium"
            title="Refresh notifications"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#8C6239]' : ''}`} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8C6239] text-white hover:bg-[#704d2c] transition-all duration-200 shadow-sm cursor-pointer font-semibold"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => setConfirmClearModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all duration-200 shadow-2xs cursor-pointer font-medium"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear...</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total Alerts</p>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">{notifications.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8C6239]">
            <FiBell size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Unread Items</p>
            <h3 className="text-2xl font-serif font-bold text-[#C18F6B] mt-0.5">{unreadCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiAlertCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Archived / Read</p>
            <h3 className="text-2xl font-serif font-bold text-emerald-700 mt-0.5">{readCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiCheckCircle size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#EAE3DC] shadow-xs">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'order', label: 'Orders' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'customer', label: 'Customers' },
            { id: 'review', label: 'Reviews' },
            { id: 'system', label: 'System' }
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#8C6239] text-white shadow-xs'
                    : 'bg-[#F0EEEA]/60 hover:bg-[#F3ECE7] text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-64 shrink-0">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F0EEEA]/60 focus:bg-white border border-transparent focus:border-[#EAE3DC] rounded-xl focus:outline-none transition-all duration-200 text-gray-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] shadow-xs overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto mb-3 text-[#8C6239]">
              <FiBell size={24} />
            </div>
            <h3 className="font-serif text-base text-gray-800 font-semibold mb-1">
              No notifications found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `No alerts match your search query "${searchQuery}".`
                : 'There are no notifications under this filter category.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notif) => {
              const notifId = notif._id || notif.id;
              const isUnread = !notif.isRead;

              return (
                <div
                  key={notifId}
                  onClick={() => handleOpenDetails(notif)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150 cursor-pointer ${
                    isUnread ? 'bg-[#FDF8F4]/80 hover:bg-[#FDF8F4]' : 'hover:bg-gray-50/80'
                  }`}
                >
                  {/* Left: Icon & Text Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Category Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Text Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#C18F6B]" title="Unread alert" />
                        )}
                        <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                          {notif.type}
                        </span>
                        {getPriorityBadge(notif.priority)}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                        <span>{formatDateTime(notif.createdAt)}</span>
                        {notif.readAt && (
                          <span className="text-emerald-600 font-medium">
                            Read on {formatDateTime(notif.readAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenDetails(notif)}
                      className="p-2 text-gray-500 hover:text-[#8C6239] rounded-xl hover:bg-[#FAF6F0] transition-colors"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </button>

                    <button
                      onClick={(e) => handleToggleStatus(e, notif)}
                      className={`p-2 rounded-xl transition-colors ${
                        isUnread
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={isUnread ? 'Mark as read' : 'Mark as unread'}
                    >
                      <FiCheck size={15} />
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, notifId)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Delete alert"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE3DC] space-y-4 animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center shrink-0">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-gray-900 leading-tight">
                    {selectedNotification.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      {selectedNotification.type}
                    </span>
                    {getPriorityBadge(selectedNotification.priority)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(clearSelectedNotification())}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 py-1">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Message</p>
                <p className="text-xs text-gray-800 leading-relaxed mt-1 bg-[#FAF6F0]/60 p-3 rounded-xl border border-[#EAE3DC]/60">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Metadata Details (if present) */}
              {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    Associated Details
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 grid grid-cols-2 gap-2 text-[11px]">
                    {Object.entries(selectedNotification.metadata).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                        <span className="font-semibold text-gray-800">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-[10px] text-gray-400 space-y-0.5 pt-1">
                <div>Created: {formatDateTime(selectedNotification.createdAt)}</div>
                {selectedNotification.readAt && (
                  <div>Marked Read: {formatDateTime(selectedNotification.readAt)}</div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleToggleStatus(e, selectedNotification)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#EAE3DC] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <FiCheck size={13} />
                  <span>{selectedNotification.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                </button>

                <button
                  onClick={(e) => {
                    handleDelete(e, selectedNotification._id || selectedNotification.id);
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <FiTrash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

              {selectedNotification.link && (
                <button
                  onClick={() => handleNavigateLink(selectedNotification.link)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8C6239] text-white hover:bg-[#704d2c] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open Section</span>
                  <FiExternalLink size={13} />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Confirm Clear Modal */}
      {confirmClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              <FiTrash2 />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900">Clear Notifications</h3>
              <p className="text-xs text-gray-500 mt-1">
                Choose whether to delete only read notifications or purge all alerts completely.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => handleClearAll('read')}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
              >
                Clear Only Read Alerts
              </button>
              <button
                onClick={() => handleClearAll('all')}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Purge All Notifications
              </button>
              <button
                onClick={() => setConfirmClearModal(false)}
                className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notifications;
