import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import { fetchInstagramPosts } from '../../store/slices/instagramSlice';

function InstagramFeed() {
  const dispatch = useDispatch();
  const { posts: feed = [], loading } = useSelector((state) => state.instagram || {});
  const instaRef = useRef(null);

  useEffect(() => {
    dispatch(fetchInstagramPosts());
  }, [dispatch]);

  const scrollContainer = (direction) => {
    if (instaRef.current) {
      const { scrollLeft, clientWidth } = instaRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      instaRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  // If no posts available from backend API, do not display section
  if (loading || !feed || feed.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-t border-gray-100 relative group/insta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h3 className="text-sm font-bold tracking-[0.25em] text-gray-900 uppercase">
          FROM INSTAGRAM
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-400 font-light uppercase tracking-widest mt-1 mb-8">
          Tag us @laverafashion to get featured
        </p>

        <div className="relative">
          {/* Scroll buttons */}
          <button 
            onClick={() => scrollContainer('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/insta:opacity-100 z-10 duration-300 cursor-pointer"
            aria-label="Scroll left instagram"
          >
            <FiChevronLeft className="w-4.5 h-4.5" />
          </button>
          
          <button 
            onClick={() => scrollContainer('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/insta:opacity-100 z-10 duration-300 cursor-pointer"
            aria-label="Scroll right instagram"
          >
            <FiChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Square frames */}
          <div 
            ref={instaRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
          >
            {feed.map((post, idx) => (
              <a 
                key={post._id || post.id || idx}
                href={post.postUrl || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="min-w-[130px] w-[140px] sm:w-[170px] md:w-[180px] snap-start relative aspect-square bg-gray-50 overflow-hidden group/item cursor-pointer rounded-sm flex-shrink-0"
              >
                <img 
                  src={post.image} 
                  alt={post.caption || `Instagram frame ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                  loading="lazy"
                />
                {/* Instagram Hover Icon Overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2 text-center">
                  <FaInstagram className="w-6 h-6 animate-pulse mb-1" />
                  {post.caption && (
                    <span className="text-[9px] text-white/90 line-clamp-2 leading-tight font-light">
                      {post.caption}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstagramFeed;
