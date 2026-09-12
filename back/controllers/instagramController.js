const InstagramPost = require('../models/instagramModel');

const instagramController = {
  // GET /api/instagram (Public active feed)
  getPosts: async (req, res) => {
    try {
      const posts = await InstagramPost.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 }).lean();
      
      const formatted = posts.map(p => ({
        id: p._id ? p._id.toString() : p._id,
        _id: p._id,
        image: p.image,
        caption: p.caption,
        postUrl: p.postUrl || 'https://instagram.com',
        likesCount: p.likesCount,
        displayOrder: p.displayOrder
      }));

      res.json({ success: true, count: formatted.length, posts: formatted });
    } catch (error) {
      console.error('[Instagram getPosts error]:', error.message);
      res.status(500).json({
        success: false,
        count: 0,
        posts: [],
        message: 'Failed to fetch instagram posts'
      });
    }
  },

  // GET /api/instagram/admin (Admin list)
  getAdminPosts: async (req, res) => {
    try {
      const posts = await InstagramPost.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      const total = await InstagramPost.countDocuments();
      const active = await InstagramPost.countDocuments({ status: 'Active' });

      res.json({
        success: true,
        stats: { total, active, inactive: total - active },
        posts
      });
    } catch (error) {
      console.error('[Instagram getAdminPosts error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch instagram posts', error: error.message });
    }
  },

  // POST /api/instagram (Admin: Create post)
  createPost: async (req, res) => {
    try {
      const { image, caption, postUrl, likesCount, displayOrder, status } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, message: 'Image is required.' });
      }

      const newPost = new InstagramPost({
        image: image.trim(),
        caption: caption ? caption.trim() : 'Styling LAVÉRA western essentials ✨',
        postUrl: postUrl ? postUrl.trim() : 'https://instagram.com',
        likesCount: likesCount !== undefined ? Number(likesCount) : 120,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 1,
        status: status || 'Active'
      });

      await newPost.save();
      res.status(201).json({ success: true, message: 'Instagram post added', post: newPost });
    } catch (error) {
      console.error('[Instagram createPost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create instagram post', error: error.message });
    }
  },

  // PUT /api/instagram/:id (Admin: Update post)
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await InstagramPost.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Post not found' });
      res.json({ success: true, message: 'Post updated successfully', post: updated });
    } catch (error) {
      console.error('[Instagram updatePost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update post', error: error.message });
    }
  },

  // DELETE /api/instagram/:id (Admin: Delete post)
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await InstagramPost.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Post not found' });
      res.json({ success: true, message: 'Post deleted successfully', id });
    } catch (error) {
      console.error('[Instagram deletePost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message });
    }
  },

  // PATCH /api/instagram/:id/status (Admin: Toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await InstagramPost.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      post.status = post.status === 'Active' ? 'Inactive' : 'Active';
      await post.save();
      res.json({ success: true, message: `Post is now ${post.status}`, status: post.status, post });
    } catch (error) {
      console.error('[Instagram toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle post status', error: error.message });
    }
  }
};

module.exports = instagramController;
