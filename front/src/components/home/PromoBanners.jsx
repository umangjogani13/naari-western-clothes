import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../store/slices/bannerSlice';

function PromoBanners() {
  const dispatch = useDispatch();
  const { items: banners = [], loading } = useSelector((state) => state.banners || {});

  useEffect(() => {
    dispatch(fetchBanners('Promo Banner'));
  }, [dispatch]);

  // Display only when Promo Banner data is available from the backend; otherwise do not display
  if (loading || !banners || banners.length === 0) {
    return null;
  }

  const gridColsClass = 
    banners.length === 1 
      ? 'grid-cols-1 max-w-xl mx-auto' 
      : banners.length === 2 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-3';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
      <div className={`grid ${gridColsClass} gap-6`}>
        {banners.map((banner, index) => (
          <div 
            key={banner._id || banner.id || index}
            className="rounded-sm overflow-hidden flex h-[220px] sm:h-[260px] md:h-[230px] lg:h-[260px] shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: banner.bgColor || '#EAE3DB' }}
          >
            {/* Left Content */}
            <div className="w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-start text-left">
              {banner.tag && (
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
                  {banner.tag}
                </span>
              )}
              <h3 className="font-serif text-base sm:text-lg lg:text-xl text-gray-950 font-medium tracking-wider leading-tight mb-2 uppercase">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed mb-4 sm:mb-6 line-clamp-2">
                  {banner.subtitle}
                </p>
              )}
              <a 
                href={banner.link || '/shop'} 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300"
              >
                {banner.buttonText || 'EXPLORE NOW'}
              </a>
            </div>
            {/* Right Image */}
            <div className="w-[45%] h-full overflow-hidden relative">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PromoBanners;
