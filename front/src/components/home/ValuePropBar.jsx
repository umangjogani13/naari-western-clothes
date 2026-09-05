import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { FiTruck, FiRefreshCw, FiShield, FiAward, FiHeadphones,FiPackage,FiCreditCard,FiClock,FiCheckCircle,FiGift,FiStar,FiHeart,FiPercent,FiLock } from 'react-icons/fi';

const ICON_MAP = { FiTruck,FiRefreshCw,FiShield,FiAward,FiHeadphones,FiPackage,FiCreditCard,FiClock,FiCheckCircle,FiGift,FiStar,FiHeart,FiPercent,FiLock };

const FALLBACK_VALUE_PROPS = [
  {
    _id: 'vp-1',
    title: 'FREE SHIPPING',
    subtitle: 'On orders above ₹999',
    icon: 'FiTruck'
  },
  {
    _id: 'vp-2',
    title: 'EASY RETURNS',
    subtitle: '7-day return policy',
    icon: 'FiRefreshCw'
  },
  {
    _id: 'vp-3',
    title: 'SECURE PAYMENT',
    subtitle: '100% secure checkout',
    icon: 'FiShield'
  },
  {
    _id: 'vp-4',
    title: 'BEST QUALITY',
    subtitle: 'Handpicked just for you',
    icon: 'FiAward'
  },
  {
    _id: 'vp-5',
    title: 'CUSTOMER SUPPORT',
    subtitle: "We're here to help you",
    icon: 'FiHeadphones'
  }
];

function ValuePropBar() {
  const [items, setItems] = useState(FALLBACK_VALUE_PROPS);

  useEffect(() => {
    const fetchValueProps = async () => {
      try {
        const res = await axiosClient.get('/value-props');
        if (res && res.success && Array.isArray(res.items) && res.items.length > 0) {
          setItems(res.items);
        }
      } catch (err) {
        console.warn('[ValuePropBar] Backend API offline. Using fallback value propositions.');
        setItems(FALLBACK_VALUE_PROPS);
      }
    };
    fetchValueProps();
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || FiAward;
    return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 flex-shrink-0" />;
  };

  const itemCount = items.length;

  // Compute responsive columns dynamically based on item count
  const getGridColsClass = () => {
    if (itemCount === 1) return 'grid-cols-1';
    if (itemCount === 2) return 'grid-cols-2';
    if (itemCount === 3) return 'grid-cols-2 md:grid-cols-3';
    if (itemCount === 4) return 'grid-cols-2 md:grid-cols-4';
    return 'grid-cols-2 md:grid-cols-5';
  };

  return (
    <section className="bg-white border-b border-gray-100 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${getGridColsClass()} gap-y-8 gap-x-4 sm:gap-6`}>
          {items.map((item, index) => {
            // For 5 items on mobile, make the 5th item span full width across 2 cols if needed
            const isLastOfOdd = itemCount % 2 !== 0 && index === itemCount - 1;
            
            return (
              <div 
                key={item._id || index}
                className={`flex items-center space-x-3 justify-start md:justify-center ${
                  isLastOfOdd ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                {renderIcon(item.icon)}
                <div className="text-left">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ValuePropBar;
