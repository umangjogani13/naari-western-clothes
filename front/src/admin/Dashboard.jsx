import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiShoppingBag, 
  FiClipboard, 
  FiUser, 
  FiPackage, 
  FiChevronDown
} from 'react-icons/fi';

const Dashboard = () => {
  // State for Sales Chart
  const [hoveredIdx, setHoveredIdx] = useState(2); // Default to Wed (22 May) to match the screenshot
  const [salesTimeframe, setSalesTimeframe] = useState('This Week');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('22 May – 28 May, 2024');

  // Chart data definitions
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartDates = ['20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May'];
  const salesThisWeek = [20000, 30000, 24560, 34000, 27000, 32000, 42000];
  const salesLastWeek = [17000, 25000, 19000, 28000, 22000, 25000, 35000];

  // SVG Chart Configurations
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

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
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~314.16

  // Calculate percentages for donut rings
  const getDonutRingProps = (ratio, cumulativeOffsetRatio) => {
    const strokeDasharray = `${ratio * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -cumulativeOffsetRatio * donutCircumference;
    return { strokeDasharray, strokeDashoffset };
  };

  // Stats definition
  const stats = [
    { label: 'Total Sales', value: '₹12,45,650', trend: '18.6%', isPositive: true, icon: FiShoppingBag },
    { label: 'Total Orders', value: '1,245', trend: '12.4%', isPositive: true, icon: FiClipboard },
    { label: 'Total Customers', value: '3,568', trend: '10.2%', isPositive: true, icon: FiUser },
    { label: 'Pending Orders', value: '85', trend: '5.3%', isPositive: false, icon: FiPackage },
  ];

  // Dummy products & orders
  const topSelling = [
    { name: 'Satin Midi Dress', price: '₹2,299', sold: '320 Sold', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100' },
    { name: 'Oversized Cotton Shirt', price: '₹1,499', sold: '280 Sold', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100' },
    { name: 'Wide Leg Jeans', price: '₹1,999', sold: '245 Sold', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=100' },
    { name: 'Linen Co-ord Set', price: '₹2,799', sold: '210 Sold', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=100' },
  ];

  const recentOrders = [
    { id: '#LV24567', name: 'Aashi Shah', price: '₹2,299', status: 'Processing', badgeStyle: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: '#LV24566', name: 'Riya Mehta', price: '₹1,499', status: 'Processing', badgeStyle: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
    { id: '#LV24565', name: 'Neha Joshi', price: '₹1,999', status: 'Shipped', badgeStyle: 'bg-[#EEF7F2] text-[#4C9068]', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    { id: '#LV24564', name: 'Pooja Patel', price: '₹2,799', status: 'Processing', badgeStyle: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100' },
    { id: '#LV24563', name: 'Kavya Singh', price: '₹2,299', status: 'Delivered', badgeStyle: 'bg-[#EEF7F2] text-[#4C9068]', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100' },
  ];

  const lowStock = [
    { name: 'Linen Co-ord Set (M)', stock: 5, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=100' },
    { name: 'Satin Midi Dress (S)', stock: 7, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100' },
    { name: 'Wide Leg Jeans (28)', stock: 6, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="space-y-2 select-none">
      
      {/* Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 tracking-tight font-sans">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Selector Popover Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2.5 px-4 py-2 bg-white border border-[#EAE3DC] hover:border-[#B07E5D] rounded-lg text-xs sm:text-sm text-gray-600 hover:text-gray-950 transition-all duration-200 cursor-pointer"
          >
            <FiCalendar size={16} className="text-[#8C6239]" />
            <span>{selectedDateRange}</span>
            <FiChevronDown size={14} className="text-gray-400" />
          </button>

          {showDatePicker && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
              <div className="absolute right-0 mt-2 w-56 z-20 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-[#EAE3DC] text-xs text-gray-600 animate-slide-down">
                {[
                  'Today (25 Aug)',
                  'Yesterday (24 Aug)',
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
                    className="w-full text-left px-3.5 py-2.5 hover:bg-[#FDF8F4] hover:text-[#8C6239] rounded-xl transition-colors font-medium"
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="flex items-center gap-4 bg-white border border-[#EAE3DC] rounded-lg p-4 hover:border-[#B07E5D]/30 transition-all duration-200"
            >
              {/* Stat Icon Circle */}
              <div className="w-10 h-10 bg-[#FAF4EE] border border-[#F5ECE5] rounded-full flex items-center justify-center text-[#8C6239] shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <h3 className="text-lg text-gray-900 mt-0.5 leading-tight">{stat.value}</h3>
                
                {/* Trend indicator */}
                <div className={`flex items-center gap-0.5 text-[11px] font-bold mt-1.5 ${stat.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                  <span className="text-[12px] mr-0.5">{stat.isPositive ? '↑' : '↓'}</span>
                  <span>{stat.trend}</span>
                  <span className="text-gray-400 font-medium ml-1">vs last week</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 1: Charts & Key tables */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        
        {/* Sales Overview SVG Graph Card */}
        <div className="md:col-span-12 2xl:col-span-6 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between relative group">
          
          {/* Header info */}
          <div className="flex items-center justify-between pb-2 border-b border-[#F5ECE5] mb-2">
            <div>
              <h3 className="text-base text-gray-900 font-sans">Sales Overview</h3>
            </div>
            
            {/* Timeframe Dropdown */}
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

          {/* Legends */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#B07E5D] rounded-full inline-block" />
              <span>This Week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-300 border-t border-dashed border-gray-400 rounded-full inline-block" />
              <span>Last Week</span>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative flex-1">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Horizontal Grid lines */}
              {[0, 10000, 20000, 30000, 40000, 50000].map((gridVal) => {
                const y = getY(gridVal);
                return (
                  <g key={gridVal} className="opacity-40">
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={svgWidth - paddingRight} 
                      y2={y} 
                      stroke="#EAE3DC" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={y + 4} 
                      textAnchor="end" 
                      fontSize="9" 
                      className="fill-gray-400 font-bold font-sans"
                    >
                      {gridVal === 0 ? '0' : `${gridVal / 1000}K`}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area Below "This Week" path */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B07E5D" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#B07E5D" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <path 
                d={areaThisWeek} 
                fill="url(#areaGrad)" 
                className="transition-all duration-300"
              />

              {/* Dotted Line for Last Week */}
              <path 
                d={pathLastWeek} 
                fill="none" 
                stroke="#C4BAAF" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="transition-all duration-300 opacity-70"
              />

              {/* Solid Line for This Week */}
              <path 
                d={pathThisWeek} 
                fill="none" 
                stroke="#B07E5D" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                className="transition-all duration-300"
              />

              {/* Vertical Dashed Guideline for Active Hover Point */}
              {hoveredIdx !== null && (
                <line 
                  x1={getX(hoveredIdx)} 
                  y1={paddingTop} 
                  x2={getX(hoveredIdx)} 
                  y2={svgHeight - paddingBottom} 
                  stroke="#B07E5D" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                  className="opacity-60"
                />
              )}

              {/* Data points (Circles) for This Week */}
              {salesThisWeek.map((val, idx) => (
                <circle 
                  key={idx}
                  cx={getX(idx)}
                  cy={getY(val)}
                  r={hoveredIdx === idx ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#B07E5D"
                  strokeWidth={hoveredIdx === idx ? 3.5 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}

              {/* X Axis Labels */}
              {chartDays.map((day, idx) => (
                <text
                  key={day}
                  x={getX(idx)}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fontSize="10"
                  className={`font-semibold font-sans ${hoveredIdx === idx ? 'fill-[#8C6239] font-bold' : 'fill-gray-400'}`}
                >
                  {day}
                </text>
              ))}

              {/* Interactive Tooltip rendered inside SVG (styled perfectly like screenshot) */}
              {hoveredIdx !== null && (
                <g transform={`translate(${getX(hoveredIdx) - (hoveredIdx === 6 ? 82 : hoveredIdx === 5 ? 70 : 45)}, ${getY(salesThisWeek[hoveredIdx]) - 52})`}>
                  {/* Tooltip Background Card */}
                  <rect 
                    width="90" 
                    height="44" 
                    rx="8" 
                    fill="#ffffff" 
                    stroke="#EAE3DC" 
                    strokeWidth="1.5"
                    className="shadow-lg filter drop-shadow-md"
                  />
                  {/* Value */}
                  <text 
                    x="45" 
                    y="18" 
                    textAnchor="middle" 
                    fontSize="11" 
                    fontWeight="bold" 
                    className="fill-gray-900 font-sans"
                  >
                    ₹{salesThisWeek[hoveredIdx].toLocaleString('en-IN')}
                  </text>
                  {/* Subtitle / Date */}
                  <text 
                    x="45" 
                    y="32" 
                    textAnchor="middle" 
                    fontSize="8.5" 
                    className="fill-gray-400 font-semibold font-sans"
                  >
                    {chartDates[hoveredIdx]}, 2024
                  </text>
                </g>
              )}
            </svg>

            {/* Invisible Hit Zones for Hover Detection */}
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

        {/* Top Selling Products List Card */}
        <div className="md:col-span-6 2xl:col-span-3 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F5ECE5] mb-4">
              <h3 className="text-base text-gray-900 font-sans">Top Selling Products</h3>
              <Link to="/admin/products" className="text-xs font-semibold text-[#8C6239] hover:underline">View All</Link>
            </div>

            <div className="space-y-2">
              {topSelling.map((prod, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prod.img} 
                      alt={prod.name} 
                      className="w-10 h-10 rounded-lg object-cover border border-[#F3ECE7] shrink-0"
                    />
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-gray-900 leading-snug">
                        {i + 1}. {prod.name}
                      </h4>
                      <p className="text-[11px] text-[#8C6239] font-bold mt-0.5">{prod.price}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0">
                    {prod.sold}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders List Card */}
        <div className="md:col-span-6 2xl:col-span-3 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F5ECE5] mb-4">
              <h3 className="text-base text-gray-900 font-sans">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-semibold text-[#8C6239] hover:underline">View All</Link>
            </div>

            <div className="space-y-2">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-xs py-1">
                  <div className="flex items-center gap-3">
                    <img 
                      src={order.avatar} 
                      alt={order.name} 
                      className="w-10 h-10 rounded-lg object-cover border border-[#F3ECE7] shrink-0"
                    />
                    <div className="text-left leading-tight">
                      <h4 className="font-semibold text-gray-900">{order.id}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{order.name}</p>
                      <p className="font-semibold text-gray-900 mt-0.5">{order.price}</p>
                    </div>
                  </div>
                  <span className={`inline-block text-[10px] font-semibold px-3 py-1 rounded-lg text-center shrink-0 ${order.badgeStyle}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Donut charts & Inventory lists */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        
        {/* Order Status Donut Chart Card */}
        <div className="md:col-span-6 2xl:col-span-4 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-base text-gray-900 pb-3 border-b border-[#F5ECE5] mb-4 font-sans">Order Status</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10">
            {/* SVG Donut */}
            <div className="relative w-[115px] h-[115px] sm:w-[125px] sm:h-[125px] shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                {/* 1. Delivered Ring (49.8%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#5F9E7F"
                  strokeWidth="14"
                  {...getDonutRingProps(0.498, 0)}
                />
                {/* 2. Processing Ring (22.9%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#D0A384"
                  strokeWidth="14"
                  {...getDonutRingProps(0.229, 0.498)}
                />
                {/* 3. Shipped Ring (16.9%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#6B8B9B"
                  strokeWidth="14"
                  {...getDonutRingProps(0.169, 0.498 + 0.229)}
                />
                {/* 4. Cancelled Ring (10.4%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#C96D6D"
                  strokeWidth="14"
                  {...getDonutRingProps(0.104, 0.498 + 0.229 + 0.169)}
                />
              </svg>
              {/* Central text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm sm:text-base font-extrabold text-gray-900 leading-none">1,245</span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold tracking-wider uppercase mt-1 leading-none">Total Orders</span>
              </div>
            </div>

            {/* Legends list */}
            <div className="flex-1 w-full space-y-2.5 text-xs max-w-[180px]">
              {[
                { label: 'Delivered', count: '620', percent: '49.8%', color: 'bg-[#5F9E7F]' },
                { label: 'Processing', count: '285', percent: '22.9%', color: 'bg-[#D0A384]' },
                { label: 'Shipped', count: '210', percent: '16.9%', color: 'bg-[#6B8B9B]' },
                { label: 'Cancelled', count: '130', percent: '10.4%', color: 'bg-[#C96D6D]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count} <span className="text-gray-400 font-semibold ml-0.5">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Category Donut Chart Card */}
        <div className="md:col-span-6 2xl:col-span-4 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-base text-gray-900 pb-3 border-b border-[#F5ECE5] mb-4 font-sans">Sales by Category</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10">
            {/* SVG Donut */}
            <div className="relative w-[115px] h-[115px] sm:w-[125px] sm:h-[125px] shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                {/* 1. Dresses (34%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#D09E84"
                  strokeWidth="14"
                  {...getDonutRingProps(0.34, 0)}
                />
                {/* 2. Tops (23%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#E8D5C8"
                  strokeWidth="14"
                  {...getDonutRingProps(0.23, 0.34)}
                />
                {/* 3. Bottoms (17%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#C4BAAF"
                  strokeWidth="14"
                  {...getDonutRingProps(0.17, 0.34 + 0.23)}
                />
                {/* 4. Co-ords (12%) */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#7AA0B4"
                  strokeWidth="14"
                  {...getDonutRingProps(0.12, 0.34 + 0.23 + 0.17)}
                />
                {/* 5. Others (14%) - visual remainder to sum up to 1.0 */}
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#D6D6D6"
                  strokeWidth="14"
                  {...getDonutRingProps(0.14, 0.34 + 0.23 + 0.17 + 0.12)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-extrabold text-gray-900 leading-none">₹12.4L</span>
                <span className="text-[7.5px] sm:text-[8px] text-gray-400 font-semibold tracking-wider uppercase mt-1 leading-none">Total Sales</span>
              </div>
            </div>

            {/* Legends list */}
            <div className="flex-1 w-full space-y-2.5 text-xs max-w-[180px]">
              {[
                { label: 'Dresses', val: '₹4,25,000', percent: '34%', color: 'bg-[#D09E84]' },
                { label: 'Tops', val: '₹2,85,000', percent: '23%', color: 'bg-[#E8D5C8]' },
                { label: 'Bottoms', val: '₹2,15,000', percent: '17%', color: 'bg-[#C4BAAF]' },
                { label: 'Co-ords', val: '₹1,45,000', percent: '12%', color: 'bg-[#7AA0B4]' },
                { label: 'Others', val: '₹75,650', percent: '6%', color: 'bg-[#D6D6D6]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.val} <span className="text-gray-400 font-semibold ml-0.5">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Products List Card */}
        <div className="md:col-span-12 2xl:col-span-4 bg-white border border-[#EAE3DC] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5ECE5] mb-4">
            <h3 className="text-base text-gray-900 font-sans">Low Stock Products</h3>
            <Link to="/admin/inventory" className="text-xs font-semibold text-[#8C6239] hover:underline">View All</Link>
          </div>

          <div className="space-y-2 max-w-2xl">
            {lowStock.map((prod, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-xs py-1">
                <div className="flex items-center gap-3">
                  <img 
                    src={prod.img} 
                    alt={prod.name} 
                    className="w-10 h-10 rounded-lg object-cover border border-[#F3ECE7] shrink-0"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 leading-snug">{prod.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Stock: {prod.stock}</p>
                  </div>
                </div>
                
                <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 py-1 px-2.5 rounded-lg shrink-0 uppercase tracking-wider">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin Panel Copyright Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <p>© 2024 LAVÉRA. All Rights Reserved.</p>
        <div className="flex gap-4 sm:gap-6">
          <Link to="/terms" className="hover:text-[#8C6239] transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-[#8C6239] transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-[#8C6239] transition-colors">Support</Link>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;