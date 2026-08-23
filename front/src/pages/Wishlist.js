import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

// Initial wishlist items matching the mockup
const INITIAL_WISHLIST = [
  {
    id: 2, // Satin Midi Dress
    name: "Satin Midi Dress",
    price: 2299,
    image: "/images/prod_dress.jpg"
  },
  {
    id: 5, // Blazer Co-ord Set
    name: "Blazer Co-ord Set",
    price: 2799,
    image: "/images/prod_blazer.jpg"
  },
  {
    id: 4, // Wide Leg Jeans
    name: "Wide Leg Jeans",
    price: 1999,
    image: "/images/prod_jeans.jpg"
  },
  {
    id: 10, // Slip Maxi Dress
    name: "Slip Maxi Dress",
    price: 1799,
    image: "/images/cat_skirts.jpg"
  },
  {
    id: 3, // Ruched Crop Top
    name: "Ruched Crop Top",
    price: 899,
    image: "/images/prod_top.jpg"
  },
  {
    id: 11, // Denim Jacket
    name: "Denim Jacket",
    price: 1899,
    image: "/images/insta_2.jpg"
  }
];

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(INITIAL_WISHLIST);

  // Remove item from wishlist
  const removeItem = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[750px] flex flex-col justify-between">
      
      <div>
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
          <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Wishlist</span>
        </nav>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-6">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-3">Your Wishlist is Empty</h2>
            <p className="text-sm font-light text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
              Save your favorite items here to view or shop them later. Keep exploring our latest fits.
            </p>
            <Link 
              to="/shop"
              className="inline-block bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-10 transition-colors duration-300"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          /* Main Wishlist content */
          <div className="text-left">
            <h1 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-4 mb-8">
              My Wishlist ({wishlistItems.length})
            </h1>

            {/* Grid of wishlist items (4 columns on desktop, responsive breakdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
              {wishlistItems.map(item => (
                <div key={item.id} className="group flex flex-col relative animate-fade-in">
                  
                  {/* Image container with overlays */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4 rounded-sm border border-gray-100/50">
                    <Link to={`/product/${item.id}`} className="block w-full h-full">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out" />
                    </Link>

                    {/* Close Remove Button Overlay (Top-Right of card image) */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm hover:text-rose-600 hover:scale-105 active:scale-95 transition-all duration-200"
                      aria-label="Remove from wishlist"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="text-left flex-1 flex flex-col items-start mb-4">
                    <h2 className="text-xs sm:text-sm font-medium tracking-wide text-gray-900 hover:text-rose-600 transition-colors duration-200 mb-1">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h2>
                    <span className="text-xs sm:text-sm font-semibold text-gray-950">₹{item.price.toLocaleString()}</span>
                  </div>

                  {/* Add to Bag full width card button */}
                  <button className="w-full bg-white border border-gray-200 hover:bg-black hover:text-white hover:border-black text-black text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 text-center transition-all duration-300">
                    Add To Bag
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wishlist footer text & shop button (Only visible if items exist) */}
      {wishlistItems.length > 0 && (
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-light text-gray-500 italic">
            Looks like you love everything! Keep shopping your favorites.
          </p>
          <Link 
            to="/shop"
            className="w-full sm:w-auto bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-10 text-center rounded-sm transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      )}

    </div>
  );
}

export default Wishlist;
