import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiHeart, 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiHeart as FiHeartOutline
} from 'react-icons/fi';
import { FaStar, FaInstagram } from 'react-icons/fa';

// Fallback products matching the design exactly in case backend is not running
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    category: "Tops",
    price: 1499,
    image: "/images/prod_shirt.jpg",
    tag: "New In",
    rating: 5.0,
    reviewsCount: 68,
    colors: ["#E8DCC4", "#FFFFFF", "#8C8C8C"]
  },
  {
    id: 2,
    name: "Satin Midi Dress",
    category: "Dresses",
    price: 2299,
    image: "/images/prod_dress.jpg",
    tag: "Best Seller",
    rating: 5.0,
    reviewsCount: 124,
    colors: ["#A57B85", "#D8B4A0", "#6A4E42"]
  },
  {
    id: 3,
    name: "Wide Leg Jeans",
    category: "Jeans",
    price: 1999,
    image: "/images/prod_jeans.jpg",
    tag: "Trending",
    rating: 4.0,
    reviewsCount: 96,
    colors: ["#0F2C59", "#A5C9CA"]
  },
  {
    id: 4,
    name: "Ruched Crop Top",
    category: "Tops",
    price: 899,
    image: "/images/prod_top.jpg",
    tag: "Hot",
    rating: 5.0,
    reviewsCount: 58,
    colors: ["#FFFFFF", "#000000", "#7C96AB"]
  },
  {
    id: 5,
    name: "Blazer Co-ord Set",
    category: "Co-Ords",
    price: 2799,
    image: "/images/prod_blazer.jpg",
    tag: "Trending",
    rating: 5.0,
    reviewsCount: 73,
    colors: ["#5C3D2E", "#D5C5B5"]
  },
  {
    id: 6,
    name: "Cut-Out Maxi Dress",
    category: "Dresses",
    price: 2499,
    image: "/images/prod_maxi.jpg",
    tag: "Limited",
    rating: 4.0,
    reviewsCount: 45,
    colors: ["#FFFFFF", "#F5F5DC"]
  }
];

const CATEGORIES = [
  { name: 'Dresses', image: '/images/cat_dresses.jpg', link: '#dresses' },
  { name: 'Tops', image: '/images/cat_tops.jpg', link: '#tops' },
  { name: 'Jeans', image: '/images/cat_jeans.jpg', link: '#jeans' },
  { name: 'Skirts', image: '/images/cat_skirts.jpg', link: '#skirts' },
  { name: 'Co-Ord Sets', image: '/images/cat_coords.jpg', link: '#co-ords' },
];

const INSTAGRAM_POSTS = [
  { id: 1, image: "/images/insta_1.jpg" },
  { id: 2, image: "/images/insta_2.jpg" },
  { id: 3, image: "/images/insta_3.jpg" },
  { id: 4, image: "/images/insta_4.jpg" },
  { id: 5, image: "/images/insta_5.jpg" },
  { id: 6, image: "/images/insta_6.jpg" },
  { id: 7, image: "/images/insta_7.jpg" }
];

