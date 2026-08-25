import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Faqs from './pages/Faqs';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import StoreLayout from './components/StoreLayout';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminOrders from './admin/Orders';
import AdminProducts from './admin/Products';
import AdminCustomers from './admin/Customers';
import AdminCategories from './admin/Categories';
import AdminCoupons from './admin/Coupons';
import AdminReviews from './admin/Reviews';
import AdminInventory from './admin/Inventory';
import AdminBlog from './admin/Blog';
import AdminBanners from './admin/Banners';
import AdminReports from './admin/Reports';
import AdminAnalytics from './admin/Analytics';
import AdminSettings from './admin/Settings';
import AdminUsers from './admin/Users';

function App() {
  return (
    <Routes>
      {/* Storefront Layout & Routes */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
      </Route>

      {/* Admin Panel Layout & Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default App;


