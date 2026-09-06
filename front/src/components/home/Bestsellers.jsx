import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { BESTSELLERS as DEFAULT_BESTSELLERS } from './homeData';

function Bestsellers({ bestsellers: initialBestsellers }) {
  const [items, setItems] = useState(initialBestsellers || DEFAULT_BESTSELLERS);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        // Try fetching products marked as bestseller
        const res = await axiosClient.get('/products?bestseller=true&limit=6');
        if (res && res.success && Array.isArray(res.products) && res.products.length >= 3) {
          setItems(res.products.slice(0, 6));
        } else {
          // If fewer than 3 marked as bestsellers, fetch top selling products
          const popularRes = await axiosClient.get('/products?sort=popular&limit=6');
          if (popularRes && popularRes.success && Array.isArray(popularRes.products) && popularRes.products.length > 0) {
            setItems(popularRes.products.slice(0, 6));
          }
        }
      } catch (err) {
        console.warn('Bestsellers API offline, using fallback catalog.');
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <section className="bg-white py-16 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
            BESTSELLERS
          </h2>
          <Link 
            to="/shop" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
          >
            VIEW ALL
          </Link>
        </div>

        {/* Grid of ranked circular items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {items.map((item, index) => {
            const productTarget = `/product/${item._id || item.id}`;
            const displayPrice = item.salePrice || item.price || 1499;

            return (
              <Link 
                key={item._id || item.id || index}
                to={productTarget}
                className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[160px]"
              >
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
                  ₹{Number(displayPrice).toLocaleString('en-IN')}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Bestsellers;
