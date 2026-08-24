import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaPinterestP, 
  FaTiktok,
  FaChevronUp
} from 'react-icons/fa';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#f9f9f9] border-t border-gray-100 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-gray-200/60">
          
          {/* Brand Info (4 Columns on Desktop) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <h2 className="font-serif text-3xl font-semibold tracking-[0.2em] text-gray-900 uppercase">
              LAVÉRA
            </h2>
            <p className="text-sm font-light text-gray-500 max-w-sm leading-relaxed">
              Elevated everyday style for the modern woman.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-rose-600 hover:border-rose-600 hover:scale-105 transition-all duration-300 shadow-sm" aria-label="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-rose-600 hover:border-rose-600 hover:scale-105 transition-all duration-300 shadow-sm" aria-label="Facebook">
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>
              <a href="#pinterest" className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-rose-600 hover:border-rose-600 hover:scale-105 transition-all duration-300 shadow-sm" aria-label="Pinterest">
                <FaPinterestP className="w-4 h-4" />
              </a>
              <a href="#tiktok" className="w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-rose-600 hover:border-rose-600 hover:scale-105 transition-all duration-300 shadow-sm" aria-label="Tiktok">
                <FaTiktok className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links Columns (6 Columns on Desktop: 3 cols x 2) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-4 sm:gap-8">
            {/* Shop */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                SHOP
              </h3>
              <ul className="space-y-2.5">
                <li><a href="#new-arrivals" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">New Arrivals</a></li>
                <li><a href="#dresses" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Dresses</a></li>
                <li><a href="#tops" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Tops</a></li>
                <li><a href="#bottoms" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Bottoms</a></li>
                <li><a href="#co-ords" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Co-ords</a></li>
                <li><a href="#sale" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors duration-200">Sale</a></li>
              </ul>
            </div>

            {/* Help */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                HELP
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/contact" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Contact Us</Link></li>
                <li><Link to="/shipping-policy" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Shipping</Link></li>
                <li><Link to="/return-policy" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Returns</Link></li>
                <li><a href="#size-guide" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Size Guide</a></li>
                <li><Link to="/faqs" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">FAQs</Link></li>
                <li><a href="#track-order" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Track Order</a></li>
              </ul>
            </div>

            {/* About */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                ABOUT
              </h3>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Our Story</Link></li>
                <li><a href="#careers" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Careers</a></li>
                <li><a href="#sustainability" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Sustainability</a></li>
                <li><a href="#press" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Press</a></li>
                <li><a href="#locator" className="text-xs font-light text-gray-500 hover:text-black transition-colors duration-200">Store Locator</a></li>
              </ul>
            </div>
          </div>

          {/* Legal & Touch Columns (3 Columns on Desktop) */}
          <div className="lg:col-span-3 flex flex-col space-y-8">
            {/* Get In Touch */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                GET IN TOUCH
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@lavera.com" className="text-xs font-light text-gray-500 hover:text-black transition-colors">
                    hello@lavera.com
                  </a>
                </li>
                <li className="text-xs font-light text-gray-500">
                  +91 98765 43210
                </li>
                <li className="text-xs font-light text-gray-400 leading-normal">
                  We're available Mon - Sat<br />10AM - 7PM
                </li>
              </ul>
            </div>

            {/* Legal Links (Horizontal list or small sub-list) */}
            <div className="flex flex-col space-y-2">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                LEGAL
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link to="/privacy" className="text-[11px] font-light text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
                <span className="text-gray-300 text-[11px] font-light">|</span>
                <Link to="/terms" className="text-[11px] font-light text-gray-500 hover:text-black transition-colors">Terms</Link>
                <span className="text-gray-300 text-[11px] font-light">|</span>
                <Link to="/return-policy" className="text-[11px] font-light text-gray-500 hover:text-black transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-light text-gray-400 tracking-wider">
            © 2026 LAVÉRA. All Rights Reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center space-x-3 text-gray-400">
            <span className="text-[10px] font-bold tracking-widest uppercase mr-1">WE ACCEPT</span>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-700" title="Visa">
                <RiVisaLine className="w-7 h-7" />
              </div>
              <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-700" title="Mastercard">
                <RiMastercardLine className="w-5 h-5" />
              </div>
              <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-700" title="American Express">
                <SiAmericanexpress className="w-3.5 h-3.5" />
              </div>
              <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-700 font-serif text-[10px] font-bold italic tracking-wide" title="UPI">
                UPI
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <button 
            onClick={scrollToTop} 
            className="w-9 h-9 rounded-full bg-black text-white hover:bg-rose-600 flex items-center justify-center transition-all duration-300 shadow hover:-translate-y-0.5 active:scale-95"
            aria-label="Scroll back to top"
          >
            <FaChevronUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
