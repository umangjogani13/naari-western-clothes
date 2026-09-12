import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { 
  FiSearch, 
  FiHeart, 
  FiUser, 
  FiShoppingBag, 
  FiMenu, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiLogOut,
  FiShield,
  FiChevronDown
} from 'react-icons/fi';

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999 | EASY 7-DAY RETURNS",
  "NEW SEASON COLLECTION IS NOW LIVE | SHOP THE LATEST",
  "EXTRA 10% OFF ON YOUR FIRST ORDER | USE CODE: NAARI10",
  "FREE SHIPPING ON ALL PREPAID ORDERS"
];

function Header() {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const accountDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});

  const totalCartCount = cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
  const totalWishlistCount = wishlistItems.length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll announcements every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prevIndex) => (prevIndex + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevAnnouncement = () => {
    setAnnouncementIndex((prevIndex) => 
      prevIndex === 0 ? ANNOUNCEMENTS.length - 1 : prevIndex - 1
    );
  };

  const nextAnnouncement = () => {
    setAnnouncementIndex((prevIndex) => (prevIndex + 1) % ANNOUNCEMENTS.length);
  };

  // Detect scroll to style header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsAccountDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'New In', href: '/shop', isSale: false },
    { name: 'Clothing', href: '/shop', isSale: false },
    { name: 'Dresses', href: '/category/dresses', isSale: false },
    { name: 'Tops', href: '/category/tops', isSale: false },
    { name: 'Bottoms', href: '/category/bottoms', isSale: false },
    { name: 'Co-Ords', href: '/category/co-ords', isSale: false },
    { name: 'Sale', href: '/shop', isSale: true },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 font-sans">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2.5 px-4 relative flex items-center justify-between text-center select-none overflow-hidden h-[38px]">
        <button 
          onClick={prevAnnouncement} 
          className="text-white hover:text-rose-500 transition-colors duration-200 focus:outline-none"
          aria-label="Previous announcement"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex-1 overflow-hidden relative h-full flex items-center justify-center">
          {ANNOUNCEMENTS.map((announcement, index) => (
            <span
              key={index}
              className={`absolute text-[10px] sm:text-xs font-semibold tracking-[0.18em] transition-all duration-700 ease-in-out whitespace-nowrap ${
                index === announcementIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {announcement}
            </span>
          ))}
        </div>

        <button 
          onClick={nextAnnouncement} 
          className="text-white hover:text-rose-500 transition-colors duration-200 focus:outline-none"
          aria-label="Next announcement"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full bg-white transition-all duration-300 border-b border-gray-100 ${
        isScrolled 
          ? 'py-3 shadow-md shadow-black/5 bg-white/95 backdrop-blur-md' 
          : 'py-5 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile: Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-900 hover:text-rose-600 transition-colors duration-200 focus:outline-none"
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link 
              to="/" 
              className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.2em] text-gray-950 hover:text-rose-600 transition-colors duration-300 inline-block uppercase"
            >
              Lavéra
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 relative py-2 group ${
                  link.isSale 
                    ? 'text-rose-600 hover:text-rose-700' 
                    : 'text-gray-900 hover:text-rose-600'
                }`}
              >
                {link.name}
                {/* Micro-interaction: animated underline */}
                <span className={`absolute bottom-0 left-0 w-full h-[1.5px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  link.isSale ? 'bg-rose-600' : 'bg-black'
                }`} />
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-900 hover:text-rose-600 transition-all duration-300 hover:scale-105 focus:outline-none cursor-pointer"
              aria-label="Search"
            >
              {isSearchOpen ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:inline-block text-gray-900 hover:text-rose-600 transition-all duration-300 relative hover:scale-105"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Auth Dropdown */}
            <div className="relative hidden sm:inline-block" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-1.5 text-gray-900 hover:text-rose-600 transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none"
                aria-label="Account Menu"
              >
                {isAuthenticated && user?.firstName ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#FAF0E6] border border-[#EAE3DC] text-[#B07E5D] font-bold text-xs flex items-center justify-center">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                    <FiChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                ) : (
                  <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Account Dropdown Menu */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-50 animate-fade-in text-left">
                  {isAuthenticated && user ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-950 truncate">
                          {user.firstName} {user.lastName || ''}
                        </p>
                        <p className="text-[10px] text-gray-400 font-light truncate">
                          {user.email}
                        </p>
                        {user.role === 'Admin' && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xs">
                            Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                      >
                        <FiUser className="w-3.5 h-3.5 text-gray-500" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                      >
                        <FiShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                        <span>My Orders</span>
                      </Link>

                      {user.role === 'Admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-800 bg-amber-50/50 hover:bg-amber-100/60 font-semibold transition-colors"
                        >
                          <FiShield className="w-3.5 h-3.5 text-amber-700" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-left"
                      >
                        <FiLogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-950">Welcome to Lavéra</p>
                        <p className="text-[10px] text-gray-400 font-light">Sign in to manage your orders</p>
                      </div>

                      <div className="p-3 space-y-2">
                        <Link
                          to="/login"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="block w-full py-2 bg-black text-white text-center text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rose-600 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="block w-full py-2 border border-gray-200 text-gray-800 text-center text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-black transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart / Shopping Bag */}
            <Link
              to="/cart"
              className="text-gray-900 hover:text-rose-600 transition-all duration-300 relative hover:scale-105 inline-block"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Dynamic Search Overlay */}
        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          isSearchOpen ? 'max-h-[80px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}>
          <div className="max-w-2xl mx-auto px-4 flex items-center gap-3">
            <FiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search clothes, dresses, tops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm font-light tracking-wide outline-none border-b border-gray-200 focus:border-black pb-1 transition-colors duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-black transition-colors duration-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Header in Drawer */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <span className="font-serif text-xl font-semibold tracking-[0.2em] text-gray-950 uppercase">
                Lavéra
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 hover:text-rose-600 transition-colors duration-200 focus:outline-none"
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium tracking-[0.18em] uppercase transition-colors duration-200 py-1.5 block ${
                    link.isSale 
                      ? 'text-rose-600 font-semibold' 
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer in Drawer (Mobile Account/Auth) */}
          <div className="border-t border-gray-100 pt-6">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAF0E6] text-[#B07E5D] font-bold text-sm flex items-center justify-center border border-[#EAE3DC]">
                    {user.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900">Hi, {user.firstName}</p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link 
                    to="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rose-600 transition-colors"
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-3 py-2 border border-rose-200 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rose-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-around text-gray-800">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 hover:text-rose-600 transition-colors duration-200"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="text-[10px] tracking-widest font-semibold uppercase">Login</span>
                </Link>
                <div className="h-6 w-[1px] bg-gray-200" />
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 hover:text-rose-600 transition-colors duration-200"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="text-[10px] tracking-widest font-semibold uppercase">Register</span>
                </Link>
                <div className="h-6 w-[1px] bg-gray-200" />
                <Link 
                  to="/wishlist" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 hover:text-rose-600 transition-colors duration-200"
                >
                  <FiHeart className="w-5 h-5" />
                  <span className="text-[10px] tracking-widest font-semibold uppercase">Wishlist</span>
                </Link>
              </div>
            )}
            <div className="mt-6 text-center">
              <p className="text-[9px] text-gray-400 tracking-widest uppercase">
                © 2026 LAVÉRA WESTERNWEAR
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
