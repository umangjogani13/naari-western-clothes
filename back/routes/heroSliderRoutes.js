const express = require('express');
const router = express.Router();
const heroSliderController = require('../controllers/heroSliderController');

// Public route: Fetch active slides for storefront
router.get('/', heroSliderController.getActiveSlides);

// Admin routes: Manage slides
router.get('/admin', heroSliderController.getAllSlides);
router.post('/', heroSliderController.createSlide);
router.put('/:id', heroSliderController.updateSlide);
router.delete('/:id', heroSliderController.deleteSlide);
router.patch('/:id/status', heroSliderController.toggleStatus);

module.exports = router;
