const InstagramPost = require('../models/instagramModel');

const INITIAL_POSTS = [
  { image: "/images/insta_1.jpg", caption: "Summer elegance in satin 🤍 #LavéraStyle", displayOrder: 1, likesCount: 245, status: "Active" },
  { image: "/images/insta_2.jpg", caption: "Denim on denim everyday mood 👖 #Lavéra", displayOrder: 2, likesCount: 189, status: "Active" },
  { image: "/images/insta_3.jpg", caption: "Blazer co-ord perfection for the weekend brunch ✨", displayOrder: 3, likesCount: 312, status: "Active" },
  { image: "/images/insta_4.jpg", caption: "Effortless casual luxury #LavéraWestern", displayOrder: 4, likesCount: 174, status: "Active" },
  { image: "/images/insta_5.jpg", caption: "Golden hour glow in our bestselling dress 🌅", displayOrder: 5, likesCount: 260, status: "Active" },
  { image: "/images/insta_6.jpg", caption: "Minimalist wardrobe staples done right ☕", displayOrder: 6, likesCount: 140, status: "Active" },
  { image: "/images/insta_7.jpg", caption: "Breezy linen sets for sunny afternoons 🌿", displayOrder: 7, likesCount: 215, status: "Active" },
  { image: "/images/newsletter_model.jpg", caption: "Join the Lavéra Style Club 💫 #LavéraWomen", displayOrder: 8, likesCount: 290, status: "Active" }
];

const ensureSeedData = async () => {
  try {
    const count = await InstagramPost.countDocuments();
    if (count === 0) {
      await InstagramPost.insertMany(INITIAL_POSTS);
      console.log('[Instagram] Auto-seeded 8 initial Instagram feed posts.');
    }
  } catch (err) {
    console.warn('[Instagram] Seed warning:', err.message);
  }
};

const instagramController = {
  // GET /api/instagram (Public active feed)
  getPosts: async (req, res) => {
    try {
      await ensureSeedData();
      const posts = await InstagramPost.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 }).lean();
      
      const formatted = (posts.length > 0 ? posts : INITIAL_POSTS).map((p, i) => ({
        id: p._id ? p._id.toString() : i + 1,
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
      res.json({
        success: true,
        count: INITIAL_POSTS.length,
        posts: INITIAL_POSTS.map((p, i) => ({ id: i + 1, ...p }))
      });
    }
  },

  // GET /api/instagram/admin (Admin list)
  getAdminPosts: async (req, res) => {
    try {
      await ensureSeedData();
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
