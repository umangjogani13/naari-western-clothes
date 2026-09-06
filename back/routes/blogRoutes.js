const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Public
router.get('/', blogController.getPosts);
router.get('/:slug', blogController.getPostBySlug);

// Admin
router.get('/admin/all', blogController.getAdminPosts);
router.post('/', blogController.createPost);
router.put('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);
router.patch('/:id/status', blogController.toggleStatus);

module.exports = router;
