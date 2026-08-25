import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiClipboard, 
  FiUsers 
} from 'react-icons/fi';

const Reports = () => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [hoveredIdx, setHoveredIdx] = useState(2);

  // Chart data definitions
  const chartWeeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  const salesData = [120000, 245000, 310000, 420000, 150650];
  const ordersData = [50, 120, 150, 210, 85];

  // SVG Chart Config
  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxSales = 500000;
  const maxOrders = 250;

  const getX = (idx) => paddingLeft + idx * (chartWidth / 4);
  const getY = (val, maxVal) => svgHeight - paddingBottom - (val / maxVal) * chartHeight;

  // Path coordinates
  const pathSales = salesData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val, maxSales)}`).join(' ');
  const pathOrders = ordersData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val, maxOrders)}`).join(' ');

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Business Reports</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Reports</p>
        </div>
        
        {/* Timeframe Dropdown */}
        <div className="relative">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EAE3DC] hover:border-[#B07E5D] rounded-lg text-gray-650 font-semibold transition-colors outline-none cursor-pointer"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total revenue */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Gross Sales</p>
            <h3 className="text-lg font-bold text-gray-900">₹12,45,650</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 18.6% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiDollarSign size={18} />
          </div>
        </div>

        {/* Total orders */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Completed Orders</p>
            <h3 className="text-lg font-bold text-gray-900">1,245</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 12.4% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiClipboard size={18} />
          </div>
        </div>

        {/* Total customers */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Customer Signups</p>
            <h3 className="text-lg font-bold text-gray-900">3,568</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 10.2% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiUsers size={18} />
          </div>
        </div>

        {/* Refund volume */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Total Refunds</p>
            <h3 className="text-lg font-bold text-rose-600">₹15,220</h3>
            <span className="text-[10px] text-rose-500 font-bold">↓ 3.2% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
            <FiTrendingUp size={18} />
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F5ECE5] mb-6">
          <h3 className="text-sm font-bold text-gray-905">Sales vs Orders Line Graph</h3>
          <div className="flex gap-4 text-[10px] font-bold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#B07E5D] rounded-full inline-block" /> Sales Amount</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#6B8B9B] rounded-full inline-block" /> Order Volume</span>
          </div>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid lines */}
            {[0, 100000, 200000, 300000, 400000, 500000].map((grid, i) => {
              const y = getY(grid, maxSales);
              return (
                <g key={i} className="opacity-40">
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#EAE3DC" strokeWidth="1" />
                  <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fontSize="9" className="fill-gray-400 font-bold">
                    ₹{grid / 1000}k
                  </text>
                </g>
              );
            })}

            {/* Sales Line */}
            <path d={pathSales} fill="none" stroke="#B07E5D" strokeWidth="2.5" strokeLinecap="round" />
            {salesData.map((val, idx) => (
              <circle 
                key={idx} 
                cx={getX(idx)} 
                cy={getY(val, maxSales)} 
                r={hoveredIdx === idx ? 5 : 3.5} 
                fill="white" 
                stroke="#B07E5D" 
                strokeWidth={hoveredIdx === idx ? 3.5 : 2}
                className="cursor-pointer" 
                onMouseEnter={() => setHoveredIdx(idx)}
              />
            ))}

            {/* Orders Line */}
            <path d={pathOrders} fill="none" stroke="#6B8B9B" strokeWidth="2" strokeDasharray="3 3" />
            {ordersData.map((val, idx) => (
              <circle 
                key={idx} 
                cx={getX(idx)} 
                cy={getY(val, maxOrders)} 
                r={hoveredIdx === idx ? 5 : 3.5} 
                fill="white" 
                stroke="#6B8B9B" 
                strokeWidth={hoveredIdx === idx ? 3 : 1.5}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
              />
            ))}

            {/* X Axis labels */}
            {chartWeeks.map((week, idx) => (
              <text key={idx} x={getX(idx)} y={svgHeight - 8} textAnchor="middle" fontSize="9" className="fill-gray-400 font-bold">
                {week}
              </text>
            ))}

            {/* Vertical indicator line */}
            {hoveredIdx !== null && (
              <line x1={getX(hoveredIdx)} y1={paddingTop} x2={getX(hoveredIdx)} y2={svgHeight - paddingBottom} stroke="#B07E5D" strokeWidth="1" strokeDasharray="3 3" className="opacity-40" />
            )}

            {/* Tooltip */}
            {hoveredIdx !== null && (
              <g transform={`translate(${getX(hoveredIdx) - 50}, ${getY(salesData[hoveredIdx], maxSales) - 48})`}>
                <rect width="100" height="40" rx="6" fill="white" stroke="#EAE3DC" strokeWidth="1.5" className="filter drop-shadow-md" />
                <text x="50" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-900">
                  ₹{salesData[hoveredIdx].toLocaleString('en-IN')}
                </text>
                <text x="50" y="28" textAnchor="middle" fontSize="8" className="fill-gray-400 font-bold">
                  {ordersData[hoveredIdx]} Orders
                </text>
              </g>
            )}
          </svg>

          {/* Hit Detection overlay */}
          <div className="absolute inset-y-0 left-0 right-0 flex pl-[50px] pr-[30px] pb-[30px] pt-[20px] pointer-events-none">
            {chartWeeks.map((_, idx) => (
              <div 
                key={idx}
                className="flex-1 h-full pointer-events-auto cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Reports;
