import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheck, 
  FiMail, 
  FiHeart, 
  FiShoppingBag,
  FiTruck,
  FiRotateCcw,
  FiLock
} from 'react-icons/fi';

const CONFIRMED_ITEMS = [
  {
    id: 1,
    name: "Satin Midi Dress",
    color: "Beige",
    size: "M",
    qty: 1,
    price: 2299,
    image: "/images/prod_dress.jpg"
  },
  {
    id: 2,
    name: "Oversized Cotton Shirt",
    color: "Beige",
    size: "M",
    qty: 1,
    price: 1499,
    image: "/images/prod_shirt.jpg"
  },
  {
    id: 3,
    name: "Wide Leg Jeans",
    color: "Light Blue",
    size: "28",
    qty: 1,
    price: 1999,
    image: "/images/prod_jeans.jpg"
  }
];

const RECOMMENDATIONS = [
  {
    id: 101,
    name: "Ruched Bodycon Dress",
    price: 2299,
    image: "/images/prod_dress.jpg"
  },
  {
    id: 102,
    name: "Linen Co-ord Set",
    price: 2799,
    image: "/images/cat_coords.jpg"
  },
  {
    id: 103,
    name: "Button Down Shirt",
    price: 1299,
    image: "/images/prod_shirt.jpg"
  },
  {
    id: 104,
    name: "Straight Fit Jeans",
    price: 1899,
    image: "/images/prod_jeans.jpg"
  },
  {
    id: 105,
    name: "Ribbed Tank Top",
    price: 799,
    image: "/images/prod_top.jpg"
  }
];

function OrderConfirmed() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Order Confirmed</span>
      </nav>

      {/* Top Visual Banner with split checkmark styling */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-gray-950 uppercase tracking-[0.18em] leading-snug">
                Thank You,<br />Your Order is Confirmed!
              </h1>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed tracking-wide max-w-xl">
              We've received your order and are getting it ready. You will receive an email confirmation shortly.
            </p>

            <div className="pt-2">
              <Link 
                to="/shop" 
                className="inline-block bg-[#ECD9CB] hover:bg-[#C6A482] text-gray-900 text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm shadow-sm transition-all duration-300 active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 h-[240px] md:h-[350px] w-full">
            <img 
              src="/images/newsletter_model.jpg" 
              alt="Order Confirmed Banner" 
              className="w-full h-full object-cover object-top filter contrast-[0.98] brightness-[0.98]" 
            />
          </div>

        </div>
      </div>

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Left Column: Order Details */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-sm shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-2.5 border-b border-gray-200/50">
            <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0">
              <FiShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
              Order Details
            </h2>
          </div>

          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-850 uppercase tracking-widest text-[9px]">Order Number</span>
              <span className="font-bold text-gray-950">#LV24567</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-850 uppercase tracking-widest text-[9px]">Order Date</span>
              <span className="font-medium text-gray-950">May 18, 2024</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-850 uppercase tracking-widest text-[9px]">Payment Method</span>
              <span className="font-medium text-gray-950">UPI</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-850 uppercase tracking-widest text-[9px]">Total Amount</span>
              <span className="font-bold text-gray-950">₹5,846</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="font-semibold text-gray-850 uppercase tracking-widest text-[9px]">Order Status</span>
              <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border bg-emerald-50 text-emerald-800 border-emerald-100">
                Confirmed
              </span>
            </div>

            {/* Email Notification Widget */}
            <div className="bg-[#FAF6F0]/30 border border-gray-100 p-4 rounded-sm flex items-center gap-3.5 mt-6 text-left">
              <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-[10px] text-gray-400 font-light leading-normal">
                A confirmation email has been sent to{' '}
                <span className="font-bold text-gray-800">aashi@email.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#fcfcfc] border border-gray-100 p-6 sm:p-8 rounded-sm">
          <div className="flex justify-between items-baseline mb-6 pb-2.5 border-b border-gray-200/50">
            <h2 className="font-serif text-[13px] font-normal text-gray-950 uppercase tracking-[0.2em]">
              Order Summary
            </h2>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              {CONFIRMED_ITEMS.length} Items
            </span>
          </div>

          <div className="divide-y divide-gray-100 pr-1 mb-5">
            {CONFIRMED_ITEMS.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 text-left">
                <div className="w-14 h-18 bg-gray-50 border border-gray-100/50 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="text-[11px] font-semibold text-gray-950 truncate tracking-wide leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-light block mt-1 tracking-wide">
                      Beige <span className="mx-1">·</span> Size: {item.size} <span className="mx-1">·</span> Qty: {item.qty}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-950 mt-1 block">
                    ₹{item.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-5 flex justify-between items-baseline text-left">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-955">
              Order Total
            </h3>
            <span className="text-lg font-bold text-gray-950">
              ₹5,846
            </span>
          </div>
        </div>

      </div>

      {/* Trust promises banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-b border-gray-100/80 my-16 text-center bg-[#FAF6F0]/20 rounded-sm">
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiTruck className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Free Shipping</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiRotateCcw className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Easy Returns</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">7-day return policy</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiLock className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Secure Payment</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">100% secure checkout</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiHeart className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Customer Support</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">We're here to help you</p>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="my-16">
        <div className="flex justify-between items-baseline mb-8 pb-3 border-b border-gray-100">
          <h2 className="font-serif text-[15px] sm:text-lg font-normal tracking-[0.2em] text-gray-950 uppercase">
            You May Also Like
          </h2>
          <Link 
            to="/shop" 
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black underline transition-colors"
          >
            View All
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {RECOMMENDATIONS.map((product) => (
            <div key={product.id} className="group flex flex-col border border-gray-100/50 bg-white rounded-sm overflow-hidden p-2.5 relative">
              
              {/* Wishlist Heart Icon absolute top-right overlay */}
              <button 
                type="button" 
                onClick={() => console.log('Wishlist click', product.id)}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-900 hover:text-rose-600 p-1.5 rounded-full shadow-sm hover:scale-105 transition-all focus:outline-none"
                aria-label="Add to Wishlist"
              >
                <FiHeart className="w-3.5 h-3.5" />
              </button>

              {/* Product Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm mb-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-300" 
                />
              </div>

              {/* Product Metadata Details */}
              <h3 className="text-[11px] sm:text-xs font-semibold text-gray-900 truncate tracking-wide hover:text-rose-600 transition-colors mb-1.5 text-left">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <span className="text-[11px] sm:text-xs font-bold text-gray-950 text-left">
                ₹{product.price.toLocaleString()}
              </span>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default OrderConfirmed;
