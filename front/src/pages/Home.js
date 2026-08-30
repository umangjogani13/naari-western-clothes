import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiHeart, 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiHeart as FiHeartOutline,
  FiHeadphones,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiTrendingUp
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
    colors: ["#A57B85", "#D8B4A0", "#6A4E42", "#E5C4B4"]
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
    rating: 4.0,
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
    rating: 4.0,
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
    rating: 4.5,
    reviewsCount: 145,
    colors: ["#FFFFFF", "#F5F5DC", "#F9D5A5"]
  }
];

const CATEGORIES = [
  { name: 'Dresses', image: '/images/cat_dresses.jpg', link: '/category/dresses' },
  { name: 'Tops', image: '/images/cat_tops.jpg', link: '/category/tops' },
  { name: 'Jeans', image: '/images/cat_jeans.jpg', link: '/category/jeans' },
  { name: 'Co-Ord Sets', image: '/images/cat_coords.jpg', link: '/category/co-ords' },
  { name: 'Skirts', image: '/images/cat_skirts.jpg', link: '/category/skirts' },
  { name: 'Bottoms', image: '/images/newsletter_model.jpg', link: '/category/bottoms' },
];

const BESTSELLERS = [
  { id: 2, name: "Satin Midi Dress", price: 2299, image: "/images/prod_dress.jpg" },
  { id: 3, name: "Wide Leg Jeans", price: 1999, image: "/images/prod_jeans.jpg" },
  { id: 1, name: "Oversized Cotton Shirt", price: 1499, image: "/images/prod_shirt.jpg" },
  { id: 7, name: "Linen Co-ord Set", price: 2799, image: "/images/cat_coords.jpg" },
  { id: 4, name: "Ruched Crop Top", price: 899, image: "/images/prod_top.jpg" },
  { id: 5, name: "Blazer Co-ord Set", price: 2799, image: "/images/prod_blazer.jpg" },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Aashi Shah",
    stars: 5,
    comment: "Absolutely love the quality and fit! LAVÉRA never disappoints."
  },
  {
    id: 2,
    name: "Riya Mehta",
    stars: 5,
    comment: "Fast delivery and amazing customer support."
  },
  {
    id: 3,
    name: "Neha Joshi",
    stars: 5,
    comment: "My new favorite store for every occasion."
  }
];

const INSTAGRAM_POSTS = [
  { id: 1, image: "/images/insta_1.jpg" },
  { id: 2, image: "/images/insta_2.jpg" },
  { id: 3, image: "/images/insta_3.jpg" },
  { id: 4, image: "/images/insta_4.jpg" },
  { id: 5, image: "/images/insta_5.jpg" },
  { id: 6, image: "/images/insta_6.jpg" },
  { id: 7, image: "/images/insta_7.jpg" },
  { id: 8, image: "/images/newsletter_model.jpg" }
];

const BLOG_POSTS = [
  {
    id: 1,
    date: "20 May, 2024",
    title: "5 Ways to Style Wide Leg Jeans This Summer",
    image: "/images/cat_jeans.jpg",
    link: "#"
  },
  {
    id: 2,
    date: "15 May, 2024",
    title: "Summer Wardrobe Essentials You Need",
    image: "/images/promo_weekend.jpg",
    link: "#"
  },
  {
    id: 3,
    date: "10 May, 2024",
    title: "How to Build the Perfect Capsule Wardrobe",
    image: "/images/promo_look.jpg",
    link: "#"
  }
];

