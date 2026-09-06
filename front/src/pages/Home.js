import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  HeroSlider,
  ValuePropBar,
  ShopByCategory,
  PromoBanners,
  NewArrivals,
  Bestsellers,
  WhyShopWithUs,
  CustomerTestimonials,
  InstagramFeed,
  BlogSection,
  NewsletterSection,
  FALLBACK_PRODUCTS
} from '../components/home';

function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic new arrival products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response = await axiosClient.get('/products?newArrival=true&limit=8');
        if (!response || !response.success || !Array.isArray(response.products) || response.products.length < 3) {
          response = await axiosClient.get('/products?limit=8');
        }

        if (response && response.success && Array.isArray(response.products)) {
          const merged = response.products.map(p => {
            const fb = FALLBACK_PRODUCTS.find(f => f.name.toLowerCase() === p.name.toLowerCase()) || {};
            return {
              ...p,
              reviewsCount: p.reviewsCount || fb.reviewsCount || 50,
              colors: (p.colors && p.colors.length > 0) 
                ? p.colors.map(c => typeof c === 'string' ? c : c.value) 
                : (fb.colors || ["#FFFFFF", "#000000"])
            };
          });
          setProducts(merged);
        }
      } catch (err) {
        console.warn('Backend API offline. Using fallback mock products.');
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full font-sans bg-white select-none overflow-x-hidden">
      {/* 1. Hero Section Slider */}
      <HeroSlider />

      {/* 2. Value Prop Bar (5 columns) */}
      <ValuePropBar />

      {/* 3. Shop By Category (Scrollable layout) */}
      <ShopByCategory />

      {/* 4. Triple Promo Banners Grid */}
      <PromoBanners />

      {/* 5. New Arrivals (Responsive Carousel) */}
      <NewArrivals products={products} loading={loading} />

      {/* 6. Bestsellers (Ranked Circular Items) */}
      <Bestsellers />

      {/* 7. Why Shop With Lavéra? */}
      <WhyShopWithUs />

      {/* 8. What Our Customers Say (Testimonials) */}
      <CustomerTestimonials />

      {/* 9. Instagram Feed */}
      <InstagramFeed />

      {/* 10. From The Blog */}
      <BlogSection />

      {/* 11. Join The Style Club (Newsletter Banner) */}
      <NewsletterSection />
    </div>
  );
}

export default Home;
