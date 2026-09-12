import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { 
  FiUser, 
  FiShoppingBag, 
  FiMapPin, 
  FiHeart, 
  FiCreditCard, 
  FiSettings, 
  FiLogOut, 
  FiCalendar, 
  FiGift, 
  FiCheckCircle,
  FiChevronDown,
  FiX
} from 'react-icons/fi';

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redux state
  const { user, loading: authLoading, error: authError, successMsg: authSuccessMsg } = useSelector((state) => state.auth || {});
  const { items: allOrders = [] } = useSelector((state) => state.orders || {});

  // Tab State (defaults to 'profile', or uses ?tab=... parameter)
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    phone: '',
    gender: 'Female'
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  // Sync profile when Redux user updates
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dob: user.dob || '',
        phone: user.phone || '',
        gender: user.gender || 'Female'
      });
    }
  }, [user]);

  // Load profile and orders on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserProfile());
    dispatch(fetchOrders());
  }, [dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLocalSuccess('');
    setLocalError('');

    const resultAction = await dispatch(updateUserProfile({
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: profile.phone.trim(),
      dob: profile.dob,
      gender: profile.gender
    }));

    if (updateUserProfile.fulfilled.match(resultAction)) {
      setLocalSuccess('Your personal details have been updated successfully.');
      setTimeout(() => setLocalSuccess(''), 4000);
    } else {
      setLocalError(resultAction.payload || 'Failed to update personal details.');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const sidebarMenu = [
    { id: 'profile', label: 'My Profile', icon: <FiUser /> },
    { id: 'orders', label: 'My Orders', icon: <FiShoppingBag /> },
    { id: 'addresses', label: 'My Addresses', icon: <FiMapPin /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
    { id: 'payments', label: 'Payment Methods', icon: <FiCreditCard /> },
    { id: 'settings', label: 'Account Settings', icon: <FiSettings /> },
    { id: 'logout', label: 'Logout', icon: <FiLogOut /> }
  ];

  // Filter orders matching current user
  const userOrders = allOrders.filter(o => {
    if (!user) return false;
    const userEmail = user.email?.toLowerCase();
    const userPhone = user.phone?.trim();
    const userName = (user.name || user.firstName || '').toLowerCase().trim();

    const orderEmail = (o.email || o.customerEmail || o.customer?.email || '').toLowerCase();
    const orderPhone = (o.phone || o.customer?.phone || '').trim();
    const orderName = (o.name || o.customer?.name || (typeof o.customer === 'string' ? o.customer : '')).toLowerCase();

    if (userEmail && orderEmail && userEmail === orderEmail) return true;
    if (userPhone && orderPhone && userPhone === orderPhone) return true;
    if (userName && orderName && orderName.includes(userName)) return true;
    return false;
  });

  const getOrderAmount = (o) => {
    if (!o) return 0;
    if (typeof o.total === 'number') return o.total;
    if (typeof o.rawAmount === 'number') return o.rawAmount;
    if (typeof o.totalAmount === 'number') return o.totalAmount;
    if (typeof o.amount === 'number') return o.amount;
    const cleanStr = String(o.amount || o.total || 0).replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  if (authLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px] flex items-center justify-center font-sans text-gray-500 text-xs tracking-wider uppercase font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C6A482] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Account...</span>
        </div>
      </div>
    );
  }

  const activeSuccess = localSuccess || authSuccessMsg;
  const activeError = localError || authError;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">My Account</span>
      </nav>

      {/* Account split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sidebar & info card (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Headshot profile card */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-5 rounded-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-lg font-bold text-[#B07E5D] bg-[#F5ECE1]">
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                Hi, {profile.firstName || 'User'} 👋
              </h2>
              <p className="text-xs text-gray-400 font-light mt-0.5">{profile.email || 'Welcome back!'}</p>
            </div>
          </div>

          {/* Account sidebar navigation menu links */}
          <nav className="bg-[#fbfbfb] border border-gray-100 rounded-sm divide-y divide-gray-100">
            {sidebarMenu.map(menu => {
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => {
                    if (menu.id === 'logout') {
                      handleLogout();
                    } else {
                      setActiveTab(menu.id);
                      document.getElementById('profile-content-panel')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-3.5 text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#F5ECE1]/60 text-gray-950 border-l-[3px] border-black pl-4' 
                      : 'text-gray-500 hover:text-black border-l-[3px] border-transparent'
                  }`}
                >
                  <span className="text-sm text-gray-500">{menu.icon}</span>
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Refer & Earn Banner Card widget */}
          <div className="bg-[#FAF2EC] border border-[#ECD9CB]/40 p-5 rounded-sm relative flex justify-between items-center group">
            <div className="pr-4 text-left z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase mb-1">
                Refer & Earn
              </h3>
              <p className="text-[11px] font-light text-gray-500 leading-normal mb-3 max-w-[140px]">
                Invite your friends and earn exclusive rewards.
              </p>
              <button 
                type="button"
                onClick={() => alert("Referral code copied to clipboard!")}
                className="text-[9px] font-bold uppercase tracking-wider border-b border-black pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors"
              >
                Invite Now →
              </button>
            </div>
            <FiGift className="w-10 h-10 text-[#C6A482] opacity-50 group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Default Address widget card */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-5 rounded-sm text-xs font-light text-gray-600 leading-relaxed text-left">
            <h3 className="font-semibold text-[10px] tracking-widest text-gray-900 uppercase mb-3.5 pb-1.5 border-b border-gray-200/50">
              Default Address
            </h3>
            <span className="font-bold text-gray-900 block mb-1">Delivery Address</span>
            <p>{profile.firstName} {profile.lastName}</p>
            <p>{profile.phone || 'Phone not set'}</p>
            <p>India</p>
          </div>

        </div>

        {/* Right Column: Account main content dashboard panel (9 columns) */}
        <div id="profile-content-panel" className="lg:col-span-9 space-y-8 scroll-mt-28">
          
          {/* Notifications */}
          {activeSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-in">
              <FiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{activeSuccess}</span>
            </div>
          )}

          {activeError && (
            <div className="bg-rose-50 border border-rose-200 rounded-sm p-4 text-xs text-rose-800 font-medium flex items-center gap-2 animate-fade-in">
              <span className="text-rose-600 flex-shrink-0 text-sm">⚠️</span>
              <span>{activeError}</span>
            </div>
          )}

          {/* TAB 1: Profile Tab */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
              <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em] mb-1">
                My Profile
              </h2>
              <p className="text-[11px] text-gray-400 font-light tracking-wide mb-6">Manage your personal information</p>

              <form onSubmit={handleSave} className="space-y-4 text-xs text-gray-700">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      First Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      Last Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email and DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      Email Address (Account ID)
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3.5 px-4 outline-none text-gray-500 font-light tracking-wide cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="dob" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        id="dob"
                        type="text"
                        name="dob"
                        value={profile.dob}
                        onChange={handleInputChange}
                        placeholder="DD / MM / YYYY"
                        className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors"
                      />
                      <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Phone and Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="gender" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                        className="appearance-none w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors cursor-pointer"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="bg-black hover:bg-rose-600 disabled:bg-gray-400 text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300"
                  >
                    {authLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders Tab */}
          {(activeTab === 'orders' || activeTab === 'profile') && (
            <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
              <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-gray-200/50">
                <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em]">
                  My Orders ({userOrders.length})
                </h2>
                {activeTab !== 'orders' && userOrders.length > 0 && (
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
                  >
                    View all
                  </button>
                )}
              </div>

              {userOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <FiShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-600 font-medium">No orders found yet</p>
                  <p className="text-[11px] text-gray-400 mt-1 mb-5">When you place orders, they will appear here with live tracking details.</p>
                  <Link
                    to="/shop"
                    className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors rounded-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-light text-gray-600 min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-200/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">
                        <th className="pb-3.5 font-bold">Order ID</th>
                        <th className="pb-3.5 font-bold">Date</th>
                        <th className="pb-3.5 font-bold">Amount</th>
                        <th className="pb-3.5 font-bold">Status</th>
                        <th className="pb-3.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userOrders.map(order => (
                        <tr key={order._id || order.id} className="align-middle">
                          <td className="py-4 font-semibold text-gray-950">#{order.orderNumber || order.id || order._id?.slice(-6)}</td>
                          <td className="py-4">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                          </td>
                          <td className="py-4 font-semibold text-gray-900">₹{getOrderAmount(order).toLocaleString('en-IN')}</td>
                          <td className="py-4">
                            <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${getStatusBadge(order.status)}`}>
                              {order.status || 'Processing'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="font-semibold text-gray-950 hover:text-rose-600 underline transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm text-center py-12">
              <FiHeart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-600 font-medium">Your Wishlist</p>
              <p className="text-[11px] text-gray-400 mt-1 mb-5">Save items you love to your wishlist and revisit them anytime.</p>
              <Link
                to="/wishlist"
                className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors rounded-sm"
              >
                Go to Wishlist Page
              </Link>
            </div>
          )}

          {/* TAB 4: Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
              <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em] mb-4">
                Saved Addresses
              </h2>
              <div className="border border-gray-200 rounded-sm p-4 bg-white text-xs space-y-1">
                <span className="font-bold text-gray-900 uppercase tracking-wider text-[10px] block">Primary Address</span>
                <p className="font-medium text-gray-800">{profile.firstName} {profile.lastName}</p>
                <p className="text-gray-500">{profile.phone}</p>
                <p className="text-gray-500">India</p>
              </div>
            </div>
          )}

          {/* TAB 5: Payment Methods */}
          {activeTab === 'payments' && (
            <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm text-center py-12">
              <FiCreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-600 font-medium">Payment Methods</p>
              <p className="text-[11px] text-gray-400 mt-1">UPI, NetBanking, Credit/Debit Cards, and Cash on Delivery are accepted securely during checkout.</p>
            </div>
          )}

        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Order #{selectedOrder.orderNumber || selectedOrder.id || selectedOrder._id?.slice(-6)}
                </h3>
                <span className="text-[10px] text-gray-400">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-IN') : 'Recent'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between py-1 border-b">
                <span>Status</span>
                <span className={`font-semibold px-2 py-0.5 rounded-sm border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status || 'Processing'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Total Amount</span>
                <span className="font-bold text-gray-900">₹{getOrderAmount(selectedOrder).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Payment Method</span>
                <span className="capitalize">{selectedOrder.payment?.method || selectedOrder.payment || selectedOrder.paymentMethod || 'Online'}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Payment Status</span>
                <span className="font-semibold text-emerald-700">{selectedOrder.paymentStatus || 'Paid'}</span>
              </div>
              {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-gray-700 block mb-2">Order Items:</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-1 px-2 bg-gray-50 rounded-sm">
                        <span>{it.name} (x{it.qty || it.quantity || 1})</span>
                        <span className="font-medium">₹{Number(it.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-rose-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Account;
