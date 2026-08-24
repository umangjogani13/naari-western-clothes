import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, 
  FiTruck, 
  FiMapPin, 
  FiTag, 
  FiPackage, 
  FiInfo, 
  FiAlertTriangle, 
  FiRotateCcw, 
  FiLock, 
  FiHeart
} from 'react-icons/fi';

const SHIPPING_POINTS = [
  {
    number: "1",
    title: "PROCESSING TIME",
    description: "Orders are processed within 1-2 business days (excluding weekends and holidays).",
    icon: <FiClock className="w-5 h-5" />
  },
  {
    number: "2",
    title: "SHIPPING TIME",
    description: "Domestic orders are typically delivered within 3-7 business days, depending on your location.",
    icon: <FiTruck className="w-5 h-5" />
  },
  {
    number: "3",
    title: "SHIPPING AREAS",
    description: "We currently ship across all major cities and towns in India. Remote areas may take a little longer.",
    icon: <FiMapPin className="w-5 h-5" />
  },
  {
    number: "4",
    title: "SHIPPING CHARGES",
    description: "Free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 will be applied.",
    icon: <FiTag className="w-5 h-5" />
  },
  {
    number: "5",
    title: "ORDER TRACKING",
    description: "Once your order is shipped, you will receive an email/SMS with your tracking details.",
    icon: <FiPackage className="w-5 h-5" />
  },
  {
    number: "6",
    title: "DELAYS",
    description: "While we ensure timely delivery, delays may occur due to unforeseen circumstances or courier issues.",
    icon: <FiInfo className="w-5 h-5" />
  }
];

function ShippingPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Shipping Policy</span>
      </nav>

      {/* Top Banner (Split layout matching mockup) */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-4 leading-snug">
              Shipping Policy
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed tracking-wide max-w-xl">
              We deliver your style, safely and on time. Here's everything you need to know about our shipping.
            </p>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 h-[240px] md:h-[320px] w-full">
            <img 
              src="/images/promo_weekend.jpg" 
              alt="Shipping Policy Look" 
              className="w-full h-full object-cover object-center filter contrast-[0.98] brightness-[0.98]" 
            />
          </div>

        </div>
      </div>

      {/* Shipping points grid (2-column layout matching mockup) */}
      <div className="max-w-4xl mx-auto my-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {SHIPPING_POINTS.map((point) => (
            <div key={point.number} className="flex gap-5 items-start group text-left">
              
              {/* Left Circular Outline Icon */}
              <div className="w-11 h-11 rounded-full border border-gray-200/80 bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-[#C6A482] group-hover:bg-white">
                {point.icon}
              </div>

              {/* Right Text details */}
              <div className="flex-1">
                <h3 className="font-semibold text-[11px] sm:text-xs text-gray-950 uppercase tracking-widest mb-1.5 leading-none">
                  {point.number}. {point.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 font-light tracking-wide leading-relaxed">
                  {point.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Important Note Callout Banner Widget */}
      <div className="max-w-4xl mx-auto bg-[#FAF6F0] border border-gray-100/50 p-6 sm:p-8 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 my-16 text-left">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-800 flex-shrink-0 shadow-sm">
            <FiAlertTriangle className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Important Note
            </h3>
            <p className="text-[11px] text-gray-400 font-light tracking-wide mt-1 max-w-xl leading-relaxed">
              We are not responsible for delays caused by incorrect address details or unavailability of the recipient at the time of delivery.
            </p>
          </div>
        </div>
        
        <Link 
          to="/shop" 
          className="bg-black hover:bg-rose-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm shadow-sm transition-all duration-300 active:scale-[0.98]"
        >
          Shop Now
        </Link>
      </div>

      {/* Bottom Trust Promises Banner Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-b border-gray-100/80 my-16 text-center bg-[#FAF6F0]/20 rounded-sm">
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiTruck className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Free Shipping</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiRotateCcw className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Easy Returns</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">7-day return policy</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiLock className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Secure Payment</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">100% secure checkout</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiHeart className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Customer Support</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">We're here to help you</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ShippingPolicy;
