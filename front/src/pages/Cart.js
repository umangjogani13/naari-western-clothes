import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiLock, FiFileText } from 'react-icons/fi';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';

// Initial cart items matching the mockup
const INITIAL_CART = [
  {
    id: 2, // Satin Midi Dress
    name: "Satin Midi Dress",
    color: "Mauve",
    size: "M",
    price: 2299,
    image: "/images/prod_dress.jpg",
    quantity: 1
  },
  {
    id: 4, // Wide Leg Jeans
    name: "Wide Leg Jeans",
    color: "Blue",
    size: "M",
    price: 1999,
    image: "/images/prod_jeans.jpg",
    quantity: 1
  },
  {
    id: 1, // Oversized Cotton Shirt
    name: "Oversized Cotton Shirt",
    color: "White",
    size: "S",
    price: 1499,
    image: "/images/prod_shirt.jpg",
    quantity: 1
  }
];

function Cart() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [noteOpen, setNoteOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Handle quantity changes
  const updateQuantity = (itemId, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  // Remove item from bag
  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Recalculate Subtotal dynamically
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const discount = 500; // Flat discount matching the mockup
  const shipping = 0; // Free shipping

  const total = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Math.max(0, subtotal - discount + shipping);
  }, [cartItems, subtotal]);

  // Payment icons matching the mockup
  const paymentIcons = [
    { title: "Visa", icon: <RiVisaLine className="w-8 h-8 text-[#1A1F71]" /> },
    { title: "Mastercard", icon: <RiMastercardLine className="w-6 h-6 text-[#EB001B]" /> },
    { title: "Amex", icon: <SiAmericanexpress className="w-5 h-5 text-[#0070CD]" /> },
    { title: "UPI", icon: <span className="text-[9px] font-extrabold tracking-tighter text-[#1C73B3]">UPI</span> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[750px]">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Cart</span>
      </nav>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-6">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-3">Your Bag is Empty</h2>
          <p className="text-sm font-light text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
            Looks like you haven't added any items to your shopping bag yet. Explore the shop to find your perfect style.
          </p>
          <Link 
            to="/shop"
            className="inline-block bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-10 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Main split cart grid layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
          
          {/* Left Column: Bag Items list (7 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-4">
              Your Bag ({cartItems.length})
            </h1>

            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 sm:gap-6 py-6 items-center group animate-fade-in">
                  
                  {/* Item Image thumbnail */}
                  <Link to={`/product/${item.id}`} className="w-20 h-[105px] overflow-hidden bg-gray-50 border border-gray-100 rounded-sm flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-medium text-gray-900 hover:text-rose-600 transition-colors duration-200">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h2>
                      <p className="text-xs text-gray-400 font-light mt-1.5 uppercase tracking-wide">
                        {item.color} / {item.size}
                      </p>
                      <span className="text-sm font-semibold text-gray-950 block mt-2 sm:hidden">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1.5 text-gray-400 hover:text-black transition-colors focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-1.5 text-gray-400 hover:text-black transition-colors focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Desktop Price */}
                      <span className="text-sm font-semibold text-gray-950 w-24 text-right hidden sm:inline-block">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded transition-all duration-200 flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Accordion / button to add order notes */}
            <div className="border-t border-gray-100 pt-6">
              <button
                onClick={() => setNoteOpen(prev => !prev)}
                className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black uppercase tracking-wider focus:outline-none"
              >
                <FiFileText className="w-4 h-4" />
                <span>Add order note</span>
              </button>
              {noteOpen && (
                <div className="mt-3.5 animate-fade-in">
                  <textarea
                    rows="3"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Leave instructions for shipping or a note..."
                    className="w-full text-xs font-light tracking-wide outline-none border border-gray-200 focus:border-black rounded-sm p-4 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (4 columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-[#f9f9f9] border border-gray-100/50 p-6 sm:p-8 rounded-sm">
              <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em] mb-6 pb-2.5 border-b border-gray-200/50">
                Order Summary
              </h2>

              {/* Price list details */}
              <div className="space-y-4 text-xs font-light text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold text-gray-950">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-rose-600 uppercase tracking-widest text-[9px]">Free</span>
                </div>
                <div className="flex justify-between items-center text-rose-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                </div>
              </div>

              {/* Total block */}
              <div className="border-t border-gray-200/60 pt-5 mb-1.5 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest font-semibold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-950">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[10px] text-rose-600 font-medium mb-8 text-right tracking-wide">
                You saved ₹{discount.toLocaleString()} on this order
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300">
                  Proceed To Checkout
                </button>
                
                <button className="w-full bg-white border border-gray-200 hover:border-black text-gray-800 text-[10px] font-bold tracking-[0.18em] uppercase py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all duration-300">
                  <FiLock className="w-3.5 h-3.5 text-gray-500" />
                  <span>Secure Checkout</span>
                </button>
              </div>

              {/* Accept Payments Logos */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3.5">
                  We Accept
                </span>
                <div className="flex items-center justify-center gap-3">
                  {paymentIcons.map(p => (
                    <div 
                      key={p.title} 
                      className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-700 shadow-sm" 
                      title={p.title}
                    >
                      {p.icon}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
