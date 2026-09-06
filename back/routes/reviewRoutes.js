const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Public
router.get('/featured', reviewController.getFeaturedTestimonials);
router.get('/', reviewController.getReviews);

// Admin
router.get('/admin', reviewController.getAdminReviews);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.patch('/:id/status', reviewController.toggleStatus);
router.patch('/:id/featured', reviewController.toggleFeatured);

module.exports = router;
