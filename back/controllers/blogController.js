const Blog = require('../models/blogModel');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const blogController = {
  // GET /api/blog (Public: get published posts, optionally filter by category/featured/limit)
  getPosts: async (req, res) => {
    try {
      const { limit, category, featured, search } = req.query;
      const filter = { status: 'Published' };

      if (category && category !== 'All') filter.category = category;
      if (featured === 'true') filter.isFeaturedOnHome = true;
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { author: regex }, { category: regex }, { excerpt: regex }];
      }

      let query = Blog.find(filter).sort({ createdAt: -1 });
      if (limit && !isNaN(limit)) query = query.limit(Number(limit));

      const posts = await query.lean();

      const formatted = posts.map(p => ({
        id: p._id ? p._id.toString() : p.slug,
        _id: p._id,
        title: p.title,
        slug: p.slug,
        date: p.date,
        author: p.author,
        category: p.category,
        image: p.image,
        excerpt: p.excerpt,
        content: p.content,
        readTime: p.readTime,
        status: p.status,
        isFeaturedOnHome: p.isFeaturedOnHome,
        link: `/blog/${p.slug}`
      }));

      res.json({ success: true, count: formatted.length, posts: formatted });
    } catch (error) {
      console.error('[Blog getPosts error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch blog posts', error: error.message, posts: [] });
    }
  },

  // GET /api/blog/admin/all (Admin list with stats and filters)
  getAdminPosts: async (req, res) => {
    try {
      const { search, category, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { author: regex },
          { category: regex },
          { excerpt: regex },
          { slug: regex }
        ];
      }
      if (category && category !== 'All') filter.category = category;
      if (status && status !== 'All') filter.status = status;

      const posts = await Blog.find(filter).sort({ createdAt: -1 }).lean();
      const total = await Blog.countDocuments();
      const published = await Blog.countDocuments({ status: 'Published' });
      const draft = await Blog.countDocuments({ status: 'Draft' });

      res.json({
        success: true,
        stats: { total, published, draft },
        posts
      });
    } catch (error) {
      console.error('[Blog getAdminPosts error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch admin blog posts', error: error.message });
    }
  },

  // GET /api/blog/:idOrSlug (Public/Admin: single post by MongoDB ID or slug)
  getPostByIdOrSlug: async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let post = null;

      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        post = await Blog.findById(idOrSlug).lean();
      }
      if (!post) {
        post = await Blog.findOne({ slug: idOrSlug.toLowerCase() }).lean();
      }

      if (!post) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      res.json({ success: true, post });
    } catch (error) {
      console.error('[Blog getPostByIdOrSlug error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to retrieve article', error: error.message });
    }
  },

  // POST /api/blog (Admin: Create post)
  createPost: async (req, res) => {
    try {
      const { title, slug, author, date, category, image, content, excerpt, readTime, status, isFeaturedOnHome } = req.body;
      if (!title || !content || !image) {
        return res.status(400).json({ success: false, message: 'Title, Image, and Content are required.' });
      }

      let postSlug = slug ? generateSlug(slug) : generateSlug(title);
      // Ensure unique slug
      const existingSlug = await Blog.findOne({ slug: postSlug });
      if (existingSlug) {
        postSlug = `${postSlug}-${Date.now().toString().slice(-4)}`;
      }

      const newPost = new Blog({
        title: title.trim(),
        slug: postSlug,
        author: author ? author.trim() : 'Lavéra Editorial',
        date: date ? date.trim() : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: category ? category.trim() : 'Fashion',
        image: image.trim(),
        content: content.trim(),
        excerpt: excerpt ? excerpt.trim() : content.substring(0, 150) + '...',
        readTime: readTime ? readTime.trim() : '4 min read',
        status: status === 'Draft' ? 'Draft' : 'Published',
        isFeaturedOnHome: isFeaturedOnHome !== undefined ? Boolean(isFeaturedOnHome) : true
      });

      await newPost.save();
      res.status(201).json({ success: true, message: 'Article published successfully', post: newPost });
    } catch (error) {
      console.error('[Blog createPost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to publish article', error: error.message });
    }
  },

  // PUT /api/blog/:id (Admin: Update post)
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, slug, author, date, category, image, content, excerpt, readTime, status, isFeaturedOnHome } = req.body;

      if (title !== undefined && !title.trim()) {
        return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
      }
      if (image !== undefined && !image.trim()) {
        return res.status(400).json({ success: false, message: 'Image cannot be empty.' });
      }
      if (content !== undefined && !content.trim()) {
        return res.status(400).json({ success: false, message: 'Content cannot be empty.' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (slug !== undefined && slug.trim()) {
        updateData.slug = generateSlug(slug);
      } else if (title !== undefined) {
        updateData.slug = generateSlug(title);
      }
      if (author !== undefined) updateData.author = author.trim();
      if (date !== undefined) updateData.date = date.trim();
      if (category !== undefined) updateData.category = category.trim();
      if (image !== undefined) updateData.image = image.trim();
      if (content !== undefined) updateData.content = content.trim();
      if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
      if (readTime !== undefined) updateData.readTime = readTime.trim();
      if (status !== undefined) updateData.status = status;
      if (isFeaturedOnHome !== undefined) updateData.isFeaturedOnHome = Boolean(isFeaturedOnHome);

      const updated = await Blog.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true }).lean();
      if (!updated) return res.status(404).json({ success: false, message: 'Article not found' });
      res.json({ success: true, message: 'Article updated successfully', post: updated });
    } catch (error) {
      console.error('[Blog updatePost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update article', error: error.message });
    }
  },

  // DELETE /api/blog/:id (Admin: Delete post)
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Blog.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Article not found' });
      res.json({ success: true, message: 'Article deleted successfully', id });
    } catch (error) {
      console.error('[Blog deletePost error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete article', error: error.message });
    }
  },

  // PATCH /api/blog/:id/status (Admin: Toggle status Published <-> Draft)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Blog.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Article not found' });

      const newStatus = req.body && req.body.status
        ? req.body.status
        : (post.status === 'Published' ? 'Draft' : 'Published');

      post.status = newStatus;
      await post.save();
      res.json({ success: true, message: `Article status changed to ${post.status}`, status: post.status, post });
    } catch (error) {
      console.error('[Blog toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  },

  // PATCH /api/blog/:id/feature (Admin: Toggle isFeaturedOnHome)
  toggleFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Blog.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Article not found' });

      post.isFeaturedOnHome = !post.isFeaturedOnHome;
      await post.save();
      res.json({
        success: true,
        message: post.isFeaturedOnHome ? 'Article featured on Home Page' : 'Article removed from Home Page feature',
        isFeaturedOnHome: post.isFeaturedOnHome,
        post
      });
    } catch (error) {
      console.error('[Blog toggleFeature error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle home feature', error: error.message });
    }
  }
};

module.exports = blogController;
