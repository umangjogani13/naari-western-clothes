import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/products');
        if (response && response.success && Array.isArray(response.products)) {
          setProducts(response.products);
        } else if (Array.isArray(response)) {
          setProducts(response);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please check if backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-semibold">
              New Season 2026
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-gray-900 tracking-wide">
              ELEGANCE IN <br />
              <span className="font-semibold italic">SIMPLICITY</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed tracking-wide">
              Discover tailored luxury designed for the modern woman. Our new autumn collection balances structured silhouettes with fluid textures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#clothing" 
                className="bg-black hover:bg-rose-600 text-white text-xs font-semibold tracking-[0.2em] uppercase py-4 px-8 text-center transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-rose-600/20 active:scale-95"
              >
                Shop Collection
              </a>
              <a 
                href="#new-in" 
                className="border border-gray-300 hover:border-black text-gray-950 text-xs font-semibold tracking-[0.2em] uppercase py-4 px-8 text-center transition-colors duration-300 active:scale-95"
              >
                Explore More
              </a>
            </div>
          </div>

          {/* Hero Right Banner Image */}
          <div className="md:col-span-7 relative h-[400px] sm:h-[500px] md:h-[600px] w-full overflow-hidden group shadow-2xl rounded-sm">
            <img 
              src="/hero_fashion_banner.jpg" 
              alt="Lavéra Autumn/Winter Collection 2026" 
              className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="bg-gray-50/50 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-wide">
              Trending Now
            </h2>
            <div className="w-16 h-[2px] bg-rose-600 mx-auto mt-4 mb-4" />
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest">
              Handpicked pieces loved by our community
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-4 border border-gray-100 flex flex-col">
                  <div className="relative aspect-[3/4] mb-4 bg-gray-100 animate-pulse rounded-sm" />
                  <div className="flex justify-between items-start">
                    <div className="w-2/3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white border border-rose-100 p-8 rounded-sm">
              <p className="text-rose-600 font-medium mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs uppercase tracking-widest font-semibold border-b border-black hover:text-rose-600 hover:border-rose-600 transition-colors animate-pulse"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 border border-gray-100 group cursor-pointer hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1">
                        {product.tag}
                      </span>
                    )}
                    {/* Quick Add Overlay on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 bg-white/95 backdrop-blur-sm flex items-center justify-between border-t border-gray-100">
                      <button className="text-[10px] font-bold tracking-widest uppercase hover:text-rose-600 transition-colors w-full py-1 text-center">
                        Quick Add +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-gray-900 hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-950 font-sans">
                      {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
