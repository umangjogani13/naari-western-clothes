const express = require('express');
const router = express.Router();
const whyShopController = require('../controllers/whyShopController');

// Public route: Fetch active "Why Shop With Us" data for storefront
router.get('/', whyShopController.getWhyShop);

// Admin routes
router.get('/admin', whyShopController.getWhyShopAdmin);
router.put('/config', whyShopController.updateConfig);
router.post('/features', whyShopController.addFeature);
router.put('/features/reorder', whyShopController.reorderFeatures);
router.put('/features/:featureId', whyShopController.updateFeature);
router.delete('/features/:featureId', whyShopController.deleteFeature);
router.patch('/features/:featureId/move', whyShopController.moveFeature);
router.patch('/features/:featureId/status', whyShopController.toggleFeatureStatus);

module.exports = router;
