import React from 'react';

function PromoBanners() {
  return (
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
  );
}

export default PromoBanners;
