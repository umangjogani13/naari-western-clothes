const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Public
router.get('/', bannerController.getBanners);

// Admin
router.get('/admin', bannerController.getAdminBanners);
router.post('/', bannerController.createBanner);
router.put('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);
router.patch('/:id/status', bannerController.toggleStatus);

module.exports = router;
