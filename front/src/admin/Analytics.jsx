import React, { useState } from 'react';
import { 
  FiEye, 
  FiTrendingUp, 
  FiClock, 
  FiActivity 
} from 'react-icons/fi';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [hoveredIdx, setHoveredIdx] = useState(3);

  // Visitors data
  const visitorDays = ['01 May', '08 May', '15 May', '22 May', '29 May'];
  const visitorsThisMonth = [15000, 28000, 23567, 34890, 42000];

  // SVG Chart Configurations
  const svgWidth = 550;
  const svgHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxVisitors = 50000;

  const getX = (idx) => paddingLeft + idx * (chartWidth / 4);
  const getY = (val) => svgHeight - paddingBottom - (val / maxVisitors) * chartHeight;

  // Path coordinates
  const pathVisitors = visitorsThisMonth.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`).join(' ');
  const areaVisitors = `${pathVisitors} L ${getX(4)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  // Donut variables for Traffic Source
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~314.16
  const getDonutProps = (ratio, cumulativeOffset) => {
    return {
      strokeDasharray: `${ratio * donutCircumference} ${donutCircumference}`,
      strokeDashoffset: -cumulativeOffset * donutCircumference
    };
  };

  const trafficSources = [
    { label: 'Search Engine', count: '14,890', percent: 45, color: 'bg-[#8C6239]', stroke: '#8C6239' },
    { label: 'Direct Traffic', count: '9,926', percent: 30, color: 'bg-[#B07E5D]', stroke: '#B07E5D' },
    { label: 'Social Media', count: '4,963', percent: 15, color: 'bg-[#6B8B9B]', stroke: '#6B8B9B' },
    { label: 'Referrals', count: '3,308', percent: 10, color: 'bg-[#D6D6D6]', stroke: '#D6D6D6' }
  ];

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Web Analytics</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Analytics</p>
        </div>
        
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 bg-white border border-[#EAE3DC] hover:border-[#B07E5D] rounded-lg text-gray-650 font-semibold transition-colors outline-none cursor-pointer"
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Visitors */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Total Visitors</p>
            <h3 className="text-lg font-bold text-gray-900">33,087</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 15.2% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiActivity size={18} />
          </div>
        </div>

        {/* Page views */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Page Views</p>
            <h3 className="text-lg font-bold text-gray-900">1,45,690</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 12.8% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiEye size={18} />
          </div>
        </div>

        {/* Bounce rate */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Bounce Rate</p>
            <h3 className="text-lg font-bold text-rose-500">32.45%</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↓ 0.8% drop (positive)</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiTrendingUp size={18} />
          </div>
        </div>

        {/* Session duration */}
        <div className="bg-white border border-[#EAE3DC] rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Avg. Session</p>
            <h3 className="text-lg font-bold text-gray-900">02:45 min</h3>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 6.2% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-[#FAF4EE] text-[#8C6239] rounded-full flex items-center justify-center shrink-0">
            <FiClock size={18} />
          </div>
        </div>

      </div>

      {/* Grid for graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visitors line chart */}
        <div className="lg:col-span-8 bg-white border border-[#EAE3DC] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-905 border-b border-[#F5ECE5] pb-3 mb-6">Visitors Overview</h3>
          
          <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
              {/* Grids */}
              {[0, 10000, 20000, 30000, 40000, 50000].map((grid, i) => {
                const y = getY(grid);
                return (
                  <g key={i} className="opacity-45">
                    <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#EAE3DC" strokeWidth="1" />
                    <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fontSize="9" className="fill-gray-400 font-bold">
                      {grid / 1000}k
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <defs>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B07E5D" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#B07E5D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaVisitors} fill="url(#visitorsGrad)" />

              {/* Visitors Path */}
              <path d={pathVisitors} fill="none" stroke="#B07E5D" strokeWidth="2.5" strokeLinecap="round" />
              {visitorsThisMonth.map((val, idx) => (
                <circle 
                  key={idx} 
                  cx={getX(idx)} 
                  cy={getY(val)} 
                  r={hoveredIdx === idx ? 5.5 : 3.5} 
                  fill="white" 
                  stroke="#B07E5D" 
                  strokeWidth={hoveredIdx === idx ? 3.5 : 2}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}

              {/* X labels */}
              {visitorDays.map((day, idx) => (
                <text key={idx} x={getX(idx)} y={svgHeight - 8} textAnchor="middle" fontSize="9" className="fill-gray-400 font-bold">
                  {day}
                </text>
              ))}

              {/* Hover indicator line */}
              {hoveredIdx !== null && (
                <line x1={getX(hoveredIdx)} y1={paddingTop} x2={getX(hoveredIdx)} y2={svgHeight - paddingBottom} stroke="#B07E5D" strokeWidth="1" strokeDasharray="3 3" className="opacity-40" />
              )}

              {/* Tooltip */}
              {hoveredIdx !== null && (
                <g transform={`translate(${getX(hoveredIdx) - 45}, ${getY(visitorsThisMonth[hoveredIdx]) - 46})`}>
                  <rect width="90" height="38" rx="6" fill="white" stroke="#EAE3DC" strokeWidth="1.5" className="filter drop-shadow-md" />
                  <text x="45" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-gray-900 font-sans">
                    {visitorsThisMonth[hoveredIdx].toLocaleString()}
                  </text>
                  <text x="45" y="28" textAnchor="middle" fontSize="8" className="fill-gray-400 font-bold font-sans">
                    Visitors
                  </text>
                </g>
              )}
            </svg>

            {/* Hit detector */}
            <div className="absolute inset-y-0 left-0 right-0 flex pl-[40px] pr-[20px] pb-[25px] pt-[15px] pointer-events-none">
              {visitorDays.map((_, idx) => (
                <div 
                  key={idx}
                  className="flex-1 h-full pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources ring chart */}
        <div className="lg:col-span-4 bg-white border border-[#EAE3DC] rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-955 border-b border-[#F5ECE5] pb-3 mb-6">Traffic Source</h3>
          
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* Donut drawing */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                {/* Search (45%) */}
                <circle cx="65" cy="65" r={donutRadius} fill="transparent" stroke="#8C6239" strokeWidth="12" {...getDonutProps(0.45, 0)} />
                {/* Direct (30%) */}
                <circle cx="65" cy="65" r={donutRadius} fill="transparent" stroke="#B07E5D" strokeWidth="12" {...getDonutProps(0.3, 0.45)} />
                {/* Social (15%) */}
                <circle cx="65" cy="65" r={donutRadius} fill="transparent" stroke="#6B8B9B" strokeWidth="12" {...getDonutProps(0.15, 0.45 + 0.3)} />
                {/* Referral (10%) */}
                <circle cx="65" cy="65" r={donutRadius} fill="transparent" stroke="#D6D6D6" strokeWidth="12" {...getDonutProps(0.10, 0.45 + 0.3 + 0.15)} />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-gray-900 leading-none">33K</span>
                <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider mt-1.5">Total Hits</span>
              </div>
            </div>

            {/* Source breakdown items */}
            <div className="w-full space-y-2 text-xs">
              {trafficSources.map((source, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${source.color}`} />
                    <span className="font-semibold text-gray-600">{source.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {source.count}{' '}
                    <span className="text-gray-400 font-semibold ml-0.5">({source.percent}%)</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
