import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FiX, FiHeart, FiShoppingBag, FiCheck } from 'react-icons/fi';

function Wishlist() {
  const dispatch = useDispatch();
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  const [toastMsg, setToastMsg] = useState('');

  const handleMoveToBag = (product) => {
    dispatch(addToCart({
      product,
      size: 'M',
      color: 'Standard',
      quantity: 1
    }));
    dispatch(removeFromWishlist(product._id || product.id));
    setToastMsg(`Added "${product.name}" to your shopping bag!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[750px] flex flex-col justify-between text-left">
      
      <div>
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
          <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Wishlist</span>
        </nav>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
            <Link to="/cart" className="underline hover:text-black uppercase tracking-wider text-[10px]">
              View Bag →
            </Link>
          </div>
        )}

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-24 text-center animate-fade-in max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-6 border border-gray-100">
              <FiHeart className="w-9 h-9" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-gray-500 font-light tracking-wide mb-8 leading-relaxed">
              Explore our contemporary western collection and save pieces you adore for later.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-10 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Populated Wishlist Layout */
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-gray-950 uppercase tracking-[0.18em]">
                  My Wishlist ({wishlistItems.length})
                </h1>
                <p className="text-xs text-gray-400 font-light tracking-wide mt-1">
                  Saved styles waiting for your wardrobe
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(clearWishlist())}
                className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-rose-600 transition-colors self-start sm:self-center"
              >
                Clear All
              </button>
            </div>

            {/* Grid of Wishlist Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlistItems.map((item) => (
                <div 
                  key={item._id || item.id} 
                  className="group flex flex-col justify-between bg-white border border-gray-100 rounded-sm overflow-hidden p-3 relative hover:shadow-lg transition-all duration-300"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id || item.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-500 hover:text-rose-600 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <FiX className="w-4 h-4" />
                  </button>

                  {/* Thumbnail */}
                  <Link 
                    to={`/product/${item._id || item.id}`}
                    className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm mb-3 block"
                  >
                    <img 
                      src={item.image || '/images/prod_dress.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="space-y-1 text-left mb-4">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">
                      {item.category || 'Apparel'}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate tracking-wide group-hover:text-rose-600 transition-colors">
                      <Link to={`/product/${item._id || item.id}`}>
                        {item.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-gray-950">
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{Number(item.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Move to Bag Action */}
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(item)}
                    className="w-full py-3 bg-black hover:bg-rose-600 text-white text-[10px] font-bold tracking-[0.18em] uppercase rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FiShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Wishlist;
