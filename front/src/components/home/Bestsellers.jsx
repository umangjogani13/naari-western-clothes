import React from 'react';
import { BESTSELLERS as DEFAULT_BESTSELLERS } from './homeData';

function Bestsellers({ bestsellers = DEFAULT_BESTSELLERS }) {
  return (
    <section className="bg-white py-16 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
            BESTSELLERS
          </h2>
          <a 
            href="/shop" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
          >
            VIEW ALL
          </a>
        </div>

        {/* Grid of circle items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {bestsellers.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[160px]">
              {/* Circular image with rank badge */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gray-50 border border-gray-100/60 shadow-sm mb-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Rank Badge */}
                <div className="absolute top-1 left-1 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#C3A389] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">
                  {index + 1}
                </div>
              </div>

              {/* Meta details */}
              <h3 className="text-xs sm:text-[13px] font-medium text-gray-900 group-hover:text-rose-600 transition-colors tracking-wide line-clamp-1 px-1">
                {item.name}
              </h3>
              <span className="text-xs sm:text-sm font-bold text-gray-950 mt-0.5">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Bestsellers;
