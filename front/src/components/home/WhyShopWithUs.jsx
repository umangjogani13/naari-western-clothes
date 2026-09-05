import React from 'react';
import { FiAward, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

function WhyShopWithUs() {
  return (
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
  );
}

export default WhyShopWithUs;
