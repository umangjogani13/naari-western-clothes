const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

// Public
router.get('/', instagramController.getPosts);

// Admin
router.get('/admin', instagramController.getAdminPosts);
router.post('/', instagramController.createPost);
router.put('/:id', instagramController.updatePost);
router.delete('/:id', instagramController.deletePost);
router.patch('/:id/status', instagramController.toggleStatus);

module.exports = router;
