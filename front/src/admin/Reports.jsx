import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiClipboard, 
  FiUsers 
} from 'react-icons/fi';

const Reports = () => {
  const dispatch = useDispatch();
  const { stats, salesThisWeek } = useSelector((state) => state.dashboard);
  const { items: orders } = useSelector((state) => state.orders);

  const [timeframe, setTimeframe] = useState('This Month');
  const [hoveredIdx, setHoveredIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Dynamic Chart data from salesThisWeek
  const daysData = salesThisWeek && salesThisWeek.length > 0
    ? salesThisWeek
    : [
        { day: 'Mon', sales: 0 },
        { day: 'Tue', sales: 0 },
        { day: 'Wed', sales: 0 },
        { day: 'Thu', sales: 0 },
        { day: 'Fri', sales: 0 },
        { day: 'Sat', sales: 0 },
        { day: 'Sun', sales: 0 }
      ];

  const chartWeeks = daysData.map(d => d.day);
  const salesData = daysData.map(d => d.sales || 0);
  const ordersData = daysData.map(d => Math.round((d.sales || 0) / 2000));

  // SVG Chart Config
  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const calculatedMax = Math.max(...salesData, 10000);
  const maxSales = Math.ceil(calculatedMax / 10000) * 10000;
  const maxOrders = Math.max(...ordersData, 10);

  const numPoints = Math.max(1, chartWeeks.length - 1);
  const getX = (idx) => paddingLeft + idx * (chartWidth / numPoints);
  const getY = (val, maxVal) => svgHeight - paddingBottom - (val / (maxVal || 1)) * chartHeight;

  // Path coordinates
  const pathSales = salesData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val, maxSales)}`).join(' ');
  const pathOrders = ordersData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val, maxOrders)}`).join(' ');

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrdersCount = stats?.totalOrders || orders?.length || 0;
  const totalCustomersCount = stats?.totalCustomers || 0;
  const totalCancelledVal = Array.isArray(orders)
    ? orders.filter(o => o.status === 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0)
    : 0;

  return (
    <div className="space-y-6 text-xs select-none">
      
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
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total revenue */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Gross Sales</p>
            <h3 className="text-lg font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Dynamic Backend Metric</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiDollarSign size={18} />
          </div>
        </div>

        {/* Total orders */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Recorded Orders</p>
            <h3 className="text-lg font-bold text-gray-900">{totalOrdersCount}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">From Database</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiClipboard size={18} />
          </div>
        </div>

        {/* Total customers */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Customer Accounts</p>
            <h3 className="text-lg font-bold text-gray-900">{totalCustomersCount}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Registered Users</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiUsers size={18} />
          </div>
        </div>

        {/* Refund volume */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Cancelled Value</p>
            <h3 className="text-lg font-bold text-rose-600">₹{totalCancelledVal.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-rose-500 font-bold">From Cancelled Orders</span>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
            <FiTrendingUp size={18} />
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 shadow-xs">
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
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const gridVal = Math.round(ratio * maxSales);
              const y = getY(gridVal, maxSales);
              return (
                <g key={i} className="opacity-40">
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#EAE3DC" strokeWidth="1" />
                  <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fontSize="9" className="fill-gray-400 font-bold">
                    ₹{(gridVal / 1000).toFixed(0)}k
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
