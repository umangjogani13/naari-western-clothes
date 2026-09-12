const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const heroSliderController = require('../controllers/heroSliderController');
const bannerController = require('../controllers/bannerController');
const valuePropController = require('../controllers/valuePropController');
const whyShopController = require('../controllers/whyShopController');
const reviewController = require('../controllers/reviewController');
const instagramController = require('../controllers/instagramController');
const blogController = require('../controllers/blogController');
const newsletterController = require('../controllers/newsletterController');
const orderController = require('../controllers/orderController');
const couponController = require('../controllers/couponController');
const customerController = require('../controllers/customerController');
const dashboardController = require('../controllers/dashboardController');

// ==========================================
// 1. HEALTH CHECK
// ==========================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Naari Western Clothes API is running' });
});

// ==========================================
// 2. AUTH & USER MANAGEMENT ROUTES
// ==========================================
// Public
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected (Customer / Admin Profile)
router.get('/auth/profile', authMiddleware, authController.getProfile);
router.put('/auth/profile', authMiddleware, authController.updateProfile);

// Admin User Management
router.get('/auth/users', authController.getAllUsers);
router.post('/auth/users', authController.createUser);
router.put('/auth/users/:id', authController.updateUser);
router.delete('/auth/users/:id', authController.deleteUser);

// ==========================================
// 3. PRODUCT ROUTES
// ==========================================
// Public catalog
router.get('/products', productController.getProducts);
router.get('/products/admin', productController.getAllProductsAdmin);
router.get('/products/:id', productController.getProductById);

// Admin management
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.patch('/products/:id/stock', productController.updateStock);
router.patch('/products/:id/status', productController.toggleStatus);

// ==========================================
// 4. CATEGORY ROUTES
// ==========================================
// Public
router.get('/categories', categoryController.getCategories);
router.get('/categories/featured', categoryController.getFeaturedCategories);
router.get('/categories/admin', categoryController.getCategoriesAdmin);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Admin
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.patch('/categories/:id/status', categoryController.toggleStatus);
router.patch('/categories/:id/featured', categoryController.toggleFeatured);

// ==========================================
// 5. HERO SLIDER ROUTES
// ==========================================
// Public
router.get('/hero-slider', heroSliderController.getActiveSlides);

// Admin
router.get('/hero-slider/admin', heroSliderController.getAllSlides);
router.post('/hero-slider', heroSliderController.createSlide);
router.put('/hero-slider/reorder', heroSliderController.reorderSlides);
router.put('/hero-slider/:id', heroSliderController.updateSlide);
router.delete('/hero-slider/:id', heroSliderController.deleteSlide);
router.patch('/hero-slider/:id/move', heroSliderController.moveSlide);
router.patch('/hero-slider/:id/status', heroSliderController.toggleStatus);

// ==========================================
// 6. PROMO BANNER ROUTES
// ==========================================
// Public
router.get('/banners', bannerController.getBanners);

// Admin
router.get('/banners/admin', bannerController.getAdminBanners);
router.put('/banners/reorder', bannerController.reorderBanners);
router.get('/banners/:id', bannerController.getBannerById);
router.post('/banners', bannerController.createBanner);
router.put('/banners/:id', bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);
router.patch('/banners/:id/move', bannerController.moveBanner);
router.patch('/banners/:id/status', bannerController.toggleStatus);

// ==========================================
// 7. VALUE PROP BAR ROUTES
// ==========================================
// Public
router.get('/value-props', valuePropController.getActiveValueProps);

// Admin
router.get('/value-props/admin', valuePropController.getAllValueProps);
router.post('/value-props', valuePropController.createValueProp);
router.put('/value-props/reorder', valuePropController.reorderValueProps);
router.put('/value-props/:id', valuePropController.updateValueProp);
router.delete('/value-props/:id', valuePropController.deleteValueProp);
router.patch('/value-props/:id/move', valuePropController.moveValueProp);
router.patch('/value-props/:id/status', valuePropController.toggleStatus);

// ==========================================
// 8. WHY SHOP WITH US ROUTES
// ==========================================
// Public
router.get('/why-shop', whyShopController.getWhyShop);

// Admin
router.get('/why-shop/admin', whyShopController.getWhyShopAdmin);
router.put('/why-shop/config', whyShopController.updateConfig);
router.post('/why-shop/features', whyShopController.addFeature);
router.put('/why-shop/features/reorder', whyShopController.reorderFeatures);
router.put('/why-shop/features/:featureId', whyShopController.updateFeature);
router.delete('/why-shop/features/:featureId', whyShopController.deleteFeature);
router.patch('/why-shop/features/:featureId/move', whyShopController.moveFeature);
router.patch('/why-shop/features/:featureId/status', whyShopController.toggleFeatureStatus);

// ==========================================
// 9. REVIEWS & TESTIMONIALS ROUTES
// ==========================================
// Public
router.get('/reviews/featured', reviewController.getFeaturedTestimonials);
router.get('/reviews', reviewController.getReviews);

// Admin
router.get('/reviews/admin', reviewController.getAdminReviews);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);
router.patch('/reviews/:id/status', reviewController.toggleStatus);
router.patch('/reviews/:id/featured', reviewController.toggleFeatured);

// ==========================================
// 10. INSTAGRAM FEED ROUTES
// ==========================================
// Public
router.get('/instagram', instagramController.getPosts);

// Admin
router.get('/instagram/admin', instagramController.getAdminPosts);
router.post('/instagram', instagramController.createPost);
router.put('/instagram/:id', instagramController.updatePost);
router.delete('/instagram/:id', instagramController.deletePost);
router.patch('/instagram/:id/status', instagramController.toggleStatus);

// ==========================================
// 11. BLOG & EDITORIAL ROUTES
// ==========================================
// Public
router.get('/blog', blogController.getPosts);

// Admin
router.get('/blog/admin/all', blogController.getAdminPosts);
router.post('/blog', blogController.createPost);
router.put('/blog/:id', blogController.updatePost);
router.delete('/blog/:id', blogController.deletePost);
router.patch('/blog/:id/status', blogController.toggleStatus);
router.patch('/blog/:id/feature', blogController.toggleFeature);

// Single post (by ID or Slug)
router.get('/blog/:idOrSlug', blogController.getPostByIdOrSlug);

// ==========================================
// 12. NEWSLETTER ROUTES
// ==========================================
// Public
router.get('/newsletter/settings', newsletterController.getSettings);
router.post('/newsletter/subscribe', newsletterController.subscribe);

// Admin
router.put('/newsletter/settings', newsletterController.updateSettings);
router.get('/newsletter/subscribers', newsletterController.getSubscribers);

// ==========================================
// 13. ORDER ROUTES
// ==========================================
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.delete('/orders/:id', orderController.deleteOrder);

// ==========================================
// 14. COUPON ROUTES
// ==========================================
router.get('/coupons', couponController.getCoupons);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);
router.post('/coupons/validate', couponController.validateCoupon);

// ==========================================
// 15. CUSTOMER DIRECTORY ROUTES
// ==========================================
router.get('/customers', customerController.getCustomers);
router.delete('/customers/:id', customerController.deleteCustomer);

// ==========================================
// 16. DASHBOARD & ANALYTICS ROUTES
// ==========================================
router.get('/dashboard', dashboardController.getStats);
router.get('/dashboard/stats', dashboardController.getStats);

module.exports = router;
