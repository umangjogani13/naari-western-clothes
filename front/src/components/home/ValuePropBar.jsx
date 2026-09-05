import React from 'react';
import { 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiAward, 
  FiHeadphones 
} from 'react-icons/fi';

function ValuePropBar() {
  return (
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
  );
}

export default ValuePropBar;
