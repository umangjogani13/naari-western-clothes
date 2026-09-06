const Blog = require('../models/blogModel');

const INITIAL_BLOGS = [
  {
    title: "5 Ways to Style Wide Leg Jeans This Summer",
    slug: "5-ways-to-style-wide-leg-jeans-this-summer",
    author: "Lavéra Editorial",
    date: "20 May, 2026",
    category: "Styling",
    image: "/images/cat_jeans.jpg",
    excerpt: "Wide leg denim is having a huge moment. Learn 5 chic ways to style it with crop tops, oversized shirts, and blazers.",
    content: "Wide leg jeans are the ultimate combination of vintage aesthetic and breezy modern comfort. Whether paired with an oversized cotton shirt tucked in at the front or a fitted ruched crop top, wide-leg denim flatters every body type effortlessly.",
    readTime: "4 min read",
    status: "Published",
    isFeaturedOnHome: true
  },
  {
    title: "Summer Wardrobe Essentials You Need",
    slug: "summer-wardrobe-essentials-you-need",
    author: "Lavéra Editorial",
    date: "15 May, 2026",
    category: "Wardrobe",
    image: "/images/promo_weekend.jpg",
    excerpt: "From breathable linen co-ords to fluid satin slips, build your dream warm-weather wardrobe with these essentials.",
    content: "As temperatures rise, lightweight fabrics take center stage. Discover how investing in breathable pure linen co-ords, crisp white cotton shirts, and slip-on satin midi dresses can keep you effortlessly stylish all season long.",
    readTime: "5 min read",
    status: "Published",
    isFeaturedOnHome: true
  },
  {
    title: "How to Build the Perfect Capsule Wardrobe",
    slug: "how-to-build-the-perfect-capsule-wardrobe",
    author: "Lavéra Editorial",
    date: "10 May, 2026",
    category: "Fashion",
    image: "/images/promo_look.jpg",
    excerpt: "Stop staring at a full closet with nothing to wear. A mindful capsule wardrobe simplifies your mornings.",
    content: "A capsule wardrobe isn't about owning boring clothes—it's about intentional versatility. By choosing high-quality foundational pieces that mix and match seamlessly, you eliminate decision fatigue and always look polished.",
    readTime: "6 min read",
    status: "Published",
    isFeaturedOnHome: true
  }
];

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ensureSeedData = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(INITIAL_BLOGS);
      console.log('[Blog] Auto-seeded 3 initial blog articles.');
    }
  } catch (err) {
    console.warn('[Blog] Seed error:', err.message);
  }
};

const blogController = {
  // GET /api/blog (Public: get published posts, optionally limit)
  getPosts: async (req, res) => {
    try {
      await ensureSeedData();
      const { limit, category, featured } = req.query;
      const filter = { status: 'Published' };

      if (category && category !== 'All') filter.category = category;
      if (featured === 'true') filter.isFeaturedOnHome = true;

      let query = Blog.find(filter).sort({ createdAt: -1 });
      if (limit && !isNaN(limit)) query = query.limit(Number(limit));

      const posts = await query.lean();

      // Format for storefront compatibility
      const formatted = (posts.length > 0 ? posts : INITIAL_BLOGS).map(p => ({
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
        link: `/blog/${p.slug}`
      }));

      res.json({ success: true, count: formatted.length, posts: formatted });
    } catch (error) {
      console.error('[Blog getPosts error]:', error.message);
      res.json({
        success: true,
        count: INITIAL_BLOGS.length,
        posts: INITIAL_BLOGS.map((b, i) => ({ id: i + 1, ...b, link: `/blog/${b.slug}` }))
      });
    }
  },

  // GET /api/blog/:slug (Public: single post)
  getPostBySlug: async (req, res) => {
    try {
      await ensureSeedData();
      const { slug } = req.params;
      const post = await Blog.findOne({ slug: slug.toLowerCase() }).lean();
      if (!post) {
        const fb = INITIAL_BLOGS.find(b => b.slug === slug.toLowerCase());
        if (fb) return res.json({ success: true, post: fb });
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      res.json({ success: true, post });
    } catch (error) {
      console.error('[Blog getPostBySlug error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to retrieve article', error: error.message });
    }
  },

  // GET /api/blog/admin (Admin list)
  getAdminPosts: async (req, res) => {
    try {
      await ensureSeedData();
      const { search, category, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { author: regex }, { category: regex }, { excerpt: regex }];
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

  // POST /api/blog (Admin: Create post)
  createPost: async (req, res) => {
    try {
      const { title, slug, author, category, image, content, excerpt, readTime, status, isFeaturedOnHome } = req.body;
      if (!title || !content || !image) {
        return res.status(400).json({ success: false, message: 'Title, Image, and Content are required.' });
      }

      const postSlug = slug ? generateSlug(slug) : generateSlug(title);

      const newPost = new Blog({
        title: title.trim(),
        slug: postSlug,
        author: author || 'Lavéra Editorial',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: category || 'Fashion',
        image: image.trim(),
        content: content.trim(),
        excerpt: excerpt ? excerpt.trim() : content.substring(0, 150) + '...',
        readTime: readTime || '4 min read',
        status: status || 'Published',
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
      const updateData = { ...req.body };
      if (updateData.title && !updateData.slug) {
        updateData.slug = generateSlug(updateData.title);
      }

      const updated = await Blog.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
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

  // PATCH /api/blog/:id/status (Admin: Toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Blog.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Article not found' });
      post.status = post.status === 'Published' ? 'Draft' : 'Published';
      await post.save();
      res.json({ success: true, message: `Article status changed to ${post.status}`, status: post.status, post });
    } catch (error) {
      console.error('[Blog toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  }
};

module.exports = blogController;
