import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);

  // Fetch active slides from backend API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await axiosClient.get('/hero-slider');
        if (res && res.success && Array.isArray(res.slides) && res.slides.length > 0) {
          setSlides(res.slides);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.warn('[HeroSlider] Backend API unreachable or empty.');
        setSlides([]);
      }
    };
    fetchHeroSlides();
  }, []);

  const totalSlides = slides.length;

  // Auto-advance Hero Slider every 6 seconds if multiple slides
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  if (totalSlides === 0) {
    return null;
  }

  const activeIndex = heroSlide % totalSlides;
  const currentSlide = slides[activeIndex];

  if (!currentSlide) {
    return null;
  }

  const handlePrev = () => {
    setHeroSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setHeroSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section 
      className="relative w-full h-[320px] sm:h-[480px] md:h-[620px] overflow-hidden group/hero transition-colors duration-700"
      style={{ backgroundColor: currentSlide.bgColor || '#EAE3DB' }}
    >
      <div className="absolute inset-0 flex items-center justify-between">
        
        {/* Left Text Content */}
        <div className="w-full md:w-1/2 px-6 sm:px-12 md:px-20 lg:px-24 flex flex-col justify-center z-10 text-left">
          {currentSlide.subtitle && (
            <span 
              key={`sub-${activeIndex}`}
              className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-700 font-semibold mb-2 sm:mb-4 animate-fade-in"
            >
              {currentSlide.subtitle}
            </span>
          )}

          <h1 
            key={`title-${activeIndex}`}
            className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-tight text-gray-900 tracking-wide mb-3 sm:mb-6 uppercase whitespace-pre-line animate-fade-in"
          >
            {currentSlide.title}
          </h1>

          {currentSlide.description && (
            <p 
              key={`desc-${activeIndex}`}
              className="text-xs sm:text-base text-gray-600 font-light leading-relaxed tracking-wide mb-6 sm:mb-8 max-w-sm animate-fade-in"
            >
              {currentSlide.description}
            </p>
          )}

          <div className="flex flex-row gap-3 sm:gap-4">
            {currentSlide.primaryBtnText && (
              <a 
                href={currentSlide.primaryBtnLink || '#new-arrivals'} 
                className="bg-black hover:bg-rose-600 text-[9px] sm:text-[11px] text-white font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3.5 px-4 sm:px-6 text-center transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap"
              >
                {currentSlide.primaryBtnText}
              </a>
            )}

            {currentSlide.secondaryBtnText && (
              <a 
                href={currentSlide.secondaryBtnLink || '#categories'} 
                className="border border-black text-black hover:bg-black hover:text-white text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase py-2.5 sm:py-3.5 px-4 sm:px-6 text-center transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                {currentSlide.secondaryBtnText}
              </a>
            )}
          </div>
        </div>

        {/* Right Image Content */}
        <div className="hidden md:block w-1/2 h-full relative">
          <div 
            key={`img-${activeIndex}`}
            className="w-full h-full transition-opacity duration-1000 ease-in-out"
          >
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title ? currentSlide.title.replace('\n', ' ') : 'Hero Slide'} 
              className="w-full h-full object-cover object-center transition-transform duration-1000"
              onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
            />
          </div>
          {/* Subtle Gradient Fade from current slide background color to image */}
          <div 
            className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(to right, ${currentSlide.bgColor || '#EAE3DB'}, transparent)`
            }}
          />
        </div>

        {/* Mobile Image Overlay (Becomes background) */}
        <div className="md:hidden absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src={currentSlide.image} 
            alt="Hero Slide Mobile Background" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
          />
        </div>
      </div>

      {/* Navigation Arrows (Visible on hover when multiple slides exist) */}
      {totalSlides > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-300 opacity-0 group-hover/hero:opacity-100 z-30"
            aria-label="Previous Slide"
          >
            <FiChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-300 opacity-0 group-hover/hero:opacity-100 z-30"
            aria-label="Next Slide"
          >
            <FiChevronRight size={18} />
          </button>
        </>
      )}

      {/* Hero Slider Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'bg-black w-6' : 'bg-black/30 w-2'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroSlider;
