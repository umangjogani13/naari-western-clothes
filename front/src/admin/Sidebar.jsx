import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { 
  FiClipboard, 
  FiPackage, 
  FiUser, 
  FiHome, 
  FiLayers, 
  FiTag, 
  FiStar, 
  FiArchive, 
  FiFileText, 
  FiImage, 
  FiSliders,
  FiAward,
  FiHelpCircle,
  FiBarChart2, 
  FiTrendingUp, 
  FiSettings, 
  FiLogOut,
  FiX,
  FiInstagram,
  FiBell
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { unreadCount = 0 } = useSelector((state) => state.notifications || {});

  const handleLogout = (e) => {
    e.preventDefault();
    setIsOpen(false);
    dispatch(logoutUser());
    navigate('/admin/login');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/' || path === '/admin/dashboard') {
      return 'dashboard';
    }
    const parts = path.split('/');
    return parts[parts.length - 1] || 'dashboard';
  };

  const activeTab = getActiveTab();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
    { id: 'notifications', label: 'Notifications', icon: FiBell, path: '/admin/notifications', badge: unreadCount },
    { id: 'orders', label: 'Orders', icon: FiClipboard, path: '/admin/orders' },
    { id: 'products', label: 'Products', icon: FiPackage, path: '/admin/products' },
    { id: 'customers', label: 'Customers', icon: FiUser, path: '/admin/customers' },
    { id: 'categories', label: 'Categories', icon: FiLayers, path: '/admin/categories' },
    { id: 'coupons', label: 'Coupons', icon: FiTag, path: '/admin/coupons' },
    { id: 'reviews', label: 'Reviews', icon: FiStar, path: '/admin/reviews' },
    { id: 'inventory', label: 'Inventory', icon: FiArchive, path: '/admin/inventory' },
    { id: 'blog', label: 'Blog', icon: FiFileText, path: '/admin/blog' },
    { id: 'hero-slider', label: 'Hero Slider', icon: FiSliders, path: '/admin/hero-slider' },
    { id: 'value-props', label: 'Value Props', icon: FiAward, path: '/admin/value-props' },
    { id: 'why-shop', label: 'Why Shop With Us', icon: FiHelpCircle, path: '/admin/why-shop' },
    { id: 'banners', label: 'Banners', icon: FiImage, path: '/admin/banners' },
    { id: 'instagram', label: 'Instagram Feed', icon: FiInstagram, path: '/admin/instagram' },
    { id: 'reports', label: 'Reports', icon: FiBarChart2, path: '/admin/reports' },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/admin/settings' },
    { id: 'users', label: 'Users', icon: FiUser, path: '/admin/users' },
    { id: 'profile', label: 'Admin Profile', icon: FiUser, path: '/admin/profile' },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-56 border-r border-[#EAE3DC] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header (Branding) */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-[#EAE3DC]">
          <Link to="/admin" className="flex flex-col select-none" onClick={() => setIsOpen(false)}>
            <span className="font-serif text-xl font-bold tracking-wider text-[#1A1A1A]">LAVÉRA</span>
            <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-[#8C6239]/80 uppercase mt-0.5">Admin Panel</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
            aria-label="Close Sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#F4E9E2] text-[#8C6239] font-semibold shadow-sm' 
                    : 'text-gray-500 hover:bg-[#FDFBF9] hover:text-[#8C6239]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-[#8C6239]' : 'text-gray-400 group-hover:text-[#8C6239]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#C18F6B] text-white leading-none shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Support & Logout Section */}
        <div className="p-3 border-t border-[#EAE3DC] space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 hover:bg-rose-50/50 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <FiLogOut size={16} className="text-gray-400 group-hover:text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;