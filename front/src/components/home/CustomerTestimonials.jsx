import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from './homeData';

function CustomerTestimonials({ testimonials = DEFAULT_TESTIMONIALS }) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  return (
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
          {testimonials.map((t) => (
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
          {testimonials.map((_, i) => (
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
  );
}

export default CustomerTestimonials;
