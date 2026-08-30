import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiShoppingBag, 
  FiClipboard, 
  FiUser, 
  FiPackage, 
  FiChevronDown,
  FiRotateCcw,
  FiAlertTriangle,
  FiLayers,
  FiTag,
  FiImage,
  FiFileText,
  FiBarChart2,
  FiUsers
} from 'react-icons/fi';


const Dashboard = () => {
  // State for Sales Chart
  const [hoveredIdx, setHoveredIdx] = useState(6); // Default to Sun (26 May) to match the tooltip in the mockup
  const [salesTimeframe, setSalesTimeframe] = useState('This Week');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('22 May – 28 May, 2024');

  // Chart data definitions
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartDates = ['20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May'];
  const salesThisWeek = [14000, 22000, 17000, 31000, 24000, 29000, 42000];
  const salesLastWeek = [12000, 19000, 15000, 26000, 20000, 24000, 34000];

  // SVG Chart Configurations
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxSalesVal = 50000;

  // Scale calculations for SVG path coordinates
  const getX = (index) => paddingLeft + index * (chartWidth / 6);
  const getY = (value) => svgHeight - paddingBottom - (value / maxSalesVal) * chartHeight;

  // Path coordinates
  const pathThisWeek = salesThisWeek.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
  const pathLastWeek = salesLastWeek.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
  
  // Fill gradient area path for This Week
  const areaThisWeek = `${pathThisWeek} L ${getX(6)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  // Donut values configuration
  const donutRadius = 40;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~251.32

  // Calculate percentages for donut rings
  const getDonutRingProps = (ratio, cumulativeOffsetRatio) => {
    const strokeDasharray = `${ratio * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -cumulativeOffsetRatio * donutCircumference;
    return { strokeDasharray, strokeDashoffset };
  };

  // 6 Stats Cards definitions
  const stats = [
    { label: 'Total Sales', value: '₹12,45,650', trend: '18.6%', isPositive: true, subLabel: 'vs last week', icon: FiShoppingBag, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
    { label: 'Total Orders', value: '1,245', trend: '12.4%', isPositive: true, subLabel: 'vs last week', icon: FiClipboard, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
    { label: 'Total Customers', value: '3,568', trend: '10.2%', isPositive: true, subLabel: 'vs last week', icon: FiUser, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
    { label: 'Pending Orders', value: '85', trend: '5.3%', isPositive: false, subLabel: 'vs last week', icon: FiPackage, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
    { label: 'Return Requests', value: '23', trend: '8.1%', isPositive: false, subLabel: 'vs last week', icon: FiRotateCcw, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
    { label: 'Low Stock Items', value: '18', isLink: true, actionText: 'View Details', icon: FiAlertTriangle, color: 'text-[#8C6239]', bgColor: 'bg-[#FAF4EE]', border: 'border-[#F5ECE5]' },
  ];

  // Top Selling Categories
  const topSellingCategories = [
    { name: 'Dresses', amount: '₹4,25,000', percentage: 34, color: 'bg-[#D09E84]' },
    { name: 'Tops', amount: '₹2,85,000', percentage: 23, color: 'bg-[#E8D5C8]' },
    { name: 'Bottoms', amount: '₹2,15,000', percentage: 17, color: 'bg-[#C4BAAF]' },
    { name: 'Co-ords', amount: '₹1,45,000', percentage: 12, color: 'bg-[#7AA0B4]' },
    { name: 'Others', amount: '₹75,650', percentage: 6, color: 'bg-[#D6D6D6]' },
  ];

  // Recent Orders List (mockup layout style)
  const recentOrders = [
    { id: '#LV24567', customer: 'Aashi Shah', date: '22 May, 2024', amount: '₹2,299', status: 'Processing', badgeClass: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]' },
    { id: '#LV24566', customer: 'Riya Mehta', date: '22 May, 2024', amount: '₹1,499', status: 'Processing', badgeClass: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]' },
    { id: '#LV24565', customer: 'Neha Joshi', date: '21 May, 2024', amount: '₹1,999', status: 'Shipped', badgeClass: 'bg-[#EEF7F2] text-[#4C9068] border border-[#E1EFE7]' },
    { id: '#LV24564', customer: 'Pooja Patel', date: '21 May, 2024', amount: '₹2,799', status: 'Processing', badgeClass: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]' },
    { id: '#LV24563', customer: 'Kavya Singh', date: '20 May, 2024', amount: '₹2,299', status: 'Delivered', badgeClass: 'bg-[#EEF7F2] text-[#4C9068] border border-[#E1EFE7]' },
  ];

  // Low Stock Items (mockup layout style)
  const lowStockAlerts = [
    { name: 'Linen Co-ord Set (M)', stock: 5, threshold: 10, img: '/images/cat_coords.jpg' },
    { name: 'Satin Midi Dress (S)', stock: 7, threshold: 10, img: '/images/prod_dress.jpg' },
    { name: 'Wide Leg Jeans (28)', stock: 6, threshold: 10, img: '/images/prod_jeans.jpg' },
    { name: 'Oversized Shirt (M)', stock: 8, threshold: 10, img: '/images/prod_shirt.jpg' },
    { name: 'Blazer Co-ord Set (S)', stock: 4, threshold: 10, img: '/images/prod_blazer.jpg' },
  ];

  // Sales by Country list
  const salesByCountry = [
    { country: 'India', flag: '🇮🇳', amount: '₹8,45,000', percentage: 51, color: 'bg-[#C18F6B]' },
    { country: 'USA', flag: '🇺🇸', amount: '₹2,85,000', percentage: 23, color: 'bg-[#C18F6B]' },
    { country: 'UK', flag: '🇬🇧', amount: '₹1,45,000', percentage: 12, color: 'bg-[#C18F6B]' },
    { country: 'Canada', flag: '🇨🇦', amount: '₹95,000', percentage: 8, color: 'bg-[#C18F6B]' },
    { country: 'Australia', flag: '🇦🇺', amount: '₹75,650', percentage: 6, color: 'bg-[#C18F6B]' },
  ];

  // Monthly Sales Overview mock data (30 items representing days of May)
  const monthlySalesData = [
    { day: 1, sales: 18000, orders: 12000 },
    { day: 2, sales: 22000, orders: 14000 },
    { day: 3, sales: 15000, orders: 11000 },
    { day: 4, sales: 29000, orders: 18000 },
    { day: 5, sales: 34000, orders: 22000 },
    { day: 6, sales: 25000, orders: 16000 },
    { day: 7, sales: 19000, orders: 13000 },
    { day: 8, sales: 31000, orders: 19000 },
    { day: 9, sales: 42000, orders: 25000 },
    { day: 10, sales: 28000, orders: 17000 },
    { day: 11, sales: 23000, orders: 15000 },
    { day: 12, sales: 37000, orders: 21000 },
    { day: 13, sales: 44000, orders: 28000 },
    { day: 14, sales: 32000, orders: 20000 },
    { day: 15, sales: 27000, orders: 16000 },
    { day: 16, sales: 30000, orders: 19000 },
    { day: 17, sales: 41000, orders: 26000 },
    { day: 18, sales: 29000, orders: 18000 },
    { day: 19, sales: 21000, orders: 14000 },
    { day: 20, sales: 35000, orders: 22000 },
    { day: 21, sales: 48000, orders: 30000 },
    { day: 22, sales: 33000, orders: 21000 },
    { day: 23, sales: 26000, orders: 17000 },
    { day: 24, sales: 38000, orders: 24000 },
    { day: 25, sales: 43000, orders: 27000 },
    { day: 26, sales: 42000, orders: 26000 }, // Matches highlighted day
    { day: 27, sales: 31000, orders: 20000 },
    { day: 28, sales: 25000, orders: 15000 },
    { day: 29, sales: 36000, orders: 22000 },
    { day: 30, sales: 40000, orders: 25000 }
  ];

  // Quick Actions list
  const quickActions = [
    { label: 'Add Product', icon: FiShoppingBag, path: '/admin/products' },
    { label: 'Add Category', icon: FiLayers, path: '/admin/categories' },
    { label: 'Add Coupon', icon: FiTag, path: '/admin/coupons' },
    { label: 'Add Banner', icon: FiImage, path: '/admin/banners' },
    { label: 'Create Blog', icon: FiFileText, path: '/admin/blog' },
    { label: 'Manage Orders', icon: FiClipboard, path: '/admin/orders' },
    { label: 'Manage Users', icon: FiUsers, path: '/admin/users' },
    { label: 'View Reports', icon: FiBarChart2, path: '/admin/reports' },
  ];

  return (
    <div className="space-y-4 select-none min-h-screen">
      
      {/* 1. Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl text-gray-900 tracking-tight font-sans">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Selector Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EAE3DC] hover:border-[#B07E5D] rounded-lg text-xs sm:text-sm text-gray-700 hover:text-gray-950 font-medium transition-all duration-200 cursor-pointer"
          >
            <FiCalendar size={15} className="text-[#8C6239]" />
            <span>{selectedDateRange}</span>
            <FiChevronDown size={13} className="text-gray-400" />
          </button>

          {showDatePicker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
              <div className="absolute right-0 mt-2 w-56 z-20 origin-top-right rounded-lg bg-white p-1.5 shadow-sm border border-[#EAE3DC] text-xs text-gray-600 animate-slide-down">
                {[
                  'Today (28 May)',
                  'Yesterday (27 May)',
                  'Last 7 Days',
                  'Last 30 Days',
                  '22 May – 28 May, 2024',
                ].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setShowDatePicker(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#FAF4EE] hover:text-[#8C6239] rounded-xl transition-colors font-medium"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. 6 Stats Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="flex flex-col justify-between bg-white border border-[#EAE3DC] rounded-lg p-3.5 hover:border-[#B07E5D]/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 ${stat.bgColor} ${stat.border} rounded-full flex items-center justify-center ${stat.color} shrink-0`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="mt-3 text-left">
                <h3 className="text-lg text-gray-900 leading-none tracking-tight">{stat.value}</h3>
                
                {/* Trend indicator */}
                {stat.trend ? (
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold mt-2 ${stat.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                    <span className="text-[11px] font-medium">{stat.isPositive ? '↑' : '↓'}</span>
                    <span>{stat.trend}</span>
                    <span className="text-gray-400 font-medium ml-1">{stat.subLabel}</span>
                  </div>
                ) : (
                  <Link to="/admin/inventory" className="inline-block text-[10px] font-semibold text-[#8C6239] hover:underline mt-2">
                    {stat.actionText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Charts Row (Sales, Order, Sales by Channel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Sales Overview (Line chart) */}
        <div className="lg:col-span-6 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-2">
            <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Sales Overview</h3>
            <select 
              value={salesTimeframe} 
              onChange={(e) => setSalesTimeframe(e.target.value)}
              className="px-2 py-1 border border-[#EAE3DC] hover:border-[#B07E5D] text-xs rounded-lg bg-white outline-none cursor-pointer text-gray-600 transition-colors"
            >
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 mb-4 text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#B07E5D] rounded-full inline-block" />
              <span>This Week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-300 border-t border-dashed border-gray-400 rounded-full inline-block" />
              <span>Last Week</span>
            </div>
          </div>

          <div className="relative flex-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
              {/* Horizontal Grid lines */}
              {[0, 10000, 20000, 30000, 40000, 50000].map((gridVal) => {
                const y = getY(gridVal);
                return (
                  <g key={gridVal} className="opacity-40">
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#EAE3DC" strokeWidth="0.75" />
                    <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fontSize="8" className="fill-gray-400 font-bold font-sans">
                      {gridVal === 0 ? '0' : `${gridVal / 1000}K`}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B07E5D" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#B07E5D" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <path d={areaThisWeek} fill="url(#salesGrad)" className="transition-all duration-300" />

              {/* Dotted Line for Last Week */}
              <path d={pathLastWeek} fill="none" stroke="#C4BAAF" strokeWidth="1" strokeDasharray="3 3" className="transition-all duration-300 opacity-60" />

              {/* Solid Line for This Week */}
              <path d={pathThisWeek} fill="none" stroke="#B07E5D" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" />

              {/* Guideline */}
              {hoveredIdx !== null && (
                <line x1={getX(hoveredIdx)} y1={paddingTop} x2={getX(hoveredIdx)} y2={svgHeight - paddingBottom} stroke="#B07E5D" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-50" />
              )}

              {/* Circles */}
              {salesThisWeek.map((val, idx) => (
                <circle 
                  key={idx}
                  cx={getX(idx)}
                  cy={getY(val)}
                  r={hoveredIdx === idx ? 4.5 : 2.5}
                  fill="#ffffff"
                  stroke="#B07E5D"
                  strokeWidth={hoveredIdx === idx ? 3.5 : 1.5}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}

              {/* Labels */}
              {chartDays.map((day, idx) => (
                <text
                  key={day}
                  x={getX(idx)}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fontSize="9"
                  className={`font-semibold font-sans ${hoveredIdx === idx ? 'fill-[#8C6239] font-bold' : 'fill-gray-400'}`}
                >
                  {day}
                </text>
              ))}

              {/* Tooltip */}
              {hoveredIdx !== null && (
                <g transform={`translate(${getX(hoveredIdx) - (hoveredIdx === 6 ? 82 : hoveredIdx === 5 ? 70 : 45)}, ${getY(salesThisWeek[hoveredIdx]) - 50})`}>
                  <rect width="90" height="42" rx="8" fill="#ffffff" stroke="#EAE3DC" strokeWidth="1.25" className="shadow-lg filter drop-shadow-md" />
                  <text x="45" y="18" textAnchor="middle" fontSize="10.5" fontWeight="bold" className="fill-gray-900 font-sans">
                    ₹{salesThisWeek[hoveredIdx].toLocaleString('en-IN')}
                  </text>
                  <text x="45" y="31" textAnchor="middle" fontSize="8" className="fill-gray-400 font-semibold font-sans">
                    {chartDates[hoveredIdx]}, 2024
                  </text>
                </g>
              )}
            </svg>

            {/* Hitboxes */}
            <div className="absolute inset-y-0 left-0 right-0 flex pl-[40px] pr-[20px] pb-[30px] pt-[20px] pointer-events-none">
              {chartDays.map((_, idx) => (
                <div 
                  key={idx}
                  className="flex-1 h-full pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order Overview Donut */}
        <div className="lg:col-span-3 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-sm text-gray-800 pb-2 border-b border-[#F5ECE5] mb-4 font-sans tracking-wide uppercase text-left">Order Overview</h3>
          
          <div className="flex flex-col items-center justify-center flex-1">
            {/* SVG Donut */}
            <div className="relative w-[110px] h-[110px] shrink-0 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#5F9E7F" strokeWidth="10" {...getDonutRingProps(0.498, 0)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#D0A384" strokeWidth="10" {...getDonutRingProps(0.229, 0.498)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#6B8B9B" strokeWidth="10" {...getDonutRingProps(0.169, 0.498 + 0.229)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#C96D6D" strokeWidth="10" {...getDonutRingProps(0.104, 0.498 + 0.229 + 0.169)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-semibold text-gray-900 leading-none">1,245</span>
                <span className="text-[7.5px] text-gray-400 font-bold tracking-wider uppercase mt-1 leading-none">Total Orders</span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full space-y-2 text-xs text-left">
              {[
                { label: 'Delivered', count: '620', percent: '49.8%', color: 'bg-[#5F9E7F]' },
                { label: 'Processing', count: '285', percent: '22.9%', color: 'bg-[#D0A384]' },
                { label: 'Shipped', count: '210', percent: '16.9%', color: 'bg-[#6B8B9B]' },
                { label: 'Cancelled', count: '130', percent: '10.4%', color: 'bg-[#C96D6D]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-gray-500">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.count} <span className="text-gray-400 font-semibold ml-0.5">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Channel Donut */}
        <div className="lg:col-span-3 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-sm text-gray-800 pb-2 border-b border-[#F5ECE5] mb-4 font-sans tracking-wide uppercase text-left">Sales by Channel</h3>
          
          <div className="flex flex-col items-center justify-center flex-1">
            {/* SVG Donut */}
            <div className="relative w-[110px] h-[110px] shrink-0 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#B07E5D" strokeWidth="10" {...getDonutRingProps(0.60, 0)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#D2A083" strokeWidth="10" {...getDonutRingProps(0.23, 0.60)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#E5CEBF" strokeWidth="10" {...getDonutRingProps(0.12, 0.60 + 0.23)} />
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#C4BAAF" strokeWidth="10" {...getDonutRingProps(0.05, 0.60 + 0.23 + 0.12)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-semibold text-gray-900 leading-none">₹12.4L</span>
                <span className="text-[7.5px] text-gray-400 font-bold tracking-wider uppercase mt-1 leading-none">Total Sales</span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full space-y-2 text-xs text-left">
              {[
                { label: 'Website', val: '₹7,45,000', percent: '60%', color: 'bg-[#B07E5D]' },
                { label: 'Mobile App', val: '₹2,85,000', percent: '23%', color: 'bg-[#D2A083]' },
                { label: 'Instagram', val: '₹1,45,000', percent: '12%', color: 'bg-[#E5CEBF]' },
                { label: 'Other', val: '₹75,650', percent: '5%', color: 'bg-[#C4BAAF]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-gray-500">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.val} <span className="text-gray-400 font-semibold ml-0.5">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Details Row (Categories, Recent Orders, Low Stock Alerts, Customer Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        
        {/* Top Selling Categories */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-4">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Top Selling Categories</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-3 text-left">
              {topSellingCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-gray-900">{cat.amount} <span className="text-gray-400 font-normal text-[10px] ml-0.5">({cat.percentage}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-3">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Recent Orders</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#F5ECE5] text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 font-semibold">Order ID</th>
                    <th className="py-2 font-semibold">Customer</th>
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Amount</th>
                    <th className="py-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F2]">
                  {recentOrders.map((ord, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-2 text-gray-850">{ord.id}</td>
                      <td className="py-2 text-gray-500 font-medium whitespace-nowrap">{ord.customer}</td>
                      <td className="py-2 text-gray-400 whitespace-nowrap">{ord.date}</td>
                      <td className="py-2 text-gray-800">{ord.amount}</td>
                      <td className="py-2 text-right">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded ${ord.badgeClass}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-2 border-t border-[#FAF6F2] text-center">
            <Link to="/admin/orders" className="text-[10px] font-bold text-[#8C6239] hover:underline uppercase tracking-wider">
              View All Orders →
            </Link>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-3">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Low Stock Alert</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#F5ECE5] text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 font-semibold">Product</th>
                    <th className="py-2 font-semibold text-center">Stock</th>
                    <th className="py-2 font-semibold text-center">Threshold</th>
                    <th className="py-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F2]">
                  {lowStockAlerts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-1.5 flex items-center gap-2">
                        <img src={item.img} alt={item.name} className="w-6 h-6 rounded object-cover shrink-0 border border-gray-100" />
                        <span className="font-medium text-gray-700 truncate max-w-[100px]">{item.name}</span>
                      </td>
                      <td className="py-1.5 text-center font-bold text-rose-600">{item.stock}</td>
                      <td className="py-1.5 text-center text-gray-400 font-medium">{item.threshold}</td>
                      <td className="py-1.5 text-right">
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-2 border-t border-[#FAF6F2] text-center">
            <Link to="/admin/inventory" className="text-[10px] font-bold text-[#8C6239] hover:underline uppercase tracking-wider">
              View All Products →
            </Link>
          </div>
        </div>

        {/* Customer Overview */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-3">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Customer Overview</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="text-left mb-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total Customers</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl text-gray-900 leading-none">3,568</span>
                <span className="text-[10px] font-bold text-emerald-600">↑ 10.2% <span className="text-gray-400 font-medium ml-0.5">vs last week</span></span>
              </div>
            </div>

            <div className="flex items-center gap-6 justify-center py-1">
              {/* Donut circle */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#6B8B9B" strokeWidth="10" {...getDonutRingProps(0.68, 0)} />
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#E5CEBF" strokeWidth="10" {...getDonutRingProps(0.31, 0.68)} />
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#5F9E7F" strokeWidth="10" {...getDonutRingProps(0.01, 0.68 + 0.31)} />
                </svg>
              </div>

              {/* Legends list */}
              <div className="space-y-1.5 text-[10px] text-left flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6B8B9B]" />
                    <span className="font-semibold text-gray-500">Female</span>
                  </div>
                  <span className="font-bold text-gray-800">68% <span className="text-gray-400 font-medium">(2,428)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E5CEBF]" />
                    <span className="font-semibold text-gray-500">Male</span>
                  </div>
                  <span className="font-bold text-gray-800">31% <span className="text-gray-400 font-medium">(1,104)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5F9E7F]" />
                    <span className="font-semibold text-gray-500">Other</span>
                  </div>
                  <span className="font-bold text-gray-800">1% <span className="text-gray-400 font-medium">(36)</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#FAF6F2] text-left">
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">New Customers</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold text-gray-900">256</span>
                <span className="text-[9px] font-bold text-emerald-600">↑15.6%</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Returning Customers</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold text-gray-900">1,245</span>
                <span className="text-[9px] font-bold text-emerald-600">↑8.4%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Footer Row (Sales by Country, Monthly sales bar chart, Order status mini donut, Quick Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        
        {/* Sales by Country */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-4">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Sales by Country</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-3.5 text-left">
              {salesByCountry.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-none">{item.flag}</span>
                      <span className="text-gray-700">{item.country}</span>
                    </div>
                    <span className="text-gray-950 font-bold">{item.amount} <span className="text-gray-400 font-normal text-[10px] ml-0.5">({item.percentage}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Sales Overview (Bar chart) */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-3">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Monthly Sales Overview</h3>
              <select className="px-1.5 py-0.5 border border-[#EAE3DC] text-[10px] rounded bg-white outline-none cursor-pointer text-gray-600 transition-colors">
                <option>May 2024</option>
                <option>April 2024</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-[9px] text-gray-400 mb-3 text-left">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2 bg-[#B07E5D] rounded-sm inline-block" />
                <span>Sales</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2 bg-[#FAF4EE] border border-[#FAF4EE] rounded-sm inline-block" />
                <span>Orders</span>
              </div>
            </div>

            <div className="relative">
              {/* Dynamic SVG Bar Chart */}
              <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible select-none">
                {/* Horizontal grid lines */}
                {[0, 100, 200].map((gridVal, i) => (
                  <line key={i} x1="20" y1={100 - gridVal / 2} x2="295" y2={100 - gridVal / 2} stroke="#EAE3DC" strokeWidth="0.5" className="opacity-30" />
                ))}
                
                {monthlySalesData.map((item, idx) => {
                  const chartW = 275;
                  const x = 20 + idx * (chartW / 30);
                  
                  // Scale values (assume max sales is 50000, max orders is 35000)
                  const salesHeight = (item.sales / 50000) * 80;
                  const ordersHeight = (item.orders / 35000) * 80;

                  return (
                    <g key={idx}>
                      {/* Sales Bar */}
                      <rect 
                        x={x} 
                        y={100 - salesHeight} 
                        width="3" 
                        height={salesHeight} 
                        fill="#B07E5D" 
                        rx="0.5"
                      />
                      {/* Orders Bar */}
                      <rect 
                        x={x + 3.5} 
                        y={100 - ordersHeight} 
                        width="3" 
                        height={ordersHeight} 
                        fill="#FAF4EE" 
                        stroke="#EAE3DC"
                        strokeWidth="0.5"
                        rx="0.5"
                      />
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {[1, 5, 10, 15, 20, 25, 30].map((label) => {
                  const chartW = 275;
                  const idx = label - 1;
                  const x = 20 + idx * (chartW / 30) + 1.5;
                  return (
                    <text key={label} x={x} y="112" textAnchor="middle" fontSize="7.5" fontWeight="semibold" className="fill-gray-400 font-sans">
                      {label}
                    </text>
                  );
                })}

                {/* Y Axis Labels */}
                <text x="15" y="102" textAnchor="end" fontSize="7.5" fontWeight="semibold" className="fill-gray-400 font-sans">0</text>
                <text x="15" y="52" textAnchor="end" fontSize="7.5" fontWeight="semibold" className="fill-gray-400 font-sans">25K</text>
                <text x="15" y="12" textAnchor="end" fontSize="7.5" fontWeight="semibold" className="fill-gray-400 font-sans">50K</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-3">
              <h3 className="text-sm text-gray-800 font-sans tracking-wide uppercase">Order Status Overview</h3>
              <span className="text-[10px] font-semibold text-gray-400 cursor-pointer hover:underline">Details</span>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#5F9E7F" strokeWidth="10" {...getDonutRingProps(0.498, 0)} />
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#D0A384" strokeWidth="10" {...getDonutRingProps(0.229, 0.498)} />
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#6B8B9B" strokeWidth="10" {...getDonutRingProps(0.169, 0.498 + 0.229)} />
                  <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#C96D6D" strokeWidth="10" {...getDonutRingProps(0.104, 0.498 + 0.229 + 0.169)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-gray-900 leading-none">1,245</span>
                  <span className="text-[6px] text-gray-400 font-bold tracking-wider uppercase mt-0.5 leading-none">Total</span>
                </div>
              </div>

              {/* Mini Legend */}
              <div className="space-y-1.5 text-[10px] text-left flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5F9E7F]" />
                    <span className="font-semibold text-gray-500">Delivered</span>
                  </div>
                  <span className="font-bold text-gray-800">49.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D0A384]" />
                    <span className="font-semibold text-gray-500">Processing</span>
                  </div>
                  <span className="font-bold text-gray-800">22.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6B8B9B]" />
                    <span className="font-semibold text-gray-500">Shipped</span>
                  </div>
                  <span className="font-bold text-gray-800">16.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C96D6D]" />
                    <span className="font-semibold text-gray-500">Cancelled</span>
                  </div>
                  <span className="font-bold text-gray-800">10.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div className="text-left">
            <h3 className="text-sm text-gray-800 pb-2 border-b border-[#F5ECE5] mb-3 font-sans tracking-wide uppercase">Quick Actions</h3>
            
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((act, idx) => (
                <Link 
                  key={idx}
                  to={act.path}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-[#EAE3DC] hover:border-[#B07E5D] hover:bg-[#FAF4EE]/40 transition-all duration-200 group text-center"
                >
                  <act.icon size={15} className="text-gray-400 group-hover:text-[#8C6239] group-hover:scale-105 transition-all duration-200 mb-1.5 shrink-0" />
                  <span className="text-[9px] font-bold text-gray-500 group-hover:text-gray-800 leading-tight block truncate w-full">
                    {act.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 6. Footer Copyright */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 tracking-wide">
        <p>© 2024 LAVÉRA. All Rights Reserved.</p>
        <div className="flex gap-4 sm:gap-6 uppercase">
          <Link to="/terms" className="hover:text-[#8C6239] transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-[#8C6239] transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-[#8C6239] transition-colors">Support</Link>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;