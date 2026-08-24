import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiMinus, 
  FiPhoneCall,
  FiTruck,
  FiRotateCcw,
  FiLock,
  FiHeart
} from 'react-icons/fi';

const FAQS_LIST = [
  {
    question: "HOW CAN I PLACE AN ORDER?",
    answer: "You can place an order by adding items to your cart and proceeding to checkout. Fill in your details, choose a payment method and confirm your order."
  },
  {
    question: "WHAT PAYMENT METHODS DO YOU ACCEPT?",
    answer: "We accept all major credit cards, debit cards, UPI, and popular mobile wallets for a secure and seamless payment experience."
  },
  {
    question: "HOW LONG WILL IT TAKE TO DELIVER MY ORDER?",
    answer: "Standard delivery takes 3-5 business days for major cities and 5-7 business days for other locations. You will receive a tracking link once your order ships."
  },
  {
    question: "CAN I TRACK MY ORDER?",
    answer: "Yes, once your order is shipped, we will send you an email and SMS with a tracking number and a link to track your shipment in real-time."
  },
  {
    question: "WHAT IS YOUR RETURN POLICY?",
    answer: "We offer a 7-day hassle-free return policy. Items must be in their original packaging, unused, and with all tags attached to be eligible for returns."
  },
  {
    question: "HOW CAN I RETURN AN ITEM?",
    answer: "You can initiate a return from the \"My Orders\" section of your account page or by reaching out to our support team at hello@lavera.com."
  },
  {
    question: "WHEN WILL I GET MY REFUND?",
    answer: "Once we receive and inspect your returned item, we will process your refund within 2-3 business days. The amount will be credited back to your original payment mode."
  },
  {
    question: "DO YOU OFFER INTERNATIONAL SHIPPING?",
    answer: "Currently, we only ship within India. We are working on expanding our services to international locations soon."
  },
  {
    question: "HOW CAN I CONTACT CUSTOMER SUPPORT?",
    answer: "You can reach our customer support team via email at hello@lavera.com or by calling us at +91 98765 43210 (Mon - Sat, 10 AM - 7 PM)."
  }
];

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px] text-left">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">FAQs</span>
      </nav>

      {/* Top Banner (Split layout matching mockup) */}
      <div className="bg-[#FAF6F0] rounded-sm overflow-hidden border border-gray-100/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text details */}
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 text-left">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-950 uppercase tracking-[0.2em] mb-4 leading-snug">
              Frequently Asked<br />Questions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed tracking-wide max-w-xl">
              Find answers to the most common questions about our products, orders and services.
            </p>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 h-[240px] md:h-[320px] w-full">
            <img 
              src="/images/newsletter_model.jpg" 
              alt="FAQs Fashion Look" 
              className="w-full h-full object-cover object-top filter contrast-[0.98] brightness-[0.98]" 
            />
          </div>

        </div>
      </div>

      {/* Accordion list */}
      <div className="max-w-3xl mx-auto my-16 divide-y divide-gray-100">
        {FAQS_LIST.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div key={index} className="py-5 text-left">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center text-xs sm:text-xs font-bold uppercase tracking-widest text-gray-900 focus:outline-none py-1 group"
              >
                <span className="group-hover:text-rose-600 transition-colors">{faq.question}</span>
                <span className="text-gray-400 group-hover:text-black transition-colors ml-4 flex-shrink-0">
                  {isOpen ? <FiMinus className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
                </span>
              </button>

              {/* Collapsible Content */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs sm:text-[13px] text-gray-500 font-light tracking-wide leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box Widget */}
      <div className="max-w-3xl mx-auto bg-[#FAF6F0] border border-gray-100/50 p-6 sm:p-8 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 my-16 text-left">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-800 flex-shrink-0 shadow-sm">
            <FiPhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Still Have Questions?
            </h3>
            <p className="text-[11px] text-gray-400 font-light tracking-wide mt-1">
              Our customer support team is here to help you.
            </p>
          </div>
        </div>
        
        <Link 
          to="/contact" 
          className="bg-black hover:bg-rose-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 px-8 rounded-sm shadow-sm transition-all duration-300 active:scale-[0.98]"
        >
          Contact Us
        </Link>
      </div>

      {/* Bottom Trust Promises Banner Bar */}
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

    </div>
  );
}

export default Faqs;
