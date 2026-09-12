import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { 
  FiCheck, 
  FiMail, 
  FiHeart, 
  FiShoppingBag,
  FiTruck,
  FiRotateCcw,
  FiLock,
  FiMapPin,
  FiPackage,
  FiExternalLink
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

function OrderConfirmed() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Retrieve placed order from location state or latest order in Redux
  const locationOrder = location.state?.order;
  const { items: allOrders = [] } = useSelector((state) => state.orders || {});
  const { items: allProducts = [] } = useSelector((state) => state.products || {});
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});

  const order = locationOrder || (allOrders.length > 0 ? allOrders[0] : null);

  // Fetch products for recommendations if needed
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, allProducts.length]);

  // Recommendations from backend products (limit 5)
  const recommendations = allProducts.slice(0, 5);

  const isWishlisted = (id) => wishlistItems.some(it => (it._id || it.id) === id);

  const handleWishlistToggle = (prod) => {
    dispatch(toggleWishlist(prod));
  };

  // If no order data is available at all
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#C6A482] mx-auto mb-5 border border-[#ECD9CB]">
          <FiShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-3">
          No Recent Order Found
        </h1>
        <p className="text-xs text-gray-500 font-light tracking-wide mb-8 max-w-md">
          You haven't placed an order in this session. You can review your existing orders in your Account page or explore our collection.
        </p>
        <div className="flex gap-4">
          <Link
            to="/account?tab=orders"
            className="px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-800 hover:border-black transition-colors rounded-sm"
          >
            My Orders
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 bg-black hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = order.orderNumber || (order._id ? `#LV${order._id.slice(-5).toUpperCase()}` : '#LV10001');
  const orderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const paymentMethod = order.payment?.method || (typeof order.payment === 'string' ? order.payment : 'UPI');
  const customerEmail = order.customer?.email || order.email || 'your registered email';
  const customerAddress = order.customer?.address || order.address || '';
  const orderItems = order.items || [];
  const rawTotal = order.total !== undefined ? order.total : (order.rawAmount || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Order Confirmed</span>
      </nav>

      {/* Top Visual Banner with checkmark styling */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                <FiCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-gray-950 uppercase tracking-[0.18em] leading-snug">
                  Thank You,<br />Your Order is Placed!
                </h1>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed tracking-wide max-w-xl">
              We've received your order <span className="font-bold text-gray-900">{orderNumber}</span> and have begun preparing your parcel. A notification has been dispatched to <span className="font-semibold text-gray-900">{customerEmail}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/account?tab=orders" 
                className="inline-flex items-center gap-2 bg-black hover:bg-rose-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 px-7 rounded-sm shadow-md transition-all duration-300 active:scale-[0.98]"
              >
                <span>Track Order</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link 
                to="/shop" 
                className="inline-block bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 px-7 rounded-sm transition-all duration-300 active:scale-[0.98]"
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

      {/* Order Status Stepper Timeline */}
      <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-sm mb-12 shadow-xs">
        <h3 className="font-serif text-[12px] font-bold tracking-[0.2em] text-gray-900 uppercase mb-6 pb-2 border-b border-gray-100">
          Order Status Tracker
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              <FiCheck className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                Order Placed
              </span>
              <span className="text-[9px] text-emerald-700 font-medium">Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C6A482] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              <FiPackage className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                Processing
              </span>
              <span className="text-[9px] text-[#8C6239] font-medium">In Progress</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <FiTruck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                Shipped
              </span>
              <span className="text-[9px] text-gray-400 font-light">Upcoming</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              4
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                Delivered
              </span>
              <span className="text-[9px] text-gray-400 font-light">Est. in 3-5 days</span>
            </div>
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
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-[9px]">Order Number</span>
              <span className="font-bold text-gray-950">{orderNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-[9px]">Order Date</span>
              <span className="font-medium text-gray-950">{orderDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-[9px]">Payment Method</span>
              <span className="font-medium text-gray-950">{paymentMethod}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-[9px]">Total Amount</span>
              <span className="font-bold text-gray-950">₹{Number(rawTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 items-center border-b border-gray-50">
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-[9px]">Order Status</span>
              <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border bg-emerald-50 text-emerald-800 border-emerald-200">
                {order.status || 'Confirmed'}
              </span>
            </div>

            {/* Shipping Address Detail */}
            {customerAddress && (
              <div className="pt-2 text-left">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px] text-gray-700 mb-1.5">
                  <FiMapPin className="w-3.5 h-3.5 text-gray-500" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-gray-800 font-light text-[11px] leading-relaxed bg-[#fbfbfb] p-3 rounded-sm border border-gray-100">
                  {customerAddress}
                </p>
              </div>
            )}

            {/* Email Notification Widget */}
            <div className="bg-[#FAF6F0]/40 border border-gray-100 p-4 rounded-sm flex items-center gap-3.5 mt-6 text-left">
              <FiMail className="w-5 h-5 text-[#C6A482] flex-shrink-0" />
              <p className="text-[10px] text-gray-500 font-light leading-normal">
                An order confirmation and live shipment tracking link will be sent to{' '}
                <span className="font-bold text-gray-800">{customerEmail}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#fcfcfc] border border-gray-100 p-6 sm:p-8 rounded-sm">
          <div className="flex justify-between items-baseline mb-6 pb-2.5 border-b border-gray-200/50">
            <h2 className="font-serif text-[13px] font-normal text-gray-950 uppercase tracking-[0.2em]">
              Items Ordered
            </h2>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              {orderItems.length} {orderItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <div className="divide-y divide-gray-100 pr-1 mb-5 max-h-[320px] overflow-y-auto">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0 text-left">
                <div className="w-14 h-18 bg-gray-50 border border-gray-100/50 rounded-sm overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image || '/images/prod_dress.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="text-[11px] font-semibold text-gray-950 truncate tracking-wide leading-snug">
                      {item.name}
                    </h4>
                    {item.option && (
                      <span className="text-[9px] text-gray-400 font-light block mt-1 tracking-wide">
                        {item.option}
                      </span>
                    )}
                    <span className="text-[9px] text-gray-400 font-light block mt-0.5 tracking-wide">
                      Qty: {item.qty || item.quantity || 1} × ₹{Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-950 mt-1 block">
                    ₹{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
            {order.subtotal !== undefined && (
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-950">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.coupon > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || 'Coupon'})</span>
                <span className="font-semibold">-₹{Number(order.coupon).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-gray-950">
                {Number(order.shipping) === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            {order.cod > 0 && (
              <div className="flex justify-between">
                <span>COD Fee</span>
                <span className="font-semibold text-gray-950">₹{Number(order.cod).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-baseline text-left">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-950">
              Order Total
            </h3>
            <span className="text-lg font-bold text-gray-950">
              ₹{Number(rawTotal).toLocaleString('en-IN')}
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
            <p className="text-[9px] text-gray-400 font-light mt-0.5">7-day hassle free returns</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiLock className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Secure Payment</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">100% encrypted checkout</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 group cursor-default">
          <FiHeart className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Dedicated Support</h4>
            <p className="text-[9px] text-gray-400 font-light mt-0.5">support@naari.in</p>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
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
            {recommendations.map((product) => {
              const pId = product._id || product.id;
              const fav = isWishlisted(pId);
              return (
                <div key={pId} className="group flex flex-col border border-gray-100/50 bg-white rounded-sm overflow-hidden p-2.5 relative">
                  
                  {/* Wishlist Heart Icon absolute top-right overlay */}
                  <button 
                    type="button" 
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-900 hover:text-rose-600 p-1.5 rounded-full shadow-sm hover:scale-105 transition-all focus:outline-none"
                    aria-label="Add to Wishlist"
                  >
                    {fav ? <FaHeart className="w-3.5 h-3.5 text-rose-600" /> : <FiHeart className="w-3.5 h-3.5" />}
                  </button>

                  {/* Product Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm mb-3">
                    <Link to={`/product/${pId}`} className="block w-full h-full">
                      <img 
                        src={product.image || (product.images && product.images[0]) || '/images/prod_dress.jpg'} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-300" 
                      />
                    </Link>
                  </div>

                  {/* Product Metadata Details */}
                  <h3 className="text-[11px] sm:text-xs font-semibold text-gray-900 truncate tracking-wide hover:text-rose-600 transition-colors mb-1.5 text-left">
                    <Link to={`/product/${pId}`}>{product.name}</Link>
                  </h3>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-950 text-left">
                    ₹{Number(product.salePrice || product.price).toLocaleString()}
                  </span>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderConfirmed;
