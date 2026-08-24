import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiGlobe, 
  FiTag, 
  FiCreditCard, 
  FiTruck, 
  FiRotateCcw, 
  FiUser, 
  FiBookmark, 
  FiAlertTriangle, 
  FiRefreshCw,
  FiLock,
  FiHeart
} from 'react-icons/fi';

const TERMS_SECTIONS = [
  {
    number: "1",
    title: "GENERAL",
    description: "These terms and conditions govern your use of the Lavéra website and the purchase of any products from our store.",
    icon: <FiGlobe className="w-5 h-5" />
  },
  {
    number: "2",
    title: "PRODUCTS & PRICING",
    description: "We strive to display product colors and details as accurately as possible. However, we do not guarantee that your device's display of any color will be accurate. All prices are listed in INR and are subject to change without notice.",
    icon: <FiTag className="w-5 h-5" />
  },
  {
    number: "3",
    title: "ORDERS & PAYMENT",
    description: "By placing an order, you confirm that you are authorized to use the payment method provided. We reserve the right to refuse or cancel any order at our discretion.",
    icon: <FiCreditCard className="w-5 h-5" />
  },
  {
    number: "4",
    title: "SHIPPING & DELIVERY",
    description: "We will do our best to deliver your order within the estimated time frame. Delivery times may vary based on your location and unforeseen circumstances.",
    icon: <FiTruck className="w-5 h-5" />
  },
  {
    number: "5",
    title: "RETURNS & REFUNDS",
    description: "We offer a 7-day return policy. Items must be unused, unwashed and in original condition with tags intact. Please refer to our Refund Policy for more details.",
    icon: <FiRotateCcw className="w-5 h-5" />
  },
  {
    number: "6",
    title: "USER ACCOUNT",
    description: "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
    icon: <FiUser className="w-5 h-5" />
  },
  {
    number: "7",
    title: "INTELLECTUAL PROPERTY",
    description: "All content on this website, including text, graphics, logos, images and designs, is the property of Lavéra and is protected by copyright laws.",
    icon: <FiBookmark className="w-5 h-5" />
  },
  {
    number: "8",
    title: "LIMITATION OF LIABILITY",
    description: "Lavéra shall not be liable for any indirect, incidental or consequential damages arising from the use of our website or products.",
    icon: <FiAlertTriangle className="w-5 h-5" />
  },
  {
    number: "9",
    title: "CHANGES TO TERMS",
    description: "We reserve the right to update or modify these terms at any time. Changes will be effective once posted on this page.",
    icon: <FiRefreshCw className="w-5 h-5" />
  }
];

function TermsConditions() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Terms & Conditions</span>
      </nav>

      {/* Top Banner (Split layout matching mockup) */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-4 leading-snug">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed tracking-wide max-w-xl">
              Please read these terms and conditions carefully before using our website and services. By accessing or using our website, you agree to be bound by these terms.
            </p>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 h-[240px] md:h-[320px] w-full">
            <img 
              src="/images/promo_weekend.jpg" 
              alt="Terms and Conditions Decor" 
              className="w-full h-full object-cover object-center filter contrast-[0.98] brightness-[0.98]" 
            />
          </div>

        </div>
      </div>

      {/* Terms list sections */}
      <div className="max-w-3xl mx-auto my-16 space-y-10">
        {TERMS_SECTIONS.map((section) => (
          <div key={section.number} className="flex gap-5 items-start group">
            
            {/* Left Circular Outline Icon */}
            <div className="w-11 h-11 rounded-full border border-gray-200/80 bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-[#C6A482] group-hover:bg-white">
              {section.icon}
            </div>

            {/* Right Text details */}
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-[11px] sm:text-xs text-gray-950 uppercase tracking-widest mb-1.5 leading-none">
                {section.number}. {section.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-light tracking-wide leading-relaxed">
                {section.description}
              </p>
            </div>

          </div>
        ))}

        {/* Contact Note */}
        <div className="pt-8 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-light tracking-wide">
            If you have any questions, please contact us at{' '}
            <a 
              href="mailto:hello@lavera.com" 
              className="text-gray-800 font-semibold hover:text-[#C6A482] transition-colors underline"
            >
              hello@lavera.com
            </a>
          </p>
        </div>
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

export default TermsConditions;