function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [heroSlide, setHeroSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const categoryRef = useRef(null);
  const newArrivalsRef = useRef(null);
  const instaRef = useRef(null);

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

  // Auto-scroll Hero Slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
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

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      ref.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full font-sans bg-white select-none overflow-x-hidden">
      
      {/* 1. Hero Section Slider */}
      <section className="relative w-full h-[320px] sm:h-[480px] md:h-[620px] bg-[#EAE3DB] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between">
          
          {/* Left Text Content */}
          <div className="w-full md:w-1/2 px-6 sm:px-12 md:px-20 lg:px-24 flex flex-col justify-center z-10 text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-700 font-semibold mb-2 sm:mb-4 animate-fade-in">
              NEW COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-tight text-gray-900 tracking-wide mb-3 sm:mb-6 uppercase">
              YOUR STYLE.<br />
              YOUR STORY.
            </h1>
            <p className="text-xs sm:text-base text-gray-600 font-light leading-relaxed tracking-wide mb-6 sm:mb-8 max-w-sm">
              Effortless fits for every you.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4">
              <a 
                href="#new-arrivals" 
                className="bg-black hover:bg-rose-600 text-[9px] sm:text-[11px] text-white font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3.5 px-4 sm:px-6 text-center transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap"
              >
                SHOP NEW ARRIVALS
              </a>
              <a 
                href="#categories" 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3.5 px-4 sm:px-6 text-center transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                EXPLORE COLLECTION
              </a>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="hidden md:block w-1/2 h-full relative">
            <div className="w-full h-full transition-opacity duration-1000 ease-in-out">
              <img 
                src="/images/hero_banner.jpg" 
                alt="Lavera Collection" 
                className="w-full h-full object-cover object-center"
              />
            </div>
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

        {/* Hero Slider Dots */}
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

      {/* 2. Value Prop Bar (5 columns) */}
      <section className="bg-white border-b border-gray-100 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4 sm:gap-6">
            
            {/* Prop 1 */}
            <div className="flex items-center space-x-3 justify-start md:justify-center">
              <FiTruck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                  FREE SHIPPING
                </h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                  On orders above ₹999
                </p>
              </div>
            </div>

            {/* Prop 2 */}
            <div className="flex items-center space-x-3 justify-start md:justify-center">
              <FiRefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                  EASY RETURNS
                </h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                  7-day return policy
                </p>
              </div>
            </div>

            {/* Prop 3 */}
            <div className="flex items-center space-x-3 justify-start md:justify-center">
              <FiShield className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                  SECURE PAYMENT
                </h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                  100% secure checkout
                </p>
              </div>
            </div>

            {/* Prop 4 */}
            <div className="flex items-center space-x-3 justify-start md:justify-center">
              <FiAward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                  BEST QUALITY
                </h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                  Handpicked just for you
                </p>
              </div>
            </div>

            {/* Prop 5 */}
            <div className="flex items-center space-x-3 justify-start md:justify-center col-span-2 md:col-span-1">
              <FiHeadphones className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                  CUSTOMER SUPPORT
                </h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                  We're here to help you
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Shop By Category (Scrollable layout) */}
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
            onClick={() => scrollContainer(categoryRef, 'left')}
            className="absolute -left-4 top-[40%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/section:opacity-100 z-10 duration-300"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => scrollContainer(categoryRef, 'right')}
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
            {CATEGORIES.map((cat, i) => (
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

      {/* 4. Triple Promo Banners Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1: Summer '24 Collection */}
          <div className="bg-[#EAE3DB] rounded-sm overflow-hidden flex h-[220px] sm:h-[260px] md:h-[230px] lg:h-[260px] shadow-sm">
            {/* Left Content */}
            <div className="w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-start text-left">
              <h3 className="font-serif text-base sm:text-lg lg:text-xl text-gray-950 font-medium tracking-wider leading-tight mb-2 uppercase">
                SUMMER '24 COLLECTION
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed mb-4 sm:mb-6">
                Light, Breezy, Effortless.
              </p>
              <a 
                href="/shop" 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300"
              >
                EXPLORE NOW
              </a>
            </div>
            {/* Right Image */}
            <div className="w-[45%] h-full overflow-hidden relative">
              <img 
                src="/images/cat_dresses.jpg" 
                alt="Summer '24 Collection" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Banner 2: The Weekend Edit */}
          <div className="bg-[#EFEBE4] rounded-sm overflow-hidden flex h-[220px] sm:h-[260px] md:h-[230px] lg:h-[260px] shadow-sm">
            {/* Left Content */}
            <div className="w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-start text-left">
              <h3 className="font-serif text-base sm:text-lg lg:text-xl text-gray-950 font-medium tracking-wider leading-tight mb-2 uppercase">
                THE WEEKEND EDIT
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed mb-4 sm:mb-6">
                Casual fits for your every plan.
              </p>
              <a 
                href="/shop" 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300"
              >
                SHOP THE EDIT
              </a>
            </div>
            {/* Right Image */}
            <div className="w-[45%] h-full overflow-hidden relative">
              <img 
                src="/images/promo_weekend.jpg" 
                alt="The Weekend Edit" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Banner 3: New In / Just Landed */}
          <div className="bg-[#E3E8E3] rounded-sm overflow-hidden flex h-[220px] sm:h-[260px] md:h-[230px] lg:h-[260px] shadow-sm">
            {/* Left Content */}
            <div className="w-[55%] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-start text-left">
              <h3 className="font-serif text-base sm:text-lg lg:text-xl text-gray-950 font-medium tracking-wider leading-tight mb-2 uppercase">
                NEW IN JUST LANDED
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed mb-4 sm:mb-6">
                Fresh styles you'll love.
              </p>
              <a 
                href="/shop" 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300"
              >
                DISCOVER NOW
              </a>
            </div>
            {/* Right Image */}
            <div className="w-[45%] h-full overflow-hidden relative">
              <img 
                src="/images/prod_blazer.jpg" 
                alt="New In / Just Landed" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. New Arrivals (Responsive Carousel) */}
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
              onClick={() => scrollContainer(newArrivalsRef, 'left')}
              className="absolute -left-4 top-[35%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/new:opacity-100 z-10 duration-300"
              aria-label="Scroll left new arrivals"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => scrollContainer(newArrivalsRef, 'right')}
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

      {/* 6. Bestsellers (Ranked Circular Items) */}
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
            {BESTSELLERS.map((item, index) => (
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

      {/* 7. Why Shop With Lavéra? */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="flex flex-col text-left space-y-6 md:pr-8">
              <div>
                <h2 className="text-xl sm:text-3xl font-serif font-normal tracking-[0.18em] text-gray-950 uppercase mb-2">
                  WHY SHOP WITH LAVÉRA?
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light uppercase tracking-widest">
                  Designed for you. Loved by thousands.
                </p>
              </div>

              {/* Stacked features */}
              <div className="space-y-6 pt-4">
                
                {/* Feature 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-gray-800 flex-shrink-0 mt-0.5">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900">
                      Premium Quality
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-1 leading-relaxed">
                      Finest fabrics, rigorous checking, and attention to detail in every single stitch.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#EAE8E3] flex items-center justify-center text-gray-800 flex-shrink-0 mt-0.5">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900">
                      Trendy Styles
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-1 leading-relaxed">
                      Stay ahead of the curve with our curated drops matching global aesthetics.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#E5ECE5] flex items-center justify-center text-gray-800 flex-shrink-0 mt-0.5">
                    <FiRefreshCw className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900">
                      Easy Returns
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-1 leading-relaxed">
                      We offer a hassle-free, no-questions-asked 7-day return and exchange policy.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Image Column */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] rounded-sm overflow-hidden bg-gray-50 shadow-sm">
              <img 
                src="/images/promo_look.jpg" 
                alt="Lavera Wardrobe Collection" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 8. What Our Customers Say (Testimonials) */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
              WHAT OUR CUSTOMERS SAY
            </h2>
            <a 
              href="#testimonials" 
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
            >
              VIEW ALL
            </a>
          </div>

          {/* Testimonial boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={t.id} 
                className="bg-[#FBFBFA] border border-gray-100/50 p-6 sm:p-8 rounded-sm shadow-sm hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between h-[180px] sm:h-[200px] md:h-[220px]"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex space-x-1 text-amber-400 mb-3 sm:mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <FaStar key={i} className="w-3.5 h-3.5" />
                    ))}
                  </div>
                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-gray-800 font-light italic leading-relaxed tracking-wide">
                    "{t.comment}"
                  </p>
                </div>
                {/* Author */}
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 mt-4">
                  {t.name}
                </h4>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  testimonialIndex === i ? 'bg-black w-4' : 'bg-black/20'
                }`}
                aria-label={`Go to Testimonial slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. Instagram Feed */}
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
              onClick={() => scrollContainer(instaRef, 'left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/insta:opacity-100 z-10 duration-300"
              aria-label="Scroll left instagram"
            >
              <FiChevronLeft className="w-4.5 h-4.5" />
            </button>
            
            <button 
              onClick={() => scrollContainer(instaRef, 'right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:text-rose-600 active:scale-95 transition-all opacity-0 group-hover/insta:opacity-100 z-10 duration-300"
              aria-label="Scroll right instagram"
            >
              <FiChevronRight className="w-4.5 h-4.5" />
            </button>

            {/* Square frames */}
            <div 
              ref={instaRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
            >
              {INSTAGRAM_POSTS.map((post) => (
                <div 
                  key={post.id} 
                  className="min-w-[130px] w-[140px] sm:w-[170px] md:w-[180px] snap-start relative aspect-square bg-gray-50 overflow-hidden group/item cursor-pointer rounded-sm flex-shrink-0"
                >
                  <img 
                    src={post.image} 
                    alt={`Instagram frame ${post.id}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                    loading="lazy"
                  />
                  {/* Instagram Hover Icon Overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                    <FaInstagram className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. From The Blog */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-lg sm:text-2xl font-serif font-medium tracking-[0.2em] text-gray-950 uppercase">
              FROM THE BLOG
            </h2>
            <a 
              href="/blog" 
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-rose-600 transition-colors border-b border-black hover:border-rose-600 pb-0.5"
            >
              VIEW ALL
            </a>
          </div>

          {/* Blog card list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <div key={post.id} className="group flex flex-col space-y-4 cursor-pointer text-left">
                {/* Image */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-50 rounded-sm">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                {/* Meta */}
                <div className="flex flex-col space-y-1.5 px-0.5">
                  <span className="text-[10px] sm:text-xs text-gray-400 font-light uppercase tracking-wider">
                    {post.date}
                  </span>
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <a 
                    href={post.link}
                    className="inline-flex items-center text-[10px] sm:text-xs font-bold text-gray-950 group-hover:text-rose-600 uppercase tracking-widest pt-2 transition-colors duration-200"
                  >
                    READ MORE <span className="ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. Join The Style Club (Newsletter Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-[#DFD7CD] rounded-sm overflow-hidden flex flex-col md:flex-row items-center h-auto md:h-[240px] relative px-6 py-8 md:py-0">
          
          {/* Overlapping model cut-out on desktop */}
          <div className="hidden md:block absolute left-12 bottom-0 w-[180px] h-[260px] pointer-events-none z-10">
            <img 
              src="/images/newsletter_model.jpg" 
              alt="Model Style Club" 
              className="w-full h-full object-cover object-top scale-x-[-1] rounded-t-full shadow-lg border-2 border-white/60"
            />
          </div>

          {/* Left Text Block */}
          <div className="w-full md:w-1/2 md:pl-[220px] text-left flex flex-col justify-center space-y-2">
            <h3 className="text-base sm:text-2xl font-bold tracking-[0.15em] text-gray-900 uppercase">
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
