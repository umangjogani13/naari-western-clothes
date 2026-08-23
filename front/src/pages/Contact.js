import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiClock, 
  FiChevronDown, 
  FiCheckCircle 
} from 'react-icons/fi';

function Contact() {
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Customer Support',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields marked with *');
      return;
    }
    setError('');
    setIsSubmitted(true);
    // Reset form fields
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Customer Support',
      message: ''
    });
    setTimeout(() => setIsSubmitted(false), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[850px]">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Contact Us</span>
      </nav>

      {/* Main split information & Form (Desktop: 12 Columns split, Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20 text-left">
        
        {/* Left Column: Contact details (5 Columns) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-rose-600 font-bold block">
              Contact Us
            </span>
            <h1 className="font-serif text-3xl sm:text-[38px] font-normal leading-tight text-gray-950 uppercase tracking-wide">
              We'd Love to<br />Hear From You
            </h1>
            <p className="text-sm font-light text-gray-500 leading-relaxed max-w-sm">
              Have a question or need help? We're here for you. Reach out to us and we'll get back as soon as possible.
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-100">
            {/* Info 1: Office Address */}
            <div className="flex gap-4 items-start text-xs text-gray-600 font-light">
              <FiMapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block mb-1">Our Office</span>
                Lavéra Fashion Pvt. Ltd.<br />
                Surat, Gujarat, India - 395007
              </div>
            </div>

            {/* Info 2: Email Address */}
            <div className="flex gap-4 items-start text-xs text-gray-600 font-light">
              <FiMail className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block mb-1">Email Us</span>
                <a href="mailto:hello@lavera.com" className="hover:text-black transition-colors">hello@lavera.com</a>
              </div>
            </div>

            {/* Info 3: Call Us */}
            <div className="flex gap-4 items-start text-xs text-gray-600 font-light">
              <FiPhone className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block mb-1">Call Us</span>
                <a href="tel:+919876543210" className="hover:text-black transition-colors">+91 98765 43210</a>
              </div>
            </div>

            {/* Info 4: Working Hours */}
            <div className="flex gap-4 items-start text-xs text-gray-600 font-light">
              <FiClock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block mb-1">Working Hours</span>
                Mon - Sat: 10:00 AM - 7:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Message Form (7 Columns) */}
        <div className="lg:col-span-7 bg-[#fbfbfb] border border-gray-100 p-6 sm:p-10 rounded-sm shadow-sm relative">
          <h2 className="font-serif text-[15px] font-normal text-gray-950 uppercase tracking-[0.2em] mb-8 pb-3 border-b border-gray-200/50">
            Send Us a Message
          </h2>

          {isSubmitted && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-sm p-4 text-xs text-emerald-800 font-light flex items-start gap-3 animate-fade-in">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold block mb-0.5">Thank you! Your message has been sent.</span>
                We appreciate you reaching out. Our support team will get back to you within 24 hours.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-100 rounded-sm p-4 text-xs text-rose-800 font-light animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-gray-700">
            {/* Input 1: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                required
              />
            </div>

            {/* Row Input: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors"
                />
              </div>
            </div>

            {/* Input Select: Subject dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                Subject <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="appearance-none w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 pr-10 outline-none focus:border-black font-light tracking-wide transition-colors cursor-pointer"
                >
                  <option>Customer Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Partnership/Collab</option>
                  <option>General Inquiry</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
              </div>
            </div>

            {/* Input Area: Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="font-semibold text-gray-800 uppercase tracking-wider text-[10px]">
                Message <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                className="w-full bg-white border border-gray-200 rounded-sm py-3.5 px-4 outline-none focus:border-black font-light tracking-wide transition-colors resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Section 2: Find Us Here (Interactive Mock Map & Details Card) */}
      <section className="border-t border-gray-100 pt-16">
        <h2 className="font-serif text-2xl tracking-[0.2em] text-gray-950 uppercase mb-10">
          Find Us Here
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Styled Mock Map Canvas (8 Columns) */}
          <div className="lg:col-span-8 bg-gray-100 rounded-sm overflow-hidden h-[300px] sm:h-[380px] border border-gray-100 shadow-inner relative flex items-center justify-center">
            
            {/* Real aesthetic iframe layout mapping centered in Surat */}
            <iframe 
              title="Lavera Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2858162234057!2d72.77977461141753!3d21.14102148419777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05307b22a00c3%3A0xe54fb72561937ff3!2sVR%20Mall!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity duration-300"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right Column: Store Details Card (4 Columns) */}
          <div className="lg:col-span-4 bg-[#fbfbfb] border border-gray-100 rounded-sm p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              {/* Store Thumbnail Image */}
              <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-gray-50 border border-gray-100 mb-6 relative">
                <img src="/images/cat_coords.jpg" alt="Lavéra Boutique Storefront" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
                Boutique Store
              </span>
              <h3 className="font-serif text-lg font-normal text-gray-900 uppercase tracking-widest mb-3">
                Our Store
              </h3>
              <p className="text-xs font-light text-gray-500 leading-relaxed">
                Lavéra Store, VR Surat, Dumas Road, Vesu, Surat, Gujarat - 395007
              </p>
            </div>

            <a 
              href="https://maps.google.com/?q=VR+Mall+Surat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-white border border-gray-200 hover:border-black text-black text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 text-center mt-8 rounded-sm block transition-all duration-300 shadow-sm"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Contact;
