import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import heroSliderReducer from './slices/heroSliderSlice';
import bannerReducer from './slices/bannerSlice';
import blogReducer from './slices/blogSlice';
import reviewReducer from './slices/reviewSlice';
import instagramReducer from './slices/instagramSlice';
import valuePropReducer from './slices/valuePropSlice';
import whyShopReducer from './slices/whyShopSlice';
import orderReducer from './slices/orderSlice';
import couponReducer from './slices/couponSlice';
import customerReducer from './slices/customerSlice';
import dashboardReducer from './slices/dashboardSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
    products: productReducer,
    categories: categoryReducer,
    heroSlider: heroSliderReducer,
    banners: bannerReducer,
    blog: blogReducer,
    reviews: reviewReducer,
    instagram: instagramReducer,
    valueProps: valuePropReducer,
    whyShop: whyShopReducer,
    orders: orderReducer,
    coupons: couponReducer,
    customers: customerReducer,
    dashboard: dashboardReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
