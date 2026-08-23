import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiGlobe, 
  FiStar, 
  FiAward, 
  FiCompass, 
  FiTrendingUp 
} from 'react-icons/fi';

function About() {
  const scrollToStory = () => {
    const storySec = document.getElementById('our-story');
    if (storySec) {
      storySec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Team profiles database
  const team = [
    {
      name: "Aishwarya S.",
      role: "Founder & CEO",
      image: "/images/newsletter_model.jpg"
    },
    {
      name: "Megha R.",
      role: "Design Director",
      image: "/images/cat_dresses.jpg"
    },
    {
      name: "Ritika P.",
      role: "Merchandise Head",
      image: "/images/insta_3.jpg"
    },
    {
      name: "Simran K.",
      role: "Marketing Lead",
      image: "/images/promo_look.jpg"
    }
  ];

  return (
    <div className="w-full font-sans bg-white select-none">
      
      {/* Container Wrapper for Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
          <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">About Us</span>
        </nav>

        {/* Section 1: Hero Section */}
        <section className="bg-gradient-to-r from-[#F6EFE9] to-[#F1ECE7] rounded-sm overflow-hidden flex flex-col lg:flex-row items-center justify-between min-h-[380px] lg:min-h-[460px] p-6 sm:p-10 lg:p-16 mb-16 relative">
          {/* Left Text */}
          <div className="w-full lg:w-1/2 text-left flex flex-col justify-center items-start z-10 pr-0 lg:pr-8">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-bold mb-3">
              About Lavéra
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal leading-tight text-gray-950 uppercase tracking-wide mb-5">
              Style is more<br />than what you wear,<br />it's how you feel.
            </h1>
            <p className="text-sm font-light text-gray-600 leading-relaxed tracking-wide mb-8 max-w-md">
              At Lavéra, we believe every woman deserves to look and feel her best. Our collections are designed to inspire confidence, celebrate individuality and empower your everyday style.
            </p>
            <button 
              onClick={scrollToStory}
              className="bg-black hover:bg-rose-600 text-white text-xs font-semibold tracking-[0.2em] uppercase py-3.5 px-8 transition-colors duration-300 shadow-md active:scale-95"
            >
              Our Story
            </button>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block w-1/2 h-full absolute right-0 top-0 bottom-0 select-none">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F6EFE9] via-[#F6EFE9]/10 to-transparent z-10" />
              <img 
                src="/images/newsletter_model.jpg" 
                alt="Lavera aesthetics model" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Our Story (Desktop 50:50 Split) */}
        <section id="our-story" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 scroll-mt-28">
          
          {/* Left Image (Retail display interior) */}
          <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-square bg-gray-50 overflow-hidden rounded-sm border border-gray-100/50 shadow-sm relative">
            <div className="absolute inset-0 bg-black/5" />
            <img 
              src="/images/promo_weekend.jpg" 
              alt="Lavera Retail Display" 
              className="w-full h-full object-cover object-center" 
            />
            {/* Elegant brand card overlaid */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-sm border border-white/50 shadow-md">
              <span className="font-serif text-lg tracking-[0.25em] text-gray-900 uppercase">Lavéra</span>
            </div>
          </div>

          {/* Right Story Description */}
          <div className="text-left space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold">
              Our Story
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-gray-950 uppercase tracking-wide">
              Made for her.<br />Inspired by her.
            </h2>
            <p className="text-sm font-light text-gray-500 leading-relaxed">
              Lavéra was born out of a passion for timeless style and modern femininity. What started as a small idea is now a growing fashion destination for women who love effortless, versatile and trend-forward clothing.
            </p>
            <p className="text-sm font-light text-gray-500 leading-relaxed">
              From carefully selected fabrics to thoughtful designs, every piece is created to fit seamlessly into your life, ensuring you carry grace and confidence wherever you go.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <span className="font-serif text-lg text-rose-600 font-semibold tracking-wide italic block">
                – The Lavéra Team
              </span>
            </div>
          </div>

        </section>

      </div>

      {/* Section 3: Statistics Bar (Full Width Banner panel, light pink/beige) */}
      <section className="w-full bg-[#EDE4DC]/40 py-12 md:py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          
          {/* Stat 1: Curated Styles */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-gray-400/40 flex items-center justify-center text-gray-700 mb-4 bg-white/30">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.38 3.46L16 2.14 11.62 3.46a2 2 0 0 0-1.38 1.9v2.41a6 6 0 0 0 2.2 4.63l2.8 2.2a1 1 0 0 0 1.25 0l2.8-2.2a6 6 0 0 0 2.2-4.63V5.36a2 2 0 0 0-1.38-1.9z"></path>
                <path d="M2 21h20"></path>
                <path d="M7 21h10a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z"></path>
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-950 mb-1">2K+</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Styles</span>
            <span className="text-xs font-light text-gray-500">Curated with love</span>
          </div>

          {/* Stat 2: Happy Customers */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-gray-400/40 flex items-center justify-center text-gray-700 mb-4 bg-white/30">
              <FiHeart className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-950 mb-1">50K+</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Happy Customers</span>
            <span className="text-xs font-light text-gray-500">Thank you for trusting us</span>
          </div>

          {/* Stat 3: Cities Delivered */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-gray-400/40 flex items-center justify-center text-gray-700 mb-4 bg-white/30">
              <FiGlobe className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-950 mb-1">20+</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Cities Delivered</span>
            <span className="text-xs font-light text-gray-500">Across India</span>
          </div>

          {/* Stat 4: Customer Rating */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-gray-400/40 flex items-center justify-center text-gray-700 mb-4 bg-white/30">
              <FiStar className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-950 mb-1">4.8/5</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Customer Rating</span>
            <span className="text-xs font-light text-gray-500">From 10,000+ reviews</span>
          </div>

        </div>
      </section>

      {/* Container Wrapper for bottom content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 4: Our Values */}
        <section className="mb-20 text-center">
          <h2 className="font-serif text-2xl tracking-[0.2em] text-gray-950 uppercase mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Left side: Outlined list items */}
            <div className="space-y-8 text-left">
              
              {/* Value 1: Quality First */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-800 bg-[#fbfbfb]">
                  <FiAward className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-1.5">Quality First</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    We prioritize premium, sustainable fabrics and flawless craftsmanship to ensure each piece fits elegantly and lasts for seasons.
                  </p>
                </div>
              </div>

              {/* Value 2: Made for Women */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-800 bg-[#fbfbfb]">
                  <FiHeart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-1.5">Made for Women</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    Every design is constructed with women in mind—focusing on comfort, versatility, and fit cuts to flatter all figures.
                  </p>
                </div>
              </div>

              {/* Value 3: Timeless Style */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-800 bg-[#fbfbfb]">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-1.5">Timeless Style</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    Trendy today, timeless tomorrow. We focus on classic silhouettes and modern details to deliver pieces you will love for years.
                  </p>
                </div>
              </div>

              {/* Value 4: Responsible Fashion */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-800 bg-[#fbfbfb]">
                  <FiCompass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-1.5">Responsible Fashion</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">
                    We are committed to mindful, ethical choices. From design room waste reductions to responsible partner facilities.
                  </p>
                </div>
              </div>

            </div>

            {/* Right side: Values image (clothes rack) */}
            <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-sm border border-gray-100/50 shadow-sm">
              <img 
                src="/images/insta_5.jpg" 
                alt="Lavera fabric selection" 
                className="w-full h-full object-cover object-center" 
              />
            </div>

          </div>
        </section>

        {/* Section 5: Our Team */}
        <section className="mb-12 text-center">
          <h2 className="font-serif text-2xl tracking-[0.2em] text-gray-950 uppercase mb-12">
            Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
            {team.map(member => (
              <div key={member.name} className="flex flex-col group relative rounded-sm overflow-hidden border border-gray-100/50 shadow-sm bg-gray-50">
                {/* Profile Photo */}
                <div className="aspect-[3/4] w-full overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-500 ease-out" 
                  />
                </div>

                {/* Overlaid details card at bottom */}
                <div className="bg-white border-t border-gray-100 py-4 px-4 text-center">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-1 uppercase">
                    {member.name}
                  </h3>
                  <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest border-b border-rose-200 pb-0.5 inline-block cursor-pointer hover:text-rose-700 hover:border-rose-300 transition-colors">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}

export default About;
