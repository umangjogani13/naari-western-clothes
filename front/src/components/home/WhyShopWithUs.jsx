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

const DEFAULT_WHY_SHOP = {
  heading: 'WHY SHOP WITH LAVÉRA?',
  subheading: 'Designed for you. Loved by thousands.',
  image: '/images/promo_look.jpg',
  features: [
    {
      _id: 'ws-1',
      title: 'Premium Quality',
      description: 'Finest fabrics, rigorous checking, and attention to detail in every single stitch.',
      icon: 'FiAward',
      iconBg: '#F5EFE6'
    },
    {
      _id: 'ws-2',
      title: 'Trendy Styles',
      description: 'Stay ahead of the curve with our curated drops matching global aesthetics.',
      icon: 'FiTrendingUp',
      iconBg: '#EAE8E3'
    },
    {
      _id: 'ws-3',
      title: 'Easy Returns',
      description: 'We offer a hassle-free, no-questions-asked 7-day return and exchange policy.',
      icon: 'FiRefreshCw',
      iconBg: '#E5ECE5'
    }
  ]
};

function WhyShopWithUs() {
  const [data, setData] = useState(DEFAULT_WHY_SHOP);

  useEffect(() => {
    const fetchWhyShopData = async () => {
      try {
        const res = await axiosClient.get('/why-shop');
        if (res && res.success && res.data) {
          setData({
            heading: res.data.heading || DEFAULT_WHY_SHOP.heading,
            subheading: res.data.subheading || DEFAULT_WHY_SHOP.subheading,
            image: res.data.image || DEFAULT_WHY_SHOP.image,
            features: (res.data.features && res.data.features.length > 0) 
              ? res.data.features 
              : DEFAULT_WHY_SHOP.features
          });
        }
      } catch (err) {
        console.warn('[WhyShopWithUs] Backend API offline. Using fallback data.');
        setData(DEFAULT_WHY_SHOP);
      }
    };
    fetchWhyShopData();
  }, []);

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
