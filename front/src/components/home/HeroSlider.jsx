import React, { useState, useEffect } from 'react';

function HeroSlider() {
  const [heroSlide, setHeroSlide] = useState(0);

  // Auto-scroll Hero Slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
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
  );
}

export default HeroSlider;
