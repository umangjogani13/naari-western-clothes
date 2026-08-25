import React, { useState } from 'react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 backdrop-blur-md transition-all duration-200">
      
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
            placeholder="Search anything..." 
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
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C18F6B] text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
              5
            </span>
          </button>

          {/* Notifications Dropdown (Interactive Popover) */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 z-20 origin-top-right rounded-2xl bg-white p-4 shadow-xl border border-[#EAE3DC] animate-slide-down">
                <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-3">
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Notifications</h3>
                  <button className="text-xs text-[#8C6239] hover:underline">Mark all read</button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {[
                    { id: 1, text: 'New order #LV24567 placed by Aashi Shah', time: '5m ago', unread: true },
                    { id: 2, text: 'Product "Satin Midi Dress" is running out of stock (5 left)', time: '1h ago', unread: true },
                    { id: 3, text: 'Customer review received: "Highly recommended!"', time: '2h ago', unread: false },
                    { id: 4, text: 'Monthly sales report generated', time: '5h ago', unread: false },
                  ].map((notif) => (
                    <div key={notif.id} className={`flex flex-col p-2 rounded-lg transition-colors ${notif.unread ? 'bg-[#FDF8F4]' : 'hover:bg-[#FDFBF9]'}`}>
                      <p className="text-xs text-gray-700 leading-relaxed">{notif.text}</p>
                      <span className="text-[10px] text-gray-400 mt-1">{notif.time}</span>
                    </div>
                  ))}
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
            {/* Avatar URL or dynamic fallback */}
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
              alt="Admin Profile" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F5ECE5]"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[#1A1A1A] leading-tight">Admin</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Super Admin</p>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 mt-3 w-52 z-20 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-[#EAE3DC] animate-slide-down">
                <div className="px-3 py-2 border-b border-[#F5ECE5] mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-xs font-medium text-[#1A1A1A] truncate mt-0.5">admin@lavera.com</p>
                </div>
                {[
                  { label: 'My Profile', path: '/admin/profile' },
                  { label: 'Account Settings', path: '/admin/settings' },
                  { label: 'Security', path: '/admin/security' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => setShowProfileDropdown(false)}
                    className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-[#FDF8F4] hover:text-[#8C6239] rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-[#F5ECE5] mt-1 pt-1">
                  <button 
                    onClick={() => setShowProfileDropdown(false)}
                    className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Sign Out
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