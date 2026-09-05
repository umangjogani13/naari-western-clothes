const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public catalog routes
router.get('/', productController.getProducts);
router.get('/admin', productController.getAllProductsAdmin);
router.get('/:id', productController.getProductById);

// Admin management routes
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/stock', productController.updateStock);
router.patch('/:id/status', productController.toggleStatus);

module.exports = router;
