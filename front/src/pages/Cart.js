import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setOrderNote,
  applyCoupon,
  removeCoupon
} from '../store/slices/cartSlice';
import axiosClient from '../api/axiosClient';
import { 
  FiX, 
  FiMinus, 
  FiPlus, 
  FiLock, 
  FiFileText, 
  FiShoppingBag, 
  FiTag, 
  FiCheck,
  FiAlertCircle 
} from 'react-icons/fi';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    items: cartItems = [], 
    subtotal, 
    discount, 
    shipping, 
    total, 
    appliedCoupon, 
    orderNote 
  } = useSelector((state) => state.cart || {});

  const [noteOpen, setNoteOpen] = useState(Boolean(orderNote));
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Handle quantity changes
  const handleQtyChange = (cartItemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(cartItemId));
    } else {
      dispatch(updateQuantity({ cartItemId, quantity: newQty }));
    }
  };

  // Handle coupon validation via backend API
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    try {
      setCouponLoading(true);
      const res = await axiosClient.post('/coupons/validate', {
        code,
        subtotal
      });

      if (res && res.success && res.coupon) {
        dispatch(applyCoupon(res.coupon));
        setCouponSuccess(`Coupon "${code}" applied successfully! You saved ₹${res.discount || res.coupon.discountValue}`);
        setCouponCodeInput('');
      } else {
        setCouponError(res?.message || 'Invalid or expired coupon code.');
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccess('');
    setCouponError('');
  };

  // Payment icons matching the design
  const paymentIcons = [
    { title: "Visa", icon: <RiVisaLine className="w-8 h-8 text-[#1A1F71]" /> },
    { title: "Mastercard", icon: <RiMastercardLine className="w-6 h-6 text-[#EB001B]" /> },
    { title: "Amex", icon: <SiAmericanexpress className="w-5 h-5 text-[#0070CD]" /> },
    { title: "UPI", icon: <span className="text-[9px] font-extrabold tracking-tighter text-[#1C73B3]">UPI</span> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[750px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Cart</span>
      </nav>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="py-24 text-center animate-fade-in max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-6 border border-gray-100">
            <FiShoppingBag className="w-9 h-9" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-2">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-gray-500 font-light tracking-wide mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our latest westernwear and bestsellers to find styles you love.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-10 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Active Cart Layout */
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-gray-950 uppercase tracking-[0.18em]">
                Shopping Bag ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)})
              </h1>
              <p className="text-xs text-gray-400 font-light tracking-wide mt-1">
                Free shipping eligible on orders above ₹999
              </p>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-rose-600 transition-colors self-start sm:self-center"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 items-start">
            
            {/* Left Column: Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Table header for desktop */}
              <div className="hidden md:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-3 border-b border-gray-100">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                  return (
                    <div key={item.cartItemId} className="py-6 flex flex-col md:grid md:grid-cols-12 items-center gap-4 group">
                      
                      {/* Product Thumbnail & Details (6 cols) */}
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <Link 
                          to={item.slug ? `/product/${item.slug}` : `/product/${item.productId}`}
                          className="w-20 h-26 sm:w-24 sm:h-32 rounded-sm overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 block"
                        >
                          <img 
                            src={item.image || '/images/prod_dress.jpg'} 
                            alt={item.name} 
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        <div className="space-y-1 text-left flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wide truncate hover:text-rose-600 transition-colors">
                            <Link to={item.slug ? `/product/${item.slug}` : `/product/${item.productId}`}>
                              {item.name}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 font-light">
                            {item.size && (
                              <span>Size: <strong className="text-gray-900 font-semibold">{item.size}</strong></span>
                            )}
                            {item.color && (
                              <span>Color: <strong className="text-gray-900 font-semibold">{item.color}</strong></span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(item.cartItemId))}
                            className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors pt-2"
                          >
                            <FiX className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Unit Price (2 cols) */}
                      <div className="col-span-2 text-center text-xs font-semibold text-gray-900 hidden md:block">
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Stepper (2 cols) */}
                      <div className="col-span-2 flex items-center justify-between md:justify-center w-full md:w-auto">
                        <span className="text-xs text-gray-400 md:hidden font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.cartItemId, item.quantity, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.cartItemId, item.quantity, 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Item Total (2 cols) */}
                      <div className="col-span-2 flex items-center justify-between md:justify-end w-full md:w-auto text-sm font-bold text-gray-950">
                        <span className="text-xs text-gray-400 md:hidden font-medium">Subtotal:</span>
                        <span>₹{itemTotal.toLocaleString('en-IN')}</span>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Special Order Notes Section */}
              <div className="pt-4 border-t border-gray-100 text-left">
                <button
                  type="button"
                  onClick={() => setNoteOpen(!noteOpen)}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-black transition-colors"
                >
                  <FiFileText className="w-4 h-4 text-gray-500" />
                  <span>{noteOpen ? 'Hide Special Instructions' : 'Add Order Instructions / Gift Message'}</span>
                </button>
                {noteOpen && (
                  <div className="mt-3 animate-fade-in">
                    <textarea
                      rows={3}
                      value={orderNote}
                      onChange={(e) => dispatch(setOrderNote(e.target.value))}
                      placeholder="Special instructions for delivery or gift packaging..."
                      className="w-full text-xs font-light p-3 bg-white border border-gray-200 rounded-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>

            </div>

            {/* Right Column: Order Summary & Coupon (4 cols) */}
            <div className="lg:col-span-4 bg-[#FAF6F0] p-6 sm:p-8 rounded-sm space-y-6 text-left border border-gray-100">
              <h2 className="font-serif text-lg font-normal text-gray-950 uppercase tracking-[0.18em] pb-3 border-b border-gray-200">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-700 flex items-center gap-1.5">
                  <FiTag className="w-3.5 h-3.5 text-gray-500" /> Apply Promo Code
                </label>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 tracking-wider uppercase">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        Discount applied: ₹{discount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. NAARI10"
                      className="flex-1 text-xs p-3 bg-white border border-gray-200 rounded-sm outline-none focus:border-black font-semibold uppercase tracking-wider transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCodeInput.trim()}
                      className="px-4 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 disabled:bg-gray-400 rounded-sm transition-colors"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponSuccess && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                    <FiCheck className="w-3.5 h-3.5" /> {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-700 flex items-center gap-1 mt-1 font-medium">
                    <FiAlertCircle className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs text-gray-600 border-t border-gray-200 pt-4 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <span>Shipping</span>
                    {subtotal >= 999 && (
                      <span className="block text-[10px] text-emerald-700 font-medium">
                        Free shipping threshold unlocked!
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-950">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-950">
                  <span>Estimated Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-md transition-all active:scale-[0.98] duration-300 flex items-center justify-center gap-2"
              >
                <FiLock className="w-3.5 h-3.5" />
                <span>Proceed to Checkout</span>
              </button>

              {/* Trust Badges */}
              <div className="pt-2 text-center">
                <div className="flex justify-center items-center gap-4 mb-2">
                  {paymentIcons.map((pay, i) => (
                    <div key={i} className="flex items-center justify-center w-9 h-6 bg-white rounded-xs border border-gray-200 shadow-2xs">
                      {pay.icon}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-light tracking-wide flex items-center justify-center gap-1">
                  <FiLock className="w-3 h-3" /> Guaranteed Safe & Secure Checkout
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Cart;
