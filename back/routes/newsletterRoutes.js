const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Public
router.get('/settings', newsletterController.getSettings);
router.post('/subscribe', newsletterController.subscribe);

// Admin
router.put('/settings', newsletterController.updateSettings);
router.get('/subscribers', newsletterController.getSubscribers);

module.exports = router;
