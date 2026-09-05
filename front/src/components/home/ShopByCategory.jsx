import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CATEGORIES as DEFAULT_CATEGORIES } from './homeData';

function ShopByCategory({ categories = DEFAULT_CATEGORIES }) {
  const categoryRef = useRef(null);

  const scrollContainer = (direction) => {
    if (categoryRef.current) {
      const { scrollLeft, clientWidth } = categoryRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      categoryRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative group/section">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
          SHOP BY CATEGORY
        </h2>
        <a 
          href="#categories" 
          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
        >
          VIEW ALL
        </a>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scrollContainer('left')}
          className="absolute -left-4 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/section:opacity-100 z-10 duration-300"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => scrollContainer('right')}
          className="absolute -right-4 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/section:opacity-100 z-10 duration-300"
          aria-label="Scroll right"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>

        {/* Category List */}
        <div 
          ref={categoryRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4"
        >
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="min-w-[150px] w-[180px] sm:w-[220px] bg-white border border-gray-50 flex flex-col items-center group cursor-pointer snap-start"
            >
              {/* Category Image */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-gray-50 relative rounded-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Title & Link */}
              <div className="py-4 text-center w-full">
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-900 uppercase">
                  {cat.name}
                </h3>
                <a 
                  href={cat.link}
                  className="inline-block text-[9px] sm:text-[11px] font-semibold text-gray-400 hover:text-black uppercase tracking-widest mt-1.5 border-b border-transparent hover:border-black transition-all duration-200"
                >
                  SHOP NOW
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
