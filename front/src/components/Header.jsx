import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiHeart, 
  FiUser, 
  FiShoppingBag, 
  FiMenu, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight 
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

  // Auto-scroll announcements every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prevIndex) => (prevIndex + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle manual announcement change
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

  const navLinks = [
    { name: 'New In', href: '#new-in', isSale: false },
    { name: 'Clothing', href: '#clothing', isSale: false },
    { name: 'Dresses', href: '#dresses', isSale: false },
    { name: 'Tops', href: '#tops', isSale: false },
    { name: 'Bottoms', href: '#bottoms', isSale: false },
    { name: 'Co-Ords', href: '#co-ords', isSale: false },
    { name: 'Sale', href: '#sale', isSale: true },
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
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-900 hover:text-rose-600 transition-colors duration-200 focus:outline-none"
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <a 
              href="/" 
              className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.2em] text-gray-950 hover:text-rose-600 transition-colors duration-300 inline-block uppercase"
            >
              Lavéra
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
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
              </a>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-900 hover:text-rose-600 transition-all duration-300 hover:scale-105 focus:outline-none"
              aria-label="Search"
            >
              {isSearchOpen ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Wishlist */}
            <a
              href="#wishlist"
              className="hidden sm:inline-block text-gray-900 hover:text-rose-600 transition-all duration-300 hover:scale-105"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>

            {/* Account */}
            <a
              href="#account"
              className="hidden sm:inline-block text-gray-900 hover:text-rose-600 transition-all duration-300 hover:scale-105"
              aria-label="Account"
            >
              <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>

            {/* Cart / Shopping Bag */}
            <a
              href="#cart"
              className="text-gray-900 hover:text-rose-600 transition-all duration-300 relative hover:scale-105 inline-block"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {/* Badge representing items count (matches image design) */}
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                2
              </span>
            </a>
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

      {/* Mobile Drawer (Menu Overlay & Menu Container) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing drawer when clicking inside
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
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium tracking-[0.18em] uppercase transition-colors duration-200 py-1.5 block ${
                    link.isSale 
                      ? 'text-rose-600 font-semibold' 
                      : 'text-gray-900 hover:text-rose-600'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Footer in Drawer (Mobile Account/Settings links) */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-around text-gray-800">
              <a 
                href="#account" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 hover:text-rose-600 transition-colors duration-200"
              >
                <FiUser className="w-5 h-5" />
                <span className="text-[10px] tracking-widest font-semibold uppercase">Account</span>
              </a>
              <div className="h-6 w-[1px] bg-gray-200" />
              <a 
                href="#wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 hover:text-rose-600 transition-colors duration-200"
              >
                <FiHeart className="w-5 h-5" />
                <span className="text-[10px] tracking-widest font-semibold uppercase">Wishlist</span>
              </a>
            </div>
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
