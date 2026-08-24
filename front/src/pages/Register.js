import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiTag, FiRotateCcw, FiHeadphones } from 'react-icons/fi';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate successful registration and redirect to account page
    console.log('Registration details:', { 
      firstName, 
      lastName, 
      email, 
      phone: `${countryCode} ${phone}`, 
      password, 
      agreeTerms 
    });
    navigate('/account');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Register</span>
      </nav>

      {/* Main card grid container */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual panel (5 columns on large screen, matching mockup layout) */}
          <div className="lg:col-span-5 bg-[#FAF6F0] p-8 sm:p-12 flex flex-col justify-between min-h-[550px] lg:min-h-[650px]">
            
            {/* Header Text block */}
            <div className="text-left">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-1">
                Create Your Account
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-light tracking-wide leading-relaxed">
                Join Lavéra and discover a world of style, made just for you.
              </p>
              <div className="w-12 h-[2px] bg-[#C6A482] mt-4 rounded-full"></div>
            </div>

            {/* Middle Image block */}
            <div className="my-6 flex-1 flex items-center justify-center max-h-[350px] overflow-hidden">
              <img 
                src="/images/promo_look.jpg" 
                alt="Create Account Model" 
                className="w-full h-full object-cover object-top rounded-sm max-w-[280px] aspect-[3/4] shadow-sm transform hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Bottom features bar */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-200/50 mt-auto text-center">
              <div className="flex flex-col items-center group cursor-default">
                <FiTag className="w-5 h-5 text-gray-800 mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-800 block">
                  Exclusive Offers
                </span>
              </div>
              <div className="flex flex-col items-center group cursor-default">
                <FiRotateCcw className="w-5 h-5 text-gray-800 mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-800 block">
                  Easy Returns
                </span>
              </div>
              <div className="flex flex-col items-center group cursor-default">
                <FiHeadphones className="w-5 h-5 text-gray-800 mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-rose-600" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-800 block">
                  Priority Support
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Register Form panel (7 columns on large screen) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 lg:px-16 lg:py-12 flex flex-col justify-center">
            
            {/* Header Title */}
            <div className="mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-1.5">
                Create Account
              </h1>
              <p className="text-xs text-gray-400 font-light tracking-wide">
                Sign up and start your style journey with us.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs text-gray-700 text-left">
              
              {/* First Name & Last Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firstName" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                    First Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lastName" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                    Last Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                  required
                />
              </div>

              {/* Phone Number with custom Prefix Selector */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-shrink-0 w-24">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full h-full bg-white border border-gray-200 rounded-sm py-3 px-4 pr-8 text-xs font-semibold tracking-wider outline-none focus:border-black transition-colors cursor-pointer appearance-none"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                      <option value="+971">+971</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="flex-1 bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-2.5 pt-2 select-none">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-black w-4 h-4 rounded border-gray-300 text-black focus:ring-black mt-0.5 cursor-pointer"
                  required
                />
                <label htmlFor="agreeTerms" className="cursor-pointer text-gray-600 font-light leading-normal">
                  I agree to the <Link to="/terms" className="underline hover:text-black transition-colors">Terms & Conditions</Link> and <Link to="/privacy" className="underline hover:text-black transition-colors">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm transition-all active:scale-[0.99] duration-300 shadow-sm"
                >
                  Create Account
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  OR
                </span>
              </div>

              {/* Social Logins */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => console.log('Google login clicked')}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-black py-3.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-gray-50 bg-white"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.66-.35-1.36-.35-2.09z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log('Apple login clicked')}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-black py-3.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-gray-50 bg-white"
                >
                  <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4 text-gray-500 font-light">
                Already have an account?
                <Link to="/login" className="text-[#C6A482] hover:text-[#b08e6c] font-semibold transition-colors uppercase tracking-widest text-[10px] ml-1.5">
                  Login
                </Link>
              </div>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;
