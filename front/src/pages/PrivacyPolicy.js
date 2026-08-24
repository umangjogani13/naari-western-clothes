import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiActivity, 
  FiShare2, 
  FiShield, 
  FiAward, 
  FiEye, 
  FiRefreshCw,
  FiTruck,
  FiRotateCcw,
  FiLock,
  FiHeart
} from 'react-icons/fi';

const POLICY_SECTIONS = [
  {
    number: "1",
    title: "INFORMATION WE COLLECT",
    description: "We collect information you provide directly to us such as your name, email address, phone number, shipping address and payment details when you place an order or create an account.",
    icon: <FiFileText className="w-5 h-5" />
  },
  {
    number: "2",
    title: "HOW WE USE YOUR INFORMATION",
    description: "We use your information to process orders, provide customer support, improve our services, send important updates and offer personalized suggestions.",
    icon: <FiActivity className="w-5 h-5" />
  },
  {
    number: "3",
    title: "INFORMATION SHARING",
    description: "We do not sell or rent your personal information. We may share your information with trusted service providers who assist us in operating our website and conducting our business.",
    icon: <FiShare2 className="w-5 h-5" />
  },
  {
    number: "4",
    title: "DATA SECURITY",
    description: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure or destruction.",
    icon: <FiShield className="w-5 h-5" />
  },
  {
    number: "5",
    title: "YOUR RIGHTS",
    description: "You have the right to access, update or delete your personal information. You can also opt-out of marketing communications at any time.",
    icon: <FiAward className="w-5 h-5" />
  },
  {
    number: "6",
    title: "COOKIES",
    description: "Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.",
    icon: <FiEye className="w-5 h-5" />
  },
  {
    number: "7",
    title: "CHANGES TO THIS POLICY",
    description: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
    icon: <FiRefreshCw className="w-5 h-5" />
  }
];

function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </nav>

      {/* Top Banner (Split layout matching mockup) */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-4 leading-snug">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed tracking-wide max-w-xl">
              At Lavéra, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use and safeguard your data.
            </p>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 h-[240px] md:h-[320px] w-full">
            <img 
              src="/images/promo_look.jpg" 
              alt="Privacy Policy Look" 
              className="w-full h-full object-cover object-top filter contrast-[0.98] brightness-[0.98]" 
            />
          </div>

        </div>
      </div>

      {/* Policy list sections */}
      <div className="max-w-3xl mx-auto my-16 space-y-10">
        {POLICY_SECTIONS.map((section) => (
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

export default PrivacyPolicy;
