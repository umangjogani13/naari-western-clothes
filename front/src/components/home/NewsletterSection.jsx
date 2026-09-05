import React, { useState } from 'react';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
      <div className="bg-[#DFD7CD] rounded-sm overflow-hidden flex flex-col md:flex-row items-center h-auto md:h-[240px] relative px-6 py-8 md:py-0">
        
        {/* Overlapping model cut-out on desktop */}
        <div className="hidden md:block absolute left-12 bottom-0 w-[180px] h-[260px] pointer-events-none z-10">
          <img 
            src="/images/newsletter_model.jpg" 
            alt="Model Style Club" 
            className="w-full h-full object-cover object-top scale-x-[-1] rounded-t-full shadow-lg border-2 border-white/60"
          />
        </div>

        {/* Left Text Block */}
        <div className="w-full md:w-1/2 md:pl-[220px] text-left flex flex-col justify-center space-y-2">
          <h3 className="text-base sm:text-2xl font-bold tracking-[0.15em] text-gray-900 uppercase">
            JOIN THE STYLE CLUB
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-600 font-light leading-relaxed max-w-md">
            Get 10% OFF your first order and be the first to know about new arrivals & exclusive offers.
          </p>
        </div>

        {/* Right Input Form */}
        <div className="w-full md:w-1/2 flex items-center justify-start md:justify-end mt-6 md:mt-0 md:pr-12">
          {isSubscribed ? (
            <div className="bg-white/90 backdrop-blur-sm text-black border border-white text-xs font-bold tracking-widest uppercase py-3 px-8 text-center rounded shadow-sm w-full md:w-auto">
              THANK YOU FOR JOINING!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md border border-white/40 bg-white">
              <input 
                type="email" 
                required
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-light tracking-wide outline-none placeholder-gray-400 text-gray-800"
              />
              <button 
                type="submit"
                className="bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase px-6 sm:px-8 py-3.5 transition-colors duration-300"
              >
                JOIN
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

export default NewsletterSection;
