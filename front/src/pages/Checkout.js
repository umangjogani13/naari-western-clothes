import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { 
  FiMapPin, 
  FiTruck, 
  FiCreditCard, 
  FiLock, 
  FiGift, 
  FiPackage,
  FiShoppingBag,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';

const STATES = [
  'Gujarat',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
  'Rajasthan',
  'Punjab',
  'Uttar Pradesh',
  'Kerala',
  'Haryana',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Goa'
];

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { 
    items: cartItems = [], 
    subtotal: cartSubtotal = 0, 
    discount = 0, 
    appliedCoupon, 
    orderNote = '' 
  } = useSelector((state) => state.cart || {});

  const { user } = useSelector((state) => state.auth || {});

  // Customer Shipping details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Gujarat');
  const [saveAddress, setSaveAddress] = useState(true);

  // Method states
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Pre-populate with logged-in user profile if available
  useEffect(() => {
    if (user) {
      const computedName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (computedName) setFullName(computedName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.state) setStateName(user.state);
      if (user.pincode) setPincode(user.pincode);
    }
  }, [user]);

  // Price calculations
  const subtotal = cartSubtotal > 0 
    ? cartSubtotal 
    : cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const baseShipping = subtotal >= 999 ? 0 : 99;
  const shippingCharges = shippingMethod === 'express' ? 99 : baseShipping;
  const codCharges = paymentMethod === 'cod' ? 49 : 0;
  const couponDiscount = discount || 0;
  const total = Math.max(0, subtotal - couponDiscount + shippingCharges + codCharges);

  // Dynamic delivery date calculation
  const deliveryDates = useMemo(() => {
    const now = new Date();
    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (shippingMethod === 'express') {
      const d1 = addDays(now, 1);
      const d2 = addDays(now, 2);
      return `${formatDate(d1)} - ${formatDate(d2)}, ${d2.getFullYear()}`;
    }

    const d1 = addDays(now, 3);
    const d2 = addDays(now, 5);
    return `${formatDate(d1)} - ${formatDate(d2)}, ${d2.getFullYear()}`;
  }, [shippingMethod]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');

    if (cartItems.length === 0) {
      setOrderError('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    if (!fullName.trim() || (!email.trim() && !phone.trim()) || !address.trim() || !city.trim() || !pincode.trim()) {
      setOrderError('Please fill in all required shipping address fields.');
      return;
    }

    try {
      setSubmitting(true);

      const paymentLabel = 
        paymentMethod === 'cod' ? 'Cash on Delivery' :
        paymentMethod === 'upi' ? 'UPI' :
        paymentMethod === 'card' ? 'Credit / Debit Card' : 'Net Banking';

      const fullAddressString = [
        address.trim(),
        landmark.trim() ? `Near ${landmark.trim()}` : '',
        `${city.trim()}, ${stateName} - ${pincode.trim()}`
      ].filter(Boolean).join(', ');

      const orderPayload = {
        name: fullName.trim(),
        email: email.trim() || 'customer@naari.in',
        phone: phone.trim(),
        address: fullAddressString,
        payment: paymentLabel,
        paymentId: paymentMethod === 'cod' ? '' : `PAY_${Date.now().toString(36).toUpperCase()}`,
        items: cartItems.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          option: `${item.selectedColor || 'Standard'} / ${item.selectedSize || 'M'}`.trim(),
          price: item.price,
          qty: item.quantity,
          total: item.price * item.quantity,
          image: item.image || (item.images && item.images[0]) || '/images/prod_dress.jpg'
        })),
        subtotal,
        shipping: shippingCharges,
        cod: codCharges,
        coupon: couponDiscount,
        couponCode: appliedCoupon?.code || '',
        total,
        notes: orderNote || ''
      };

      const resultAction = await dispatch(createOrder(orderPayload));

      if (createOrder.fulfilled.match(resultAction)) {
        const createdOrder = resultAction.payload;
        // Empty the cart
        dispatch(clearCart());
        // Navigate to confirmation page
        navigate('/order-confirmed', { 
          state: { order: createdOrder } 
        });
      } else {
        setOrderError(resultAction.payload || 'Unable to place order. Please try again.');
      }
    } catch (err) {
      setOrderError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  // If cart is completely empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-6 border border-gray-100">
          <FiShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-normal text-gray-950 uppercase tracking-widest mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-gray-500 font-light tracking-wide mb-8 max-w-sm">
          You don't have any items ready for checkout. Explore our contemporary collection and add your favorite pieces!
        </p>
        <div className="flex gap-4">
          <Link 
            to="/cart"
            className="px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-800 hover:border-black transition-colors rounded-sm"
          >
            View Bag
          </Link>
          <Link 
            to="/shop"
            className="px-8 py-3 bg-black hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <Link to="/cart" className="hover:text-black transition-colors duration-200">Cart</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Checkout</span>
      </nav>

      {/* Stepper Progress Bar */}
      <div className="max-w-3xl mx-auto mb-12 select-none px-4">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#C6A482] text-white shadow-sm">
              1
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-900 leading-none">Shipping</h4>
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Enter Address</span>
            </div>
          </div>

          <div className="flex-1 mx-4 h-[1.5px] bg-[#C6A482]/40" />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#C6A482] text-white shadow-sm">
              2
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-900 leading-none">Payment</h4>
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Select Method</span>
            </div>
          </div>

          <div className="flex-1 mx-4 h-[1.5px] bg-gray-200" />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-white border border-gray-200 text-gray-400">
              3
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Review</h4>
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Place Order</span>
            </div>
          </div>

          <div className="flex-1 mx-4 h-[1.5px] bg-gray-200" />

          {/* Step 4 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-white border border-gray-200 text-gray-400">
              4
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Confirmation</h4>
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Receipt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {orderError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-sm flex items-center gap-3 text-rose-800 text-xs font-medium animate-fade-in">
          <FiAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit}>
        {/* Main Grid Layout: Form on Left (8 cols), Summary on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Box 1: Shipping Address */}
            <div className="bg-white border border-gray-100 rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-2.5 border-b border-gray-200/50">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                    Shipping Address
                  </h2>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    Where would you like us to deliver your parcel?
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-700">
                
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Aashi Shah"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. aashi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                  <span className="text-[9px] text-gray-400 font-light">
                    We will send order confirmation and tracking details to this email.
                  </span>
                </div>

                {/* Address Line */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                    Street Address / House No. <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Flat / House No., Building Name, Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                </div>

                {/* Landmark & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="landmark" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      Landmark (Optional)
                    </label>
                    <input
                      id="landmark"
                      type="text"
                      placeholder="e.g. Near City Mall"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pincode" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      Pincode <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      placeholder="e.g. 395007"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      City <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="e.g. Surat"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                      State <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors cursor-pointer"
                        required
                      >
                        {STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save address checkbox */}
                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    id="saveAddress"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-black w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <label htmlFor="saveAddress" className="cursor-pointer text-gray-500 font-light text-[10px]">
                    Save this address to my profile for future orders
                  </label>
                </div>

              </div>
            </div>

            {/* Box 2: Shipping Method */}
            <div className="bg-white border border-gray-100 rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-2.5 border-b border-gray-200/50">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0">
                  <FiTruck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                    Delivery Option
                  </h2>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    Choose your preferred delivery speed
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Standard Shipping Card */}
                <label 
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer select-none transition-all duration-300 ${
                    shippingMethod === 'standard' 
                      ? 'border-black bg-[#FAF6F0]/20' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-black w-4 h-4 mt-0.5 cursor-pointer" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block leading-tight">
                        Standard Shipping <span className="text-gray-400 font-normal ml-1 lowercase">(3-5 Working Days)</span>
                      </span>
                      <span className="text-[9px] text-gray-400 font-light mt-1 block">
                        {subtotal >= 999 ? 'Free shipping unlocked (Order above ₹999)' : 'Standard delivery across India'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                    {baseShipping === 0 ? 'FREE' : `₹${baseShipping}`}
                  </span>
                </label>

                {/* Express Shipping Card */}
                <label 
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer select-none transition-all duration-300 ${
                    shippingMethod === 'express' 
                      ? 'border-black bg-[#FAF6F0]/20' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-black w-4 h-4 mt-0.5 cursor-pointer" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block leading-tight">
                        Express Shipping <span className="text-gray-400 font-normal ml-1 lowercase">(1-2 Working Days)</span>
                      </span>
                      <span className="text-[9px] text-gray-400 font-light mt-1 block">
                        Priority dispatch directly to your doorstep
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                    ₹99
                  </span>
                </label>
              </div>
            </div>

            {/* Box 3: Payment Method */}
            <div className="bg-white border border-gray-100 rounded-sm p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-2.5 border-b border-gray-200/50">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-gray-800 flex-shrink-0">
                  <FiCreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                    Payment Method
                  </h2>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    Safe & encrypted transaction guaranteed
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm">
                
                {/* UPI Card */}
                <label 
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'upi' ? 'bg-[#FAF6F0]/30' : 'bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-black w-4 h-4 cursor-pointer" 
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                        UPI / Instant QR
                      </span>
                      <span className="text-[9px] text-gray-400 font-light">
                        Google Pay, PhonePe, Paytm, BHIM & all UPI apps
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded">
                    FASTEST
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'card' ? 'bg-[#FAF6F0]/30' : 'bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-black w-4 h-4 cursor-pointer" 
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                        Credit / Debit Card
                      </span>
                      <span className="text-[9px] text-gray-400 font-light">
                        Visa, Mastercard, RuPay & American Express
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <span className="font-serif text-[9px] font-bold italic">VISA</span>
                    <span className="font-serif text-[9px] font-bold italic">MC</span>
                    <span className="font-serif text-[9px] font-bold italic">AMEX</span>
                  </div>
                </label>

                {/* Net Banking */}
                <label 
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'netbanking' ? 'bg-[#FAF6F0]/30' : 'bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="accent-black w-4 h-4 cursor-pointer" 
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                        Net Banking
                      </span>
                      <span className="text-[9px] text-gray-400 font-light">
                        All major Indian banks supported
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'cod' ? 'bg-[#FAF6F0]/30' : 'bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-black w-4 h-4 mt-0.5 cursor-pointer" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block leading-tight">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[9px] text-gray-400 font-light mt-1 block">
                        Pay in cash when your parcel is delivered
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                    +₹49
                  </span>
                </label>

              </div>
            </div>

            {/* Action button */}
            <div className="pt-2 text-center space-y-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-rose-600 disabled:bg-gray-400 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm transition-all active:scale-[0.99] duration-300 shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <span>Place Order · ₹{total.toLocaleString()}</span>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                <FiLock className="w-3.5 h-3.5 text-gray-400" />
                <span>100% Encrypted & Safe Checkout</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="bg-[#fcfcfc] border border-gray-100 p-6 sm:p-8 rounded-sm">
              
              {/* Box Title */}
              <div className="flex justify-between items-baseline mb-6 pb-2.5 border-b border-gray-200/50">
                <h2 className="font-serif text-[13px] font-normal text-gray-950 uppercase tracking-[0.2em]">
                  Order Summary ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)})
                </h2>
                <Link 
                  to="/cart" 
                  className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Product items listing from Redux */}
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.id || item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0 text-left">
                    <div className="w-14 h-18 bg-gray-50 border border-gray-100/50 rounded-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || (item.images && item.images[0]) || '/images/prod_dress.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-[11px] font-semibold text-gray-950 truncate tracking-wide leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-light block mt-1 tracking-wide">
                          {item.selectedColor ? `Color: ${item.selectedColor} · ` : ''}Size: {item.selectedSize || 'M'}
                        </span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 tracking-wide">
                          Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-950 mt-1 block">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown details list */}
              <div className="border-t border-gray-100 pt-5 mt-5 space-y-3.5 text-xs font-light text-gray-600 text-left">
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">₹{subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span className="flex items-center gap-1">
                      <FiCheck className="w-3.5 h-3.5" /> Coupon ({appliedCoupon?.code})
                    </span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shippingCharges === 0 ? (
                    <span className="font-bold text-rose-600 uppercase tracking-widest text-[9px]">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-950">₹{shippingCharges}</span>
                  )}
                </div>

                {paymentMethod === 'cod' && (
                  <div className="flex justify-between">
                    <span>COD Fee</span>
                    <span className="font-semibold text-gray-950">₹{codCharges}</span>
                  </div>
                )}

                {/* Applied coupon status */}
                <div className="pt-2 border-t border-gray-100/50">
                  <div className="w-full flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-wider py-1">
                    <div className="flex items-center gap-2">
                      <FiGift className="w-3.5 h-3.5 text-[#C6A482]" />
                      <span>{appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Promo Code'}</span>
                    </div>
                    <Link to="/cart" className="text-gray-400 hover:text-black underline text-[9px]">
                      {appliedCoupon ? 'Change' : 'Add in Cart'}
                    </Link>
                  </div>
                </div>

              </div>

              {/* Order total */}
              <div className="border-t border-gray-200 pt-5 mt-5 flex justify-between items-baseline text-left">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-gray-950">
                    Order Total
                  </h3>
                  <span className="text-[9px] text-gray-400 font-light tracking-wide mt-1 block">
                    (inclusive of all taxes)
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-950">
                  ₹{total.toLocaleString()}
                </span>
              </div>

            </div>

            {/* Delivery Estimate Widget Box */}
            <div className="bg-[#FAF6F0]/40 border border-gray-100 p-5 rounded-sm flex gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/50 flex items-center justify-center text-gray-600 flex-shrink-0">
                <FiPackage className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 leading-tight">
                  Estimated Delivery Date
                </h4>
                <p className="text-[11px] font-bold text-gray-800 tracking-wide mt-1.5">
                  {deliveryDates}
                </p>
                <span className="text-[9px] text-gray-400 font-light block mt-0.5">
                  Dispatched via trusted express courier partners
                </span>
              </div>
            </div>

            {/* Safe Checkout Card */}
            <div className="bg-white border border-gray-100 p-5 rounded-sm flex gap-4 text-left shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-gray-600 flex-shrink-0">
                <FiLock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 leading-tight">
                  Safe & Secure Checkout
                </h4>
                <p className="text-[9px] text-gray-400 font-light mt-1 leading-normal">
                  Your details and transactions are secured with 256-bit bank-grade SSL encryption.
                </p>
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
}

export default Checkout;
