import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
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
  FiChevronDown
} from 'react-icons/fi';

// Dummy Order History Database
const ORDERS_HISTORY = [
  {
    id: "LV24507",
    date: "May 16, 2024",
    amount: 2507,
    status: "Delivered",
    statusColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
    items: [
      { name: "Wide Leg Jeans (Blue / M)", price: 1999, qty: 1 },
      { name: "Basic Rib Top (Cream / S)", price: 599, qty: 1 }
    ]
  },
  {
    id: "LV24321",
    date: "May 05, 2024",
    amount: 1899,
    status: "Shipped",
    statusColor: "bg-blue-50 text-blue-800 border-blue-100",
    items: [
      { name: "Denim Jacket (Medium Blue / L)", price: 1899, qty: 1 }
    ]
  },
  {
    id: "LV24102",
    date: "Apr 22, 2024",
    amount: 3299,
    status: "Delivered",
    statusColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
    items: [
      { name: "Satin Midi Dress (Wine / M)", price: 2299, qty: 1 },
      { name: "Linen Shirt (Cream / L)", price: 1000, qty: 1 }
    ]
  },
  {
    id: "LV23911",
    date: "Apr 10, 2024",
    amount: 1249,
    status: "Cancelled",
    statusColor: "bg-rose-50 text-rose-800 border-rose-100",
    items: [
      { name: "Pleated Skirt (Camel / XS)", price: 1249, qty: 1 }
    ]
  }
];

// 3 Wishlist preview items
const WISHLIST_PREVIEW = [
  {
    id: 2,
    name: "Satin Midi Dress",
    price: 2299,
    image: "/images/prod_dress.jpg"
  },
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    price: 1499,
    image: "/images/prod_shirt.jpg"
  },
  {
    id: 4,
    name: "Wide Leg Jeans",
    price: 1999,
    image: "/images/prod_jeans.jpg"
  }
];

function Account() {
  const navigate = useNavigate();
  // Sidebar active tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile forms state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    phone: '',
    gender: ''
  });
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const data = await axiosClient.get('/auth/profile');
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          dob: data.dob || '',
          phone: data.phone || '',
          gender: data.gender || 'Female'
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        // If token is invalid or expired
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setErrorMsg('Failed to load user profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await axiosClient.put('/auth/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        dob: profile.dob,
        gender: profile.gender
      });
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccessMsg('Your personal details have been updated successfully.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Profile update error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update personal details.');
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px] flex items-center justify-center font-sans text-gray-500 text-xs tracking-wider uppercase font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C6A482] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">My Account</span>
      </nav>

      {/* Account split grid layout (Desktop split, Mobile stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sidebar & default info card (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Circular headshot profile card */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-5 rounded-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
              <img src="/images/promo_look.jpg" alt="Aashi Shah Avatar" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                Hi, {profile.firstName || 'User'} 👋
              </h2>
              <p className="text-xs text-gray-400 font-light mt-0.5">Welcome back!</p>
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
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/');
                    } else {
                      setActiveTab(menu.id);
                      // Scroll right panel into view on mobile
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
              <button className="text-[9px] font-bold uppercase tracking-wider border-b border-black pb-0.5 hover:text-rose-600 hover:border-rose-600 transition-colors">
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
            <span className="font-bold text-gray-900 block mb-1">Home</span>
            <p>{profile.firstName} {profile.lastName}</p>
            <p>123, Green Park Society</p>
            <p>Vesu, Surat, Gujarat - 395007</p>
            <p>India</p>
            <p className="mt-1">{profile.phone}</p>
            <div className="flex gap-4 mt-4 pt-3.5 border-t border-gray-100 text-[10px] font-semibold uppercase tracking-wider">
              <button className="text-gray-900 hover:text-rose-600 transition-colors">Edit</button>
              <button className="text-gray-400 hover:text-black transition-colors">Add New Address</button>
            </div>
          </div>

        </div>

        {/* Right Column: Account main content dashboard panel (9 columns) */}
        <div id="profile-content-panel" className="lg:col-span-9 space-y-8 scroll-mt-28">
          
          {/* Alert Success message */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-sm p-4 text-xs text-emerald-800 font-light flex items-start gap-3 animate-fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>{successMsg}</div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-sm p-4 text-xs text-rose-800 font-light flex items-start gap-3 animate-fade-in">
              <span className="text-rose-600 flex-shrink-0 text-sm">⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Widget 1: Personal Profile details card */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
            <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em] mb-1">
              My Profile
            </h2>
            <p className="text-[11px] text-gray-400 font-light tracking-wide mb-6">Manage your personal information</p>

            <form onSubmit={handleSave} className="space-y-4 text-xs text-gray-700">
              {/* Grid 2 Column fields */}
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

              {/* Grid 2 Column fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
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

              {/* Grid 2 Column fields */}
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
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>

              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>

          {/* Widget 2: Order History Table */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-gray-200/50">
              <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em]">
                My Orders
              </h2>
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
              >
                View all
              </button>
            </div>

            {/* Responsive Table Wrapper */}
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
                  {ORDERS_HISTORY.map(order => (
                    <tr key={order.id} className="align-middle">
                      <td className="py-4 font-semibold text-gray-950">#{order.id}</td>
                      <td className="py-4">{order.date}</td>
                      <td className="py-4 font-semibold text-gray-900">₹{order.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${order.statusColor}`}>
                          {order.status}
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
          </div>

          {/* Widget 3: Wishlist Preview Grid */}
          <div className="bg-[#fbfbfb] border border-gray-100 p-6 sm:p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-gray-200/50">
              <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em]">
                Wishlist (3)
              </h2>
              <Link 
                to="/wishlist"
                className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
              >
                View all
              </Link>
            </div>

            {/* Small 3-column Grid preview layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {WISHLIST_PREVIEW.map(item => (
                <div key={item.id} className="group flex flex-col border border-gray-100/50 bg-white rounded-sm overflow-hidden p-2.5 relative">
                  
                  {/* Image container thumbnail */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-300" />
                  </div>

                  {/* Metadata */}
                  <h3 className="text-xs font-semibold text-gray-900 truncate tracking-wide hover:text-rose-600 transition-colors mb-1">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <span className="text-xs font-semibold text-gray-950">₹{item.price.toLocaleString()}</span>
                  
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* View Details Order Modal pop-up overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-sm w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 transition-colors"
              aria-label="Close details"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="font-serif text-base uppercase tracking-widest text-gray-950 mb-1">
              Order Details
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-4">
              Order ID #{selectedOrder.id} <span className="mx-1">·</span> {selectedOrder.date}
            </p>

            <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-3 mb-4 text-xs font-light text-gray-600">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2.5">
                  <div>
                    <span className="font-medium text-gray-900 block">{item.name}</span>
                    <span className="text-[10px] text-gray-400">Qty: {item.qty}</span>
                  </div>
                  <span className="font-semibold text-gray-950">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold uppercase tracking-wider text-gray-400">Total Paid</span>
              <span className="text-lg font-bold text-gray-950">₹{selectedOrder.amount.toLocaleString()}</span>
            </div>

            <button 
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 text-center mt-6 rounded-sm transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Account;
