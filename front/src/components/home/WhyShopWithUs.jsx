import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
  FiAward, 
  FiTrendingUp, 
  FiRefreshCw, 
  FiShield, 
  FiTruck, 
  FiHeart, 
  FiStar, 
  FiCheckCircle, 
  FiPackage, 
  FiSmile, 
  FiHeadphones, 
  FiTag, 
  FiGift, 
  FiZap 
} from 'react-icons/fi';

const ICON_MAP = {
  FiAward,
  FiTrendingUp,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiHeart,
  FiStar,
  FiCheckCircle,
  FiPackage,
  FiSmile,
  FiHeadphones,
  FiTag,
  FiGift,
  FiZap
};

function WhyShopWithUs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchWhyShopData = async () => {
      try {
        const res = await axiosClient.get('/why-shop');
        if (res && res.success && res.data && Array.isArray(res.data.features) && res.data.features.length > 0) {
          setData(res.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.warn('[WhyShopWithUs] Backend API offline or empty.');
        setData(null);
      }
    };
    fetchWhyShopData();
  }, []);

  if (!data || !Array.isArray(data.features) || data.features.length === 0) {
    return null;
  }

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || FiAward;
    return <IconComponent className="w-5 h-5 text-gray-800" />;
  };

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="flex flex-col text-left space-y-6 md:pr-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-serif font-normal tracking-[0.18em] text-gray-950 uppercase mb-2">
                {data.heading}
              </h2>
              {data.subheading && (
                <p className="text-xs sm:text-sm text-gray-400 font-light uppercase tracking-widest">
                  {data.subheading}
                </p>
              )}
            </div>

            {/* Stacked features */}
            <div className="space-y-6 pt-4">
              {data.features.map((feature, idx) => (
                <div key={feature._id || idx} className="flex items-start space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
                    style={{ backgroundColor: feature.iconBg || '#F5EFE6' }}
                  >
                    {renderIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Column */}
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
            <img 
              src={data.image} 
              alt={data.heading || 'Why Shop Lifestyle'} 
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => { e.target.src = '/images/promo_look.jpg'; }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyShopWithUs;
