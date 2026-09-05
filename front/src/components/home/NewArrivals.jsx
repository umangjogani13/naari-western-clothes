import React, { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiHeart as FiHeartOutline } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { FALLBACK_PRODUCTS } from './homeData';

function NewArrivals({ products = FALLBACK_PRODUCTS, loading = false }) {
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const newArrivalsRef = useRef(null);

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleColorSelect = (productId, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const scrollContainer = (direction) => {
    if (newArrivalsRef.current) {
      const { scrollLeft, clientWidth } = newArrivalsRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      newArrivalsRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="new-arrivals" className="bg-[#ffffff] py-16 border-t border-gray-50 relative group/new">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
            NEW ARRIVALS
          </h2>
          <a 
            href="/shop" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
          >
            VIEW ALL
          </a>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scrollContainer('left')}
            className="absolute -left-4 top-[35%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/new:opacity-100 z-10 duration-300"
            aria-label="Scroll left new arrivals"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => scrollContainer('right')}
            className="absolute -right-4 top-[35%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/new:opacity-100 z-10 duration-300"
            aria-label="Scroll right new arrivals"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="min-w-[160px] w-[200px] sm:w-[220px] flex flex-col space-y-4">
                  <div className="aspect-[3/4] w-full bg-gray-100 animate-pulse rounded-sm" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div 
              ref={newArrivalsRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4"
            >
              {products.map((product) => {
                const isFavorite = !!favorites[product.id];
                const activeColor = selectedColors[product.id] || (product.colors && product.colors[0]);

                return (
                  <div 
                    key={product.id} 
                    className="min-w-[160px] w-[200px] sm:w-[220px] snap-start group flex flex-col relative bg-white transition-all duration-300"
                  >
                    {/* Image Wrapper */}
                    <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden mb-3 rounded-sm">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Wishlist Button */}
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2.5 right-2.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                        aria-label="Add to Wishlist"
                      >
                        {isFavorite ? (
                          <FiHeart className="w-4 h-4 text-rose-600 fill-rose-600" />
                        ) : (
                          <FiHeartOutline className="w-4 h-4 text-gray-600" />
                        )}
                      </button>

                      {/* Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[2px] py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex items-center justify-center cursor-pointer">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:text-rose-600 transition-colors w-full h-full">
                          QUICK ADD +
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col text-left space-y-1 px-0.5">
                      <h3 className="text-xs sm:text-[13px] font-medium tracking-wide text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <span className="text-xs sm:text-sm font-bold text-gray-950">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>

                      {/* Ratings */}
                      <div className="flex items-center space-x-1 pt-0.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-2.5 h-2.5 ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-gray-400 font-light">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      {/* Color Selector */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1.5 pt-1.5">
                          {product.colors.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => handleColorSelect(product.id, color)}
                              className={`w-3 h-3 rounded-full border transition-all ${
                                activeColor === color 
                                  ? 'border-black scale-110 shadow-sm' 
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={`Select Color ${color}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
