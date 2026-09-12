import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../store/slices/productSlice';
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
  NewsletterSection
} from '../components/home';

function Home() {
  const dispatch = useDispatch();
  const { newArrivals: products = [], loading } = useSelector((state) => state.products || {});

  // Fetch dynamic new arrival products from Redux
  useEffect(() => {
    dispatch(fetchNewArrivals(8));
  }, [dispatch]);

  const formattedProducts = (products || []).map(p => ({
    ...p,
    colors: (p.colors && p.colors.length > 0) 
      ? p.colors.map(c => typeof c === 'string' ? c : (c.value || c.name)) 
      : []
  }));

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

      {/* 5. New Arrivals (Responsive Carousel) - displays only when products exist */}
      <NewArrivals products={formattedProducts} loading={loading} />

      {/* 6. Bestsellers (Ranked Circular Items) - displays only when bestsellers exist */}
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