function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [heroSlide, setHeroSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/products');
        if (response && response.success && Array.isArray(response.products)) {
          // If server products load, merge with fallback fields like color/reviews count
          const merged = response.products.map(p => {
            const fb = FALLBACK_PRODUCTS.find(f => f.name.toLowerCase() === p.name.toLowerCase()) || {};
            return {
              ...p,
              reviewsCount: p.reviewsCount || fb.reviewsCount || 50,
              colors: p.colors || fb.colors || ["#FFFFFF", "#000000"]
            };
          });
          setProducts(merged.slice(0, 6));
        }
      } catch (err) {
        console.warn('Backend API offline. Using fallback mock products.');
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full font-sans bg-white select-none">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[320px] sm:h-[480px] md:h-[620px] bg-[#EAE3DB] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between">
          
          {/* Left Text Content */}
          <div className="w-full md:w-1/2 px-6 sm:px-12 md:px-20 lg:px-24 flex flex-col justify-center z-10 text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-700 font-semibold mb-2 sm:mb-4">
              NEW COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-tight text-gray-900 tracking-wide mb-3 sm:mb-6">
              YOUR STYLE.<br />
              YOUR STORY.
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 font-light leading-relaxed tracking-wide mb-6 sm:mb-8 max-w-sm">
              Effortless fits for every you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a 
                href="#new-arrivals" 
                className="bg-black hover:bg-rose-600 text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase py-3 sm:py-4 px-6 sm:px-8 text-center transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap"
              >
                SHOP NEW ARRIVALS
              </a>
              <a 
                href="#categories" 
                className="border border-black text-black hover:bg-black hover:text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase py-3 sm:py-4 px-6 sm:px-8 text-center transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                EXPLORE COLLECTION
              </a>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="hidden md:block w-1/2 h-full relative">
            <img 
              src="/images/hero_banner.jpg" 
              alt="Lavera Collection" 
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Fade from beige to image */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#EAE3DB] to-transparent pointer-events-none" />
          </div>

          {/* Mobile Image Overlay (Becomes background) */}
          <div className="md:hidden absolute inset-0 opacity-20 pointer-events-none">
            <img 
              src="/images/hero_banner.jpg" 
              alt="Lavera Collection Background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Hero Slider Dots (matches image dots) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
          {[0, 1, 2].map((idx) => (
            <button 
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                heroSlide === idx ? 'bg-black w-6' : 'bg-black/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Category Grid Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, i) => (
            <div 
              key={i} 
              className="bg-white border border-gray-100 flex flex-col items-center group cursor-pointer"
            >
              {/* Category Image */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-gray-50 relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Title & Link */}
              <div className="py-4 text-center w-full">
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-900 uppercase">
                  {cat.name}
                </h3>
                <a 
                  href={cat.link}
                  className="inline-block text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-black uppercase tracking-widest mt-1 border-b border-transparent hover:border-black transition-all duration-200"
                >
                  SHOP NOW
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section id="new-arrivals" className="bg-[#ffffff] py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-gray-900">
              NEW ARRIVALS
            </h2>
            <a 
              href="#view-all" 
              className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 border-b border-black hover:border-rose-600 transition-colors"
            >
              VIEW ALL
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex flex-col space-y-4">
                  <div className="aspect-[3/4] w-full bg-gray-100 animate-pulse rounded-sm" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {products.map((product) => {
                const isFavorite = !!favorites[product.id];
                const activeColor = selectedColors[product.id] || (product.colors && product.colors[0]);

                return (
                  <div 
                    key={product.id} 
                    className="group flex flex-col relative bg-white transition-all duration-300"
                  >
                    {/* Relative Image Wrapper */}
                    <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Heart Icon Button */}
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                        aria-label="Add to Wishlist"
                      >
                        {isFavorite ? (
                          <FiHeart className="w-4.5 h-4.5 text-rose-600 fill-rose-600" />
                        ) : (
                          <FiHeartOutline className="w-4.5 h-4.5 text-gray-600" />
                        )}
                      </button>

                      {/* Quick Add Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-[2px] py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex items-center justify-center">
                        <button className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-rose-600 transition-colors w-full h-full">
                          QUICK ADD +
                        </button>
                      </div>
                    </div>

                    {/* Product Meta Info */}
                    <div className="flex flex-col text-left space-y-1 px-1">
                      <h3 className="text-xs sm:text-[13px] font-medium tracking-wide text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <span className="text-xs sm:text-sm font-bold text-gray-950">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>

                      {/* Stars & Rating */}
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-light">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      {/* Color Selector Dots */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1.5 pt-1.5">
                          {product.colors.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => handleColorSelect(product.id, color)}
                              className={`w-3.5 h-3.5 rounded-full border transition-all ${
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
      </section>

      {/* 4. Promo Twin Banners Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Promo Card 1: The Weekend Edit */}
          <div className="bg-[#EFEBE4] rounded-sm overflow-hidden flex h-[280px] sm:h-[360px] md:h-[400px]">
            {/* Left Content */}
            <div className="w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center items-start text-left">
              <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl text-gray-900 tracking-wide leading-tight mb-2 sm:mb-4">
                THE WEEKEND EDIT
              </h3>
              <p className="text-[11px] sm:text-sm text-gray-500 font-light leading-relaxed mb-6 sm:mb-8">
                Effortless outfits for every plan.
              </p>
              <a 
                href="#shop-edit" 
                className="border border-black text-black hover:bg-black hover:text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3 px-5 sm:px-7 transition-all duration-300"
              >
                SHOP THE EDIT
              </a>
            </div>
            {/* Right Image */}
            <div className="w-1/2 h-full overflow-hidden relative">
              <img 
                src="/images/promo_weekend.jpg" 
                alt="The Weekend Edit" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Promo Card 2: Shop The Look */}
          <div className="bg-[#E3E8E3] rounded-sm overflow-hidden flex h-[280px] sm:h-[360px] md:h-[400px]">
            {/* Left Content */}
            <div className="w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center items-start text-left">
              <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl text-gray-900 tracking-wide leading-tight mb-2 sm:mb-4">
                SHOP THE LOOK
              </h3>
              <p className="text-[11px] sm:text-sm text-gray-500 font-light leading-relaxed mb-6 sm:mb-8">
                Curated pieces, perfectly paired for you.
              </p>
              <a 
                href="#shop-look" 
                className="border border-black text-black hover:bg-black hover:text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3 px-5 sm:px-7 transition-all duration-300"
              >
                SHOP THE LOOK
              </a>
            </div>
            {/* Right Image with interactive price hotspot pins */}
            <div className="w-1/2 h-full overflow-hidden relative group">
              <img 
                src="/images/promo_look.jpg" 
                alt="Shop The Look" 
                className="w-full h-full object-cover object-top"
              />
              
              {/* Hotspot 1 (Top) */}
              <div className="absolute top-[25%] right-[30%] group-hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white animate-ping absolute" />
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white relative z-10" />
                  {/* Tooltip badge */}
                  <div className="absolute left-4 -top-3 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 px-2 py-1 rounded shadow-sm border border-gray-100 tracking-wider whitespace-nowrap">
                    Top <span className="text-gray-500 font-normal">₹999</span>
                  </div>
                </div>
              </div>

              {/* Hotspot 2 (Jeans) */}
              <div className="absolute top-[52%] left-[32%] group-hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white animate-ping absolute" />
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white relative z-10" />
                  {/* Tooltip badge */}
                  <div className="absolute left-4 -top-3 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 px-2 py-1 rounded shadow-sm border border-gray-100 tracking-wider whitespace-nowrap">
                    Jeans <span className="text-gray-500 font-normal">₹1,799</span>
                  </div>
                </div>
              </div>

              {/* Hotspot 3 (Bag) */}
              <div className="absolute bottom-[28%] right-[22%] group-hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white animate-ping absolute" />
                  <div className="w-2.5 h-2.5 bg-black rounded-full border border-white relative z-10" />
                  {/* Tooltip badge */}
                  <div className="absolute left-4 -top-3 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 px-2 py-1 rounded shadow-sm border border-gray-100 tracking-wider whitespace-nowrap">
                    Bag <span className="text-gray-500 font-normal">₹1,299</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Features / Value Prop Bar */}
      <section className="bg-white border-y border-gray-100 py-12 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Prop 1 */}
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-gray-50 text-gray-900 rounded-full">
                <FiTruck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-gray-900">
                  FREE SHIPPING
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mt-0.5">
                  On orders above ₹999
                </p>
              </div>
            </div>

            {/* Prop 2 */}
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-gray-50 text-gray-900 rounded-full">
                <FiRefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-gray-900">
                  EASY RETURNS
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mt-0.5">
                  7-day return policy
                </p>
              </div>
            </div>

            {/* Prop 3 */}
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-gray-50 text-gray-900 rounded-full">
                <FiShield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-gray-900">
                  SECURE PAYMENT
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mt-0.5">
                  100% secure checkout
                </p>
              </div>
            </div>

            {/* Prop 4 */}
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-gray-50 text-gray-900 rounded-full">
                <FiHeartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-gray-900">
                  BEST QUALITY
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mt-0.5">
                  Handpicked just for you
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Instagram Feed Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase">
            FROM INSTAGRAM
          </h3>
          <p className="text-xs text-gray-400 font-light uppercase tracking-widest mt-1 mb-8">
            Tag us @laverafashion to get featured
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {INSTAGRAM_POSTS.map((post) => (
              <div 
                key={post.id} 
                className="relative aspect-square w-full bg-gray-50 overflow-hidden group cursor-pointer"
              >
                <img 
                  src={post.image} 
                  alt={`Instagram frame ${post.id}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Instagram Hover Icon Overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                  <FaInstagram className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-[#DFD7CD] rounded-sm overflow-hidden flex flex-col md:flex-row items-center h-auto md:h-[240px] relative px-6 py-8 md:py-0">
          
          {/* Cutout model image overlapping (absolute placement on desktop, hidden or side block on mobile) */}
          <div className="hidden md:block absolute left-12 bottom-0 w-[180px] h-[260px] pointer-events-none">
            <img 
              src="/images/newsletter_model.jpg" 
              alt="Model Style Club" 
              className="w-full h-full object-cover object-top scale-x-[-1] rounded-t-full shadow-lg border-2 border-white/60"
            />
          </div>

          {/* Left Text Block */}
          <div className="w-full md:w-1/2 md:pl-[240px] text-left flex flex-col justify-center space-y-2">
            <h3 className="text-lg sm:text-2xl font-bold tracking-[0.18em] text-gray-900 uppercase">
              JOIN THE STYLE CLUB
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-600 font-light leading-relaxed max-w-md">
              Get 10% OFF your first order and be the first to know about new arrivals & exclusive offers.
            </p>
          </div>

          {/* Right Input Form */}
          <div className="w-full md:w-1/2 flex items-center justify-start md:justify-end mt-6 md:mt-0 md:pr-12">
            {isSubscribed ? (
              <div className="bg-white/90 backdrop-blur-sm text-black border border-white text-xs font-bold tracking-widest uppercase py-3 px-8 text-center rounded shadow-sm w-full md:w-auto">
                THANK YOU FOR JOINING!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md border border-white/40 bg-white">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-light tracking-wide outline-none placeholder-gray-400 text-gray-800"
                />
                <button 
                  type="submit"
                  className="bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase px-6 sm:px-8 py-3.5 transition-colors duration-300"
                >
                  JOIN
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
