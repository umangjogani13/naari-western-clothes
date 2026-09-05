const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public listing
router.get('/', categoryController.getCategories);

// Featured for Home page Shop By Category
router.get('/featured', categoryController.getFeaturedCategories);

// Admin listing with KPI stats
router.get('/admin', categoryController.getCategoriesAdmin);

// Single category lookup by slug
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin operations
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.patch('/:id/status', categoryController.toggleStatus);
router.patch('/:id/featured', categoryController.toggleFeatured);

module.exports = router;
