import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiTruck, 
  FiCreditCard, 
  FiLock, 
  FiGift, 
  FiChevronRight,
  FiPackage
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
  'Kerala'
];

const CHECKOUT_ITEMS = [
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

function Checkout() {
  const [fullName, setFullName] = useState('Aashi Shah');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123, Green Park Society');
  const [landmark, setLandmark] = useState('Near VR Surat');
  const [pincode, setPincode] = useState('395007');
  const [city, setCity] = useState('Surat');
  const [stateName, setStateName] = useState('Gujarat');
  const [saveAddress, setSaveAddress] = useState(true);

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'upi', 'card', 'netbanking', 'cod'

  const navigate = useNavigate();

  // Price Calculations
  const subtotal = CHECKOUT_ITEMS.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingCharges = shippingMethod === 'express' ? 99 : 0;
  const codCharges = paymentMethod === 'cod' ? 49 : 0;
  const total = subtotal + shippingCharges + codCharges;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    navigate('/order-confirmed');
  };

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

          <div className="flex-1 mx-4 h-[1.5px] bg-gray-200" />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-white border border-gray-200 text-gray-400">
              2
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Payment</h4>
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Make Payment</span>
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
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Order Review</span>
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
              <span className="text-[8px] text-gray-400 font-light mt-0.5 block">Order Placed</span>
            </div>
          </div>
        </div>
      </div>

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
                <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                  Shipping Address
                </h2>
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-sm py-3 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Address Line */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                    Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
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
                    Save this address for future
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
                <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                  Shipping Method
                </h2>
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
                        Free shipping on orders above ₹999
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                    FREE
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
                        Fast delivery to your doorstep
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
                <h2 className="font-serif text-[13px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                  Payment Method
                </h2>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm">
                
                {/* UPI Card */}
                <label 
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'upi' ? 'bg-[#FAF6F0]/20' : 'bg-white hover:bg-gray-50/50'
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                      UPI / QR Code
                    </span>
                  </div>
                  <div className="text-[10px] font-bold italic tracking-wide text-gray-400 flex items-center">
                    UPI
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'card' ? 'bg-[#FAF6F0]/20' : 'bg-white hover:bg-gray-50/50'
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                      Credit / Debit Card
                    </span>
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
                    paymentMethod === 'netbanking' ? 'bg-[#FAF6F0]/20' : 'bg-white hover:bg-gray-50/50'
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                      Net Banking
                    </span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                    paymentMethod === 'cod' ? 'bg-[#FAF6F0]/20' : 'bg-white hover:bg-gray-50/50'
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
                        Pay when you receive your order
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                    ₹49
                  </span>
                </label>

              </div>
            </div>

            {/* Action buttons under form */}
            <div className="pt-2 text-center space-y-4">
              <button
                type="submit"
                className="w-full bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm transition-all active:scale-[0.99] duration-300 shadow-sm"
              >
                Continue to Review Order
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                <FiLock className="w-3.5 h-3.5 text-gray-400" />
                <span>100% Secure Checkout</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="bg-[#fcfcfc] border border-gray-100 p-6 sm:p-8 rounded-sm">
              
              {/* Box Title */}
              <div className="flex justify-between items-baseline mb-6 pb-2.5 border-b border-gray-200/50">
                <h2 className="font-serif text-[13px] font-normal text-gray-950 uppercase tracking-[0.2em]">
                  Order Summary
                </h2>
                <Link 
                  to="/cart" 
                  className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Product items listing */}
              <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-1">
                {CHECKOUT_ITEMS.map((item) => (
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
                          Color: {item.color} <span className="mx-1">·</span> Size: {item.size}
                        </span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 tracking-wide">
                          Qty: {item.qty}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-950 mt-1 block">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown details list */}
              <div className="border-t border-gray-100 pt-5 mt-5 space-y-4 text-xs font-light text-gray-600 text-left">
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">₹{subtotal.toLocaleString()}</span>
                </div>

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
                    <span>COD Charges</span>
                    <span className="font-semibold text-gray-950">₹{codCharges}</span>
                  </div>
                )}

                {/* Apply Coupon widget */}
                <div className="pt-2 border-t border-gray-100/50">
                  <button 
                    type="button"
                    onClick={() => console.log('Coupon click')}
                    className="w-full flex justify-between items-center text-[10px] font-bold text-gray-800 uppercase tracking-widest py-1 hover:text-rose-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FiGift className="w-3.5 h-3.5 text-gray-500" />
                      <span>Apply Coupon</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
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

            {/* Safe Checkout Card */}
            <div className="bg-[#FAF6F0]/20 border border-gray-100 p-5 rounded-sm flex gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/50 flex items-center justify-center text-gray-600 flex-shrink-0">
                <FiLock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 leading-tight">
                  Safe & Secure
                </h4>
                <p className="text-[9px] text-gray-400 font-light mt-1.5 leading-normal max-w-[200px]">
                  Your payment information is 100% secure and encrypted.
                </p>
              </div>
            </div>

            {/* Delivery Estimate Widget Box */}
            <div className="bg-[#FAF6F0]/20 border border-gray-100 p-5 rounded-sm flex gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200/50 flex items-center justify-center text-gray-600 flex-shrink-0">
                <FiPackage className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 leading-tight">
                  Your order will be delivered by
                </h4>
                <p className="text-[10px] font-bold text-gray-800 tracking-wide mt-2">
                  24 - 27 May, 2024
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
