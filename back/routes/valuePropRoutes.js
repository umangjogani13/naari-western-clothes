const express = require('express');
const router = express.Router();
const valuePropController = require('../controllers/valuePropController');

// Public route: Fetch active value propositions
router.get('/', valuePropController.getActiveValueProps);

// Admin routes: Manage items
router.get('/admin', valuePropController.getAllValueProps);
router.post('/', valuePropController.createValueProp);
router.put('/reorder', valuePropController.reorderValueProps);
router.put('/:id', valuePropController.updateValueProp);
router.delete('/:id', valuePropController.deleteValueProp);
router.patch('/:id/move', valuePropController.moveValueProp);
router.patch('/:id/status', valuePropController.toggleStatus);

module.exports = router;
